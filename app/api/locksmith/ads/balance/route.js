import { NextResponse } from 'next/server';
import { checkAuth } from '../../../utils';

export async function GET(request) {
  try {
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
      // Hata olsa bile geçerli bir JSON yanıtı döndür
      return NextResponse.json({
        success: true,
        data: {
          totalkeybalance: 0,
          lastupdated: new Date().toISOString()
        }
      });
    }   

    // Veri yoksa veya undefined/null ise varsayılan değer kullan
    const responseData = {
      totalkeybalance: data?.totalkeybalance || 0,
      lastupdated: data?.lastupdated || new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: responseData
    });
  } catch (error) {
    console.error('Key balance alınamadı:', error);
    
    // Hata durumunda da geçerli bir JSON yanıtı döndür
    return NextResponse.json({
      success: false,
      data: {
        totalkeybalance: 0,
        lastupdated: new Date().toISOString()
      },
      error: 'Key balance alınamadı'
    });
  }
} 