import { getSupabaseServer } from '../../../../lib/supabase';

export async function generateMetadata({ params }) {
    const { city } = await params;

    try {
        const supabase = getSupabaseServer();
        const { data: provinceData, error } = await supabase
            .from('provinces')
            .select('name, slug')
            .eq('slug', city)
            .single();

        if (error || !provinceData) {
            return {
                title: 'Blog | BiÇilingir',
                description: 'Çilingir hizmetleri ve güvenlik konularında güncel blog yazıları'
            };
        }

        const title = `${provinceData.name} Blog Yazıları | BiÇilingir`;
        const description = `${provinceData.name} ile ilgili çilingir hizmetleri ve güvenlik konularında güncel blog yazıları. Kapı açma, anahtar yapımı ve güvenlik sistemleri hakkında uzman görüşleri.`;
        const canonicalUrl = `https://bicilingir.com/${provinceData.slug}/blog`;

        return {
            title,
            description,
            keywords: `${provinceData.name} çilingir, blog, güvenlik, anahtar, kapı açma`,
            alternates: {
                canonical: canonicalUrl
            },
            openGraph: {
                title,
                description,
                url: canonicalUrl,
                type: 'website',
                siteName: 'BiÇilingir',
                locale: 'tr_TR',
            },
            twitter: {
                card: 'summary_large_image',
                title,
                description,
            }
        };
    } catch (error) {
        console.error('Province metadata oluşturulamadı:', error);
        return {
            title: 'Blog | BiÇilingir',
            description: 'Çilingir hizmetleri ve güvenlik konularında güncel blog yazıları'
        };
    }
}

export default function ProvinceBlogLayout({ children }) {
    return children;
}
