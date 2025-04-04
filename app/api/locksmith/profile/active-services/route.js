import { NextResponse } from 'next/server';
import { checkAuth } from '../../../utils';

//     // Özellikle supabase auth token cookie'sini izole edelim
//     const supabaseCookieMatch = cookieHeader && cookieHeader.match(/sb-\w+-auth-token=([^;]+)/);
//     const supabaseCookieValue = supabaseCookieMatch ? supabaseCookieMatch[1] : null;
    
    
//     let parsedCookieValue = null;
//     try {
//         // Cookie URL-encoded olduğu için decode edilmeli
//         const decodedCookie = supabaseCookieValue ? decodeURIComponent(supabaseCookieValue) : null;

//         // JSON formatında mı kontrol et
//         if (decodedCookie && decodedCookie.startsWith('[') && decodedCookie.endsWith(']')) {
//         parsedCookieValue = JSON.parse(decodedCookie);
//         }
//     } catch (e) {
//         console.error('Cookie parse hatası:', e);
//     }
    
//     // Özel bir supabase istemcisi oluşturalım
//     let response = NextResponse.next();
//     const supabase = createServerClient(
//         process.env.NEXT_PUBLIC_SUPABASE_URL,
//         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
//         {
//         cookies: {
//             get(name) {
//             // Eğer supabase auth token isteniyorsa ve parse ettiğimiz değer varsa
//             if (name.includes('auth-token') && parsedCookieValue) {
//                 return JSON.stringify(parsedCookieValue);
//             }
            
//             // Diğer durumlar için normal cookie'yi al
//             const cookie = request.cookies.get(name)?.value;
//             return cookie;
//             },
//             set(name, value, options) {
//             response.cookies.set({
//                 name,
//                 value,
//                 ...options
//             });
//             },
//             remove(name, options) {
//             response.cookies.set({
//                 name,
//                 value: '',
//                 ...options,
//                 maxAge: 0
//             });
//             }
//         },
//         }
//     );
    
//     // Manuel olarak getSession() fonksiyonunu çağırmadan önce token'ları ayarlayalım
//     if (parsedCookieValue && Array.isArray(parsedCookieValue) && parsedCookieValue.length >= 2) {
//         const accessToken = parsedCookieValue[0];
//         const refreshToken = parsedCookieValue[1];
        
        
//         // Session'ı manuel olarak ayarla
//         const { data, error } = await supabase.auth.setSession({
//         access_token: accessToken,
//         refresh_token: refreshToken
//         });
        
//         if (error) {
//         console.error('Manuel session ayarlama hatası:', error.message);
//         } else {
//         console.log('Manuel session başarıyla ayarlandı:', !!data.session);
//         }
//     }
    
//     // Şimdi session'ı al
//     const { data: authData } = await supabase.auth.getSession();
    
//     const session = authData?.session;
    
//     // Kullanıcı ID'sini al
//     const userId = session.user.id;
    

//     // Kullanıcı rolünü kontrol et
//     const { data: roleData, error: roleError } = await supabase
//         .from('user_roles')
//         .select('role')
//         .eq('user_id', userId)
//         .single();
    
//     if (roleError) {
//         return NextResponse.json({ error: 'Rol bilgisi alınamadı' }, { status: 500 });
//     }
    
//     if (!roleData) {
//         return NextResponse.json({ error: 'Rol kaydınız bulunamadı' }, { status: 403 });
//     }
    
//     const userRole = roleData.role;
    
//     if (userRole !== 'cilingir' && userRole !== 'admin') {
//         return NextResponse.json({ error: 'Bu API sadece çilingirler tarafından kullanılabilir' }, { status: 403 });
//     }

//     // Çilingir ID'sini al
//     const { data: locksmithData, error: locksmithError } = await supabase
//         .from('locksmiths')
//         .select('id')
//         .eq('authid', userId)
//         .single();
        
//     if (locksmithError) {
//         console.error('Çilingir ID alınamadı:', locksmithError);
//         return NextResponse.json({ error: 'Çilingir bilgileriniz bulunamadı' }, { status: 404 });
//     }
        
//     const locksmithId = locksmithData.id;

//     return { locksmithId, supabase };
// } catch (error) {
//   console.error('Çilingir ID alınamadı:', error);
//   return NextResponse.json({ error: 'Çilingir bilgileriniz bulunamadı' }, { status: 404 });
// }
// }


// Çilingirin aktif servislerini getir
export async function GET(request) {
  try {
    const { locksmithId, supabase } = await checkAuth(request);
    
    // Çilingirin aktif servislerini getir
    const { data: activeServiceRecords, error: activeServicesError } = await supabase
      .from('locksmith_services')
      .select('serviceid, isactive')
      .eq('locksmithid', locksmithId);
    
    if (activeServicesError) {
      console.error('Aktif servisler getirilirken hata:', activeServicesError);
      return NextResponse.json({ error: 'Aktif servisler getirilirken bir hata oluştu' }, { status: 500 });
    }

    const { data: services, error } = await supabase
    .from('services')
    .select('*')
    .eq('isActive', true)
    .order('name', { ascending: true });
  
  if (error) {
    console.error('Hizmetler getirilirken bir hata oluştu 1:', error);
    return NextResponse.json({ error: 'Hizmetler yüklenirken bir hata oluştu' }, { status: 500 });
  }
    
    // Aktif servislerin ID'lerini çıkar
    const activeServiceIds = activeServiceRecords
      .filter(record => record.isactive)
      .map(record => record.serviceid);

      //sevices içine isLocksmithActive ekle
      services.forEach(service => {
        service.isLocksmithActive = activeServiceIds.includes(service.id);
      });

    
    return NextResponse.json({
      services: services
    });
    
    
  } catch (error) {
    console.error('Aktif servisler getirilirken bir hata oluştu:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

// Çilingirin aktif servislerini güncelle
export async function PUT(request) {
  try {
    const { locksmithId, supabase } = await checkAuth(request);

    //request body'sini parse et
    const body = await request.json();
    const serviceIds = body.serviceIds;

    const upsertData = serviceIds.map(service => ({
      locksmithid: locksmithId,
      serviceid: service.serviceid,
      isactive: service.isactive,
      updatedat: new Date()
    }));
  
    const { data: updateData, error: updateError } = await supabase
      .from('locksmith_services')
      .upsert(upsertData, {
        onConflict: 'locksmithid,serviceid', // Çakışma durumunda birleşik anahtar kontrolü
        returning: 'minimal'
      });

    if (updateError) {
      console.error('Servisler güncellenirken bir hata oluştu:', updateError);
      return NextResponse.json({ error: 'Servisler güncellenirken bir hata oluştu' }, { status: 500 });
    }
    
    return NextResponse.json({ message: 'Servisler güncellendi' }, { status: 200 });
    
  } catch (error) {
    console.error('Servisler güncellenirken bir hata oluştu:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}