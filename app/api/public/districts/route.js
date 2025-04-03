import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function GET(request) {
  try {
    // URL'den il ID'sini al
    const { searchParams } = new URL(request.url);
    const provinceId = searchParams.get('province_id');
    
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
    
    let query = supabase
      .from('districts')
      .select('id, name, province_id')
      .order('name');
    
    // Eğer il ID'si belirtilmişse, sadece o ile ait ilçeleri getir
    if (provinceId) {
      query = query.eq('province_id', provinceId);
    }
    
    const { data: districts, error } = await query;
    
    if (error) {
      console.error('İlçe listesi getirilirken bir hata oluştu:', error);
      return NextResponse.json({ error: 'İlçe listesi yüklenirken bir hata oluştu' }, { status: 500 });
    }

    return NextResponse.json({ districts });
  } catch (error) {
    console.error('İlçe listesi getirilirken bir hata oluştu:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
