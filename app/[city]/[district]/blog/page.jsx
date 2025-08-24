import React from 'react'
import { ServiceList } from '../../../../lib/service-list'

async function BlogPage({ params }) {
    const data = await params;
    console.log(data);

    const isService = ServiceList.some(service => service.slug === data.district);

    if (isService) {
        return <div>City Service Blog Page</div>
    } else {
        return <div>District Blog Page</div>
    }

}

export default BlogPage