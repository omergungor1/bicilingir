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
      provinces!locksmiths_provinceid_fkey ( * ),
      districts!locksmiths_districtid_fkey ( * ),
      locksmith_balances ( balance, daily_spent_limit )
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
      .update({ status: updateStatus, isactive: true, isverified: true })
      .eq('id', id);

    if (error) {
      throw error;
    }

    //import notifcation
    const accountApprovedNotification = {
      locksmithid: id,
      title: 'Hesabınız Onaylandı',
      message: 'Hesabınız onaylandı. Artık aramalarda görünür olacaksınız.',
      type: 'success',
      createdat: new Date().toISOString()
    }

    const { data: accountApprovedNotificationData, error: accountApprovedNotificationError } = await supabase
      .from('notifications')
      .insert(accountApprovedNotification)
      .select();

    if (accountApprovedNotificationError) {
      throw accountApprovedNotificationError;
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

