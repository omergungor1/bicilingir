import { permanentRedirect } from 'next/navigation';

export default async function NeighborhoodPage({ params }) {
    const resolvedParams = await params;
    const { city: citySlug, district: districtSlug } = resolvedParams;

    permanentRedirect(`/${citySlug}/${districtSlug}`);
}
