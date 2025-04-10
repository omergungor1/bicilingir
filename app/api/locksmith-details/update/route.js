import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function PUT(request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Çilingir ID\'si belirtilmemiş' }, { status: 400 });
    }

    const supabase = createRouteHandlerClient({ cookies });
    const updateData = await request.json();

    // Boş güncelleme verisi kontrolü
    if (!updateData || Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'Güncellenecek veri bulunamadı' }, { status: 400 });
    }

    // Önce mevcut kaydın var olup olmadığını kontrol et
    const { data: existingData, error: checkError } = await supabase
      .from('locksmith_details')
      .select('locksmithid')
      .eq('locksmithid', id)
      .single();
    
    let updateResult;
    
    if (checkError && checkError.code === 'PGRST116') {
      // Kayıt bulunamadı, insert yapalım
      updateResult = await supabase
        .from('locksmith_details')
        .insert({ locksmithid: id, ...updateData });
    } else {
      // Kayıt bulundu, update yapalım
      updateResult = await supabase
        .from('locksmith_details')
        .update(updateData)
        .eq('locksmithid', id);
    }
    
    if (updateResult.error) {
      console.error('Çilingir detayları güncellenirken hata:', updateResult.error);
      return NextResponse.json({ 
        error: 'Çilingir detayları güncellenirken bir hata oluştu',
        details: updateResult.error.message
      }, { status: 500 });
    }

    // Başarılı yanıt döndür
    return NextResponse.json({ 
      success: true,
      message: 'Çilingir detayları başarıyla güncellendi',
      data: updateData
    });

  } catch (error) {
    console.error('Çilingir detayları güncellenirken bir hata oluştu:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
} 