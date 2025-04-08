'use server';

// Eski, silinecek

import { testLocksmiths, testPackages, testReviews, testActivities,testServices } from '../lib/test-data';


// Test modu kontrolü
const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true';

export async function getMe() {
  if(isTestMode){
    return {
      id: 1,
      name: 'Ahmet Yılmaz',
      email: 'ahmet@gmail.com',
      phone: '1234567890',
      address: '1234567890',
    }
  }
}

/**
 * Tüm aktif çilingirleri getir
 */
export async function getLocksmiths() {
  // Test modunda ise test verilerinden ilk iki çilingiri getir
  if (isTestMode) {
    return { locksmiths: testLocksmiths };
  }
}

export async function getSimilarLocksmiths(id) {
  // Test modunda ise test verilerinden ilk 2 çilingiri döndür
  if (isTestMode) {
    return { similarLocksmiths: testLocksmiths.slice(0, 2) };
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
}

export async function getServices() {
  // Test modunda ise test verileri kullan
  if (isTestMode) {
    return { services: testServices };
  }

  return { services: null };
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
}

// Paket sil
export async function deletePackage(id) {
  // Test modunda ise başarılı dön
  if (isTestMode) {
    return { success: true };
  }
}

// Değerlendirmeleri getir

export async function getLocksmithsReviews(locksmithId) {
  // Test modunda ise test verileri kullan
  if (isTestMode) {
      return { reviews: testReviews.filter(r => r.locksmithId == locksmithId && r.status == 'approved')};
  }
  
  
}

export async function getReviews(status = null) {
  // Test modunda ise test verileri kullan
  if (isTestMode) {
    let reviews = [...testReviews];
    if (status) {
      reviews = reviews.filter(r => r.status === status);
    }
    return { reviews };
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
} 