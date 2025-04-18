import { NextResponse } from 'next/server';
import { checkAdminAuth } from '../../../utils';

const PAGE_SIZE = 10;

export async function GET(request) {
    try {
        const { supabase } = await checkAdminAuth(request);
        // URL'den period ve locksmithId parametrelerini al
        const period = request.nextUrl.searchParams.get('period') || 'today';
        const page = request.nextUrl.searchParams.get('page') || 1;
        // console.log(locksmithId,'locksmithId');
        // console.log(period,'period');
        // console.log(page,'page');

        //periods: today, yesterday, last7days, last30days, all

        const start = (page - 1) * PAGE_SIZE;
        const end = start + PAGE_SIZE - 1;

        //calculate start date
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - (period === 'today' ? 0 : period === 'yesterday' ? 1 : period === 'last7days' ? 7 : period === 'last30days' ? 30 : period === 'all' ? 365 : 0));
        const startDateString = startDate.toISOString().split('T')[0];


        let query = supabase
            .from('user_activity_logs')
            .select('activitytype,createdat, districts(name), services(name), reviews(rating,comment)');


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
            .select('*', { count: 'exact' });

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
            total_locksmiths: 0,
            total_users: 0,
            total_activity_logs: 0,
            total_locksmiths_percent: 0,
            total_users_percent: 0,
            total_activity_logs_percent: 0,
            total_key_usage: 0,
            total_daily_key_usage: 0,
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



        let ActivityLogsQuery = supabase
            .from('user_activity_logs')
            .select('*', { count: 'exact', head: true });

        if (period != 'all') {
            ActivityLogsQuery = ActivityLogsQuery.gte('createdat', startDateString);
        }

        const { count: ActivityLogsCount, error: ActivityLogsError } = await ActivityLogsQuery;

        if (ActivityLogsError) {
            console.error('Activity logs error:', ActivityLogsError);
            return NextResponse.json({ error: 'Activity logs error' }, { status: 500 });
        }

        formattedStats.total_activity_logs = ActivityLogsCount;

        let LocksmithsQuery = supabase
            .from('locksmiths')
            .select('*', { count: 'exact', head: true });

        if (period != 'all') {
            LocksmithsQuery = LocksmithsQuery.gte('createdat', startDateString);
        }

        const { count: LocksmithsCount, error: LocksmithsError } = await LocksmithsQuery;

        if (LocksmithsError) {
            console.error('Locksmiths error:', LocksmithsError);
            return NextResponse.json({ error: 'Locksmiths error' }, { status: 500 });
        }

        formattedStats.total_locksmiths = LocksmithsCount;

        let UsersQuery = supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .eq('islocksmith', false);

        if (period != 'all') {
            UsersQuery = UsersQuery.gte('createdat', startDateString);
        }

        const { count: UsersCount, error: UsersError } = await UsersQuery;


        if (UsersError) {
            console.error('Users error:', UsersError);
            return NextResponse.json({ error: 'Users error' }, { status: 500 });
        }

        formattedStats.total_users = UsersCount;

        let KeyUsageQuery = supabase
            .from('user_activity_logs')
            .select('keyamount')
            .gte('keyamount', 1);

        if (period != 'all') {
            KeyUsageQuery = KeyUsageQuery.gte('createdat', startDateString);
        }

        const { data: KeyUsageData, error: KeyUsageError } = await KeyUsageQuery;


        if (KeyUsageError) {
            console.error('Key usage error:', KeyUsageError);
            return NextResponse.json({ error: 'Key usage error' }, { status: 500 });
        } else if (KeyUsageData.length > 0) {
            formattedStats.total_key_usage = KeyUsageData?.reduce((acc, row) => acc + row.keyamount, 0) || 0;
        }

        let DailyKeyUsageQuery = supabase
            .from('daily_key_preferences')
            .select('keyamount')

        if (period != 'all' && period != 'last7days' && period != 'last30days') {
            const today = new Date();
            const dayOfWeek = today.getDay();
            let dayOfWeekWanted = dayOfWeek;

            if (period == 'yesterday') {
                dayOfWeekWanted = dayOfWeek - 1;
            }

            DailyKeyUsageQuery = DailyKeyUsageQuery.eq('dayofweek', dayOfWeekWanted);
        }

        const { data: DailyKeyUsageData, error: DailyKeyUsageError } = await DailyKeyUsageQuery;

        if (DailyKeyUsageError) {
            console.error('Daily key usage error:', DailyKeyUsageError);
        } else {
            formattedStats.total_daily_key_usage = DailyKeyUsageData?.reduce((acc, row) => acc + row.keyamount, 0) || 0;

            if (period == 'last30days') {
                formattedStats.total_daily_key_usage *= 4;
            }
        }



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