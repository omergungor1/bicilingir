import { NextResponse } from 'next/server';
import { getMe } from '../../../../actions';

// Test modu kontrolü
const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true';

// Test paket verileri
const testPackages = [
  {
    id: 1,
    name: 'Başlangıç Paketi',
    keys: 50,
    price: 199,
    validityDays: 30,
    features: [
      'Günlük 2 anahtar kullanımı',
      'Temel istatistikler',
      '30 gün geçerlilik'
    ],
    isPopular: false
  },
  {
    id: 2,
    name: 'Premium Paket',
    keys: 150,
    price: 499,
    validityDays: 60,
    features: [
      'Günlük 5 anahtar kullanımı',
      'Detaylı istatistikler',
      'Öncelikli listeleme',
      '60 gün geçerlilik'
    ],
    isPopular: true
  },
  {
    id: 3,
    name: 'Pro Paket',
    keys: 400,
    price: 999,
    validityDays: 90,
    features: [
      'Sınırsız günlük anahtar kullanımı',
      'Gelişmiş istatistikler',
      'Öncelikli listeleme',
      'Premium destek',
      '90 gün geçerlilik'
    ],
    isPopular: false
  }
];

export async function GET() {
  try {
    // Kimlik doğrulama kontrolü
    const user = await getMe();
    
    if (!user) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }
    
    if (isTestMode) {
      // Test modunda test verilerini döndür
      return NextResponse.json({ packages: testPackages });
    }
    
    // Gerçek sistemde paket bilgilerini getir
    // Örnek implementasyon (gerçek kodda burada veritabanı sorgusu olacak)
    
    return NextResponse.json({ packages: [] });
  } catch (error) {
    console.error('Paket bilgileri getirilirken bir hata oluştu:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
} 