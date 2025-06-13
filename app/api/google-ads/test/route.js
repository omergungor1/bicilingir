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

        // Google Ads API'nin doğru endpoint'ini kullan
        // Önce customer bilgilerini al
        console.log('Customer bilgileri alınıyor...');

        try {
            const customerResponse = await axios.get(
                `https://googleads.googleapis.com/v16/customers/${customerId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'developer-token': developerToken
                    }
                }
            );

            console.log('Customer bilgileri alındı:', customerResponse.data);

            // Şimdi kampanya listesini al - doğru endpoint kullan
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

            // Google Ads API'nin doğru search endpoint'i
            const adsResponse = await axios.post(
                `https://googleads.googleapis.com/v16/customers/${customerId}/googleAds:search`,
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
                    customer: customerResponse.data,
                    totalCampaigns: formattedCampaigns.length,
                    campaigns: formattedCampaigns,
                    rawResponse: adsResponse.data
                }
            });

        } catch (apiError) {
            console.error('API hatası:', apiError.response?.data || apiError.message);

            // Eğer customer endpoint çalışmazsa, farklı bir yaklaşım dene
            if (apiError.response?.status === 404) {
                console.log('Customer endpoint bulunamadı, alternatif yaklaşım deneniyor...');

                // Google Ads API'nin farklı bir endpoint'ini dene
                try {
                    // Önce mevcut customer'ları listele
                    const customersResponse = await axios.get(
                        'https://googleads.googleapis.com/v16/customers:listAccessibleCustomers',
                        {
                            headers: {
                                'Authorization': `Bearer ${accessToken}`,
                                'developer-token': developerToken
                            }
                        }
                    );

                    console.log('Mevcut customer\'lar:', customersResponse.data);

                    if (customersResponse.data.resourceNames && customersResponse.data.resourceNames.length > 0) {
                        const firstCustomerId = customersResponse.data.resourceNames[0].replace('customers/', '');
                        console.log('Kullanılacak customer ID:', firstCustomerId);

                        // Bu customer ID ile tekrar dene
                        const retryResponse = await axios.post(
                            `https://googleads.googleapis.com/v16/customers/${firstCustomerId}/googleAds:search`,
                            {
                                query: 'SELECT campaign.id, campaign.name FROM campaign LIMIT 1'
                            },
                            {
                                headers: {
                                    'Authorization': `Bearer ${accessToken}`,
                                    'developer-token': developerToken,
                                    'Content-Type': 'application/json'
                                }
                            }
                        );

                        console.log('Alternatif yaklaşım başarılı:', retryResponse.data);

                        return NextResponse.json({
                            success: true,
                            message: 'Google Ads API bağlantısı başarılı (alternatif yaklaşım)',
                            data: {
                                availableCustomers: customersResponse.data.resourceNames,
                                selectedCustomer: firstCustomerId,
                                campaigns: retryResponse.data.results || [],
                                rawResponse: retryResponse.data
                            }
                        });
                    }

                } catch (altError) {
                    console.error('Alternatif yaklaşım da başarısız:', altError.response?.data || altError.message);
                }
            }

            throw apiError;
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
                errorMessage = 'API endpoint bulunamadı - Customer ID veya API versiyonu kontrol edin';
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
            suggestion: 'Google Ads API dokümantasyonunu kontrol edin ve Customer ID\'nizin doğru olduğundan emin olun'
        }, { status: 500 });
    }
}

// POST isteği için de aynı işlevi sağla
export async function POST(request) {
    return GET(request);
} 