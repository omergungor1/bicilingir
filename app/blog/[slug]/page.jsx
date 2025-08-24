'use client';

import { useParams } from 'next/navigation';
import BlogDetailPage from '../../../components/blog/BlogDetailPage';

export default function BlogSlugPage() {
    const params = useParams();

    return <BlogDetailPage slug={params.slug} />;
}