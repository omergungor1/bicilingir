import React from 'react'
import { ServiceList } from '../../../../lib/service-list'
import BlogListServerPage from '../../../../components/blog/BlogListServerPage'
// import { createServerClient } from '../../../api/utils'
import { getSupabaseServer } from '../../../../lib/supabase';

// Static generation için parametreleri oluştur
export async function generateStaticParams() {
    const supabase = getSupabaseServer();

    // İlçe kombinasyonları
    const { data: districts } = await supabase
        .from('districts')
        .select(`
            slug,
            provinces (slug)
        `)
        .order('name');

    const params = [];

    if (districts) {
        districts.forEach((district) => {
            if (district.provinces?.slug) {
                params.push({
                    city: district.provinces.slug,
                    district: district.slug,
                });
            }
        });
    }

    // Servis kombinasyonları (il + servis)
    const { data: provinces } = await supabase
        .from('provinces')
        .select('slug')
        .order('name');

    if (provinces) {
        provinces.forEach((province) => {
            ServiceList.forEach((service) => {
                params.push({
                    city: province.slug,
                    district: service.slug,
                });
            });
        });
    }

    return params;
}

async function BlogPage({ params }) {
    const data = await params;
    const { city, district } = data;

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

    const isService = ServiceList.some(service => service.slug === district);

    if (isService) {
        // Bu bir servis sayfası - İl + Servis blog sayfası
        const service = ServiceList.find(service => service.slug === district);

        const breadcrumbItems = [
            { label: "Ana Sayfa", href: "/" },
            { label: provinceData.name, href: `/${provinceData.slug}` },
            { label: service.name, href: `/${provinceData.slug}/${service.slug}` },
            { label: "Blog", current: true }
        ];

        const pageTitle = `${provinceData.name} ${service.name} Blog Yazıları`;

        return (
            <BlogListServerPage
                pageTitle={pageTitle}
                breadcrumbItems={breadcrumbItems}
                province={provinceData.slug}
                service={service.slug}
            />
        );
    } else {
        // Bu bir ilçe sayfası
        const { data: districtData } = await supabase
            .from('districts')
            .select('id, name, slug')
            .eq('slug', district)
            .eq('province_id', provinceData.id)
            .single();

        if (!districtData) {
            return <div>İlçe bulunamadı</div>;
        }

        const breadcrumbItems = [
            { label: "Ana Sayfa", href: "/" },
            { label: provinceData.name, href: `/${provinceData.slug}` },
            { label: districtData.name, href: `/${provinceData.slug}/${districtData.slug}` },
            { label: "Blog", current: true }
        ];

        const pageTitle = `${provinceData.name} ${districtData.name} Blog Yazıları`;

        return (
            <BlogListServerPage
                pageTitle={pageTitle}
                breadcrumbItems={breadcrumbItems}
                province={provinceData.slug}
                district={districtData.slug}
            />
        );
    }
}

export async function generateMetadata({ params }) {
    const data = await params;
    const { city, district } = data;

    const supabase = getSupabaseServer();

    const { data: provinceData } = await supabase
        .from('provinces')
        .select('name')
        .eq('slug', city)
        .single();

    if (!provinceData) {
        return {
            title: 'Blog Yazıları',
            description: 'Blog yazıları'
        };
    }

    const isService = ServiceList.some(service => service.slug === district);

    if (isService) {
        const service = ServiceList.find(service => service.slug === district);
        return {
            title: `${provinceData.name} ${service.name} Blog Yazıları | Çilingir Hizmetleri`,
            description: `${provinceData.name} ${service.name} hizmetleri ile ilgili faydalı blog yazıları ve uzman tavsiyeleri.`,
            keywords: `${provinceData.name} ${service.name}, çilingir blog, ${service.name} hizmetleri`,
            openGraph: {
                title: `${provinceData.name} ${service.name} Blog Yazıları`,
                description: `${provinceData.name} ${service.name} hizmetleri ile ilgili faydalı blog yazıları.`,
                type: 'website',
                url: `/${city}/${district}/blog`
            }
        };
    } else {
        const { data: districtData } = await supabase
            .from('districts')
            .select('name')
            .eq('slug', district)
            .single();

        const districtName = districtData?.name || district;

        return {
            title: `${provinceData.name} ${districtName} Blog Yazıları | Çilingir Hizmetleri`,
            description: `${provinceData.name} ${districtName} bölgesi için çilingirlik hizmetleri ve güvenlik sistemleri hakkında blog yazıları.`,
            keywords: `${provinceData.name} ${districtName} çilingir, bölgesel çilingir hizmetleri, güvenlik sistemleri`,
            openGraph: {
                title: `${provinceData.name} ${districtName} Blog Yazıları`,
                description: `${provinceData.name} ${districtName} bölgesi için çilingirlik hizmetleri hakkında blog yazıları.`,
                type: 'website',
                url: `/${city}/${district}/blog`
            }
        };
    }
}

export default BlogPage