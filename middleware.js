import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  // Önce yeni bir response objesi oluştur
  const res = NextResponse.next();
  
  try {
    // Supabase istemcisi oluştur
    const supabase = createMiddlewareClient({ req, res });
    
    // Auth durumunu kontrol et
    const { data } = await supabase.auth.getSession();
    const session = data?.session;
    
    const pathname = req.nextUrl.pathname;
    
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
  ],
} 