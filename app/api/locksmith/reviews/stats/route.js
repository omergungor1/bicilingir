import { NextResponse } from 'next/server';
import { getMe } from '../../../../actions';
import { testReviews } from '../../../../../lib/test-data';

// Test modu kontrolü
const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true';

export async function GET() {
  try {
    // Kimlik doğrulama kontrolü
    const user = await getMe();
    
    if (!user) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }
    
    if (isTestMode) {
      // Test modunda yıldız dağılımını hesapla
      const starCounts = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0
      };
      
      // Her yıldız seviyesi için sayıları hesapla
      testReviews.forEach(review => {
        if (review.rating >= 1 && review.rating <= 5) {
          starCounts[review.rating]++;
        }
      });
      
      // Toplam yorum sayısı
      const totalReviews = testReviews.length;
      
      // Ortalama puanı hesapla
      const totalStars = testReviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalReviews > 0 ? (totalStars / totalReviews).toFixed(1) : 0;
      
      // Yüzdeleri hesapla
      const starPercentages = {};
      Object.keys(starCounts).forEach(star => {
        starPercentages[star] = totalReviews > 0 
          ? ((starCounts[star] / totalReviews) * 100).toFixed(1) 
          : 0;
      });
      
      return NextResponse.json({
        totalReviews,
        averageRating,
        starCounts,
        starPercentages
      });
    }
    
    // Gerçek sistemde istatistikleri getir
    // Örnek implementasyon (gerçek kodda burada veritabanı sorgusu olacak)
    
    return NextResponse.json({
      totalReviews: 0,
      averageRating: 0,
      starCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      starPercentages: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    });
  } catch (error) {
    console.error('İstatistikler getirilirken bir hata oluştu:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
} 