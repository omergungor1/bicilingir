import { NextResponse } from 'next/server';
import { checkAdminAuth } from '../../../../utils';

// Blog yayınlama durumunu değiştir (Admin)
export async function PATCH(request, { params }) {
    try {
        const { supabase } = await checkAdminAuth(request);
        const { id } = await params;

        const { action } = await request.json(); // 'publish' veya 'unpublish'

        if (!action || !['publish', 'unpublish'].includes(action)) {
            return NextResponse.json({
                success: false,
                error: 'Geçersiz işlem. "publish" veya "unpublish" olmalı'
            }, { status: 400 });
        }

        // Mevcut blog'u kontrol et
        const { data: existingBlog, error: fetchError } = await supabase
            .from('blogs')
            .select('id, title, status')
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

        if (action === 'publish') {
            updateData.status = 'published';
            updateData.published_at = new Date().toISOString();
        } else if (action === 'unpublish') {
            updateData.status = 'draft';
            updateData.published_at = null;
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

        const actionText = action === 'publish' ? 'yayınlandı' : 'taslağa alındı';

        return NextResponse.json({
            success: true,
            data,
            message: `Blog başarıyla ${actionText}`
        });
    } catch (error) {
        console.error('Blog durumu değiştirilemedi:', error);
        return NextResponse.json({
            success: false,
            error: 'Blog durumu değiştirilemedi'
        }, { status: 500 });
    }
}
