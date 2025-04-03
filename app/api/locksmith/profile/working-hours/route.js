import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

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
    
    if (userRole !== 'cilingir' && userRole !== 'admin') {
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

    // Çalışma saatlerini getir
    const { data: workingHoursData, error: workingHoursError } = await supabase
      .from('locksmith_working_hours')
      .select('*')
      .eq('locksmithid', locksmithId)
      .order('dayofweek', { ascending: true });
    
    if (workingHoursError) {
      console.error('Çalışma saatleri alınamadı:', workingHoursError);
      return NextResponse.json({ error: 'Çalışma saatleri yüklenirken bir hata oluştu' }, { status: 500 });
    }

    // Eğer çalışma saatleri yoksa varsayılan değerleri döndür
    const workingHours = workingHoursData && workingHoursData.length > 0 
      ? workingHoursData.map(hours => ({ ...hours, locksmithId }))
      : [];

    return NextResponse.json(workingHours);
  } catch (error) {
    console.error('Çalışma saatleri getirilirken bir hata oluştu:', error);
    return NextResponse.json([]);
  }
}

export async function PUT(request) {
  try {
    // Cookie işleme işlemleri (GET metodundakiyle aynı)
    const cookieHeader = request.headers.get('cookie');
    const supabaseCookieMatch = cookieHeader && cookieHeader.match(/sb-\w+-auth-token=([^;]+)/);
    const supabaseCookieValue = supabaseCookieMatch ? supabaseCookieMatch[1] : null;
    
    let parsedCookieValue = null;
    try {
      const decodedCookie = supabaseCookieValue ? decodeURIComponent(supabaseCookieValue) : null;
      if (decodedCookie && decodedCookie.startsWith('[') && decodedCookie.endsWith(']')) {
        parsedCookieValue = JSON.parse(decodedCookie);
      }
    } catch (e) {
      console.error('Cookie parse hatası:', e);
    }
    
    // Supabase istemcisi oluştur
    let response = NextResponse.next();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            if (name.includes('auth-token') && parsedCookieValue) {
              return JSON.stringify(parsedCookieValue);
            }
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
    
    // Oturum tokenlarını ayarla
    if (parsedCookieValue && Array.isArray(parsedCookieValue) && parsedCookieValue.length >= 2) {
      const accessToken = parsedCookieValue[0];
      const refreshToken = parsedCookieValue[1];
      
      await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      });
    }
    
    // Oturum kontrolü
    const { data: authData } = await supabase.auth.getSession();
    const session = authData?.session;
    
    if (!session) {
      return NextResponse.json({ error: 'Oturum açmalısınız' }, { status: 401 });
    }
    
    // Kullanıcı ve rol kontrolü
    const userId = session.user.id;
    
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();
    
    if (roleError || !roleData) {
      return NextResponse.json({ error: 'Rol bilgisi alınamadı' }, { status: 500 });
    }
    
    if (roleData.role !== 'cilingir' && roleData.role !== 'admin') {
      return NextResponse.json({ error: 'Bu API sadece çilingirler tarafından kullanılabilir' }, { status: 403 });
    }
    
    // Çilingir ID'sini al
    const { data: locksmithData, error: locksmithError } = await supabase
      .from('locksmiths')
      .select('id')
      .eq('authid', userId)
      .single();
      
    if (locksmithError) {
      return NextResponse.json({ error: 'Çilingir bilgileriniz bulunamadı' }, { status: 404 });
    }
    
    const locksmithId = locksmithData.id;
    
    // Gelen JSON verisini analiz et
    const updatedWorkingHours = await request.json();
    
    if (!Array.isArray(updatedWorkingHours)) {
      return NextResponse.json({ error: 'Geçersiz veri formatı' }, { status: 400 });
    }
    
    // Her bir gün için veritabanını güncelle
    const updatePromises = updatedWorkingHours.map(async (dayData) => {
      // ID varsa güncelle, yoksa yeni kayıt oluştur
      if (dayData.id) {
        const { data, error } = await supabase
          .from('locksmith_working_hours')
          .update({
            isworking: dayData.isworking,
            opentime: dayData.opentime,
            closetime: dayData.closetime,
            is24hopen: dayData.is24hopen
          })
          .eq('id', dayData.id)
          .eq('locksmithid', locksmithId);
        
        if (error) throw error;
        return data;
      } else {
        // Yeni kayıt oluştur
        const { data, error } = await supabase
          .from('locksmith_working_hours')
          .insert({
            locksmithid: locksmithId,
            dayofweek: dayData.dayofweek,
            isworking: dayData.isworking,
            opentime: dayData.opentime,
            closetime: dayData.closetime,
            is24hopen: dayData.is24hopen
          });
        
        if (error) throw error;
        return data;
      }
    });
    
    // Tüm güncellemeleri tamamla
    await Promise.all(updatePromises);
    
    return NextResponse.json({ 
      message: 'Çalışma saatleri başarıyla güncellendi'
    });
  } catch (error) {
    console.error('Çalışma saatleri güncellenirken bir hata oluştu:', error);
    return NextResponse.json({ 
      error: 'Çalışma saatleri güncellenirken bir hata oluştu',
      details: error.message
    }, { status: 500 });
  }
}