import { NextResponse } from 'next/server';
import { getMe } from '../../../actions';
import { testActivities } from '../../../../lib/test-data';

// Test modu kontrolü
const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true';

// Her sayfada gösterilecek aktivite sayısı
const PAGE_SIZE = 10;

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
    const type = searchParams.get('type'); // tümü, görüntüleme, ziyaret, çağrı, değerlendirme
    
    if (page < 1) {
      return NextResponse.json({ 
        error: 'Geçersiz sayfa numarası' 
      }, { status: 400 });
    }
    
    if (isTestMode) {
      // Test modunda test verilerini filtreleme ve sayfalama
      let filteredActivities = [...testActivities];
      
      // Tip parametresine göre filtreleme
      if (type && type !== 'tümü') {
        filteredActivities = filteredActivities.filter(activity => 
          activity.type === type
        );
      }
      
      // Toplam sayfa sayısını hesapla
      const totalPages = Math.ceil(filteredActivities.length / PAGE_SIZE);
      
      // Sayfalama
      const start = (page - 1) * PAGE_SIZE;
      const end = start + PAGE_SIZE;
      const paginatedActivities = filteredActivities.slice(start, end);
      
      return NextResponse.json({
        activities: paginatedActivities,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: filteredActivities.length
        }
      });
    }
    
    // Gerçek sistemde aktiviteleri getir
    // Örnek implementasyon (gerçek kodda burada veritabanı sorgusu olacak)
    
    return NextResponse.json({
      activities: [],
      pagination: {
        currentPage: page,
        totalPages: 0,
        totalItems: 0
      }
    });
  } catch (error) {
    console.error('Aktiviteler getirilirken bir hata oluştu:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
} 