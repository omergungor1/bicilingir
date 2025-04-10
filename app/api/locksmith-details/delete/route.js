import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Çilingir ID\'si belirtilmemiş' }, { status: 400 });
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Önce kaydın var olup olmadığını kontrol et
    const { data: existingData, error: checkError } = await supabase
      .from('locksmith_details')
      .select('locksmithid')
      .eq('locksmithid', id)
      .single();
    
    if (checkError && checkError.code === 'PGRST116') {
      return NextResponse.json({ 
        error: 'Belirtilen ID\'ye sahip çilingir detayı bulunamadı'
      }, { status: 404 });
    }
    
    // Kaydı sil
    const { error } = await supabase
      .from('locksmith_details')
      .delete()
      .eq('locksmithid', id);
    
    if (error) {
      console.error('Çilingir detayları silinirken hata:', error);
      return NextResponse.json({ 
        error: 'Çilingir detayları silinirken bir hata oluştu',
        details: error.message
      }, { status: 500 });
    }

    // Başarılı yanıt döndür
    return NextResponse.json({ 
      success: true,
      message: 'Çilingir detayları başarıyla silindi'
    });

  } catch (error) {
    console.error('Çilingir detayları silinirken bir hata oluştu:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
} 