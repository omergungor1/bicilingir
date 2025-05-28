import { NextResponse } from 'next/server';
import { checkAuth } from '../../utils';

export async function GET(request) {
  try {
    const { locksmithId, supabase } = await checkAuth(request);

    if (!locksmithId) {
      return NextResponse.json({ error: 'Çilingir ID\'si gerekli' }, { status: 400 });
    }

    // Çilingir bilgilerini getir
    const { data: locksmith, error: locksmithError } = await supabase
      .from('locksmiths')
      .select('*')
      .eq('id', locksmithId)
      .single();

    if (locksmithError) {
      console.error('Çilingir profili getirilirken bir hata oluştu:', locksmithError);
      return NextResponse.json({ error: 'Çilingir profili yüklenirken bir hata oluştu' }, { status: 500 });
    }

    if (!locksmith) {
      return NextResponse.json({ error: 'Çilingir profili bulunamadı' }, { status: 404 });
    }

    // Çilingir detaylarını getir
    const { data: locksmithDetail, error: detailError } = await supabase
      .from('locksmith_details')
      .select('*')
      .eq('locksmithid', locksmithId)
      .single();

    if (detailError && detailError.code !== 'PGRST116') { // PGRST116: Kayıt bulunamadı hatası
      console.error('Çilingir detayları getirilirken bir hata oluştu:', detailError);
      return NextResponse.json({ error: 'Çilingir detayları yüklenirken bir hata oluştu' }, { status: 500 });
    }

    return NextResponse.json({
      locksmith: { ...locksmith, ...locksmithDetail } || null
    });
  } catch (error) {
    console.error('Çilingir profili getirilirken bir hata oluştu:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { locksmithId, supabase } = await checkAuth(request);

    if (!locksmithId) {
      return NextResponse.json({ error: 'Çilingir ID\'si gerekli' }, { status: 400 });
    }

    // Gelen verileri al
    const requestData = await request.json();

    // Hangi tablo için hangi alanların güncelleneceğini belirle
    const locksmithFields = [
      'businessname', 'fullname', 'tagline', 'email', 'phonenumber', 'whatsappnumber', 'provinceid', 'districtid'
    ];

    const detailFields = [
      'abouttext', 'taxnumber', 'fulladdress', 'websiteurl', 'lat', 'lng'
    ];

    // locksmiths tablosu için güncelleme verileri
    const locksmithUpdateData = {};
    locksmithFields.forEach(field => {
      if (requestData[field] !== undefined) {
        locksmithUpdateData[field] = requestData[field];
      }
    });

    // locksmith_details tablosu için güncelleme verileri
    const detailUpdateData = {};
    detailFields.forEach(field => {
      if (requestData[field] !== undefined) {
        detailUpdateData[field] = requestData[field];
      }
    });

    // Tabloları ayrı ayrı güncelle
    let locksmithUpdateError = null;
    let detailUpdateError = null;

    // locksmiths tablosunu güncelle
    if (Object.keys(locksmithUpdateData).length > 0) {
      const { error } = await supabase
        .from('locksmiths')
        .update(locksmithUpdateData)
        .eq('id', locksmithId);

      if (error) {
        console.error('Çilingir bilgileri güncellenirken hata:', error);
        locksmithUpdateError = error;
      }
    }

    // locksmith_details tablosunu güncelle
    if (Object.keys(detailUpdateData).length > 0) {
      // Önce kaydın var olup olmadığını kontrol et
      const { data, error: checkError } = await supabase
        .from('locksmith_details')
        .select('locksmithid')
        .eq('locksmithid', locksmithId)
        .single();

      let updateError = null;

      if (checkError && checkError.code === 'PGRST116') {
        // Kayıt bulunamadı, insert yapalım
        const { error } = await supabase
          .from('locksmith_details')
          .insert({ locksmithid: locksmithId, ...detailUpdateData });

        updateError = error;
      } else {
        // Kayıt bulundu, update yapalım
        const { error } = await supabase
          .from('locksmith_details')
          .update(detailUpdateData)
          .eq('locksmithid', locksmithId);

        updateError = error;
      }

      if (updateError) {
        console.error('Çilingir detayları güncellenirken hata:', updateError);
        detailUpdateError = updateError;
      }
    }

    // Hatalar varsa bildir
    if (locksmithUpdateError || detailUpdateError) {
      return NextResponse.json({
        error: 'Profil güncellenirken bir hata oluştu',
        locksmithError: locksmithUpdateError ? locksmithUpdateError.message : null,
        detailError: detailUpdateError ? detailUpdateError.message : null
      }, { status: 500 });
    }

    // Başarılı yanıt döndür
    return NextResponse.json({
      success: true,
      message: 'Profil başarıyla güncellendi'
    });

  } catch (error) {
    console.error('Çilingir profili güncellenirken bir hata oluştu:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
} 