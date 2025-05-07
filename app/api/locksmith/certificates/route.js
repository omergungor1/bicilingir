import { NextResponse } from 'next/server';
import { checkAuth } from '../../utils';
import { createClient } from '@supabase/supabase-js';

// Supabase client'ı oluştur
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Sertifikaları getirme
export async function GET(request) {
    const { locksmithId, supabase } = await checkAuth(request);

    if (!locksmithId) {
        return NextResponse.json({
            error: 'Yetkilendirme hatası'
        }, { status: 401 });
    }

    try {
        //select name, fileurl, locksmithid from locksmith_certificates 
        // Sertifikaları getir
        const { data: certificates, error } = await supabase
            .from('locksmith_certificates')
            .select('id, name, fileurl')
            .eq('locksmithid', locksmithId)
            .order('createdat', { ascending: false });

        if (error) {
            console.error('Sertifikaları getirme hatası:', error);
            return NextResponse.json({
                error: 'Sertifikalar yüklenirken bir hata oluştu'
            }, { status: 500 });
        }

        return NextResponse.json({ certificates });
    } catch (error) {
        console.error('Sertifika işlemi hatası:', error);
        return NextResponse.json({
            error: 'Beklenmeyen bir hata oluştu'
        }, { status: 500 });
    }
}

// Sertifika ekleme
export async function POST(request) {
    const { locksmithId, supabase } = await checkAuth(request);

    if (!locksmithId) {
        return NextResponse.json({
            error: 'Yetkilendirme hatası'
        }, { status: 401 });
    }

    // Supabase storage işlemleri için admin client kullan
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const name = formData.get('name');

        if (!file || !name) {
            return NextResponse.json({
                error: 'Dosya ve sertifika adı gereklidir'
            }, { status: 400 });
        }

        // Mevcut sertifika sayısını kontrol et
        const { count, error: countError } = await supabase
            .from('locksmith_certificates')
            .select('*', { count: 'exact', head: true })
            .eq('locksmithid', locksmithId);

        if (countError) {
            return NextResponse.json({
                error: 'Sertifika sayısı kontrol edilirken bir hata oluştu'
            }, { status: 500 });
        }

        if (count >= 5) {
            return NextResponse.json({
                error: 'En fazla 5 sertifika yükleyebilirsiniz'
            }, { status: 400 });
        }

        // Dosya türünü kontrol et
        const fileType = file.type;
        if (!fileType.startsWith('image/') && !fileType.startsWith('application/pdf')) {
            return NextResponse.json({
                error: 'Yalnızca resim veya PDF formatında sertifika yükleyebilirsiniz'
            }, { status: 400 });
        }

        // Dosya boyutunu kontrol et (5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({
                error: 'Dosya boyutu 5MB\'dan büyük olamaz'
            }, { status: 400 });
        }

        // Dosyayı storage'a yükle
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `business-certificates/${locksmithId}/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabaseAdmin
            .storage
            .from('business-certificates')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false,
                contentType: file.type
            });

        if (uploadError) {
            console.error('Dosya yükleme hatası:', uploadError);
            return NextResponse.json({
                error: 'Dosya yüklenirken bir hata oluştu'
            }, { status: 500 });
        }

        // Public URL oluştur
        const { data: publicUrlData } = supabaseAdmin
            .storage
            .from('business-certificates')
            .getPublicUrl(filePath);

        const fileUrl = publicUrlData.publicUrl;

        // Veritabanına sertifika kaydet
        const { data: certificateData, error: certificateError } = await supabase
            .from('locksmith_certificates')
            .insert([
                {
                    name: name,
                    fileurl: fileUrl,
                    locksmithid: locksmithId,
                    filetype: fileType,
                }
            ])
            .select();

        if (certificateError) {
            console.error('Sertifika kaydetme hatası:', certificateError);
            // Dosyayı sil
            await supabaseAdmin.storage.from('business-certificates').remove([filePath]);
            return NextResponse.json({
                error: 'Sertifika kaydedilirken bir hata oluştu'
            }, { status: 500 });
        }

        return NextResponse.json(certificateData[0]);
    } catch (error) {
        console.error('Sertifika ekleme hatası:', error);
        return NextResponse.json({
            error: 'Beklenmeyen bir hata oluştu'
        }, { status: 500 });
    }
}

// Sertifika silme
export async function DELETE(request) {
    const { locksmithId, supabase } = await checkAuth(request);

    if (!locksmithId) {
        return NextResponse.json({
            error: 'Yetkilendirme hatası'
        }, { status: 401 });
    }

    // Supabase storage işlemleri için admin client kullan
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    try {
        const { searchParams } = new URL(request.url);
        const certificateId = searchParams.get('id');

        if (!certificateId) {
            return NextResponse.json({
                error: 'Sertifika ID gereklidir'
            }, { status: 400 });
        }

        // Önce sertifika bilgilerini al
        const { data: certificate, error: fetchError } = await supabase
            .from('locksmith_certificates')
            .select('fileurl')
            .eq('id', certificateId)
            .eq('locksmithid', locksmithId)
            .single();

        if (fetchError) {
            return NextResponse.json({
                error: 'Sertifika bulunamadı'
            }, { status: 404 });
        }

        // Storage'dan dosya yolunu çıkar
        const fileUrl = certificate.fileurl;
        const filePath = fileUrl.split('/').pop();
        const storagePath = `business-certificates/${locksmithId}/${filePath}`;

        // Dosyayı storage'dan sil
        const { error: storageError } = await supabaseAdmin
            .storage
            .from('business-certificates')
            .remove([storagePath]);

        if (storageError) {
            console.error('Dosya silme hatası:', storageError);
            // Dosya silmede hata olsa bile veritabanı kaydını silelim
        }

        // Veritabanından sertifika kaydını sil
        const { error: deleteError } = await supabase
            .from('locksmith_certificates')
            .delete()
            .eq('id', certificateId)
            .eq('locksmithid', locksmithId);

        if (deleteError) {
            console.error('Sertifika silme hatası:', deleteError);
            return NextResponse.json({
                error: 'Sertifika silinirken bir hata oluştu'
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: 'Sertifika başarıyla silindi'
        });
    } catch (error) {
        console.error('Sertifika silme hatası:', error);
        return NextResponse.json({
            error: 'Beklenmeyen bir hata oluştu'
        }, { status: 500 });
    }
} 