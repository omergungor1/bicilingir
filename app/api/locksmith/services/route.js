import { NextResponse } from 'next/server';
import { getMe, getServices } from '../../../actions';

// Test modu kontrolü
const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true';

// Tüm hizmetleri ve çilingirin aktif hizmetlerini getirir
export async function GET() {
  try {
    // Kimlik doğrulama kontrolü
    const user = await getMe();
    
    if (!user) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }
    
    // Tüm hizmetleri getir
    const { services } = await getServices();
    
    if (!services) {
      return NextResponse.json({ error: 'Hizmetler yüklenirken bir hata oluştu' }, { status: 500 });
    }
    
    if (isTestMode) {
      // Test modunda, test servisleri ve seçili hizmetleri döndür
      // İlk 5 hizmeti aktif olarak işaretle
      const availableServices = services.map((service, index) => ({
        ...service,
        isActive: index < 5 // İlk 5 hizmet aktif
      }));
      
      return NextResponse.json({ 
        services: availableServices,
        activeServiceIds: availableServices
          .filter(s => s.isActive)
          .map(s => s.id)
      });
    }
    
    // Gerçek sistemde tüm servisler ve çilingirin aktif servisleri
    // Örnek implementasyon (gerçek kodda burada veritabanı sorgusu olacak)
    
    return NextResponse.json({ 
      services: [],
      activeServiceIds: []
    });
  } catch (error) {
    console.error('Hizmetler getirilirken bir hata oluştu:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

// Çilingirin aktif hizmetlerini günceller
export async function PUT(request) {
  try {
    // Kimlik doğrulama kontrolü
    const user = await getMe();
    
    if (!user) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }
    
    // Gönderilen verileri al
    const data = await request.json();
    
    if (!data.serviceIds || !Array.isArray(data.serviceIds)) {
      return NextResponse.json({ 
        error: 'Geçersiz veri formatı. serviceIds dizisi gereklidir.' 
      }, { status: 400 });
    }
    
    if (isTestMode) {
      // Test modunda başarılı yanıt döndür
      return NextResponse.json({ 
        message: 'Hizmetler başarıyla güncellendi',
        activeServiceIds: data.serviceIds
      });
    }
    
    // Gerçek sistemde hizmetleri güncelle
    // Örnek implementasyon (gerçek kodda burada veritabanı sorgusu olacak)
    
    return NextResponse.json({ 
      message: 'Hizmetler başarıyla güncellendi',
      activeServiceIds: data.serviceIds
    });
  } catch (error) {
    console.error('Hizmetler güncellenirken bir hata oluştu:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
} 