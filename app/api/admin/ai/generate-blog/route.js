import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// Vercel timeout ayarı - maksimum 60 saniye (Pro plan için)
export const maxDuration = 60

// Blog içeriği üretme
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
            province,
            district,
            neighborhood,
            service,
            locksmith,
            category,
            topic,
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

        // OpenAI API anahtarını kontrol et
        const openaiApiKey = process.env.OPENAI_API_KEY
        if (!openaiApiKey) {
            return NextResponse.json({ error: 'OpenAI API anahtarı yapılandırılmamış' }, { status: 500 })
        }

        // Prompt oluştur
        let prompt = `Biçilingir platformu için SEO dostu bir blog yazısı oluştur. Aşağıdaki bilgileri kullan:

`

        if (province) prompt += `İl: ${province}\n`
        if (district) prompt += `İlçe: ${district}\n`
        if (neighborhood) prompt += `Mahalle: ${neighborhood}\n`
        if (service) prompt += `Servis Türü: ${service}\n`
        if (locksmith) prompt += `Çilingir: ${locksmith}\n`
        if (category) prompt += `Kategori: ${category}\n`
        if (topic) prompt += `Konu: ${topic}\n`
        if (user_description) prompt += `Kullanıcı Açıklaması: ${user_description}\n`
        if (seo_keywords) prompt += `SEO Anahtar Kelimeleri: ${seo_keywords}\n`
        if (highlight_keywords) prompt += `Öne Çıkarılacak Kelimeler: ${highlight_keywords}\n`

        prompt += `\nİçerik Stili: ${content_style === 'formal' ? 'Resmi' : content_style === 'friendly' ? 'Samimi' : 'Normal'}\n`

        if (include_list) prompt += `- Liste formatı ekle\n`
        if (include_table) prompt += `- Tablo ekle\n`
        if (include_faq) prompt += `- SSS bölümü ekle\n`
        if (include_internal_links) prompt += `- İç linkler için yer tutucu ekle\n`
        if (include_cta) prompt += `- Call-to-Action ekle\n`
        if (include_year) prompt += `- ${new Date().getFullYear()} yılını vurgulay\n`
        if (light_humor) prompt += `- Hafif mizahi ton kullan\n`

        prompt += `
Lütfen aşağıdaki JSON formatında cevap ver:
{
  "title": "Blog başlığı (60 karakter civarında)",
  "slug": "blog-slug-url-friendly",
  "meta_title": "SEO için özel başlık (60 karakter civarında)",
  "meta_description": "Meta açıklama (150-160 karakter)",
  "meta_keywords": "anahtar,kelimeler,virgül,ile,ayrılmış",
  "excerpt": "Blog özeti (200-250 karakter)",
  "content": "Markdown formatında tam blog içeriği",
  "result": "İçeriğin kısa özeti (300-400 kelime, Markdown formatında)",
  "reading_time": 5
}

Önemli notlar:
- Türkçe yaz
- SEO dostu ol
- Markdown formatını doğru kullan
- Biçilingir platformunu tanıt
- Güvenilir çilingir bulmanın önemini vurgulay
- Gerçek ve yararlı bilgiler ver
- Anahtar kelimeleri doğal şekilde yerleştir`

        try {
            // Timeout ile fetch (45 saniye)
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 45000)

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${openaiApiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'gpt-4',
                    messages: [
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 3000 // Token limitini azalt
                }),
                signal: controller.signal
            })

            clearTimeout(timeoutId)

            if (!response.ok) {
                const errorData = await response.json()
                return NextResponse.json({
                    error: 'OpenAI API hatası: ' + (errorData.error?.message || 'Bilinmeyen hata')
                }, { status: 500 })
            }

            const data = await response.json()
            const content = data.choices[0].message.content

            // JSON parse et
            let blogData
            try {
                // JSON'u temizle (markdown kod bloklarını kaldır)
                const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
                blogData = JSON.parse(cleanContent)
            } catch (parseError) {
                return NextResponse.json({
                    error: 'AI yanıtı JSON formatında değil',
                    raw_content: content
                }, { status: 500 })
            }

            return NextResponse.json({ blogData })

        } catch (fetchError) {
            if (fetchError.name === 'AbortError') {
                return NextResponse.json({
                    error: 'İşlem zaman aşımına uğradı. Lütfen daha kısa bir prompt deneyin.'
                }, { status: 408 })
            }
            return NextResponse.json({
                error: 'OpenAI API isteği başarısız: ' + fetchError.message
            }, { status: 500 })
        }

    } catch (error) {
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
    }
}
