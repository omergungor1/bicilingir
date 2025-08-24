import { getSupabaseServer } from '../../../lib/supabase';
import { notFound } from 'next/navigation';

// SEO metadata'sını oluştur
export async function generateMetadata({ params }) {
    const { slug } = await params;

    try {
        const supabase = getSupabaseServer();

        const { data: blog, error } = await supabase
            .from('blogs')
            .select(`
        title,
        excerpt,
        meta_title,
        meta_description,
        meta_keywords,
        published_at,
        blog_images (
          url,
          alt_text
        ),
        provinces (
          name
        ),
        districts (
          name
        ),
        services (
          name
        )
      `)
            .eq('slug', slug)
            .eq('status', 'published')
            .single();

        if (error || !blog) {
            return {
                title: 'Blog Bulunamadı | BiÇilingir',
                description: 'Aradığınız blog yazısı bulunamadı.'
            };
        }

        // Lokasyon bilgilerini oluştur
        const locationParts = [];
        if (blog.districts?.name) locationParts.push(blog.districts.name);
        if (blog.provinces?.name) locationParts.push(blog.provinces.name);
        const location = locationParts.join(', ');

        // SEO title oluştur
        const seoTitle = blog.meta_title || blog.title;
        const fullTitle = location
            ? `${seoTitle} | ${location} | BiÇilingir`
            : `${seoTitle} | BiÇilingir`;

        // SEO description oluştur
        const seoDescription = blog.meta_description || blog.excerpt || blog.title;

        // Keywords oluştur
        const keywords = [];
        if (blog.meta_keywords) {
            keywords.push(blog.meta_keywords);
        }
        if (blog.services?.name) {
            keywords.push(blog.services.name);
        }
        if (location) {
            keywords.push(location);
            keywords.push('çilingir');
        }

        // Open Graph image
        const ogImage = blog.blog_images?.url || '/images/infocard.png';

        // Canonical URL'i belirle (en spesifik URL)
        let canonicalUrl = '';
        if (blog.provinces && blog.districts && blog.services) {
            canonicalUrl = `https://bicilingir.com/${blog.provinces.slug}/${blog.districts.slug}/${blog.services.slug}/blog/${slug}`;
        } else if (blog.provinces && blog.districts) {
            canonicalUrl = `https://bicilingir.com/${blog.provinces.slug}/${blog.districts.slug}/blog/${slug}`;
        } else if (blog.provinces) {
            canonicalUrl = `https://bicilingir.com/${blog.provinces.slug}/blog/${slug}`;
        } else {
            canonicalUrl = `https://bicilingir.com/blog/${slug}`;
        }

        return {
            title: fullTitle,
            description: seoDescription,
            keywords: keywords.join(', '),
            authors: [{ name: 'BiÇilingir' }],
            creator: 'BiÇilingir',
            publisher: 'BiÇilingir',
            formatDetection: {
                email: false,
                address: false,
                telephone: false,
            },
            alternates: {
                canonical: canonicalUrl
            },
            openGraph: {
                title: fullTitle,
                description: seoDescription,
                url: canonicalUrl,
                siteName: 'BiÇilingir',
                images: [
                    {
                        url: ogImage,
                        width: 1200,
                        height: 630,
                        alt: blog.blog_images?.alt_text || blog.title,
                    }
                ],
                locale: 'tr_TR',
                type: 'article',
                publishedTime: blog.published_at,
            },
            twitter: {
                card: 'summary_large_image',
                title: fullTitle,
                description: seoDescription,
                images: [ogImage],
                creator: '@bicilingir',
            },
            robots: {
                index: true,
                follow: true,
                googleBot: {
                    index: true,
                    follow: true,
                    'max-video-preview': -1,
                    'max-image-preview': 'large',
                    'max-snippet': -1,
                },
            },
            alternates: {
                canonical: `https://bicilingir.com/blog/${slug}`,
            },
        };
    } catch (error) {
        console.error('Blog metadata alınamadı:', error);
        return {
            title: 'Blog | BiÇilingir',
            description: 'Çilingircilik hakkında bilgilendirici yazılar ve ipuçları'
        };
    }
}

// Statik parametreleri oluştur (isteğe bağlı)
export async function generateStaticParams() {
    try {
        const supabase = getSupabaseServer();

        const { data: blogs, error } = await supabase
            .from('blogs')
            .select('slug')
            .eq('status', 'published')
            .limit(100); // İlk 100 blog için statik sayfa oluştur

        if (error || !blogs) {
            return [];
        }

        return blogs.map((blog) => ({
            slug: blog.slug,
        }));
    } catch (error) {
        console.error('Blog parametreleri alınamadı:', error);
        return [];
    }
}

export default function BlogDetailLayout({ children }) {
    return children;
}
