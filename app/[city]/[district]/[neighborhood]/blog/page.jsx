import React from 'react'
import { ServiceList } from '../../../../../lib/service-list'
import BlogListPage from '../../../../../components/blog/BlogListPage'
// import { createServerClient } from '../../../../api/utils'
import { getSupabaseServer } from '../../../../../lib/supabase';

async function BlogPage({ params }) {
    const data = await params;
    const { city, district, neighborhood } = data;

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

    const isService = ServiceList.some(service => service.slug === neighborhood);

    if (isService) {
        // Bu bir servis sayfası - İlçe + Servis blog sayfası
        const service = ServiceList.find(service => service.slug === neighborhood);

        const breadcrumbItems = [
            { label: "Ana Sayfa", href: "/" },
            { label: provinceData.name, href: `/${provinceData.slug}` },
            { label: districtData.name, href: `/${provinceData.slug}/${districtData.slug}` },
            { label: service.name, href: `/${provinceData.slug}/${districtData.slug}/${service.slug}` },
            { label: "Blog", current: true }
        ];

        const pageTitle = `${provinceData.name} ${districtData.name} ${service.name} Blog Yazıları`;

        return (
            <BlogListPage
                pageTitle={pageTitle}
                breadcrumbItems={breadcrumbItems}
                province={provinceData.slug}
                district={districtData.slug}
                service={service.slug}
            />
        );
    } else {
        // Bu bir mahalle sayfası
        const { data: neighborhoodData } = await supabase
            .from('neighborhoods')
            .select('id, name, slug')
            .eq('slug', neighborhood)
            .eq('district_id', districtData.id)
            .single();

        if (!neighborhoodData) {
            return <div>Mahalle bulunamadı</div>;
        }

        const breadcrumbItems = [
            { label: "Ana Sayfa", href: "/" },
            { label: provinceData.name, href: `/${provinceData.slug}` },
            { label: districtData.name, href: `/${provinceData.slug}/${districtData.slug}` },
            { label: neighborhoodData.name, href: `/${provinceData.slug}/${districtData.slug}/${neighborhoodData.slug}` },
            { label: "Blog", current: true }
        ];

        const pageTitle = `${provinceData.name} ${districtData.name} ${neighborhoodData.name} Blog Yazıları`;

        return (
            <BlogListPage
                pageTitle={pageTitle}
                breadcrumbItems={breadcrumbItems}
                province={provinceData.slug}
                district={districtData.slug}
                neighborhood={neighborhoodData.slug}
            />
        );
    }
}

export async function generateMetadata({ params }) {
    const data = await params;
    const { city, district, neighborhood } = data;

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

    if (!provinceData || !districtData) {
        return {
            title: 'Blog Yazıları',
            description: 'Blog yazıları'
        };
    }

    const isService = ServiceList.some(service => service.slug === neighborhood);

    if (isService) {
        const service = ServiceList.find(service => service.slug === neighborhood);
        return {
            title: `${provinceData.name} ${districtData.name} ${service.name} Blog Yazıları | Çilingir Hizmetleri`,
            description: `${provinceData.name} ${districtData.name} bölgesinde ${service.name} hizmetleri ile ilgili faydalı blog yazıları.`,
            keywords: `${provinceData.name} ${districtData.name} ${service.name}, çilingir blog, bölgesel hizmetler`,
            openGraph: {
                title: `${provinceData.name} ${districtData.name} ${service.name} Blog Yazıları`,
                description: `${provinceData.name} ${districtData.name} bölgesinde ${service.name} hizmetleri ile ilgili blog yazıları.`,
                type: 'website',
                url: `/${city}/${district}/${neighborhood}/blog`
            }
        };
    } else {
        const { data: neighborhoodData } = await supabase
            .from('neighborhoods')
            .select('name')
            .eq('slug', neighborhood)
            .single();

        const neighborhoodName = neighborhoodData?.name || neighborhood;

        return {
            title: `${provinceData.name} ${districtData.name} ${neighborhoodName} Blog Yazıları | Çilingir Hizmetleri`,
            description: `${provinceData.name} ${districtData.name} ${neighborhoodName} mahallesi için çilingirlik hizmetleri hakkında blog yazıları.`,
            keywords: `${provinceData.name} ${districtData.name} ${neighborhoodName} çilingir, mahalle çilingir hizmetleri`,
            openGraph: {
                title: `${provinceData.name} ${districtData.name} ${neighborhoodName} Blog Yazıları`,
                description: `${provinceData.name} ${districtData.name} ${neighborhoodName} mahallesi için çilingirlik hizmetleri hakkında blog yazıları.`,
                type: 'website',
                url: `/${city}/${district}/${neighborhood}/blog`
            }
        };
    }
}

export default BlogPage