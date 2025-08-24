import React from 'react'

async function BlogPage({ params }) {
    const data = await params;
    console.log(data);


    return <div>City Blog Page</div>


}

export default BlogPage