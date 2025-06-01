import { NextResponse } from 'next/server';
import { getLocksmithId } from '../../utils';

// CORS headers'ı tanımla
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Auth-Token, x-auth-token',
    'Access-Control-Max-Age': '86400'
};

// OPTIONS metodu için handler
export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

//test get api endpoint
export async function GET(request) {
    return NextResponse.json({ message: 'Hello, world!' }, {
        status: 200,
        headers: corsHeaders
    });
}

export async function PUT(request) {
    try {
        console.log('Running PUT request handler...');

        const { locksmithId, supabase } = await getLocksmithId(request);
        console.log('Locksmith ID:', locksmithId);

        if (!locksmithId) {
            console.log('No locksmith ID found');
            return NextResponse.json(
                { error: 'Çilingir ID\'si gerekli' },
                { status: 400, headers: corsHeaders }
            );
        }

        console.log('Parsing request body...');
        const { daily_spent_limit } = await request.json();
        console.log('Daily spent limit:', daily_spent_limit);

        // Günlük bütçe değeri kontrolü
        if (typeof daily_spent_limit !== 'number' || daily_spent_limit < 0) {
            console.log('Invalid daily spent limit value');
            return NextResponse.json(
                { error: 'Geçersiz günlük bütçe değeri' },
                { status: 400, headers: corsHeaders }
            );
        }

        console.log('Updating daily budget in database...');
        // Günlük bütçeyi güncelle
        const { data, error } = await supabase
            .from('locksmith_balances')
            .update({ daily_spent_limit })
            .eq('locksmith_id', locksmithId)
            .select('daily_spent_limit');

        if (error) {
            console.error('Database update error:', error);
            return NextResponse.json(
                { error: 'Günlük bütçe güncellenirken bir hata oluştu' },
                { status: 500, headers: corsHeaders }
            );
        }

        console.log('Update successful:', data);
        return NextResponse.json({
            message: 'Günlük bütçe başarıyla güncellendi',
            data: data[0]
        }, { headers: corsHeaders });

    } catch (error) {
        console.error('PUT request error:', error);
        console.error('Error stack:', error.stack);
        return NextResponse.json(
            { error: 'Günlük bütçe güncellenirken bir hata oluştu' },
            { status: 500, headers: corsHeaders }
        );
    }
}

// Runtime yapılandırması
export const runtime = 'nodejs';
// export const config = {
//     runtime: 'nodejs',
// }; 