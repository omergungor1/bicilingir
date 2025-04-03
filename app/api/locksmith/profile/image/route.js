/**
 * CREATE TABLE locksmith_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    locksmith_id UUID REFERENCES locksmiths(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_main BOOLEAN DEFAULT FALSE,
    is_profile BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
 */

import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Supabase storage'a resim yükleme işlemi
export async function POST(request) {
  try {
    // Cookie işleme işlemleri
    const cookieHeader = request.headers.get('cookie');
    const supabaseCookieMatch = cookieHeader && cookieHeader.match(/sb-\w+-auth-token=([^;]+)/);
    const supabaseCookieValue = supabaseCookieMatch ? supabaseCookieMatch[1] : null;
    
    let parsedCookieValue = null;
    try {
      const decodedCookie = supabaseCookieValue ? decodeURIComponent(supabaseCookieValue) : null;
      if (decodedCookie && decodedCookie.startsWith('[') && decodedCookie.endsWith(']')) {
        parsedCookieValue = JSON.parse(decodedCookie);
      }
    } catch (e) {
      console.error('Cookie parse hatası:', e);
    }
    
    // Supabase istemcisi oluştur
    let response = NextResponse.next();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            if (name.includes('auth-token') && parsedCookieValue) {
              return JSON.stringify(parsedCookieValue);
            }
            const cookie = request.cookies.get(name)?.value;
            return cookie;
          },
          set(name, value, options) {
            response.cookies.set({
              name,
              value,
              ...options
            });
          },
          remove(name, options) {
            response.cookies.set({
              name,
              value: '',
              ...options,
              maxAge: 0
            });
          }
        },
      }
    );
    
    // Oturum tokenlarını ayarla
    if (parsedCookieValue && Array.isArray(parsedCookieValue) && parsedCookieValue.length >= 2) {
      const accessToken = parsedCookieValue[0];
      const refreshToken = parsedCookieValue[1];
      
      await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      });
    }
    
    // Oturum kontrolü
    const { data: authData } = await supabase.auth.getSession();
    const session = authData?.session;
    
    if (!session) {
      return NextResponse.json({ error: 'Oturum açmalısınız' }, { status: 401 });
    }
    
    // Kullanıcı ve rol kontrolü
    const userId = session.user.id;
    
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();
    
    if (roleError || !roleData) {
      return NextResponse.json({ error: 'Rol bilgisi alınamadı' }, { status: 500 });
    }
    
    if (roleData.role !== 'cilingir' && roleData.role !== 'admin') {
      return NextResponse.json({ error: 'Bu API sadece çilingirler tarafından kullanılabilir' }, { status: 403 });
    }
    
    // Çilingir ID'sini al
    const { data: locksmithData, error: locksmithError } = await supabase
      .from('locksmiths')
      .select('id')
      .eq('authid', userId)
      .single();
      
    if (locksmithError) {
      return NextResponse.json({ error: 'Çilingir bilgileriniz bulunamadı' }, { status: 404 });
    }
    
    const locksmithId = locksmithData.id;
    
    // FormData olarak yüklenen dosyayı al
    const formData = await request.formData();
    const file = formData.get('file');
    const isProfile = formData.get('isProfile') === 'true';
    const isMain = formData.get('isMain') === 'true';
    const displayOrder = parseInt(formData.get('displayOrder') || '0');
    
    if (!file) {
      return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 });
    }
    
    // Dosya tipi ve boyutu kontrolü
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Sadece resim dosyaları yüklenebilir' }, { status: 400 });
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB
      return NextResponse.json({ error: 'Dosya boyutu 5MB\'ı geçemez' }, { status: 400 });
    }
    
    // Dosya adını oluştur (timestamp ve random değer ile)
    const fileExt = file.name.split('.').pop();
    const fileName = `${locksmithId}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `locksmith-images/${fileName}`;
    
    // Storage'a dosya yükle
    const { data: storageData, error: storageError } = await supabase
      .storage
      .from('business-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      });
    
    if (storageError) {
      console.error('Dosya yükleme hatası:', storageError);
      return NextResponse.json({ error: 'Dosya yüklenirken bir hata oluştu' }, { status: 500 });
    }
    
    // Public URL al
    const { data: publicURLData } = supabase
      .storage
      .from('business-images')
      .getPublicUrl(filePath);
    
    const imageUrl = publicURLData.publicUrl;
    
    // Eğer profil fotoğrafı ise, diğer profil fotoğraflarını normal yap
    if (isProfile) {
      await supabase
        .from('locksmith_images')
        .update({ is_profile: false })
        .eq('locksmith_id', locksmithId)
        .eq('is_profile', true);
    }
    
    // Eğer ana fotoğraf ise, diğer ana fotoğrafları normal yap
    if (isMain) {
      await supabase
        .from('locksmith_images')
        .update({ is_main: false })
        .eq('locksmith_id', locksmithId)
        .eq('is_main', true);
    }
    
    // Veritabanına kaydet
    const { data: imageData, error: imageError } = await supabase
      .from('locksmith_images')
      .insert([
        { 
          locksmith_id: locksmithId,
          image_url: imageUrl,
          is_profile: isProfile,
          is_main: isMain,
          display_order: displayOrder
        }
      ])
      .select();
    
    if (imageError) {
      console.error('Resim kaydedilirken hata:', imageError);
      // Dosya yüklendi ama veritabanı kaydı başarısız oldu, dosyayı da sil
      await supabase.storage.from('business-images').remove([filePath]);
      return NextResponse.json({ error: 'Resim bilgileri kaydedilirken bir hata oluştu' }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      image: imageData[0]
    });
    
  } catch (error) {
    console.error('Resim yüklenirken bir hata oluştu:', error);
    return NextResponse.json({ 
      error: 'Resim yüklenirken bir hata oluştu',
      details: error.message
    }, { status: 500 });
  }
}

// İşletme resimlerini getir 
export async function GET(request) {
  try {
    // Cookie işleme işlemleri
    const cookieHeader = request.headers.get('cookie');
    const supabaseCookieMatch = cookieHeader && cookieHeader.match(/sb-\w+-auth-token=([^;]+)/);
    const supabaseCookieValue = supabaseCookieMatch ? supabaseCookieMatch[1] : null;
    
    let parsedCookieValue = null;
    try {
      const decodedCookie = supabaseCookieValue ? decodeURIComponent(supabaseCookieValue) : null;
      if (decodedCookie && decodedCookie.startsWith('[') && decodedCookie.endsWith(']')) {
        parsedCookieValue = JSON.parse(decodedCookie);
      }
    } catch (e) {
      console.error('Cookie parse hatası:', e);
    }
    
    // Supabase istemcisi oluştur
    let response = NextResponse.next();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            if (name.includes('auth-token') && parsedCookieValue) {
              return JSON.stringify(parsedCookieValue);
            }
            const cookie = request.cookies.get(name)?.value;
            return cookie;
          },
          set(name, value, options) {
            response.cookies.set({
              name,
              value,
              ...options
            });
          },
          remove(name, options) {
            response.cookies.set({
              name,
              value: '',
              ...options,
              maxAge: 0
            });
          }
        },
      }
    );
    
    // Oturum tokenlarını ayarla
    if (parsedCookieValue && Array.isArray(parsedCookieValue) && parsedCookieValue.length >= 2) {
      const accessToken = parsedCookieValue[0];
      const refreshToken = parsedCookieValue[1];
      
      await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      });
    }
    
    // Oturum kontrolü
    const { data: authData } = await supabase.auth.getSession();
    const session = authData?.session;
    
    if (!session) {
      return NextResponse.json({ error: 'Oturum açmalısınız' }, { status: 401 });
    }
    
    // Kullanıcı ve rol kontrolü
    const userId = session.user.id;
    
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();
    
    if (roleError || !roleData) {
      return NextResponse.json({ error: 'Rol bilgisi alınamadı' }, { status: 500 });
    }
    
    if (roleData.role !== 'cilingir' && roleData.role !== 'admin') {
      return NextResponse.json({ error: 'Bu API sadece çilingirler tarafından kullanılabilir' }, { status: 403 });
    }
    
    // Çilingir ID'sini al
    const { data: locksmithData, error: locksmithError } = await supabase
      .from('locksmiths')
      .select('id')
      .eq('authid', userId)
      .single();
      
    if (locksmithError) {
      return NextResponse.json({ error: 'Çilingir bilgileriniz bulunamadı' }, { status: 404 });
    }
    
    const locksmithId = locksmithData.id;
    
    // Resimleri sıralı şekilde getir
    const { data: images, error: imagesError } = await supabase
      .from('locksmith_images')
      .select('*')
      .eq('locksmith_id', locksmithId)
      .order('is_main', { ascending: false })
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });
    
    if (imagesError) {
      console.error('Resimler getirilirken hata:', imagesError);
      return NextResponse.json({ error: 'İşletme resimleri alınırken bir hata oluştu' }, { status: 500 });
    }
    
    return NextResponse.json(images);
  } catch (error) {
    console.error('Resimler getirilirken bir hata oluştu:', error);
    return NextResponse.json({ 
      error: 'Resimler getirilirken bir hata oluştu',
      details: error.message
    }, { status: 500 });
  }
}

// Güncelleme (ana/profil resmi ayarlama)
export async function PUT(request) {
  try {
    // Cookie işleme işlemleri
    const cookieHeader = request.headers.get('cookie');
    const supabaseCookieMatch = cookieHeader && cookieHeader.match(/sb-\w+-auth-token=([^;]+)/);
    const supabaseCookieValue = supabaseCookieMatch ? supabaseCookieMatch[1] : null;
    
    let parsedCookieValue = null;
    try {
      const decodedCookie = supabaseCookieValue ? decodeURIComponent(supabaseCookieValue) : null;
      if (decodedCookie && decodedCookie.startsWith('[') && decodedCookie.endsWith(']')) {
        parsedCookieValue = JSON.parse(decodedCookie);
      }
    } catch (e) {
      console.error('Cookie parse hatası:', e);
    }
    
    // Supabase istemcisi oluştur
    let response = NextResponse.next();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            if (name.includes('auth-token') && parsedCookieValue) {
              return JSON.stringify(parsedCookieValue);
            }
            const cookie = request.cookies.get(name)?.value;
            return cookie;
          },
          set(name, value, options) {
            response.cookies.set({
              name,
              value,
              ...options
            });
          },
          remove(name, options) {
            response.cookies.set({
              name,
              value: '',
              ...options,
              maxAge: 0
            });
          }
        },
      }
    );
    
    // Oturum tokenlarını ayarla
    if (parsedCookieValue && Array.isArray(parsedCookieValue) && parsedCookieValue.length >= 2) {
      const accessToken = parsedCookieValue[0];
      const refreshToken = parsedCookieValue[1];
      
      await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      });
    }
    
    // Oturum kontrolü
    const { data: authData } = await supabase.auth.getSession();
    const session = authData?.session;
    
    if (!session) {
      return NextResponse.json({ error: 'Oturum açmalısınız' }, { status: 401 });
    }
    
    // Kullanıcı ve rol kontrolü
    const userId = session.user.id;
    
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();
    
    if (roleError || !roleData) {
      return NextResponse.json({ error: 'Rol bilgisi alınamadı' }, { status: 500 });
    }
    
    if (roleData.role !== 'cilingir' && roleData.role !== 'admin') {
      return NextResponse.json({ error: 'Bu API sadece çilingirler tarafından kullanılabilir' }, { status: 403 });
    }
    
    // Çilingir ID'sini al
    const { data: locksmithData, error: locksmithError } = await supabase
      .from('locksmiths')
      .select('id')
      .eq('authid', userId)
      .single();
      
    if (locksmithError) {
      return NextResponse.json({ error: 'Çilingir bilgileriniz bulunamadı' }, { status: 404 });
    }
    
    const locksmithId = locksmithData.id;
    
    // Gelen verileri al
    const { id, isProfile, isMain, displayOrder } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'Resim ID\'si gereklidir' }, { status: 400 });
    }
    
    // Resim bu çilingire ait mi kontrol et
    const { data: imageCheck, error: imageCheckError } = await supabase
      .from('locksmith_images')
      .select('id')
      .eq('id', id)
      .eq('locksmith_id', locksmithId)
      .single();
    
    if (imageCheckError || !imageCheck) {
      return NextResponse.json({ error: 'Bu resim size ait değil veya bulunamadı' }, { status: 403 });
    }
    
    // Güncellenecek alanları belirle
    const updateData = {};
    
    if (isProfile !== undefined) {
      // Profil resmi değiştiriliyorsa, önce diğerlerini sıfırla
      if (isProfile === true) {
        await supabase
          .from('locksmith_images')
          .update({ is_profile: false })
          .eq('locksmith_id', locksmithId)
          .eq('is_profile', true);
      }
      updateData.is_profile = isProfile;
    }
    
    if (isMain !== undefined) {
      // Ana resim değiştiriliyorsa, önce diğerlerini sıfırla
      if (isMain === true) {
        await supabase
          .from('locksmith_images')
          .update({ is_main: false })
          .eq('locksmith_id', locksmithId)
          .eq('is_main', true);
      }
      updateData.is_main = isMain;
    }
    
    if (displayOrder !== undefined) {
      updateData.display_order = displayOrder;
    }
    
    // Resmi güncelle
    const { data: updatedImage, error: updateError } = await supabase
      .from('locksmith_images')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (updateError) {
      console.error('Resim güncellenirken hata:', updateError);
      return NextResponse.json({ error: 'Resim güncellenirken bir hata oluştu' }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      image: updatedImage
    });
    
  } catch (error) {
    console.error('Resim güncellenirken bir hata oluştu:', error);
    return NextResponse.json({ 
      error: 'Resim güncellenirken bir hata oluştu',
      details: error.message
    }, { status: 500 });
  }
}

// Resim silme
export async function DELETE(request) {
  try {
    // URL'den resim id'sini al
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('id');
    
    if (!imageId) {
      return NextResponse.json({ error: 'Resim ID\'si gereklidir' }, { status: 400 });
    }
    
    // Cookie işleme işlemleri
    const cookieHeader = request.headers.get('cookie');
    const supabaseCookieMatch = cookieHeader && cookieHeader.match(/sb-\w+-auth-token=([^;]+)/);
    const supabaseCookieValue = supabaseCookieMatch ? supabaseCookieMatch[1] : null;
    
    let parsedCookieValue = null;
    try {
      const decodedCookie = supabaseCookieValue ? decodeURIComponent(supabaseCookieValue) : null;
      if (decodedCookie && decodedCookie.startsWith('[') && decodedCookie.endsWith(']')) {
        parsedCookieValue = JSON.parse(decodedCookie);
      }
    } catch (e) {
      console.error('Cookie parse hatası:', e);
    }
    
    // Supabase istemcisi oluştur
    let response = NextResponse.next();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            if (name.includes('auth-token') && parsedCookieValue) {
              return JSON.stringify(parsedCookieValue);
            }
            const cookie = request.cookies.get(name)?.value;
            return cookie;
          },
          set(name, value, options) {
            response.cookies.set({
              name,
              value,
              ...options
            });
          },
          remove(name, options) {
            response.cookies.set({
              name,
              value: '',
              ...options,
              maxAge: 0
            });
          }
        },
      }
    );
    
    // Oturum tokenlarını ayarla
    if (parsedCookieValue && Array.isArray(parsedCookieValue) && parsedCookieValue.length >= 2) {
      const accessToken = parsedCookieValue[0];
      const refreshToken = parsedCookieValue[1];
      
      await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      });
    }
    
    // Oturum kontrolü
    const { data: authData } = await supabase.auth.getSession();
    const session = authData?.session;
    
    if (!session) {
      return NextResponse.json({ error: 'Oturum açmalısınız' }, { status: 401 });
    }
    
    // Kullanıcı ve rol kontrolü
    const userId = session.user.id;
    
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();
    
    if (roleError || !roleData) {
      return NextResponse.json({ error: 'Rol bilgisi alınamadı' }, { status: 500 });
    }
    
    if (roleData.role !== 'cilingir' && roleData.role !== 'admin') {
      return NextResponse.json({ error: 'Bu API sadece çilingirler tarafından kullanılabilir' }, { status: 403 });
    }
    
    // Çilingir ID'sini al
    const { data: locksmithData, error: locksmithError } = await supabase
      .from('locksmiths')
      .select('id')
      .eq('authid', userId)
      .single();
      
    if (locksmithError) {
      return NextResponse.json({ error: 'Çilingir bilgileriniz bulunamadı' }, { status: 404 });
    }
    
    const locksmithId = locksmithData.id;
    
    // Silinecek resmin URL'sini ve ID'sini al
    const { data: imageData, error: imageDataError } = await supabase
      .from('locksmith_images')
      .select('*')
      .eq('id', imageId)
      .eq('locksmith_id', locksmithId)
      .single();
    
    if (imageDataError || !imageData) {
      return NextResponse.json({ error: 'Bu resim size ait değil veya bulunamadı' }, { status: 403 });
    }
    
    // URL'den storage path'ini bul
    const imageUrl = imageData.image_url;
    const storageUrl = supabase.storage.from('business-images').getPublicUrl('').data.publicUrl;
    let filePath = null;
    
    if (imageUrl.startsWith(storageUrl)) {
      filePath = imageUrl.replace(storageUrl + '/', '');
    } else {
      // URL'den dosya yolunu çıkaramadık, silme işlemini atlayacağız
      console.warn('Dosya yolu çıkarılamadı, sadece veritabanı kaydı silinecek:', imageUrl);
    }
    
    // Önce veritabanı kaydını sil
    const { error: deleteDbError } = await supabase
      .from('locksmith_images')
      .delete()
      .eq('id', imageId);
    
    if (deleteDbError) {
      console.error('Resim silinirken hata:', deleteDbError);
      return NextResponse.json({ error: 'Resim silinirken bir hata oluştu' }, { status: 500 });
    }
    
    // Eğer storage yolu bulunabilmişse, dosyayı da sil
    if (filePath) {
      const { error: deleteStorageError } = await supabase
        .storage
        .from('business-images')
        .remove([filePath]);
      
      if (deleteStorageError) {
        console.warn('Dosya storage\'dan silinirken bir hata oluştu:', deleteStorageError);
        // Veritabanı kaydı silindi, storage silme hatası olsa da işlemi başarılı sayalım
      }
    }
    
    // Eğer silinen resim ana resim veya profil resmiyse, başka bir resmi bu rollere atayalım
    if (imageData.is_main || imageData.is_profile) {
      const { data: otherImages, error: otherImagesError } = await supabase
        .from('locksmith_images')
        .select('id')
        .eq('locksmith_id', locksmithId)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (!otherImagesError && otherImages && otherImages.length > 0) {
        const updateData = {};
        
        if (imageData.is_main) {
          updateData.is_main = true;
        }
        
        if (imageData.is_profile) {
          updateData.is_profile = true;
        }
        
        await supabase
          .from('locksmith_images')
          .update(updateData)
          .eq('id', otherImages[0].id);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Resim başarıyla silindi'
    });
    
  } catch (error) {
    console.error('Resim silinirken bir hata oluştu:', error);
    return NextResponse.json({ 
      error: 'Resim silinirken bir hata oluştu',
      details: error.message
    }, { status: 500 });
  }
}