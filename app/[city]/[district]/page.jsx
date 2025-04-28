// http://localhost:3000/sehirler/bursa/nilufer

import DistrictContent from '../../../components/district/DistrictContent';
import { ServiceList } from '../../../lib/service-list';
import ServicePage from '../../../components/location/ServicePage';
import { getMetaData } from '../../utils/seo';

// API'den çilingir verilerini çek
async function getLocksmithsData(citySlug, districtSlug) {
    try {
        const params = new URLSearchParams();
        if (citySlug) params.append('citySlug', citySlug);
        if (districtSlug) params.append('districtSlug', districtSlug);

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
    // Çilingir verilerini çek
    const locksmiths = await getLocksmithsData(params.city, params.district);

    // Metadata oluştur
    const metadata = await getMetaData({
        citySlug: params.city,
        districtSlug: params.district,
        neighborhoodSlug: null,
        serviceTypeSlug: null,
        locksmiths
    });

    return metadata;
}

export default async function DistrictPage({ params }) {
    const { city, district } = params;

    // Eğer district bir hizmet türüyse, ServicePage komponentini göster
    if (ServiceList.some(service => service.slug === district))
        return <ServicePage city={city} servicetype={district} />;

    // Çilingir verilerini çek - generateMetadata'da zaten çekildiği için
    // React'in önbelleğini kullanarak tekrar çekmeyecek
    const locksmiths = await getLocksmithsData(city, district);

    // Normal ilçe sayfasını göster
    return <DistrictContent city={city} district={district} locksmiths={locksmiths} />;
}