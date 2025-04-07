import { NextResponse } from 'next/server';
import { createRouteClient, createOrUpdateUser } from '../../../utils';

export async function POST(request) {
  try {
    const { supabase } = createRouteClient(request);
    const { sessionId, userId, userIp, userAgent } = await request.json();
    
    // Önce users tablosunun yapısını kontrol et
    const { data: tableInfo, error: tableError } = await supabase
      .from('users')
      .select('*')
      .limit(1);
      
    if (tableError) {
      console.error('Tablo yapısı kontrol edilirken hata:', tableError);
      // Tablo yoksa oluşturmak için migration API'sini çağır
      if (tableError.code === 'PGRST116' || tableError.code === 'PGRST204') {
        console.log('Users tablosu bulunamadı, migration çağırılıyor...');
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
    
    // Kullanıcı oluştur veya güncelle
    const { userId: newUserId, isNewUser } = await createOrUpdateUser(
      supabase, 
      userId, 
      sessionId, 
      userIp, 
      userAgent
    );
    
    return NextResponse.json({
      success: true,
      userId: newUserId,
      isNewUser: isNewUser
    });
  } catch (error) {
    console.error('Kullanıcı izleme hatası:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Bilinmeyen hata'
    }, { status: 500 });
  }
} 