import { NextResponse } from 'next/server';
import { createRouteClient } from '../../../utils';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
    const { supabase } = createRouteClient(request);
    const { locksmithId, rating, comment } = await request.json();
    
    // Gerekli alanları kontrol et
    if (!locksmithId || !rating) {
      return NextResponse.json({ 
        success: false, 
        error: 'Gerekli alanlar eksik: locksmithId ve rating zorunludur' 
      }, { status: 400 });
    }
    
    // Rating değerini kontrol et
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ 
        success: false, 
        error: 'Geçersiz değerlendirme puanı: 1-5 arasında olmalıdır' 
      }, { status: 400 });
    }
    
    // İstemci IP adresini al
    const forwardedFor = request.headers.get('x-forwarded-for');
    const clientIp = forwardedFor ? forwardedFor.split(',')[0] : '0.0.0.0';
    
    // User-Agent bilgisini al
    const userAgent = request.headers.get('user-agent') || '';
    
    // Kullanıcı varsa bul, yoksa oluştur
    let { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('userip', clientIp)
      .limit(1);
    
    let userId;
    
    if (existingUser && existingUser.length > 0) {
      userId = existingUser[0].id;
    } else {
      // Yeni kullanıcı oluştur
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert([{ 
          id: uuidv4(),
          userip: clientIp,
          useragent: userAgent,
          createdat: new Date().toISOString(),
          updatedat: new Date().toISOString()
        }])
        .select();
      
      if (userError) {
        console.error('Kullanıcı oluşturma hatası:', userError);
        return NextResponse.json({ 
          success: false, 
          error: 'Kullanıcı oluşturulurken bir hata oluştu' 
        }, { status: 500 });
      }
      
      userId = newUser[0].id;
    }
    
    // Yeni değerlendirme oluştur
    const reviewId = uuidv4();
    const { error: reviewError } = await supabase
      .from('reviews')
      .insert([{
        id: reviewId,
        locksmithid: locksmithId,
        userid: userId,
        rating: rating,
        comment: comment || null,
        status: 'pending',
        ipaddress: clientIp,
        devicetype: userAgent.includes('Mobile') ? 'mobile' : 'desktop',
        useragent: userAgent,
        createdat: new Date().toISOString()
      }]);


    if (reviewError) {
      console.error('Değerlendirme kaydetme hatası:', reviewError);
      return NextResponse.json({ 
        success: false, 
        error: 'Değerlendirme kaydedilirken bir hata oluştu' 
      }, { status: 500 });
    }
    
    // NOT: Kullanıcı aktivitesi kaydı artık frontend'den Redux ile yapılıyor
    // Bu nedenle buradaki aktivite kaydı kaldırıldı, böylece çift kayıt önlendi
    
    return NextResponse.json({
      success: true,
      message: 'Değerlendirme başarıyla kaydedildi',
      reviewId: reviewId
    });
    
  } catch (error) {
    console.error('Değerlendirme işleme hatası:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Beklenmeyen bir hata oluştu' 
    }, { status: 500 });
  }
} 