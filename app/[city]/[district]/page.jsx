// http://localhost:3000/sehirler/bursa/nilufer

import DistrictContent from '../../../components/district/DistrictContent';
import { ServiceList } from '../../../lib/service-list';
import ServicePage from '../../../components/location/ServicePage';
import { getMetaData, getLocksmithsList } from '../../utils/seo';

// Veriyi tek bir yerden çekmek için yardımcı fonksiyon
async function getDistrictData(citySlug, districtSlug) {
    const locksmiths = await getLocksmithsList({ citySlug, districtSlug, count: 2 });
    console.log('locksmiths2: ', locksmiths);
    const metadata = await getMetaData({
        citySlug,
        districtSlug,
        neighborhoodSlug: null,
        serviceTypeSlug: null,
        locksmiths
    });

    return { locksmiths, metadata };
}

export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const { metadata } = await getDistrictData(resolvedParams.city, resolvedParams.district);
    return metadata;
}

export default async function DistrictPage({ params }) {
    const resolvedParams = await params;
    const { city: citySlug, district: districtSlug } = resolvedParams;

    // Eğer district bir hizmet türüyse, ServicePage komponentini göster
    if (ServiceList.some(service => service.slug === districtSlug))
        return <ServicePage citySlug={citySlug} servicetype={districtSlug} locksmiths={locksmiths} />;

    const { locksmiths } = await getDistrictData(citySlug, districtSlug);

    // Normal ilçe sayfasını göster
    return <DistrictContent citySlug={citySlug} districtSlug={districtSlug} locksmiths={locksmiths} />;
}