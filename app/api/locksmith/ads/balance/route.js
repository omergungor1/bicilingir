import { NextResponse } from 'next/server';
import { getMe } from '../../../../actions';

// Test modu kontrolü
const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true';

// Test bakiye verisi
const testBalance = {
  currentBalance: 150,
  totalSpent: 850,
  lastPurchase: {
    amount: 100,
    date: '2024-03-15',
    packageName: 'Premium Paket'
  },
  lastUsage: {
    amount: 5,
    date: '2024-03-20',
    purpose: 'Öne Çıkarma'
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
      // Test modunda test verisini döndür
      return NextResponse.json(testBalance);
    }
    
    // Gerçek sistemde bakiye bilgilerini getir
    // Örnek implementasyon (gerçek kodda burada veritabanı sorgusu olacak)
    
    return NextResponse.json({
      currentBalance: 0,
      totalSpent: 0,
      lastPurchase: null,
      lastUsage: null
    });
  } catch (error) {
    console.error('Bakiye bilgileri getirilirken bir hata oluştu:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
} 