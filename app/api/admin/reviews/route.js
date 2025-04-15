import { NextResponse } from "next/server";
import { checkAdminAuth } from '../../utils';

const PAGE_SIZE = 10;

export async function GET(request) {
    const page = request.nextUrl.searchParams.get('page') || 1;
    const filter = request.nextUrl.searchParams.get('filter') || 'pending';

    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE - 1;

    const { supabase } = await checkAdminAuth(request);

    const { data: reviews, error } = await supabase
        .from('reviews')
        .select('*, locksmiths(businessname,provinces(name)),users(islocksmith,issuspicious)')
        .order('createdat', { ascending: false })
        .eq('status', filter)
        .range(start, end);

    if (error) {
        throw error;
    }

    const { data: totalReviews, totalReviewsError } = await supabase
        .from('reviews')
        .select('*', { count: 'exact' })
        .eq('status', filter);

    const totalCount = totalReviews.length;
    const totalPages = Math.ceil(totalCount / PAGE_SIZE);



    // Ortalama Değerlendirme Puanı ve Yıldız Özeti
    const { count: reviewCount, error: reviewCountError } = await supabase
        .from('reviews')
        .select('id', { count: 'exact', head: true }) // veri getirmez, sadece sayar
        .eq('status', 'approved')

    const { count: fiveStarCount, error: fiveStarError } = await supabase
        .from('reviews')
        .select('id', { count: 'exact', head: true }) // veri getirmez, sadece sayar
        .eq('status', 'approved')
        .eq('rating', 5);

    const { count: fourStarCount, error: fourStarError } = await supabase
        .from('reviews')
        .select('id', { count: 'exact', head: true }) // veri getirmez, sadece sayar
        .eq('status', 'approved')
        .eq('rating', 4);

    const { count: threeStarCount, error: threeStarError } = await supabase
        .from('reviews')
        .select('id', { count: 'exact', head: true }) // veri getirmez, sadece sayar
        .eq('status', 'approved')
        .eq('rating', 3);

    const { count: twoStarCount, error: twoStarError } = await supabase
        .from('reviews')
        .select('id', { count: 'exact', head: true }) // veri getirmez, sadece sayar
        .eq('status', 'approved')
        .eq('rating', 2);


    const { count: oneStarCount, error: oneStarError } = await supabase
        .from('reviews')
        .select('id', { count: 'exact', head: true }) // veri getirmez, sadece sayar
        .eq('status', 'approved')
        .eq('rating', 1);

    const statsData = {
        avgRating: Number(((fiveStarCount * 5 + fourStarCount * 4 + threeStarCount * 3 + twoStarCount * 2 + oneStarCount * 1) / reviewCount).toFixed(1)),
        totalReviews: reviewCount,
        fiveStar: Number(((fiveStarCount * 100) / reviewCount).toFixed(1)),
        fourStar: Number(((fourStarCount * 100) / reviewCount).toFixed(1)),
        threeStar: Number(((threeStarCount * 100) / reviewCount).toFixed(1)),
        twoStar: Number(((twoStarCount * 100) / reviewCount).toFixed(1)),
        oneStar: Number(((oneStarCount * 100) / reviewCount).toFixed(1))
    }

    return NextResponse.json({ success: true, data: reviews, totalCount: totalCount, totalPages: totalPages, currentPage: parseInt(page), filter: filter, statsData: statsData });
}

export async function PATCH(request) {
    const { id, status } = await request.json();
    const { supabase } = await checkAdminAuth(request);

    const { data, error } = await supabase.from('reviews').update({ status }).eq('id', id);

    if (error) {
        throw error;
    }

    return NextResponse.json({ success: true });
}
