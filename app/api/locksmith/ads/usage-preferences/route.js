import { NextResponse } from 'next/server';
import { checkAuth } from '../../../utils';

export async function GET(request) {
  try {
    const { locksmithId, supabase } = await checkAuth(request);

    // Veritabanından mevcut günlük anahtar tercihlerini çek
    const { data, error } = await supabase
      .from('daily_key_preferences')
      .select('*')
      .eq('locksmithid', locksmithId);

    if (error) {
      console.error('Günlük anahtar tercihlerini çekerken hata:', error);
      return NextResponse.json({
        error: error.message,
      }, { status: 500 });
    } 

    // Türkçe gün isimleri
    const dayNames = [
      'Pazartesi', // 0
      'Salı', // 1
      'Çarşamba', // 2
      'Perşembe', // 3
      'Cuma', // 4
      'Cumartesi', // 5
      'Pazar' // 6
    ];

    // Tüm günleri içeren tam bir veri kümesi oluştur
    const completeData = {};
    
    // Varsayılan değerlerle başlangıç ​​verisi oluştur
    for (let i = 0; i < 7; i++) {
      completeData[i] = {
        dayofweek: i,
        dayname: dayNames[i],
        keyamount: 0,
        isactive: false,
        locksmithid: locksmithId
      };
    }

    
    // Veritabanından gelen verileri ekle
    if (data && data.length > 0) {
      data.forEach(item => {
        completeData[item.dayofweek] = {
          ...completeData[item.dayofweek],
          keyamount: item.keyamount || 0,
          isactive: item.isActive !== undefined ? item.isActive : false
        };
      });
    }
    
    // Veriyi günlere göre sıralı diziye dönüştür
    const resultArray = Object.values(completeData);

    return NextResponse.json({
      success: true,
      data: resultArray,
    });
  } catch (error) {
    console.error('Günlük anahtar tercihleri API hatası:', error);
    return NextResponse.json({
      error: 'Sunucu hatası',
      details: error.message
    }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { locksmithId, supabase } = await checkAuth(request);
    const {dailyKeys} = await request.json();

    //Object bekleniyor
    if (typeof dailyKeys !== 'object') {
      return NextResponse.json({
        error: 'Geçersiz veri formatı. Nesne bekleniyor.',
      }, { status: 400 });
    }

    
    // Önce bu çilingire ait tüm kayıtları sil
    const { error: deleteError } = await supabase
      .from('daily_key_preferences')
      .delete()
      .eq('locksmithid', locksmithId);
      
    if (deleteError) {
      console.error('Mevcut tercihler silinirken hata:', deleteError);
      return NextResponse.json({
        error: 'Tercihler güncellenirken bir hata oluştu',
        details: deleteError.message
      }, { status: 500 });
    }

    if (Object.keys(dailyKeys).length === 0 || Object.keys(dailyKeys).length !== 7) {
      return NextResponse.json({
        error: 'Geçersiz veri formatı. 7 gün tercihi gerekiyor.',
      }, { status: 400 });
    }


    // Yeni kayıtları ekle
    const dataToInsert = Object.values(dailyKeys).map(pref => ({
      locksmithid: locksmithId,
      dayofweek: pref.dayofweek,
      keyamount: pref.keyamount || 0,
      isActive: pref.isactive || false
    }));
    
    const { error: insertError } = await supabase
      .from('daily_key_preferences')
      .insert(dataToInsert);
      
    if (insertError) {
      console.error('Yeni tercihler eklenirken hata:', insertError);
      return NextResponse.json({
        error: 'Tercihler güncellenirken bir hata oluştu',
        details: insertError.message
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      message: "Günlük anahtar tercihleri başarıyla güncellendi",
    });
  } catch (error) {
    console.error('Günlük anahtar tercihleri güncelleme hatası:', error);
    return NextResponse.json({
      error: 'Sunucu hatası',
      details: error.message
    }, { status: 500 });
  }
} 