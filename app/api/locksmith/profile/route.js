import { NextResponse } from 'next/server';
import { getMe } from '../../../actions';

// Test modu kontrolü
const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true';

// Test profil verisi
const testProfile = {
  id: 1,
  businessName: 'Yılmaz Çilingir',
  name: 'Ahmet Yılmaz',
  email: 'ahmet@yilmazcilingir.com',
  phone: '0532 123 45 67',
  city: 'İstanbul',
  district: 'Kadıköy',
  address: 'Caferağa Mah. Moda Cad. No:123',
  about: 'İstanbul\'un en güvenilir çilingir hizmetini sunuyoruz. 20 yıllık tecrübemizle 7/24 hizmetinizdeyiz.',
  logo: '/images/profile/logo.png',
  avatar: '/images/profile/avatar.jpg',
  social: {
    facebook: 'https://facebook.com/yilmazcilingir',
    instagram: 'https://instagram.com/yilmazcilingir',
    twitter: 'https://twitter.com/yilmazcilingir'
  },
  experience: 20,
  foundedYear: 2002
};

export async function GET() {
  try {
    // Kimlik doğrulama kontrolü
    const user = await getMe();
    
    if (!user) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }
    
    if (isTestMode) {
      // Test modunda test verisini döndür
      return NextResponse.json(testProfile);
    }
    
    // Gerçek sistemde profil bilgilerini getir
    // Örnek implementasyon (gerçek kodda burada veritabanı sorgusu olacak)
    
    return NextResponse.json({});
  } catch (error) {
    console.error('Profil bilgileri getirilirken bir hata oluştu:', error);
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
    const requiredFields = ['businessName', 'name', 'email', 'phone', 'city', 'district'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({ 
        error: 'Eksik alanlar', 
        missingFields 
      }, { status: 400 });
    }
    
    if (isTestMode) {
      // Test modunda başarılı yanıt döndür
      return NextResponse.json({ 
        message: 'Profil başarıyla güncellendi',
        profile: { ...testProfile, ...data }
      });
    }
    
    // Gerçek sistemde profil bilgilerini güncelle
    // Örnek implementasyon (gerçek kodda burada veritabanı sorgusu olacak)
    
    return NextResponse.json({ 
      message: 'Profil başarıyla güncellendi',
      profile: { ...testProfile, ...data }
    });
  } catch (error) {
    console.error('Profil güncellenirken bir hata oluştu:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
} 