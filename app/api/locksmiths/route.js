import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Supabase bağlantısı oluştur
 * @returns {Object} Supabase istemcisi
 */
function createSupabaseClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    );
}

/**
 * Çilingir verilerini getir API endpoint'i
 */
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const citySlug = searchParams.get('citySlug');
        const districtSlug = searchParams.get('districtSlug');
        const neighborhoodSlug = searchParams.get('neighborhoodSlug');
        const serviceTypeSlug = searchParams.get('serviceTypeSlug');

        // Supabase bağlantısı oluştur
        const supabase = createSupabaseClient();

        // Şehir, ilçe bilgilerini çek (gerekirse)
        let cityId, districtId;

        if (citySlug) {
            const { data: cityData } = await supabase
                .from('provinces')
                .select('id')
                .eq('slug', citySlug)
                .single();

            if (cityData) {
                cityId = cityData.id;
            }
        }

        if (districtSlug && cityId) {
            const { data: districtData } = await supabase
                .from('districts')
                .select('id')
                .eq('slug', districtSlug)
                .eq('province_id', cityId)
                .single();

            if (districtData) {
                districtId = districtData.id;
            }
        }

        // Çilingir listesini çek
        let locksmithQuery = supabase
            .from('locksmiths')
            .select(`
                id, 
                businessName,
                fullName,
                email,
                phoneNumber,
                whatsappNumber,
                avgRating,
                totalReviewCount,
                profileimageurl,
                provinces:provinceId(name),
                districts:districtId(name)
            `)
            .eq('isActive', true)
            .order('avgRating', { ascending: false })
            .limit(2);

        // Filtreleme
        if (cityId) {
            locksmithQuery = locksmithQuery.eq('provinceId', cityId);
        }
        if (districtId) {
            locksmithQuery = locksmithQuery.eq('districtId', districtId);
        }

        const { data: locksmiths, error } = await locksmithQuery;

        if (error) {
            console.error('Çilingir verileri çekilirken hata:', error);
            return NextResponse.json({ error: 'Çilingir verileri alınamadı' }, { status: 500 });
        }

        // Çilingir verilerini formatlama
        const formattedLocksmiths = locksmiths.map(item => ({
            id: item.id,
            name: item.businessName || item.fullName,
            description: `${item.provinces?.name || ''} ${item.districts?.name || ''} bölgesinde profesyonel çilingir hizmeti.`,
            phone: item.phoneNumber,
            whatsapp: item.whatsappNumber,
            website: `https://bicilingir.com/cilingir/${item.id}`,
            logoUrl: item.profileimageurl || 'https://bicilingir.com/images/logo.png',
            city: item.provinces?.name,
            district: item.districts?.name,
            ratingValue: item.avgRating,
            ratingCount: item.totalReviewCount,
            priceRange: "₺₺",
            openingHours: "Mo-Su 00:00-23:59",
            serviceType: serviceTypeSlug ? serviceTypeSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : "Çilingir Hizmeti"
        }));

        return NextResponse.json({ locksmiths: formattedLocksmiths });
    } catch (error) {
        console.error('API hatası:', error);
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
} 