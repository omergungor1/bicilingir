import { NextResponse } from 'next/server';
import { checkApiAuth } from '../../../utils';

// Test verileri
const testStats = {
  all: {
    see: 25400,
    see_percent: 12.5,
    call: 7890,
    call_percent: 3.2,
    visit: 2300,
    visit_percent: -4.6,
    review: 4,
    review_percent: 9.8
  },
  today: {
    see: 344,
    see_percent: 12.5,
    call: 212,
    call_percent: 8.3,
    visit: 123,
    visit_percent: 5.6,
    review: 45,
    review_percent: 1.8,
  },
  yesterday: {
    see: 38,
    see_percent: 11,
    call: 9,
    call_percent: 4.2,
    visit: 3,
    visit_percent: 4.6,
    review: 4,
    review_percent: 7.8
  },
  last7days: {
    see: 87,
    see_percent: 6.5,
    call: 23,
    call_percent: 4.2,
    visit: 4,
    visit_percent: 4.6,
    review: 4,
    review_percent: 7.8
  },
  last30days: {
    see: 342,
    see_percent: 17.5,
    call: 95,
    call_percent: 2.2,
    visit: 4,
    visit_percent: -4.6,
    review: 4,
    review_percent: 3.8
  },
  thisMonth: {
    see: 980,
    see_percent: 6.5,
    call: 265,
    call_percent: 3.2,
    visit: 78,
    visit_percent: -4.6,
    review: 4,
    review_percent: 9.8
  },
  thisYear: {
    see: 11540,
    see_percent: 7.5,
    call: 3200,
    call_percent: 3.2,
    visit: 950,
    visit_percent: -4.6,
    review: 4,
    review_percent: 9.8
  },
  allTime: {
    see: 25400,
    see_percent: 12.5,
    call: 7890,
    call_percent: 3.2,
    visit: 2300,
    visit_percent: -4.6,
    review: 4,
    review_percent: 9.8
  }
};

// Test modu kontrolü
const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true';

export async function GET(request) {
  try {
    // Yetki kontrolü - sadece admin ve çilingirler erişebilir
    const { error, supabase, user, userRole } = await checkApiAuth(request, ['admin', 'cilingir']);
    
    if (error) {
      return error;
    }
    
    // URL'den period parametresini al
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'today';
    
    // Geçerli periyod kontrolü
    const validPeriods = ['today', 'yesterday', 'last7days', 'last30days', 'thisMonth', 'thisYear', 'allTime','all'];
    if (!validPeriods.includes(period)) {
      return NextResponse.json({ error: 'Geçersiz periyod' }, { status: 400 });
    }
    
    if (isTestMode) {
      // Test modunda test verilerini döndür
      return NextResponse.json(testStats[period]);
    }
    
    // Gerçek sistemde ilgili döneme ait istatistikleri getir
    // TODO: Burada çilingir ID'sini user.id'den alarak ilgili çilingirin istatistiklerini getir
    
    return NextResponse.json(testStats[period]);
  } catch (error) {
    console.error('İstatistikler getirilirken bir hata oluştu:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
} 