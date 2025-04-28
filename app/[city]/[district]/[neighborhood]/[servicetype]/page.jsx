// http://localhost:3000/sehirler/bursa/osmangazi/kukurtlu/acil-cilingir

import ServicePage from '../../../../../components/location/ServicePage';
import { getMetaData } from '../../../../utils/seo';

// API'den çilingir verilerini çek
async function getLocksmithsData(citySlug, districtSlug, neighborhoodSlug, serviceTypeSlug) {
    try {
        const params = new URLSearchParams();
        if (citySlug) params.append('citySlug', citySlug);
        if (districtSlug) params.append('districtSlug', districtSlug);
        if (neighborhoodSlug) params.append('neighborhoodSlug', neighborhoodSlug);
        if (serviceTypeSlug) params.append('serviceTypeSlug', serviceTypeSlug);

        const response = await fetch(`/api/locksmiths?${params.toString()}`, {
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
    const locksmiths = await getLocksmithsData(
        params.city,
        params.district,
        params.neighborhood,
        params.servicetype
    );

    return await getMetaData({
        citySlug: params.city,
        districtSlug: params.district,
        neighborhoodSlug: params.neighborhood,
        serviceTypeSlug: params.servicetype,
        locksmiths
    });
}

export default async function NeighborhoodServicePage({ params }) {
    const { city, district, neighborhood, servicetype } = params;

    // Çilingir verilerini çek
    const locksmiths = await getLocksmithsData(city, district, neighborhood, servicetype);

    const data = {
        city,
        district,
        neighborhood,
        servicetype,
        locksmiths
    };

    return <ServicePage data={data} />;
} 