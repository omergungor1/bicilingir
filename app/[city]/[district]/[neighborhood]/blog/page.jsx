import React from 'react'
import { ServiceList } from '../../../../../lib/service-list'

async function BlogPage({ params }) {
    const data = await params;
    console.log(data);

    const isService = ServiceList.some(service => service.slug === data.neighborhood);

    if (isService) {
        return <div>District Service Blog Page</div>
    } else {
        return <div>Neighborhood Blog Page</div>
    }

}

export default BlogPage