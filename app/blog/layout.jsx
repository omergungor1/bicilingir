export const metadata = {
    title: 'Blog | BiÇilingir - Çilingircilik Hakkında Her Şey',
    description: 'Çilingircilik hakkında bilgilendirici yazılar, ipuçları, güncel haberler ve uzman tavsiyeleri. Acil çilingir hizmetleri, güvenlik sistemleri ve daha fazlası.',
    keywords: 'çilingir blog, çilingircilik, güvenlik sistemleri, acil çilingir, kilit açma, anahtar çoğaltma, çelik kasa, güvenlik tavsiyeleri',
    authors: [{ name: 'BiÇilingir' }],
    creator: 'BiÇilingir',
    publisher: 'BiÇilingir',
    openGraph: {
        title: 'Blog | BiÇilingir',
        description: 'Çilingircilik hakkında bilgilendirici yazılar, ipuçları ve güncel haberler',
        url: 'https://bicilingir.com/blog',
        siteName: 'BiÇilingir',
        images: [
            {
                url: '/images/infocard.png',
                width: 1200,
                height: 630,
                alt: 'BiÇilingir Blog',
            }
        ],
        locale: 'tr_TR',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Blog | BiÇilingir',
        description: 'Çilingircilik hakkında bilgilendirici yazılar, ipuçları ve güncel haberler',
        images: ['/images/infocard.png'],
        creator: '@bicilingir',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    alternates: {
        canonical: 'https://bicilingir.com/blog',
    },
};

export default function BlogLayout({ children }) {
    return children;
}
