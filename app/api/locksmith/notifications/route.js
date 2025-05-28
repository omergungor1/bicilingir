import { NextResponse } from 'next/server';
import { checkAuth } from '../../utils';

export async function GET(request) {
  try {
    const { locksmithId, supabase } = await checkAuth(request);

    if (!locksmithId) {
      return NextResponse.json({ error: 'Çilingir ID\'si gerekli' }, { status: 400 });
    }

    // Çalışma saatlerini getir
    const { data: notificationsData, error: notificationsError } = await supabase
      .from('notifications')
      .select('*')
      .eq('locksmithid', locksmithId)
      .order('createdat', { ascending: false });

    if (notificationsError) {
      console.error('Bildirimler alınamadı:', notificationsError);
      return NextResponse.json({ error: 'Bildirimler yüklenirken bir hata oluştu' }, { status: 500 });
    }

    // Eğer çalışma saatleri yoksa varsayılan değerleri döndür
    const notifications = notificationsData && notificationsData.length > 0
      ? notificationsData.map(notification => ({ ...notification, locksmithId }))
      : [];

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Bildirimler getirilirken bir hata oluştu:', error);
    return NextResponse.json([]);
  }
}

export async function PUT(request) {
  try {
    const { locksmithId, supabase } = await checkAuth(request);

    if (!locksmithId) {
      return NextResponse.json({ error: 'Çilingir ID\'si gerekli' }, { status: 400 });
    }

    // Gelen JSON verisini analiz et
    const notificationUpdate = await request.json();

    // Bildirimi güncelle
    const { data: updateData, error: updateError } = await supabase
      .from('notifications')
      .update({ isread: true })
      .eq('id', notificationUpdate.id)
      .eq('locksmithid', locksmithId)
      .select()
      .single();

    if (updateError) {
      console.error('Bildirim güncellenirken hata:', updateError);
      return NextResponse.json({ error: 'Bildirim güncellenirken bir hata oluştu' }, { status: 500 });
    }

    return NextResponse.json(updateData);
  } catch (error) {
    console.error('Bildirim güncellenirken bir hata oluştu:', error);
    return NextResponse.json({ error: 'Bildirim güncellenirken bir hata oluştu' }, { status: 500 });
  }
}