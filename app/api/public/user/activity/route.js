import { NextResponse } from 'next/server';
import { createRouteClient, logUserActivity } from '../../../utils';

export async function POST(request) {
  try {
    const requestData = await request.json();
    
    // Gerekli alanları al
    const { activitytype, data, userId, sessionId, userAgent, level } = requestData;
    
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
    
    // Activity türünü kontrol et, gerekiyorsa dönüştür 
    const activityTypeMap = {
      'arama-yapildi': 'search',
      'cilingir-goruntuleme': 'locksmith_list_view', 
      'cilingir-detay-goruntuleme': 'locksmith_detail_view',
      'cilingir-arama': 'call_request',
      'degerlendirme-gonderme': 'review_submit',
      'profil-ziyaret': 'profile_visit',
      'whatsapp-mesaj': 'whatsapp_message',
      'site-ziyaret': 'website_visit',
      'site-giris': 'website_visit'
    };
    
    // Aktivite tipini kontrol et ve dönüştür (Türkçe isimse İngilizce'ye çevir)
    const finalActivityType = activityTypeMap[activitytype] || activitytype;
    
    // UserActivity ekle
    const activityId = await logUserActivity(
      supabase,
      userId,
      sessionId,
      finalActivityType,
      parsedData.details || null,
      parsedData.entityId || null,
      parsedData.entityType || null,
      {
        locksmithId: parsedData.locksmithId,
        searchProvinceId: parsedData.searchProvinceId,
        searchDistrictId: parsedData.searchDistrictId,
        searchServiceId: parsedData.searchServiceId,
        reviewId: parsedData.reviewId,
        userAgent: userAgent
      },
      activityLevel
    );
    
    return NextResponse.json({ 
      success: true, 
      activityId,
      message: `Aktivite kaydedildi: ${finalActivityType}`
    });
  } catch (error) {
    console.error('Aktivite log hatası:', error);
    return NextResponse.json({ 
      error: "Aktivite kaydedilemedi: " + error.message 
    }, { status: 500 });
  }
} 