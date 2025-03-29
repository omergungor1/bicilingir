import { NextResponse } from 'next/server';
import { getMe } from '../../../actions';

// Test modu kontrolü
const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true';

export async function DELETE(request) {
  try {
    // Kimlik doğrulama kontrolü
    const user = await getMe();
    
    if (!user) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }
    
    if (isTestMode) {
      // Test modunda başarılı yanıt döndür
      return NextResponse.json({ 
        message: 'Hesap başarıyla silindi',
        deletedAt: new Date().toISOString()
      });
    }
    
    // Gerçek sistemde hesabı sil
    // Örnek implementasyon (gerçek kodda burada veritabanı sorgusu olacak)
    
    return NextResponse.json({ 
      message: 'Hesap başarıyla silindi',
      deletedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Hesap silinirken bir hata oluştu:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
} 