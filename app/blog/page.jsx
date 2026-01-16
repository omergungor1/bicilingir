import React from 'react';
import BlogListPage from '../../components/blog/BlogListPage';

export const metadata = {
    title: 'Çilingir Rehberi & Blog | En Yakın Çilingir ve Anahtarcı Telefonları - Biçilingir',
    description: 'Türkiye genelinde en yakın çilingir, anahtarcı ve oto anahtarcı telefonlarını bulun. Çilingir fiyatları, kapıda kalma çözümleri ve güvenlik ipuçları Biçilingir rehberinde.',
    keywords: 'en yakın çilingir, çilingir telefonu, anahtarcı, oto anahtarcı, çilingir fiyatları, kapıda kaldım, anahtar içeride kaldı, çilingir rehberi, biçilingir',
    openGraph: {
        title: 'Çilingir Rehberi & Blog | En Yakın Çilingir Telefonları - Biçilingir',
        description: 'Türkiye’nin en büyük çilingir platformu Biçilingir’de en yakın çilingir ve anahtarcı telefonlarını bulun. Rehberler, fiyatlar ve uzman önerileri.',
        type: 'website',
        url: '/blog'
    }
};

export default function BlogPage() {
    const breadcrumbItems = [
        { label: "Ana Sayfa", href: "/" },
        { label: "Blog", current: true }
    ];

    return (
        <BlogListPage
            pageTitle="Blog Yazıları"
            breadcrumbItems={breadcrumbItems}
        />
    );
}