'use client'

import { useState, useEffect } from 'react'

// Admin sayfası dynamic rendering'e zorla
export const dynamic = 'force-dynamic'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import BlogDetailPage from '../../../../../components/blog/BlogDetailPage'

export default function BlogPreview() {
    const params = useParams()
    const router = useRouter()
    const [blog, setBlog] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (params.id) {
            fetchBlog()
        }
    }, [params.id])

    const fetchBlog = async () => {
        try {
            const response = await fetch(`/api/admin/blogs/${params.id}`)
            const data = await response.json()

            if (response.ok) {
                setBlog(data.blog)
            } else {
                alert('Blog yüklenemedi: ' + data.error)
                router.push('/admin/blogs')
            }
        } catch (error) {
            alert('Blog yüklenirken hata oluştu')
            router.push('/admin/blogs')
        } finally {
            setLoading(false)
        }
    }

    const getStatusBadge = (status) => {
        const badges = {
            draft: 'bg-yellow-100 text-yellow-800',
            published: 'bg-green-100 text-green-800',
            archived: 'bg-gray-100 text-gray-800'
        }
        const labels = {
            draft: 'Taslak',
            published: 'Yayınlandı',
            archived: 'Arşivlendi'
        }
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${badges[status]}`}>
                {labels[status]}
            </span>
        )
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
        )
    }

    if (!blog) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Blog bulunamadı</p>
                <Link href="/admin/blogs" className="text-indigo-600 hover:text-indigo-500 mt-2 inline-block">
                    Blog listesine dön
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Admin Önizleme Bar */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-indigo-600 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/admin/blogs"
                                className="text-indigo-100 hover:text-white flex items-center"
                            >
                                ← Admin Panel
                            </Link>
                            <div className="text-sm">
                                <span className="font-medium">Önizleme:</span> {blog.title}
                            </div>
                            {getStatusBadge(blog.status)}
                        </div>
                        <div className="flex items-center space-x-3">
                            <Link
                                href={`/admin/blogs/${blog.id}/edit`}
                                className="bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-gray-50 text-sm font-medium"
                            >
                                Düzenle
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gerçek Blog Görünümü */}
            <div className="pt-16">
                <BlogDetailPage
                    blogData={blog}
                    isPreview={true}
                />
            </div>
        </div>
    )
}
