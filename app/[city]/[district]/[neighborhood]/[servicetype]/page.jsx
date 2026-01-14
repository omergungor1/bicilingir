import { permanentRedirect } from 'next/navigation';

export default async function NeighborhoodServicePage({ params }) {
    const resolvedParams = await params;
    const { city, district } = resolvedParams;

    permanentRedirect(`/${city}/${district}`);
} 
