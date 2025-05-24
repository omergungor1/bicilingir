import { getSupabaseServer } from "../../../../lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const supabase = getSupabaseServer();

        const { data, error } = await supabase
            .from('provinces')
            .select('*')
            .order('name');

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