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
 * API route içinde Supabase istemcisi oluşturur
 * @param {Request} request - Next.js route istek nesnesi
 * @returns {Object} Supabase istemci nesnesi
 */
export function createRouteClient(request) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (name) => {
          const headers = new Headers(request.headers);
          const cookie = headers.get('cookie');
          if (!cookie) return undefined;
          
          const match = cookie.match(new RegExp(`(^|;\\s*)${name}=([^;]*)`));
          return match ? decodeURIComponent(match[2]) : undefined;
        },
        getAll: () => {
          const cookieHeader = request.headers.get('cookie');
          if (!cookieHeader) return [];
          
          const cookies = {};
          const parts = cookieHeader.split(';');
          
          for (const part of parts) {
            const [key, ...valueArr] = part.trim().split('=');
            if (key) {
              const value = valueArr.join('=');
              cookies[key] = decodeURIComponent(value);
            }
          }
          
          return Object.entries(cookies).map(([name, value]) => ({ 
            name, 
            value 
          }));
        },
        set: () => {}, // Boş fonksiyon - response döndürmüyoruz
        remove: () => {}, // Boş fonksiyon - response döndürmüyoruz
      },
    }
  );
  
  return { supabase };
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
  // console.log('API Auth - Cookie Header:', cookieHeader ? 'Mevcut' : 'Yok');
  
  try {
    // 3. Oturum kontrolü
    // console.log('API Auth - Oturum kontrolü yapılıyor...');
    const { data } = await supabase.auth.getSession();
    
    // 4. Session kontrol
    const session = data?.session;
    // console.log('API Auth - Session:', session ? 'Bulundu' : 'Bulunamadı');
    
    if (!session || !session.user) {
      // console.log('API Auth - Oturum bulunamadı veya geçersiz');
      return {
        error: NextResponse.json({ error: 'Oturum açmalısınız' }, { status: 401 }),
        user: null,
        userRole: null,
        supabase,
        response
      };
    }
    
    // 5. Kullanıcı bilgisi log
    // console.log('API Auth - Kullanıcı ID:', session.user.id);
    // console.log('API Auth - Kullanıcı Email:', session.user.email);
    
    // 6. Kullanıcı rolünü kontrol et
    // console.log('API Auth - Kullanıcı rolü kontrol ediliyor...');
    const userRole = await getUserRoleFromSession(supabase, session);
    // console.log('API Auth - Kullanıcı Rolü:', userRole || 'Bulunamadı');
    
    // 7. Rol yetkisi kontrolü
    if (!userRole) {
      // console.log('API Auth - Kullanıcı rolü bulunamadı');
      return {
        error: NextResponse.json({ error: 'Kullanıcı rolü bulunamadı' }, { status: 403 }),
        user: session.user,
        userRole: null,
        supabase,
        response
      };
    }
    
    if (!allowedRoles.includes(userRole)) {
      // console.log(`API Auth - '${userRole}' rolü erişim için yetkili değil. İzin verilen roller: ${allowedRoles.join(', ')}`);
      return {
        error: NextResponse.json({ error: 'Bu API için yetkiniz yok' }, { status: 403 }),
        user: session.user,
        userRole,
        supabase,
        response
      };
    }
    
    // 8. Başarılı kimlik doğrulama
    // console.log('API Auth - Kimlik doğrulama başarılı');
    return {
      error: null,
      user: session.user,
      userRole,
      supabase,
      response
    };
  } catch (error) {
    // 9. Hata durumu log
    // console.error('API Auth - Hata:', error.message);
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
  
/**
 * Veritabanında kullanıcı oluşturur veya günceller
 * @param {Object} supabase - Supabase istemcisi
 * @param {string} userId - Kullanıcı ID (varsa)
 * @param {string} sessionId - Oturum ID
 * @param {string} userIp - Kullanıcı IP adresi
 * @param {string} userAgent - Kullanıcı tarayıcı bilgisi
 * @returns {Promise<{userId: string, isNewUser: boolean}>} Kullanıcı bilgisi
 */
export async function createOrUpdateUser(supabase, userId, sessionId, userIp, userAgent) {
  try {
    let newUserId = userId;
    let isNewUser = false;
    
    // Eğer mevcut bir userId varsa, kullanıcıyı güncelle
    if (userId) {
      const updateData = {
        userip: userIp,
        updatedat: new Date().toISOString()
      };
      
      if (userAgent) {
        updateData.useragent = userAgent;
      }
      
      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', userId)
        .select();
        
      if (error) {
        // Eğer kullanıcı bulunamazsa, yeni kullanıcı oluşturacağız
        if (error.code === 'PGRST116') {
          newUserId = null;
        } else {
          throw error;
        }
      }
    }
    
    // Eğer userId yoksa veya bulunamadıysa, yeni bir kullanıcı oluştur
    if (!newUserId) {
      const { v4: uuidv4 } = await import('uuid');
      
      const insertData = {
        id: uuidv4(),
        // sessionid: sessionId,
        userip: userIp,
        createdat: new Date().toISOString(),
        updatedat: new Date().toISOString()
      };
      
      if (userAgent) {
        insertData.useragent = userAgent;
      }
      
      const { data, error } = await supabase
        .from('users')
        .insert(insertData)
        .select();
        
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        newUserId = data[0].id;
        isNewUser = true;
      }
    }
    
    return { userId: newUserId, isNewUser };
  } catch (error) {
    console.error('Kullanıcı oluşturma/güncelleme hatası:', error);
    throw error;
  }
}

