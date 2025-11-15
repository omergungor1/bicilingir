import React from 'react'
import BlogDetailPage from '../../../../components/blog/BlogDetailPage'
import { getSupabaseServer } from '../../../../lib/supabase'

// Static generation için parametreleri oluştur
export async function generateStaticParams() {
    const supabase = getSupabaseServer();

    const { data: blogs } = await supabase
        .from('blogs')
        .select(`
            slug,
            provinces (slug)
        `)
        .eq('status', 'published')
        .not('provinces', 'is', null);

    if (!blogs) return [];

    return blogs.map((blog) => ({
        city: blog.provinces.slug,
        slug: blog.slug,
    }));
}

async function CityBlogSlugPage({ params }) {
    const data = await params;
    const { city, slug } = data;

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

    return (
        <BlogDetailPage
            slug={slug}
            province={provinceData.slug}
        />
    );
}

export async function generateMetadata({ params }) {
    const data = await params;
    const { city, slug } = data;

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

    const title = blogData.meta_title || `${blogData.title} | ${provinceData.name} Çilingir Hizmetleri`;
    const description = blogData.meta_description || blogData.excerpt || `${provinceData.name} için ${blogData.title}`;

    return {
        title,
        description,
        keywords: blogData.meta_keywords || `${provinceData.name} çilingir, ${blogData.title}`,
        openGraph: {
            title,
            description,
            type: 'article',
            url: `/${city}/blog/${slug}`,
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

export default CityBlogSlugPage
