import { NextResponse } from 'next/server';
import { getMe } from '../../../../actions';

// Test modu kontrolü
const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true';

// Test bildirim ayarları
const testNotificationSettings = {
  email: {
    newReview: true,
    profileView: true,
    lowBalance: true,
    weeklyReport: true
  },
  sms: {
    newReview: true,
    profileView: false,
    lowBalance: true,
    emergencyCall: true
  }
};

export async function GET() {
  try {
    // Kimlik doğrulama kontrolü
    const user = await getMe();
    
    if (!user) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }
    
    if (isTestMode) {
      // Test modunda test verilerini döndür
      return NextResponse.json(testNotificationSettings);
    }
    
    // Gerçek sistemde bildirim ayarlarını getir
    // Örnek implementasyon (gerçek kodda burada veritabanı sorgusu olacak)
    
    return NextResponse.json({
      email: {},
      sms: {}
    });
  } catch (error) {
    console.error('Bildirim ayarları getirilirken bir hata oluştu:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    // Kimlik doğrulama kontrolü
    const user = await getMe();
    
    if (!user) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }
    
    // Gönderilen verileri al
    const data = await request.json();
    
    // Veri doğrulama
    if (!data.email || !data.sms || 
        typeof data.email !== 'object' || 
        typeof data.sms !== 'object') {
      return NextResponse.json({ 
        error: 'Geçersiz veri formatı' 
      }, { status: 400 });
    }
    
    // Email ve SMS ayarlarının her birinin boolean olduğunu kontrol et
    const validateSettings = (settings) => {
      return Object.values(settings).every(value => typeof value === 'boolean');
    };
    
    if (!validateSettings(data.email) || !validateSettings(data.sms)) {
      return NextResponse.json({ 
        error: 'Bildirim ayarları boolean değer olmalıdır' 
      }, { status: 400 });
    }
    
    if (isTestMode) {
      // Test modunda başarılı yanıt döndür
      return NextResponse.json({ 
        message: 'Bildirim ayarları başarıyla güncellendi',
        settings: {
          email: { ...testNotificationSettings.email, ...data.email },
          sms: { ...testNotificationSettings.sms, ...data.sms }
        }
      });
    }
    
    // Gerçek sistemde bildirim ayarlarını güncelle
    // Örnek implementasyon (gerçek kodda burada veritabanı sorgusu olacak)
    
    return NextResponse.json({ 
      message: 'Bildirim ayarları başarıyla güncellendi',
      settings: {
        email: data.email,
        sms: data.sms
      }
    });
  } catch (error) {
    console.error('Bildirim ayarları güncellenirken bir hata oluştu:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
} 