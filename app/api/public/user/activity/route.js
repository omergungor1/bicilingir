import { NextResponse } from 'next/server';
import { createRouteClient, logUserActivity } from '../../../utils';

export async function POST(request) {
  try {
    const { supabase } = createRouteClient(request);
    const { 
      sessionId, 
      userId, 
      action, 
      details, 
      entityId, 
      entityType,
      searchProvinceId,
      searchDistrictId,
      searchServiceId,
      locksmithId,
      reviewId 
    } = await request.json();
    
    if (!sessionId || !userId || !action) {
      return NextResponse.json({
        success: false,
        error: 'Gerekli alanlar eksik: sessionId, userId ve action zorunludur'
      }, { status: 400 });
    }
    
    // console.log('Kullanıcı aktivitesi:', { 
    //   sessionId, 
    //   userId, 
    //   action, 
    //   entityType, 
    //   entityId,
    //   searchProvinceId,
    //   searchDistrictId,
    //   searchServiceId,
    //   locksmithId
    // });
    
    // Önce tabloyu kontrol et
    const { data: tableInfo, error: tableError } = await supabase
      .from('user_activity_logs')
      .select('*')
      .limit(1);
      
    if (tableError) {
      console.error('Tablo yapısı kontrol edilirken hata:', tableError);
      // Tablo yoksa oluşturmak için migration API'sini çağır
      if (tableError.code === 'PGRST116' || tableError.code === 'PGRST204') {
        console.log('user_activity_logs tablosu bulunamadı, migration çağırılıyor...');
        try {
          const migrationResponse = await fetch('/api/public/supabase/migration', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'create_tables'
            }),
          });
          
          if (!migrationResponse.ok) {
            const errData = await migrationResponse.json();
            console.error('Migration hatası:', errData);
          } else {
            console.log('Migration başarılı');
          }
        } catch (migErr) {
          console.error('Migration API çağrısı hatası:', migErr);
        }
      }
    }
    
    // Ek veri hazırla
    const additionalData = {
      searchProvinceId,
      searchDistrictId,
      searchServiceId,
      locksmithId,
      reviewId
    };
    
    // Aktivite kaydet
    const activityId = await logUserActivity(
      supabase, 
      userId, 
      sessionId, 
      action, 
      details, 
      entityId, 
      entityType,
      additionalData
    );
    
    return NextResponse.json({
      success: true,
      activityId: activityId
    });
  } catch (error) {
    console.error('Aktivite kaydı hatası:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Bilinmeyen hata'
    }, { status: 500 });
  }
} 