import { getSupabaseServer } from '../../../../../lib/supabase';

export async function generateMetadata({ params }) {
    const { slug, city } = await params;

    try {
        const supabase = getSupabaseServer();

        // Blog'u getir
        const { data: blogData } = await supabase
            .from('blogs')
            .select(`
                *,
                provinces (name, slug),
                districts (name, slug),
                services (name, slug)
            `)
            .eq('slug', slug)
            .eq('status', 'published')
            .single();

        if (!blogData) {
            return {
                title: 'Blog Bulunamadı',
                description: 'Aradığınız blog yazısı bulunamadı.'
            };
        }

        const locationPrefix = blogData.provinces ? `${blogData.provinces.name} ` : '';
        const title = `${locationPrefix}${blogData.title}`;

        // Canonical URL'i belirle (en spesifik URL)
        let canonicalUrl = '';
        if (blogData.provinces && blogData.districts && blogData.services) {
            canonicalUrl = `https://bicilingir.com/${blogData.provinces.slug}/${blogData.districts.slug}/${blogData.services.slug}/blog/${slug}`;
        } else if (blogData.provinces && blogData.districts) {
            canonicalUrl = `https://bicilingir.com/${blogData.provinces.slug}/${blogData.districts.slug}/blog/${slug}`;
        } else if (blogData.provinces) {
            canonicalUrl = `https://bicilingir.com/${blogData.provinces.slug}/blog/${slug}`;
        } else {
            canonicalUrl = `https://bicilingir.com/blog/${slug}`;
        }

        return {
            title: blogData.meta_title || title,
            description: blogData.meta_description || blogData.excerpt || '',
            keywords: blogData.meta_keywords || '',
            alternates: {
                canonical: canonicalUrl
            },
            openGraph: {
                title: blogData.meta_title || title,
                description: blogData.meta_description || blogData.excerpt || '',
                type: 'article',
                url: canonicalUrl,
                publishedTime: blogData.published_at,
                modifiedTime: blogData.updated_at,
                authors: ['Bi Çilingir'],
                images: blogData.blog_images ? [
                    {
                        url: blogData.blog_images.url,
                        alt: blogData.blog_images.alt_text || blogData.title
                    }
                ] : []
            },
            twitter: {
                card: 'summary_large_image',
                title: blogData.meta_title || title,
                description: blogData.meta_description || blogData.excerpt || '',
                images: blogData.blog_images ? [blogData.blog_images.url] : []
            }
        };
    } catch (error) {
        console.error('Blog metadata alınamadı:', error);
        return {
            title: 'Blog',
            description: 'Çilingir hizmetleri hakkında blog yazıları'
        };
    }
}

export default function ProvinceBlowSlugLayout({ children }) {
    return children;
}
