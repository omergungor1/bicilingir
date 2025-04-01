import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**
 * API route'lar için Supabase istemcisi oluştururken kullanılacak getter fonksiyonu.
 * Sadece header ve cookie'leri kopyalayarak işlem yapar.
 * @param {Request} request - Next.js request nesnesi
 * @returns {Object} Supabase istemcisi
 */
export function createRouteClient(request) {
  const requestHeaders = new Headers(request.headers);
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return requestHeaders.get('Cookie')
            ?.split(';')
            ?.find(c => c.trim().startsWith(`${name}=`))
            ?.split('=')[1];
        },
      },
    }
  );
}

/**
 * Session'dan kullanıcı rolünü alır
 * @param {Object} supabase - Supabase istemcisi
 * @param {Object} session - Kullanıcı session bilgisi
 * @returns {Promise<String|null>} Kullanıcı rolü veya null
 */
export async function getUserRoleFromSession(supabase, session) {
  try {
    // Cache mekanizması için session'daki metadata'yı kontrol et
    // Supabase JWT token'ında rol bilgisi varsa direkt kullan
    if (session.user?.user_metadata?.role) {
      return session.user.user_metadata.role;
    }
    
    // Rol bilgisi token'da yoksa veritabanından al
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .single();
      
    if (roleError || !roleData) {
      console.error("Rol bilgisi alınamadı:", roleError);
      return null;
    }
    
    return roleData.role;
  } catch (error) {
    console.error("getUserRoleFromSession error:", error);
    return null;
  }
}

/**
 * API route'lar için yetki kontrolü yapar
 * @param {Request} request - Next.js request nesnesi
 * @param {Array} allowedRoles - İzin verilen roller dizisi
 * @returns {Promise<{error: Object|null, user: Object|null, session: Object|null, supabase: Object|null, userRole: string|null}>}
 */
export async function checkApiAuth(request, allowedRoles = ['admin', 'cilingir']) {
  const supabase = createRouteClient(request);
  
  try {
    // Oturum kontrolü
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session || !session.user) {
      return {
        error: NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 }),
        user: null,
        session: null,
        supabase: null,
        userRole: null
      };
    }
    
    // Kullanıcı rolünü kontrol et
    const userRole = await getUserRoleFromSession(supabase, session);
    
    // Rol kontrolü
    if (!userRole || !allowedRoles.includes(userRole)) {
      return {
        error: NextResponse.json({ error: 'Bu işlemi gerçekleştirme yetkiniz yok' }, { status: 403 }),
        user: session.user,
        session,
        supabase,
        userRole
      };
    }
    
    return {
      error: null,
      user: session.user,
      session,
      supabase,
      userRole
    };
  } catch (error) {
    console.error("API yetki kontrolü hatası:", error);
    return {
      error: NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 }),
      user: null,
      session: null,
      supabase: null,
      userRole: null
    };
  }
} 