import { NextResponse } from 'next/server';
import { getMe } from '../../../../actions';
import { testActivities } from '../../../../../lib/test-data';

// Test modu kontrolü
const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true';

export async function GET(request) {
  try {
    // Kimlik doğrulama kontrolü
    const user = await getMe();
    
    if (!user) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }
    
    if (isTestMode) {
      // Test modunda son 5 aktiviteyi döndür
      return NextResponse.json(testActivities.slice(0, 5));
    }
    
    // Gerçek sistemde son 5 aktiviteyi getir
    // Örnek implementasyon (gerçek kodda burada veritabanı sorgusu olacak)
    
    return NextResponse.json([]);
  } catch (error) {
    console.error('Son aktiviteler getirilirken bir hata oluştu:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
} 