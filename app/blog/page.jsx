'use client';

import BlogListPage from '../../components/blog/BlogListPage';

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