import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const res = NextResponse.next();
  
  // Supabase istemcisi oluştur
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) => {
          res.cookies.set({ name, value, ...options });
        },
        remove: (name, options) => {
          res.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Auth durumunu kontrol et
  const { data: { session } } = await supabase.auth.getSession();

  // Admin panel sayfalarına erişim kontrolü
  if (req.nextUrl.pathname.startsWith('/admin')) {
    // Oturum yoksa giriş sayfasına yönlendir
    // if (!session) {
    //   const redirectUrl = new URL('/cilingir/auth/login', req.url);
    //   redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname);
    //   return NextResponse.redirect(redirectUrl);
    // }

    // Admin rolü kontrolü (gelecekte eklenebilir)
    // const { data: { user } } = await supabase.auth.getUser();
    // if (user?.role !== 'admin') {
    //   return NextResponse.redirect(new URL('/', req.url));
    // }
  }

  // Çilingir sayfalarına erişim kontrolü
  if (req.nextUrl.pathname.startsWith('/cilingir/profil')) {
    if (!session) {
      const redirectUrl = new URL('/cilingir/auth/login', req.url);
      redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return res;
}

// Middleware'in çalışacağı path'ler
export const config = {
  matcher: ['/admin/:path*', '/cilingir/profil/:path*'],
}; 