import { NextResponse } from 'next/server';
import { checkAdminAuth } from '../../../utils';

// Blog resim bilgilerini güncelle (Admin)
export async function PUT(request, { params }) {
    try {
        const { supabase } = await checkAdminAuth(request);
        const { id } = params;

        const { alt_text } = await request.json();

        if (!alt_text) {
            return NextResponse.json({
                success: false,
                error: 'Alt text gereklidir'
            }, { status: 400 });
        }

        // Mevcut resmi kontrol et
        const { data: existingImage, error: fetchError } = await supabase
            .from('blog_images')
            .select('id')
            .eq('id', id)
            .eq('is_deleted', false)
            .single();

        if (fetchError) {
            if (fetchError.code === 'PGRST116') {
                return NextResponse.json({
                    success: false,
                    error: 'Resim bulunamadı'
                }, { status: 404 });
            }
            throw fetchError;
        }

        const { data, error } = await supabase
            .from('blog_images')
            .update({ alt_text })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return NextResponse.json({
            success: true,
            data,
            message: 'Resim bilgileri başarıyla güncellendi'
        });
    } catch (error) {
        console.error('Resim bilgileri güncellenemedi:', error);
        return NextResponse.json({
            success: false,
            error: 'Resim bilgileri güncellenemedi'
        }, { status: 500 });
    }
}

// Blog resmini sil (Soft delete) (Admin)
export async function DELETE(request, { params }) {
    try {
        const { supabase } = await checkAdminAuth(request);
        const { id } = params;

        // Mevcut resmi kontrol et
        const { data: existingImage, error: fetchError } = await supabase
            .from('blog_images')
            .select('id, url')
            .eq('id', id)
            .eq('is_deleted', false)
            .single();

        if (fetchError) {
            if (fetchError.code === 'PGRST116') {
                return NextResponse.json({
                    success: false,
                    error: 'Resim bulunamadı'
                }, { status: 404 });
            }
            throw fetchError;
        }

        // Resmin blog'larda kullanılıp kullanılmadığını kontrol et
        const { data: usedInBlogs, error: usageError } = await supabase
            .from('blogs')
            .select('id, title')
            .eq('image_id', id)
            .limit(5);

        if (usageError) {
            console.error('Resim kullanım kontrolü hatası:', usageError);
        }

        if (usedInBlogs && usedInBlogs.length > 0) {
            const blogTitles = usedInBlogs.map(blog => blog.title).join(', ');
            return NextResponse.json({
                success: false,
                error: `Bu resim şu blog yazılarında kullanılıyor: ${blogTitles}. Önce bu yazılardan resmi kaldırın.`
            }, { status: 400 });
        }

        // Soft delete - is_deleted = true
        const { data, error } = await supabase
            .from('blog_images')
            .update({ is_deleted: true })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw error;
        }

        // İsteğe bağlı: Supabase Storage'dan da silebilirsiniz
        // Ancak soft delete kullandığımız için şimdilik sadece veritabanında işaretliyoruz
        /*
        try {
          const urlParts = existingImage.url.split('/');
          const fileName = urlParts[urlParts.length - 1];
          
          const { error: storageError } = await supabase.storage
            .from('blog-images')
            .remove([fileName]);
    
          if (storageError) {
            console.error('Storage\'dan silme hatası:', storageError);
          }
        } catch (storageError) {
          console.error('Storage silme işlemi hatası:', storageError);
        }
        */

        return NextResponse.json({
            success: true,
            message: 'Resim başarıyla silindi'
        });
    } catch (error) {
        console.error('Resim silinemedi:', error);
        return NextResponse.json({
            success: false,
            error: 'Resim silinemedi'
        }, { status: 500 });
    }
}
