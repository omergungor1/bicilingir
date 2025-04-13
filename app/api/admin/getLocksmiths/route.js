import { NextResponse } from 'next/server';
import { checkAdminAuth } from '../../utils';

export async function GET(request) {
  try {
    const { supabase } = await checkAdminAuth(request);

    const { data: locksmithsData, error } = await supabase
    .from('locksmiths')
    .select(`
      *,
      locksmith_details ( * ),
      provinces ( * ),
      districts!locksmiths_districtid_fkey ( * )
    `)
    .order('createdat', { ascending: false });
  

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: locksmithsData
    });
  } catch (error) {
    console.error('Çilingirler alınamadı:', error);
    return NextResponse.json({
      success: false,
      data: {},
      error: 'Çilingirler alınamadı'
    });
  }
}
