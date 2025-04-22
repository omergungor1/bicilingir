export const metadata = {
    title: 'Şehirlere Göre Çilingir Hizmetleri | BiÇilingir',
    description: 'Türkiye\'nin tüm şehirlerinde 7/24 acil çilingir, oto çilingir, ev ve işyeri çilingir hizmetleri.',
    openGraph: {
        title: 'Şehirlere Göre Çilingir Hizmetleri | BiÇilingir',
        description: 'Türkiye\'nin tüm şehirlerinde 7/24 acil çilingir, oto çilingir, ev ve işyeri çilingir hizmetleri.',
        images: '/images/og-image.jpg',
    },
};

export default function CityLayout({ children }) {
    return (
        <div>{children}</div>
    );
} 