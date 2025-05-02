// http://localhost:3000/sehirler/bursa/nilufer

import DistrictContent from '../../../components/district/DistrictContent';
import { ServiceList } from '../../../lib/service-list';
import ServicePage from '../../../components/location/ServicePage';
import { getMetaData, getLocksmithsList } from '../../utils/seo';

// Veriyi tek bir yerden çekmek için yardımcı fonksiyon
async function getDistrictData(citySlug, districtSlug, servicetypeSlug) {
    const locksmiths = await getLocksmithsList({ citySlug, districtSlug, servicetypeSlug, count: 2 });
    const metadata = await getMetaData({
        citySlug,
        districtSlug,
        neighborhoodSlug: null,
        servicetypeSlug,
        locksmiths
    });

    return { locksmiths, metadata };
}

export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const { city: citySlug, district: districtSlug } = resolvedParams;

    const isService = ServiceList.some(service => service.slug === districtSlug);

    if (isService) {
        const { metadata } = await getDistrictData(citySlug, null, districtSlug);
        return metadata;
    } else {
        const { metadata } = await getDistrictData(citySlug, districtSlug, null);
        return metadata;
    }
}

export default async function DistrictPage({ params }) {
    const resolvedParams = await params;
    const { city: citySlug, district: districtSlug } = resolvedParams;

    const isService = ServiceList.some(service => service.slug === districtSlug);

    if (isService) {
        const { locksmiths } = await getDistrictData(citySlug, null, districtSlug);
        const data = {
            citySlug,
            districtSlug: null,
            neighborhoodSlug: null,
            servicetypeSlug: districtSlug,
            locksmiths
        };
        return <ServicePage data={data} />;
    }

    const { locksmiths } = await getDistrictData(citySlug, districtSlug);
    // Normal ilçe sayfasını göster
    return <DistrictContent citySlug={citySlug} districtSlug={districtSlug} locksmiths={locksmiths} />;
}