import { NextResponse } from 'next/server';
import { createRouteClient, logUserActivity } from '../../../utils';

// Blog detayını getir ve görüntülenme sayısını artır
export async function GET(request, { params }) {
    try {
        const { supabase } = createRouteClient(request);
        const { slug } = await params;

        // URL parametrelerini al
        const url = new URL(request.url);
        const province = url.searchParams.get('province');
        const district = url.searchParams.get('district');
        const neighborhood = url.searchParams.get('neighborhood');
        const service = url.searchParams.get('service');

        console.log(slug, 'slug');
        console.log({ province, district, neighborhood, service }, 'location filters');

        // Blog sorgusunu oluştur
        let blogQuery = supabase
            .from('blogs')
            .select(`
        *,
        blog_images (
          id,
          url,
          alt_text,
          width,
          height
        ),
        provinces (
          id,
          name,
          slug
        ),
        districts (
          id,
          name,
          slug
        ),
        neighborhoods (
          id,
          name,
          slug
        ),
        services (
          id,
          name,
          slug
        ),
        locksmiths (
          id,
          businessname,
          fullname,
          slug,
          phonenumber,
          whatsappnumber,
          avgrating,
          totalreviewcount
        )
      `)
            .eq('slug', slug)
            .eq('status', 'published');

        // Location parametrelerine göre filtreleme
        if (province) {
            // Province slug'ını ID'ye çevir
            const { data: provinceData } = await supabase
                .from('provinces')
                .select('id')
                .eq('slug', province)
                .single();

            if (provinceData) {
                blogQuery = blogQuery.eq('province_id', provinceData.id);
            }
        }

        if (district) {
            // District slug'ını ID'ye çevir
            const { data: districtData } = await supabase
                .from('districts')
                .select('id')
                .eq('slug', district)
                .single();

            if (districtData) {
                blogQuery = blogQuery.eq('district_id', districtData.id);
            }
        }

        if (neighborhood) {
            // Neighborhood slug'ını ID'ye çevir
            const { data: neighborhoodData } = await supabase
                .from('neighborhoods')
                .select('id')
                .eq('slug', neighborhood)
                .single();

            if (neighborhoodData) {
                blogQuery = blogQuery.eq('neighborhood_id', neighborhoodData.id);
            }
        }

        if (service) {
            // Service slug'ını ID'ye çevir
            const { data: serviceData } = await supabase
                .from('services')
                .select('id')
                .eq('slug', service)
                .single();

            if (serviceData) {
                blogQuery = blogQuery.eq('service_id', serviceData.id);
            }
        }

        // Blog'u getir
        const { data: blogData, error } = await blogQuery.single();

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json({
                    success: false,
                    error: 'Blog bulunamadı'
                }, { status: 404 });
            }
            throw error;
        }

        // Görüntülenme sayısını artır - SQL increment kullanarak race condition'ı önle
        console.log('Views güncelleme öncesi:', {
            blogId: blogData.id,
            currentViews: blogData.views
        });

        // Views sayısını güncelle (basit UPDATE yöntemi)
        const { data: updateData, error: viewError } = await supabase
            .from('blogs')
            .update({ views: blogData.views + 1 })
            .eq('id', blogData.id)
            .select();

        if (viewError) {
            console.error('Views güncellemesi başarısız:', viewError);
        } else {
            console.log('Views başarıyla güncellendi:', updateData);
        }

        // Blog view kaydı ekle (detaylı analiz için)
        try {
            const ip = request.headers.get('x-forwarded-for') ||
                request.headers.get('x-real-ip') ||
                '0.0.0.0';
            const userAgent = request.headers.get('user-agent') || '';
            const referrer = request.headers.get('referer') || '';

            await supabase
                .from('blog_views')
                .insert({
                    blog_id: blogData.id,
                    ip_address: ip,
                    user_agent: userAgent,
                    referrer: referrer
                });
        } catch (viewLogError) {
            console.error('Blog view kaydı eklenemedi:', viewLogError);
            // Bu hata ana işlemi etkilemesin
        }

        // İlgili çilingirleri getir (locksmith_districts ve locksmith_services tabloları üzerinden)
        let relatedLocksmiths = [];
        if (blogData.province_id || blogData.district_id || blogData.service_id) {

            try {
                let locksmithIds = [];

                // İlçe bazlı çilingirleri getir
                if (blogData.district_id) {
                    const { data: districtLocksmiths, error: districtError } = await supabase
                        .from('locksmith_districts')
                        .select('locksmithid')
                        .eq('districtid', blogData.district_id)
                        .eq('isactive', true);


                    if (!districtError && districtLocksmiths) {
                        // Duplicate ID'leri kaldır
                        const uniqueIds = [...new Set(districtLocksmiths.map(item => item.locksmithid))];
                        locksmithIds = uniqueIds;
                    }
                } else if (blogData.province_id) {
                    // İl bazlı çilingirleri getir
                    const { data: provinceLocksmiths, error: provinceError } = await supabase
                        .from('locksmith_districts')
                        .select('locksmithid')
                        .eq('provinceid', blogData.province_id)
                        .eq('isactive', true);

                    console.log('provinceLocksmiths:', provinceLocksmiths)

                    if (!provinceError && provinceLocksmiths) {
                        // Duplicate ID'leri kaldır
                        const uniqueIds = [...new Set(provinceLocksmiths.map(item => item.locksmithid))];
                        locksmithIds = uniqueIds;
                        console.log('İl bazlı çilingir ID\'leri (unique):', locksmithIds);
                    }
                }

                // Servis filtrelemesi uygula
                if (blogData.service_id && locksmithIds.length > 0) {
                    const { data: serviceLocksmiths, error: serviceError } = await supabase
                        .from('locksmith_services')
                        .select('locksmithid')
                        .eq('serviceId', blogData.service_id)
                        .eq('isActive', true)
                        .in('locksmithid', locksmithIds);

                    console.log('serviceLocksmiths:', serviceLocksmiths);

                    if (!serviceError && serviceLocksmiths) {
                        // Duplicate ID'leri kaldır
                        const uniqueIds = [...new Set(serviceLocksmiths.map(item => item.locksmithid))];
                        locksmithIds = uniqueIds;
                        console.log('Servis filtreli çilingir ID\'leri (unique):', locksmithIds);
                    }
                } else if (blogData.service_id && locksmithIds.length === 0) {
                    // Sadece servis bilgisi varsa, tüm çilingirleri servis bazlı getir
                    const { data: serviceOnlyLocksmiths, error: serviceOnlyError } = await supabase
                        .from('locksmith_services')
                        .select('locksmithid')
                        .eq('serviceid', blogData.service_id)
                        .eq('isactive', true);

                    console.log('serviceOnlyLocksmiths:', serviceOnlyLocksmiths);

                    if (!serviceOnlyError && serviceOnlyLocksmiths) {
                        // Duplicate ID'leri kaldır
                        const uniqueIds = [...new Set(serviceOnlyLocksmiths.map(item => item.locksmithid))];
                        locksmithIds = uniqueIds;
                        console.log('Sadece servis bazlı çilingir ID\'leri (unique):', locksmithIds);
                    }
                }

                // Çilingir detaylarını getir
                if (locksmithIds.length > 0) {
                    const { data: locksmithsData, error: locksmithError } = await supabase
                        .from('locksmiths')
                        .select(`
                            id,
                            slug,
                            businessname,
                            tagline,
                            fullname,
                            phonenumber,
                            whatsappnumber,
                            avgrating,
                            totalreviewcount,
                            profileimageurl,
                            locksmith_details (
                                abouttext,
                                lat,
                                lng
                            ),
                            provinces!locksmiths_provinceid_fkey (
                                name,
                                slug
                            ),
                            districts!locksmiths_districtid_fkey (
                                name,
                                slug
                            )
                        `)
                        .in('id', locksmithIds)
                        .eq('isactive', true)
                        .eq('isverified', true)
                        .order('avgrating', { ascending: false })
                        .limit(4);

                    if (!locksmithError && locksmithsData) {
                        // LocksmithCard component'inin beklediği formata çevir
                        relatedLocksmiths = locksmithsData.map(locksmith => ({
                            id: locksmith.id,
                            slug: locksmith.slug,
                            name: locksmith.businessname || locksmith.fullname,
                            businessname: locksmith.businessname,
                            fullname: locksmith.fullname,
                            phone: locksmith.phonenumber,
                            whatsapp: locksmith.whatsappnumber,
                            rating: locksmith.avgrating,
                            totalReviewCount: locksmith.totalreviewcount,
                            profileimageurl: locksmith.profileimageurl,
                            description: locksmith.tagline || '',
                            provinces: locksmith.provinces,
                            districts: locksmith.districts,
                            locksmith_details: locksmith.locksmith_details
                        }));
                    }
                }
            } catch (locksmithFetchError) {
                console.error('İlgili çilingirler alınamadı:', locksmithFetchError);
            }
        }

        // Response data'sını hazırla - views sayısını güncellenmiş haliyle döndür
        let updatedViews = blogData.views + 1; // Default fallback

        // Eğer update başarılıysa gerçek değeri kullan
        if (!viewError && updateData && updateData[0]) {
            updatedViews = updateData[0].views;
        }

        const responseData = {
            ...blogData,
            views: updatedViews,
            relatedLocksmiths
        };

        return NextResponse.json({
            success: true,
            data: responseData
        });
    } catch (error) {
        console.error('Blog alınamadı:', error);
        return NextResponse.json({
            success: false,
            error: 'Blog alınamadı'
        }, { status: 500 });
    }
}
