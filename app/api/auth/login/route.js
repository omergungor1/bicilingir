import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

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