import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// Service role client (RLS'yi bypass eder)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Resim listesi getirme
export async function GET(request) {
    try {
        const cookieStore = await cookies()
        const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
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

        const { data: images, error } = await supabaseAdmin
            .from('blog_images')
            .select('*')
            .eq('is_deleted', false)
            .range(offset, offset + limit - 1)
            .order('created_at', { ascending: false })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Toplam sayıyı al
        const { count } = await supabaseAdmin
            .from('blog_images')
            .select('id', { count: 'exact', head: true })
            .eq('is_deleted', false)

        return NextResponse.json({
            images,
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

// Yeni resim yükleme
export async function POST(request) {
    try {
        const cookieStore = await cookies()
        const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
        const formData = await request.formData()
        const file = formData.get('file')
        const altText = formData.get('alt_text') || ''

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

        if (!file) {
            return NextResponse.json({ error: 'Dosya seçilmedi' }, { status: 400 })
        }

        // Dosya türü kontrolü
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: 'Desteklenmeyen dosya türü' }, { status: 400 })
        }

        // Dosya boyutu kontrolü (5MB)
        const maxSize = 5 * 1024 * 1024
        if (file.size > maxSize) {
            return NextResponse.json({ error: 'Dosya boyutu çok büyük (max 5MB)' }, { status: 400 })
        }

        // Benzersiz dosya adı oluştur
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`
        const filePath = `blog-images/${fileName}`

        // Supabase Storage'a yükle
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
            .from('images')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            })

        if (uploadError) {
            return NextResponse.json({ error: 'Dosya yükleme hatası: ' + uploadError.message }, { status: 500 })
        }

        // Public URL al
        const { data: { publicUrl } } = supabaseAdmin.storage
            .from('images')
            .getPublicUrl(filePath)

        // Resim boyutlarını al (basit bir yaklaşım)
        const arrayBuffer = await file.arrayBuffer()
        let width = null
        let height = null

        // Veritabanına kaydet
        const { data: image, error: dbError } = await supabaseAdmin
            .from('blog_images')
            .insert({
                url: publicUrl,
                alt_text: altText,
                file_size: file.size,
                file_type: file.type,
                width,
                height
            })
            .select()
            .single()

        if (dbError) {
            // Storage'dan sil
            await supabaseAdmin.storage.from('images').remove([filePath])
            return NextResponse.json({ error: dbError.message }, { status: 500 })
        }

        return NextResponse.json({ image }, { status: 201 })

    } catch (error) {
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
    }
}