/**
 * Kullanıcı aktivitesini kaydeder
 * @param {Object} supabase - Supabase istemcisi
 * @param {string} userId - Kullanıcı ID
 * @param {string} sessionId - Oturum ID
 * @param {string} action - Aktivite tipi (enum: search, locksmith_list_view, locksmith_detail_view, call_request, review_submit, profile_visit, whatsapp_message, website_visit)
 * @param {string} details - Aktivite detayları
 * @param {string} entityId - İlgili varlık ID'si
 * @param {string} entityType - İlgili varlık tipi
 * @param {Object} additionalData - Ek veri (searchProvinceId, searchDistrictId, searchServiceId, locksmithId, reviewid)
 * @param {number} level - Sıralama seviyesi (özellikle locksmith_list_view için, varsayılan: 1)
 * @returns {Promise<string>} Aktivite ID'si
 */
export async function logUserActivity(supabase, userId, sessionId, action, details, entityId, entityType, additionalData = {}, level = 1) {
  try {
    const { v4: uuidv4 } = await import('uuid');
    
    /**
    'search',
    'locksmith_list_view',
    'locksmith_detail_view',
    'call_request',
    'review_submit',
    'whatsapp_message',
    'website_visit',
     */
    
    // User-Agent bilgisini al ve cihaz tipini belirle
    const userAgent = additionalData.userAgent || '';
    const deviceType = userAgent.includes('Mobile') ? 'mobile' : 'desktop';
    
    // Action tipine göre level ayarı
    let finalLevel = level;
    
    // call_request ve locksmith_detail_view için her zaman level 1 kullan
    if (action === 'call_request' || action === 'locksmith_detail_view') {
      finalLevel = 1;
      // console.log(`${action} için level zorla 1 olarak ayarlandı`);
    }
    
    // Key usage bilgisini al
    const { data: keyUsageData, error: keyUsageError } = await supabase
      .from('key_usage_types')
      .select('id, keyamount')
      .eq('name', action)
      .eq('level', finalLevel)
      .limit(1);
      
    if (keyUsageError) {
      console.error('Key usage bilgisi alınamadı:', keyUsageError);
    }
    
    let keyAmount = 0;
    let usageTypeId = null;
    
    if (keyUsageData && keyUsageData.length > 0) {
      keyAmount = keyUsageData[0].keyamount;
      usageTypeId = keyUsageData[0].id;
      // console.log(`Key usage bilgisi alındı: ${action} (level: ${finalLevel}) - ${keyAmount} anahtar`);
    } else {
      // console.warn(`Key usage bilgisi bulunamadı: ${action} (level: ${finalLevel}). Varsayılan değer kullanılıyor.`);
      // Varsayılan değer olarak 0 anahtar kullan
      keyAmount = 0;
    }
    
    const insertData = {
      // id: uuidv4(),
      userid: userId,
      activitytype: action,
      devicetype: deviceType,
      keyamount: keyAmount,
      createdat: new Date().toISOString()
    };
    
    // UsageTypeId varsa ekle
    if (usageTypeId) {
      insertData.usagetypeid = usageTypeId;
    }
    
    // SessionId varsa ve UUID formatındaysa ekle
    if (sessionId) {
      try {
        // UUID formatını kontrol et (basit kontrol)
        const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (uuidPattern.test(sessionId)) {
          insertData.sessionid = sessionId;
        } else {
          // Geçerli bir UUID değilse, yeni bir UUID oluştur
          insertData.sessionid = uuidv4();
          // Metadata yoksa JSONB alan ekleyip düzenleyebiliriz
          // console.log('SessionId UUID formatında değil, yeni UUID oluşturuluyor');
        }
      } catch (e) {
        console.error('SessionId işleme hatası:', e);
      }
    }
    
    // Ek veri alanlarını ekle
    if (additionalData.searchProvinceId) insertData.searchprovinceid = additionalData.searchProvinceId;
    if (additionalData.searchDistrictId) insertData.searchdistrictid = additionalData.searchDistrictId;
    if (additionalData.searchServiceId) insertData.searchserviceid = additionalData.searchServiceId;

    // Çilingir ID'sini ekle - entityType locksmith ise veya additionalData.locksmithId varsa
    if (additionalData.locksmithId) {
      insertData.locksmithid = additionalData.locksmithId;
    } else if (entityType === 'locksmith' && entityId) {
      insertData.locksmithid = entityId;
    }

    if (additionalData.reviewId) insertData.reviewid = additionalData.reviewId;
    
    
    // console.log('Aktivite eklenecek:', insertData);
    
    const { data, error } = await supabase
      .from('user_activity_logs')
      .insert(insertData)
      .select();
      
    if (error) {
      console.error('Aktivite ekleme SQL hatası:', error);
      throw error;
    }
    
    let activityId = null;
    if (data && data.length > 0) {
      activityId = data[0].id;
    }
    
    return activityId;
  } catch (error) {
    console.error('Aktivite kaydetme hatası:', error);
    throw error;
  }
}
  