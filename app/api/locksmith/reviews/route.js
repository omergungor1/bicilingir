import { NextResponse } from 'next/server';
import { getMe } from '../../../actions';
import { testReviews } from '../../../../lib/test-data';

// Test modu kontrolü
const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true';

// Her sayfada gösterilecek değerlendirme sayısı
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
    const rating = searchParams.get('rating');
    
    if (page < 1) {
      return NextResponse.json({ 
        error: 'Geçersiz sayfa numarası' 
      }, { status: 400 });
    }
    
    if (isTestMode) {
      // Test modunda test verilerini filtreleme ve sayfalama
      let filteredReviews = [...testReviews];
      
      // Yıldız sayısına göre filtreleme
      if (rating && ['1', '2', '3', '4', '5'].includes(rating)) {
        filteredReviews = filteredReviews.filter(review => 
          review.rating === parseInt(rating, 10)
        );
      }
      
      // Toplam sayfa sayısını hesapla
      const totalPages = Math.ceil(filteredReviews.length / PAGE_SIZE);
      
      // Sayfalama
      const start = (page - 1) * PAGE_SIZE;
      const end = start + PAGE_SIZE;
      const paginatedReviews = filteredReviews.slice(start, end);
      
      return NextResponse.json({
        reviews: paginatedReviews,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: filteredReviews.length
        }
      });
    }
    
    // Gerçek sistemde değerlendirmeleri getir
    // Örnek implementasyon (gerçek kodda burada veritabanı sorgusu olacak)
    
    return NextResponse.json({
      reviews: [],
      pagination: {
        currentPage: page,
        totalPages: 0,
        totalItems: 0
      }
    });
  } catch (error) {
    console.error('Değerlendirmeler getirilirken bir hata oluştu:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
} 