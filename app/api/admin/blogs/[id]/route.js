import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// Service role client (RLS'yi bypass eder)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Tek blog getirme
export async function GET(request, { params }) {
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

        const { data: blog, error } = await supabaseAdmin
            .from('blogs')
            .select(`
                *,
                blog_images (
                    id,
                    url,
                    alt_text
                ),
                provinces (
                    id,
                    name
                ),
                districts (
                    id,
                    name
                ),
                neighborhoods (
                    id,
                    name
                ),
                services (
                    id,
                    name
                ),
                locksmiths (
                    id,
                    fullname
                ),
                blog_categories (
                    id,
                    name
                ),
                blog_topics (
                    id,
                    name
                )
            `)
            .eq('id', id)
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        if (!blog) {
            return NextResponse.json({ error: 'Blog bulunamadı' }, { status: 404 })
        }

        // Blog ayarlarını da getir
        const { data: settings } = await supabaseAdmin
            .from('blog_settings')
            .select('*')
            .eq('blog_id', id)
            .single()

        return NextResponse.json({ blog, settings })

    } catch (error) {
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
    }
}

// Blog güncelleme
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

        const {
            title,
            slug,
            content,
            result,
            excerpt,
            image_id,
            province_id,
            district_id,
            neighborhood_id,
            service_id,
            locksmith_id,
            category_id,
            topic_id,
            status,
            meta_title,
            meta_description,
            meta_keywords,
            is_featured,
            reading_time
        } = body

        // Mevcut blog kontrolü
        const { data: existingBlog } = await supabaseAdmin
            .from('blogs')
            .select('*')
            .eq('id', id)
            .single()

        if (!existingBlog) {
            return NextResponse.json({ error: 'Blog bulunamadı' }, { status: 404 })
        }

        // Slug benzersizlik kontrolü (kendi ID'si hariç)
        if (slug && slug !== existingBlog.slug) {
            const { data: slugCheck } = await supabaseAdmin
                .from('blogs')
                .select('id')
                .eq('slug', slug)
                .neq('id', id)
                .single()

            if (slugCheck) {
                return NextResponse.json({ error: 'Bu slug zaten kullanılıyor' }, { status: 400 })
            }
        }

        const updateData = {
            title,
            slug,
            content,
            result,
            excerpt,
            image_id,
            province_id,
            district_id,
            neighborhood_id,
            service_id,
            locksmith_id,
            category_id,
            topic_id,
            status,
            meta_title,
            meta_description,
            meta_keywords,
            is_featured,
            reading_time,
            updated_at: new Date().toISOString()
        }

        // Eğer status published olarak değişiyorsa published_at'i güncelle
        if (status === 'published' && existingBlog.status !== 'published') {
            updateData.published_at = new Date().toISOString()
        }

        const { data: blog, error } = await supabaseAdmin
            .from('blogs')
            .update(updateData)
            .eq('id', id)
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ blog })

    } catch (error) {
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
    }
}

// Blog silme
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

        const { error } = await supabaseAdmin
            .from('blogs')
            .delete()
            .eq('id', id)

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ message: 'Blog başarıyla silindi' })

    } catch (error) {
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
    }
}