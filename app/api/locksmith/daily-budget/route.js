import { NextResponse } from 'next/server';
import { getLocksmithId } from '../../utils';

export async function PUT(request) {
    try {
        const { locksmithId, supabase } = await getLocksmithId(request);

        if (!locksmithId) {
            return NextResponse.json({ error: 'Çilingir ID\'si gerekli' }, { status: 400 });
        }

        const { daily_spent_limit } = await request.json();

        // Günlük bütçe değeri kontrolü
        if (typeof daily_spent_limit !== 'number' || daily_spent_limit < 0) {
            return NextResponse.json(
                { error: 'Geçersiz günlük bütçe değeri' },
                { status: 400 }
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
                { status: 500 }
            );
        }

        return NextResponse.json({
            message: 'Günlük bütçe başarıyla güncellendi',
            data: data[0]
        });

    } catch (error) {
        console.error('Günlük bütçe güncelleme hatası:', error);
        return NextResponse.json(
            { error: 'Günlük bütçe güncellenirken bir hata oluştu' },
            { status: 500 }
        );
    }
} 