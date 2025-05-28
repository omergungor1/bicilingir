import { NextResponse } from 'next/server';
import { checkAuth } from '../../utils';

const PAGE_SIZE = 10;

export async function GET(request) {
  const { locksmithId, supabase } = await checkAuth(request);

  if (!locksmithId) {
    return NextResponse.json({ error: 'Çilingir ID\'si gerekli' }, { status: 400 });
  }

  const filter = request.nextUrl.searchParams.get('filter') || 'all';
  const page = request.nextUrl.searchParams.get('page') || 1;

  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE - 1;

  let query = supabase
    .from('reviews')
    .select('*')
    .eq('locksmithid', locksmithId)
    .eq('status', 'approved');

  if (filter != 'all') {
    query = query.eq('rating', filter);
  }

  const { data, error } = await query.range(start, end);

  //count total reviews without range
  let query2 = supabase
    .from('reviews')
    .select('*', { count: 'exact' })
    .eq('locksmithid', locksmithId)
    .eq('status', 'approved');

  if (filter != 'all') {
    query2 = query2.eq('rating', filter);
  }

  const { data: totalReviews, error: totalReviewsError } = await query2;



  if (totalReviewsError) {
    console.log(totalReviewsError, 'totalReviewsError');
    return NextResponse.json({
      error: totalReviewsError.message,
    }, { status: 500 });
  }

  const totalFilteredReviewsCount = totalReviews.length;


  if (error) {
    console.log(error, 'data error');
    return NextResponse.json({
      error: error.message,
    }, { status: 500 });
  }
  //review stats ve reviews dönecek -> pagination yapılacak
  //stats için ratinglerin sayısını al

  //DAHA SONRA GÜNCELLENECEK  
  //Count için tüm kayıtlar getiriliyor. Verimli değil. Nasıl sadece count eder ama tüm kayıtları çekmem?

  const { data: allReviews, error: allReviewsError } = await supabase
    .from('reviews')
    .select('rating', { count: 'exact' })
    .eq('locksmithid', locksmithId)
    .eq('status', 'approved');


  if (allReviewsError) {
    console.log(allReviewsError, 'allReviewsError');
    return NextResponse.json({
      error: allReviewsError.message,
    }, { status: 500 });
  }

  const averageRating = allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length;
  const totalReviewsCount = allReviews.length;

  const stats = {
    one: allReviews.filter(review => review.rating === 1).length / totalReviewsCount * 100,
    two: allReviews.filter(review => review.rating === 2).length / totalReviewsCount * 100,
    three: allReviews.filter(review => review.rating === 3).length / totalReviewsCount * 100,
    four: allReviews.filter(review => review.rating === 4).length / totalReviewsCount * 100,
    five: allReviews.filter(review => review.rating === 5).length / totalReviewsCount * 100,
    totalReviewsCount: totalReviewsCount,
    averageRating: averageRating,
  }

  const totalPages = Math.ceil(totalFilteredReviewsCount / PAGE_SIZE);

  return NextResponse.json({
    success: true,
    stats: stats,
    reviews: data,
    totalPages: totalPages,
    currentPage: parseInt(page)
  })
} 