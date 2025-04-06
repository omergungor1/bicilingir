import { NextResponse } from 'next/server';
import { checkAuth } from '../../../utils';

export async function GET(request) {
  const { locksmithId, supabase } = await checkAuth(request);

  /**CREATE TABLE key_balance (
    locksmithId UUID PRIMARY KEY REFERENCES locksmiths(id),
    totalKeyBalance INTEGER DEFAULT 0,
    lastUpdated TIMESTAMPTZ DEFAULT NOW()
); */

  const { data, error } = await supabase
    .from('key_balance')
    .select('totalkeybalance, lastupdated')
    .eq('locksmithid', locksmithId)
    .single();


    if (error) {
      console.error('Key balance alınamadı:', error);
      return NextResponse.json({
        error: error.message,
      }, { status: 500 });
    }   

    

  return NextResponse.json({
    success: true,
    data: {
      totalkeybalance: data.totalkeybalance,
      lastupdated: data.lastupdated
    }
  })
} 