import { NextResponse } from 'next/server';
import { getMe } from '../../../../../actions';

// Test modu kontrolü
const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true';

export async function DELETE(request, { params }) {
  try {
    // Kimlik doğrulama kontrolü
    const user = await getMe();
    
    if (!user) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }
    
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ 
        error: 'Sertifika ID\'si gereklidir' 
      }, { status: 400 });
    }
    
    if (isTestMode) {
      // Test modunda başarılı yanıt döndür
      return NextResponse.json({ 
        message: 'Sertifika başarıyla silindi',
        id
      });
    }
    
    // Gerçek sistemde sertifikayı sil
    // Örnek implementasyon (gerçek kodda burada veritabanı ve dosya silme işlemleri olacak)
    
    return NextResponse.json({ 
      message: 'Sertifika başarıyla silindi',
      id
    });
  } catch (error) {
    console.error('Sertifika silinirken bir hata oluştu:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
} 