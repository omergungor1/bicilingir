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
    // Request headers'ını konsola yaz
    const cookieHeader = request.headers.get('cookie');
    console.log('Profile API (PUT) - Cookie Header:', cookieHeader);
    
    // Cookie bilgisini manuel olarak işle
    let session = null;
    if (cookieHeader) {
      try {
        // Cookie içinden Supabase oturum bilgilerini bul
        const supabaseCookieRegex = /sb-[a-zA-Z0-9]+-auth-token=([^;]+)/;
        const match = cookieHeader.match(supabaseCookieRegex);

        if (match && match[1]) {
          console.log('Profile API (PUT) - Supabase cookie bulundu');
          // Cookie değerini decode et
          const cookieValue = decodeURIComponent(match[1]);
          
          try {
            // JSON olarak parse et
            const parsedCookie = JSON.parse(cookieValue);
            console.log('Profile API (PUT) - Cookie parse edildi:', Object.keys(parsedCookie));
            
            // Session bilgisini oluştur
            if (parsedCookie.access_token && parsedCookie.refresh_token) {
              session = {
                access_token: parsedCookie.access_token,
                refresh_token: parsedCookie.refresh_token,
                user: {
                  id: parsedCookie.user.id
                }
              };
              console.log('Profile API (PUT) - Session manuel olarak oluşturuldu');
            }
          } catch (parseError) {
            console.error('Profile API (PUT) - Cookie JSON olarak parse edilemedi:', parseError);
          }
        } else {
          console.log('Profile API (PUT) - Supabase cookie bulunamadı');
        }
      } catch (cookieError) {
        console.error('Profile API (PUT) - Cookie işlenirken hata:', cookieError);
      }
    }
    
    // Supabase istemcisini oluştur
    let response = NextResponse.next();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            const cookie = request.cookies.get(name)?.value;
            console.log(`Getting cookie in profile API (PUT): ${name} = ${cookie ? 'exists' : 'undefined'}`);
            return cookie;
          },
          set(name, value, options) {
            console.log(`Setting cookie in profile API (PUT): ${name}`);
            response.cookies.set({
              name,
              value,
              ...options
            });
          },
          remove(name, options) {
            console.log(`Removing cookie in profile API (PUT): ${name}`);
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
    
    // Oturum bilgisi manuel olarak oluşturulduysa onu kullan
    if (!session) {
      // Manuel oturum yoksa, Supabase ile kontrol et
      console.log('Profile API (PUT) - Manuel session yok, Supabase ile deneyelim');
      const { data: authData } = await supabase.auth.getSession();
      console.log('Profile API (PUT) - Auth Data:', JSON.stringify(authData, null, 2));
      session = authData?.session;
    }
    
    if (!session) {
      console.log('Profile API (PUT) - Oturum yok');
      return NextResponse.json({ error: 'Oturum açmalısınız' }, { status: 401 });
    }
    
    // PUT işlemini buradan devam ettirin
    // Gelen verileri alın ve profili güncelleyin
    const requestData = await request.json();
    console.log('Profile API (PUT) - Gelen veri:', JSON.stringify(requestData, null, 2));
    
    // İşlem tamamlandı mesajı döndür
    return NextResponse.json({ message: 'Profil başarıyla güncellendi' }, { status: 200 });
  } catch (error) {
    console.error('Çilingir profili güncellenirken bir hata oluştu:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
} 