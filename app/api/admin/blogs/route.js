import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// Service role client (RLS'yi bypass eder)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Blog listesi getirme
export async function GET(request) {
    try {
        const cookieStore = await cookies()
        const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status') // draft, published, archived
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const offset = (page - 1) * limit

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

        let query = supabaseAdmin
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
            .range(offset, offset + limit - 1)
            .order('created_at', { ascending: false })

        if (status) {
            query = query.eq('status', status)
        }

        const { data: blogs, error } = await query

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Toplam sayıyı al
        let countQuery = supabaseAdmin
            .from('blogs')
            .select('id', { count: 'exact', head: true })

        if (status) {
            countQuery = countQuery.eq('status', status)
        }

        const { count } = await countQuery

        return NextResponse.json({
            blogs,
            pagination: {
                page,
                limit,
                total: count,
                totalPages: Math.ceil(count / limit)
            }
        })

    } catch (error) {
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
    }
}

// Yeni blog oluşturma
export async function POST(request) {
    try {
        const cookieStore = await cookies()
        const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
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
            status = 'draft',
            meta_title,
            meta_description,
            meta_keywords,
            is_featured = false,
            reading_time = 0
        } = body

        // Slug benzersizlik kontrolü
        const { data: existingBlog } = await supabaseAdmin
            .from('blogs')
            .select('id')
            .eq('slug', slug)
            .single()

        if (existingBlog) {
            return NextResponse.json({ error: 'Bu slug zaten kullanılıyor' }, { status: 400 })
        }

        // Blog oluştur
        const { data: blog, error: blogError } = await supabaseAdmin
            .from('blogs')
            .insert({
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
                author_id: session.user.id,
                published_at: status === 'published' ? new Date().toISOString() : null
            })
            .select()
            .single()

        if (blogError) {
            return NextResponse.json({ error: blogError.message }, { status: 500 })
        }

        return NextResponse.json({ blog }, { status: 201 })

    } catch (error) {
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
    }
}