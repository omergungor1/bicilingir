'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';
import { testLocksmiths, testPackages, testReviews, testActivities } from '../lib/test-data';

// Test modu kontrolü
const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true';

// Supabase istemcisini oluştur
const getSupabase = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: false
      }
    }
  );
};

/**
 * Tüm aktif çilingirleri getir
 */
export async function getLocksmiths() {
  // Test modunda ise test verilerinden ilk iki çilingiri getir
  if (isTestMode) {
    return { locksmiths: testLocksmiths };
  }
  
  const supabase = getSupabase();
  
  try {
    // Aktif ve doğrulanmış çilingirleri getir
    const { data: locksmiths, error } = await supabase
      .from('locksmiths')
      .select(`
        *,
        locksmith_services(
          service_id,
          services(name)
        ),
        working_hours(day, open_time, close_time, is_open),
        images(id, storage_path, is_profile)
      `)
      .eq('is_active', true)
      .eq('is_verified', true)
      .limit(2); // Sadece ilk 2 çilingiri getir
    
    if (error) {
      console.error('Çilingirler getirilirken hata oluştu:', error);
      return { error };
    }
    
    // Verileri formatla
    const formattedLocksmiths = locksmiths.map((locksmith) => {
      // Hizmetleri formatla
      const services = locksmith.locksmith_services.map(
        (service) => service.services?.name
      ).filter(Boolean);
      
      // Profil resmi varsa al
      const profileImage = locksmith.images.find((img) => img.is_profile);
      const imageUrl = profileImage ? profileImage.storage_path : null;
      
      // Çalışma saatlerini formatla
      const workingHours = locksmith.working_hours.reduce((acc, curr) => {
        acc[curr.day] = {
          open: curr.open_time,
          close: curr.close_time,
          isOpen: curr.is_open
        };
        return acc;
      }, {});
      
      return {
        id: locksmith.id,
        name: locksmith.name,
        location: locksmith.location,
        rating: locksmith.average_rating,
        reviewCount: locksmith.review_count,
        services,
        price: locksmith.price_range,
        description: locksmith.description,
        detailed_description: locksmith.detailed_description,
        phone: locksmith.phone,
        experience: locksmith.experience,
        address: locksmith.address,
        website: locksmith.website,
        workingHours,
        imageUrl,
        images: locksmith.images.map(img => img.storage_path),
      };
    });
    
    return { locksmiths: formattedLocksmiths };
  } catch (error) {
    console.error('Çilingirler getirilirken beklenmeyen hata:', error);
    return { error: 'Veritabanı işlemi sırasında bir hata oluştu.' };
  }
}

export async function similarLocksmiths(location, services) {
  // Test modunda ise test verilerinden ilk 2 çilingiri döndür
  if (isTestMode) {
    return { locksmiths: testLocksmiths.slice(0, 2) };
  }
  
  const supabase = getSupabase();
  
  try {
    // Konum ve hizmetlere göre benzer çilingirleri getir
    let query = supabase
      .from('locksmiths')
      .select(`
        *,
        locksmith_services(
          service_id,
          services(name)
        ),
        working_hours(day, open_time, close_time, is_open),
        images(id, storage_path, is_profile)
      `)
      .eq('is_active', true)
      .eq('is_verified', true)
      .limit(2);
    
    // Eğer konum belirtilmişse filtrele
    if (location) {
      query = query.ilike('location', `%${location}%`);
    }
    
    const { data: locksmiths, error } = await query;
    
    if (error) {
      console.error('Benzer çilingirler getirilirken hata oluştu:', error);
      return { error };
    }
    
    // Verileri formatla
    const formattedLocksmiths = locksmiths.map((locksmith) => {
      // Hizmetleri formatla
      const services = locksmith.locksmith_services.map(
        (service) => service.services?.name
      ).filter(Boolean);
      
      // Profil resmi varsa al
      const profileImage = locksmith.images.find((img) => img.is_profile);
      const imageUrl = profileImage ? profileImage.storage_path : null;
      
      // Çalışma saatlerini formatla
      const workingHours = locksmith.working_hours.reduce((acc, curr) => {
        acc[curr.day] = {
          open: curr.open_time,
          close: curr.close_time,
          isOpen: curr.is_open
        };
        return acc;
      }, {});
      
      return {
        id: locksmith.id,
        name: locksmith.name,
        location: locksmith.location,
        rating: locksmith.average_rating,
        reviewCount: locksmith.review_count,
        services,
        price: locksmith.price_range,
        description: locksmith.description,
        detailed_description: locksmith.detailed_description,
        phone: locksmith.phone,
        experience: locksmith.experience,
        address: locksmith.address,
        website: locksmith.website,
        workingHours,
        imageUrl,
        images: locksmith.images.map(img => img.storage_path),
      };
    });
    
    return { locksmiths: formattedLocksmiths };
  } catch (error) {
    console.error('Benzer çilingirler getirilirken beklenmeyen hata:', error);
    return { error: 'Veritabanı işlemi sırasında bir hata oluştu.' };
  }
}

