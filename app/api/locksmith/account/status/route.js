import { NextResponse } from 'next/server';
import { checkAuth } from '../../../utils';


/**Toggle locksmith account status */
export async function PUT(request) {
  const { locksmithId, supabase } = await checkAuth(request);

  if (!locksmithId) {
    return NextResponse.json({ error: 'Çilingir ID\'si gerekli' }, { status: 400 });
  }

  //çilingirin status='approved ise güncelle
  const { data, error } = await supabase
    .from('locksmiths')
    .select('status,isactive')
    .eq('id', locksmithId)
    .single();
  if (error) {
    return NextResponse.json({
      error: error.message,
    }, { status: 500 });
  }

  const locksmithStatus = data.status;
  const locksmithIsActive = data.isactive;

  if (locksmithStatus != 'approved') {
    return NextResponse.json({
      success: false,
      message: "Hesabınız henüz onaylanmamıştır.",
    })
  }


  const { data: locksmithData, error: locksmithError } = await supabase
    .from('locksmiths')
    .update({ isactive: !locksmithIsActive })
    .eq('id', locksmithId)
    .single();

  if (locksmithError) {
    return NextResponse.json({
      error: locksmithError.message,
    }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: "Hesabınız başarıyla güncellendi.",
  })
} 