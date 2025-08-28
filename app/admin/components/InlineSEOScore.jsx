'use client'

import { useState, useEffect, useCallback } from 'react'

export default function InlineSEOScore({
    type, // 'title', 'meta', 'content', 'slug'
    formData,
    options,
    selectedImage,
    fieldValue, // Spesifik field değeri (title, meta_description, etc.)
    onTextChange // AI düzeltme callback'i
}) {
    const [score, setScore] = useState(0)
    const [checks, setChecks] = useState([])
    const [isExpanded, setIsExpanded] = useState(false)
    const [isFixing, setIsFixing] = useState(false)

    // Anahtar kelimeleri al
    const getKeywords = useCallback(() => {
        const keywords = []
        if (options.seo_keywords) keywords.push(...options.seo_keywords.split(',').map(k => k.trim()))
        if (options.highlight_keywords) keywords.push(...options.highlight_keywords.split(',').map(k => k.trim()))
        if (formData.meta_keywords) keywords.push(...formData.meta_keywords.split(',').map(k => k.trim()))
        return keywords.filter(k => k.length > 0)
    }, [options.seo_keywords, options.highlight_keywords, formData.meta_keywords])

    // Type'a göre kontroller
    const performChecks = useCallback(() => {
        const keywords = getKeywords()
        const newChecks = []

        switch (type) {
            case 'title':
                // Başlık kontrolü
                const titleKeywordCheck = keywords.length > 0 && keywords.some(keyword =>
                    fieldValue?.toLowerCase().includes(keyword.toLowerCase())
                )
                newChecks.push({
                    id: 'title-keyword',
                    description: 'Anahtar kelime var',
                    passed: titleKeywordCheck,
                    icon: titleKeywordCheck ? '✅' : '❌'
                })

                const titleLength = fieldValue?.length || 0
                const titleLengthCheck = titleLength >= 50 && titleLength <= 60
                newChecks.push({
                    id: 'title-length',
                    description: '50-60 karakter',
                    passed: titleLengthCheck,
                    icon: titleLengthCheck ? '✅' : '⚠️',
                    detail: `${titleLength} karakter`
                })
                break

            case 'meta':
                // Meta açıklama kontrolü
                const metaKeywordCheck = keywords.length > 0 && keywords.some(keyword =>
                    fieldValue?.toLowerCase().includes(keyword.toLowerCase())
                )
                newChecks.push({
                    id: 'meta-keyword',
                    description: 'Anahtar kelime var',
                    passed: metaKeywordCheck,
                    icon: metaKeywordCheck ? '✅' : '❌'
                })

                const metaLength = fieldValue?.length || 0
                const metaLengthCheck = metaLength >= 140 && metaLength <= 160
                newChecks.push({
                    id: 'meta-length',
                    description: '140-160 karakter',
                    passed: metaLengthCheck,
                    icon: metaLengthCheck ? '✅' : '⚠️',
                    detail: `${metaLength} karakter`
                })
                break

            case 'slug':
                // URL Slug kontrolü
                const slug = fieldValue || ''
                const slugWords = slug.split('-').length
                const hasKeyword = keywords.length > 0 && keywords.some(keyword =>
                    slug.toLowerCase().includes(keyword.toLowerCase().replace(/\s+/g, '-'))
                )
                const slugCheck = slugWords <= 5 && hasKeyword
                newChecks.push({
                    id: 'slug-quality',
                    description: 'Kısa ve anahtar kelime odaklı',
                    passed: slugCheck,
                    icon: slugCheck ? '✅' : '⚠️',
                    detail: `${slugWords} kelime`
                })
                break

            case 'content':
                // İçerik kontrolü (content + result birlikte)
                const fullContent = (formData.content || '') + ' ' + (formData.result || '')

                // H1 kontrolü (içerikte H1 olmamalı çünkü başlık zaten H1)
                const h1Matches = fullContent.match(/^# /gm) || []
                const noH1Check = h1Matches.length === 0
                newChecks.push({
                    id: 'no-h1',
                    description: 'İçerikte H1 yok (✓)',
                    passed: noH1Check,
                    icon: noH1Check ? '✅' : '⚠️',
                    detail: h1Matches.length > 0 ? `${h1Matches.length} H1 var` : 'H1 yok'
                })

                // H2/H3 anahtar kelime kontrolü
                const headings = fullContent.match(/^#{2,3} .+$/gm) || []
                const headingText = headings.join(' ').toLowerCase()
                const headingKeywordCheck = keywords.length > 0 && keywords.some(keyword =>
                    headingText.includes(keyword.toLowerCase())
                )
                newChecks.push({
                    id: 'heading-keyword',
                    description: 'H2/H3\'te anahtar kelime var',
                    passed: headingKeywordCheck,
                    icon: headingKeywordCheck ? '✅' : '❌'
                })

                // Anahtar kelime yoğunluğu
                if (keywords.length > 0 && fullContent.length > 0) {
                    const words = fullContent.toLowerCase().split(/\s+/).length
                    let totalKeywordCount = 0

                    keywords.forEach(keyword => {
                        const regex = new RegExp(keyword.toLowerCase(), 'gi')
                        const matches = fullContent.match(regex) || []
                        totalKeywordCount += matches.length
                    })

                    const density = ((totalKeywordCount / words) * 100).toFixed(1)
                    const densityNum = parseFloat(density)
                    const densityCheck = densityNum >= 1.0 && densityNum <= 2.0

                    newChecks.push({
                        id: 'keyword-density',
                        description: 'Anahtar kelime yoğunluğu %1-2',
                        passed: densityCheck,
                        icon: densityCheck ? '✅' : '⚠️',
                        detail: `%${density}`
                    })
                }

                // Link kontrolü
                const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
                const links = [...fullContent.matchAll(linkRegex)]
                const hasLinks = links.length > 0
                newChecks.push({
                    id: 'has-links',
                    description: 'Link var',
                    passed: hasLinks,
                    icon: hasLinks ? '✅' : '❌',
                    detail: `${links.length} link`
                })

                // Görsel kontrolü
                const imageCheck = selectedImage?.alt_text?.length > 0
                newChecks.push({
                    id: 'image-alt',
                    description: 'Görsel alt etiketi var',
                    passed: imageCheck,
                    icon: imageCheck ? '✅' : '❌'
                })
                break
        }

        return newChecks
    }, [type, fieldValue, formData, options, selectedImage, getKeywords])

    useEffect(() => {
        const newChecks = performChecks()
        setChecks(newChecks)

        const passedCount = newChecks.filter(check => check.passed).length
        const totalCount = newChecks.length
        const newScore = totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0
        setScore(newScore)
    }, [performChecks])

    // Skor rengini belirle
    const getScoreColor = () => {
        if (score >= 80) return 'text-green-600 bg-green-50 border-green-200'
        if (score >= 60) return 'text-orange-600 bg-orange-50 border-orange-200'
        return 'text-red-600 bg-red-50 border-red-200'
    }

    const getScoreLabel = () => {
        if (score >= 80) return 'İyi'
        if (score >= 60) return 'Orta'
        return 'Zayıf'
    }

    // AI ile düzeltme fonksiyonu
    const handleAIFix = async () => {
        if (!onTextChange || isFixing) return

        setIsFixing(true)
        try {
            const keywords = getKeywords()
            let prompt = ''
            let fieldType = ''

            switch (type) {
                case 'title':
                    prompt = `Aşağıdaki blog başlığını SEO uyumlu hale getir. Sadece yeni başlığı yaz, hiç açıklama ekleme:

Mevcut başlık: "${fieldValue}"
Anahtar kelimeler: ${keywords.join(', ')}

Kurallar:
- 50-60 karakter arası
- Anahtar kelimeleri içer
- Çekici ve tıklanabilir
- Türkçe

Sadece yeni başlığı yaz:`
                    fieldType = 'title'
                    break

                case 'meta':
                    prompt = `Aşağıdaki meta açıklamayı SEO uyumlu hale getir. Sadece yeni meta açıklamayı yaz, hiç açıklama ekleme:

Mevcut açıklama: "${fieldValue}"
Anahtar kelimeler: ${keywords.join(', ')}

Kurallar:
- 140-160 karakter arası
- Anahtar kelimeleri içer
- Google'da çekici görünür
- Türkçe

Sadece yeni meta açıklamayı yaz:`
                    fieldType = 'meta_description'
                    break

                case 'slug':
                    prompt = `Aşağıdaki URL slug'ını SEO uyumlu hale getir. Sadece yeni slug'ı yaz, hiç açıklama ekleme:

Mevcut slug: "${fieldValue}"
Anahtar kelimeler: ${keywords.join(', ')}

Kurallar:
- Kısa (max 5 kelime)
- Anahtar kelimeleri içer
- Tire ile ayrılmış
- Türkçe karakter yok

Sadece yeni slug'ı yaz:`
                    fieldType = 'slug'
                    break

                case 'content':
                    prompt = `Aşağıdaki blog içeriğini SEO uyumlu hale getir. Sadece yeni içeriği yaz, hiç açıklama ekleme:

Mevcut içerik: "${fieldValue}"
Anahtar kelimeler: ${keywords.join(', ')}

Kurallar:
- H1 kullanma (başlık zaten H1)
- H2, H3 başlıkları kullan
- Anahtar kelime yoğunluğu %1-2 arası
- Doğal akışta anahtar kelimeler
- Markdown formatında
- Türkçe

Sadece yeni içeriği yaz:`
                    fieldType = 'content'
                    break
            }

            // Timeout ile fetch (50 saniye)
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 50000)

            const response = await fetch('/api/admin/ai/improve-text', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: fieldValue,
                    action: 'SEO optimize',
                    fieldType: fieldType,
                    customPrompt: prompt
                }),
                signal: controller.signal
            })

            clearTimeout(timeoutId)

            const data = await response.json()

            if (response.ok && data.improvedText) {
                onTextChange(data.improvedText)
                setIsExpanded(false)
            } else {
                if (response.status === 408) {
                    alert('İşlem zaman aşımına uğradı. Lütfen daha kısa bir metin deneyin.')
                } else {
                    alert('AI düzeltme başarısız: ' + (data.error || 'Bilinmeyen hata'))
                }
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                alert('İşlem zaman aşımına uğradı. Lütfen daha kısa bir metin deneyin.')
            } else {
                console.error('AI düzeltme hatası:', error)
                alert('AI düzeltme sırasında hata oluştu')
            }
        } finally {
            setIsFixing(false)
        }
    }

    if (checks.length === 0) return null

    return (
        <div className="relative inline-flex items-center space-x-2 ml-2">
            <div
                className={`px-2 py-1 rounded text-xs font-medium border cursor-pointer ${getScoreColor()}`}
                onClick={() => setIsExpanded(!isExpanded)}
                title="SEO skorunu görmek için tıklayın"
            >
                SEO: {score}% {getScoreLabel()}
            </div>

            {isExpanded && (
                <div className="absolute z-50 top-8 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-64">
                    <div className="space-y-2">
                        {checks.map((check) => (
                            <div key={check.id} className="flex items-center justify-between text-xs">
                                <div className="flex items-center space-x-2">
                                    <span>{check.icon}</span>
                                    <span className="text-gray-700">{check.description}</span>
                                </div>
                                {check.detail && (
                                    <span className="text-gray-500 bg-gray-100 px-1 py-0.5 rounded">
                                        {check.detail}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* AI ile Düzelt Butonu */}
                    <div className="mt-3 pt-2 border-t border-gray-200">
                        <button
                            onClick={handleAIFix}
                            disabled={isFixing || !onTextChange}
                            className="w-full bg-indigo-600 text-white text-xs py-2 px-3 rounded hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isFixing ? '🤖 Düzeltiliyor...' : '🤖 AI ile SEO Uyumlu Düzelt'}
                        </button>
                    </div>

                    {/* Kapatma butonu */}
                    <button
                        onClick={() => setIsExpanded(false)}
                        className="mt-2 text-xs text-gray-500 hover:text-gray-700"
                    >
                        ✕ Kapat
                    </button>
                </div>
            )}
        </div>
    )
}
