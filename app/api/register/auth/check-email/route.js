import { getSupabaseServer } from '../../../../../lib/supabase';
import { NextResponse } from 'next/server';

// locksmiths tablosuna erişim için SERVICE_ROLE_KEY kullanıyoruz
// Bu, henüz kimlik doğrulaması yapmamış kullanıcıların (kayıt sırasında) 
// e-posta kontrolü yapabilmesi için gereklidir
const supabase = getSupabaseServer();

export async function POST(request) {
  try {
    const { email, phone } = await request.json();

    // E-posta formatını kontrol et
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Geçerli bir e-posta adresi girin' },
        { status: 400 }
      );
    }

    const { data: locksmithData, error: locksmithError } = await supabase
      .from('locksmiths')
      .select('email,phonenumber')
      .or(`email.eq.${email},phonenumber.eq.${phone}`)
      .limit(1);

    if (locksmithError) {
      console.error('Çilingir e-posta kontrolü sırasında hata:', locksmithError);
      return NextResponse.json({ exists: false });
    }

    if (locksmithData && locksmithData.length > 0) {
      return NextResponse.json({ exists: true });
    }

    return NextResponse.json({ exists: false });
  } catch (error) {
    console.error('E-posta kontrolü sırasında beklenmeyen hata:', error);
    return NextResponse.json(
      { error: 'E-posta kontrolü sırasında bir hata oluştu' },
      { status: 500 }
    );
  }
}
