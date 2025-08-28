'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'

export default function SEOScoreCard({ formData, options, selectedImage }) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [seoScore, setSeoScore] = useState(0)
    const [seoChecks, setSeoChecks] = useState([])

    // SEO kontrol fonksiyonları
    const getKeywords = useCallback(() => {
        const keywords = []
        if (options.seo_keywords) keywords.push(...options.seo_keywords.split(',').map(k => k.trim()))
        if (options.highlight_keywords) keywords.push(...options.highlight_keywords.split(',').map(k => k.trim()))
        if (formData.meta_keywords) keywords.push(...formData.meta_keywords.split(',').map(k => k.trim()))
        return keywords.filter(k => k.length > 0)
    }, [options.seo_keywords, options.highlight_keywords, formData.meta_keywords])

    const checkKeywordInTitle = useCallback(() => {
        const keywords = getKeywords()
        if (keywords.length === 0) return false
        const title = formData.title?.toLowerCase() || ''
        return keywords.some(keyword => title.includes(keyword.toLowerCase()))
    }, [formData.title, getKeywords])

    const checkTitleLength = useCallback(() => {
        const length = formData.title?.length || 0
        return length >= 50 && length <= 60
    }, [formData.title])

    const checkKeywordInMeta = useCallback(() => {
        const keywords = getKeywords()
        if (keywords.length === 0) return false
        const meta = formData.meta_description?.toLowerCase() || ''
        return keywords.some(keyword => meta.includes(keyword.toLowerCase()))
    }, [formData.meta_description, getKeywords])

    const checkMetaLength = useCallback(() => {
        const length = formData.meta_description?.length || 0
        return length >= 140 && length <= 160
    }, [formData.meta_description])

    const checkSlugQuality = useCallback(() => {
        const slug = formData.slug || ''
        const keywords = getKeywords()
        if (slug.length === 0 || keywords.length === 0) return false

        // Slug kısa olmalı (max 5 kelime) ve anahtar kelime içermeli
        const slugWords = slug.split('-').length
        const hasKeyword = keywords.some(keyword =>
            slug.toLowerCase().includes(keyword.toLowerCase().replace(/\s+/g, '-'))
        )

        return slugWords <= 5 && hasKeyword
    }, [formData.slug, getKeywords])

    const checkSingleH1 = useCallback(() => {
        // İçerikte H1 olmamalı çünkü başlık zaten H1 olarak render edilecek
        const fullContent = (formData.content || '') + ' ' + (formData.result || '')
        const h1Matches = fullContent.match(/^# /gm) || []
        return h1Matches.length === 0
    }, [formData.content, formData.result])

    const checkKeywordInHeadings = useCallback(() => {
        const content = formData.content || ''
        const keywords = getKeywords()
        if (keywords.length === 0) return false

        const headings = content.match(/^#{2,3} .+$/gm) || []
        const headingText = headings.join(' ').toLowerCase()

        return keywords.some(keyword => headingText.includes(keyword.toLowerCase()))
    }, [formData.content, getKeywords])

    const checkKeywordDensity = useCallback(() => {
        const content = formData.content || ''
        const keywords = getKeywords()
        if (keywords.length === 0 || content.length === 0) return {
            passed: false,
            density: '0.0',
            keywordDetails: []
        }

        const words = content.toLowerCase().split(/\s+/).length
        let totalKeywordCount = 0
        const keywordDetails = []

        keywords.forEach(keyword => {
            const regex = new RegExp(keyword.toLowerCase(), 'gi')
            const matches = content.match(regex) || []
            const count = matches.length
            if (count > 0) {
                totalKeywordCount += count
                const keywordDensity = ((count / words) * 100).toFixed(1)
                keywordDetails.push({
                    keyword: keyword,
                    count: count,
                    density: keywordDensity
                })
            }
        })

        const totalDensity = ((totalKeywordCount / words) * 100).toFixed(1)
        const densityNum = parseFloat(totalDensity)

        return {
            passed: densityNum >= 1.0 && densityNum <= 2.0,
            density: totalDensity,
            keywordDetails: keywordDetails
        }
    }, [formData.content, getKeywords])

    const checkInternalLinks = useCallback(() => {
        const content = formData.content || ''
        // Markdown link formatı [text](url) ve internal link pattern
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
        const links = [...content.matchAll(linkRegex)]

        // Herhangi bir link varsa true döndür (internal veya external)
        return links.length > 0
    }, [formData.content])

    const checkImageAlt = useCallback(() => {
        // Seçilen resmin alt text'i var mı kontrol et
        return selectedImage?.alt_text?.length > 0
    }, [selectedImage])

    const performSEOChecks = useCallback(() => {
        const checks = []

        // 1. Başlık (Title) Kontrolü
        const titleKeywordCheck = checkKeywordInTitle()
        checks.push({
            id: 'title-keyword',
            category: 'Başlık',
            description: 'Anahtar kelime başlıkta geçiyor mu?',
            passed: titleKeywordCheck,
            icon: titleKeywordCheck ? '✅' : '❌'
        })

        const titleLengthCheck = checkTitleLength()
        checks.push({
            id: 'title-length',
            category: 'Başlık',
            description: 'Uzunluğu 50–60 karakter arası mı?',
            passed: titleLengthCheck,
            icon: titleLengthCheck ? '✅' : '⚠️',
            detail: `${formData.title?.length || 0} karakter`
        })

        // 2. Meta Açıklama
        const metaKeywordCheck = checkKeywordInMeta()
        checks.push({
            id: 'meta-keyword',
            category: 'Meta Açıklama',
            description: 'Anahtar kelime içeriyor mu?',
            passed: metaKeywordCheck,
            icon: metaKeywordCheck ? '✅' : '❌'
        })

        const metaLengthCheck = checkMetaLength()
        checks.push({
            id: 'meta-length',
            category: 'Meta Açıklama',
            description: '140–160 karakter arası mı?',
            passed: metaLengthCheck,
            icon: metaLengthCheck ? '✅' : '⚠️',
            detail: `${formData.meta_description?.length || 0} karakter`
        })

        // 3. URL Slug
        const slugCheck = checkSlugQuality()
        checks.push({
            id: 'slug-quality',
            category: 'URL Slug',
            description: 'Kısa ve anahtar kelime odaklı mı?',
            passed: slugCheck,
            icon: slugCheck ? '✅' : '⚠️'
        })

        // 4. Heading Kullanımı
        const h1Check = checkSingleH1()
        checks.push({
            id: 'no-h1-in-content',
            category: 'Heading',
            description: 'İçerikte H1 yok (başlık zaten H1)',
            passed: h1Check,
            icon: h1Check ? '✅' : '⚠️'
        })

        const headingKeywordCheck = checkKeywordInHeadings()
        checks.push({
            id: 'heading-keyword',
            category: 'Heading',
            description: 'Anahtar kelime H2 veya H3\'lerde geçiyor mu?',
            passed: headingKeywordCheck,
            icon: headingKeywordCheck ? '✅' : '❌'
        })

        // 5. Anahtar Kelime Yoğunluğu
        const keywordDensityCheck = checkKeywordDensity()
        checks.push({
            id: 'keyword-density',
            category: 'Anahtar Kelime',
            description: 'Yoğunluk %1–2 arası mı?',
            passed: keywordDensityCheck.passed,
            icon: keywordDensityCheck.passed ? '✅' : '⚠️',
            detail: `%${keywordDensityCheck.density}`,
            keywordDetails: keywordDensityCheck.keywordDetails
        })

        // 6. İç/Dış Linkleme
        const internalLinkCheck = checkInternalLinks()
        checks.push({
            id: 'internal-links',
            category: 'Linkleme',
            description: 'İçerikte link var mı? (İç veya dış)',
            passed: internalLinkCheck,
            icon: internalLinkCheck ? '✅' : '❌'
        })

        // 7. Görsel SEO
        const imageAltCheck = checkImageAlt()
        checks.push({
            id: 'image-alt',
            category: 'Görsel SEO',
            description: 'Görsellerde alt etiketleri var mı?',
            passed: imageAltCheck,
            icon: imageAltCheck ? '✅' : '❌'
        })

        return checks
    }, [
        checkKeywordInTitle, checkTitleLength, checkKeywordInMeta, checkMetaLength,
        checkSlugQuality, checkSingleH1, checkKeywordInHeadings, checkKeywordDensity,
        checkInternalLinks, checkImageAlt
    ])

    // SEO kontrolleri
    useEffect(() => {
        const checks = performSEOChecks()
        setSeoChecks(checks)

        const totalScore = checks.reduce((sum, check) => sum + (check.passed ? 10 : 0), 0)
        setSeoScore(totalScore)
    }, [performSEOChecks])

    // Skor rengi
    const getScoreColor = () => {
        if (seoScore >= 80) return 'text-green-600 bg-green-50 border-green-200'
        if (seoScore >= 60) return 'text-orange-600 bg-orange-50 border-orange-200'
        return 'text-red-600 bg-red-50 border-red-200'
    }

    const getScoreLabel = () => {
        if (seoScore >= 80) return 'Harika'
        if (seoScore >= 60) return 'Orta'
        return 'Zayıf'
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-gray-900">SEO Skoru</h3>
                    <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getScoreColor()}`}>
                        {seoScore}/100 - {getScoreLabel()}
                    </div>
                </div>
                <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    {isExpanded ? (
                        <ChevronUpIcon className="w-5 h-5" />
                    ) : (
                        <ChevronDownIcon className="w-5 h-5" />
                    )}
                </button>
            </div>

            {isExpanded && (
                <div className="mt-6 space-y-4">
                    {Object.entries(
                        seoChecks.reduce((groups, check) => {
                            const category = check.category
                            if (!groups[category]) groups[category] = []
                            groups[category].push(check)
                            return groups
                        }, {})
                    ).map(([category, checks]) => (
                        <div key={category} className="border rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-3">{category}</h4>
                            <div className="space-y-2">
                                {checks.map((check) => (
                                    <div key={check.id} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-lg">{check.icon}</span>
                                                <span className="text-sm text-gray-700">{check.description}</span>
                                            </div>
                                            {check.detail && (
                                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                    {check.detail}
                                                </span>
                                            )}
                                        </div>

                                        {/* Anahtar kelime detayları */}
                                        {check.keywordDetails && check.keywordDetails.length > 0 && (
                                            <div className="ml-7 space-y-1">
                                                <div className="text-xs text-gray-500 font-medium">Anahtar Kelime Detayları:</div>
                                                {check.keywordDetails.map((detail, index) => (
                                                    <div key={index} className="text-xs text-gray-600 flex justify-between">
                                                        <span>"{detail.keyword}"</span>
                                                        <span className="text-gray-500">
                                                            {detail.count} kez (%{detail.density})
                                                        </span>
                                                    </div>
                                                ))}
                                                <div className="text-xs text-gray-500 italic mt-1">
                                                    💡 İdeal yoğunluk: %1-2 arası
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* SEO İpuçları */}
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">💡 SEO İpuçları</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Başlığınızı 50-60 karakter arasında tutun</li>
                            <li>• Meta açıklamanızı 140-160 karakter arasında yazın</li>
                            <li>• Anahtar kelime yoğunluğunu %1-2 arasında tutun</li>
                            <li>• İçeriğinizde H2, H3 başlıkları kullanın</li>
                            <li>• Markdown linkler ekleyin: [metin](url)</li>
                            <li>• Görsellere alt etiket ekleyin</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    )
}
