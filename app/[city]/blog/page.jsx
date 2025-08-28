import React from 'react'
import BlogListPage from '../../../components/blog/BlogListPage'
// import { createServerClient } from '../../api/utils'
import { getSupabaseServer } from '../../../lib/supabase';

// Static generation için şehir parametrelerini oluştur
export async function generateStaticParams() {
    const supabase = getSupabaseServer();

    const { data: provinces } = await supabase
        .from('provinces')
        .select('slug')
        .order('name');

    if (!provinces) return [];

    return provinces.map((province) => ({
        city: province.slug,
    }));
}

async function BlogPage({ params }) {
    const data = await params;
    const { city } = data;

    // İl bilgisini al
    const supabase = getSupabaseServer();
    const { data: provinceData } = await supabase
        .from('provinces')
        .select('id, name, slug')
        .eq('slug', city)
        .single();

    if (!provinceData) {
        return <div>İl bulunamadı</div>;
    }

    const breadcrumbItems = [
        { label: "Ana Sayfa", href: "/" },
        { label: provinceData.name, href: `/${provinceData.slug}` },
        { label: "Blog", current: true }
    ];

    const pageTitle = `${provinceData.name} Blog Yazıları`;

    return (
        <BlogListPage
            pageTitle={pageTitle}
            breadcrumbItems={breadcrumbItems}
            province={provinceData.slug}
        />
    );
}

export async function generateMetadata({ params }) {
    const data = await params;
    const { city } = data;

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

    return {
        title: `${provinceData.name} Blog Yazıları | Çilingir Hizmetleri`,
        description: `${provinceData.name} ili için çilingirlik hizmetleri, güvenlik sistemleri ve kapı kilidi konularında faydalı blog yazıları.`,
        keywords: `${provinceData.name} çilingir, ${provinceData.name} blog, çilingir hizmetleri, güvenlik sistemleri`,
        openGraph: {
            title: `${provinceData.name} Blog Yazıları | Çilingir Hizmetleri`,
            description: `${provinceData.name} ili için çilingirlik hizmetleri, güvenlik sistemleri ve kapı kilidi konularında faydalı blog yazıları.`,
            type: 'website',
            url: `/${city}/blog`
        }
    };
}

export default BlogPage