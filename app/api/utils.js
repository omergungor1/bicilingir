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
  
  // Cookie header'ı parse et ve debug için yazdır
  const cookieHeader = request.headers.get('cookie');
  console.log('Raw Cookie Header:', cookieHeader);
  
  // Cookie parselamayı manuel yap
  const cookieMap = {};
  if (cookieHeader) {
    cookieHeader.split(';').forEach(cookie => {
      const parts = cookie.split('=');
      if (parts.length >= 2) {
        const name = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        cookieMap[name] = value;
      }
    });
  }

  // Supabase URL'sini al ve proje referansını çıkar
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const projectRef = extractProjectRef(supabaseUrl);
  console.log('Supabase Project Ref:', projectRef);
  
  // Olası Supabase cookie isimlerini kontrol et
  // Supabase farklı formatlarda cookie isimleri kullanabilir:
  // 1. sb-{projectRef}-auth-token
  // 2. sb-access-token ve sb-refresh-token
  // 3. supabase-auth-token
  
  const possibleCookieNames = [
    'sb-access-token',
    'sb-refresh-token',
    `sb-${projectRef}-access-token`,
    `sb-${projectRef}-refresh-token`,
    'supabase-auth-token'
  ];
  
  console.log('Cookie Durumu:');
  possibleCookieNames.forEach(name => {
    console.log(`${name}: ${cookieMap[name] ? 'VAR' : 'YOK'}`);
  });
  
  // Supabase istemcisi oluştur
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  console.log('Supabase URL:', supabaseUrl);
  console.log('Supabase key başlangıcı:', supabaseKey?.substring(0, 5) + '...');
  
  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get(name) {
          const cookie = request.cookies.get(name)?.value;
          console.log(`Getting cookie: ${name} = ${cookie ? 'exists' : 'undefined'}`);
          return cookie;
        },
        set(name, value, options) {
          console.log(`Setting cookie: ${name}`);
          response.cookies.set({
            name,
            value,
            ...options
          });
        },
        remove(name, options) {
          console.log(`Removing cookie: ${name}`);
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
 * @returns {Promise<String|null>} Çilingir id'si veya null
 */
export async function getLocksmithIdFromSession(supabase, session) {
  try {
    if (!session || !session.user) return null;
    
    // Veritabanından id al
    const { data: idData, error: idError } = await supabase
      .from('locksmiths')
      .select('id')
      .eq('authId', session.user.id)
      .single();
    
    if (idError || !idData) return null;
    
    return idData.id;
  } catch (error) {
    console.error("Çilingir id alınamadı:", error); 
    return null;
  }
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
  
  // Request headers'daki cookie'leri kontrol et
  const cookieHeader = request.headers.get('cookie');
  console.log('Cookie Header:', cookieHeader);
  
  try {
    // Oturum kontrolü
    const { data } = await supabase.auth.getSession();
    console.log('Auth Session Data:', JSON.stringify(data, null, 2));

    const session = data?.session;
    
    if (!session || !session.user) {
      console.log('Oturum bulunamadı veya geçersiz');
      return {
        error: NextResponse.json({ error: 'Oturum açmalısınız' }, { status: 401 }),
        user: null,
        userRole: null,
        supabase,
        response
      };
    }
    
    console.log('Kullanıcı ID:', session.user.id);
    console.log('Kullanıcı Email:', session.user.email);
    
    // Kullanıcı rolünü kontrol et
    const userRole = await getUserRoleFromSession(supabase, session);
    console.log('Kullanıcı Rolü:', userRole);
    
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
    console.error('checkApiAuth hatası:', error);
    return {
      error: NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 }),
      user: null,
      userRole: null,
      supabase,
      response
    };
  }
} 