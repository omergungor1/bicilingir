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
    
    // Paket ID kontrolü
    if (!data.packageId || typeof data.packageId !== 'number') {
      return NextResponse.json({ 
        error: 'Geçerli bir paket ID\'si gereklidir' 
      }, { status: 400 });
    }
    
    if (isTestMode) {
      // Test modunda başarılı yanıt döndür
      return NextResponse.json({ 
        message: 'Paket satın alma talebi başarıyla oluşturuldu',
        order: {
          id: Math.floor(Math.random() * 1000),
          packageId: data.packageId,
          status: 'pending',
          createdAt: new Date().toISOString(),
          paymentDetails: {
            amount: 499,
            currency: 'TRY',
            paymentUrl: 'https://payment-gateway.test/order/123'
          }
        }
      });
    }
    
    // Gerçek sistemde paket satın alma işlemini başlat
    // Örnek implementasyon (gerçek kodda burada ödeme sistemi entegrasyonu olacak)
    
    return NextResponse.json({ 
      message: 'Paket satın alma talebi başarıyla oluşturuldu',
      order: {
        id: Math.floor(Math.random() * 1000),
        packageId: data.packageId,
        status: 'pending',
        createdAt: new Date().toISOString(),
        paymentDetails: {
          amount: 0,
          currency: 'TRY',
          paymentUrl: ''
        }
      }
    });
  } catch (error) {
    console.error('Paket satın alma işlemi sırasında bir hata oluştu:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
} 