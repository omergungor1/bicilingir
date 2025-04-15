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

export async function PUT(request) {
  try {
    const { supabase } = await checkAdminAuth(request);

    const { id, status } = await request.json();

    const updateStatus = status === "approved" ? "approved" : status === "rejected" ? "rejected" : "pending";


    const { data, error } = await supabase
    .from('locksmiths')
    .update({ status: updateStatus })
    .eq('id', id);

    if (error) {
      throw error;
    } 

    return NextResponse.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Çilingir güncellenemedi:', error);
    return NextResponse.json({
      success: false,
      data: {},
      error: 'Çilingir güncellenemedi'
    });
  }
}

