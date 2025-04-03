import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**

-- Çilingirler Tablosu
CREATE TABLE locksmiths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    provinceId INTEGER REFERENCES provinces(id),
    districtId INTEGER REFERENCES districts(id),
    businessName TEXT,
    fullName TEXT NOT NULL,
    tagline TEXT,
    email TEXT UNIQUE NOT NULL,
    phoneNumber TEXT UNIQUE NOT NULL,
    whatsappNumber TEXT UNIQUE,
    customerLimitPerHour INTEGER DEFAULT 5,
    avgRating NUMERIC(3,2) DEFAULT 0,
    totalReviewCount INTEGER DEFAULT 0,
    profileImageUrl TEXT,
    isVerified BOOLEAN DEFAULT FALSE,
    isActive BOOLEAN DEFAULT FALSE
);

-- Çilingir Detayları Tablosu
CREATE TABLE locksmith_details (
    locksmithId UUID PRIMARY KEY REFERENCES locksmiths(id),
    taxNumber TEXT UNIQUE,
    fullAddress TEXT,
    aboutText TEXT,
    certificates JSONB,
    documents JSONB,
    instagram_url TEXT,
    facebook_url TEXT,
    tiktok_url TEXT,
    youtube_url TEXT,
    websiteUrl TEXT,
    startDate DATE,
    isEmailVerified BOOLEAN DEFAULT FALSE,
    isPhoneVerified BOOLEAN DEFAULT FALSE,
    totalReviewsCount INTEGER DEFAULT 0,
    avgRating NUMERIC(3,2) DEFAULT 0,
    createdAt TIMESTAMPTZ DEFAULT NOW(),
    lastLogin TIMESTAMPTZ
);
 */

