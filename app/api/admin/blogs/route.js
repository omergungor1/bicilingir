import { NextResponse } from 'next/server';
import { checkAdminAuth } from '../../utils';

// Blog listesini getir (Admin)
export async function GET(request) {
    try {
        const { supabase } = await checkAdminAuth(request);

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const province_id = searchParams.get('province_id');
        const district_id = searchParams.get('district_id');
        const service_id = searchParams.get('service_id');
        const locksmith_id = searchParams.get('locksmith_id');
        const is_featured = searchParams.get('is_featured');
        const limit = parseInt(searchParams.get('limit')) || 20;
        const offset = parseInt(searchParams.get('offset')) || 0;

        let query = supabase
            .from('blogs')
            .select(`
        *,
        blog_images (
          id,
          url,
          alt_text,
          file_size,
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
            .order('created_at', { ascending: false });

        // Filtreler
        if (status) {
            query = query.eq('status', status);
        }
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
        if (is_featured !== null) {
            query = query.eq('is_featured', is_featured === 'true');
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
            .select('*', { count: 'exact', head: true });

        if (status) {
            countQuery = countQuery.eq('status', status);
        }
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
        if (is_featured !== null) {
            countQuery = countQuery.eq('is_featured', is_featured === 'true');
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

// Yeni blog oluştur (Admin)
export async function POST(request) {
    try {
        const { supabase } = await checkAdminAuth(request);

        const {
            title,
            content,
            result,
            excerpt,
            image_id,
            province_id,
            district_id,
            service_id,
            locksmith_id,
            status = 'draft',
            meta_title,
            meta_description,
            meta_keywords,
            is_featured = false
        } = await request.json();

        // Gerekli alanları kontrol et
        if (!title || !content) {
            return NextResponse.json({
                success: false,
                error: 'Başlık ve içerik zorunludur'
            }, { status: 400 });
        }

        // Slug oluştur
        const baseSlug = title
            .toLowerCase()
            .replace(/ğ/g, 'g')
            .replace(/ü/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ı/g, 'i')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');

        // Benzersiz slug oluştur
        const { data: uniqueSlugData } = await supabase
            .rpc('generate_unique_slug', {
                base_slug: baseSlug,
                table_name: 'blogs'
            });

        const slug = uniqueSlugData || baseSlug;

        // Okuma süresini hesapla (yaklaşık 200 kelime/dakika)
        const wordCount = content.split(/\s+/).length;
        const reading_time = Math.max(1, Math.round(wordCount / 200));

        const blogData = {
            title,
            slug,
            content,
            result,
            excerpt,
            image_id: image_id || null,
            province_id: province_id || null,
            district_id: district_id || null,
            service_id: service_id || null,
            locksmith_id: locksmith_id || null,
            status,
            meta_title: meta_title || title,
            meta_description: meta_description || excerpt,
            meta_keywords,
            is_featured,
            reading_time,
            published_at: status === 'published' ? new Date().toISOString() : null
        };

        const { data, error } = await supabase
            .from('blogs')
            .insert(blogData)
            .select(`
        *,
        blog_images (
          id,
          url,
          alt_text
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
            .single();

        if (error) {
            throw error;
        }

        return NextResponse.json({
            success: true,
            data,
            message: 'Blog başarıyla oluşturuldu'
        });
    } catch (error) {
        console.error('Blog oluşturulamadı:', error);
        return NextResponse.json({
            success: false,
            error: 'Blog oluşturulamadı'
        }, { status: 500 });
    }
}
