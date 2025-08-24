import { NextResponse } from 'next/server';
import { checkAdminAuth } from '../../../utils';

// Blog detayını getir (Admin)
export async function GET(request, { params }) {
    try {
        const { supabase } = await checkAdminAuth(request);
        const { id } = params;

        const { data: blogData, error } = await supabase
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
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json({
                    success: false,
                    error: 'Blog bulunamadı'
                }, { status: 404 });
            }
            throw error;
        }

        return NextResponse.json({
            success: true,
            data: blogData
        });
    } catch (error) {
        console.error('Blog alınamadı:', error);
        return NextResponse.json({
            success: false,
            error: 'Blog alınamadı'
        }, { status: 500 });
    }
}

// Blog güncelle (Admin)
export async function PUT(request, { params }) {
    try {
        const { supabase } = await checkAdminAuth(request);
        const { id } = params;

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
            status,
            meta_title,
            meta_description,
            meta_keywords,
            is_featured
        } = await request.json();

        // Mevcut blog'u kontrol et
        const { data: existingBlog, error: fetchError } = await supabase
            .from('blogs')
            .select('id, slug, status')
            .eq('id', id)
            .single();

        if (fetchError) {
            if (fetchError.code === 'PGRST116') {
                return NextResponse.json({
                    success: false,
                    error: 'Blog bulunamadı'
                }, { status: 404 });
            }
            throw fetchError;
        }

        // Güncelleme verilerini hazırla
        const updateData = {};

        if (title !== undefined) {
            updateData.title = title;

            // Başlık değişmişse slug'ı da güncelle
            if (title !== existingBlog.title) {
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

                // Mevcut slug ile aynı değilse yeni benzersiz slug oluştur
                if (baseSlug !== existingBlog.slug) {
                    const { data: uniqueSlugData } = await supabase
                        .rpc('generate_unique_slug', {
                            base_slug: baseSlug,
                            table_name: 'blogs'
                        });
                    updateData.slug = uniqueSlugData || baseSlug;
                }
            }
        }

        if (content !== undefined) {
            updateData.content = content;

            // İçerik değişmişse okuma süresini yeniden hesapla
            const wordCount = content.split(/\s+/).length;
            updateData.reading_time = Math.max(1, Math.round(wordCount / 200));
        }

        if (result !== undefined) updateData.result = result;
        if (excerpt !== undefined) updateData.excerpt = excerpt;
        if (image_id !== undefined) updateData.image_id = image_id;
        if (province_id !== undefined) updateData.province_id = province_id;
        if (district_id !== undefined) updateData.district_id = district_id;
        if (service_id !== undefined) updateData.service_id = service_id;
        if (locksmith_id !== undefined) updateData.locksmith_id = locksmith_id;
        if (meta_title !== undefined) updateData.meta_title = meta_title;
        if (meta_description !== undefined) updateData.meta_description = meta_description;
        if (meta_keywords !== undefined) updateData.meta_keywords = meta_keywords;
        if (is_featured !== undefined) updateData.is_featured = is_featured;

        // Status değişikliği kontrolü
        if (status !== undefined && status !== existingBlog.status) {
            updateData.status = status;

            // Yayınlanıyorsa published_at tarihini güncelle
            if (status === 'published' && existingBlog.status !== 'published') {
                updateData.published_at = new Date().toISOString();
            }
            // Taslağa dönüyorsa published_at'ı temizle
            else if (status === 'draft') {
                updateData.published_at = null;
            }
        }

        const { data, error } = await supabase
            .from('blogs')
            .update(updateData)
            .eq('id', id)
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
            message: 'Blog başarıyla güncellendi'
        });
    } catch (error) {
        console.error('Blog güncellenemedi:', error);
        return NextResponse.json({
            success: false,
            error: 'Blog güncellenemedi'
        }, { status: 500 });
    }
}

// Blog sil (Admin)
export async function DELETE(request, { params }) {
    try {
        const { supabase } = await checkAdminAuth(request);
        const { id } = params;

        // Blog'u kontrol et
        const { data: existingBlog, error: fetchError } = await supabase
            .from('blogs')
            .select('id, title')
            .eq('id', id)
            .single();

        if (fetchError) {
            if (fetchError.code === 'PGRST116') {
                return NextResponse.json({
                    success: false,
                    error: 'Blog bulunamadı'
                }, { status: 404 });
            }
            throw fetchError;
        }

        // Blog'u sil
        const { error } = await supabase
            .from('blogs')
            .delete()
            .eq('id', id);

        if (error) {
            throw error;
        }

        return NextResponse.json({
            success: true,
            message: 'Blog başarıyla silindi'
        });
    } catch (error) {
        console.error('Blog silinemedi:', error);
        return NextResponse.json({
            success: false,
            error: 'Blog silinemedi'
        }, { status: 500 });
    }
}
