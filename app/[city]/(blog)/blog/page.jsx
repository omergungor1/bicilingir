'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
// import BlogListingPage from '../../../components/blog/BlogListingPage';
import BlogListPage from '../../../../components/blog/BlogListPage'
// import { createRouteClient } from '../../../../lib/supabase';
import { createRouteClient } from '../../../api/utils';

export default function ProvinceBlogListPage() {
    const params = useParams();
    const [province, setProvince] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProvinceData();
    }, [params.city]);

    const fetchProvinceData = async () => {
        try {
            const supabase = createRouteClient();
            const { data, error } = await supabase
                .from('provinces')
                .select('id, name, slug')
                .eq('slug', params.city)
                .single();

            if (error) throw error;
            setProvince(data);
        } catch (error) {
            console.error('Province data getirilemedi:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-8"></div>
                </div>
            </div>
        );
    }

    if (!province) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">İl Bulunamadı</h1>
                    <p className="text-gray-600">Aradığınız il bulunamadı.</p>
                </div>
            </div>
        );
    }

    const breadcrumbItems = [
        { label: "Ana Sayfa", href: "/" },
        { label: province.name, href: `/${province.slug}` },
        { label: "Blog", current: true }
    ];

    return (
        <BlogListPage
            province={province}
            pageTitle={`${province.name} Blog Yazıları`}
            breadcrumbItems={breadcrumbItems}
        />
    );
}
