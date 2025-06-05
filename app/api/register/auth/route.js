import { getSupabaseServer } from '../../../../lib/supabase';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  // Service role ile Supabase istemcisi oluştur
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  // Normal Supabase istemcisi
  const supabase = getSupabaseServer();

  try {
    const { email, password, fullName, phone } = await request.json();

    // Gerekli alanları kontrol et
    if (!email || !password || !fullName || !phone) {
      return NextResponse.json(
        { error: 'Tüm alanlar zorunludur' },
        { status: 400 }
      );
    }


    // Service role ile kullanıcı oluştur (e-posta doğrulaması olmadan)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        phone: phone
      }
    });

    if (authError) {
      console.error('Kullanıcı oluşturma hatası:', authError);

      // E-posta zaten kullanılıyorsa
      if (authError.message.includes('email already in use')) {
        return NextResponse.json(
          { error: 'Bu e-posta adresi zaten kullanımda' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: authError.message },
        { status: 500 }
      );
    }

    //user_roles tablosuna kayıt
    const { data: userRolesData, error: userRolesError } = await supabase
      .from('user_roles')
      .insert([
        {
          user_id: authData.user.id,
          role: 'cilingir',
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (userRolesError) {
      console.error('Kullanıcı rolü kayıt hatası:', userRolesError);
    }

    // Başarılı yanıt
    return NextResponse.json(
      {
        message: 'Kullanıcı başarıyla oluşturuldu',
        id: authData.user.id
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Beklenmeyen hata:', error);
    return NextResponse.json(
      { error: 'Kullanıcı oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
} 