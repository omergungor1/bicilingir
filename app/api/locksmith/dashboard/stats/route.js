import { NextResponse } from 'next/server';
import { getMe } from '../../../../actions';

// Test verileri
const testStats = {
  today: {
    pageViews: 45,
    searches: 12,
    calls: 5,
    avgRating: 4.8
  },
  yesterday: {
    pageViews: 38,
    searches: 9,
    calls: 3,
    avgRating: 4.7
  },
  last7days: {
    pageViews: 320,
    searches: 87,
    calls: 23,
    avgRating: 4.7
  },
  last30days: {
    pageViews: 1250,
    searches: 342,
    calls: 95,
    avgRating: 4.6
  },
  thisMonth: {
    pageViews: 980,
    searches: 265,
    calls: 78,
    avgRating: 4.6
  },
  thisYear: {
    pageViews: 11540,
    searches: 3200,
    calls: 950,
    avgRating: 4.5
  },
  allTime: {
    pageViews: 25400,
    searches: 7890,
    calls: 2300,
    avgRating: 4.5
  }
};

// Test modu kontrolü
const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true';

export async function GET(request) {
  try {
    // Kimlik doğrulama kontrolü
    const user = await getMe();
    
    if (!user) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }
    
    // URL'den period parametresini al
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'today';
    
    // Geçerli periyod kontrolü
    const validPeriods = ['today', 'yesterday', 'last7days', 'last30days', 'thisMonth', 'thisYear', 'allTime'];
    if (!validPeriods.includes(period)) {
      return NextResponse.json({ error: 'Geçersiz periyod' }, { status: 400 });
    }
    
    if (isTestMode) {
      // Test modunda test verilerini döndür
      return NextResponse.json(testStats[period]);
    }
    
    // Gerçek sistemde ilgili döneme ait istatistikleri getir
    // Örnek implementasyon (gerçek kodda burada veritabanı sorgusu olacak)
    
    return NextResponse.json(testStats[period]);
  } catch (error) {
    console.error('İstatistikler getirilirken bir hata oluştu:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
} 