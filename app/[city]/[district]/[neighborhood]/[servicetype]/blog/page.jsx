import React from 'react'
import { ServiceList } from '../../../../../../lib/service-list'
import BlogListPage from '../../../../../../components/blog/BlogListPage'
// import { createServerClient } from '../../../../../api/utils'
import { getSupabaseServer } from '../../../../../../lib/supabase';

async function BlogPage({ params }) {
    const data = await params;
    const { city, district, neighborhood, servicetype } = data;

    const supabase = getSupabaseServer();

    // İl bilgisini al
    const { data: provinceData } = await supabase
        .from('provinces')
        .select('id, name, slug')
        .eq('slug', city)
        .single();

    if (!provinceData) {
        return <div>İl bulunamadı</div>;
    }

    // İlçe bilgisini al
    const { data: districtData } = await supabase
        .from('districts')
        .select('id, name, slug')
        .eq('slug', district)
        .eq('province_id', provinceData.id)
        .single();

    if (!districtData) {
        return <div>İlçe bulunamadı</div>;
    }

    // Mahalle bilgisini al
    const { data: neighborhoodData } = await supabase
        .from('neighborhoods')
        .select('id, name, slug')
        .eq('slug', neighborhood)
        .eq('district_id', districtData.id)
        .single();

    if (!neighborhoodData) {
        return <div>Mahalle bulunamadı</div>;
    }

    // Servis bilgisini al
    const service = ServiceList.find(service => service.slug === servicetype);

    if (!service) {
        return <div>Servis bulunamadı</div>;
    }

    const breadcrumbItems = [
        { label: "Ana Sayfa", href: "/" },
        { label: provinceData.name, href: `/${provinceData.slug}` },
        { label: districtData.name, href: `/${provinceData.slug}/${districtData.slug}` },
        { label: neighborhoodData.name, href: `/${provinceData.slug}/${districtData.slug}/${neighborhoodData.slug}` },
        { label: service.name, href: `/${provinceData.slug}/${districtData.slug}/${neighborhoodData.slug}/${service.slug}` },
        { label: "Blog", current: true }
    ];

    const pageTitle = `${provinceData.name} ${districtData.name} ${neighborhoodData.name} ${service.name} Blog Yazıları`;

    return (
        <BlogListPage
            pageTitle={pageTitle}
            breadcrumbItems={breadcrumbItems}
            province={provinceData.slug}
            district={districtData.slug}
            neighborhood={neighborhoodData.slug}
            service={service.slug}
        />
    );
}

export async function generateMetadata({ params }) {
    const data = await params;
    const { city, district, neighborhood, servicetype } = data;

    const supabase = getSupabaseServer();

    const { data: provinceData } = await supabase
        .from('provinces')
        .select('name')
        .eq('slug', city)
        .single();

    const { data: districtData } = await supabase
        .from('districts')
        .select('name')
        .eq('slug', district)
        .single();

    const { data: neighborhoodData } = await supabase
        .from('neighborhoods')
        .select('name')
        .eq('slug', neighborhood)
        .single();

    const service = ServiceList.find(service => service.slug === servicetype);

    if (!provinceData || !districtData || !neighborhoodData || !service) {
        return {
            title: 'Blog Yazıları',
            description: 'Blog yazıları'
        };
    }

    return {
        title: `${provinceData.name} ${districtData.name} ${neighborhoodData.name} ${service.name} Blog Yazıları | Çilingir Hizmetleri`,
        description: `${provinceData.name} ${districtData.name} ${neighborhoodData.name} mahallesinde ${service.name} hizmetleri ile ilgili detaylı blog yazıları ve uzman tavsiyeleri.`,
        keywords: `${provinceData.name} ${districtData.name} ${neighborhoodData.name} ${service.name}, mahalle çilingir hizmetleri, yerel çilingir blog`,
        openGraph: {
            title: `${provinceData.name} ${districtData.name} ${neighborhoodData.name} ${service.name} Blog Yazıları`,
            description: `${provinceData.name} ${districtData.name} ${neighborhoodData.name} mahallesinde ${service.name} hizmetleri ile ilgili blog yazıları.`,
            type: 'website',
            url: `/${city}/${district}/${neighborhood}/${servicetype}/blog`
        }
    };
}

export default BlogPage