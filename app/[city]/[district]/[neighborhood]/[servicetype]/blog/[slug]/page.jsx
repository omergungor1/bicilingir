import React from 'react'
import { ServiceList } from '../../../../../../../lib/service-list'
import BlogDetailPage from '../../../../../../../components/blog/BlogDetailPage'
import { getSupabaseServer } from '../../../../../../../lib/supabase'

// Static generation için parametreleri oluştur
export async function generateStaticParams() {
    const supabase = getSupabaseServer();

    const { data: blogs } = await supabase
        .from('blogs')
        .select(`
            slug,
            provinces (slug),
            districts (slug),
            neighborhoods (slug),
            services (slug)
        `)
        .eq('status', 'published')
        .not('provinces', 'is', null)
        .not('districts', 'is', null)
        .not('neighborhoods', 'is', null)
        .not('services', 'is', null);

    if (!blogs) return [];

    return blogs.map((blog) => ({
        city: blog.provinces.slug,
        district: blog.districts.slug,
        neighborhood: blog.neighborhoods.slug,
        servicetype: blog.services.slug,
        slug: blog.slug,
    }));
}

async function ServiceTypeBlogSlugPage({ params }) {
    const data = await params;
    const { city, district, neighborhood, servicetype, slug } = data;

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

    return (
        <BlogDetailPage
            slug={slug}
            province={provinceData.slug}
            district={districtData.slug}
            neighborhood={neighborhoodData.slug}
            service={service.slug}
        />
    );
}

export async function generateMetadata({ params }) {
    const data = await params;
    const { city, district, neighborhood, servicetype, slug } = data;

    const supabase = getSupabaseServer();

    // Blog detayını al
    const { data: blogData } = await supabase
        .from('blogs')
        .select(`
            *,
            provinces (name, slug),
            districts (name, slug),
            neighborhoods (name, slug),
            services (name, slug)
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

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

    if (!blogData || !provinceData || !districtData || !neighborhoodData || !service) {
        return {
            title: 'Blog Yazısı Bulunamadı',
            description: 'Aradığınız blog yazısı bulunamadı.'
        };
    }

    const locationText = `${provinceData.name} ${districtData.name} ${neighborhoodData.name} ${service.name}`;
    const title = blogData.meta_title || `${blogData.title} | ${locationText} Hizmetleri`;
    const description = blogData.meta_description || blogData.excerpt || `${locationText} için ${blogData.title}`;

    return {
        title,
        description,
        keywords: blogData.meta_keywords || `${locationText}, ${blogData.title}`,
        openGraph: {
            title,
            description,
            type: 'article',
            url: `/${city}/${district}/${neighborhood}/${servicetype}/blog/${slug}`,
            publishedTime: blogData.published_at,
            images: blogData.blog_images ? [{
                url: blogData.blog_images.url,
                alt: blogData.blog_images.alt_text || blogData.title
            }] : []
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: blogData.blog_images ? [blogData.blog_images.url] : []
        }
    };
}

export default ServiceTypeBlogSlugPage
