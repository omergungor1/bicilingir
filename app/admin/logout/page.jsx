'use client'

import { useEffect } from 'react'

// Admin sayfası dynamic rendering'e zorla
export const dynamic = 'force-dynamic'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function AdminLogout() {
    const router = useRouter()
    const supabase = createClientComponentClient()

    useEffect(() => {
        const handleLogout = async () => {
            await supabase.auth.signOut()
            router.push('/admin/auth/login')
        }

        handleLogout()
    }, [router, supabase])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Çıkış yapılıyor...</p>
            </div>
        </div>
    )
}
