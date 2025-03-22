import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function POST(request) {
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
          // API rotaları için kullanılacak cookie'ler NextResponse ile işlenecek
        },
        remove: (name, options) => {
          // API rotaları için kullanılacak cookie'ler NextResponse ile işlenecek
        },
      },
    }
  );

  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Tüm Supabase oturum çerezlerini temizle
    const cookiesToClear = [
      'sb-access-token',
      'sb-refresh-token'
    ];
    
    const clearCookies = cookiesToClear.map(name => 
      `${name}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`
    );

    // Başarılı çıkış yanıtı
    return NextResponse.json(
      { success: true },
      { 
        status: 200,
        headers: {
          'Set-Cookie': clearCookies.join(', ')
        } 
      }
    );
  } catch (error) {
    console.error('Çıkış hatası:', error);
    return NextResponse.json(
      { error: 'Çıkış işlemi sırasında bir hata oluştu' },
      { status: 500 }
    );
  }
} 