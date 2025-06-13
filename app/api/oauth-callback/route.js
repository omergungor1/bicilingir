import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request) {
    try {
        // URL'den code parametresini al
        const { searchParams } = new URL(request.url);
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        // Hata kontrolü
        if (error) {
            console.error('OAuth hatası:', error);
            return NextResponse.json({
                error: 'OAuth hatası',
                details: error
            }, { status: 400 });
        }

        // Code kontrolü
        if (!code) {
            console.error('Authorization code bulunamadı');
            return NextResponse.json({
                error: 'Authorization code bulunamadı'
            }, { status: 400 });
        }

        console.log('Authorization code alındı:', code);

        // Token exchange isteği için parametreler
        const tokenParams = {
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: process.env.GOOGLE_REDIRECT_URI
        };

        console.log('Token exchange isteği gönderiliyor...');

        // Google OAuth2 token endpoint'ine POST isteği
        const response = await axios.post('https://oauth2.googleapis.com/token', tokenParams, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const tokenData = response.data;

        console.log('Token yanıtı alındı:');
        console.log('Access Token:', tokenData.access_token);
        console.log('Refresh Token:', tokenData.refresh_token);
        console.log('Token Type:', tokenData.token_type);
        console.log('Expires In:', tokenData.expires_in);
        console.log('Scope:', tokenData.scope);

        // Başarılı yanıt
        return NextResponse.json({
            success: true,
            message: 'Token başarıyla alındı',
            data: {
                access_token: tokenData.access_token,
                refresh_token: tokenData.refresh_token,
                token_type: tokenData.token_type,
                expires_in: tokenData.expires_in,
                scope: tokenData.scope
            }
        });

    } catch (error) {
        console.error('OAuth callback hatası:', error);

        // Axios hatası ise detayları al
        if (error.response) {
            console.error('Google API yanıt hatası:', {
                status: error.response.status,
                data: error.response.data
            });

            return NextResponse.json({
                error: 'Google API hatası',
                status: error.response.status,
                details: error.response.data
            }, { status: error.response.status });
        }

        // Network hatası
        if (error.request) {
            console.error('Network hatası:', error.request);
            return NextResponse.json({
                error: 'Network hatası',
                details: 'Google API\'ye bağlanılamadı'
            }, { status: 500 });
        }

        // Genel hata
        return NextResponse.json({
            error: 'Beklenmeyen hata',
            details: error.message
        }, { status: 500 });
    }
}

// POST isteği için de aynı işlevi sağla
export async function POST(request) {
    return GET(request);
} 