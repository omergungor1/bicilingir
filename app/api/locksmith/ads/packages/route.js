import { NextResponse } from 'next/server';
import { getSupabaseServer } from '../../../../../lib/supabase';

export async function GET() {
  try {
    const supabase = await getSupabaseServer();
    const { data: packages, error } = await supabase
      .from('key_packages')
      .select('*')
      .eq('isActive', true)
      .order('keyAmount', { ascending: true });

    if (error) {
      console.error('Paketler getirilirken bir hata oluştu 1:', error);
      return NextResponse.json({ error: 'Paketler yüklenirken bir hata oluştu' }, { status: 500 });
    }

    return NextResponse.json({
      packages: packages
    });
  } catch (error) {
    console.error('Paketler getirilirken bir hata oluştu 2:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}