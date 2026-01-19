import { permanentRedirect } from 'next/navigation';

// Eski URL yapısından (/[city]/blog) yeni URL yapısına (/blog) 301 kalıcı yönlendirme
export default async function OldCityBlogListRedirect() {
    // 301 kalıcı redirect - şehir bilgisini URL'den kaldırarak ana blog sayfasına yönlendir
    permanentRedirect('/blog');
}

// SEO için metadata - redirect olduğunu belirt
export const metadata = {
    robots: {
        index: false,
        follow: true,
    }
};
