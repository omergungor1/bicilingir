import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'E-posta adresi gerekli' }, { status: 400 });
        }


        // Çilingiri e-posta adresine göre bul
        const { data: locksmith, error } = await supabase
            .from('locksmiths')
            .select('id, email, fullname')
            .eq('email', email.toLowerCase())
            .single();


        if (error || !locksmith) {
            // Güvenlik için spesifik hata verme
            return NextResponse.json({
                success: true,
                message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi'
            });
        }

        // Son 24 saatteki talep sayısını kontrol et
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const { data: recentRequests, error: countError } = await supabase
            .from('password_reset_tokens')
            .select('created_at')
            .eq('locksmith_id', locksmith.id)
            .gte('created_at', yesterday.toISOString())
            .order('created_at', { ascending: false });


        if (!countError && recentRequests && recentRequests.length >= 3) {
            return NextResponse.json({
                error: 'Çok fazla şifre sıfırlama talebi. Lütfen 24 saat sonra tekrar deneyin.'
            }, { status: 429 });
        }

        // Benzersiz token oluştur
        const token = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + 3600000); // 1 saat geçerli

        // Token'ı veritabanına kaydet
        const { error: tokenError } = await supabase
            .from('password_reset_tokens')
            .insert([
                {
                    locksmith_id: locksmith.id,
                    token,
                    expires_at: expiresAt,
                    created_at: new Date().toISOString() // created_at'i açıkça belirt
                }
            ]);


        if (tokenError) {
            console.error('Token kayıt hatası:', tokenError);
            return NextResponse.json({ error: 'İşlem başarısız oldu' }, { status: 500 });
        }

        // Şifre sıfırlama e-postası gönder
        const resetUrl = `https://bicilingir.com/reset-password?token=${token}`;

        await resend.emails.send({
            from: 'BiÇilingir <noreply@bicilingir.com>',
            to: locksmith.email,
            subject: 'Şifre Sıfırlama İsteği',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
                    <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; margin-top: 20px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <tr>
                            <td style="padding: 20px; text-align: center; background-color: #ffffff;">
                                <img src="https://bicilingir.com/logo.png" alt="BiÇilingir Logo" style="width: 200px; height: auto; margin-bottom: 20px;">
                                <h3 style="margin: 0; color: #666; font-size: 14px; font-weight: normal;">Türkiye'nin İlk ve Tek Çilingir Platformu</h3>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 30px;">
                                <h2 style="color: #333; margin-bottom: 20px;">Merhaba ${locksmith.fullname},</h2>
                                <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                                    Hesabınız için şifre sıfırlama talebinde bulundunuz. Yeni şifrenizi belirlemek için aşağıdaki butona tıklayın.
                                </p>
                                <div style="text-align: center; margin: 30px 0;">
                                    <a href="${resetUrl}" style="background-color: #2563eb; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Şifremi Sıfırla</a>
                                </div>
                                <p style="color: #666; font-size: 14px; margin-bottom: 10px;">
                                    Bu bağlantı güvenliğiniz için 1 saat süreyle geçerlidir.
                                </p>
                                <p style="color: #666; font-size: 14px;">
                                    Eğer bu isteği siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td style="background-color: #f8f8f8; padding: 20px; text-align: center; border-top: 1px solid #eee;">
                                <p style="color: #888; font-size: 12px; margin: 0;">
                                    © ${new Date().getFullYear()} BiÇilingir. Tüm hakları saklıdır.
                                </p>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            `
        });

        return NextResponse.json({
            success: true,
            message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi'
        });

    } catch (error) {
        console.error('Şifre sıfırlama hatası:', error);
        return NextResponse.json(
            { error: 'Şifre sıfırlama işlemi başarısız oldu' },
            { status: 500 }
        );
    }
}
