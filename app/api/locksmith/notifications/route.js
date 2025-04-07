import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**
 * CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    locksmithId UUID NOT NULL REFERENCES locksmiths(id),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL, -- 'info', 'warning', 'success', 'error' vb.
    link TEXT, -- Opsiyonel: Bildirime tıklandığında gidilecek sayfa/URL
    isRead BOOLEAN DEFAULT FALSE,
    isDismissed BOOLEAN DEFAULT FALSE,
    metadata JSONB, -- Ek bilgiler için esnek alan
    createdAt TIMESTAMPTZ DEFAULT NOW(),
    updatedAt TIMESTAMPTZ DEFAULT NOW()
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
    const { data: notificationsData, error: notificationsError } = await supabase
      .from('notifications')
      .select('*')
      .eq('locksmithid', locksmithId)
      .order('createdat', { ascending: false });
    
    if (notificationsError) {
      console.error('Bildirimler alınamadı:', notificationsError);
      return NextResponse.json({ error: 'Bildirimler yüklenirken bir hata oluştu' }, { status: 500 });
    }

    // Eğer çalışma saatleri yoksa varsayılan değerleri döndür
    const notifications = notificationsData && notificationsData.length > 0 
      ? notificationsData.map(notification => ({ ...notification, locksmithId }))
      : [];

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Bildirimler getirilirken bir hata oluştu:', error);
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
    const notificationUpdate = await request.json();
    
    // Bildirimi güncelle
    const { error: updateError } = await supabase
      .from('notifications')
      .update({
        isread: notificationUpdate.isread !== undefined ? notificationUpdate.isread : undefined,
        isdismissed: notificationUpdate.isdismissed !== undefined ? notificationUpdate.isdismissed : undefined,
      })
      .eq('id', notificationUpdate.id)
      .eq('locksmithid', locksmithId);
    
    if (updateError) {
      console.error('Bildirim güncellenirken hata:', updateError);
      return NextResponse.json({ 
        error: 'Bildirim güncellenirken bir hata oluştu',
        details: updateError.message
      }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Bildirim başarıyla güncellendi',
      success: true
    });
  } catch (error) {
    console.error('Bildirim güncellenirken bir hata oluştu:', error);
    return NextResponse.json({ 
      error: 'Bildirim güncellenirken bir hata oluştu',
      details: error.message
    }, { status: 500 });
  }
}