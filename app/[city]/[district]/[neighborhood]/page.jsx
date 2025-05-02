// http://localhost:3000/sehirler/bursa/osmangazi/kukurtlu

import NeighborhoodPageClient from '../../../../components/neighborhood/NeighborhoodPageClient';
import { ServiceList } from '../../../../lib/service-list';
import ServicePage from '../../../../components/location/ServicePage';
import { getMetaData, getLocksmithsList } from '../../../utils/seo';

// Veriyi tek bir yerden çekmek için yardımcı fonksiyon
async function getNeighborhoodData(citySlug, districtSlug, neighborhoodSlug, servicetypeSlug) {

    const locksmiths = await getLocksmithsList({ citySlug, districtSlug, neighborhoodSlug, servicetypeSlug, count: 2 });
    const metadata = await getMetaData({
        citySlug,
        districtSlug,
        neighborhoodSlug,
        servicetypeSlug,
        locksmiths
    });

    return { locksmiths, metadata };
}

export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const { city: citySlug, district: districtSlug, neighborhood: neighborhoodSlug, servicetype: servicetypeSlug } = resolvedParams;

    // Eğer neighborhood bir hizmet türüyse, ServicePage komponentini göster
    const isService = ServiceList.some(service => service.slug === neighborhoodSlug);

    if (isService) {
        const { metadata } = await getNeighborhoodData(
            citySlug,
            districtSlug,
            null,
            servicetypeSlug
        );
        return metadata;
    } else {
        const { metadata } = await getNeighborhoodData(
            citySlug,
            districtSlug,
            neighborhoodSlug,
            null
        );
        return metadata;
    }
}

export default async function NeighborhoodPage({ params }) {
    const resolvedParams = await params;
    const { city: citySlug, district: districtSlug, neighborhood: neighborhoodSlug } = resolvedParams;

    // Eğer neighborhood bir hizmet türüyse, ServicePage komponentini göster
    const isService = ServiceList.some(service => service.slug === neighborhoodSlug);

    if (isService) {
        const { locksmiths } = await getNeighborhoodData(citySlug, districtSlug, null, neighborhoodSlug);
        const data = {
            citySlug,
            districtSlug,
            neighborhoodSlug: null,
            servicetypeSlug: neighborhoodSlug,
            locksmiths
        };
        return <ServicePage data={data} />;
    }

    const { locksmiths } = await getNeighborhoodData(citySlug, districtSlug, neighborhoodSlug, null);

    // Normal mahalle sayfasını göster
    return <NeighborhoodPageClient
        citySlug={citySlug}
        districtSlug={districtSlug}
        neighborhoodSlug={neighborhoodSlug}
        locksmiths={locksmiths}
    />;
} 