import { NextResponse } from 'next/server';
import { getMe } from '../../../../actions';

// Test modu kontrolü
const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true';

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
    if (typeof data.isEnabled !== 'boolean') {
      return NextResponse.json({ 
        error: 'isEnabled alanı boolean olmalıdır' 
      }, { status: 400 });
    }
    
    if (typeof data.dailyKeyLimit !== 'number' || data.dailyKeyLimit < 0) {
      return NextResponse.json({ 
        error: 'dailyKeyLimit alanı pozitif bir sayı olmalıdır' 
      }, { status: 400 });
    }
    
    if (isTestMode) {
      // Test modunda başarılı yanıt döndür
      return NextResponse.json({ 
        message: 'Kullanım tercihleri başarıyla güncellendi',
        preferences: {
          isEnabled: data.isEnabled,
          dailyKeyLimit: data.dailyKeyLimit,
          updatedAt: new Date().toISOString()
        }
      });
    }
    
    // Gerçek sistemde kullanım tercihlerini güncelle
    // Örnek implementasyon (gerçek kodda burada veritabanı sorgusu olacak)
    
    return NextResponse.json({ 
      message: 'Kullanım tercihleri başarıyla güncellendi',
      preferences: {
        isEnabled: data.isEnabled,
        dailyKeyLimit: data.dailyKeyLimit,
        updatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Kullanım tercihleri güncellenirken bir hata oluştu:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
} 