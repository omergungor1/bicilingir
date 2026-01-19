import { permanentRedirect } from 'next/navigation';

export default async function OldAuthRegisterRedirect() {
    permanentRedirect(`/cilingir/auth/register`);
}

// SEO için metadata - redirect olduğunu belirt
export const metadata = {
    robots: {
        index: false,
        follow: true,
    }
};