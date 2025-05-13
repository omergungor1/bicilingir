import { getSupabaseServer } from '../../../lib/supabase';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Normal Supabase istemcisi
const supabase = getSupabaseServer();

// Admin yetkilerine sahip service_role ile Supabase istemcisi oluştur
const getSupabaseAdmin = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Service role key kullanılıyor

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Supabase yapılandırma bilgileri eksik');
    throw new Error('Supabase yapılandırma bilgileri eksik');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
};

export async function POST(request) {
  try {
    // Formdata'yı oku
    const formData = await request.formData();
    const file = formData.get('file');
    const bucketName = formData.get('bucketName');

    if (!file || !bucketName) {
      return NextResponse.json(
        { error: 'Dosya veya bucket bilgisi eksik' },
        { status: 400 }
      );
    }

    // Dosyayı ArrayBuffer olarak oku
    const buffer = await file.arrayBuffer();

    // Dosya için benzersiz bir isim oluştur
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${fileName}`;

    // Admin yetkili Supabase istemcisini getir
    const supabaseAdmin = getSupabaseAdmin();

    // Dosyayı Supabase bucket'a yükle (admin yetkisiyle)
    const { data, error } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(filePath, buffer, {
        contentType: file.type, // MIME tipini belirt
        upsert: false // Aynı isimde dosya varsa üzerine yazma
      });

    if (error) {
      console.error('Dosya yükleme hatası:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Dosya URL'ini oluştur
    const { data: urlData } = supabaseAdmin.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    // Başarılı yanıt
    return NextResponse.json({
      url: urlData.publicUrl,
      path: filePath,
      message: 'Dosya başarıyla yüklendi'
    });
  } catch (error) {
    console.error('Beklenmeyen dosya yükleme hatası:', error);
    return NextResponse.json(
      { error: 'Dosya yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 