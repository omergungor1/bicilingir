import { NextResponse } from 'next/server';
import { checkAuth } from '../../../utils';

const PAGE_SIZE = 10;

export async function GET(request) {
  try {
    console.log('locksmith/dashboard/activity/route.js');
    console.log(request);

    const { locksmithId, supabase } = await checkAuth(request);

    if (!locksmithId) {
      return NextResponse.json({ error: 'Çilingir ID\'si gerekli' }, { status: 400 });
    }

    // URL'den period ve locksmithId parametrelerini al
    const period = request.nextUrl.searchParams.get('period') || 'today';
    const page = request.nextUrl.searchParams.get('page') || 1;


    //periods: today, yesterday, last7days, last30days, all

    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE - 1;

    //calculate start date
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (period === 'today' ? 0 : period === 'yesterday' ? 1 : period === 'last7days' ? 7 : period === 'last30days' ? 30 : period === 'all' ? 365 : 0));
    const startDateString = startDate.toISOString().split('T')[0];

    let query = supabase
      .from('user_activity_logs')
      .select('activitytype,createdat, districts(name), services(name), reviews(rating,comment)')
      .eq('locksmithid', locksmithId);

    if (period !== 'all') {
      query = query.gte('createdat', startDateString);
    }

    query = query.order('createdat', { ascending: false });

    const { data, error } = await query.range(start, end);

    if (error) {
      console.error('Activity logs error:', error);
      return NextResponse.json({ error: 'Activity logs error' }, { status: 500 });
    }

    let query2 = supabase
      .from('user_activity_logs')
      .select('*', { count: 'exact' })
      .eq('locksmithid', locksmithId);

    if (period !== 'all') {
      query2 = query2.gte('createdat', startDateString);
    }

    const { data: totalRecords, error: totalError } = await query2;

    if (totalError) {
      console.error('Total records error:', totalError);
      return NextResponse.json({ error: 'Total records error' }, { status: 500 });
    }

    const total = totalRecords.length;

    //Stats için tüm aktiviteleri çekiyor. Verim için sadece countlarını alınmalı.
    //Yüzde hesaplaması eksik.
    //DAHA SONRA GÜNCELLENECEK

    const formattedStats = {
      see: 0,
      see_percent: 0,
      call: 0,
      call_percent: 0,
      visit: 0,
      visit_percent: 0,
      review: 0,
      review_percent: 0,
      whatsapp: 0,
      whatsapp_percent: 0,
      website_visit: 0,
      website_visit_percent: 0,
    };

    totalRecords.map(item => {
      if (item.activitytype == 'locksmith_list_view') {
        formattedStats.see++;
      }
      if (item.activitytype == 'locksmith_detail_view') {
        formattedStats.visit++;
      }
      if (item.activitytype == 'call_request') {
        formattedStats.call++;
      }
      if (item.activitytype == 'review_submit') {
        formattedStats.review++;
      }
      if (item.activitytype == 'whatsapp_call') {
        formattedStats.whatsapp++;
      }
      if (item.activitytype == 'website_visit') {
        formattedStats.website_visit++;
      }
    });

    return NextResponse.json({
      success: true,
      stats: formattedStats,
      list: data,
      totalPages: Math.ceil(total / PAGE_SIZE),
      currentPage: page,
      totalRecords: total
    });
  } catch (error) {
    console.error("API hatası:", error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
} 