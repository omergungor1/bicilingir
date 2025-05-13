import { NextResponse } from 'next/server';
import { getSupabaseServer } from '../../../../lib/supabase';

export async function GET() {
  const supabase = getSupabaseServer();
  try {
    const { data: services, error } = await supabase
      .from('services')
      .select('id,name,slug,sortorder')
      .eq('isActive', true)
      .order('sortorder', { ascending: true });

    if (error) {
      console.error('Hizmetler getirilirken bir hata oluştu 1:', error);
      return NextResponse.json({ error: 'Hizmetler yüklenirken bir hata oluştu' }, { status: 500 });
    }

    return NextResponse.json({
      services: services
    });
  } catch (error) {
    console.error('Hizmetler getirilirken bir hata oluştu 2:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}