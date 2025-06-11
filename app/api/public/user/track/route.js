import { NextResponse } from 'next/server';
import { createRouteClient, createOrUpdateUser } from '../../../utils';

export async function POST(request) {
  try {
    // İstemci oluştur
    const { supabase } = createRouteClient(request);

    // İstek gövdesini al
    const requestData = await request.json();
    const { sessionId, userId, userIp, userAgent } = requestData;

    // Session ID kontrolü
    if (!sessionId) {
      return NextResponse.json({
        error: "Session ID gerekli"
      }, { status: 400 });
    }

    // Kullanıcı oluştur veya güncelle
    try {
      let existingUser = null;

      // Eğer userId varsa, veritabanında kontrol et
      if (userId) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('id', userId)
          .limit(1);

        if (userError) {
          console.error('Kullanıcı kontrolü sırasında hata:', userError);
        } else {
          existingUser = userData?.[0];
        }
      }

      // Kullanıcı yoksa veya bulunamadıysa null, varsa userId kullan
      const result = await createOrUpdateUser(
        supabase,
        existingUser?.id || null,
        sessionId,
        userIp,
        userAgent
      );

      return NextResponse.json({
        userId: result.userId,
        sessionId,
        isNewUser: !existingUser
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