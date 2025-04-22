import { NextResponse } from 'next/server';
import { createRouteClient, createOrUpdateUser } from '../../../utils';

export async function POST(request) {
  try {
    // İstemci oluştur
    const { supabase } = createRouteClient(request);

    // İstek gövdesini al
    const requestData = await request.json();
    const { sessionId, userId, userIp, userAgent } = requestData;


    //Silinecek
    return NextResponse.json({
      userId,
      sessionId,
      isNewUser: false
    });

    // console.log('User Track API', { sessionId, userId, userIp, userAgent });

    // Session ID kontrolü
    if (!sessionId) {
      return NextResponse.json({
        error: "Session ID gerekli"
      }, { status: 400 });
    }

    // Kullanıcı oluştur veya güncelle
    try {
      // Önce userId var mı ve users tablosunda mevcut mu kontrol et
      let newUserId = userId;
      let isNewUser = false;

      // Eğer userId varsa, veritabanında kontrol et
      if (userId) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('id', userId)
          .limit(1);

        if (userError) {
          console.error('Kullanıcı kontrolü sırasında hata:', userError);
        }

        // Kullanıcı bulunamadıysa, createOrUpdateUser fonksiyonunu çağır
        if (!userData || userData.length === 0) {
          console.log(`Belirtilen kullanıcı ID (${userId}) veritabanında bulunamadı, yeni kayıt oluşturulacak`);
          const result = await createOrUpdateUser(supabase, null, sessionId, userIp, userAgent);
          newUserId = result.userId;
          isNewUser = result.isNewUser;
        } else {
          console.log(`Kullanıcı ID (${userId}) bulundu, güncelleniyor...`);
          const result = await createOrUpdateUser(supabase, userId, sessionId, userIp, userAgent);
          newUserId = result.userId;
          isNewUser = false; // Kullanıcı zaten var, yeni değil
        }
      } else {
        // userId yoksa yeni bir kullanıcı oluştur
        console.log('Kullanıcı ID yok, yeni kullanıcı oluşturuluyor...');
        const result = await createOrUpdateUser(supabase, null, sessionId, userIp, userAgent);
        newUserId = result.userId;
        isNewUser = result.isNewUser;
      }

      return NextResponse.json({
        userId: newUserId,
        sessionId,
        isNewUser
      });
    } catch (error) {
      console.error('Kullanıcı bilgileri işlenirken hata:', error);
      return NextResponse.json({
        error: "Kullanıcı bilgileri işlenirken hata oluştu"
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Kullanıcı takip hatası:', error);
    return NextResponse.json({
      error: "Sunucu hatası"
    }, { status: 500 });
  }
} 