import { NextResponse } from 'next/server';
import { createRouteClient } from '../../utils';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    
    
    const serviceId = searchParams.get('serviceId');
    const districtId = searchParams.get('districtId');
    const provinceId = searchParams.get('provinceId');
    

    if (!serviceId) {
      return NextResponse.json({ error: "Bir hizmet seçmelisiniz" }, { status: 400 });
    }

    if (!districtId) {
      return NextResponse.json({ error: "Bir ilçe seçmelisiniz" }, { status: 400 });
    }

    const { supabase } = createRouteClient(request);

    // Şu anki gün ve saat bilgisini al
    const now = new Date();
    const currentDayOfWeek = now.getDay(); // 0 = Pazar, 6 = Cumartesi
    const currentTime = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`; 
    
    // Bugünün tam tarihini al (YYYY-MM-DD formatında)
    const today = new Date().toISOString().split('T')[0];

    // 1. Belirli servisi sunan aktif çilingirleri bul
    const { data: serviceLocksmiths, error: serviceError } = await supabase
      .from('locksmith_services')
      .select(`
        locksmithid,
        locksmiths!inner(
          id,
          businessname,
          fullname,
          tagline,
          phonenumber,
          provinceid,
          districtid,
          avgrating,
          totalreviewcount,
          profileimageurl,
          isverified,
          isactive,
          slug,
          services!inner(
            id,
            name,
            minPriceMesai,
            maxPriceMesai,
            minPriceAksam,
            maxPriceAksam,
            minPriceGece,
            maxPriceGece
          )
        )
      `)
      .eq('serviceid', serviceId)
      .eq('isactive', true)
      .eq('locksmiths.isactive', true);


    if (serviceError) {
      console.error("Servis sorgulamasında hata:", serviceError);
      return NextResponse.json({ error: "Çilingirler aranırken bir hata oluştu" }, { status: 500 });
    }

    // Çilingir ID'lerini çıkar
    const locksmithIds = serviceLocksmiths.map(item => item.locksmiths.id);
    
    if (locksmithIds.length === 0) {
      return NextResponse.json({ 
        locksmiths: [], 
        totalCount: 0,
        message: "Bu hizmeti sunan çilingir bulunamadı" 
      });
    }

    // 2. Bu çilingirlerin hizmet verdiği ilçeleri kontrol et
    // İlk olarak, hedef ilçede hizmet veren çilingirleri bulalım
    const { data: targetDistrictServices, error: targetDistrictError } = await supabase
      .from('locksmith_districts')
      .select('locksmithid, districtid, isdayactive, isnightactive')
      .in('locksmithid', locksmithIds)
      .eq('districtid', districtId);
    
    if (targetDistrictError) {
      console.error("Hedef ilçe sorgulamasında hata:", targetDistrictError);
      return NextResponse.json({ error: "Hizmet bölgeleri kontrol edilirken bir hata oluştu" }, { status: 500 });
    }
    
    // İl içindeki diğer ilçeleri bulalım
    const { data: provinceDistrictIds, error: provinceDistricsError } = await supabase
      .from('districts')
      .select('id')
      .eq('province_id', provinceId);
    
    if (provinceDistricsError) {
      console.error("İl ilçeleri sorgulamasında hata:", provinceDistricsError);
      return NextResponse.json({ error: "İl ilçeleri getirilirken bir hata oluştu" }, { status: 500 });
    }
    
    // İlçe ID'lerini bir listeye dönüştürelim
    const provinceDistrictIdList = provinceDistrictIds?.map(d => d.id) || [];
    
    // Hedef ilçe dışındaki diğer ilçelerde hizmet veren çilingirleri bulalım
    const { data: provinceServices, error: provinceServicesError } = await supabase
      .from('locksmith_districts')
      .select('locksmithid, districtid, isdayactive, isnightactive')
      .in('locksmithid', locksmithIds)
      .in('districtid', provinceDistrictIdList)
      .neq('districtid', districtId); // Hedef ilçeyi tekrar dahil etmemek için
    
    if (provinceServicesError) {
      console.error("İl hizmetleri sorgulamasında hata:", provinceServicesError);
      return NextResponse.json({ error: "İl hizmetleri getirilirken bir hata oluştu" }, { status: 500 });
    }
    
    // İki sorgu sonucunu birleştir
    const districtServices = [...(targetDistrictServices || []), ...(provinceServices || [])];

    // 3. Anahtar bakiyelerini kontrol et
    const { data: keyBalances, error: keyError } = await supabase
      .from('key_balance')
      .select('locksmithid, totalkeybalance')
      .in('locksmithid', locksmithIds);

    if (keyError) {
      console.error("Anahtar bakiyesi sorgulamasında hata:", keyError);
    }

    // İlçe ve illere göre grupla
    const districtServicesMap = {};
    
    districtServices.forEach(service => {
      if (!districtServicesMap[service.locksmithid]) {
        districtServicesMap[service.locksmithid] = {
          inTargetDistrict: false,
          inProvince: false
        };
      }
      
      if (parseInt(service.districtid) === parseInt(districtId)) {
        districtServicesMap[service.locksmithid].inTargetDistrict = true;
      } else {
        districtServicesMap[service.locksmithid].inProvince = true; 
      }
    });
    
    // Anahtar bakiyelerini eşle
    const keyBalanceMap = {};
    
    if (keyBalances) {
      keyBalances.forEach(balance => {
        keyBalanceMap[balance.locksmithid] = balance.totalkeybalance || 0;
      });
    }

    // 4. İl ve ilçe isimlerini al
    const { data: provinces, error: provinceError } = await supabase
      .from('provinces')
      .select('id, name');
      
    const { data: districts, error: districtNameError } = await supabase
      .from('districts')
      .select('id, name, province_id');
    
    // İl ve ilçe isimlerini eşle
    const provinceMap = {};
    const districtMap = {};
    
    if (provinces) {
      provinces.forEach(province => {
        provinceMap[province.id] = province.name;
      });
    }
    
    if (districts) {
      districts.forEach(district => {
        districtMap[district.id] = district.name;
      });
    }

    // Çilingirleri öncelik gruplarına ayır ve sırala
    const enrichedLocksmiths = serviceLocksmiths.map(item => {
      const locksmith = item.locksmiths;
      const districtService = districtServicesMap[locksmith.id] || { inTargetDistrict: false, inProvince: false };
      const keyBalance = keyBalanceMap[locksmith.id] || 0;
      
      // Öncelik grubu hesapla
      let positionGroup = 9; // Varsayılan en düşük öncelik
      
      if (keyBalance > 0 && districtService.inTargetDistrict) {
        positionGroup = 1; // Anahtar bakiyesi var ve ilçede hizmet veriyor
      } else if (keyBalance > 0 && districtService.inProvince) {
        positionGroup = 4; // Anahtar bakiyesi var ve ilde hizmet veriyor
      } else if (districtService.inTargetDistrict) {
        positionGroup = 6; // Anahtar bakiyesi yok ama ilçede hizmet veriyor
      } else if (districtService.inProvince) {
        positionGroup = 8; // Anahtar bakiyesi yok ve ilde hizmet veriyor
      }


      /**
       * - Mesai Saatleri & Ücretlendirme
        - **09:00 / 17:00 (Mesai)**
        - **17:00 / 21.00 (Akşam)**
        - 24:00 / 09:00 (Gece)
       */

        const now = new Date();
        const hour = now.getHours();

        let priceType;
        let price = {
            min: 0,
            max: 0
        };


        if (hour >= 9 && hour <= 16) {
        priceType = "mesai"; // 09:00 - 16:59
        price.min = locksmith.services.find(service => service.id === serviceId).minPriceMesai;
        price.max = locksmith.services.find(service => service.id === serviceId).maxPriceMesai;
        } else if (hour >= 17 && hour <= 20) {
        priceType = "aksam"; // 17:00 - 20:59
        price.min = locksmith.services.find(service => service.id === serviceId).minPriceAksam;
        price.max = locksmith.services.find(service => service.id === serviceId).maxPriceAksam;
        } else {
        priceType = "gece";  // 21:00 - 08:59
        price.min = locksmith.services.find(service => service.id === serviceId).minPriceGece;
        price.max = locksmith.services.find(service => service.id === serviceId).maxPriceGece;
        }

        
      
      
      return {
        id: locksmith.id,
        name: locksmith.businessname || "İsimsiz Çilingir",
        description: locksmith.tagline || "Bu çilingir hakkında bilgi bulunmuyor.",
        city: provinceMap[locksmith.provinceid] || "",
        district: districtMap[locksmith.districtid] || "",
        rating: locksmith.avgrating || 4.5,
        reviewCount: locksmith.totalreviewcount || 10,
        phone: locksmith.phonenumber || "",
        serviceIds: [serviceId],
        keyBalance: keyBalance,
        listPosition: positionGroup,
        isOpen: true, // Şimdilik hepsi açık varsayılıyor
        businessHours: '09:00 - 18:00', // Şimdilik sabit değer
        slug: locksmith.slug,
        price:{
            min: price.min,
            max: price.max
        },
        serviceNames: locksmith.services.map(service => service.name),
        coverageType: districtService.inTargetDistrict ? 'İlçede Hizmet Veriyor' : 'İlde Hizmet Veriyor',
        _raw: {
          inTargetDistrict: districtService.inTargetDistrict,
          inProvince: districtService.inProvince
        }
      };
    });
    
    // Öncelik grubuna göre sırala
    enrichedLocksmiths.sort((a, b) => {
      // Önce pozisyon grubuna göre
      if (a.listPosition !== b.listPosition) {
        return a.listPosition - b.listPosition;
      }
      // Pozisyon grubu aynıysa puana göre
      if (a.rating !== b.rating) {
        return b.rating - a.rating;
      }
      // Puan da aynıysa yorum sayısına göre
      return b.reviewCount - a.reviewCount;
    });
    
    // Sadece ilk 3 çilingiri gönder
    const topLocksmiths = enrichedLocksmiths.slice(0, 3);

    return NextResponse.json({ 
      locksmiths: topLocksmiths, 
      totalCount: enrichedLocksmiths.length,
      debug: {
        filters: {
          serviceId,
          districtId,
          provinceId,
          currentDayOfWeek,
          currentTime
        }
      }
    });
    
  } catch (error) {
    console.error("Çilingirler listelenirken hata:", error);
    return NextResponse.json({ error: "Beklenmeyen bir hata oluştu" }, { status: 500 });
  }
}