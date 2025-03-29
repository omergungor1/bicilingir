import { NextResponse } from 'next/server';
import { getMe } from '../../../../actions';

// Test modu kontrolü
const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true';

export async function POST(request) {
  try {
    // Kimlik doğrulama kontrolü
    const user = await getMe();
    
    if (!user) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }
    
    // Multipart form-data handling
    const formData = await request.formData();
    const file = formData.get('file');
    const name = formData.get('name');
    
    if (!file || !name) {
      return NextResponse.json({ 
        error: 'Dosya ve isim gereklidir' 
      }, { status: 400 });
    }
    
    // Dosya tipini kontrol et
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Geçersiz dosya formatı. Sadece PDF, JPEG ve PNG formatları desteklenmektedir.' 
      }, { status: 400 });
    }
    
    // Dosya boyutunu kontrol et (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ 
        error: 'Dosya boyutu 5MB\'dan küçük olmalıdır.' 
      }, { status: 400 });
    }
    
    if (isTestMode) {
      // Test modunda başarılı yanıt döndür
      return NextResponse.json({ 
        message: 'Sertifika başarıyla yüklendi',
        certificate: {
          id: Math.floor(Math.random() * 1000),
          name,
          fileName: file.name,
          url: '/uploads/certificates/sample.pdf',
          uploadDate: new Date().toISOString()
        }
      });
    }
    
    // Gerçek sistemde sertifikayı yükle
    // Örnek implementasyon (gerçek kodda burada dosya yükleme ve veritabanı işlemleri olacak)
    
    return NextResponse.json({ 
      message: 'Sertifika başarıyla yüklendi',
      certificate: {
        id: Math.floor(Math.random() * 1000),
        name,
        fileName: file.name,
        url: '/uploads/certificates/sample.pdf',
        uploadDate: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Sertifika yüklenirken bir hata oluştu:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
} 