/**
 * ID'ye göre çilingir detaylarını getir
 */
export async function getLocksmithById(id) {
  // Test modunda ise test verileri kullan
  if (isTestMode) {
    const locksmith = testLocksmiths.find(l => l.id === id);
    if (!locksmith) {
      return { error: 'Çilingir bulunamadı' };
    }
    return { locksmith };
  }
  
  const supabase = getSupabase();
  
  try {
    // Çilingir detaylarını getir
    const { data: locksmith, error } = await supabase
      .from('locksmiths')
      .select(`
        *,
        locksmith_services(
          service_id,
          services(name)
        ),
        working_hours(day, open_time, close_time, is_open),
        images(id, storage_path, is_profile),
        documents(id, name, storage_path, is_verified)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Çilingir detayları getirilirken hata oluştu:', error);
      return { error };
    }
    
    // Hizmetleri formatla
    const services = locksmith.locksmith_services.map(
      (service) => ({ name: service.services?.name })
    ).filter(Boolean);
    
    // Profil resmi varsa al
    const profileImage = locksmith.images.find((img) => img.is_profile);
    const imageUrl = profileImage ? profileImage.storage_path : null;
    
    // Çalışma saatlerini formatla
    const workingHours = locksmith.working_hours.reduce((acc, curr) => {
      acc[curr.day] = {
        open: curr.open_time,
        close: curr.close_time,
        isOpen: curr.is_open
      };
      return acc;
    }, {});
    
    // Belgeleri formatla
    const certificates = locksmith.documents
      .filter(doc => doc.is_verified)
      .map(doc => doc.name);
    
    // Değerlendirmeleri getir
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('*')
      .eq('locksmith_id', id)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (reviewsError) {
      console.error('Değerlendirmeler getirilirken hata oluştu:', reviewsError);
    }
    
    // Değerlendirmeleri formatla
    const formattedReviews = reviews ? reviews.map(review => ({
      user: review.user_name,
      rating: review.rating,
      comment: review.comment,
      date: new Date(review.created_at).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    })) : [];
    
    // Formatlanmış çilingir verisi
    const formattedLocksmith = {
      id: locksmith.id,
      name: locksmith.name,
      location: locksmith.location,
      rating: locksmith.average_rating,
      reviewCount: locksmith.review_count,
      services,
      price: locksmith.price_range,
      description: locksmith.description,
      detailedDescription: locksmith.detailed_description,
      phone: locksmith.phone,
      experience: locksmith.experience,
      address: locksmith.address,
      website: locksmith.website,
      workingHours,
      images: locksmith.images.map(img => img.storage_path),
      certificates,
      reviews: formattedReviews
    };
    
    return { locksmith: formattedLocksmith };
  } catch (error) {
    console.error('Çilingir detayları getirilirken beklenmeyen hata:', error);
    return { error: 'Veritabanı işlemi sırasında bir hata oluştu.' };
  }
}

/**
 * Yeni değerlendirme ekle
 */
export async function addReview(locksmithId, reviewData) {
  // Test modunda ise sabit veri dön
  if (isTestMode) {
    return { 
      success: true, 
      review: {
        id: 'mock-id-' + Date.now(),
        locksmith_id: locksmithId,
        user_name: reviewData.userName,
        rating: reviewData.rating,
        comment: reviewData.comment,
        status: 'pending',
        created_at: new Date().toISOString()
      } 
    };
  }
  
  const supabase = getSupabase();
  
  try {
    // Yeni değerlendirme ekle
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        locksmith_id: locksmithId,
        user_name: reviewData.userName,
        user_email: reviewData.userEmail || null,
        rating: reviewData.rating,
        comment: reviewData.comment,
        location: reviewData.location || null,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Değerlendirme eklenirken hata oluştu:', error);
      return { error };
    }
    
    // Aktivite logu ekle
    await supabase
      .from('activities')
      .insert({
        activity_type: 'review',
        description: `${reviewData.userName} isimli kullanıcı ${reviewData.rating} yıldız değerlendirme yaptı.`,
        subject_id: data.id
      });
    
    return { success: true, review: data };
  } catch (error) {
    console.error('Değerlendirme eklenirken beklenmeyen hata:', error);
    return { error: 'Veritabanı işlemi sırasında bir hata oluştu.' };
  }
}

/**
 * Admin paneliyle ilgili fonksiyonlar
 */

// Paketleri getir
export async function getPackages() {
  // Test modunda ise test verileri kullan
  if (isTestMode) {
    return { packages: testPackages };
  }
  
  const supabase = getSupabase();
  
  try {
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .order('rocket_amount', { ascending: true });
    
    if (error) throw error;
    return { packages: data };
  } catch (error) {
    console.error('Paketler getirilirken hata:', error);
    return { error: 'Paketler getirilirken bir hata oluştu.' };
  }
}

// Paket ekle
export async function addPackage(packageData) {
  // Test modunda ise sabit veri dön
  if (isTestMode) {
    return { 
      success: true, 
      package: {
        id: 'mock-id-' + Date.now(),
        name: packageData.name,
        description: packageData.description,
        rocket_amount: packageData.rocketAmount,
        price: packageData.price,
        is_active: packageData.isActive,
        is_unlimited: packageData.isUnlimited,
        valid_until: packageData.validUntil || null,
        created_at: new Date().toISOString()
      } 
    };
  }
  
  const supabase = getSupabase();
  
  try {
    const { data, error } = await supabase
      .from('packages')
      .insert({
        name: packageData.name,
        description: packageData.description,
        rocket_amount: packageData.rocketAmount,
        price: packageData.price,
        is_active: packageData.isActive,
        is_unlimited: packageData.isUnlimited,
        valid_until: packageData.validUntil || null,
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Cache'i yenile
    revalidatePath('/admin');
    
    return { success: true, package: data };
  } catch (error) {
    console.error('Paket eklenirken hata:', error);
    return { error: 'Paket eklenirken bir hata oluştu.' };
  }
}

// Paket sil
export async function deletePackage(id) {
  // Test modunda ise başarılı dön
  if (isTestMode) {
    return { success: true };
  }
  
  const supabase = getSupabase();
  
  try {
    const { error } = await supabase
      .from('packages')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    // Cache'i yenile
    revalidatePath('/admin');
    
    return { success: true };
  } catch (error) {
    console.error('Paket silinirken hata:', error);
    return { error: 'Paket silinirken bir hata oluştu.' };
  }
}

// Değerlendirmeleri getir
export async function getReviews(status = null) {
  // Test modunda ise test verileri kullan
  if (isTestMode) {
    let reviews = [...testReviews];
    if (status) {
      reviews = reviews.filter(r => r.status === status);
    }
    return { reviews };
  }
  
  const supabase = getSupabase();
  
  try {
    let query = supabase
      .from('reviews')
      .select(`
        *,
        locksmiths(name, location)
      `)
      .order('created_at', { ascending: false });
    
    // Eğer durum belirtilmişse filtrele
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return { reviews: data };
  } catch (error) {
    console.error('Değerlendirmeler getirilirken hata:', error);
    return { error: 'Değerlendirmeler getirilirken bir hata oluştu.' };
  }
}

// Değerlendirme durumunu güncelle (onayla/reddet)
export async function updateReviewStatus(id, status) {
  // Test modunda ise sabit veri dön
  if (isTestMode) {
    return { 
      success: true, 
      review: {
        id,
        status,
        updated_at: new Date().toISOString()
      } 
    };
  }
  
  const supabase = getSupabase();
  
  try {
    const { data, error } = await supabase
      .from('reviews')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Eğer değerlendirme onaylandıysa, çilingirin ortalama puanını güncelle
    if (status === 'approved') {
      // Önce çilingirin tüm onaylı değerlendirmelerini al
      const { data: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('rating')
        .eq('locksmith_id', data.locksmith_id)
        .eq('status', 'approved');
      
      if (reviewsError) throw reviewsError;
      
      // Ortalama puanı hesapla
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / reviews.length;
      
      // Çilingirin ortalama puanını ve değerlendirme sayısını güncelle
      const { error: updateError } = await supabase
        .from('locksmiths')
        .update({
          average_rating: averageRating.toFixed(2),
          review_count: reviews.length
        })
        .eq('id', data.locksmith_id);
      
      if (updateError) throw updateError;
    }
    
    // Cache'i yenile
    revalidatePath('/admin');
    
    return { success: true, review: data };
  } catch (error) {
    console.error('Değerlendirme durumu güncellenirken hata:', error);
    return { error: 'Değerlendirme durumu güncellenirken bir hata oluştu.' };
  }
}

// Aktiviteleri getir
export async function getActivities(type = null) {
  // Test modunda ise test verileri kullan
  if (isTestMode) {
    let activities = [...testActivities];
    if (type) {
      activities = activities.filter(a => a.activity_type === type);
    }
    return { activities };
  }
  
  const supabase = getSupabase();
  
  try {
    let query = supabase
      .from('activities')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Eğer tip belirtilmişse filtrele
    if (type) {
      query = query.eq('activity_type', type);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return { activities: data };
  } catch (error) {
    console.error('Aktiviteler getirilirken hata:', error);
    return { error: 'Aktiviteler getirilirken bir hata oluştu.' };
  }
} 