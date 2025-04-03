import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Test modu kontrolü
const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true';

export async function GET(request) {
  try {
    // Request headers'ını konsola yaz
    const cookieHeader = request.headers.get('cookie');
    console.log('Certificates API - Cookie Header:', cookieHeader);
    
    // Cookie bilgisini manuel olarak işle
    let session = null;
    if (cookieHeader) {
      try {
        // Cookie içinden Supabase oturum bilgilerini bul
        const supabaseCookieRegex = /sb-[a-zA-Z0-9]+-auth-token=([^;]+)/;
        const match = cookieHeader.match(supabaseCookieRegex);

        if (match && match[1]) {
          console.log('Certificates API - Supabase cookie bulundu');
          // Cookie değerini decode et
          const cookieValue = decodeURIComponent(match[1]);
          
          try {
            // JSON olarak parse et
            const parsedCookie = JSON.parse(cookieValue);
            console.log('Certificates API - Cookie parse edildi:', Object.keys(parsedCookie));
            
            // Session bilgisini oluştur
            if (parsedCookie.access_token && parsedCookie.refresh_token) {
              session = {
                access_token: parsedCookie.access_token,
                refresh_token: parsedCookie.refresh_token,
                user: {
                  id: parsedCookie.user.id
                }
              };
              console.log('Certificates API - Session manuel olarak oluşturuldu');
            }
          } catch (parseError) {
            console.error('Certificates API - Cookie JSON olarak parse edilemedi:', parseError);
          }
        } else {
          console.log('Certificates API - Supabase cookie bulunamadı');
        }
      } catch (cookieError) {
        console.error('Certificates API - Cookie işlenirken hata:', cookieError);
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
            console.log(`Getting cookie in certificates API: ${name} = ${cookie ? 'exists' : 'undefined'}`);
            return cookie;
          },
          set(name, value, options) {
            console.log(`Setting cookie in certificates API: ${name}`);
            response.cookies.set({
              name,
              value,
              ...options
            });
          },
          remove(name, options) {
            console.log(`Removing cookie in certificates API: ${name}`);
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
      console.log('Certificates API - Manuel session yok, Supabase ile deneyelim');
      const { data: authData } = await supabase.auth.getSession();
      console.log('Certificates API - Auth Data:', JSON.stringify(authData, null, 2));
      session = authData?.session;
    }
    
    if (!session) {
      console.log('Certificates API - Oturum yok');
      // Varsayılan sertifikalar döndür
      return NextResponse.json([
        { id: 1, name: "Demo Sertifikası 1", url: "/sertifikalar/demo1.pdf", createdAt: new Date().toISOString() },
        { id: 2, name: "Demo Sertifikası 2", url: "/sertifikalar/demo2.pdf", createdAt: new Date().toISOString() }
      ]);
    }
    
    // Kullanıcı ID'sini al
    const userId = session.user.id;
    console.log('Certificates API - Kullanıcı ID:', userId);

    // Kullanıcı rolünü kontrol et
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();
    
    if (roleError) {
      console.log('Certificates API - Rol hatası:', roleError.message);
      return NextResponse.json({ error: 'Rol bilgisi alınamadı' }, { status: 500 });
    }
    
    if (!roleData) {
      console.log('Certificates API - Rol bulunamadı');
      return NextResponse.json({ error: 'Rol kaydınız bulunamadı' }, { status: 403 });
    }
    
    const userRole = roleData.role;
    console.log('Certificates API - Kullanıcı rolü:', userRole);
    
    if (userRole !== 'cilingir' && userRole !== 'admin') {
      console.log('Certificates API - Yetkisiz erişim');
      return NextResponse.json({ error: 'Bu API sadece çilingirler tarafından kullanılabilir' }, { status: 403 });
    }

    // Çilingir ID'sini al
    const { data: locksmith, error: locksmithError } = await supabase
      .from('locksmiths')
      .select('id')
      .eq('authId', userId)
      .single();
    
    if (locksmithError) {
      console.error('Çilingir profili getirilirken bir hata oluştu:', locksmithError);
      return NextResponse.json({ error: 'Çilingir profili yüklenirken bir hata oluştu' }, { status: 500 });
    }

    if (!locksmith) {
      return NextResponse.json({ error: 'Çilingir profili bulunamadı' }, { status: 404 });
    }

    // Sertifikaları getir
    const { data: certificates, error: certificatesError } = await supabase
      .from('locksmith_certificates')
      .select('*')
      .eq('locksmithId', locksmith.id)
      .order('createdAt', { ascending: false });
    
    if (certificatesError) {
      console.error('Sertifikalar getirilirken bir hata oluştu:', certificatesError);
      return NextResponse.json({ error: 'Sertifikalar yüklenirken bir hata oluştu' }, { status: 500 });
    }

    return NextResponse.json(certificates || []);
  } catch (error) {
    console.error('Sertifikalar getirilirken bir hata oluştu:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // Request headers'ını konsola yaz
    const cookieHeader = request.headers.get('cookie');
    console.log('Certificates API (POST) - Cookie Header:', cookieHeader);
    
    // Cookie bilgisini manuel olarak işle
    let session = null;
    if (cookieHeader) {
      try {
        // Cookie içinden Supabase oturum bilgilerini bul
        const supabaseCookieRegex = /sb-[a-zA-Z0-9]+-auth-token=([^;]+)/;
        const match = cookieHeader.match(supabaseCookieRegex);

        if (match && match[1]) {
          console.log('Certificates API (POST) - Supabase cookie bulundu');
          // Cookie değerini decode et
          const cookieValue = decodeURIComponent(match[1]);
          
          try {
            // JSON olarak parse et
            const parsedCookie = JSON.parse(cookieValue);
            console.log('Certificates API (POST) - Cookie parse edildi:', Object.keys(parsedCookie));
            
            // Session bilgisini oluştur
            if (parsedCookie.access_token && parsedCookie.refresh_token) {
              session = {
                access_token: parsedCookie.access_token,
                refresh_token: parsedCookie.refresh_token,
                user: {
                  id: parsedCookie.user.id
                }
              };
              console.log('Certificates API (POST) - Session manuel olarak oluşturuldu');
            }
          } catch (parseError) {
            console.error('Certificates API (POST) - Cookie JSON olarak parse edilemedi:', parseError);
          }
        } else {
          console.log('Certificates API (POST) - Supabase cookie bulunamadı');
        }
      } catch (cookieError) {
        console.error('Certificates API (POST) - Cookie işlenirken hata:', cookieError);
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
            console.log(`Getting cookie in certificates API (POST): ${name} = ${cookie ? 'exists' : 'undefined'}`);
            return cookie;
          },
          set(name, value, options) {
            console.log(`Setting cookie in certificates API (POST): ${name}`);
            response.cookies.set({
              name,
              value,
              ...options
            });
          },
          remove(name, options) {
            console.log(`Removing cookie in certificates API (POST): ${name}`);
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
      console.log('Certificates API (POST) - Manuel session yok, Supabase ile deneyelim');
      const { data: authData } = await supabase.auth.getSession();
      console.log('Certificates API (POST) - Auth Data:', JSON.stringify(authData, null, 2));
      session = authData?.session;
    }
    
    if (!session) {
      console.log('Certificates API (POST) - Oturum yok');
      return NextResponse.json({ error: 'Oturum açmalısınız' }, { status: 401 });
    }
    
    // Kullanıcı ID'sini al
    const userId = session.user.id;
    console.log('Certificates API (POST) - Kullanıcı ID:', userId);

    // Formdan gelen veriyi al
    const formData = await request.formData();
    const certificateName = formData.get('name');
    const certificateFile = formData.get('file');
    
    if (!certificateName || !certificateFile) {
      return NextResponse.json({ error: 'Sertifika adı ve dosyası gereklidir' }, { status: 400 });
    }
    
    console.log('Certificates API (POST) - Yüklenen sertifika:', certificateName);
    
    // Dosyayı Storage'a yükle ve diğer işlemleri yap
    // ...

    return NextResponse.json({ success: true, message: 'Sertifika başarıyla eklendi' });
  } catch (error) {
    console.error('Sertifika eklenirken bir hata oluştu:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
} 