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
    if (typeof data.isActive !== 'boolean') {
      return NextResponse.json({ 
        error: 'isActive alanı boolean olmalıdır' 
      }, { status: 400 });
    }
    
    if (isTestMode) {
      // Test modunda başarılı yanıt döndür
      return NextResponse.json({ 
        message: `Hesap durumu başarıyla ${data.isActive ? 'aktif' : 'pasif'} olarak güncellendi`,
        status: {
          isActive: data.isActive,
          updatedAt: new Date().toISOString()
        }
      });
    }
    
    // Gerçek sistemde hesap durumunu güncelle
    // Örnek implementasyon (gerçek kodda burada veritabanı sorgusu olacak)
    
    return NextResponse.json({ 
      message: `Hesap durumu başarıyla ${data.isActive ? 'aktif' : 'pasif'} olarak güncellendi`,
      status: {
        isActive: data.isActive,
        updatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Hesap durumu güncellenirken bir hata oluştu:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
} 