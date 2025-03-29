import { NextResponse } from 'next/server';
import { getMe } from '../../../../actions';

// Test modu kontrolü
const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true';

// Her sayfada gösterilecek kayıt sayısı
const PAGE_SIZE = 10;

// Test kullanım verileri
const testUsageData = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  date: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
  keysUsed: Math.floor(Math.random() * 5) + 1,
  purpose: ['Öne Çıkarma', 'Premium Listeleme', 'Acil Durum'][Math.floor(Math.random() * 3)],
  result: ['Başarılı', 'Başarısız'][Math.floor(Math.random() * 2)]
}));

export async function GET(request) {
  try {
    // Kimlik doğrulama kontrolü
    const user = await getMe();
    
    if (!user) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }
    
    // URL parametrelerini al
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const period = searchParams.get('period') || 'günlük';
    
    if (page < 1) {
      return NextResponse.json({ 
        error: 'Geçersiz sayfa numarası' 
      }, { status: 400 });
    }
    
    // Geçerli periyod kontrolü
    const validPeriods = ['günlük', 'haftalık', 'aylık'];
    if (!validPeriods.includes(period)) {
      return NextResponse.json({ 
        error: 'Geçersiz periyod' 
      }, { status: 400 });
    }
    
    if (isTestMode) {
      // Test modunda verileri filtreleme ve sayfalama
      let filteredData = [...testUsageData];
      
      // Periyoda göre filtreleme
      const now = new Date();
      const filterDate = new Date();
      
      switch (period) {
        case 'günlük':
          filterDate.setDate(now.getDate() - 1);
          break;
        case 'haftalık':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'aylık':
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      filteredData = filteredData.filter(item => 
        new Date(item.date) >= filterDate
      );
      
      // Toplam sayfa sayısını hesapla
      const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);
      
      // Sayfalama
      const start = (page - 1) * PAGE_SIZE;
      const end = start + PAGE_SIZE;
      const paginatedData = filteredData.slice(start, end);
      
      return NextResponse.json({
        usage: paginatedData,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: filteredData.length
        }
      });
    }
    
    // Gerçek sistemde kullanım geçmişini getir
    // Örnek implementasyon (gerçek kodda burada veritabanı sorgusu olacak)
    
    return NextResponse.json({
      usage: [],
      pagination: {
        currentPage: page,
        totalPages: 0,
        totalItems: 0
      }
    });
  } catch (error) {
    console.error('Kullanım geçmişi getirilirken bir hata oluştu:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
} 