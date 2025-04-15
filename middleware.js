import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

// IP adreslerine göre istekleri izleyecek obje
const ipRateLimitStore = new Map();
// Token'lara göre istekleri izleyecek obje
const tokenRateLimitStore = new Map();

// IP bazlı rate limiting fonksiyonu
function checkIPRateLimit(ip, limit = 100, windowMs = 60 * 1000) {
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
function checkTokenRateLimit(token, limit = 50, windowMs = 60 * 1000) {
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
  // Gerçek IP adresini alın (varsa proxy arkasından)
  const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
  const pathname = req.nextUrl.pathname;

  // API istekleri için daha sıkı limitler uygula
  if (pathname.startsWith('/api/')) {
    // Genel API limiti (dakikada 100 istek)
    const { limited, remaining } = checkIPRateLimit(ip, 100, 60 * 1000);

    if (limited) {
      return NextResponse.json(
        { error: 'Çok fazla istek gönderdiniz. Lütfen daha sonra tekrar deneyin.' },
        {
          status: 429,
          headers: {
            'Retry-After': '60',
            'X-RateLimit-Limit': '100',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': Math.ceil(Date.now() / 1000) + 60
          }
        }
      );
    }

    // Özel API limitleri
    // Admin API'leri için daha yüksek limitler
    if (pathname.startsWith('/api/admin/')) {
      const adminLimit = checkIPRateLimit(ip + '-admin', 200, 60 * 1000);
      if (adminLimit.limited) {
        return NextResponse.json(
          { error: 'Admin API istek limiti aşıldı. Lütfen daha sonra tekrar deneyin.' },
          { status: 429 }
        );
      }
    }

    // Locksmith API'leri için normal limitler
    else if (pathname.startsWith('/api/locksmith/')) {
      const locksmithLimit = checkIPRateLimit(ip + '-locksmith', 150, 60 * 1000);
      if (locksmithLimit.limited) {
        return NextResponse.json(
          { error: 'Çilingir API istek limiti aşıldı. Lütfen daha sonra tekrar deneyin.' },
          { status: 429 }
        );
      }
    }

    // Diğer public API'ler için daha düşük limitler
    else {
      const publicLimit = checkIPRateLimit(ip + '-public', 50, 60 * 1000);
      if (publicLimit.limited) {
        return NextResponse.json(
          { error: 'Public API istek limiti aşıldı. Lütfen daha sonra tekrar deneyin.' },
          { status: 429 }
        );
      }
    }
  }

  // Normal sayfa istekleri için daha gevşek limitler (dakikada 200 istek)
  else {
    const { limited } = checkIPRateLimit(ip + '-pages', 200, 60 * 1000);
    if (limited) {
      return NextResponse.json(
        { error: 'Çok fazla istek gönderdiniz. Lütfen daha sonra tekrar deneyin.' },
        { status: 429 }
      );
    }
  }

  // Cookie header'ını kontrol et
  const cookieHeader = req.headers.get('cookie');

  // Önce yeni bir response objesi oluştur
  const res = NextResponse.next();

  try {
    // Supabase istemcisi oluştur
    const supabase = createMiddlewareClient({ req, res });

    // Auth durumunu kontrol et
    const { data } = await supabase.auth.getSession();

    const session = data?.session;

    // Session varsa token bazlı rate limiting uygula (kullanıcı bazlı)
    if (session) {
      const userId = session.user.id;
      const { limited } = checkTokenRateLimit(userId, 300, 60 * 1000); // Oturum açmış kullanıcılar için daha yüksek limit

      if (limited) {
        return NextResponse.json(
          { error: 'Kullanıcı bazlı istek limitiniz aşıldı. Lütfen daha sonra tekrar deneyin.' },
          { status: 429 }
        );
      }
    }

    // API Yetkilendirme Kontrolü
    if (pathname.startsWith('/api/locksmith/')) {

      // Oturum kontrolü
      if (!session) {
        return NextResponse.json({ error: 'Oturum açmalısınız' }, { status: 401 });
      }

      // Yetki doğrulamasını geçti, API'ye erişim izni ver

      // Cookie'leri yanıta ekle
      const newResponse = NextResponse.next();
      // Supabase cookie'lerini koru
      const supabaseCookies = res.cookies.getAll();
      for (const cookie of supabaseCookies) {
        newResponse.cookies.set(cookie.name, cookie.value, cookie);
      }

      return newResponse;
    }

    // API Yetkilendirme Kontrolü
    if (pathname.startsWith('/api/admin/')) {
      // Oturum kontrolü
      if (!session) {
        return NextResponse.json({ error: 'Oturum açmalısınız' }, { status: 401 });
      }

      // Kullanıcı rolünü kontrol et
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      if (roleError || !roleData) {
        return NextResponse.json({ error: 'Rol bilgisi alınamadı' }, { status: 500 });
      }

      const userRole = roleData.role;

      // Admin API'leri sadece admin rollerine açık
      if (userRole !== 'admin') {
        return NextResponse.json({ error: 'Bu API sadece adminler tarafından kullanılabilir' }, { status: 403 });
      }

      // Yetki doğrulamasını geçti, API'ye erişim izni ver
      return res;
    }

    // Login sayfasına erişim kontrolü - session varsa yönlendir
    if (session && (pathname === '/cilingir/auth/login' || pathname.startsWith('/cilingir/auth/login'))) {
      // Kullanıcının rolünü veritabanından al
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
      // Admin sayfalarına erişim kontrolü
      if (pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/cilingir/auth/login', req.url));
      }

      // Çilingir sayfalarına erişim kontrolü (login sayfası hariç)
      if (pathname.startsWith('/cilingir') && !pathname.startsWith('/cilingir/auth')) {
        return NextResponse.redirect(new URL('/cilingir/auth/login', req.url));
      }
    }
    else if (session) {
      // Kullanıcının rolünü veritabanından al
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      const userRole = roleData?.role;

      // Admin sayfalarına erişim kontrolü
      if (pathname.startsWith('/admin') && userRole !== 'admin') {
        return NextResponse.redirect(new URL('/cilingir', req.url));
      }

      // Çilingir sayfalarına erişim kontrolü (admin ve çilingir rolüne izin ver)
      if (pathname.startsWith('/cilingir') &&
        !pathname.startsWith('/cilingir/auth') &&
        !(userRole === 'cilingir' || userRole === 'admin')) {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    return res;
  } catch (error) {
    console.error("Middleware hatası:", error);

    // API hata durumları için
    if (req.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }

    // Hata durumunda güvenli yönlendirme
    const pathname = req.nextUrl.pathname;

    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/cilingir/auth/login', req.url));
    }

    if (pathname.startsWith('/cilingir') && !pathname.startsWith('/cilingir/auth')) {
      return NextResponse.redirect(new URL('/cilingir/auth/login', req.url));
    }

    return res;
  }
}

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