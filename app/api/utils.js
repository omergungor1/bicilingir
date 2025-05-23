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
        set: () => { }, // Boş fonksiyon - response döndürmüyoruz
        remove: () => { }, // Boş fonksiyon - response döndürmüyoruz
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

    const locksmithId = locksmithData?.id || null;

    return { locksmithId, supabase };
  } catch (error) {
    console.error('Çilingir ID alınamadı:', error);
    return NextResponse.json({ error: 'Çilingir bilgileriniz bulunamadı' }, { status: 404 });
  }
}



export async function checkAdminAuth(request) {
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


    // Kullanıcı rolünü kontrol et
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (roleError) {
      return NextResponse.json({ error: 'Rol bilgisi alınamadı' }, { status: 500 });
    }

    if (!roleData) {
      return NextResponse.json({ error: 'Rol kaydınız bulunamadı' }, { status: 403 });
    }

    const userRole = roleData.role;

    if (userRole !== 'admin') {
      return NextResponse.json({ error: 'Bu API sadece admin tarafından kullanılabilir' }, { status: 403 });
    }


    return { supabase };
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
 * @param {string} activitytype - Aktivite tipi (enum: search, locksmith_list_view, locksmith_detail_view, call_request, review_submit, profile_visit, whatsapp_message, website_visit)
 * @param {string} details - Aktivite detayları
 * @param {string} entityId - İlgili varlık ID'si
 * @param {string} entityType - İlgili varlık tipi
 * @param {Object} additionalData - Ek veri (searchProvinceId, searchDistrictId, searchServiceId, locksmithId, reviewid)
 * @param {number} level - Sıralama seviyesi (özellikle locksmith_list_view için, varsayılan: 1)
 * @returns {Promise<string>} Aktivite ID'si
 */
export async function logUserActivity(supabase, userId = '00000000-0000-0000-0000-000000000000', sessionId = '00000000-0000-0000-0000-000000000000', activitytype = 'search', details, entityId, entityType, additionalData = {}, level = 1) {
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

    // activitytype tipine göre level ayarı
    let finalLevel = 1;


    //18 mayıs 2025
    // // Key usage bilgisini al
    // const { data: keyUsageData, error: keyUsageError } = await supabase
    //   .from('key_usage_types')
    //   .select('id, keyamount')
    //   .eq('name', activitytype)
    //   .eq('level', finalLevel)
    //   .limit(1);

    // if (keyUsageError) {
    //   console.error('Key usage bilgisi alınamadı:', keyUsageError);
    // }


    //18 mayıs 2025
    // if (keyUsageData && keyUsageData.length > 0) {
    //   keyAmount = keyUsageData[0].keyamount;
    //   usageTypeId = keyUsageData[0].id;
    //   // console.log(`Key usage bilgisi alındı: ${activitytype} (level: ${finalLevel}) - ${keyAmount} anahtar`);
    // } else {
    //   // console.warn(`Key usage bilgisi bulunamadı: ${activitytype} (level: ${finalLevel}). Varsayılan değer kullanılıyor.`);
    //   // Varsayılan değer olarak 0 anahtar kullan
    //   keyAmount = 0;
    //   systemNote += '|Key usage bilgisi bulunamadı';
    // }

    //18 mayıs 2025
    // try {
    //   //count user_activity_logs with userId
    //   const { count: userActivityLogsCount, error: userActivityLogsError } = await supabase
    //     .from('user_activity_logs')
    //     .select('id', { count: 'exact', head: true })
    //     .eq('userid', userId)

    //   if (userActivityLogsError) {
    //     console.error('Kullanıcı aktivite kayıtları alınamadı:', userActivityLogsError);
    //   }


    //18 mayıs 2025
    //   if (userActivityLogsCount > 10 && userId) {
    //     //update users table issuspicious to true
    //     const { error: updateError } = await supabase
    //       .from('users')
    //       .update({ issuspicious: true })
    //       .eq('id', userId);

    //     if (updateError) {
    //       console.error('Kullanıcı güncellenemedi:', updateError);
    //     }

    //   }
    // } catch (error) {
    //   console.error('Kullanıcı aktivite kayıtları alınamadı:', error);
    // }

    // Kullanıcının varlığını kontrol et, yoksa yeni bir kullanıcı oluştur
    // Bu adım, users tablosu boşaltıldığında foreign key hatası almanın önüne geçecek
    if (userId) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .limit(1);

      if (userError) {
        console.error('Kullanıcı kontrolü sırasında hata:', userError);
      }
      // try {

      //   if (userData[0]?.islocksmith) {
      //     keyAmount = 0;
      //     systemNote += '|Çilingir kullanıcı';
      //   }

      //   if (userData[0]?.issuspicious) {
      //     keyAmount = 0;
      //     systemNote += '|Şüpheli kullanıcı';
      //   }

      // } catch (error) {
      //   console.error('Kullanıcı bilgisi alınamadı:', error);
      // }

      // Kullanıcı bulunamadıysa yeni bir kullanıcı oluştur
      if (!userData || userData.length === 0) {
        console.log(`Kullanıcı bulunamadı, yeni kullanıcı oluşturuluyor...`);
        const newUserData = {
          id: userId, // Mevcut ID'yi koruyoruz
          useragent: userAgent || 'Unknown',
          userip: '0.0.0.0', // Varsayılan IP
          createdat: new Date().toISOString(),
          updatedat: new Date().toISOString(),
          islocksmith: false
        };

        const { error: insertError } = await supabase
          .from('users')
          .insert(newUserData);

        if (insertError) {
          console.error('Kullanıcı oluşturma hatası:', insertError);
          // Eski kullanıcı ID'si çakışma yarattıysa, yeni bir ID oluştur
          if (insertError.code === '23505') { // Unique violation (çakışma)
            userId = uuidv4();
            newUserData.id = userId;

            const { error: retryError } = await supabase
              .from('users')
              .insert(newUserData);

            if (retryError) {
              console.error('Yeni ID ile kullanıcı oluşturma hatası:', retryError);
              // Bu noktada aktivite kaydı için geri dön
              return null;
            } else {
              console.log(`Yeni kullanıcı ID ile başarıyla oluşturuldu: ${userId}`);
            }
          } else {
            // Başka bir hata durumunda, aktivite kaydı için geri dön
            return null;
          }
        } else {
          console.log(`Kullanıcı başarıyla oluşturuldu: ${userId}`);
        }
      }
    } else {
      // userId yoksa yeni bir UUID oluştur
      userId = uuidv4();

      // Yeni kullanıcı ekle
      const newUserData = {
        id: userId,
        useragent: userAgent || 'Unknown',
        userip: '0.0.0.0', // Varsayılan IP
        createdat: new Date().toISOString(),
        updatedat: new Date().toISOString(),
        islocksmith: false
      };

      const { error: insertError } = await supabase
        .from('users')
        .insert(newUserData);

      if (insertError) {
        console.error('Yeni kullanıcı oluşturma hatası:', insertError);
        return null;
      }

    }

    //18 mayıs 2025
    // try {
    //   if (additionalData.locksmithId) {
    //     const { data: locksmithData, error: locksmithError } = await supabase
    //       .from('locksmiths')
    //       .select('provinceid')
    //       .eq('id', additionalData.locksmithId)
    //       .limit(1);

    //     if (locksmithError) {
    //       console.error('Çilingir bilgisi alınamadı:', locksmithError);
    //     }


    //     if (locksmithData && locksmithData.length > 0) {
    //       if (locksmithData[0].provinceid !== additionalData.searchProvinceId) {
    //         keyAmount = 0;
    //         systemNote += '|Çilingir bu ilde çalışmıyor';
    //       }
    //     }
    //   }
    // } catch (error) {
    //   console.error('Çilingir bilgisi alınamadı:', error);
    // }


    //18 mayıs 2025
    // try {
    //   if (additionalData.locksmithId && additionalData.searchServiceId) {
    //     const { data: locksmithData, error: locksmithError } = await supabase
    //       .from('locksmith_services')
    //       .select('serviceid')
    //       .eq('locksmithid', additionalData.locksmithId)
    //       .eq('serviceid', additionalData.searchServiceId)
    //       .eq('isactive', true)
    //       .limit(1);

    //     if (locksmithError) {
    //       console.error('Çilingir bilgisi alınamadı:', locksmithError);
    //     } else if (!locksmithData || locksmithData.length === 0) {
    //       keyAmount = 0;
    //       systemNote += '|Çilingir bu hizmeti vermiyor';
    //     }
    //   }

    // } catch (error) {
    //   console.error('Çilingir bilgisi alınamadı:', error);
    // }



    const insertData = {
      userid: userId,
      activitytype: activitytype,
      devicetype: deviceType,
      createdat: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    };


    //18 mayıs 2025
    // // UsageTypeId varsa ekle
    // if (usageTypeId) {
    //   insertData.usagetypeid = usageTypeId;
    // }

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


    console.log('Loglandı ****');

    const { data, error } = await supabase
      .from('user_activity_logs')
      .insert(insertData)
      .select();


    // Veritabaınına taşındı & trigger ile yapılacak -> 23 Mayıs 2025
    // if (additionalData.locksmithId && activitytype === 'call_request') {
    //   try {
    //     // 1. Adım: mevcut call_count değerini alıyoruz
    //     const { data: locksmithTrafficData, error: locksmithTrafficError } = await supabase
    //       .from('locksmith_traffic')
    //       .select('call_count,multiplier')
    //       .eq('locksmith_id', additionalData.locksmithId)
    //       .single();

    //     if (locksmithTrafficError) {
    //       console.error('Error fetching call_count:', locksmithTrafficError);
    //       return;
    //     }

    //     // 2. Adım: call_count'ı 1 artırıp, priority hesaplıyoruz
    //     const updatedCallCount = locksmithTrafficData.call_count + 1;
    //     const updatedPriority = locksmithTrafficData.multiplier / updatedCallCount;

    //     // 3. Adım: call_count ve priority'yi güncelliyoruz
    //     const { error: updateError } = await supabase
    //       .from('locksmith_traffic')
    //       .update({ call_count: updatedCallCount, priority: updatedPriority })
    //       .eq('locksmith_id', additionalData.locksmithId);

    //     if (updateError) {
    //       console.error('Error updating call_count and priority:', updateError);
    //     }

    //   } catch (error) {
    //     console.error('Locksmith traffic güncellenemedi:', error);
    //   }
    // } else if (additionalData.locksmithId && activitytype === 'whatsapp_message') {
    //   try {
    //     // 1. Adım: mevcut call_count değerini alıyoruz
    //     const { data: locksmithTrafficData, error: locksmithTrafficError } = await supabase
    //       .from('locksmith_traffic')
    //       .select('wp_count')
    //       .eq('locksmith_id', additionalData.locksmithId)
    //       .single();

    //     if (locksmithTrafficError) {
    //       console.error('Error fetching wp_count:', locksmithTrafficError);
    //       return;
    //     }

    //     // 2. Adım: call_count'ı 1 artır
    //     const updatedWpCount = locksmithTrafficData.wp_count + 1;

    //     // 3. Adım: wp_count'ı güncelliyoruz
    //     const { error: updateError } = await supabase
    //       .from('locksmith_traffic')
    //       .update({ wp_count: updatedWpCount })
    //       .eq('locksmith_id', additionalData.locksmithId);

    //     if (updateError) {
    //       console.error('Error updating wp_count:', updateError);
    //     }

    //   } catch (error) {
    //     console.error('Locksmith traffic güncellenemedi:', error);
    //   }
    // } else if (additionalData.locksmithId && activitytype === 'locksmith_list_view') {
    //   try {
    //     // 1. Adım: mevcut call_count değerini alıyoruz
    //     const { data: locksmithTrafficData, error: locksmithTrafficError } = await supabase
    //       .from('locksmith_traffic')
    //       .select('list_count')
    //       .eq('locksmith_id', additionalData.locksmithId)
    //       .single();

    //     if (locksmithTrafficError) {
    //       console.error('Error fetching list_count:', locksmithTrafficError);
    //       return;
    //     }

    //     // 2. Adım: call_count'ı 1 artırıp, priority hesaplıyoruz
    //     const updatedListCount = locksmithTrafficData.list_count + 1;

    //     // 3. Adım: call_count ve priority'yi güncelliyoruz
    //     const { error: updateError } = await supabase
    //       .from('locksmith_traffic')
    //       .update({ list_count: updatedListCount })
    //       .eq('locksmith_id', additionalData.locksmithId);

    //     if (updateError) {
    //       console.error('Error updating list_count:', updateError);
    //     }

    //   } catch (error) {
    //     console.error('Locksmith traffic güncellenemedi:', error);
    //   }
    // } else if (additionalData.locksmithId && activitytype === 'locksmith_detail_view') {
    //   try {
    //     // 1. Adım: mevcut call_count değerini alıyoruz
    //     const { data: locksmithTrafficData, error: locksmithTrafficError } = await supabase
    //       .from('locksmith_traffic')
    //       .select('visit_count')
    //       .eq('locksmith_id', additionalData.locksmithId)
    //       .single();

    //     if (locksmithTrafficError) {
    //       console.error('Error fetching visit_count:', locksmithTrafficError);
    //       return;
    //     }

    //     // 2. Adım: call_count'ı 1 artırıp, priority hesaplıyoruz
    //     const updatedVisitCount = locksmithTrafficData.visit_count + 1;

    //     // 3. Adım: call_count ve priority'yi güncelliyoruz
    //     const { error: updateError } = await supabase
    //       .from('locksmith_traffic')
    //       .update({ visit_count: updatedVisitCount })
    //       .eq('locksmith_id', additionalData.locksmithId);

    //     if (updateError) {
    //       console.error('Error updating visit_count:', updateError);
    //     }

    //   } catch (error) {
    //     console.error('Locksmith traffic güncellenemedi:', error);
    //   }
    // }

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