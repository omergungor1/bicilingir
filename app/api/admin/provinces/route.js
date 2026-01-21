import { getSupabaseServer } from "../../../../lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const supabase = getSupabaseServer();

        const { data, error } = await supabase
            .from('provinces')
            .select('*')
            .order('id');

        if (error) throw error;

        return NextResponse.json({
            success: true,
            data
        });

    } catch (error) {
        console.error('İller alınırken hata:', error);
        return NextResponse.json({ error: 'İller alınamadı' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const supabase = getSupabaseServer();
        const body = await request.json();
        const { id, lat, lng, description } = body;

        if (!id) {
            return NextResponse.json({ error: 'Şehir ID gerekli' }, { status: 400 });
        }

        // Name ve slug güncellenemez
        const updateData = {};
        if (lat !== undefined) updateData.lat = lat;
        if (lng !== undefined) updateData.lng = lng;
        if (description !== undefined) updateData.description = description;

        const { data, error } = await supabase
            .from('provinces')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({
            success: true,
            data
        });

    } catch (error) {
        console.error('Şehir güncellenirken hata:', error);
        return NextResponse.json({ error: 'Şehir güncellenemedi' }, { status: 500 });
    }
} 