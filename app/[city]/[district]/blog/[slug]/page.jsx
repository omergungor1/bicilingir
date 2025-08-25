import React from 'react'
import { ServiceList } from '../../../../../lib/service-list'
import BlogDetailPage from '../../../../../components/blog/BlogDetailPage'
import { getSupabaseServer } from '../../../../../lib/supabase'

// Static generation için parametreleri oluştur
export async function generateStaticParams() {
    const supabase = getSupabaseServer();

    const { data: blogs } = await supabase
        .from('blogs')
        .select(`
            slug,
            provinces (slug),
            districts (slug),
            services (slug)
        `)
        .eq('status', 'published')
        .not('provinces', 'is', null);

    if (!blogs) return [];

    const params = [];

    blogs.forEach((blog) => {
        // İlçe bazlı blog
        if (blog.provinces?.slug && blog.districts?.slug) {
            params.push({
                city: blog.provinces.slug,
                district: blog.districts.slug,
                slug: blog.slug,
            });
        }

        // İl + Servis bazlı blog
        if (blog.provinces?.slug && blog.services?.slug) {
            params.push({
                city: blog.provinces.slug,
                district: blog.services.slug,
                slug: blog.slug,
            });
        }
    });

    return params;
}

async function DistrictBlogSlugPage({ params }) {
    const data = await params;
    const { city, district, slug } = data;

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
        // Bu bir servis sayfası - İl + Servis blog detayı
        const service = ServiceList.find(service => service.slug === district);

        return (
            <BlogDetailPage
                slug={slug}
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

        return (
            <BlogDetailPage
                slug={slug}
                province={provinceData.slug}
                district={districtData.slug}
            />
        );
    }
}

export async function generateMetadata({ params }) {
    const data = await params;
    const { city, district, slug } = data;

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

    if (!blogData || !provinceData) {
        return {
            title: 'Blog Yazısı Bulunamadı',
            description: 'Aradığınız blog yazısı bulunamadı.'
        };
    }

    const isService = ServiceList.some(service => service.slug === district);
    let locationText = provinceData.name;

    if (isService) {
        const service = ServiceList.find(service => service.slug === district);
        locationText += ` ${service.name}`;
    } else {
        const { data: districtData } = await supabase
            .from('districts')
            .select('name')
            .eq('slug', district)
            .single();

        if (districtData) {
            locationText += ` ${districtData.name}`;
        }
    }

    const title = blogData.meta_title || `${blogData.title} | ${locationText} Çilingir Hizmetleri`;
    const description = blogData.meta_description || blogData.excerpt || `${locationText} için ${blogData.title}`;

    return {
        title,
        description,
        keywords: blogData.meta_keywords || `${locationText} çilingir, ${blogData.title}`,
        openGraph: {
            title,
            description,
            type: 'article',
            url: `/${city}/${district}/blog/${slug}`,
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

export default DistrictBlogSlugPage
