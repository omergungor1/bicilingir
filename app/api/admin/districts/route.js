import { getSupabaseServer } from "../../../../lib/supabase";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request) {
    try {
        // Auth kontrolü
        const cookieStore = await cookies();
        const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
        }

        // Admin kontrolü
        const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .single();

        if (roleData?.role !== 'admin') {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const provinceId = searchParams.get('province_id');

        const supabaseServer = getSupabaseServer();

        let query = supabaseServer
            .from('districts')
            .select('*')
            .order('name');

        if (provinceId) {
            query = query.eq('province_id', parseInt(provinceId));
        }

        const { data, error } = await query;

        if (error) throw error;

        return NextResponse.json({
            success: true,
            data
        });

    } catch (error) {
        console.error('İlçeler alınırken hata:', error);
        return NextResponse.json({ error: 'İlçeler alınamadı' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        // Auth kontrolü
        const cookieStore = await cookies();
        const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
        }

        // Admin kontrolü
        const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .single();

        if (roleData?.role !== 'admin') {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 });
        }

        const supabaseServer = getSupabaseServer();
        const body = await request.json();
        const { id, lat, lng, description } = body;

        if (!id) {
            return NextResponse.json({ error: 'İlçe ID gerekli' }, { status: 400 });
        }

        // Name ve slug güncellenemez
        const updateData = {};
        if (lat !== undefined) updateData.lat = lat;
        if (lng !== undefined) updateData.lng = lng;
        if (description !== undefined) updateData.description = description;

        const { data, error } = await supabaseServer
            .from('districts')
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
        console.error('İlçe güncellenirken hata:', error);
        return NextResponse.json({ error: 'İlçe güncellenemedi' }, { status: 500 });
    }
}
