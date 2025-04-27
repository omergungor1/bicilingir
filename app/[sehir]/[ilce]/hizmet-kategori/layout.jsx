export async function generateMetadata({ params }) {
    // Parametre değerlerini almadan önce params nesnesini bekle
    const resolvedParams = await params;

    // Artık çözümlenmiş params'tan özellikleri alabiliriz
    const { sehir, ilce, "hizmet-kategori": hizmetKategori } = resolvedParams;

    // Hizmet kategorileri bilgileri
    const serviceCategories = {
        "acil-cilingir": {
            title: "Acil Çilingir",
            description: "7/24 hizmet veren acil çilingir ekibimiz, kapınız kilitli kaldığında en hızlı şekilde yanınızda.",
            metaDescription: `${sehir} ${ilce}'da 7/24 acil çilingir hizmeti. Kapı açma, kilit değiştirme ve tüm anahtar işleriniz için hızlı ve güvenilir çözüm.`
        },
        "oto-cilingir": {
            title: "Oto Çilingir",
            description: "Araç anahtar ve kilit sorunlarınıza profesyonel çözümler sunan oto çilingir hizmetimiz.",
            metaDescription: `${sehir} ${ilce}'da profesyonel oto çilingir hizmeti. Araç anahtar kopyalama, immobilizer ve kilit sorunları için uzman destek.`
        },
        "ev-cilingir": {
            title: "Ev Çilingir",
            description: "Ev ve işyerleriniz için özel çilingir hizmetleri, kilit değişimi ve güvenlik danışmanlığı.",
            metaDescription: `${sehir} ${ilce}'da ev ve konutlar için özel çilingir hizmeti. Kilit değişimi, güvenlik sistemleri ve danışmanlık hizmetleri.`
        },
        "kasa-cilingir": {
            title: "Kasa Çilingir",
            description: "Unutulan şifreler veya arızalanan kasa kilitlerinde profesyonel müdahale ve çözüm.",
            metaDescription: `${sehir} ${ilce}'da kasa açma ve tamir hizmetleri. Unutulan şifreler, arızalanan kilitler için profesyonel müdahale.`
        },
        "724-cilingir": {
            title: "7/24 Çilingir",
            description: "Gece gündüz, tatil veya bayram demeden her an ulaşabileceğiniz çilingir hizmeti.",
            metaDescription: `${sehir} ${ilce}'da 7/24 kesintisiz çilingir hizmeti. Gece gündüz, tatil bayram demeden yanınızdayız.`
        },
        "cilingir-hizmeti": {
            title: "Çilingir Hizmeti",
            description: "Her türlü anahtar, kilit ve güvenlik sistemi için genel çilingir hizmetleri.",
            metaDescription: `${sehir} ${ilce}'da genel çilingir hizmetleri. Anahtar yapımı, kilit değişimi, kapı açma ve daha fazlası için bizi arayın.`
        }
    };

    // Hizmet kategorisi bilgilerini al veya varsayılanları kullan
    const serviceCategory = serviceCategories[hizmetKategori] || {
        title: hizmetKategori.replace(/-/g, " "),
        description: "Profesyonel çilingir hizmetleri",
        metaDescription: `${sehir} ${ilce} bölgesinde profesyonel çilingir hizmetleri.`
    };

    // Sayfa başlığı
    const title = `${sehir} ${ilce} ${serviceCategory.title} - 7/24 Hizmet | BiÇilingir`;

    // Canonical URL
    const canonical = `https://bicilingir.com/${sehir}/${ilce}/${hizmetKategori}`;

    return {
        title,
        description: serviceCategory.metaDescription,
        keywords: `${ilce} çilingir, ${sehir} çilingir, ${ilce} ${serviceCategory.title.toLowerCase()}, ${sehir} ${ilce} çilingir, anahtar, kilit`,
        openGraph: {
            title,
            description: serviceCategory.metaDescription,
            url: canonical,
            siteName: 'BiÇilingir',
            images: [
                {
                    url: 'https://bicilingir.com/images/og-image.jpg',
                    width: 1200,
                    height: 630,
                    alt: `${sehir} ${ilce} ${serviceCategory.title}`,
                },
            ],
            locale: 'tr_TR',
            type: 'website',
        },
        alternates: {
            canonical: canonical,
        },
    };
}

export default function DistrictServiceLayout({ children }) {
    return (
        <>
            {children}
        </>
    );
} 