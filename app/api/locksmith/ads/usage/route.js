import { NextResponse } from 'next/server';
import { checkAuth } from '../../../utils';

const PAGE_SIZE = 10;

export async function GET(request) {
  const { locksmithId, supabase } = await checkAuth(request);
  const req = request.nextUrl.searchParams;
  const page = req.get('page') || 1;


const start = (page - 1) * PAGE_SIZE;
const end = start + PAGE_SIZE - 1;

const { data, error } = await supabase
  .from('key_usage_logs')
  .select('*')
  .eq('locksmithid', locksmithId)
  .order('createdat', { ascending: false })
  .range(start, end);


  if (error) {
    console.error('Anahtar kullanım logları alınamadı:', error);
    return NextResponse.json({
      error: error.message,
    }, { status: 500 });
  }

  const totalData = await supabase
    .from('key_usage_logs')
    .select('*', { count: 'exact' })
    .eq('locksmithid', locksmithId);

  const total = totalData.count;
  const totalPages = Math.ceil(total / PAGE_SIZE);


  return NextResponse.json({
    success: true,
    data: data,
    total: total,
    totalPages: totalPages,
    currentPage: parseInt(page),
  })
} 