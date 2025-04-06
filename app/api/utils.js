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
  
  // Her zaman daha detaylı debug bilgisi için
  console.log('Request method:', request.method);
  console.log('Request URL:', request.url);
  
  // Supabase URL'sini al ve proje referansını çıkar
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const projectRef = extractProjectRef(supabaseUrl);
  console.log('Supabase Project Ref:', projectRef);
  
  // Supabase token cookie adını oluştur
  const authTokenCookieName = `sb-${projectRef}-auth-token`;
  
  // Cookie parselamayı manuel yap - daha güvenilir yöntem
  let authTokenValue = null;
  
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').map(c => c.trim());
    for (const cookie of cookies) {
      if (cookie.startsWith(`${authTokenCookieName}=`)) {
        authTokenValue = cookie.substring(authTokenCookieName.length + 1);
        break;
      }
    }
  }
  
  console.log(`${authTokenCookieName} cookie bulundu:`, !!authTokenValue);
  
  if (authTokenValue) {
    try {
      // Cookie URL-encoded olduğu için decode et
      const decodedValue = decodeURIComponent(authTokenValue);
      console.log('Cookie decode edildi, token formatı kontrol ediliyor...');
      
      // Token formatını kontrol et ([accessToken, refreshToken] dizisi olmalı)
      if (decodedValue.startsWith('[') && decodedValue.endsWith(']')) {
        // Daha güvenilir şekilde parse et
        const tokenArray = JSON.parse(decodedValue);
        console.log('Token dizisi başarıyla parse edildi:', 
          tokenArray.length >= 2 ? 'Geçerli format' : 'Geçersiz format');
      } else {
        console.log('Token formatı dizi formatında değil');
      }
    } catch (e) {
      console.error('Cookie decode/parse hatası:', e.message);
    }
  }
  
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
          console.log(`Cookie isteniyor: ${name}`);
          
          // Supabase auth token cookie'sini manuel kontrol et
          if (name === authTokenCookieName && authTokenValue) {
            console.log('Auth token cookie sağlanıyor');
            return authTokenValue;
          }
          
          // Diğer cookie'ler için normal yöntemi kullan
          const cookie = request.cookies.get(name)?.value;
          return cookie;
        },
        set(name, value, options) {
          console.log(`Cookie ayarlanıyor: ${name}`);
          response.cookies.set({
            name,
            value,
            ...options
          });
        },
        remove(name, options) {
          console.log(`Cookie siliniyor: ${name}`);
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
  // 1. Supabase istemcisi oluştur
  const { supabase, response } = createRouteClient(request);
  
  // 2. Debug için request headers'ı kontrol et
  const cookieHeader = request.headers.get('cookie');
  console.log('API Auth - Cookie Header:', cookieHeader ? 'Mevcut' : 'Yok');
  
  try {
    // 3. Oturum kontrolü
    console.log('API Auth - Oturum kontrolü yapılıyor...');
    const { data } = await supabase.auth.getSession();
    
    // 4. Session kontrol
    const session = data?.session;
    console.log('API Auth - Session:', session ? 'Bulundu' : 'Bulunamadı');
    
    if (!session || !session.user) {
      console.log('API Auth - Oturum bulunamadı veya geçersiz');
      return {
        error: NextResponse.json({ error: 'Oturum açmalısınız' }, { status: 401 }),
        user: null,
        userRole: null,
        supabase,
        response
      };
    }
    
    // 5. Kullanıcı bilgisi log
    console.log('API Auth - Kullanıcı ID:', session.user.id);
    console.log('API Auth - Kullanıcı Email:', session.user.email);
    
    // 6. Kullanıcı rolünü kontrol et
    console.log('API Auth - Kullanıcı rolü kontrol ediliyor...');
    const userRole = await getUserRoleFromSession(supabase, session);
    console.log('API Auth - Kullanıcı Rolü:', userRole || 'Bulunamadı');
    
    // 7. Rol yetkisi kontrolü
    if (!userRole) {
      console.log('API Auth - Kullanıcı rolü bulunamadı');
      return {
        error: NextResponse.json({ error: 'Kullanıcı rolü bulunamadı' }, { status: 403 }),
        user: session.user,
        userRole: null,
        supabase,
        response
      };
    }
    
    if (!allowedRoles.includes(userRole)) {
      console.log(`API Auth - '${userRole}' rolü erişim için yetkili değil. İzin verilen roller: ${allowedRoles.join(', ')}`);
      return {
        error: NextResponse.json({ error: 'Bu API için yetkiniz yok' }, { status: 403 }),
        user: session.user,
        userRole,
        supabase,
        response
      };
    }
    
    // 8. Başarılı kimlik doğrulama
    console.log('API Auth - Kimlik doğrulama başarılı');
    return {
      error: null,
      user: session.user,
      userRole,
      supabase,
      response
    };
  } catch (error) {
    // 9. Hata durumu log
    console.error('API Auth - Hata:', error.message);
    return {
      error: NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 }),
      user: null,
      userRole: null,
      supabase,
      response
    };
  }
} 



