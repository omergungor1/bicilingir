import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function GET(request) {
  try {
    // Supabase istemcisi oluştur
    const response = NextResponse.next();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
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
    
    // Tüm illeri getir (id ve name sıralı şekilde)
    const { data: provinces, error } = await supabase
      .from('provinces')
      .select('id, name')
      .order('name');
    
    if (error) {
      console.error('İl listesi getirilirken bir hata oluştu:', error);
      return NextResponse.json({ error: 'İl listesi yüklenirken bir hata oluştu' }, { status: 500 });
    }

    return NextResponse.json({ provinces });
  } catch (error) {
    console.error('İl listesi getirilirken bir hata oluştu:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
