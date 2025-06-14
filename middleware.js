import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

// IP adreslerine göre istekleri izleyecek obje
const ipRateLimitStore = new Map();
// Token'lara göre istekleri izleyecek obje
const tokenRateLimitStore = new Map();

// Arama motoru botlarını tanımlayan fonksiyon
function isSearchBot(userAgent) {
  if (!userAgent) return false;

  // Bilinen arama motoru bot user-agent dizileri
  const botPatterns = [
    /googlebot/i,
    /bingbot/i,
    /yandexbot/i,
    /duckduckbot/i,
    /baiduspider/i,
    /yahoo.*slurp/i,
    /facebookexternalhit/i,
    /twitterbot/i,
    /rogerbot/i,
    /msnbot/i,
    /applebot/i
  ];

  return botPatterns.some(pattern => pattern.test(userAgent));
}

// IP bazlı rate limiting fonksiyonu
function checkIPRateLimit(ip, limit = 100, windowMs = 60 * 1000, userAgent = '') {
  //Bunu daha sonra kaldır
  return { limited: false, remaining: limit };

  // Arama motoru botlarını limit dışı tut
  if (isSearchBot(userAgent)) {
    return { limited: false, remaining: limit };
  }

  const now = Date.now();
  const windowStart = now - windowMs;

  // IP için kayıt yoksa yeni oluştur
  if (!ipRateLimitStore.has(ip)) {
    ipRateLimitStore.set(ip, [now]);
    return { limited: false, remaining: limit - 1 };
  }

  // IP için mevcut istekleri al ve windowMs içindeki istekleri filtrele
  const requests = ipRateLimitStore.get(ip).filter(time => time > windowStart);

  // Yeni isteği ekle
  requests.push(now);
  ipRateLimitStore.set(ip, requests);

  // Limit kontrol
  return {
    limited: requests.length > limit,
    remaining: Math.max(0, limit - requests.length)
  };
}

// Token bazlı rate limiting fonksiyonu (API anahtarları, oturum, vb için)
function checkTokenRateLimit(token, limit = 50, windowMs = 60 * 1000, userAgent = '') {
  // Arama motoru botlarını limit dışı tut
  if (isSearchBot(userAgent)) {
    return { limited: false, remaining: limit };
  }

  if (!token) return { limited: false, remaining: limit }; // Token yoksa limit uygulanmaz

  const now = Date.now();
  const windowStart = now - windowMs;

  if (!tokenRateLimitStore.has(token)) {
    tokenRateLimitStore.set(token, [now]);
    return { limited: false, remaining: limit - 1 };
  }

  const requests = tokenRateLimitStore.get(token).filter(time => time > windowStart);
  requests.push(now);
  tokenRateLimitStore.set(token, requests);

  return {
    limited: requests.length > limit,
    remaining: Math.max(0, limit - requests.length)
  };
}

// Düzenli aralıklarla eski girdileri temizle (bellek sızıntısını önlemek için)
setInterval(() => {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 dakika
  const windowStart = now - windowMs;

  // IP store temizliği
  for (const [ip, requests] of ipRateLimitStore.entries()) {
    const filteredRequests = requests.filter(time => time > windowStart);
    if (filteredRequests.length === 0) {
      ipRateLimitStore.delete(ip);
    } else {
      ipRateLimitStore.set(ip, filteredRequests);
    }
  }

  // Token store temizliği
  for (const [token, requests] of tokenRateLimitStore.entries()) {
    const filteredRequests = requests.filter(time => time > windowStart);
    if (filteredRequests.length === 0) {
      tokenRateLimitStore.delete(token);
    } else {
      tokenRateLimitStore.set(token, filteredRequests);
    }
  }
}, 5 * 60 * 1000); // Her 5 dakikada bir temizlik

export async function middleware(req) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Auth-Token, x-auth-token',
    'Access-Control-Allow-Credentials': 'true',
  };

  if (req.method === 'OPTIONS') {
    return NextResponse.json({}, { headers });
  }

  const pathname = req.nextUrl.pathname;

  // Şifre sıfırlama endpoint'i için auth kontrolü yapma
  if (pathname === '/api/locksmith/account/forgot-password' || pathname === '/api/locksmith/account/reset-password') {
    return NextResponse.next();
  }

  // API istekleri için yetkilendirme kontrolü
  if (pathname.startsWith('/api/locksmith/')) {
    const authHeader = req.headers.get('x-auth-token') ||
      req.headers.get('authorization') ||
      req.headers.get('Authorization') ||
      req.headers.get('token');

    if (!authHeader) {
      return NextResponse.json({ error: 'Yetkilendirme başlığı bulunamadı' }, {
        status: 401,
        headers
      });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

    try {
      const res = NextResponse.next();
      Object.entries(headers).forEach(([key, value]) => {
        res.headers.set(key, value);
      });

      const supabase = createMiddlewareClient({
        req,
        res
      });

      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (error || !user) {
        return NextResponse.json({ error: 'Geçersiz token' }, {
          status: 401,
          headers
        });
      }

      return res;
    } catch (error) {
      return NextResponse.json({ error: 'Token doğrulama hatası' }, {
        status: 401,
        headers
      });
    }
  }

  // Web sayfaları için cookie bazlı auth kontrolü
  if (!pathname.startsWith('/api/')) {
    try {
      const res = NextResponse.next();
      const supabase = createMiddlewareClient({ req, res });
      const { data: { session } } = await supabase.auth.getSession();

      if (session && (pathname === '/cilingir/auth/login' || pathname.startsWith('/cilingir/auth/login'))) {
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();

        const userRole = roleData?.role;

        if (userRole === 'admin') {
          return NextResponse.redirect(new URL('/admin', req.url));
        } else if (userRole === 'cilingir') {
          return NextResponse.redirect(new URL('/cilingir', req.url));
        }
      }

      if (!session) {
        if (pathname.startsWith('/admin')) {
          return NextResponse.redirect(new URL('/cilingir/auth/login', req.url));
        }
        if (pathname.startsWith('/cilingir') && !pathname.startsWith('/cilingir/auth')) {
          return NextResponse.redirect(new URL('/cilingir/auth/login', req.url));
        }
      } else {
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();

        const userRole = roleData?.role;

        if (pathname.startsWith('/admin') && userRole !== 'admin') {
          return NextResponse.redirect(new URL('/cilingir', req.url));
        }

        if (pathname.startsWith('/cilingir') &&
          !pathname.startsWith('/cilingir/auth') &&
          !(userRole === 'cilingir' || userRole === 'admin')) {
          return NextResponse.redirect(new URL('/', req.url));
        }
      }

      return res;
    } catch (error) {
      if (pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/cilingir/auth/login', req.url));
      }
      if (pathname.startsWith('/cilingir') && !pathname.startsWith('/cilingir/auth')) {
        return NextResponse.redirect(new URL('/cilingir/auth/login', req.url));
      }
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/cilingir/:path*',
    '/api/locksmith/:path*',
    '/api/admin/:path*',
    '/api/:path*'
  ],
} 