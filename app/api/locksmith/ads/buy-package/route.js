import { NextResponse } from 'next/server';
import { checkAuth } from '../../../utils';

export async function POST(request) {
  const { locksmithId, supabase } = await checkAuth(request);

  const { packageId, purchaseNote } = await request.json();

  console.log(packageId, locksmithId, purchaseNote);

  if (!packageId) {
    return NextResponse.json({
      error: 'Paket seçilmemiş!',
    }, { status: 400 });
  }


  const { data: keybalance, error: keybalanceError } = await supabase
    .from('key_balance')
    .select('totalkeybalance')
    .eq('locksmithid', locksmithId)
    .single();


  if (keybalanceError) {
    return NextResponse.json({
      error: 'Locksmith bulunamadı',
    }, { status: 404 });
  }

  const { data: packageData, error: packageError } = await supabase
    .from('key_packages')
    .select('keyAmount, price')
    .eq('id', packageId)
    .single();

  if (packageError) {
    return NextResponse.json({
      error: 'Paket bulunamadı',
    }, { status: 404 });
  }

  const data = {
    locksmithid: locksmithId,
    packageid: packageId,
    keyamount: packageData.keyAmount,
    transactiontype: 'purchase',
    paidamount: packageData.price,
    balancebefore: keybalance.totalkeybalance,
    balanceafter: keybalance.totalkeybalance,
    status: 'pending',
    requestnote: purchaseNote,
    createdat: new Date(),
  }

  const { data: keyTransaction, error: keyTransactionError } = await supabase
    .from('key_transactions')
    .insert(data)
    .select();

  if (keyTransactionError) {
    return NextResponse.json({
      error: 'Paket satın alınamadı',
    }, { status: 400 });
  }

  return NextResponse.json({
    message: 'Paket satın alındı',
  }, { status: 200 });
}