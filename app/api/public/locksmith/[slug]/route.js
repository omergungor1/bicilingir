import { NextResponse } from 'next/server';
import { createRouteClient } from '../../../utils';

export async function GET(request, { params }) {
  try {
    // Slug parametresini al - params artık bir Promise
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    if (!slug) {
      return NextResponse.json({ error: "Geçersiz çilingir bilgisi" }, { status: 400 });
    }

    // Supabase istemcisi oluştur
    const { supabase } = createRouteClient(request);

    // 1. Çilingiri slug'a göre bul
    const { data: locksmith, error: locksmithError } = await supabase
      .from('locksmiths')
      .select(`
      id,
      authid,
      businessname,
      fullname,
      phonenumber,
      whatsappnumber,
      email,
      provinceid,
      districtid,
      tagline,
      avgrating,
      totalreviewcount,
      isverified,
      isactive,
      slug,
      locksmith_images (
        image_url,
        is_main,
        is_profile
      ),
      locksmith_working_hours (
        dayofweek,
        is24hopen,
        isworking,
        opentime,
        closetime
      ),
      locksmith_certificates (
        id,
        name,
        fileurl,
        filetype
      )
    `)
      .eq('slug', slug)
      .eq('isactive', true)
      .single();

    if (locksmith?.locksmith_working_hours) {
      //çilingir çalışma günlerini listele -> dayofweek'e göre sırala
      const sortedWorkingHours = locksmith?.locksmith_working_hours?.sort((a, b) => a.dayofweek - b.dayofweek);
      locksmith.locksmith_working_hours = sortedWorkingHours;
    }

    if (locksmithError) {
      console.error('Çilingir bulunamadı:', locksmithError);
      return NextResponse.json({ error: "Çilingir bulunamadı" }, { status: 404 });
    }

    // 2. Çilingir detaylarını getir
    const { data: locksmithDetail, error: detailError } = await supabase
      .from('locksmith_details')
      .select('*')
      .eq('locksmithid', locksmith.id)
      .single();

    // 3. Çilingirin hizmetlerini getir
    const { data: locksmithServices, error: servicesError } = await supabase
      .from('locksmith_services')
      .select(`
        serviceid,
        services (
          id,
          name,
          minPriceMesai,
          maxPriceMesai,
          minPriceAksam,
          maxPriceAksam,
          minPriceGece,
          maxPriceGece
        )
      `)
      .eq('locksmithid', locksmith.id)
      .eq('isactive', true);

    // 4. İl ve ilçe bilgilerini getir
    const { data: province, error: provinceError } = await supabase
      .from('provinces')
      .select('id, name')
      .eq('id', locksmith.provinceid)
      .single();

    const { data: district, error: districtError } = await supabase
      .from('districts')
      .select('id, name, province_id')
      .eq('id', locksmith.districtid)
      .single();

    // 5. Yorumları getir
    // const { data: reviews, error: reviewsError } = await supabase
    //   .from('reviews')
    //   .select('*')
    //   .eq('locksmithid', locksmith.id)
    //   .eq('status', 'approved')
    //   .order('createdat', { ascending: false })
    //   .limit(3);

    const reviewPromises = [5, 4, 3, 2, 1].map(rating =>
      supabase
        .from('reviews')
        .select('*')
        .eq('locksmithid', locksmith.id)
        .eq('status', 'approved')
        .eq('rating', rating)
        .order('createdat', { ascending: false })
        .limit(3)
    );

    const reviewResults = await Promise.all(reviewPromises);

    // Sonuçları birleştir:
    const reviews = reviewResults.flatMap(r => r.data || []);


    // 6. Benzer çilingirleri getir (aynı ilçede bulunan diğer çilingirler)
    const { data: similarLocksmiths, error: similarError } = await supabase
      .from('locksmiths')
      .select(`
        id,
        businessname,
        fullname,
        tagline,
        phonenumber,
        whatsappnumber,
        provinceid,
        districtid,
        avgrating,
        totalreviewcount,
        profileimageurl,
        isverified,
        isactive,
        slug
      `)
      .eq('districtid', locksmith.districtid)
      .eq('isactive', true)
      .neq('id', locksmith.id)
      .limit(3);


    // Çilingir bilgilerini birleştir
    const locksmithData = {
      ...locksmith,
      ...locksmithDetail,
      province: province ? province.name : null,
      district: district ? district.name : null,
      services: locksmithServices ? locksmithServices.map(service => ({
        id: service.serviceid,
        name: service.services.name,
        prices: {
          mesai: {
            min: service.services.minPriceMesai,
            max: service.services.maxPriceMesai
          },
          aksam: {
            min: service.services.minPriceAksam,
            max: service.services.maxPriceAksam
          },
          gece: {
            min: service.services.minPriceGece,
            max: service.services.maxPriceGece
          }
        }
      })) : [],
      reviews: reviews || [],
      similarLocksmiths: similarLocksmiths ? similarLocksmiths.map(item => ({
        id: item.id,
        name: item.businessname || "İsimsiz Çilingir",
        description: item.tagline || "Bu çilingir hakkında bilgi bulunmuyor.",
        province: province ? province.name : null,
        district: district ? district.name : null,
        rating: item.avgrating || 0,
        reviewCount: item.totalreviewcount || 0,
        phone: item.phonenumber || "",
        whatsappnumber: item.whatsappnumber || "",
        slug: item.slug
      })) : []
    };

    return NextResponse.json({
      success: true,
      locksmith: locksmithData
    });

  } catch (error) {
    console.error('Çilingir locksmithServices getirilirken hata:', error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
} 