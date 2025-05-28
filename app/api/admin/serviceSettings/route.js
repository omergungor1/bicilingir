import { NextResponse } from 'next/server';
import { checkAdminAuth } from '../../utils';

export async function GET(request) {
  try {
    const { supabase } = await checkAdminAuth(request);

    const { data: servicesData, error } = await supabase
      .from('services')
      .select(`
      *
    `)
      .order('name', { ascending: false });


    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: servicesData
    });
  } catch (error) {
    console.error('Hizmetler alınamadı:', error);
    return NextResponse.json({
      success: false,
      data: {},
      error: 'Hizmetler alınamadı'
    });
  }
}

export async function POST(request) {
  try {
    const { supabase } = await checkAdminAuth(request);

    const data = await request.json();


    if (data.id) {
      //update
      const { data: servicesData, error } = await supabase
        .from('services')
        .update({
          name: data.name,
          minPriceMesai: data.minPriceMesai,
          maxPriceMesai: data.maxPriceMesai,
          minPriceAksam: data.minPriceMesai * 1.5,
          maxPriceAksam: data.maxPriceMesai * 1.5,
          minPriceGece: data.minPriceMesai * 2,
          maxPriceGece: data.maxPriceMesai * 2,
          isActive: data.isActive
        })
        .eq('id', data.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return NextResponse.json({
        success: true,
      });
    } else {
      //insert
      const { data: servicesData, error } = await supabase
        .from('services')
        .insert({
          name: data.name,
          minPriceMesai: data.minPriceMesai,
          maxPriceMesai: data.maxPriceMesai,
          minPriceAksam: data.minPriceMesai * 1.5,
          maxPriceAksam: data.maxPriceMesai * 1.5,
          minPriceGece: data.minPriceMesai * 2,
          maxPriceGece: data.maxPriceMesai * 2,
          isActive: data.isActive
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return NextResponse.json({
        success: true,
      });
    }

  } catch (error) {
    console.error('Hizmet ekleme hatası:', error);
    return NextResponse.json({
      success: false,
      data: {},
      error: 'Hizmet ekleme hatası'
    });
  }
}