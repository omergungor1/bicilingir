'use client'

import { useState, useEffect } from 'react'

// Admin sayfası dynamic rendering'e zorla
export const dynamic = 'force-dynamic'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function BlogList() {
    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [pagination, setPagination] = useState({})
    const [selectedBlogs, setSelectedBlogs] = useState([])
    const searchParams = useSearchParams()
    const router = useRouter()

    const status = searchParams.get('status') || 'all'
    const page = parseInt(searchParams.get('page') || '1')

    useEffect(() => {
        fetchBlogs()
    }, [status, page])

    const fetchBlogs = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams({ page: page.toString() })
            if (status !== 'all') params.append('status', status)

            const response = await fetch(`/api/admin/blogs?${params}`)
            const data = await response.json()

            if (response.ok) {
                setBlogs(data.blogs)
                setPagination(data.pagination)
            } else {
                console.error('Blog listesi yüklenemedi:', data.error)
            }
        } catch (error) {
            console.error('Blog listesi yüklenirken hata:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleStatusChange = async (blogId, newStatus) => {
        try {
            const response = await fetch(`/api/admin/blogs/${blogId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            })

            if (response.ok) {
                fetchBlogs() // Listeyi yenile
            } else {
                const data = await response.json()
                alert('Hata: ' + data.error)
            }
        } catch (error) {
            alert('Durum güncellenirken hata oluştu')
        }
    }

    const handleBulkStatusChange = async (newStatus) => {
        if (selectedBlogs.length === 0) return

        try {
            await Promise.all(
                selectedBlogs.map(blogId =>
                    fetch(`/api/admin/blogs/${blogId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: newStatus })
                    })
                )
            )

            setSelectedBlogs([])
            fetchBlogs()
        } catch (error) {
            alert('Toplu işlem sırasında hata oluştu')
        }
    }

    const handleDelete = async (blogId) => {
        if (!confirm('Bu blog yazısını silmek istediğinizden emin misiniz?')) return

        try {
            const response = await fetch(`/api/admin/blogs/${blogId}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                fetchBlogs()
            } else {
                const data = await response.json()
                alert('Hata: ' + data.error)
            }
        } catch (error) {
            alert('Blog silinirken hata oluştu')
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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const statusTabs = [
        { key: 'all', label: 'Tümü', count: pagination.total },
        { key: 'draft', label: 'Taslak' },
        { key: 'published', label: 'Yayınlanan' },
        { key: 'archived', label: 'Arşivlenen' }
    ]

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Başlık ve Yeni Blog Butonu */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Blog Yazıları</h1>
                <Link
                    href="/admin/blogs/new"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
                >
                    <span className="text-lg mr-2">+</span> Yeni Blog
                </Link>
            </div>

            {/* Durum Sekmeleri */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    {statusTabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => {
                                const params = new URLSearchParams()
                                if (tab.key !== 'all') params.append('status', tab.key)
                                router.push(`/admin/blogs?${params}`)
                            }}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${status === tab.key
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {tab.label}
                            {tab.count !== undefined && (
                                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Toplu İşlemler */}
            {selectedBlogs.length > 0 && (
                <div className="bg-indigo-50 p-4 rounded-md">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-indigo-700">
                            {selectedBlogs.length} blog seçildi
                        </span>
                        <div className="space-x-2">
                            <button
                                onClick={() => handleBulkStatusChange('published')}
                                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                            >
                                Yayınla
                            </button>
                            <button
                                onClick={() => handleBulkStatusChange('draft')}
                                className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
                            >
                                Taslağa Al
                            </button>
                            <button
                                onClick={() => handleBulkStatusChange('archived')}
                                className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                            >
                                Arşivle
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Blog Listesi */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                {blogs.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Henüz blog yazısı bulunmuyor.</p>
                        <Link
                            href="/admin/blogs/new"
                            className="text-indigo-600 hover:text-indigo-500 mt-2 inline-block"
                        >
                            İlk blog yazınızı oluşturun
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left">
                                        <input
                                            type="checkbox"
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedBlogs(blogs.map(b => b.id))
                                                } else {
                                                    setSelectedBlogs([])
                                                }
                                            }}
                                            checked={selectedBlogs.length === blogs.length}
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Başlık
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Durum
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Views
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tarih
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        İşlemler
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {blogs.map((blog) => (
                                    <tr key={blog.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedBlogs.includes(blog.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedBlogs([...selectedBlogs, blog.id])
                                                    } else {
                                                        setSelectedBlogs(selectedBlogs.filter(id => id !== blog.id))
                                                    }
                                                }}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                {blog.blog_images && (
                                                    <img
                                                        src={blog.blog_images.url}
                                                        alt={blog.blog_images.alt_text}
                                                        className="w-12 h-12 object-cover rounded mr-4"
                                                    />
                                                )}
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {blog.title}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {[
                                                            blog.provinces?.name,
                                                            blog.districts?.name,
                                                            blog.neighborhoods?.name,
                                                            blog.locksmiths?.fullname,
                                                            blog.services?.name
                                                        ].filter(Boolean).join(' • ') || 'Genel'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(blog.status)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {blog.views}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {formatDate(blog.created_at)}
                                        </td>
                                        <td className="px-6 py-4 text-sm space-x-2">
                                            <div className="flex items-center space-x-2">
                                                <Link
                                                    href={`/admin/blogs/${blog.id}/preview`}
                                                    className="text-blue-600 hover:text-blue-900 flex items-center"
                                                    title="Önizleme"
                                                >
                                                    👁️
                                                </Link>
                                                <Link
                                                    href={`/admin/blogs/${blog.id}/edit`}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    Düzenle
                                                </Link>
                                                <select
                                                    value={blog.status}
                                                    onChange={(e) => handleStatusChange(blog.id, e.target.value)}
                                                    className="text-xs border rounded px-2 py-1"
                                                >
                                                    <option value="draft">Taslak</option>
                                                    <option value="published">Yayınla</option>
                                                    <option value="archived">Arşivle</option>
                                                </select>
                                                <button
                                                    onClick={() => handleDelete(blog.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Sil
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Sayfalama */}
            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                        Toplam {pagination.total} sonuçtan {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} arası gösteriliyor
                    </div>
                    <div className="flex space-x-2">
                        {pagination.page > 1 && (
                            <button
                                onClick={() => {
                                    const params = new URLSearchParams(searchParams)
                                    params.set('page', (pagination.page - 1).toString())
                                    router.push(`/admin/blogs?${params}`)
                                }}
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700"
                            >
                                Önceki
                            </button>
                        )}
                        {pagination.page < pagination.totalPages && (
                            <button
                                onClick={() => {
                                    const params = new URLSearchParams(searchParams)
                                    params.set('page', (pagination.page + 1).toString())
                                    router.push(`/admin/blogs?${params}`)
                                }}
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700"
                            >
                                Sonraki
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
