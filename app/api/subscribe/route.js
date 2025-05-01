import { getSupabaseServer } from '../../../lib/supabase';
import { NextResponse } from 'next/server';

const supabase = getSupabaseServer();

export async function POST(request) {
  try {
    const { email } = await request.json();

    // E-posta formatını kontrol et
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Geçerli bir e-posta adresi girin' },
        { status: 400 }
      );
    }

    // E-posta adresinin zaten kayıtlı olup olmadığını kontrol et
    const { data: existingSubscriber, error: checkError } = await supabase
      .from('newsletter_subscribers')
      .select('id, email, unsubscribed')
      .eq('email', email)
      .maybeSingle();

    if (checkError) {
      console.error('E-posta kontrolü hatası:', checkError);
      return NextResponse.json(
        { error: 'Abonelik işlemi sırasında bir hata oluştu' },
        { status: 500 }
      );
    }


    // Eğer abone zaten varsa ama unsubscribed=true ise, aboneliği yeniden aktifleştir
    if (existingSubscriber && existingSubscriber.unsubscribed) {
      const { error: updateError } = await supabase
        .from('newsletter_subscribers')
        .update({
          unsubscribed: false,
          unsubscribe_at: null
        })
        .eq('id', existingSubscriber.id);

      if (updateError) {
        console.error('Abonelik güncelleme hatası:', updateError);
        return NextResponse.json(
          { error: 'Abonelik işlemi sırasında bir hata oluştu' },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { message: 'Bülten aboneliğiniz yeniden aktifleştirildi' },
        { status: 200 }
      );
    }

    // Yeni abone ekle
    const { error: insertError } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email }]);

    if (insertError) {
      console.error('Abonelik ekleme hatası:', insertError);

      // Eğer e-posta adresi zaten kayıtlıysa (unique constraint hatası)
      if (insertError.code === '23505') {
        return NextResponse.json(
          { message: 'Bu e-posta adresi zaten bültenimize kayıtlı' },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { error: 'Abonelik işlemi sırasında bir hata oluştu' },
        { status: 500 }
      );
    }

    // Başarılı yanıt
    return NextResponse.json(
      { message: 'Bülten aboneliğiniz başarıyla tamamlandı' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Abonelik işlemi sırasında beklenmeyen hata:', error);
    return NextResponse.json(
      { error: 'Abonelik işlemi sırasında bir hata oluştu' },
      { status: 500 }
    );
  }
} 