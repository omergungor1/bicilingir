// http://localhost:3000/sehirler/bursa/osmangazi/kukurtlu

import NeighborhoodPageClient from '../../../../components/neighborhood/NeighborhoodPageClient';
import { ServiceList } from '../../../../lib/service-list';
import ServicePage from '../../../../components/location/ServicePage';
import { getMetaData } from '../../../utils/seo';

// API'den çilingir verilerini çek
async function getLocksmithsData(citySlug, districtSlug, neighborhoodSlug) {
    try {
        const params = new URLSearchParams();
        if (citySlug) params.append('citySlug', citySlug);
        if (districtSlug) params.append('districtSlug', districtSlug);
        if (neighborhoodSlug) params.append('neighborhoodSlug', neighborhoodSlug);

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/locksmiths?${params.toString()}`, {
            cache: 'no-store' // Gerçek verileri almak için önbelleği devre dışı bırak
        });

        if (!response.ok) {
            throw new Error('API yanıt vermedi');
        }

        const data = await response.json();
        return data.locksmiths || [];
    } catch (error) {
        console.error('Çilingir verileri çekilirken hata:', error);
        return [];
    }
}

export async function generateMetadata({ params }) {
    const locksmiths = await getLocksmithsData(params.city, params.district, params.neighborhood);

    return await getMetaData({
        citySlug: params.city,
        districtSlug: params.district,
        neighborhoodSlug: params.neighborhood,
        serviceTypeSlug: null,
        locksmiths
    });
}

export default async function NeighborhoodPage({ params }) {
    const { city, district, neighborhood } = params;

    // Eğer neighborhood bir hizmet türüyse, ServicePage komponentini göster
    if (ServiceList.some(service => service.slug === neighborhood))
        return <ServicePage city={city} district={district} servicetype={neighborhood} />;

    // Çilingir verilerini çek
    const locksmiths = await getLocksmithsData(city, district, neighborhood);

    // Normal mahalle sayfasını göster
    return <NeighborhoodPageClient
        city={city}
        district={district}
        neighborhood={neighborhood}
        locksmiths={locksmiths}
    />;
} 