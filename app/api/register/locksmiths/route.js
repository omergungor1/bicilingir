import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const {
      locksmithInsertData,
      locksmithDetailsInsertData,
      locksmithServicesInsertData,
      locksmithDistrictsInsertData,
      locksmithWorkingHoursInsertData
    } = await request.json();
    console.log('locksmithInsertData:',locksmithInsertData);
    
    // Gerekli alanların kontrolü
    if (!locksmithInsertData || !locksmithDetailsInsertData || !locksmithServicesInsertData || !locksmithDistrictsInsertData || !locksmithWorkingHoursInsertData) {
      return NextResponse.json(
        { error: 'Tüm zorunlu alanları doldurun' },
        { status: 400 }
      );
    }
    
    // Locksmiths tablosuna kayıt
    const { data, error } = await supabase
      .from('locksmiths')
      .insert([
        {
          authid: locksmithInsertData.authid,
          slug: locksmithInsertData.slug,
          provinceid: locksmithInsertData.provinceid,
          districtid: locksmithInsertData.districtid,
          businessname: locksmithInsertData.businessname,
          fullname: locksmithInsertData.fullname,
          tagline: locksmithInsertData.tagline,
          email: locksmithInsertData.email,
          phonenumber: locksmithInsertData.phonenumber,
          whatsappnumber: locksmithInsertData.phonenumber,
          customerlimitperhour: locksmithInsertData.customerlimitperhour || 5,
          profileimageurl: locksmithInsertData.profileimageurl,
          isverified: locksmithInsertData.isverified || false,
          isactive: locksmithInsertData.isactive || false,
          status: 'pending'
        }
      ])
      .select();
    
    if (error) {
      console.error('Çilingir kaydı hatası:', error);
      
      // Tekrarlanan alan hatası
      if (error.code === '23505') {
        const errorMessage = error.message.includes('email') 
          ? 'Bu e-posta adresi zaten kullanımda' 
          : error.message.includes('phone') 
            ? 'Bu telefon numarası zaten kullanımda' 
            : 'Bu bilgilerle daha önce bir kayıt oluşturulmuş';
        
        return NextResponse.json(
          { error: errorMessage },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const locksmithId = data[0].id;

    // locksmith_details tablosuna kayıt
    const { data: locksmithDetailsData, error: locksmithDetailsError } = await supabase
      .from('locksmith_details')
      .insert([
        {
          locksmithid: locksmithId,
          taxnumber: locksmithDetailsInsertData.taxnumber,
          fulladdress: locksmithDetailsInsertData.fulladdress,
          abouttext: locksmithDetailsInsertData.abouttext,
          instagram_url: locksmithDetailsInsertData.instagram_url,
          facebook_url: locksmithDetailsInsertData.facebook_url,
          tiktok_url: locksmithDetailsInsertData.tiktok_url,
          youtube_url: locksmithDetailsInsertData.youtube_url,
          websiteurl: locksmithDetailsInsertData.websiteurl,
          startdate: locksmithDetailsInsertData.startdate
        }
      ])
      .select();

    if (locksmithDetailsError) {
      console.error('Çilingir detayları kaydı hatası:', locksmithDetailsError);
      return NextResponse.json(
        { error: locksmithDetailsError.message },
        { status: 500 }
      );
    }
    //insert total key balance table
    const { data: totalKeyBalanceData, error: totalKeyBalanceError } = await supabase
      .from('key_balance')
      .insert([
        {
          locksmithid: locksmithId,
          totalkeybalance: 0,
          lastupdated: new Date().toISOString()
        }
      ])
      .select();

    if (totalKeyBalanceError) {
      console.error('Toplam anahtar bakiyesi kaydı hatası:', totalKeyBalanceError);
      return NextResponse.json(
        { error: totalKeyBalanceError.message },
        { status: 500 }
      );
    }



    const serviceObjects = locksmithServicesInsertData.services.map(serviceId => ({
      locksmithid: locksmithId,
      serviceid: serviceId,
      isactive: true,
      createdat: new Date().toISOString()
    }));

    // locksmith_services tablosuna kayıt
    const { data: locksmithServicesData, error: locksmithServicesError } = await supabase
      .from('locksmith_services')
      .insert(serviceObjects)
      .select();

    if (locksmithServicesError) {
      console.error('Çilingir hizmetleri kaydı hatası:', locksmithServicesError);
      return NextResponse.json(
        { error: locksmithServicesError.message },
        { status: 500 }
      );
    }

    const districtObjects = locksmithDistrictsInsertData.districts.map(districtId => ({
      locksmithid: locksmithId,
      provinceid: locksmithDistrictsInsertData.provinceid,
      districtid: districtId,
      isdayactive: true,
      isnightactive: true
    }));


    // locksmith_districts tablosuna kayıt
    const { data: locksmithDistrictsData, error: locksmithDistrictsError } = await supabase
      .from('locksmith_districts')
      .insert(districtObjects)
      .select();

    if (locksmithDistrictsError) {
      console.error('Çilingir bölgeleri kaydı hatası:', locksmithDistrictsError);
      return NextResponse.json(
        { error: locksmithDistrictsError.message },
        { status: 500 }
      );
    }

    const workingHoursObjects = locksmithWorkingHoursInsertData.workinghours.map(workingHour => ({
      locksmithid: locksmithId,
      dayofweek: workingHour.dayofweek,
      is24hopen: workingHour.is24hopen,
      isworking: workingHour.isworking,
      opentime: workingHour.opentime,
      closetime: workingHour.closetime
    }));


    // locksmith_working_hours tablosuna kayıt
    const { data: locksmithWorkingHoursData, error: locksmithWorkingHoursError } = await supabase
      .from('locksmith_working_hours')
      .insert(workingHoursObjects)
      .select();

    if (locksmithWorkingHoursError) {
      console.error('Çilingir çalışma saatleri kaydı hatası:', locksmithWorkingHoursError);
      return NextResponse.json(
        { error: locksmithWorkingHoursError.message },
        { status: 500 }
      );
    }

    const dailyKeyPreferencesObjects = [{
      locksmithid: locksmithId, 
      dayofweek: 0,
      keyamount: 60,  
      isactive: true
    },{
      locksmithid: locksmithId, 
      dayofweek: 1,
      keyamount: 60,
      isactive: true
    },{
      locksmithid: locksmithId, 
      dayofweek: 2,
      keyamount: 60,
      isactive: true
    },{
      locksmithid: locksmithId, 
      dayofweek: 3,
      keyamount: 60,
      isactive: true
    },{
      locksmithid: locksmithId, 
      dayofweek: 4,
      keyamount: 60,
      isactive: true
    },{
      locksmithid: locksmithId, 
      dayofweek: 5,
      keyamount: 60,
      isactive: true
    },{
      locksmithid: locksmithId, 
      dayofweek: 6,
      keyamount: 60,
      isactive: true
    }];

    //daily_key_preferences tablosuna kayıt
    const { data: dailyKeyPreferencesData, error: dailyKeyPreferencesError } = await supabase
      .from('daily_key_preferences')
      .insert(dailyKeyPreferencesObjects)
      .select();
    
    if (dailyKeyPreferencesError) {
      console.error('Günlük anahtar tercihleri kaydı hatası:', dailyKeyPreferencesError);
      return NextResponse.json(
        { error: dailyKeyPreferencesError.message },
        { status: 500 }
      );
    }

    // Başarılı yanıt
    return NextResponse.json(
      {
        message: 'Çilingir kaydı başarıyla oluşturuldu',
        locksmithid: locksmithId
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Beklenmeyen hata:', error);
    return NextResponse.json(
      { error: 'Çilingir kaydı sırasında bir hata oluştu' },
      { status: 500 }
    );
  }
} 



export async function PUT(request) {
  try {
    const {
      locksmithid,
      locksmithImagesInsertData,
      locksmithCertificatesInsertData,
      locksmithDocumentsInsertData
    } = await request.json();
    
    console.log('PUT:');
    console.log('locksmithid:',locksmithid);
    
    
    
    console.log('locksmithImagesInsertData:',locksmithImagesInsertData);
    const imagesObjects = locksmithImagesInsertData?.images?.map(image => ({
      locksmith_id: locksmithid,
      image_url: image.image_url,
      is_profile: image.is_profile,
      display_order: image.display_order,
      is_main: false
    }));
    console.log('imagesObjects:',imagesObjects);
    
    // locksmith_images tablosuna kayıt
    const { data: locksmithImagesData, error: locksmithImagesError } = await supabase
    .from('locksmith_images')
    .insert(imagesObjects)
    .select();
    
    if (locksmithImagesError) {
      console.error('Çilingir resimleri kaydı hatası:', locksmithImagesError);
      return NextResponse.json(
        { error: locksmithImagesError.message },
        { status: 500 }
      );
    }
    
    
    console.log('locksmithCertificatesInsertData:',locksmithCertificatesInsertData);
    const certificatesObjects = locksmithCertificatesInsertData?.certificates?.map(certificate => ({
      locksmithid: locksmithid,
      name: certificate.name||'Yok',
      fileurl: certificate.url,
      createdat: new Date().toISOString()
    }));
    console.log('certificatesObjects:',certificatesObjects);

    // locksmith_certificates tablosuna kayıt
    const { data: locksmithCertificatesData, error: locksmithCertificatesError } = await supabase
    .from('locksmith_certificates')
    .insert(certificatesObjects)
    .select();  
    
    if (locksmithCertificatesError) {
      console.error('Çilingir sertifikaları kaydı hatası:', locksmithCertificatesError);
      return NextResponse.json(
        { error: locksmithCertificatesError.message },
        { status: 500 }
      );
    }
    
    console.log('locksmithDocumentsInsertData:',locksmithDocumentsInsertData);
    
    const documentsObjects = {
      locksmithid: locksmithid,
      name: 'İşletme Belgesi',
      fileurl: locksmithDocumentsInsertData?.documents?.url,
      createdat: new Date().toISOString()
    };
    console.log('documentsObjects:',documentsObjects);

    // locksmith_documents tablosuna kayıt
    const { data: locksmithDocumentsData, error: locksmithDocumentsError } = await supabase
      .from('locksmith_documents')
      .insert(documentsObjects)
      .select();
      
    if (locksmithDocumentsError) {
      console.error('Çilingir belgeleri kaydı hatası:', locksmithDocumentsError);
      return NextResponse.json(
        { error: locksmithDocumentsError.message },
        { status: 500 }
      );
    }


    return NextResponse.json(
      {
        message: 'Çilingir ayarları başarıyla güncellendi',
        locksmithid: locksmithid
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Beklenmeyen hata:', error);
    return NextResponse.json(
      { error: 'Çilingir ayarları güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}