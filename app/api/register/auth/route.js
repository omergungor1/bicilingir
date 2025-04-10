import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Admin yetkisi ile işlem yapabilmek için service role key kullanılır
);

export async function POST(request) {
  try {
    const { email, password, fullName, phone } = await request.json();
    
    // Gerekli alanları kontrol et
    if (!email || !password || !fullName || !phone) {
      return NextResponse.json(
        { error: 'Tüm alanlar zorunludur' },
        { status: 400 }
      );
    }

    // Supabase Auth ile kullanıcı oluştur
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // E-posta onayını otomatik yap (daha sonra kaldırabilirsiniz)
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
          role:'cilingir',
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