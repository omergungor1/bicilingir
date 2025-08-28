import React from 'react';
import BlogListPage from '../../components/blog/BlogListPage';

export const metadata = {
    title: 'Blog Yazıları | Çilingir Hizmetleri ve Güvenlik Sistemleri',
    description: 'Çilingirlik hizmetleri, güvenlik sistemleri, kapı kilidi değişimi ve daha birçok konuda faydalı blog yazıları. Uzman çilingirlerden ipuçları ve öneriler.',
    keywords: 'çilingir blog, güvenlik sistemleri, kapı kilidi, çilingir ipuçları, güvenlik tavsiyeleri',
    openGraph: {
        title: 'Blog Yazıları | Çilingir Hizmetleri ve Güvenlik Sistemleri',
        description: 'Çilingirlik hizmetleri, güvenlik sistemleri, kapı kilidi değişimi ve daha birçok konuda faydalı blog yazıları.',
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