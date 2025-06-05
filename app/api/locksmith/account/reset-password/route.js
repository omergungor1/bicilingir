import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
    try {
        const { token, password } = await request.json();

        if (!token || !password) {
            return NextResponse.json({
                error: 'Token ve yeni şifre gerekli'
            }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({
                error: 'Şifre en az 6 karakter olmalıdır'
            }, { status: 400 });
        }

        // Token'ı kontrol et
        const { data: tokenData, error: tokenError } = await supabase
            .from('password_reset_tokens')
            .select('locksmith_id, used, expires_at')
            .eq('token', token)
            .single();

        if (tokenError || !tokenData) {
            return NextResponse.json({
                error: 'Geçersiz veya süresi dolmuş bağlantı'
            }, { status: 400 });
        }

        if (tokenData.used) {
            return NextResponse.json({
                error: 'Bu bağlantı daha önce kullanılmış'
            }, { status: 400 });
        }

        if (new Date(tokenData.expires_at) < new Date()) {
            return NextResponse.json({
                error: 'Bağlantının süresi dolmuş'
            }, { status: 400 });
        }

        // Çilingirin user_id'sini al
        const { data: locksmith, error: locksmithError } = await supabase
            .from('locksmiths')
            .select('authid')
            .eq('id', tokenData.locksmith_id)
            .single();

        if (locksmithError || !locksmith) {
            return NextResponse.json({
                error: 'Çilingir bilgileri bulunamadı'
            }, { status: 400 });
        }

        // Supabase auth API ile şifreyi güncelle
        const { error: updateError } = await supabase.auth.admin.updateUserById(
            locksmith.authid,
            { password: password }
        );

        if (updateError) {
            console.error('Şifre güncelleme hatası:', updateError);
            return NextResponse.json({
                error: 'Şifre güncellenirken bir hata oluştu'
            }, { status: 500 });
        }

        // Token'ı kullanıldı olarak işaretle
        await supabase
            .from('password_reset_tokens')
            .update({ used: true })
            .eq('token', token);

        return NextResponse.json({
            success: true,
            message: 'Şifreniz başarıyla güncellendi'
        });

    } catch (error) {
        console.error('Şifre sıfırlama hatası:', error);
        return NextResponse.json({
            error: 'Şifre sıfırlama işlemi başarısız oldu'
        }, { status: 500 });
    }
} 