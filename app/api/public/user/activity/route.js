import { NextResponse } from 'next/server';
import { createRouteClient, logUserActivity } from '../../../utils';

export async function POST(request) {
  try {
    const requestData = await request.json();

    // Gerekli alanları al
    const { activitytype, data, userId, sessionId, userAgent, level, action } = requestData;

    // Gerekli alanların kontrolü
    if (!sessionId || !userId || !activitytype) {
      return NextResponse.json({
        error: "Eksik alanlar: sessionId, userId ve activitytype gerekli"
      }, { status: 400 });
    }

    // Supabase istemcisi oluştur
    const { supabase } = createRouteClient(request);

    // Data alanını analiz et
    let parsedData;
    try {
      parsedData = typeof data === 'string' ? JSON.parse(data) : data;
    } catch (e) {
      console.error('Data parse hatası:', e);
      parsedData = {};
    }

    // Level bilgisini al, varsayılan olarak 1
    const activityLevel = level || 1;

    // UserActivity ekle
    const activityId = await logUserActivity(
      supabase,
      userId,
      sessionId,
      activitytype,
      parsedData?.details || null,
      parsedData?.entityId || null,
      parsedData?.entityType || null,
      {
        locksmithId: parsedData?.locksmithId || null,
        searchProvinceId: parsedData?.searchProvinceId || null,
        searchDistrictId: parsedData?.searchDistrictId || null,
        searchServiceId: parsedData?.searchServiceId || null,
        reviewId: parsedData?.reviewId || null,
        userAgent: userAgent
      },
      activityLevel
    );

    return NextResponse.json({
      success: true,
      activityId,
      message: `Aktivite kaydedildi: ${activitytype}`
    });
  } catch (error) {
    console.error('Aktivite log hatası:', error);
    return NextResponse.json({
      error: "Aktivite kaydedilemedi: " + error.message
    }, { status: 500 });
  }
} 