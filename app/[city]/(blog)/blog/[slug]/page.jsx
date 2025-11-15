'use client';

import { useParams } from 'next/navigation';
import BlogDetailPage from '../../../../../components/blog/BlogDetailPage';

export default function ProvinceBlowSlugPage() {
    const params = useParams();

    return (
        <BlogDetailPage
            slug={params.slug}
            province={params.city}
        />
    );
}
