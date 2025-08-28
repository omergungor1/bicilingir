'use client'

import { useState, useEffect } from 'react'

// Admin sayfası dynamic rendering'e zorla
export const dynamic = 'force-dynamic'

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalBlogs: 0,
        draftBlogs: 0,
        publishedBlogs: 0,
        archivedBlogs: 0,
        totalImages: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            const responses = await Promise.all([
                fetch('/api/admin/blogs'),
                fetch('/api/admin/blogs?status=draft'),
                fetch('/api/admin/blogs?status=published'),
                fetch('/api/admin/blogs?status=archived'),
                fetch('/api/admin/images')
            ])

            const [blogData, draftData, publishedData, archivedData, imageData] = await Promise.all(
                responses.map(r => r.json())
            )

            setStats({
                totalBlogs: blogData.pagination?.total || 0,
                draftBlogs: draftData.pagination?.total || 0,
                publishedBlogs: publishedData.pagination?.total || 0,
                archivedBlogs: archivedData.pagination?.total || 0,
                totalImages: imageData.pagination?.total || 0
            })
        } catch (error) {
            console.error('İstatistikler yüklenirken hata:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Blog yönetim paneline hoş geldiniz</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">📊</div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Toplam Blog</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.totalBlogs}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">📄</div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Draft</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.draftBlogs}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">🌐</div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Yayınlanan</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.publishedBlogs}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">📦</div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Arşivlenen</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.archivedBlogs}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">🖼️</div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Resimler</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.totalImages}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
