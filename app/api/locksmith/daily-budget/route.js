import { NextResponse } from 'next/server';
import { getLocksmithId } from '../../utils';

// CORS headers tanımı
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Auth-Token, x-auth-token',
    'Access-Control-Max-Age': '86400',
};

// OPTIONS metodu için handler
export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function PUT(request) {
    try {
        const { locksmithId, supabase } = await getLocksmithId(request);

        if (!locksmithId) {
            return NextResponse.json(
                { error: 'Çilingir ID\'si gerekli' },
                { status: 400, headers: corsHeaders }
            );
        }

        const { daily_spent_limit } = await request.json();

        // Günlük bütçe değeri kontrolü
        if (typeof daily_spent_limit !== 'number' || daily_spent_limit < 0) {
            return NextResponse.json(
                { error: 'Geçersiz günlük bütçe değeri' },
                { status: 400, headers: corsHeaders }
            );
        }

        // Günlük bütçeyi güncelle
        const { data, error } = await supabase
            .from('locksmith_balances')
            .update({ daily_spent_limit })
            .eq('locksmith_id', locksmithId)
            .select('daily_spent_limit');

        if (error) {
            console.error('Günlük bütçe güncelleme hatası:', error);
            return NextResponse.json(
                { error: 'Günlük bütçe güncellenirken bir hata oluştu' },
                { status: 500, headers: corsHeaders }
            );
        }

        return NextResponse.json({
            message: 'Günlük bütçe başarıyla güncellendi',
            data: data[0]
        }, { headers: corsHeaders });

    } catch (error) {
        console.error('Günlük bütçe güncelleme hatası:', error);
        return NextResponse.json(
            { error: 'Günlük bütçe güncellenirken bir hata oluştu' },
            { status: 500, headers: corsHeaders }
        );
    }
}

// Runtime yapılandırması
export const config = {
    runtime: 'nodejs',
}; 