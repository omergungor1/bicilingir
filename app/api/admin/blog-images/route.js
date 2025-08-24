import { NextResponse } from 'next/server';
import { checkAdminAuth } from '../../utils';

// Blog resimlerini listele (Admin)
export async function GET(request) {
    try {
        const { supabase } = await checkAdminAuth(request);

        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit')) || 50;
        const offset = parseInt(searchParams.get('offset')) || 0;

        const { data: imagesData, error } = await supabase
            .from('blog_images')
            .select('*')
            .eq('is_deleted', false)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) {
            throw error;
        }

        // Toplam sayıyı al
        const { count, error: countError } = await supabase
            .from('blog_images')
            .select('*', { count: 'exact', head: true })
            .eq('is_deleted', false);

        if (countError) {
            console.error('Blog resim sayısı alınamadı:', countError);
        }

        return NextResponse.json({
            success: true,
            data: imagesData,
            pagination: {
                total: count || 0,
                limit,
                offset,
                hasMore: (offset + limit) < (count || 0)
            }
        });
    } catch (error) {
        console.error('Blog resimleri alınamadı:', error);
        return NextResponse.json({
            success: false,
            error: 'Blog resimleri alınamadı'
        }, { status: 500 });
    }
}

// Yeni blog resmi yükle (Admin)
export async function POST(request) {
    try {
        const { supabase } = await checkAdminAuth(request);

        const formData = await request.formData();
        const file = formData.get('file');
        const alt_text = formData.get('alt_text') || '';

        if (!file) {
            return NextResponse.json({
                success: false,
                error: 'Dosya gereklidir'
            }, { status: 400 });
        }

        // Dosya tipini kontrol et
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({
                success: false,
                error: 'Sadece JPEG, PNG, WebP ve GIF dosyaları desteklenir'
            }, { status: 400 });
        }

        // Dosya boyutunu kontrol et (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            return NextResponse.json({
                success: false,
                error: 'Dosya boyutu 10MB\'dan küçük olmalıdır'
            }, { status: 400 });
        }

        // Benzersiz dosya adı oluştur
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        // Supabase Storage'a yükle
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('blog-images')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) {
            console.error('Dosya yükleme hatası:', uploadError);
            return NextResponse.json({
                success: false,
                error: 'Dosya yüklenemedi'
            }, { status: 500 });
        }

        // Public URL'i al
        const { data: urlData } = supabase.storage
            .from('blog-images')
            .getPublicUrl(fileName);

        // Resim bilgilerini veritabanına kaydet
        const imageData = {
            url: urlData.publicUrl,
            alt_text: alt_text || file.name,
            file_size: file.size,
            file_type: file.type,
            // Bu bilgileri elde etmek için image processing kütüphanesi kullanılabilir
            width: null,
            height: null
        };

        const { data: dbData, error: dbError } = await supabase
            .from('blog_images')
            .insert(imageData)
            .select()
            .single();

        if (dbError) {
            // Eğer veritabanı hatası varsa yüklenen dosyayı sil
            await supabase.storage
                .from('blog-images')
                .remove([fileName]);

            throw dbError;
        }

        return NextResponse.json({
            success: true,
            data: dbData,
            message: 'Resim başarıyla yüklendi'
        });
    } catch (error) {
        console.error('Blog resmi yüklenemedi:', error);
        return NextResponse.json({
            success: false,
            error: 'Blog resmi yüklenemedi'
        }, { status: 500 });
    }
}
