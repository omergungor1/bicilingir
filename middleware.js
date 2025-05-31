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
  // CORS Headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // OPTIONS isteklerini yanıtla
  if (req.method === 'OPTIONS') {
    return NextResponse.json({}, { headers });
  }

  const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
  const userAgent = req.headers.get('user-agent') || '';
  const pathname = req.nextUrl.pathname;

  // Arama motoru botlarını doğrudan geçir
  if (isSearchBot(userAgent)) {
    return NextResponse.next();
  }

  // API istekleri için daha sıkı limitler uygula
  if (pathname.startsWith('/api/')) {
    // Genel API limiti (dakikada 100 istek)
    const { limited, remaining } = checkIPRateLimit(ip, 100, 60 * 1000, userAgent);

    if (limited) {
      return NextResponse.json(
        { error: 'Çok fazla istek gönderdiniz. Lütfen daha sonra tekrar deneyin.' },
        {
          status: 429,
          headers: {
            ...headers,
            'Retry-After': '60',
            'X-RateLimit-Limit': '100',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': Math.ceil(Date.now() / 1000) + 60
          }
        }
      );
    }

    // API Yetkilendirme Kontrolü - Bearer Token
    if (pathname.startsWith('/api/locksmith/')) {
      const authHeader = req.headers.get('authorization');

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Yetkilendirme başlığı bulunamadı' }, {
          status: 401,
          headers
        });
      }

      const token = authHeader.split(' ')[1];

      try {
        // Supabase istemcisi oluştur
        const res = NextResponse.next();
        const supabase = createMiddlewareClient({
          req,
          res
        });

        // Token ile kullanıcı bilgisini al
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
          console.error('Token doğrulama hatası:', error?.message);
          return NextResponse.json({ error: 'Geçersiz token' }, {
            status: 401,
            headers
          });
        }

        // Token geçerliyse isteği devam ettir
        return res;
      } catch (error) {
        console.error('Middleware token kontrolü hatası:', error);
        return NextResponse.json({ error: 'Token doğrulama hatası' }, {
          status: 401,
          headers
        });
      }
    }

    // Admin API'leri için kontrol
    if (pathname.startsWith('/api/admin/')) {
      // Admin API kontrollerini burada yapabilirsiniz
      // Benzer şekilde Bearer token kontrolü eklenebilir
    }

    // Public API'ler için rate limit
    const publicLimit = checkIPRateLimit(ip + '-public', 50, 60 * 1000 * 2, userAgent);
    if (publicLimit.limited) {
      return NextResponse.json(
        { error: 'Public API istek limiti aşıldı. Lütfen daha sonra tekrar deneyin.' },
        {
          status: 429,
          headers
        }
      );
    }
  }

  // Web sayfaları için cookie bazlı auth kontrolü
  if (!pathname.startsWith('/api/')) {
    try {
      const res = NextResponse.next();
      const supabase = createMiddlewareClient({ req, res });
      const { data: { session } } = await supabase.auth.getSession();

      // Login sayfasına erişim kontrolü - session varsa yönlendir
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

      // Korumalı sayfalara erişim kontrolü
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
      console.error('Web auth hatası:', error);
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

// Tek bir config tanımı
export const config = {
  matcher: [
    // Admin ve çilingir sayfaları için matcher
    '/admin/:path*',
    '/cilingir/:path*',
    // API route'ları için matcher
    '/api/locksmith/:path*',
    '/api/admin/:path*',
    // Diğer tüm API'ler için
    '/api/:path*'
  ],
} 