import { NextResponse } from 'next/server';
import { createRouteClient } from '../../utils';

// Public blog listesi
export async function GET(request) {
    try {
        const { supabase } = createRouteClient(request);

        const { searchParams } = new URL(request.url);
        const province_id = searchParams.get('province_id');
        const district_id = searchParams.get('district_id');
        const neighborhood_id = searchParams.get('neighborhood_id');
        const service_id = searchParams.get('service_id');
        const locksmith_id = searchParams.get('locksmith_id');
        const is_featured = searchParams.get('is_featured');
        const limit = parseInt(searchParams.get('limit')) || 12;
        const offset = parseInt(searchParams.get('offset')) || 0;
        const search = searchParams.get('search');

        // Slug bazlı parametreler
        const province = searchParams.get('province');
        const district = searchParams.get('district');
        const neighborhood = searchParams.get('neighborhood');
        const service = searchParams.get('service');

        let query = supabase
            .from('blogs')
            .select(`
        id,
        title,
        slug,
        excerpt,
        views,
        created_at,
        reading_time,
        is_featured,
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
          slug
        )
      `)
            .eq('status', 'published')
            .order('published_at', { ascending: false });

        // ID bazlı filtreler
        if (province_id) {
            query = query.eq('province_id', province_id);
        }
        if (district_id) {
            query = query.eq('district_id', district_id);
        }
        if (neighborhood_id) {
            query = query.eq('neighborhood_id', neighborhood_id);
        }
        if (service_id) {
            query = query.eq('service_id', service_id);
        }
        if (locksmith_id) {
            query = query.eq('locksmith_id', locksmith_id);
        }
        if (is_featured === 'true') {
            query = query.eq('is_featured', true);
        }

        // Slug bazlı filtreler - ID'leri bul ve filtrele
        if (province) {
            const { data: provinceData } = await supabase
                .from('provinces')
                .select('id')
                .eq('slug', province)
                .single();

            if (provinceData) {
                query = query.eq('province_id', provinceData.id);
            }
        }

        if (district) {
            const { data: districtData } = await supabase
                .from('districts')
                .select('id')
                .eq('slug', district)
                .single();

            if (districtData) {
                query = query.eq('district_id', districtData.id);
            }
        }

        if (neighborhood) {
            const { data: neighborhoodData } = await supabase
                .from('neighborhoods')
                .select('id')
                .eq('slug', neighborhood)
                .single();

            if (neighborhoodData) {
                query = query.eq('neighborhood_id', neighborhoodData.id);
            }
        }

        if (service) {
            const { data: serviceData } = await supabase
                .from('services')
                .select('id')
                .eq('slug', service)
                .single();

            if (serviceData) {
                query = query.eq('service_id', serviceData.id);
            }
        }

        // Arama
        if (search) {
            query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`);
        }

        // Sayfalama
        query = query.range(offset, offset + limit - 1);

        const { data: blogsData, error } = await query;

        if (error) {
            throw error;
        }

        // Toplam sayıyı al
        let countQuery = supabase
            .from('blogs')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'published');

        // ID bazlı filtreler
        if (province_id) {
            countQuery = countQuery.eq('province_id', province_id);
        }
        if (district_id) {
            countQuery = countQuery.eq('district_id', district_id);
        }
        if (neighborhood_id) {
            countQuery = countQuery.eq('neighborhood_id', neighborhood_id);
        }
        if (service_id) {
            countQuery = countQuery.eq('service_id', service_id);
        }
        if (locksmith_id) {
            countQuery = countQuery.eq('locksmith_id', locksmith_id);
        }
        if (is_featured === 'true') {
            countQuery = countQuery.eq('is_featured', true);
        }

        // Slug bazlı filtreler için aynı ID'leri kullan
        if (province) {
            const { data: provinceData } = await supabase
                .from('provinces')
                .select('id')
                .eq('slug', province)
                .single();

            if (provinceData) {
                countQuery = countQuery.eq('province_id', provinceData.id);
            }
        }

        if (district) {
            const { data: districtData } = await supabase
                .from('districts')
                .select('id')
                .eq('slug', district)
                .single();

            if (districtData) {
                countQuery = countQuery.eq('district_id', districtData.id);
            }
        }

        if (neighborhood) {
            const { data: neighborhoodData } = await supabase
                .from('neighborhoods')
                .select('id')
                .eq('slug', neighborhood)
                .single();

            if (neighborhoodData) {
                countQuery = countQuery.eq('neighborhood_id', neighborhoodData.id);
            }
        }

        if (service) {
            const { data: serviceData } = await supabase
                .from('services')
                .select('id')
                .eq('slug', service)
                .single();

            if (serviceData) {
                countQuery = countQuery.eq('service_id', serviceData.id);
            }
        }
        if (search) {
            countQuery = countQuery.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`);
        }

        const { count, error: countError } = await countQuery;

        if (countError) {
            console.error('Blog sayısı alınamadı:', countError);
        }

        return NextResponse.json({
            success: true,
            data: blogsData,
            pagination: {
                total: count || 0,
                limit,
                offset,
                hasMore: (offset + limit) < (count || 0)
            }
        });
    } catch (error) {
        console.error('Bloglar alınamadı:', error);
        return NextResponse.json({
            success: false,
            error: 'Bloglar alınamadı'
        }, { status: 500 });
    }
}
