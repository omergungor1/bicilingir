import { NextResponse } from 'next/server';
import { getLocksmithId } from '../../utils';


// Çilingirin aktif ilçelerini getir
export async function GET(request) {
  try {
    const { locksmithId, supabase } = await getLocksmithId(request);

    if (!locksmithId) {
      return NextResponse.json({ error: 'Çilingir ID\'si gerekli' }, { status: 400 });
    }

    // Çilingirin aktif ilçelerini getir
    const { data: activeDistrictRecords, error: activeDistrictsError } = await supabase
      .from('locksmith_districts')
      .select('districtid, isactive')
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

    // İlçeleri döngüye al ve aktiflik durumunu ekle
    districts.forEach(district => {
      const activeRecord = activeDistrictRecords.find(record => record.districtid === district.id);
      district.isActive = activeRecord ? activeRecord.isactive || false : false;
      // Geriye dönük uyumluluk için
      district.isLocksmithActive = district.isActive;
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
    const { locksmithId, supabase } = await getLocksmithId(request);

    if (!locksmithId) {
      return NextResponse.json({ error: 'Çilingir ID\'si gerekli' }, { status: 400 });
    }

    //request body'sini parse et
    const body = await request.json();
    const provinceid = body.provinceid;
    const districtid = body.districtid;
    const isactive = body.isactive;

    if (isactive) {
      //insert edilecek
      const { data: insertData, error: insertError } = await supabase
        .from('locksmith_districts')
        .insert({
          locksmithid: locksmithId,
          provinceid: provinceid,
          districtid: districtid,
          isactive: true
        });

      if (insertError) {
        console.error('İlçeler güncellenirken bir hata oluştu:', insertError);
        return NextResponse.json({ error: 'İlçeler güncellenirken bir hata oluştu' }, { status: 500 });
      }
    } else {
      //mevcut kayıtları sil
      const { data: deleteData, error: deleteError } = await supabase
        .from('locksmith_districts')
        .delete()
        .eq('locksmithid', locksmithId)
        .eq('provinceid', provinceid)
        .eq('districtid', districtid);

      if (deleteError) {
        console.error('İlçeler silinirken bir hata oluştu:', deleteError);
        return NextResponse.json({ error: 'İlçeler silinirken bir hata oluştu' }, { status: 500 });
      }
    }

    return NextResponse.json({ message: 'İlçeler güncellendi' }, { status: 200 });

    //mevcut kayıtları sil
    const { data: deleteData, error: deleteError } = await supabase
      .from('locksmith_districts')
      .delete()
      .eq('locksmithid', locksmithId);

    if (deleteError) {
      console.error('İlçeler silinirken bir hata oluştu:', deleteError);
      return NextResponse.json({ error: 'İlçeler silinirken bir hata oluştu' }, { status: 500 });
    }

    //aktif olan ilçeleri al
    const activeDistricts = districtIds.filter(district => district.isactive);

    console.log(activeDistricts);

    const insertData = activeDistricts.map(district => {
      return {
        locksmithid: locksmithId,
        provinceid: district.provinceid,
        districtid: district.districtid,
        isactive: district.isactive || false
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