import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// Service role client (RLS'yi bypass eder)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Resim güncelleme (sadece alt_text)
export async function PUT(request, { params }) {
    try {
        const cookieStore = await cookies()
        const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
        const { id } = await params
        const body = await request.json()

        // Auth kontrolü
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
        }

        // Admin kontrolü
        const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .single()

        if (roleData?.role !== 'admin') {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 })
        }

        const { alt_text } = body

        const { data: image, error } = await supabaseAdmin
            .from('blog_images')
            .update({
                alt_text,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .eq('is_deleted', false)
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        if (!image) {
            return NextResponse.json({ error: 'Resim bulunamadı' }, { status: 404 })
        }

        return NextResponse.json({ image })

    } catch (error) {
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
    }
}

// Resim silme (soft delete)
export async function DELETE(request, { params }) {
    try {
        const cookieStore = await cookies()
        const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
        const { id } = await params

        // Auth kontrolü
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
        }

        // Admin kontrolü
        const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .single()

        if (roleData?.role !== 'admin') {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 })
        }

        // Resimin bir blogda kullanılıp kullanılmadığını kontrol et
        const { data: blogUsage } = await supabaseAdmin
            .from('blogs')
            .select('id')
            .eq('image_id', id)
            .limit(1)

        if (blogUsage && blogUsage.length > 0) {
            // Soft delete yap
            const { error } = await supabaseAdmin
                .from('blog_images')
                .update({
                    is_deleted: true,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)

            if (error) {
                return NextResponse.json({ error: error.message }, { status: 500 })
            }

            return NextResponse.json({
                message: 'Resim soft delete yapıldı (bir blogda kullanılıyor)'
            })
        } else {
            // Tam silme yap
            const { data: image } = await supabaseAdmin
                .from('blog_images')
                .select('url')
                .eq('id', id)
                .single()

            if (image) {
                // Storage'dan sil
                const urlParts = image.url.split('/')
                const fileName = urlParts[urlParts.length - 1]
                const filePath = `blog-images/${fileName}`

                await supabaseAdmin.storage.from('images').remove([filePath])
            }

            // Veritabanından sil
            const { error } = await supabaseAdmin
                .from('blog_images')
                .delete()
                .eq('id', id)

            if (error) {
                return NextResponse.json({ error: error.message }, { status: 500 })
            }

            return NextResponse.json({ message: 'Resim tamamen silindi' })
        }

    } catch (error) {
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
    }
}
