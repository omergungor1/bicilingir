// http://localhost:3000/sehirler/bursa/osmangazi/kukurtlu

import NeighborhoodPageClient from '../../../../components/neighborhood/NeighborhoodPageClient';
import { ServiceList } from '../../../../lib/service-list';
import ServicePage from '../../../../components/location/ServicePage';
import { getMetaData, getLocksmithsList } from '../../../utils/seo';

// Veriyi tek bir yerden çekmek için yardımcı fonksiyon
async function getNeighborhoodData(citySlug, districtSlug, neighborhoodSlug) {
    const locksmiths = await getLocksmithsList({ citySlug, districtSlug, neighborhoodSlug, count: 2 });
    const metadata = await getMetaData({
        citySlug,
        districtSlug,
        neighborhoodSlug,
        serviceTypeSlug: null,
        locksmiths
    });

    return { locksmiths, metadata };
}

export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const { metadata } = await getNeighborhoodData(
        resolvedParams.city,
        resolvedParams.district,
        resolvedParams.neighborhood
    );
    return metadata;
}

export default async function NeighborhoodPage({ params }) {
    const resolvedParams = await params;
    const { city, district, neighborhood } = resolvedParams;

    // Eğer neighborhood bir hizmet türüyse, ServicePage komponentini göster
    if (ServiceList.some(service => service.slug === neighborhood))
        return <ServicePage city={city} district={district} servicetype={neighborhood} locksmiths={locksmiths} />;

    const { locksmiths } = await getNeighborhoodData(city, district, neighborhood);

    // Normal mahalle sayfasını göster
    return <NeighborhoodPageClient
        city={city}
        district={district}
        neighborhood={neighborhood}
        locksmiths={locksmiths}
    />;
} 