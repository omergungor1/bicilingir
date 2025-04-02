import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**
 * Supabase URL'inden proje referansını çıkarır
 * @param {string} url - Supabase URL'i (ör: https://xxxx.supabase.co)
 * @returns {string} Proje referansı
 */
function extractProjectRef(url) {
  if (!url) return '';
  // URL formatı genelde: https://xxxx.supabase.co veya https://xxxx.supabase.co/
  try {
    const hostname = new URL(url).hostname;
    const parts = hostname.split('.');
    return parts[0] || '';
  } catch (e) {
    console.error("Supabase URL parse hatası:", e);
    // Basit bir alternatif, sadece güvenlik için
    const match = url.match(/https:\/\/([^.]+)/);
    return match ? match[1] : '';
  }
}

/**
 * API route'lar için basit Supabase istemcisi oluşturur
 * @param {Request} request - Next.js request nesnesi
 * @returns {Object} Supabase istemcisi ve response
 */
export function createRouteClient(request) {
  let response = NextResponse.next();
  
  // Supabase istemcisi oluştur
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          response.cookies.set({
            name,
            value,
            ...options
          });
        },
        remove(name, options) {
          response.cookies.set({
            name,
            value: '',
            ...options,
            maxAge: 0
          });
        }
      },
    }
  );
  
  return { supabase, response };
}

/**
 * Session'dan kullanıcı rolünü alır
 * @param {Object} supabase - Supabase istemcisi
 * @param {Object} session - Kullanıcı session bilgisi
 * @returns {Promise<String|null>} Kullanıcı rolü veya null
 */
export async function getUserRoleFromSession(supabase, session) {
  try {
    if (!session || !session.user) return null;
    
    // Veritabanından rol bilgisini al
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .single();
    
    if (roleError || !roleData) return null;
    
    return roleData.role;
  } catch (error) {
    console.error("Rol bilgisi alınamadı:", error);
    return null;
  }
}

/**
 * API route'lar için basit yetki kontrolü yapar
 * @param {Request} request - Next.js request nesnesi
 * @param {Array} allowedRoles - İzin verilen roller dizisi
 * @returns {Promise<{error: Object|null, user: Object|null, userRole: string|null, supabase: Object}>}
 */
export async function checkApiAuth(request, allowedRoles = ['admin', 'cilingir']) {
  const { supabase, response } = createRouteClient(request);
  
  try {
    // Oturum kontrolü
    const { data } = await supabase.auth.getSession();
    const session = data?.session;
    
    if (!session || !session.user) {
      return {
        error: NextResponse.json({ error: 'Oturum açmalısınız' }, { status: 401 }),
        user: null,
        userRole: null,
        supabase,
        response
      };
    }
    
    // Kullanıcı rolünü kontrol et
    const userRole = await getUserRoleFromSession(supabase, session);
    
    // Rol kontrolü
    if (!userRole || !allowedRoles.includes(userRole)) {
      return {
        error: NextResponse.json({ error: 'Yetkiniz yok' }, { status: 403 }),
        user: session.user,
        userRole,
        supabase,
        response
      };
    }
    
    return {
      error: null,
      user: session.user,
      userRole,
      supabase,
      response
    };
  } catch (error) {
    return {
      error: NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 }),
      user: null,
      userRole: null,
      supabase,
      response
    };
  }
} 