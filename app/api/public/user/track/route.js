import { NextResponse } from 'next/server';
import { createRouteClient, createOrUpdateUser } from '../../../utils';

export async function POST(request) {
  try {
    // İstemci oluştur
    const { supabase } = createRouteClient(request);

    // İstek gövdesini kontrol et
    if (!request.body) {
      console.error('Boş istek gövdesi');
      return NextResponse.json({
        error: "Geçersiz istek: Boş gövde"
      }, { status: 400 });
    }

    // İstek gövdesini al ve hata kontrolü yap
    let requestData;
    try {
      requestData = await request.json();
    } catch (error) {
      console.error('JSON parse hatası:', error);
      return NextResponse.json({
        error: "Geçersiz JSON formatı"
      }, { status: 400 });
    }

    // Gerekli alanların varlığını kontrol et
    const { sessionId, userId, userIp, userAgent, fingerprintId } = requestData;

    // Zorunlu alanları kontrol et
    if (!sessionId || !fingerprintId) {
      const missingFields = [];
      if (!sessionId) missingFields.push('sessionId');
      if (!fingerprintId) missingFields.push('fingerprintId');

      console.error('Eksik alanlar:', missingFields);
      return NextResponse.json({
        error: "Eksik alanlar: " + missingFields.join(', ')
      }, { status: 400 });
    }

    try {
      // Kullanıcı oluştur veya güncelle
      const result = await createOrUpdateUser(
        supabase,
        userId,
        sessionId,
        userIp || request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for'),
        userAgent || request.headers.get('user-agent'),
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
      error: "Sunucu hatası",
      details: error.message
    }, { status: 500 });
  }
} 