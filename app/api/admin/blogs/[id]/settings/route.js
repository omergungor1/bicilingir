import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// Service role client (RLS'yi bypass eder)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Blog ayarlarını güncelleme/oluşturma
export async function POST(request, { params }) {
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
            category_id,
            topic_id,
            user_description,
            seo_keywords,
            highlight_keywords,
            content_style = 'normal',
            include_list = false,
            include_table = false,
            include_faq = false,
            include_internal_links = false,
            include_cta = false,
            include_year = false,
            light_humor = false
        } = body

        // Blog var mı kontrol et
        const { data: blog } = await supabaseAdmin
            .from('blogs')
            .select('id')
            .eq('id', id)
            .single()

        if (!blog) {
            return NextResponse.json({ error: 'Blog bulunamadı' }, { status: 404 })
        }

        // Mevcut ayarları kontrol et
        const { data: existingSettings } = await supabaseAdmin
            .from('blog_settings')
            .select('id')
            .eq('blog_id', id)
            .single()

        let settings
        let error

        if (existingSettings) {
            // Güncelle
            const { data, error: updateError } = await supabaseAdmin
                .from('blog_settings')
                .update({
                    category_id,
                    topic_id,
                    user_description,
                    seo_keywords,
                    highlight_keywords,
                    content_style,
                    include_list,
                    include_table,
                    include_faq,
                    include_internal_links,
                    include_cta,
                    include_year,
                    light_humor,
                    updated_at: new Date().toISOString()
                })
                .eq('blog_id', id)
                .select()
                .single()

            settings = data
            error = updateError
        } else {
            // Yeni oluştur
            const { data, error: insertError } = await supabaseAdmin
                .from('blog_settings')
                .insert({
                    blog_id: id,
                    category_id,
                    topic_id,
                    user_description,
                    seo_keywords,
                    highlight_keywords,
                    content_style,
                    include_list,
                    include_table,
                    include_faq,
                    include_internal_links,
                    include_cta,
                    include_year,
                    light_humor
                })
                .select()
                .single()

            settings = data
            error = insertError
        }

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ settings })

    } catch (error) {
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
    }
}