export async function checkAuth(request) {
  try {
      // Request headers'ını ve cookie'yi detaylı inceleyelim
      const cookieHeader = request.headers.get('cookie');
  
      // Özellikle supabase auth token cookie'sini izole edelim
      const supabaseCookieMatch = cookieHeader && cookieHeader.match(/sb-\w+-auth-token=([^;]+)/);
      const supabaseCookieValue = supabaseCookieMatch ? supabaseCookieMatch[1] : null;
      
      
      let parsedCookieValue = null;
      try {
          // Cookie URL-encoded olduğu için decode edilmeli
          const decodedCookie = supabaseCookieValue ? decodeURIComponent(supabaseCookieValue) : null;
  
          // JSON formatında mı kontrol et
          if (decodedCookie && decodedCookie.startsWith('[') && decodedCookie.endsWith(']')) {
          parsedCookieValue = JSON.parse(decodedCookie);
          }
      } catch (e) {
          console.error('Cookie parse hatası:', e);
      }
      
      // Özel bir supabase istemcisi oluşturalım
      let response = NextResponse.next();
      const supabase = createServerClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          {
          cookies: {
              get(name) {
              // Eğer supabase auth token isteniyorsa ve parse ettiğimiz değer varsa
              if (name.includes('auth-token') && parsedCookieValue) {
                  return JSON.stringify(parsedCookieValue);
              }
              
              // Diğer durumlar için normal cookie'yi al
              const cookie = request.cookies.get(name)?.value;
              return cookie;
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
      
      // Manuel olarak getSession() fonksiyonunu çağırmadan önce token'ları ayarlayalım
      if (parsedCookieValue && Array.isArray(parsedCookieValue) && parsedCookieValue.length >= 2) {
          const accessToken = parsedCookieValue[0];
          const refreshToken = parsedCookieValue[1];
          
          
          // Session'ı manuel olarak ayarla
          const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
          });
          
          if (error) {
          console.error('Manuel session ayarlama hatası:', error.message);
          }
      }
      
      // Şimdi session'ı al
      const { data: authData } = await supabase.auth.getSession();
      
      const session = authData?.session;
      
      // Kullanıcı ID'sini al
      const userId = session.user.id;
      
  
      // // Kullanıcı rolünü kontrol et
      // const { data: roleData, error: roleError } = await supabase
      //     .from('user_roles')
      //     .select('role')
      //     .eq('user_id', userId)
      //     .single();
      
      // if (roleError) {
      //     return NextResponse.json({ error: 'Rol bilgisi alınamadı' }, { status: 500 });
      // }
      
      // if (!roleData) {
      //     return NextResponse.json({ error: 'Rol kaydınız bulunamadı' }, { status: 403 });
      // }
      
      // const userRole = roleData.role;
      
      // if (userRole !== 'cilingir' && userRole !== 'admin') {
      //     return NextResponse.json({ error: 'Bu API sadece çilingirler tarafından kullanılabilir' }, { status: 403 });
      // }
  
      // Çilingir ID'sini al
      const { data: locksmithData, error: locksmithError } = await supabase
          .from('locksmiths')
          .select('id')
          .eq('authid', userId)
          .single();
          
      if (locksmithError) {
          console.error('Çilingir ID alınamadı:', locksmithError);
          return NextResponse.json({ error: 'Çilingir bilgileriniz bulunamadı' }, { status: 404 });
      }
          
      const locksmithId = locksmithData?.id||null;
  
      return { locksmithId, supabase };
  } catch (error) {
    console.error('Çilingir ID alınamadı:', error);
    return NextResponse.json({ error: 'Çilingir bilgileriniz bulunamadı' }, { status: 404 });
  }
  }
  