'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'

export default function AdminLayout({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const router = useRouter()
    const pathname = usePathname()
    const supabase = createClientComponentClient()

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()

            if (!session) {
                router.push('/admin/auth/login')
                return
            }

            // Admin kontrolü
            const { data: roleData } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', session.user.id)
                .single()

            if (roleData?.role !== 'admin') {
                router.push('/admin/auth/login')
                return
            }

            setUser(session.user)
            setLoading(false)
        }

        checkUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (event === 'SIGNED_OUT' || !session) {
                    router.push('/admin/auth/login')
                }
            }
        )

        return () => subscription.unsubscribe()
    }, [router, supabase])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/admin/auth/login')
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Yükleniyor...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return null
    }

    const navigation = [
        { name: 'Dashboard', href: '/admin', icon: '🏠' },
        { name: 'Blog Listesi', href: '/admin/blogs', icon: '📝' },
        { name: 'Yeni Blog', href: '/admin/blogs/new', icon: '➕' },
        { name: 'Resim Kütüphanesi', href: '/admin/images', icon: '🖼️' },
        { name: 'Draft Bloglar', href: '/admin/blogs?status=draft', icon: '📄' },
        { name: 'Yayınlanan', href: '/admin/blogs?status=published', icon: '🌐' },
        { name: 'Arşivlenen', href: '/admin/blogs?status=archived', icon: '📦' },
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
                    <div className="fixed inset-y-0 left-0 flex w-full max-w-xs flex-col bg-white shadow-xl">
                        <div className="flex h-16 items-center justify-between px-4">
                            <h1 className="text-xl font-bold text-gray-900">Biçilingir Admin</h1>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>
                        <nav className="flex-1 space-y-1 px-4 py-4">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${pathname === item.href
                                        ? 'bg-indigo-100 text-indigo-700'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <span className="mr-3">{item.icon}</span>
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            )}

            {/* Desktop sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
                    <div className="flex h-16 items-center px-4 border-b border-gray-200">
                        <h1 className="text-xl font-bold text-gray-900">Biçilingir Admin</h1>
                    </div>
                    <nav className="flex-1 space-y-1 px-4 py-4">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${pathname === item.href
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <span className="mr-3">{item.icon}</span>
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                    <div className="border-t border-gray-200 p-4">
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">Admin</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="text-gray-400 hover:text-gray-600"
                                title="Çıkış Yap"
                            >
                                🚪
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top bar */}
                <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
                    <div className="flex h-16 items-center justify-between px-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="text-gray-500 hover:text-gray-700 lg:hidden"
                        >
                            ☰
                        </button>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-500">Admin Panel</span>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <main className="py-6">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
