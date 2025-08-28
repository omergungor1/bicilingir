import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// Vercel timeout ayarı - maksimum 60 saniye (Pro plan için)
export const maxDuration = 60

// Metin iyileştirme
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

        const { text, action, customPrompt, fieldType = 'content' } = body

        if (!text || !action) {
            return NextResponse.json({ error: 'Text ve action gerekli' }, { status: 400 })
        }

        // OpenAI API anahtarını kontrol et
        const openaiApiKey = process.env.OPENAI_API_KEY
        if (!openaiApiKey) {
            return NextResponse.json({ error: 'OpenAI API anahtarı yapılandırılmamış' }, { status: 500 })
        }

        let prompt = ''

        switch (action) {
            case 'rewrite':
                prompt = `Aşağıdaki metni tamamen yeniden yaz. Aynı anlamı koruyarak farklı kelimeler ve yapılar kullan. ${fieldType === 'content' ? 'Markdown formatında' : ''} cevap ver:\n\n${text}`
                break
            case 'improve':
                prompt = `Aşağıdaki metni iyileştir. Daha akıcı, etkileyici ve profesyonel hale getir. ${fieldType === 'content' ? 'Markdown formatında' : ''} cevap ver:\n\n${text}`
                break
            case 'extend':
                prompt = `Aşağıdaki metni genişlet. Daha detaylı bilgiler, örnekler ve açıklamalar ekle. ${fieldType === 'content' ? 'Markdown formatında' : ''} cevap ver:\n\n${text}`
                break
            case 'shorten':
                prompt = `Aşağıdaki metni kısalt. Ana mesajı koruyarak gereksiz kısımları çıkar. ${fieldType === 'content' ? 'Markdown formatında' : ''} cevap ver:\n\n${text}`
                break
            case 'engaging':
                prompt = `Aşağıdaki metni daha etkileyici ve çekici hale getir. Okuyucunun ilgisini çekecek şekilde yeniden yaz. ${fieldType === 'content' ? 'Markdown formatında' : ''} cevap ver:\n\n${text}`
                break
            case 'custom':
                if (!customPrompt) {
                    return NextResponse.json({ error: 'Custom prompt gerekli' }, { status: 400 })
                }
                prompt = `${customPrompt}\n\nMetin: ${text}\n\n${fieldType === 'content' ? 'Markdown formatında' : ''} cevap ver.`
                break
            case 'SEO optimize':
                if (customPrompt) {
                    prompt = customPrompt
                } else {
                    prompt = `Aşağıdaki metni SEO uyumlu hale getir. Google'da daha iyi sıralama için optimize et. ${fieldType === 'content' ? 'Markdown formatında' : ''} cevap ver:\n\n${text}`
                }
                break
            default:
                return NextResponse.json({ error: 'Geçersiz action' }, { status: 400 })
        }

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
                            role: 'system',
                            content: 'Sen çilingir hizmetleri konusunda uzman bir içerik yazarısın. Türkçe yazıyorsun ve SEO dostu içerikler üretiyorsun. İstenen görevi yerine getir ve sadece sonucu döndür. Hiçbir açıklama, yorum veya ek metin ekleme. Metinlerin başında ve sonunda tırnak işareti kullanma.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 2000
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
            const improvedText = data.choices[0].message.content.trim()

            return NextResponse.json({ improvedText })

        } catch (fetchError) {
            if (fetchError.name === 'AbortError') {
                return NextResponse.json({
                    error: 'İşlem zaman aşımına uğradı. Lütfen daha kısa bir metin deneyin.'
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
