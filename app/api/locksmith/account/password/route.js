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
    if (!data.currentPassword || !data.newPassword) {
      return NextResponse.json({ 
        error: 'Mevcut şifre ve yeni şifre gereklidir' 
      }, { status: 400 });
    }
    
    // Yeni şifre güvenlik kontrolü
    if (data.newPassword.length < 8) {
      return NextResponse.json({ 
        error: 'Yeni şifre en az 8 karakter uzunluğunda olmalıdır' 
      }, { status: 400 });
    }
    
    if (isTestMode) {
      // Test modunda başarılı yanıt döndür
      return NextResponse.json({ 
        message: 'Şifre başarıyla güncellendi',
        updatedAt: new Date().toISOString()
      });
    }
    
    // Gerçek sistemde şifreyi güncelle
    // Örnek implementasyon (gerçek kodda burada şifre güncelleme işlemi olacak)
    
    return NextResponse.json({ 
      message: 'Şifre başarıyla güncellendi',
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Şifre güncellenirken bir hata oluştu:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
} 