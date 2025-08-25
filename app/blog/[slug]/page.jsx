import React from 'react';
import BlogDetailPage from '../../../components/blog/BlogDetailPage';
import { getSupabaseServer } from '../../../lib/supabase';

// Static generation için blog parametrelerini oluştur
export async function generateStaticParams() {
    const supabase = getSupabaseServer();

    const { data: blogs } = await supabase
        .from('blogs')
        .select('slug')
        .eq('status', 'published');

    if (!blogs) return [];

    return blogs.map((blog) => ({
        slug: blog.slug,
    }));
}

export async function generateMetadata({ params }) {
    const data = await params;
    const { slug } = data;

    const supabase = getSupabaseServer();

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

    if (!blogData) {
        return {
            title: 'Blog Yazısı Bulunamadı',
            description: 'Aradığınız blog yazısı bulunamadı.'
        };
    }

    const title = blogData.meta_title || `${blogData.title} | Çilingir Hizmetleri`;
    const description = blogData.meta_description || blogData.excerpt || blogData.title;

    return {
        title,
        description,
        keywords: blogData.meta_keywords || blogData.title,
        openGraph: {
            title,
            description,
            type: 'article',
            url: `/blog/${slug}`,
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

export default async function BlogSlugPage({ params }) {
    const data = await params;
    const { slug } = data;

    return <BlogDetailPage slug={slug} />;
}