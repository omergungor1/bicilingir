import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { Resend } from 'resend';

// const resend = new Resend(process.env.RESEND_API_KEY);
let resend;
try {
  if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
} catch (error) {
  console.error('Resend initialization error:', error);
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



export async function checkAuth(request) {
  try {
    // Request headers'ını ve cookie'yi detaylı inceleyelim
    const cookieHeader = request.headers.get('cookie');


    // Özellikle supabase auth token cookie'sini izole edelim
    const supabaseCookieMatch = cookieHeader && cookieHeader.match(/sb-\w+-auth-token=([^;]+)/);
    const supabaseCookieValue = supabaseCookieMatch ? supabaseCookieMatch[1] : null;

    if (!cookieHeader || !supabaseCookieValue) {
      return NextResponse.json({ error: 'Oturum bulunamadı' }, { status: 401 });
    }

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
      return NextResponse.json({ error: 'Oturum bilgisi geçersiz' }, { status: 401 });
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
        return NextResponse.json({ error: 'Oturum yenilenemedi' }, { status: 401 });
      }
    }

    // Şimdi session'ı al
    const { data: authData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('Session alma hatası:', sessionError);
      return NextResponse.json({ error: 'Oturum bilgisi alınamadı' }, { status: 401 });
    }

    if (!authData?.session?.user) {
      return NextResponse.json({ error: 'Oturum bulunamadı' }, { status: 401 });
    }

    const userId = authData.session.user.id;

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
    // x-auth-token'ı al, yoksa diğer alternatiflere bak
    const authHeader = request.headers.get('x-auth-token') ||
      request.headers.get('authorization') ||
      request.headers.get('Authorization') ||
      request.headers.get('token');

    if (!authHeader) {
      return { error: 'Yetkilendirme başlığı bulunamadı', status: 401 };
    }

    // Token'ı Bearer prefix'i ile veya direkt olarak kabul et
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

    // Özel bir supabase istemcisi oluştur
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get: (name) => {
            return undefined; // API çağrılarında cookie kullanmıyoruz
          },
          set: (name, value, options) => {
            // API çağrılarında cookie set etmiyoruz
          },
          remove: (name, options) => {
            // API çağrılarında cookie silmiyoruz
          }
        },
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    );

    // Token ile kullanıcı bilgisini al
    const { data: { user }, error: sessionError } = await supabase.auth.getUser(token);

    if (sessionError) {
      return { error: 'Geçersiz token', status: 401 };
    }

    if (!user) {
      return { error: 'Kullanıcı bulunamadı', status: 401 };
    }

    const userId = user.id;

    // Kullanıcı rolünü kontrol et
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (roleError) {
      return { error: 'Rol bilgisi alınamadı', status: 500 };
    }

    if (!roleData) {
      return { error: 'Rol kaydınız bulunamadı', status: 403 };
    }

    const userRole = roleData.role;

    if (userRole !== 'admin') {
      return { error: 'Bu API sadece admin tarafından kullanılabilir', status: 403 };
    }

    return { supabase };
  } catch (error) {
    return { error: 'Yetkilendirme hatası', status: 500 };
  }
}

/**
 * IP adresinin şüpheli olup olmadığını kontrol eder
 * @param {Object} supabase - Supabase istemci
 * @param {string} ip - Kontrol edilecek IP adresi
 * @returns {Promise<{isSuspicious: boolean, reason: string}>}
 */
export async function checkSuspiciousIP(supabase, ip) {
  try {
    // IP'yi ip_ignore tablosunda kontrol et
    const { data: ignoreData, error: ignoreError } = await supabase
      .from('ip_ignore')
      .select('reason')
      .eq('ip', ip)
      .eq('isactive', true)
      .single();

    if (ignoreError && ignoreError.code !== 'PGRST116') {
      console.error('IP kontrol hatası:', ignoreError);
    }

    return {
      isSuspicious: !!ignoreData,
      reason: ignoreData?.reason || null
    };
  } catch (error) {
    console.error('IP kontrol hatası:', error);
    return { isSuspicious: false, reason: null };
  }
}

/**
 * IP adresini ip_ignore tablosuna ekler (eğer zaten yoksa)
 * @param {Object} supabase - Supabase istemci
 * @param {string} ip - IP adresi
 * @param {string} userId - Kullanıcı ID
 * @param {string} reason - IP'nin engellenme sebebi
 * @param {string} userAgent - Kullanıcının tarayıcı/cihaz bilgisi
 * @returns {Promise<void>}
 */
