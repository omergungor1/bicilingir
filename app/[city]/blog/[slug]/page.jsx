import { permanentRedirect } from 'next/navigation';

// Eski URL yapısından (/[city]/blog/[slug]) yeni URL yapısına (/blog/[slug]) 301 kalıcı yönlendirme
export default async function OldCityBlogRedirect({ params }) {
    const { slug } = await params;
    
    // 301 kalıcı redirect - şehir bilgisini URL'den kaldırarak yeni blog adresine yönlendir
    permanentRedirect(`/blog/${slug}`);
}

// SEO için metadata - redirect olduğunu belirt
export const metadata = {
    robots: {
        index: false,
        follow: true,
    }
};
