import { getSupabaseServer } from '../../../../lib/supabase';
import { NextResponse } from 'next/server';

const supabase = getSupabaseServer();

export async function POST(request) {
  try {
    const {
      locksmithInsertData,
      locksmithDetailsInsertData,
      locksmithServicesInsertData,
      locksmithDistrictsInsertData,
      locksmithWorkingHoursInsertData
    } = await request.json();

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
          profileimageurl: locksmithInsertData.profileimageurl,
          isverified: locksmithInsertData.isverified || false,
          isactive: locksmithInsertData.isactive || false,
          status: 'pending',
          createdat: new Date().toISOString()
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

    //newsletter_subscribers tablosuna kayıt
    const { data: newsletterSubscribersData, error: newsletterSubscribersError } = await supabase
      .from('newsletter_subscribers')
      .insert([
        { email: locksmithInsertData.email }
      ])
      .select();

    if (newsletterSubscribersError) {
      console.error('Newsletter kayıt hatası:', newsletterSubscribersError);
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
          websiteurl: locksmithDetailsInsertData.websiteurl,
          startdate: locksmithDetailsInsertData.startdate,
          createdat: new Date().toISOString()
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
    // const { data: totalKeyBalanceData, error: totalKeyBalanceError } = await supabase
    //   .from('key_balance')
    //   .insert([
    //     {
    //       locksmithid: locksmithId,
    //       totalkeybalance: 300,
    //       lastupdated: new Date().toISOString()
    //     }
    //   ])
    //   .select();

    // if (totalKeyBalanceError) {
    //   console.error('Toplam anahtar bakiyesi kaydı hatası:', totalKeyBalanceError);
    //   return NextResponse.json(
    //     { error: totalKeyBalanceError.message },
    //     { status: 500 }
    //   );
    // }

    //YEni eklendi hata var mı kontrol et
    const { data: locksmithBalancesData, error: locksmithBalancesError } = await supabase
      .from('locksmith_balances')
      .insert([
        { locksmith_id: locksmithId, balance: 0, daily_spent_limit: 0, suggested_daily_limit: 200 }
      ])
      .select();

    if (locksmithBalancesError) {
      console.error('Çilingir bakiyesi kaydı hatası:', locksmithBalancesError);
      return NextResponse.json(
        { error: locksmithBalancesError.message },
        { status: 500 }
      );
    }


    //locksmith_traffic insert
    const { data: locksmithTrafficData, error: locksmithTrafficError } = await supabase
      .from('locksmith_traffic')
      .insert([
        { locksmith_id: locksmithId }
      ])
      .select();

    if (locksmithTrafficError) {
      console.error('Çilingir trafiği kaydı hatası:', locksmithTrafficError);
      return NextResponse.json(
        { error: locksmithTrafficError.message },
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
      isactive: true,
      // createdat: new Date().toISOString()
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

    // const dailyKeyPreferencesObjects = [{
    //   locksmithid: locksmithId,
    //   dayofweek: 0,
    //   keyamount: 60,
    //   isActive: true
    // }, {
    //   locksmithid: locksmithId,
    //   dayofweek: 1,
    //   keyamount: 60,
    //   isActive: true
    // }, {
    //   locksmithid: locksmithId,
    //   dayofweek: 2,
    //   keyamount: 60,
    //   isActive: true
    // }, {
    //   locksmithid: locksmithId,
    //   dayofweek: 3,
    //   keyamount: 60,
    //   isActive: true
    // }, {
    //   locksmithid: locksmithId,
    //   dayofweek: 4,
    //   keyamount: 60,
    //   isActive: true
    // }, {
    //   locksmithid: locksmithId,
    //   dayofweek: 5,
    //   keyamount: 60,
    //   isActive: true
    // }, {
    //   locksmithid: locksmithId,
    //   dayofweek: 6,
    //   keyamount: 60,
    //   isActive: true
    // }];

    // //daily_key_preferences tablosuna kayıt
    // const { data: dailyKeyPreferencesData, error: dailyKeyPreferencesError } = await supabase
    //   .from('daily_key_preferences')
    //   .insert(dailyKeyPreferencesObjects)
    //   .select();

    // if (dailyKeyPreferencesError) {
    //   console.error('Günlük anahtar tercihleri kaydı hatası:', dailyKeyPreferencesError);
    //   return NextResponse.json(
    //     { error: dailyKeyPreferencesError.message },
    //     { status: 500 }
    //   );
    // }

    const name = locksmithInsertData.fullname.split(' ')[0] || '';
    //Create a welcome notification
    const welcomeNotification = {
      locksmithid: locksmithId,
      title: 'Hoş Geldiniz',
      message: 'Merhaba ' + name + ', Bi Çilingire hoş geldin. Seni aramızda görmek çok güzel.',
      type: 'info',
      createdat: new Date().toISOString()
    }

    // const buyAndStartNotification = {
    //   locksmithid: locksmithId,
    //   title: 'Anahtar Paketlerini Gözden Geçirin',
    //   message: 'Anahtar paketlerini gözden geçirin ve başlamak için satın alın. Anahtar paketleri ile 10 kata kadar fazla görünürlük elde edebilirsin.',
    //   type: 'success',
    //   link: '/cilingir?tab=advertising',
    //   createdat: new Date().toISOString()
    // }

    const { data: welcomeNotificationData, error: welcomeNotificationError } = await supabase
      .from('notifications')
      .insert([welcomeNotification])
      .select();

    if (welcomeNotificationError) {
      console.error('Hoş Geldiniz bildirimi kaydı hatası:', welcomeNotificationError);
      return NextResponse.json(
        { error: welcomeNotificationError.message },
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
      // locksmithCertificatesInsertData,
      locksmithDocumentsInsertData
    } = await request.json();


    const imagesObjects = locksmithImagesInsertData?.images?.map(image => ({
      locksmith_id: locksmithid,
      image_url: image.image_url,
      is_profile: image.is_profile,
      display_order: image.display_order,
      is_main: false
    }));


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

    // const certificatesObjects = locksmithCertificatesInsertData?.certificates?.map(certificate => ({
    //   locksmithid: locksmithid,
    //   name: certificate.name || 'Yok',
    //   fileurl: certificate.url,
    //   createdat: new Date().toISOString()
    // }));


    // // locksmith_certificates tablosuna kayıt
    // const { data: locksmithCertificatesData, error: locksmithCertificatesError } = await supabase
    //   .from('locksmith_certificates')
    //   .insert(certificatesObjects)
    //   .select();

    // if (locksmithCertificatesError) {
    //   console.error('Çilingir sertifikaları kaydı hatası:', locksmithCertificatesError);
    //   return NextResponse.json(
    //     { error: locksmithCertificatesError.message },
    //     { status: 500 }
    //   );
    // }


    const documentsObjects = {
      locksmithid: locksmithid,
      name: 'İşletme Belgesi',
      fileurl: locksmithDocumentsInsertData?.documents?.url,
      createdat: new Date().toISOString()
    };

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