async function addIpToIgnoreList(supabase, ip, userId, reason, userAgent = 'Bilinmiyor') {
  if (!ip) return;

  const { data: existingIp } = await supabase
    .from('ip_ignore')
    .select('id')
    .eq('ip', ip)
    .single();

  // IP henüz ip_ignore tablosunda yoksa ekle
  if (!existingIp) {
    const { error: ipError } = await supabase
      .from('ip_ignore')
      .insert({
        ip: ip,
        userid: userId,
        reason: reason,
        isactive: true
      });

    if (ipError) {
      console.error('IP ignore tablosuna ekleme hatası:', ipError);
    } else {
      // IP başarıyla engellendiğinde mail gönder
      try {
        const currentDate = new Date().toLocaleString('tr-TR', {
          timeZone: 'Europe/Istanbul',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });

        await resend.emails.send({
          from: 'BiÇilingir <noreply@bicilingir.com>',
          to: 'info@bicilingir.com',
          subject: 'Yeni IP Engelleme Bildirimi',
          html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
                <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; margin-top: 20px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                        <td style="padding: 20px; text-align: center; background-color: #ffffff;">
                            <img src="https://bicilingir.com/logo.png" alt="BiÇilingir Logo" style="width: 200px; height: auto; margin-bottom: 20px;">
                            <h3 style="margin: 0; color: #666; font-size: 14px; font-weight: normal;">Türkiye'nin İlk ve Tek Çilingir Platformu</h3>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px;">
                            <h2 style="color: #333; margin-bottom: 20px;">Yeni IP Engelleme Bildirimi</h2>
                            <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                                Aşağıdaki IP adresi sistem tarafından engellendi:
                            </p>
                            <div style="background-color: #f8f8f8; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                                <p style="margin: 0; color: #333; font-size: 14px;">
                                    <strong>IP Adresi:</strong> ${ip}<br>
                                    <strong>Kullanıcı ID:</strong> ${userId}<br>
                                    <strong>Tarayıcı/Cihaz:</strong> ${userAgent}<br>
                                    <strong>Engellenme Sebebi:</strong> ${reason}<br>
                                    <strong>Engellenme Tarihi:</strong> ${currentDate}
                                </p>
                            </div>
                            <p style="color: #666; font-size: 14px;">
                                Bu otomatik bir bilgilendirme mailidir. Lütfen bu maile cevap vermeyiniz.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #f8f8f8; padding: 20px; text-align: center; border-top: 1px solid #eee;">
                            <p style="color: #888; font-size: 12px; margin: 0;">
                                © ${new Date().getFullYear()} BiÇilingir. Tüm hakları saklıdır.
                            </p>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
          `
        });
      } catch (error) {
        console.error('IP engelleme bildirimi mail gönderme hatası:', error);
      }
    }
  }
}

/**
 * Kullanıcının şüpheli davranış gösterip göstermediğini kontrol eder
 * @param {Object} supabase - Supabase istemci
 * @param {string} ip - Kullanıcı IP adresi
 * @param {string} fingerprintId - Kullanıcı parmak izi
 * @returns {Promise<boolean>}
 */
export async function checkSuspiciousBehavior(supabase, ip, fingerprintId) {
  try {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now - 24 * 60 * 60 * 1000);

    // Önce IP veya fingerprintId ile ilişkili kullanıcıları bul
    const { data: relatedUsers, error: userError } = await supabase
      .from('users')
      .select('id')
      .or(`userip.eq.${ip},fingerprintid.eq.${fingerprintId}`);

    if (userError) {
      console.error('Kullanıcı arama hatası:', userError);
      return false;
    }
    if (!relatedUsers || relatedUsers.length === 0) {
      return false;
    }

    // Bulunan kullanıcıların aktivitelerini kontrol et
    const userIds = relatedUsers.map(user => user.id);
    const { data: activities, error } = await supabase
      .from('user_activity_logs')
      .select('createdat, activitytype')
      .in('userid', userIds)
      .gte('createdat', twentyFourHoursAgo.toISOString())
      .order('createdat', { ascending: false });

    if (error) {
      console.error('Aktivite kontrol hatası:', error);
      return false;
    }

    if (!activities || activities.length === 0) {
      return false;
    }

    // Şüpheli davranış kuralları
    const rules = {
      maxVisitsIn24Hours: 5,
      minTimeBetweenVisits: 2 * 60 * 60 * 1000,
      maxSearchesPerDay: 3
    };

    let isSuspicious = false;
    let suspiciousReason = '';

    // 24 saat içindeki toplam ziyaret sayısı
    const totalVisits = activities.length;
    if (totalVisits > rules.maxVisitsIn24Hours) {
      isSuspicious = true;
      suspiciousReason = `24 saat içinde çok fazla ziyaret (${totalVisits} ziyaret)`;
    }

    // Aramalar arası süre kontrolü
    if (!isSuspicious) {
      for (let i = 1; i < activities.length; i++) {
        const timeDiff = new Date(activities[i - 1].createdat) - new Date(activities[i].createdat);
        if (timeDiff < rules.minTimeBetweenVisits) {
          isSuspicious = true;
          suspiciousReason = 'Çok sık aralıklarla ziyaret';
          break;
        }
      }
    }

    // Günlük arama sayısı kontrolü
    if (!isSuspicious) {
      const searchCount = activities.filter(a => a.activitytype === 'locksmith_list_view').length;
      if (searchCount > rules.maxSearchesPerDay) {
        isSuspicious = true;
        suspiciousReason = `Günlük arama limiti aşıldı (${searchCount} arama)`;
      }
    }

    if (isSuspicious) {
      // Kullanıcıları şüpheli olarak işaretle
      await Promise.all(userIds.map(userId =>
        supabase
          .from('users')
          .update({ issuspicious: true })
          .eq('id', userId)
      ));

      // IP'yi ip_ignore tablosuna ekle
      await addIpToIgnoreList(supabase, ip, userIds[0], suspiciousReason, 'Bilinmiyor');

      return true;
    }

    return false;
  } catch (error) {
    console.error('Şüpheli davranış kontrolü hatası:', error);
    return false;
  }
}

/**
 * Kullanıcıyı oluşturur veya günceller
 * @param {Object} supabase - Supabase istemci
 * @param {string} userId - Kullanıcı ID (varsa)
 * @param {string} sessionId - Oturum ID
 * @param {string} userIp - Kullanıcı IP adresi
 * @param {string} userAgent - Kullanıcı tarayıcı bilgisi
 * @param {string} fingerprintId - FingerprintJS visitor ID
 * @returns {Promise<{userId: string, isNewUser: boolean, isSuspicious: boolean}>}
 */
export async function createOrUpdateUser(supabase, userId, sessionId, userIp, userAgent, fingerprintId = null) {
  try {
    let newUserId = userId;
    let isNewUser = false;
    let isSuspicious = false;

    // IP kontrolü
    const ipCheck = await checkSuspiciousIP(supabase, userIp);
    if (ipCheck.isSuspicious) {
      isSuspicious = true;
    }

    // Önce fingerprintId ile kullanıcı ara
    if (fingerprintId) {
      const { data: fpUser } = await supabase
        .from('users')
        .select('id, issuspicious')
        .eq('fingerprintid', fingerprintId)
        .single();

      if (fpUser) {
        newUserId = fpUser.id;
        isSuspicious = fpUser.issuspicious || isSuspicious;

        // Mevcut kullanıcının IP ve user-agent bilgilerini güncelle
        const { error: updateError } = await supabase
          .from('users')
          .update({
            userip: userIp,
            useragent: userAgent,
            updatedat: new Date().toISOString()
          })
          .eq('id', newUserId);

        if (updateError) {
          console.error('Kullanıcı güncelleme hatası:', updateError);
        }

        await addIpToIgnoreList(supabase, userIp, newUserId, 'Şüpheli kullanıcının yeni IP adresi', userAgent);

        return {
          userId: newUserId,
          isNewUser: false,
          isSuspicious: isSuspicious || await checkSuspiciousBehavior(supabase, userIp, fingerprintId)
        };
      }
    }

    // UserId ile kullanıcı ara
    if (newUserId) {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id, issuspicious')
        .eq('id', newUserId)
        .single();

      if (existingUser) {
        isSuspicious = existingUser.issuspicious || isSuspicious;

        // Mevcut kullanıcının bilgilerini güncelle
        const { error: updateError } = await supabase
          .from('users')
          .update({
            fingerprintid: fingerprintId,
            userip: userIp,
            useragent: userAgent,
            updatedat: new Date().toISOString()
          })
          .eq('id', newUserId);

        if (updateError) {
          console.error('Kullanıcı güncelleme hatası:', updateError);
        }

        await addIpToIgnoreList(supabase, userIp, newUserId, 'Şüpheli kullanıcının yeni IP adresi', userAgent);

        return {
          userId: newUserId,
          isNewUser: false,
          isSuspicious: isSuspicious || await checkSuspiciousBehavior(supabase, userIp, fingerprintId)
        };
      }
    }

    // Kullanıcı bulunamadı, yeni kullanıcı oluştur
    const { v4: uuidv4 } = await import('uuid');
    newUserId = newUserId || uuidv4();
    isNewUser = true;

    const insertData = {
      id: newUserId,
      fingerprintid: fingerprintId,
      userip: userIp,
      useragent: userAgent || 'Unknown',
      createdat: new Date().toISOString(),
      updatedat: new Date().toISOString(),
      issuspicious: isSuspicious,
      islocksmith: false
    };

    const { error: insertError } = await supabase
      .from('users')
      .insert(insertData);

    if (insertError) {
      // Eğer duplicate key hatası alındıysa (23505), kullanıcıyı tekrar çek
      if (insertError.code === '23505') {
        const { data: existingUser } = await supabase
          .from('users')
          .select('id, issuspicious')
          .eq('id', newUserId)
          .single();

        if (existingUser) {
          // Kullanıcı bulundu, bilgilerini güncelle
          const { error: updateError } = await supabase
            .from('users')
            .update({
              fingerprintid: fingerprintId,
              userip: userIp,
              useragent: userAgent,
              updatedat: new Date().toISOString()
            })
            .eq('id', newUserId);

          if (updateError) {
            console.error('Kullanıcı güncelleme hatası:', updateError);
          }

          isSuspicious = existingUser.issuspicious || isSuspicious;
          await addIpToIgnoreList(supabase, userIp, newUserId, 'Şüpheli kullanıcının yeni IP adresi', userAgent);

          return {
            userId: newUserId,
            isNewUser: false,
            isSuspicious: isSuspicious || await checkSuspiciousBehavior(supabase, userIp, fingerprintId)
          };
        }
      }
      console.error('Kullanıcı oluşturma hatası:', insertError);
      throw insertError;
    }

    // Şüpheli davranış kontrolü
    if (!isSuspicious) {
      isSuspicious = await checkSuspiciousBehavior(supabase, userIp, fingerprintId);
      if (isSuspicious) {
        await supabase
          .from('users')
          .update({ issuspicious: true })
          .eq('id', newUserId);
      }
    }

    await addIpToIgnoreList(supabase, userIp, newUserId, 'Şüpheli kullanıcının yeni IP adresi', userAgent);

    return { userId: newUserId, isNewUser, isSuspicious };
  } catch (error) {
    console.error('Kullanıcı işleme hatası:', error);
    throw error;
  }
}

/**
 * Kullanıcı aktivitesini kaydeder
 * @param {Object} supabase - Supabase istemci
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
export async function logUserActivity(supabase, userId = '00000000-0000-0000-0000-000000000000', sessionId = '00000000-0000-0000-0000-000000000000', activitytype = 'website_visit', details, entityId, entityType, additionalData = {}, level = 1) {
  try {
    // User-Agent bilgisini al ve cihaz tipini belirle
    const userAgent = additionalData.userAgent || '';
    const deviceType = userAgent.includes('Mobile') ? 'mobile' : 'desktop';

    // Kullanıcı ID'si yoksa veya varsayılan değerse yeni bir kullanıcı oluştur
    if (!userId || userId === '00000000-0000-0000-0000-000000000000') {
      const result = await createOrUpdateUser(
        supabase,
        null,
        sessionId,
        '0.0.0.0',
        userAgent
      );
      userId = result.userId;
    } else {
      // Kullanıcının varlığını kontrol et
      const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .single();

      if (!existingUser || userError) {
        // Kullanıcı bulunamadıysa yeni oluştur
        const result = await createOrUpdateUser(
          supabase,
          userId, // Mevcut userId'yi gönder
          sessionId,
          '0.0.0.0',
          userAgent
        );
        userId = result.userId;
      }
    }

    const insertData = {
      userid: userId,
      activitytype: activitytype,
      devicetype: deviceType,
      createdat: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    };

    // SessionId varsa ve UUID formatındaysa ekle
    if (sessionId && sessionId !== '00000000-0000-0000-0000-000000000000') {
      try {
        const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (uuidPattern.test(sessionId)) {
          insertData.sessionid = sessionId;
        } else {
          const { v4: uuidv4 } = await import('uuid');
          insertData.sessionid = uuidv4();
        }
      } catch (e) {
        console.error('SessionId işleme hatası:', e);
      }
    }

    // Ek veri alanlarını ekle
    if (additionalData.searchProvinceId) insertData.searchprovinceid = additionalData.searchProvinceId;
    if (additionalData.searchDistrictId) insertData.searchdistrictid = additionalData.searchDistrictId;
    if (additionalData.searchServiceId) insertData.searchserviceid = additionalData.searchServiceId;
    if (additionalData.locksmithId) insertData.locksmithid = additionalData.locksmithId;
    if (additionalData.reviewId) insertData.reviewid = additionalData.reviewId;
    if (entityType === 'locksmith' && entityId) insertData.locksmithid = entityId;

    const { data, error } = await supabase
      .from('user_activity_logs')
      .insert(insertData)
      .select();

    if (error) {
      console.error('Aktivite ekleme SQL hatası:', error);
      throw error;
    }

    let activityId = data?.[0]?.id || null;
    return activityId;
  } catch (error) {
    console.error('Aktivite kaydetme hatası:', error);
    throw error;
  }
}

export async function getLocksmithId(request) {
  try {
    // x-auth-token'ı al, yoksa diğer alternatiflere bak
    const authHeader = request.headers.get('x-auth-token') ||
      request.headers.get('authorization') ||
      request.headers.get('Authorization') ||
      request.headers.get('token');

    if (!authHeader) {
      return { error: 'Yetkilendirme başlığı bulunamadı', status: 401 };
    }

    // Token'ı Bearer prefix'i ile veya direkt olarak kabul et
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

    // Özel bir supabase istemcisi oluştur
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get: (name) => {
            return undefined; // API çağrılarında cookie kullanmıyoruz
          },
          set: (name, value, options) => {
            // API çağrılarında cookie set etmiyoruz
          },
          remove: (name, options) => {
            // API çağrılarında cookie silmiyoruz
          }
        },
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    );

    // Token ile kullanıcı bilgisini al
    const { data: { user }, error: sessionError } = await supabase.auth.getUser(token);

    if (sessionError) {
      console.error('Session hatası:', sessionError);
      return { error: 'Geçersiz token', status: 401 };
    }

    if (!user) {
      return { error: 'Kullanıcı bulunamadı', status: 401 };
    }

    const userId = user.id;

    // Çilingir ID'sini al
    const { data: locksmithData, error: locksmithError } = await supabase
      .from('locksmiths')
      .select('id')
      .eq('authid', userId)
      .single();

    if (locksmithError) {
      console.error('Çilingir ID alınamadı:', locksmithError);
      return { error: 'Çilingir bilgileriniz bulunamadı', status: 404 };
    }

    const locksmithId = locksmithData?.id || null;

    return { locksmithId, supabase };
  } catch (error) {
    console.error('Çilingir ID alınamadı:', error);
    return { error: 'Çilingir bilgileriniz bulunamadı', status: 404 };
  }
}

/**
 * Kullanıcının konum bilgisini günceller
 * @param {Object} supabase - Supabase istemci
 * @param {string} fingerprintId - Kullanıcı parmak izi
 * @param {Object} location - Konum bilgisi {latitude, longitude, accuracy}
 * @returns {Promise<Object>} Güncelleme sonucu
 */
export async function updateUserLocation(supabase, fingerprintId, location) {
  console.log('updateUserLocation', fingerprintId, location);
  console.log('FingerprintId', fingerprintId);
  console.log('Location', location);

  try {
    if (!fingerprintId || !location) {
      throw new Error('FingerprintId ve konum bilgisi gerekli');
    }

    const { data, error } = await supabase
      .from('users')
      .update({
        latitude: location.latitude,
        longitude: location.longitude,
        location_accuracy: Math.round(location.accuracy),
        location_source: 'browser',
        updatedat: new Date().toISOString()
      })
      .eq('fingerprintid', fingerprintId)
      .select();

    if (error) {
      console.error('Kullanıcı konum güncelleme hatası:', error);
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Konum güncelleme hatası:', error);
    return { success: false, error: error.message };
  }
}