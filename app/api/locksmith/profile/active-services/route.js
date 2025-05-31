import { NextResponse } from 'next/server';
import { getLocksmithId } from '../../../utils';


// Çilingirin aktif servislerini getir
export async function GET(request) {
  try {
    const { locksmithId, supabase } = await getLocksmithId(request);

    if (!locksmithId) {
      return NextResponse.json({ error: 'Çilingir ID\'si gerekli' }, { status: 400 });
    }

    // Çilingirin aktif servislerini getir
    const { data: activeServiceRecords, error: activeServicesError } = await supabase
      .from('locksmith_services')
      .select('serviceid, isactive')
      .eq('locksmithid', locksmithId);

    if (activeServicesError) {
      console.error('Aktif servisler getirilirken hata:', activeServicesError);
      return NextResponse.json({ error: 'Aktif servisler getirilirken bir hata oluştu' }, { status: 500 });
    }

    const { data: services, error } = await supabase
      .from('services')
      .select('*')
      .eq('isActive', true)
      .order('name', { ascending: true });

    if (error) {
      console.error('Hizmetler getirilirken bir hata oluştu 1:', error);
      return NextResponse.json({ error: 'Hizmetler yüklenirken bir hata oluştu' }, { status: 500 });
    }

    // Aktif servislerin ID'lerini çıkar
    const activeServiceIds = activeServiceRecords
      .filter(record => record.isactive)
      .map(record => record.serviceid);

    //sevices içine isLocksmithActive ekle
    services.forEach(service => {
      service.isLocksmithActive = activeServiceIds.includes(service.id);
    });


    return NextResponse.json({
      services: services
    });


  } catch (error) {
    console.error('Aktif servisler getirilirken bir hata oluştu:', error);
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
    const serviceid = body.serviceid;
    const isactive = body.isactive;

    if (isactive) {
      const { data: insertData, error: insertError } = await supabase
        .from('locksmith_services')
        .insert({
          locksmithid: locksmithId,
          serviceid: serviceid,
          isactive: true
        });

      if (insertError) {
        console.error('Servisler güncellenirken bir hata oluştu:', insertError);
        return NextResponse.json({ error: 'Servisler güncellenirken bir hata oluştu' }, { status: 500 });
      }
    } else {
      //mevcut kayıtları sil
      const { data: deleteData, error: deleteError } = await supabase
        .from('locksmith_services')
        .delete()
        .eq('locksmithid', locksmithId)
        .eq('serviceid', serviceid);

      if (deleteError) {
        console.error('Servisler silinirken bir hata oluştu:', deleteError);
        return NextResponse.json({ error: 'Servisler silinirken bir hata oluştu' }, { status: 500 });
      }
    }

    return NextResponse.json({ message: 'Servisler güncellendi' }, { status: 200 });


    // const upsertData = serviceIds.map(service => ({
    //   locksmithid: locksmithId,
    //   serviceid: service.serviceid,
    //   isactive: service.isactive,
    //   updatedat: new Date()
    // }));

    // const { data: updateData, error: updateError } = await supabase
    //   .from('locksmith_services')
    //   .upsert(upsertData, {
    //     onConflict: 'locksmithid,serviceid', // Çakışma durumunda birleşik anahtar kontrolü
    //     returning: 'minimal'
    //   });

    // if (updateError) {
    //   console.error('Servisler güncellenirken bir hata oluştu:', updateError);
    //   return NextResponse.json({ error: 'Servisler güncellenirken bir hata oluştu' }, { status: 500 });
    // }

    // return NextResponse.json({ message: 'Servisler güncellendi' }, { status: 200 });

  } catch (error) {
    console.error('Servisler güncellenirken bir hata oluştu:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}