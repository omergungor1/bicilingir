import { NextResponse } from 'next/server';
import { checkAuth } from '../../utils';


// Çilingirin aktif ilçelerini getir
export async function GET(request) {
  try {
    const { locksmithId, supabase } = await checkAuth(request);

    if (!locksmithId) {
      return NextResponse.json({ error: 'Çilingir ID\'si gerekli' }, { status: 400 });
    }

    // Çilingirin aktif ilçelerini getir
    const { data: activeDistrictRecords, error: activeDistrictsError } = await supabase
      .from('locksmith_districts')
      .select('districtid, isdayactive, isnightactive')
      .eq('locksmithid', locksmithId);

    if (activeDistrictsError) {
      console.error('Aktif ilçeler getirilirken hata:', activeDistrictsError);
      return NextResponse.json({ error: 'Aktif ilçeler getirilirken bir hata oluştu' }, { status: 500 });
    }

    //locksmiths provinceid getir
    const { data: provinceId, error: provinceIdError } = await supabase
      .from('locksmiths')
      .select('provinceid')
      .eq('id', locksmithId)
      .single();

    if (provinceIdError) {
      console.error('İlçeler getirilirken bir hata oluştu 2:', provinceIdError);
      return NextResponse.json({ error: 'İlçeler yüklenirken bir hata oluştu' }, { status: 500 });
    }

    const { data: districts, error } = await supabase
      .from('districts')
      .select('*')
      .order('name', { ascending: true })
      .eq('province_id', provinceId.provinceid);

    if (error) {
      console.error('İlçeler getirilirken bir hata oluştu 1:', error);
      return NextResponse.json({ error: 'İlçeler yüklenirken bir hata oluştu' }, { status: 500 });
    }

    // İlçeleri döngüye al ve gündüz/gece aktiflik durumlarını ekle
    districts.forEach(district => {
      const activeRecord = activeDistrictRecords.find(record => record.districtid === district.id);
      district.isDayActive = activeRecord ? activeRecord.isdayactive || false : false;
      district.isNightActive = activeRecord ? activeRecord.isnightactive || false : false;
      // Geriye dönük uyumluluk için
      district.isLocksmithActive = activeRecord ? (activeRecord.isdayactive || activeRecord.isnightactive) : false;
    });


    return NextResponse.json({
      districts: districts
    });


  } catch (error) {
    console.error('Aktif ilçeler getirilirken bir hata oluştu:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

// Çilingirin aktif servislerini güncelle
export async function PUT(request) {
  try {
    const { locksmithId, supabase } = await checkAuth(request);

    if (!locksmithId) {
      return NextResponse.json({ error: 'Çilingir ID\'si gerekli' }, { status: 400 });
    }

    //request body'sini parse et
    const body = await request.json();
    const districtIds = body.districtIds;

    //mevcut kayıtları sil
    const { data: deleteData, error: deleteError } = await supabase
      .from('locksmith_districts')
      .delete()
      .eq('locksmithid', locksmithId);

    if (deleteError) {
      console.error('İlçeler silinirken bir hata oluştu:', deleteError);
      return NextResponse.json({ error: 'İlçeler silinirken bir hata oluştu' }, { status: 500 });
    }

    //en az bir zaman diliminde aktif olan ilçeleri al (gündüz veya gece)
    const activeDistricts = districtIds.filter(district => district.isdayactive || district.isnightactive);

    const insertData = activeDistricts.map(district => {
      return {
        locksmithid: locksmithId,
        provinceid: district.provinceid,
        districtid: district.districtid,
        isdayactive: district.isdayactive || false,
        isnightactive: district.isnightactive || false
      }
    });

    if (insertData.length === 0) {
      return NextResponse.json({ message: 'İlçeler güncellendi' }, { status: 200 });
    }

    const { data: updateData, error: updateError } = await supabase
      .from('locksmith_districts')
      .insert(insertData, { returning: 'minimal' });

    if (updateError) {
      console.error('İlçeler güncellenirken bir hata oluştu:', updateError);
      return NextResponse.json({ error: 'İlçeler güncellenirken bir hata oluştu' }, { status: 500 });
    }

    return NextResponse.json({ message: 'İlçeler güncellendi' }, { status: 200 });

  } catch (error) {
    console.error('İlçeler güncellenirken bir hata oluştu:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}