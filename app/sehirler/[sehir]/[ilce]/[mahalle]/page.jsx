// http://localhost:3000/sehirler/bursa/osmangazi/kukurtlu

import NeighborhoodPageClient from '../../../../../components/neighborhood/NeighborhoodPageClient';

export async function generateMetadata({ params }) {
    // params kontrolü
    if (!params || !await params.sehir || !await params.ilce || !await params.mahalle) {
        return {
            title: 'Çilingir Hizmeti | Bi Çilingir',
            description: 'Türkiye genelinde çilingir hizmetleri. Anahtar kopyalama, kilit değiştirme ve acil kapı açma için hemen arayın!',
        };
    }

    // Parametre değerlerini almadan önce params nesnesini bekle
    const resolvedParams = await params;
    const { sehir, ilce, mahalle } = resolvedParams;

    const capitalizedSehir = sehir.charAt(0).toUpperCase() + sehir.slice(1);
    const capitalizedIlce = ilce.charAt(0).toUpperCase() + ilce.slice(1);
    const capitalizedMahalle = mahalle.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return {
        title: `${capitalizedMahalle}, ${capitalizedIlce}, ${capitalizedSehir} Çilingir | BiÇilingir`,
        description: `${capitalizedSehir} ${capitalizedIlce} ${capitalizedMahalle}'de 7/24 acil çilingir hizmetleri. Anahtar kopyalama, kapı açma, kilit değişimi ve diğer çilingir hizmetleri için hemen arayın.`,
        openGraph: {
            title: `${capitalizedMahalle}, ${capitalizedIlce}, ${capitalizedSehir} Çilingir | BiÇilingir`,
            description: `${capitalizedSehir} ${capitalizedIlce} ${capitalizedMahalle}'de 7/24 acil çilingir hizmetleri. Anahtar kopyalama, kapı açma, kilit değişimi ve diğer çilingir hizmetleri için hemen arayın.`,
            images: '/images/og-image.jpg',
        },
    };
}

export default async function NeighborhoodPage({ params }) {
    // params nesnesini bekle ve çözümle
    const resolvedParams = await params;

    // params nesnesini string olarak serialize ediyoruz
    const serializedParams = { value: JSON.stringify(resolvedParams) };
    return <NeighborhoodPageClient params={serializedParams} />;
} 