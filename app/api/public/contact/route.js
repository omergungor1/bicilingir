import { NextResponse } from 'next/server';
import { createRouteClient } from '../../utils';

export async function POST(request) {
    try {
        const { supabase } = createRouteClient(request);
        const { type, name, phone, email, message } = await request.json();

        try {
            //insert into contact_form table
            const { data, error } = await supabase
                .from('contact_form')
                .insert({ type: type === 'locksmith' ? 'locksmith' : 'customer', name, phone, email, message });

            if (error) {
                console.error('İletişim formu kaydedilemedi:', error);
            }
        } catch (error) {
            console.error('İletişim formu kaydedilemedi:', error);
        }


        return NextResponse.json({
            success: true,
            message: 'İletişim formu başarıyla kaydedildi',
        });

    } catch (error) {
        console.error('İletişim formu kaydedilemedi:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Beklenmeyen bir hata oluştu'
        }, { status: 500 });
    }
} 