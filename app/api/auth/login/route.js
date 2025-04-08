import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { createRouteClient } from '../../utils';

export async function POST(request) {
  const { email, password } = await request.json();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (name) => {
          const cookie = request.cookies.get(name)?.value;
          return cookie;
        },
        set: (name, value, options) => {
          // Bu API rotasında cookie ayarlamak için response'a eklememiz gerekiyor
          // API rotaları için kullanılacak cookie'ler NextResponse ile işlenecek
        },
        remove: (name, options) => {
          // API rotaları için kullanılacak cookie'ler NextResponse ile işlenecek
        },
      },
    }
  );

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Çilingir mi kontrol et - eğer çilingir ise kullanıcı tablosunu güncelle
    try {
      // Çilingir bilgisini kontrol et
      const { data: locksmithData, error: locksmithError } = await supabase
        .from('locksmiths')
        .select('id')
        .eq('authId', data.user.id)
        .single();

      // Eğer çilingirse bilgileri güncelle
      if (locksmithData && locksmithData.id) {
        // Route client oluştur
        const { supabase: routeClient } = createRouteClient(request);
        
        // Kullanıcı ID'sini bul veya oluştur
        const { data: userData, error: userError } = await routeClient
          .from('users')
          .select('id')
          .eq('userIp', request.headers.get('x-forwarded-for') || request.ip)
          .eq('userAgent', request.headers.get('user-agent'))
          .order('createdAt', { ascending: false })
          .limit(1);
          
        const userId = userData && userData.length > 0 ? userData[0].id : null;
        
        if (userId) {
          // Kullanıcı tablosunu güncelle
          const { data: updateData, error: updateError } = await routeClient
            .from('users')
            .update({
              islocksmith: true,
              locksmithId: locksmithData.id,
              updatedAt: new Date().toISOString()
            })
            .eq('id', userId);
            
          if (updateError) {
            console.error('Çilingir kullanıcı güncellenirken hata:', updateError);
          } else {
            console.log('Çilingir kullanıcı başarıyla güncellendi');
          }
        } else {
          console.log('Kullanıcı bulunamadı - yeni bir kullanıcı oluşturulacak');
          
          // Yeni bir kullanıcı oluştur
          const { v4: uuidv4 } = await import('uuid');
          const { data: newUserData, error: newUserError } = await routeClient
            .from('users')
            .insert({
              id: uuidv4(),
              userIp: request.headers.get('x-forwarded-for') || request.ip,
              userAgent: request.headers.get('user-agent'),
              islocksmith: true,
              locksmithId: locksmithData.id,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
            
          if (newUserError) {
            console.error('Çilingir kullanıcı oluşturulurken hata:', newUserError);
          } else {
            console.log('Çilingir kullanıcı başarıyla oluşturuldu');
          }
        }
      }
    } catch (userError) {
      console.error('Çilingir kullanıcı güncelleme hatası:', userError);
    }

    // Başarılı giriş yanıtı
    return NextResponse.json(
      { 
        user: data.user,
        session: data.session
      },
      { 
        status: 200,
        // Gerekli oturum çerezlerini ayarla
        headers: {
          'Set-Cookie': supabase.cookies.getAll().map(c => c.value).join('; '),
        } 
      }
    );
  } catch (error) {
    console.error('Giriş hatası:', error);
    return NextResponse.json(
      { error: 'Giriş işlemi sırasında bir hata oluştu' },
      { status: 500 }
    );
  }
} 