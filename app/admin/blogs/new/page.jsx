'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import AIButton from '../../components/AIButton'
import ImageLibraryModal from '../../components/ImageLibraryModal'
import SEOScoreCard from '../../components/SEOScoreCard'
import InlineSEOScore from '../../components/InlineSEOScore'

// Markdown editörü dinamik olarak yükle (SSR sorunlarını önlemek için)
const MDEditor = dynamic(
    () => import('@uiw/react-md-editor'),
    { ssr: false }
)

export default function NewBlog() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [generating, setGenerating] = useState(false)

    // Form verileri
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        result: '',
        excerpt: '',
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        reading_time: 0,
        is_featured: false,
        status: 'draft'
    })

    // Seçenekler
    const [options, setOptions] = useState({
        province_id: null,
        district_id: null,
        neighborhood_id: null,
        service_id: null,
        locksmith_id: null,
        category_id: null,
        topic_id: null,
        user_description: '',
        seo_keywords: '',
        highlight_keywords: '',
        content_style: 'normal',
        include_list: false,
        include_table: false,
        include_faq: false,
        include_internal_links: false,
        include_cta: false,
        include_year: false,
        light_humor: false
    })

    // Seçim verileri
    const [provinces, setProvinces] = useState([])
    const [districts, setDistricts] = useState([])
    const [neighborhoods, setNeighborhoods] = useState([])
    const [services, setServices] = useState([])
    const [locksmiths, setLocksmiths] = useState([])
    const [categories, setCategories] = useState([])

    // Modal durumları
    const [imageModalOpen, setImageModalOpen] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null)
    const [aiSettingsExpanded, setAiSettingsExpanded] = useState(true)

    useEffect(() => {
        fetchInitialData()
    }, [])

    useEffect(() => {
        if (options.province_id) {
            fetchDistricts(options.province_id)
        } else {
            setDistricts([])
            setNeighborhoods([])
        }
    }, [options.province_id])

    useEffect(() => {
        if (options.district_id) {
            fetchNeighborhoods(options.district_id)
        } else {
            setNeighborhoods([])
        }
    }, [options.district_id])

    const fetchInitialData = async () => {
        try {
            const [provincesRes, servicesRes, locksmithsRes, categoriesRes] = await Promise.all([
                fetch('/api/admin/locations?type=provinces'),
                fetch('/api/admin/services'),
                fetch('/api/admin/locksmiths'),
                fetch('/api/admin/blog-categories')
            ])

            const [provincesData, servicesData, locksmithsData, categoriesData] = await Promise.all([
                provincesRes.json(),
                servicesRes.json(),
                locksmithsRes.json(),
                categoriesRes.json()
            ])

            setProvinces(provincesData.provinces || [])
            setServices(servicesData.services || [])
            setLocksmiths(locksmithsData.locksmiths || [])
            setCategories(categoriesData.categories || [])
        } catch (error) {
            console.error('Başlangıç verileri yüklenirken hata:', error)
        }
    }

    const fetchDistricts = async (provinceId) => {
        try {
            const response = await fetch(`/api/admin/locations?type=districts&province_id=${provinceId}`)
            const data = await response.json()
            setDistricts(data.districts || [])
        } catch (error) {
            console.error('İlçeler yüklenirken hata:', error)
        }
    }

    const fetchNeighborhoods = async (districtId) => {
        try {
            const response = await fetch(`/api/admin/locations?type=neighborhoods&district_id=${districtId}`)
            const data = await response.json()
            setNeighborhoods(data.neighborhoods || [])
        } catch (error) {
            console.error('Mahalleler yüklenirken hata:', error)
        }
    }

    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/ğ/g, 'g')
            .replace(/ü/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ı/g, 'i')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()
    }

    const handleFormChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
            ...(field === 'title' && { slug: generateSlug(value) })
        }))
    }

    const handleOptionsChange = (field, value) => {
        setOptions(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleGenerate = async () => {
        setGenerating(true)
        try {
            // Seçilen verilerin isimlerini al
            const province = provinces.find(p => p.id == options.province_id)?.name
            const district = districts.find(d => d.id == options.district_id)?.name
            const neighborhood = neighborhoods.find(n => n.id == options.neighborhood_id)?.name
            const service = services.find(s => s.id === options.service_id)?.name
            const locksmith = locksmiths.find(l => l.id === options.locksmith_id)?.fullname
            const category = categories.find(c => c.id === options.category_id)?.name
            const topic = categories
                .find(c => c.id === options.category_id)
                ?.blog_topics?.find(t => t.id === options.topic_id)?.name

            const generateData = {
                province,
                district,
                neighborhood,
                service,
                locksmith,
                category,
                topic,
                ...options
            }

            const response = await fetch('/api/admin/ai/generate-blog', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(generateData)
            })

            const data = await response.json()

            if (response.ok) {
                const { blogData } = data
                setFormData(prev => ({
                    ...prev,
                    title: blogData.title || prev.title,
                    slug: blogData.slug || prev.slug,
                    content: blogData.content || prev.content,
                    result: blogData.result || prev.result,
                    excerpt: blogData.excerpt || prev.excerpt,
                    meta_title: blogData.meta_title || prev.meta_title,
                    meta_description: blogData.meta_description || prev.meta_description,
                    meta_keywords: blogData.meta_keywords || prev.meta_keywords,
                    reading_time: blogData.reading_time || prev.reading_time
                }))
            } else {
                alert('AI içerik üretimi başarısız: ' + data.error)
            }
        } catch (error) {
            alert('AI isteği sırasında hata oluştu')
        } finally {
            setGenerating(false)
        }
    }

    const handleSave = async (status = 'draft') => {
        if (!formData.title.trim()) {
            alert('Başlık gerekli')
            return
        }

        setLoading(true)
        try {
            // Blog oluştur
            const blogResponse = await fetch('/api/admin/blogs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    status,
                    image_id: selectedImage?.id,
                    province_id: options.province_id,
                    district_id: options.district_id,
                    neighborhood_id: options.neighborhood_id,
                    service_id: options.service_id,
                    locksmith_id: options.locksmith_id,
                    category_id: options.category_id,
                    topic_id: options.topic_id
                })
            })

            const blogData = await blogResponse.json()

            if (blogResponse.ok) {
                // Blog ayarlarını kaydet
                await fetch(`/api/admin/blogs/${blogData.blog.id}/settings`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(options)
                })

                router.push('/admin/blogs')
            } else {
                alert('Hata: ' + blogData.error)
            }
        } catch (error) {
            alert('Kaydetme sırasında hata oluştu')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Yeni Blog Yazısı</h1>
                <div className="space-x-3">
                    <button
                        onClick={() => handleSave('draft')}
                        disabled={loading}
                        className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 disabled:opacity-50"
                    >
                        {loading ? 'Kaydediliyor...' : 'Taslak Kaydet'}
                    </button>
                    <button
                        onClick={() => handleSave('published')}
                        disabled={loading}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                    >
                        {loading ? 'Yayınlanıyor...' : 'Yayınla'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sol Panel - Ayarlar */}
                <div className="lg:col-span-1 space-y-6">
                    {/* AI Üretim Ayarları */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div
                            className="flex items-center justify-between cursor-pointer mb-4"
                            onClick={() => setAiSettingsExpanded(!aiSettingsExpanded)}
                        >
                            <h3 className="text-lg font-medium text-gray-900">AI Üretim Ayarları</h3>
                            <button
                                type="button"
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg
                                    className={`w-5 h-5 transform transition-transform ${aiSettingsExpanded ? 'rotate-90' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        {/* Collapsible İçerik */}
                        {aiSettingsExpanded && (
                            <div className="space-y-6">
                                {/* Lokasyon Seçimi */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">İl</label>
                                        <select
                                            value={options.province_id || ''}
                                            onChange={(e) => handleOptionsChange('province_id', e.target.value || null)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                        >
                                            <option value="">Seçiniz</option>
                                            {provinces.map(province => (
                                                <option key={province.id} value={province.id}>
                                                    {province.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">İlçe</label>
                                        <select
                                            value={options.district_id || ''}
                                            onChange={(e) => handleOptionsChange('district_id', e.target.value || null)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                            disabled={!options.province_id}
                                        >
                                            <option value="">Seçiniz</option>
                                            {districts.map(district => (
                                                <option key={district.id} value={district.id}>
                                                    {district.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Mahalle</label>
                                        <select
                                            value={options.neighborhood_id || ''}
                                            onChange={(e) => handleOptionsChange('neighborhood_id', e.target.value || null)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                            disabled={!options.district_id}
                                        >
                                            <option value="">Seçiniz</option>
                                            {neighborhoods.map(neighborhood => (
                                                <option key={neighborhood.id} value={neighborhood.id}>
                                                    {neighborhood.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Servis Türü</label>
                                        <select
                                            value={options.service_id || ''}
                                            onChange={(e) => handleOptionsChange('service_id', e.target.value || null)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                        >
                                            <option value="">Seçiniz</option>
                                            {services.map(service => (
                                                <option key={service.id} value={service.id}>
                                                    {service.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Çilingir</label>
                                        <select
                                            value={options.locksmith_id || ''}
                                            onChange={(e) => handleOptionsChange('locksmith_id', e.target.value || null)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                        >
                                            <option value="">Seçiniz</option>
                                            {locksmiths.map(locksmith => (
                                                <option key={locksmith.id} value={locksmith.id}>
                                                    {locksmith.businessname} {locksmith.fullname && `(${locksmith.fullname})`}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Kategori ve Konu */}
                                <div className="space-y-4 mt-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                                        <select
                                            value={options.category_id || ''}
                                            onChange={(e) => handleOptionsChange('category_id', e.target.value || null)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                        >
                                            <option value="">Seçiniz</option>
                                            {categories.map(category => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {options.category_id && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Konu</label>
                                            <select
                                                value={options.topic_id || ''}
                                                onChange={(e) => handleOptionsChange('topic_id', e.target.value || null)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                            >
                                                <option value="">Seçiniz</option>
                                                {categories
                                                    .find(c => c.id === options.category_id)
                                                    ?.blog_topics?.map(topic => (
                                                        <option key={topic.id} value={topic.id}>
                                                            {topic.name}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                    )}
                                </div>

                                {/* Diğer Ayarlar */}
                                <div className="space-y-4 mt-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Kullanıcı Açıklaması</label>
                                        <textarea
                                            value={options.user_description}
                                            onChange={(e) => handleOptionsChange('user_description', e.target.value)}
                                            placeholder="Bu konuda blog yaz..."
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                            rows="3"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">SEO Arama Terimleri</label>
                                        <input
                                            type="text"
                                            value={options.seo_keywords}
                                            onChange={(e) => handleOptionsChange('seo_keywords', e.target.value)}
                                            placeholder="anahtar,kelime,virgül,ile,ayrılmış"
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Öne Çıkarılacak Kelimeler</label>
                                        <input
                                            type="text"
                                            value={options.highlight_keywords}
                                            onChange={(e) => handleOptionsChange('highlight_keywords', e.target.value)}
                                            placeholder="önemli,kelimeler"
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">İçerik Stili</label>
                                        <select
                                            value={options.content_style}
                                            onChange={(e) => handleOptionsChange('content_style', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                        >
                                            <option value="normal">Normal</option>
                                            <option value="formal">Resmi</option>
                                            <option value="friendly">Samimi</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Checkbox Seçenekleri */}
                                <div className="mt-4 space-y-2">
                                    <h4 className="font-medium text-gray-900">Ek Özellikler</h4>
                                    {[
                                        { key: 'include_list', label: 'Liste Formatı' },
                                        { key: 'include_table', label: 'Tablo Ekle' },
                                        { key: 'include_faq', label: 'SSS Ekle' },
                                        { key: 'include_internal_links', label: 'İç Link Alanı Ekle' },
                                        { key: 'include_cta', label: 'Call-to-Action (CTA) Ekle' },
                                        { key: 'include_year', label: 'Yıl Ekle' },
                                        { key: 'light_humor', label: 'Ton Hafif Mizahi Olsun' }
                                    ].map(option => (
                                        <label key={option.key} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={options[option.key]}
                                                onChange={(e) => handleOptionsChange(option.key, e.target.checked)}
                                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                                        </label>
                                    ))}
                                </div>

                                {/* Generate Butonu */}
                                <button
                                    onClick={handleGenerate}
                                    disabled={generating}
                                    className="w-full mt-6 bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 font-medium"
                                >
                                    {generating ? '🤖 AI Üretiyor...' : '🤖 Generate'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* SEO Skoru */}
                    <SEOScoreCard
                        formData={formData}
                        options={options}
                        selectedImage={selectedImage}
                    />


                </div>

                {/* Sağ Panel - Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Görsel */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Görsel</h3>
                            {selectedImage && (
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setImageModalOpen(true)}
                                        className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs hover:bg-blue-700 transition-colors"
                                    >
                                        Değiştir
                                    </button>
                                    <button
                                        onClick={() => setSelectedImage(null)}
                                        className="bg-red-600 text-white px-3 py-1.5 rounded-md text-xs hover:bg-red-700 transition-colors"
                                    >
                                        Kaldır
                                    </button>
                                </div>
                            )}
                        </div>

                        {selectedImage ? (
                            <div className="relative">
                                <img
                                    src={selectedImage.url}
                                    alt={selectedImage.alt_text}
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                                {selectedImage.alt_text && (
                                    <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs text-gray-800 max-w-[calc(100%-1rem)] line-clamp-2">
                                        {selectedImage.alt_text}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={() => setImageModalOpen(true)}
                                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
                            >
                                <div className="text-gray-500">
                                    <div className="text-2xl mb-2">🖼️</div>
                                    <p className="text-sm">Resim Seç</p>
                                </div>
                            </button>
                        )}
                    </div>

                    {/* Başlık ve Slug */}
                    <div className="bg-white p-6 rounded-lg shadow space-y-4">
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="block text-sm font-medium text-gray-700">Başlık</label>
                                <div className="flex items-center gap-2">
                                    <InlineSEOScore
                                        type="title"
                                        formData={formData}
                                        options={options}
                                        selectedImage={selectedImage}
                                        fieldValue={formData.title}
                                        onTextChange={(text) => handleFormChange('title', text)}
                                    />
                                    <AIButton
                                        text={formData.title}
                                        onTextChange={(text) => handleFormChange('title', text)}
                                        fieldType="title"
                                    />
                                </div>
                            </div>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => handleFormChange('title', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                placeholder="Blog başlığı"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="block text-sm font-medium text-gray-700">Slug (URL)</label>
                                <InlineSEOScore
                                    type="slug"
                                    formData={formData}
                                    options={options}
                                    selectedImage={selectedImage}
                                    fieldValue={formData.slug}
                                    onTextChange={(text) => handleFormChange('slug', text)}
                                />
                            </div>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => handleFormChange('slug', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 font-mono text-sm"
                                placeholder="blog-url-slug"
                            />
                        </div>
                    </div>

                    {/* İçerik */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900">İçerik</h3>
                            <div className="flex items-center gap-2">
                                <InlineSEOScore
                                    type="content"
                                    formData={formData}
                                    options={options}
                                    selectedImage={selectedImage}
                                    fieldValue={formData.content}
                                    onTextChange={(text) => handleFormChange('content', text)}
                                />
                                <AIButton
                                    text={formData.content}
                                    onTextChange={(text) => handleFormChange('content', text)}
                                    fieldType="content"
                                />
                            </div>
                        </div>
                        <div data-color-mode="light">
                            <MDEditor
                                value={formData.content}
                                onChange={(val) => handleFormChange('content', val || '')}
                                height={400}
                                preview="edit"
                            />
                        </div>
                    </div>

                    {/* Özet */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Özet (Result)</h3>
                            <AIButton
                                text={formData.result}
                                onTextChange={(text) => handleFormChange('result', text)}
                                fieldType="content"
                            />
                        </div>
                        <div data-color-mode="light">
                            <MDEditor
                                value={formData.result}
                                onChange={(val) => handleFormChange('result', val || '')}
                                height={200}
                                preview="edit"
                            />
                        </div>
                    </div>

                    {/* SEO Alanları */}
                    <div className="bg-white p-6 rounded-lg shadow space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">SEO Ayarları</h3>

                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="block text-sm font-medium text-gray-700">Meta Başlık</label>
                                <AIButton
                                    text={formData.meta_title}
                                    onTextChange={(text) => handleFormChange('meta_title', text)}
                                    fieldType="meta_title"
                                />
                            </div>
                            <input
                                type="text"
                                value={formData.meta_title}
                                onChange={(e) => handleFormChange('meta_title', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                placeholder="SEO için özel başlık (60 karakter)"
                                maxLength="60"
                            />
                            <p className="text-xs text-gray-500 mt-1">{formData.meta_title.length}/60</p>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="block text-sm font-medium text-gray-700">Meta Açıklama</label>
                                <div className="flex items-center gap-2">
                                    <InlineSEOScore
                                        type="meta"
                                        formData={formData}
                                        options={options}
                                        selectedImage={selectedImage}
                                        fieldValue={formData.meta_description}
                                        onTextChange={(text) => handleFormChange('meta_description', text)}
                                    />
                                    <AIButton
                                        text={formData.meta_description}
                                        onTextChange={(text) => handleFormChange('meta_description', text)}
                                        fieldType="meta_description"
                                    />
                                </div>
                            </div>
                            <textarea
                                value={formData.meta_description}
                                onChange={(e) => handleFormChange('meta_description', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                placeholder="Google'da görünecek açıklama (160 karakter)"
                                rows="3"
                                maxLength="160"
                            />
                            <p className="text-xs text-gray-500 mt-1">{formData.meta_description.length}/160</p>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="block text-sm font-medium text-gray-700">Kısa Açıklama (Excerpt)</label>
                                <AIButton
                                    text={formData.excerpt}
                                    onTextChange={(text) => handleFormChange('excerpt', text)}
                                    fieldType="excerpt"
                                />
                            </div>
                            <textarea
                                value={formData.excerpt}
                                onChange={(e) => handleFormChange('excerpt', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                placeholder="Blog listesinde görünecek kısa açıklama"
                                rows="2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Anahtar Kelimeler</label>
                            <input
                                type="text"
                                value={formData.meta_keywords}
                                onChange={(e) => handleFormChange('meta_keywords', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                placeholder="anahtar,kelime,virgül,ile,ayrılmış"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Okuma Süresi (dakika)</label>
                                <input
                                    type="number"
                                    value={formData.reading_time}
                                    onChange={(e) => handleFormChange('reading_time', parseInt(e.target.value) || 0)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                    min="0"
                                />
                            </div>

                            <div className="flex items-end">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_featured}
                                        onChange={(e) => handleFormChange('is_featured', e.target.checked)}
                                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Öne Çıkarılsın</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Resim Seçim Modal */}
            <ImageLibraryModal
                isOpen={imageModalOpen}
                onClose={() => setImageModalOpen(false)}
                onSelectImage={(image) => {
                    setSelectedImage(image)
                    setImageModalOpen(false)
                }}
            />
        </div>
    )
}
