import { NextResponse } from 'next/server';
import axios from 'axios';

// Refresh token ile access token al
async function getAccessToken() {
    try {
        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
            grant_type: 'refresh_token'
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        return tokenResponse.data.access_token;
    } catch (error) {
        console.error('Access token alma hatası:', error.response?.data || error.message);
        throw new Error('Access token alınamadı');
    }
}

export async function GET(request) {
    try {
        console.log('Google Ads API test başlatılıyor...');

        // 1. Access token al
        console.log('Access token alınıyor...');
        const accessToken = await getAccessToken();
        console.log('Access token alındı:', accessToken.substring(0, 20) + '...');

        // 2. Google Ads API'ye test isteği gönder
        console.log('Google Ads API\'ye istek gönderiliyor...');

        const customerId = process.env.GOOGLE_CUSTOMER_ID;
        const developerToken = process.env.GOOGLE_DEVELOPER_TOKEN;

        console.log('Customer ID:', customerId);
        console.log('Developer Token:', developerToken ? 'Mevcut' : 'Eksik');

        // Farklı API versiyonlarını dene
        const apiVersions = ['v17', 'v16', 'v15', 'v14'];

        for (const version of apiVersions) {
            try {
                console.log(`${version} versiyonu deneniyor...`);

                // Önce basit bir customer bilgisi isteği
                const customerResponse = await axios.get(
                    `https://googleads.googleapis.com/${version}/customers/${customerId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'developer-token': developerToken
                        }
                    }
                );

                console.log(`${version} versiyonu başarılı!`);
                console.log('Customer bilgileri:', customerResponse.data);

                // Şimdi kampanya listesini al
                const query = `
                    SELECT 
                        campaign.id,
                        campaign.name,
                        campaign.status,
                        campaign.start_date,
                        campaign.end_date,
                        campaign.budget_amount_micros
                    FROM campaign 
                    WHERE campaign.status != 'REMOVED'
                    ORDER BY campaign.id
                    LIMIT 5
                `.trim();

                console.log('Kampanya query\'si gönderiliyor...');

                const adsResponse = await axios.post(
                    `https://googleads.googleapis.com/${version}/customers/${customerId}/googleAds:search`,
                    {
                        query: query
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'developer-token': developerToken,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                console.log('Google Ads API yanıtı alındı');

                // Sonuçları formatla
                const campaigns = adsResponse.data.results || [];

                const formattedCampaigns = campaigns.map(result => {
                    const campaign = result.campaign;
                    return {
                        id: campaign.id,
                        name: campaign.name,
                        status: campaign.status,
                        startDate: campaign.startDate,
                        endDate: campaign.endDate,
                        budgetAmount: campaign.budgetAmountMicros ?
                            (parseInt(campaign.budgetAmountMicros) / 1000000).toFixed(2) + ' TL' :
                            'Belirtilmemiş'
                    };
                });

                return NextResponse.json({
                    success: true,
                    message: 'Google Ads API bağlantısı başarılı',
                    data: {
                        apiVersion: version,
                        customer: customerResponse.data,
                        totalCampaigns: formattedCampaigns.length,
                        campaigns: formattedCampaigns,
                        rawResponse: adsResponse.data
                    }
                });

            } catch (versionError) {
                console.log(`${version} versiyonu başarısız:`, versionError.response?.status || versionError.message);

                // Son versiyon değilse devam et
                if (version !== apiVersions[apiVersions.length - 1]) {
                    continue;
                }

                // Tüm versiyonlar başarısızsa hata döndür
                throw versionError;
            }
        }

    } catch (error) {
        console.error('Google Ads API test hatası:', error);

        // Detaylı hata bilgisi
        let errorMessage = 'Bilinmeyen hata';
        let errorDetails = {};

        if (error.response) {
            // Google Ads API hatası
            errorDetails = {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data,
                url: error.config?.url,
                method: error.config?.method
            };

            if (error.response.status === 401) {
                errorMessage = 'Yetkilendirme hatası - Token geçersiz olabilir';
            } else if (error.response.status === 403) {
                errorMessage = 'Erişim reddedildi - Developer token veya customer ID kontrol edin';
            } else if (error.response.status === 400) {
                errorMessage = 'Geçersiz istek - Parametreler hatalı';
            } else if (error.response.status === 404) {
                errorMessage = 'API endpoint bulunamadı - Tüm API versiyonları denendi';
            } else {
                errorMessage = `Google Ads API hatası: ${error.response.status}`;
            }
        } else if (error.request) {
            errorMessage = 'Network hatası - Google Ads API\'ye bağlanılamadı';
            errorDetails = { request: error.request };
        } else {
            errorMessage = error.message;
        }

        return NextResponse.json({
            success: false,
            error: errorMessage,
            details: errorDetails,
            suggestion: 'Sunucuda test etmeyi deneyin veya Google Ads API dokümantasyonunu kontrol edin'
        }, { status: 500 });
    }
}

// POST isteği için de aynı işlevi sağla
export async function POST(request) {
    return GET(request);
} 