export async function GET(request) {
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
     } else {
       console.log('Manuel session başarıyla ayarlandı:', !!data.session);
     }
   }
   
   // Şimdi session'ı al
   const { data: authData } = await supabase.auth.getSession();
   
   const session = authData?.session;
  //  ------------------------------------------------------------
    
    if (!session) {
      console.log('Profile API - Oturum yok');
      // Hata yerine varsayılan boş veri döndürelim
      return NextResponse.json({
        locksmith: null
      });
    }
    
    // Kullanıcı ID'sini al
    const userId = session.user.id;
    console.log('Profile API - Kullanıcı ID:', userId);

    // Kullanıcı rolünü kontrol et
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();
    
    if (roleError) {
      console.log('Profile API - Rol hatası:', roleError.message);
      return NextResponse.json({ error: 'Rol bilgisi alınamadı' }, { status: 500 });
    }
    
    if (!roleData) {
      console.log('Profile API - Rol bulunamadı');
      return NextResponse.json({ error: 'Rol kaydınız bulunamadı' }, { status: 403 });
    }
    
    const userRole = roleData.role;
    console.log('Profile API - Kullanıcı rolü:', userRole);
    
    if (userRole !== 'cilingir' && userRole !== 'admin') {
      console.log('Profile API - Yetkisiz erişim');
      return NextResponse.json({ error: 'Bu API sadece çilingirler tarafından kullanılabilir' }, { status: 403 });
    }

    // Çilingir bilgilerini getir
    const { data: locksmith, error: locksmithError } = await supabase
      .from('locksmiths')
      .select('*')
      .eq('authid', userId)
      .single();
    
    if (locksmithError) {
      console.error('Çilingir profili getirilirken bir hata oluştu:', locksmithError);
      return NextResponse.json({ error: 'Çilingir profili yüklenirken bir hata oluştu' }, { status: 500 });
    }

    if (!locksmith) {
      return NextResponse.json({ error: 'Çilingir profili bulunamadı' }, { status: 404 });
    }

    // Çilingir detaylarını getir
    const { data: locksmithDetail, error: detailError } = await supabase
      .from('locksmith_details')
      .select('*')
      .eq('locksmithid', locksmith.id)
      .single();
    
    if (detailError && detailError.code !== 'PGRST116') { // PGRST116: Kayıt bulunamadı hatası
      console.error('Çilingir detayları getirilirken bir hata oluştu:', detailError);
      return NextResponse.json({ error: 'Çilingir detayları yüklenirken bir hata oluştu' }, { status: 500 });
    }

    return NextResponse.json({ 
      locksmith: {...locksmith, ...locksmithDetail} || null
    });
  } catch (error) {
    console.error('Çilingir profili getirilirken bir hata oluştu:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function PUT(request) {
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
      } else {
        console.log('Manuel session başarıyla ayarlandı:', !!data.session);
      }
    }
    
    // Şimdi session'ı al
    const { data: authData } = await supabase.auth.getSession();
    
    const session = authData?.session;
    
    if (!session) {
      console.log('Profile API (PUT) - Oturum yok');
      return NextResponse.json({ error: 'Oturum açmalısınız' }, { status: 401 });
    }
    
    // Kullanıcı ID'sini al
    const userId = session.user.id;
    console.log('Profile API (PUT) - Kullanıcı ID:', userId);

    // Kullanıcı rolünü kontrol et
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();
    
    if (roleError) {
      console.log('Profile API (PUT) - Rol hatası:', roleError.message);
      return NextResponse.json({ error: 'Rol bilgisi alınamadı' }, { status: 500 });
    }
    
    if (!roleData) {
      console.log('Profile API (PUT) - Rol bulunamadı');
      return NextResponse.json({ error: 'Rol kaydınız bulunamadı' }, { status: 403 });
    }
    
    const userRole = roleData.role;
    console.log('Profile API (PUT) - Kullanıcı rolü:', userRole);
    
    if (userRole !== 'cilingir' && userRole !== 'admin') {
      console.log('Profile API (PUT) - Yetkisiz erişim');
      return NextResponse.json({ error: 'Bu API sadece çilingirler tarafından kullanılabilir' }, { status: 403 });
    }

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
      
    const locksmithId = locksmithData.id;

    // Gelen verileri al
    const requestData = await request.json();
    console.log('Profile API (PUT) - Gelen veri:', JSON.stringify(requestData, null, 2));

    // Hangi tablo için hangi alanların güncelleneceğini belirle
    const locksmithFields = [
      'businessname', 'fullname', 'tagline', 'email', 'phonenumber', 'whatsappnumber',
      'customerlimitperhour', 'provinceid', 'districtid'
    ];

    const detailFields = [
      'abouttext', 'taxnumber', 'fulladdress', 'websiteurl', 
      'instagram_url', 'facebook_url', 'tiktok_url', 'youtube_url'
    ];

    // locksmiths tablosu için güncelleme verileri
    const locksmithUpdateData = {};
    locksmithFields.forEach(field => {
      if (requestData[field] !== undefined) {
        locksmithUpdateData[field] = requestData[field];
      }
    });

    // locksmith_details tablosu için güncelleme verileri
    const detailUpdateData = {};
    detailFields.forEach(field => {
      if (requestData[field] !== undefined) {
        detailUpdateData[field] = requestData[field];
      }
    });

    // Tabloları ayrı ayrı güncelle
    let locksmithUpdateError = null;
    let detailUpdateError = null;

    // locksmiths tablosunu güncelle
    if (Object.keys(locksmithUpdateData).length > 0) {
      const { error } = await supabase
        .from('locksmiths')
        .update(locksmithUpdateData)
        .eq('id', locksmithId);
      
      if (error) {
        console.error('Çilingir bilgileri güncellenirken hata:', error);
        locksmithUpdateError = error;
      }
    }

    // locksmith_details tablosunu güncelle
    if (Object.keys(detailUpdateData).length > 0) {
      // Önce kaydın var olup olmadığını kontrol et
      const { data, error: checkError } = await supabase
        .from('locksmith_details')
        .select('locksmithid')
        .eq('locksmithid', locksmithId)
        .single();
      
      let updateError = null;
      
      if (checkError && checkError.code === 'PGRST116') {
        // Kayıt bulunamadı, insert yapalım
        const { error } = await supabase
          .from('locksmith_details')
          .insert({ locksmithid: locksmithId, ...detailUpdateData });
        
        updateError = error;
      } else {
        // Kayıt bulundu, update yapalım
        const { error } = await supabase
          .from('locksmith_details')
          .update(detailUpdateData)
          .eq('locksmithid', locksmithId);
        
        updateError = error;
      }
      
      if (updateError) {
        console.error('Çilingir detayları güncellenirken hata:', updateError);
        detailUpdateError = updateError;
      }
    }

    // Hatalar varsa bildir
    if (locksmithUpdateError || detailUpdateError) {
      return NextResponse.json({ 
        error: 'Profil güncellenirken bir hata oluştu',
        locksmithError: locksmithUpdateError ? locksmithUpdateError.message : null,
        detailError: detailUpdateError ? detailUpdateError.message : null
      }, { status: 500 });
    }

    // Başarılı yanıt döndür
    return NextResponse.json({ 
      success: true,
      message: 'Profil başarıyla güncellendi'
    });

  } catch (error) {
    console.error('Çilingir profili güncellenirken bir hata oluştu:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
} 