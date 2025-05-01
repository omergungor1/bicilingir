// http://localhost:3000/sehirler/bursa/osmangazi/kukurtlu/acil-cilingir

import ServicePage from '../../../../../components/location/ServicePage';
import { getMetaData, getLocksmithsList } from '../../../../utils/seo';

// Veriyi tek bir yerden çekmek için yardımcı fonksiyon
async function getServiceData(citySlug, districtSlug, neighborhoodSlug, serviceTypeSlug) {
    const locksmiths = await getLocksmithsList({ citySlug, districtSlug, neighborhoodSlug, serviceTypeSlug, count: 2 });
    const metadata = await getMetaData({
        citySlug,
        districtSlug,
        neighborhoodSlug,
        serviceTypeSlug,
        locksmiths
    });

    return { locksmiths, metadata };
}

export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const { metadata } = await getServiceData(
        resolvedParams.city,
        resolvedParams.district,
        resolvedParams.neighborhood,
        resolvedParams.servicetype
    );
    return metadata;
}

export default async function NeighborhoodServicePage({ params }) {
    const resolvedParams = await params;
    const { city, district, neighborhood, servicetype } = resolvedParams;

    const { locksmiths } = await getServiceData(city, district, neighborhood, servicetype);

    const data = {
        city,
        district,
        neighborhood,
        servicetype,
        locksmiths
    };

    return <ServicePage data={data} />;
} 