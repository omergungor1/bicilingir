import { NextResponse } from 'next/server';
import { getLocksmithId } from '../../../utils';

const PAGE_SIZE = 10;

const getCount = async (type, locksmithId, startDate, endDate, period, supabase) => {
  let query = supabase
    .from('user_activity_logs')
    .select('*', { count: 'exact', head: true }) // sadece sayım
    .eq('locksmithid', locksmithId)
    .eq('activitytype', type)

  if (period !== 'all') {
    query = query.gte('createdat', startDate.toISOString())
      .lte('createdat', endDate.toISOString());
  }

  const { count } = await query;

  return count || 0;
};

export async function GET(request) {
  try {

    // Bearer token ile auth kontrolü
    const { locksmithId, supabase } = await getLocksmithId(request);

    if (!locksmithId) {
      return NextResponse.json({ error: 'Çilingir bilgisi bulunamadı' }, { status: 404 });
    }

    // URL'den period ve page parametrelerini al
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'today';
    const page = parseInt(searchParams.get('page')) || 1;
    const type = searchParams.get('type') || 'all';

    // Tarih aralığını hesapla
    let startDate = new Date();
    let endDate = new Date();

    // UTC'ye çevir
    startDate.setMinutes(startDate.getMinutes() - startDate.getTimezoneOffset());
    endDate.setMinutes(endDate.getMinutes() - endDate.getTimezoneOffset());

    switch (period) {
      case 'today':
        startDate.setUTCHours(0, 0, 0, 0);
        endDate.setUTCHours(23, 59, 59, 999);
        break;
      case 'yesterday':
        startDate.setUTCDate(startDate.getUTCDate() - 1);
        startDate.setUTCHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setUTCHours(23, 59, 59, 999);
        break;
      case 'last7days':
        startDate.setUTCDate(startDate.getUTCDate() - 7);
        startDate.setUTCHours(0, 0, 0, 0);
        endDate.setUTCHours(23, 59, 59, 999);
        break;
      case 'last30days':
        startDate.setUTCMonth(startDate.getUTCMonth() - 1);
        startDate.setUTCHours(0, 0, 0, 0);
        endDate.setUTCHours(23, 59, 59, 999);
        break;
      default:
        startDate.setUTCHours(0, 0, 0, 0);
        endDate.setUTCHours(23, 59, 59, 999);
    }

    // Aktiviteleri getir
    let query = supabase
      .from('user_activity_logs')
      .select('*', { count: 'exact' })
      .eq('locksmithid', locksmithId)
      .order('createdat', { ascending: false })
      .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

    if (period !== 'all') {
      query = query.gte('createdat', startDate.toISOString())
        .lte('createdat', endDate.toISOString());
    }

    if (type !== 'all') {
      query = query.eq('activitytype', type);
    }

    const { data: activities, count, error } = await query;

    if (error) {
      console.error('Aktivite verisi alınamadı:', error);
      return NextResponse.json({ error: 'Aktivite verisi alınamadı' }, { status: 500 });
    }

    // Toplam sayfa sayısını hesapla
    const totalPages = Math.ceil(count / PAGE_SIZE);


    const formattedStats = {
      see: await getCount('locksmith_list_view', locksmithId, startDate, endDate, period, supabase),
      call: await getCount('call_request', locksmithId, startDate, endDate, period, supabase),
      visit: await getCount('locksmith_detail_view', locksmithId, startDate, endDate, period, supabase),
      whatsapp: await getCount('whatsapp_message', locksmithId, startDate, endDate, period, supabase),
    };

    // const { data: statsData, error: statsError } = await supabase
    // .from('user_activity_logs')
    // .select('activitytype', { count: 'exact' }) // sadece gerekli alanı çekiyoruz
    // .eq('locksmithid', locksmithId)
    // .gte('createdat', startDate.toISOString())
    // .lte('createdat', endDate.toISOString())
    // .in('activitytype', [
    //   'locksmith_list_view',
    //   'call_request',
    //   'whatsapp_message',
    //   'locksmith_detail_view',
    // ]);

    // if (statsError) {
    //   console.error('Stats error:', statsError);
    // }

    // console.log(statsData);


    // if (statsData) {
    //   for (const item of statsData) {
    //     switch (item.activitytype) {
    //       case 'locksmith_list_view':
    //         formattedStats.see++;
    //         break;
    //       case 'call_request':
    //         formattedStats.call++;
    //         break;
    //       case 'whatsapp_message':
    //         formattedStats.whatsapp++;
    //         break;
    //       case 'locksmith_detail_view':
    //         formattedStats.visit++;
    //         break;
    //     }
    //   }
    // }


    // activities.map(item => {
    //   if (item.activitytype == 'locksmith_list_view') {
    //     formattedStats.see++;
    //   }
    //   if (item.activitytype == 'locksmith_detail_view') {
    //     formattedStats.visit++;
    //   }
    //   if (item.activitytype == 'call_request') {
    //     formattedStats.call++;
    //   }
    //   if (item.activitytype == 'review_submit') {
    //     formattedStats.review++;
    //   }
    //   if (item.activitytype == 'whatsapp_call') {
    //     formattedStats.whatsapp++;
    //   }
    //   if (item.activitytype == 'website_visit') {
    //     formattedStats.website_visit++;
    //   }
    // });

    return NextResponse.json({
      success: true,
      stats: formattedStats,
      activities,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: count,
        hasMore: page < totalPages
      }
    });
  } catch (error) {
    console.error("API hatası:", error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
} 