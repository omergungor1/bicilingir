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
    
    // API Yetkilendirme Kontrolü
    if (pathname.startsWith('/api/locksmith/')) {
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
      
      // Locksmith API'leri sadece çilingir ve admin rollerine açık
      if (userRole !== 'cilingir' && userRole !== 'admin') {
        return NextResponse.json({ error: 'Bu API sadece çilingirler tarafından kullanılabilir' }, { status: 403 });
      }
      
      // Yetki doğrulamasını geçti, API'ye erişim izni ver
      return res;
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
    '/api/admin/:path*'
  ],
} 