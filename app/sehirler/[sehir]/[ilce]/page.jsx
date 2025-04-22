// http://localhost:3000/sehirler/bursa/nilufer

import DistrictContent from '../../../../components/district/DistrictContent-old';


export async function generateMetadata({ params }) {
    // params kontrolü
    if (!params || !params.sehir || !params.ilce) {
        return {
            title: 'Çilingir Hizmeti | Bi Çilingir',
            description: 'Türkiye genelinde çilingir hizmetleri. Anahtar kopyalama, kilit değiştirme ve acil kapı açma için hemen arayın!',
        };
    }

    const { sehir, ilce } = params;
    const formattedCity = sehir.charAt(0).toUpperCase() + sehir.slice(1);
    const formattedDistrict = ilce.charAt(0).toUpperCase() + ilce.slice(1);

    return {
        title: `${formattedDistrict} ${formattedCity} Çilingir Hizmeti | Bi Çilingir`,
        description: `${formattedCity} ${formattedDistrict} bölgesinde 7/24 çilingir hizmetleri. Anahtar kopyalama, kilit değiştirme ve acil kapı açma için hemen arayın!`,
        openGraph: {
            title: `${formattedDistrict} ${formattedCity} Çilingir Hizmeti | Bi Çilingir`,
            description: `${formattedCity} ${formattedDistrict} bölgesinde 7/24 çilingir hizmetleri. Anahtar kopyalama, kilit değiştirme ve acil kapı açma için hemen arayın!`,
            images: '/images/og-image.jpg',
        },
    };
}

export default function DistrictPage({ params }) {
    return <DistrictContent params={params} />
}