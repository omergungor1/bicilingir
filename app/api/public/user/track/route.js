import { NextResponse } from 'next/server';
import { createRouteClient, createOrUpdateUser } from '../../../utils';

export async function POST(request) {
  try {
    // İstemci oluştur
    const { supabase } = createRouteClient(request);

    // İstek gövdesini al
    const requestData = await request.json();
    const { sessionId, userId, userIp, userAgent, fingerprintId } = requestData;

    // Session ID kontrolü
    if (!sessionId) {
      return NextResponse.json({
        error: "Session ID gerekli"
      }, { status: 400 });
    }

    // FingerprintID kontrolü
    if (!fingerprintId) {
      return NextResponse.json({
        error: "Fingerprint ID gerekli"
      }, { status: 400 });
    }

    try {
      // Kullanıcı oluştur veya güncelle
      const result = await createOrUpdateUser(
        supabase,
        userId,
        sessionId,
        userIp,
        userAgent,
        fingerprintId
      );

      return NextResponse.json({
        userId: result.userId,
        sessionId,
        isNewUser: result.isNewUser,
        isSuspicious: result.isSuspicious
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