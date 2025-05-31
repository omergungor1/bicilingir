import { NextResponse } from 'next/server';
import { getLocksmithId } from '../../utils';
import Cors from 'cors';

// CORS middleware'ini başlat
const cors = Cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    origin: '*',
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Auth-Token', 'x-auth-token']
});

// Middleware'i Promise olarak çalıştırmak için yardımcı fonksiyon
function runMiddleware(request, middleware) {
    return new Promise((resolve, reject) => {
        middleware(request, {}, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
}

// OPTIONS metodu için handler
export async function OPTIONS(request) {
    await runMiddleware(request, cors);
    return new NextResponse(null, { status: 204 });
}

//test get api endpoint
export async function GET(request) {
    await runMiddleware(request, cors);
    return NextResponse.json({ message: 'Hello, world!' }, { status: 200 });
}

export async function PUT(request) {
    console.log('PUT request received at /api/locksmith/daily-budget');
    return NextResponse.json(
        { message: 'başarıyla güncellendi mi?' },
        { status: 200 }
    );
    try {
        // CORS middleware'ini çalıştır
        console.log('Running CORS middleware...');
        await runMiddleware(request, cors);
        console.log('CORS middleware completed');

        console.log('Getting locksmith ID...');
        const { locksmithId, supabase } = await getLocksmithId(request);
        console.log('Locksmith ID:', locksmithId);

        if (!locksmithId) {
            console.log('No locksmith ID found');
            return NextResponse.json(
                { error: 'Çilingir ID\'si gerekli' },
                { status: 400 }
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
                { status: 400 }
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
                { status: 500 }
            );
        }

        console.log('Update successful:', data);
        return NextResponse.json({
            message: 'Günlük bütçe başarıyla güncellendi',
            data: data[0]
        });

    } catch (error) {
        console.error('PUT request error:', error);
        console.error('Error stack:', error.stack);
        return NextResponse.json(
            { error: 'Günlük bütçe güncellenirken bir hata oluştu' },
            { status: 500 }
        );
    }
}

// Runtime yapılandırması
export const runtime = 'nodejs';
// export const config = {
//     runtime: 'nodejs',
// }; 