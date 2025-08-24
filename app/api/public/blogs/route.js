import { NextResponse } from 'next/server';
import { createRouteClient } from '../../utils';

// Public blog listesi
export async function GET(request) {
    try {
        const { supabase } = createRouteClient(request);

        const { searchParams } = new URL(request.url);
        const province_id = searchParams.get('province_id');
        const district_id = searchParams.get('district_id');
        const service_id = searchParams.get('service_id');
        const locksmith_id = searchParams.get('locksmith_id');
        const is_featured = searchParams.get('is_featured');
        const limit = parseInt(searchParams.get('limit')) || 12;
        const offset = parseInt(searchParams.get('offset')) || 0;
        const search = searchParams.get('search');

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

        // Filtreler
        if (province_id) {
            query = query.eq('province_id', province_id);
        }
        if (district_id) {
            query = query.eq('district_id', district_id);
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

        if (province_id) {
            countQuery = countQuery.eq('province_id', province_id);
        }
        if (district_id) {
            countQuery = countQuery.eq('district_id', district_id);
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
