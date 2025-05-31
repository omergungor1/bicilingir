import { NextResponse } from 'next/server';
import { getLocksmithId } from '../../../utils';

export async function GET(request) {
  try {
    const { locksmithId, supabase } = await getLocksmithId(request);

    if (!locksmithId) {
      return NextResponse.json({ error: 'Çilingir ID\'si gerekli' }, { status: 400 });
    }

    // Çalışma saatlerini getir
    const { data: workingHoursData, error: workingHoursError } = await supabase
      .from('locksmith_working_hours')
      .select('*')
      .eq('locksmithid', locksmithId)
      .order('dayofweek', { ascending: true });

    if (workingHoursError) {
      console.error('Çalışma saatleri alınamadı:', workingHoursError);
      return NextResponse.json({ error: 'Çalışma saatleri yüklenirken bir hata oluştu' }, { status: 500 });
    }

    // Eğer çalışma saatleri yoksa varsayılan değerleri döndür
    const workingHours = workingHoursData && workingHoursData.length > 0
      ? workingHoursData.map(hours => ({ ...hours, locksmithId }))
      : [];

    return NextResponse.json(workingHours);
  } catch (error) {
    console.error('Çalışma saatleri getirilirken bir hata oluştu:', error);
    return NextResponse.json([]);
  }
}

export async function PUT(request) {
  try {
    const { locksmithId, supabase } = await getLocksmithId(request);

    if (!locksmithId) {
      return NextResponse.json({ error: 'Çilingir ID\'si gerekli' }, { status: 400 });
    }

    // Gelen JSON verisini analiz et
    const data = await request.json();
    const updatedWorkingHours = data.updatedWorkingHours;

    if (!Array.isArray(updatedWorkingHours)) {
      return NextResponse.json({ error: 'Geçersiz veri formatı' }, { status: 400 });
    }

    // Her bir gün için veritabanını güncelle
    const updatePromises = updatedWorkingHours.map(async (dayData) => {
      // ID varsa güncelle, yoksa yeni kayıt oluştur
      if (dayData.id) {
        const { data, error } = await supabase
          .from('locksmith_working_hours')
          .update({
            isworking: dayData.isworking,
            opentime: dayData.opentime,
            closetime: dayData.closetime,
            is24hopen: dayData.is24hopen
          })
          .eq('id', dayData.id)
          .eq('locksmithid', locksmithId);

        if (error) throw error;
        return data;
      } else {
        // Yeni kayıt oluştur
        const { data, error } = await supabase
          .from('locksmith_working_hours')
          .insert({
            locksmithid: locksmithId,
            dayofweek: dayData.dayofweek,
            isworking: dayData.isworking,
            opentime: dayData.opentime,
            closetime: dayData.closetime,
            is24hopen: dayData.is24hopen
          });

        if (error) throw error;
        return data;
      }
    });

    // Tüm güncellemeleri tamamla
    await Promise.all(updatePromises);

    return NextResponse.json({ message: 'Çalışma saatleri başarıyla güncellendi' }, { status: 200 });
  } catch (error) {
    console.error('Çalışma saatleri güncellenirken bir hata oluştu:', error);
    return NextResponse.json({
      error: 'Çalışma saatleri güncellenirken bir hata oluştu',
      details: error.message
    }, { status: 500 });
  }
}