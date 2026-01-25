'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs'
import { ServiceList } from '../../lib/service-list'

// Admin sayfası dynamic rendering'e zorla
export const dynamic = 'force-dynamic'

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('dashboard')
    const [stats, setStats] = useState({
        totalBlogs: 0,
        draftBlogs: 0,
        publishedBlogs: 0,
        archivedBlogs: 0,
        totalImages: 0
    })
    const [loading, setLoading] = useState(true)

    // Şehirler için state
    const [cities, setCities] = useState([])
    const [filteredCities, setFilteredCities] = useState([])
    const [searchFilter, setSearchFilter] = useState('')
    const [citiesLoading, setCitiesLoading] = useState(false)
    const [editedCities, setEditedCities] = useState({}) // { cityId: { original: {...}, current: {...} } }
    const [savingCities, setSavingCities] = useState({}) // { cityId: true/false }
    const [generatingDescriptions, setGeneratingDescriptions] = useState({}) // { cityId: true/false }
    const [notification, setNotification] = useState({ show: false, message: '' })

    // İlçeler için state
    const [selectedProvinceId, setSelectedProvinceId] = useState(null)
    const [selectedProvinceName, setSelectedProvinceName] = useState('')
    const [districts, setDistricts] = useState([])
    const [filteredDistricts, setFilteredDistricts] = useState([])
    const [districtSearchFilter, setDistrictSearchFilter] = useState('')
    const [districtsLoading, setDistrictsLoading] = useState(false)
    const [editedDistricts, setEditedDistricts] = useState({}) // { districtId: { original: {...}, current: {...} } }
    const [savingDistricts, setSavingDistricts] = useState({}) // { districtId: true/false }
    const [generatingDistrictDescriptions, setGeneratingDistrictDescriptions] = useState({}) // { districtId: true/false }

    useEffect(() => {
        if (activeTab === 'dashboard') {
            fetchStats()
        } else if (activeTab === 'cities') {
            fetchCities()
        }
    }, [activeTab])

    useEffect(() => {
        if (selectedProvinceId && activeTab === 'cities') {
            fetchDistricts(selectedProvinceId)
        }
    }, [selectedProvinceId, activeTab])

    useEffect(() => {
        if (searchFilter) {
            const filtered = cities.filter(city =>
                city.name?.toLowerCase().includes(searchFilter.toLowerCase()) ||
                city.slug?.toLowerCase().includes(searchFilter.toLowerCase())
            )
            setFilteredCities(filtered)
        } else {
            setFilteredCities(cities)
        }
    }, [searchFilter, cities])

    useEffect(() => {
        if (districtSearchFilter) {
            const filtered = districts.filter(district =>
                district.name?.toLowerCase().includes(districtSearchFilter.toLowerCase()) ||
                district.slug?.toLowerCase().includes(districtSearchFilter.toLowerCase())
            )
            setFilteredDistricts(filtered)
        } else {
            setFilteredDistricts(districts)
        }
    }, [districtSearchFilter, districts])

    const fetchStats = async () => {
        try {
            const responses = await Promise.all([
                fetch('/api/admin/blogs'),
                fetch('/api/admin/blogs?status=draft'),
                fetch('/api/admin/blogs?status=published'),
                fetch('/api/admin/blogs?status=archived'),
                fetch('/api/admin/images')
            ])

            const [blogData, draftData, publishedData, archivedData, imageData] = await Promise.all(
                responses.map(r => r.json())
            )

            setStats({
                totalBlogs: blogData.pagination?.total || 0,
                draftBlogs: draftData.pagination?.total || 0,
                publishedBlogs: publishedData.pagination?.total || 0,
                archivedBlogs: archivedData.pagination?.total || 0,
                totalImages: imageData.pagination?.total || 0
            })
        } catch (error) {
            console.error('İstatistikler yüklenirken hata:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchCities = async () => {
        setCitiesLoading(true)
        try {
            const response = await fetch('/api/admin/provinces')
            const result = await response.json()
            if (result.success) {
                setCities(result.data || [])
                setFilteredCities(result.data || [])
                // Orijinal verileri sakla
                const originalData = {}
                result.data.forEach(city => {
                    originalData[city.id] = { ...city }
                })
                setEditedCities(originalData)
            }
        } catch (error) {
            console.error('Şehirler yüklenirken hata:', error)
        } finally {
            setCitiesLoading(false)
        }
    }

    const handleCityChange = (cityId, field, value) => {
        // Name ve slug güncellenemez
        if (field === 'name' || field === 'slug') return

        // Functional update kullanarak cities state'ini güncelle
        setCities(prevCities => {
            const city = prevCities.find(c => c.id === cityId)
            if (!city) return prevCities

            const updatedCity = { ...city, [field]: value }
            return prevCities.map(c => c.id === cityId ? updatedCity : c)
        })

        // Filtered cities'i ayrı olarak güncelle (functional update ile)
        setFilteredCities(prevFiltered => {
            return prevFiltered.map(c => {
                if (c.id === cityId) {
                    return { ...c, [field]: value }
                }
                return c
            })
        })

        // Değişiklik kontrolü - cities state'inden güncel değeri al
        setCities(prevCities => {
            const city = prevCities.find(c => c.id === cityId)
            if (!city) return prevCities

            const updatedCity = { ...city, [field]: value }

            setEditedCities(prevEdited => {
                const original = prevEdited[cityId]
                const hasChanges = original && (
                    original.lat !== updatedCity.lat ||
                    original.lng !== updatedCity.lng ||
                    original.description !== updatedCity.description
                )

                if (hasChanges) {
                    return {
                        ...prevEdited,
                        [cityId]: { ...prevEdited[cityId], current: updatedCity }
                    }
                } else {
                    const newState = { ...prevEdited }
                    if (newState[cityId]) {
                        delete newState[cityId].current
                    }
                    return newState
                }
            })

            return prevCities
        })
    }

    const handleBulkCoordinateChange = (cityId, lat, lng) => {
        // Functional update kullanarak cities state'ini güncelle
        setCities(prevCities => {
            const city = prevCities.find(c => c.id === cityId)
            if (!city) return prevCities

            const updatedCity = { ...city, lat, lng }
            return prevCities.map(c => c.id === cityId ? updatedCity : c)
        })

        // Filtered cities'i ayrı olarak güncelle
        setFilteredCities(prevFiltered => {
            return prevFiltered.map(c => {
                if (c.id === cityId) {
                    return { ...c, lat, lng }
                }
                return c
            })
        })

        // Değişiklik kontrolü
        setCities(prevCities => {
            const city = prevCities.find(c => c.id === cityId)
            if (!city) return prevCities

            const updatedCity = { ...city, lat, lng }

            setEditedCities(prevEdited => {
                const original = prevEdited[cityId]
                const hasChanges = original && (
                    original.lat !== updatedCity.lat ||
                    original.lng !== updatedCity.lng ||
                    original.description !== updatedCity.description
                )

                if (hasChanges) {
                    return {
                        ...prevEdited,
                        [cityId]: { ...prevEdited[cityId], current: updatedCity }
                    }
                } else {
                    const newState = { ...prevEdited }
                    if (newState[cityId]) {
                        delete newState[cityId].current
                    }
                    return newState
                }
            })

            return prevCities
        })
    }

    const hasUnsavedChanges = (cityId) => {
        const edited = editedCities[cityId]
        if (!edited || !edited.current) return false
        const original = edited.original || edited
        const current = edited.current
        return (
            original.lat !== current.lat ||
            original.lng !== current.lng ||
            original.description !== current.description
        )
    }

    const showNotification = (message) => {
        setNotification({ show: true, message })
        setTimeout(() => {
            setNotification({ show: false, message: '' })
        }, 3000)
    }

    const copyCityName = async (cityName) => {
        try {
            await navigator.clipboard.writeText(cityName)
            showNotification('Şehir adı kopyalandı')
        } catch (error) {
            console.error('Kopyalama hatası:', error)
            // Fallback: Eski yöntem
            const textArea = document.createElement('textarea')
            textArea.value = cityName
            document.body.appendChild(textArea)
            textArea.select()
            document.execCommand('copy')
            document.body.removeChild(textArea)
            showNotification('Şehir adı kopyalandı')
        }
    }

    const copyPrompt = async (cityName, citySlug) => {
        // Prompt'u oluştur (API'deki prompt ile aynı mantık)
        const featuredServices = ServiceList.filter(service => service.isFeatured === true)
        const currentYear = new Date().getFullYear()

        const prompt = `"${cityName}" şehri için çilingir hizmetlerini tanıtan, Google'da il bazlı aramalarda güçlü sıralama alabilecek, kullanıcı odaklı ve SEO uyumlu bir açıklama metni yaz. Google'ın rich snippet (zengin sonuç) gösterebilmesi için fiyat bilgilerini net ve yapılandırılmış şekilde içermelidir.

AMAÇ:
Bu metin, "${cityName} çilingir" araması yapan bir kullanıcının güven duymasını, hizmetleri hızlıca anlamasını ve sayfada kalmasını sağlamalıdır. Google'ın "çilingir fiyatları" gibi aramalarda rich snippet gösterebilmesi için fiyat bilgilerini net şekilde içermelidir.

YAZIM KURALLARI:
- Metin 2 paragraf olmalı
- Toplam uzunluk 400–500 kelime arasında olmalı
- Dil doğal, akıcı ve bilgilendirici olmalı
- Anahtar kelime doldurma (keyword stuffing) yapılmamalı
- Metin tamamen özgün olmalı, şablon hissi vermemeli
- Fiyat bilgileri doğal akış içinde, yapılandırılmış şekilde verilmeli

İÇERİK YAPISI:

1. PARAGRAF (Yerel bağlam + ihtiyaç):
- "${cityName}" şehrinin günlük yaşam temposu, nüfus yoğunluğu veya şehir yapısına kısa ve özgün bir şekilde değin
- Anahtar kaybı, kapıda kalma, kilit arızası gibi gerçek kullanıcı problemlerinden bahset
- "${cityName}" genelinde hızlı ve güvenilir çilingir hizmetinin neden önemli olduğunu açıkla
- "${cityName} çilingir" ve "çilingir ${cityName}" ifadelerini doğal şekilde kullan

2. PARAGRAF (Hizmetler + fiyat bilgileri - Rich Snippet için):
- "${cityName}"'da sunulan öne çıkan çilingir hizmetlerini detaylandır. Sadece şu hizmetleri kullan:
  ${featuredServices.map(s => s.name).join(', ')}
- Her hizmet için fiyat aralığını net şekilde belirt. Fiyat bilgileri:
  ${featuredServices.map(s => `"${s.name}" hizmeti ${s.price.min}-${s.price.max} TL aralığında`).join(', ')}
- Fiyat bilgilerini şu şekilde doğal akışta kullan:
  - "${cityName} çilingir fiyatları ${currentYear}" ifadesini kullan
  - "çilingir fiyatları ${currentYear} ${cityName}" ifadesini kullan
  - "çilingir ücreti ${cityName}" ifadesini kullan
  - "çilingir kapı açma fiyatı ${cityName} ${currentYear}" ifadesini kullan (Kapı Açma için 500-900 TL aralığını belirt)
  - "çilingir kapı açma ücreti ${cityName} ${currentYear}" ifadesini kullan
- Fiyatların hizmet türüne, saatine (mesai/akşam/gece) ve duruma göre değişebileceğini belirt
- Hizmetlerin acil durumlar ve farklı saat dilimleri için sunulabildiğini vurgula
- "${cityName} anahtar kopyalama" ve "${cityName} elektronik anahtar" ifadelerini doğal bağlamda kullan
- "${currentYear}" yılına güncel hizmet anlayışı çerçevesinde atıf yap

FİYAT BİLGİLERİ (Google Rich Snippet için):
Aşağıdaki fiyat bilgilerini metinde doğal şekilde kullan:
${featuredServices.map(s => `- ${s.name}: ${s.price.min}-${s.price.max} TL`).join('\n')}

Bu fiyatlar "${cityName} çilingir fiyatları", "çilingir fiyatları ${currentYear} ${cityName}", "çilingir ücreti ${cityName}" gibi aramalar için Google'ın rich snippet gösterebilmesi için net şekilde belirtilmelidir.

EK KRİTERLER:
- Metin kullanıcıya güven veren bir ton taşımalı
- "En ucuz", "tek", "en iyi" gibi iddialı ve riskli ifadeler kullanılmamalı
- İl sayfası için yazıldığı net şekilde hissedilmeli
- Fiyat bilgileri Google'ın anlayabileceği şekilde yapılandırılmış olmalı (örn: "500-900 TL aralığında", "100-500 TL civarında")

Sadece açıklama metnini yaz. Başlık, madde işareti, tırnak veya ek açıklama ekleme.`

        try {
            await navigator.clipboard.writeText(prompt)
            showNotification('Prompt kopyalandı')
        } catch (error) {
            console.error('Kopyalama hatası:', error)
            // Fallback: Eski yöntem
            const textArea = document.createElement('textarea')
            textArea.value = prompt
            document.body.appendChild(textArea)
            textArea.select()
            document.execCommand('copy')
            document.body.removeChild(textArea)
            showNotification('Prompt kopyalandı')
        }
    }

    const generateDescription = async (cityId, cityName, citySlug) => {
        setGeneratingDescriptions(prev => ({ ...prev, [cityId]: true }))
        try {
            const response = await fetch('/api/admin/provinces/generate-description', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cityName: cityName,
                    citySlug: citySlug
                })
            })

            const result = await response.json()
            if (result.description) {
                // Functional update ile sadece bu şehri güncelle, diğer şehirleri etkileme
                // Cities state'ini güncelle
                setCities(prevCities => {
                    const city = prevCities.find(c => c.id === cityId)
                    if (!city) return prevCities

                    const updatedCity = { ...city, description: result.description }
                    return prevCities.map(c => c.id === cityId ? updatedCity : c)
                })

                // Filtered cities'i ayrı olarak güncelle
                setFilteredCities(prevFiltered => {
                    return prevFiltered.map(c => {
                        if (c.id === cityId) {
                            return { ...c, description: result.description }
                        }
                        return c
                    })
                })

                // Değişiklik kontrolü
                setCities(prevCities => {
                    const city = prevCities.find(c => c.id === cityId)
                    if (!city) return prevCities

                    const updatedCity = { ...city, description: result.description }

                    setEditedCities(prevEdited => {
                        const original = prevEdited[cityId]
                        const hasChanges = original && (
                            original.lat !== updatedCity.lat ||
                            original.lng !== updatedCity.lng ||
                            original.description !== updatedCity.description
                        )

                        if (hasChanges) {
                            return {
                                ...prevEdited,
                                [cityId]: { ...prevEdited[cityId], current: updatedCity }
                            }
                        } else {
                            const newState = { ...prevEdited }
                            if (newState[cityId]) {
                                delete newState[cityId].current
                            }
                            return newState
                        }
                    })

                    return prevCities
                })
            } else {
                alert('Açıklama oluşturulurken hata oluştu: ' + (result.error || 'Bilinmeyen hata'))
            }
        } catch (error) {
            console.error('Description generate hatası:', error)
            alert('Açıklama oluşturulurken hata oluştu')
        } finally {
            setGeneratingDescriptions(prev => ({ ...prev, [cityId]: false }))
        }
    }

    // İlçeler için fonksiyonlar
    const fetchDistricts = async (provinceId) => {
        setDistrictsLoading(true)
        try {
            const response = await fetch(`/api/admin/districts?province_id=${provinceId}`)
            const result = await response.json()
            if (result.success) {
                setDistricts(result.data || [])
                setFilteredDistricts(result.data || [])
                // Orijinal verileri sakla
                const originalData = {}
                result.data.forEach(district => {
                    originalData[district.id] = { ...district }
                })
                setEditedDistricts(originalData)
            }
        } catch (error) {
            console.error('İlçeler yüklenirken hata:', error)
        } finally {
            setDistrictsLoading(false)
        }
    }

    const handleDistrictChange = (districtId, field, value) => {
        // Name ve slug güncellenemez
        if (field === 'name' || field === 'slug') return

        // Functional update kullanarak districts state'ini güncelle
        setDistricts(prevDistricts => {
            const district = prevDistricts.find(d => d.id === districtId)
            if (!district) return prevDistricts

            const updatedDistrict = { ...district, [field]: value }
            return prevDistricts.map(d => d.id === districtId ? updatedDistrict : d)
        })

        // Filtered districts'i ayrı olarak güncelle
        setFilteredDistricts(prevFiltered => {
            return prevFiltered.map(d => {
                if (d.id === districtId) {
                    return { ...d, [field]: value }
                }
                return d
            })
        })

        // Değişiklik kontrolü
        setDistricts(prevDistricts => {
            const district = prevDistricts.find(d => d.id === districtId)
            if (!district) return prevDistricts

            const updatedDistrict = { ...district, [field]: value }

            setEditedDistricts(prevEdited => {
                const original = prevEdited[districtId]
                const hasChanges = original && (
                    original.lat !== updatedDistrict.lat ||
                    original.lng !== updatedDistrict.lng ||
                    original.description !== updatedDistrict.description
                )

                if (hasChanges) {
                    return {
                        ...prevEdited,
                        [districtId]: { ...prevEdited[districtId], current: updatedDistrict }
                    }
                } else {
                    const newState = { ...prevEdited }
                    if (newState[districtId]) {
                        delete newState[districtId].current
                    }
                    return newState
                }
            })

            return prevDistricts
        })
    }

    const handleBulkDistrictCoordinateChange = (districtId, lat, lng) => {
        // Functional update kullanarak districts state'ini güncelle
        setDistricts(prevDistricts => {
            const district = prevDistricts.find(d => d.id === districtId)
            if (!district) return prevDistricts

            const updatedDistrict = { ...district, lat, lng }
            return prevDistricts.map(d => d.id === districtId ? updatedDistrict : d)
        })

        // Filtered districts'i ayrı olarak güncelle
        setFilteredDistricts(prevFiltered => {
            return prevFiltered.map(d => {
                if (d.id === districtId) {
                    return { ...d, lat, lng }
                }
                return d
            })
        })

        // Değişiklik kontrolü
        setDistricts(prevDistricts => {
            const district = prevDistricts.find(d => d.id === districtId)
            if (!district) return prevDistricts

            const updatedDistrict = { ...district, lat, lng }

            setEditedDistricts(prevEdited => {
                const original = prevEdited[districtId]
                const hasChanges = original && (
                    original.lat !== updatedDistrict.lat ||
                    original.lng !== updatedDistrict.lng ||
                    original.description !== updatedDistrict.description
                )

                if (hasChanges) {
                    return {
                        ...prevEdited,
                        [districtId]: { ...prevEdited[districtId], current: updatedDistrict }
                    }
                } else {
                    const newState = { ...prevEdited }
                    if (newState[districtId]) {
                        delete newState[districtId].current
                    }
                    return newState
                }
            })

            return prevDistricts
        })
    }

    const hasUnsavedDistrictChanges = (districtId) => {
        const edited = editedDistricts[districtId]
        if (!edited || !edited.current) return false
        const original = edited.original || edited
        const current = edited.current
        return (
            original.lat !== current.lat ||
            original.lng !== current.lng ||
            original.description !== current.description
        )
    }

    const saveDistrict = async (districtId) => {
        const edited = editedDistricts[districtId]
        if (!edited || !edited.current) return

        setSavingDistricts(prev => ({ ...prev, [districtId]: true }))
        try {
            const response = await fetch('/api/admin/districts', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: districtId,
                    lat: edited.current.lat,
                    lng: edited.current.lng,
                    description: edited.current.description
                })
            })

            const result = await response.json()
            if (result.success) {
                // Başarılı güncelleme sonrası orijinal veriyi güncelle
                setEditedDistricts(prev => ({
                    ...prev,
                    [districtId]: { original: result.data }
                }))
                // İlçe listesini güncelle
                const updatedDistricts = districts.map(d => d.id === districtId ? result.data : d)
                setDistricts(updatedDistricts)
                setFilteredDistricts(updatedDistricts.filter(d =>
                    !districtSearchFilter ||
                    d.name?.toLowerCase().includes(districtSearchFilter.toLowerCase()) ||
                    d.slug?.toLowerCase().includes(districtSearchFilter.toLowerCase())
                ))
            } else {
                alert('İlçe güncellenirken hata oluştu')
            }
        } catch (error) {
            console.error('İlçe kaydedilirken hata:', error)
            alert('İlçe kaydedilirken hata oluştu')
        } finally {
            setSavingDistricts(prev => ({ ...prev, [districtId]: false }))
        }
    }

    const copyDistrictName = async (districtName) => {
        try {
            const fullName = selectedProvinceName ? `${selectedProvinceName} ${districtName}` : districtName
            await navigator.clipboard.writeText(fullName)
            showNotification('İlçe adı kopyalandı')
        } catch (error) {
            console.error('Kopyalama hatası:', error)
            // Fallback: Eski yöntem
            const textArea = document.createElement('textarea')
            const fullName = selectedProvinceName ? `${selectedProvinceName} ${districtName}` : districtName
            textArea.value = fullName
            document.body.appendChild(textArea)
            textArea.select()
            document.execCommand('copy')
            document.body.removeChild(textArea)
            showNotification('İlçe adı kopyalandı')
        }
    }

    const copyDistrictPrompt = async (districtName, cityName, districtSlug) => {
        // Prompt'u oluştur (API'deki prompt ile aynı mantık)
        const featuredServices = ServiceList.filter(service => service.isFeatured === true)
        const currentYear = new Date().getFullYear()

        const prompt = `"${cityName}" şehrinin "${districtName}" ilçesi için çilingir hizmetlerini tanıtan, Google'da ilçe bazlı aramalarda güçlü sıralama alabilecek, kullanıcı odaklı ve SEO uyumlu bir açıklama metni yaz. Google'ın rich snippet (zengin sonuç) gösterebilmesi için fiyat bilgilerini net ve yapılandırılmış şekilde içermelidir.

AMAÇ:
Bu metin, "${districtName} çilingir", "${cityName} ${districtName} çilingir" araması yapan bir kullanıcının güven duymasını, hizmetleri hızlıca anlamasını ve sayfada kalmasını sağlamalıdır. Google'ın "çilingir fiyatları" gibi aramalarda rich snippet gösterebilmesi için fiyat bilgilerini net şekilde içermelidir.

YAZIM KURALLARI:
- Metin 2 paragraf olmalı
- Toplam uzunluk 400–500 kelime arasında olmalı
- Dil doğal, akıcı ve bilgilendirici olmalı
- Anahtar kelime doldurma (keyword stuffing) yapılmamalı
- Metin tamamen özgün olmalı, şablon hissi vermemeli
- Fiyat bilgileri doğal akış içinde, yapılandırılmış şekilde verilmeli
- Metni Markdown formatında yaz: Önemli kısımları **kalın** yap (çift yıldız ile)
- Hizmet isimleri, fiyat bilgileri ve önemli SEO terimleri **kalın** olmalı

İÇERİK YAPISI:

1. PARAGRAF (Yerel bağlam + ihtiyaç):
- "${districtName}" ilçesinin ${cityName} içindeki konumu, özellikleri veya günlük yaşam temposuna kısa ve özgün bir şekilde değin
- Anahtar kaybı, kapıda kalma, kilit arızası gibi gerçek kullanıcı problemlerinden bahset
- "${districtName}" ilçesinde hızlı ve güvenilir çilingir hizmetinin neden önemli olduğunu açıkla
- "${districtName} çilingir", "${cityName} ${districtName} çilingir", "çilingir ${districtName}" ifadelerini doğal şekilde kullan ve **kalın** yap

2. PARAGRAF (Hizmetler + fiyat bilgileri - Rich Snippet için):
- "${districtName}" ilçesinde sunulan öne çıkan çilingir hizmetlerini detaylandır. Sadece şu hizmetleri kullan:
  ${featuredServices.map(s => s.name).join(', ')}
- Metni Markdown formatında yaz ve önemli kısımları **kalın** yap:
  - Hizmet isimlerini **kalın** yaz (örn: **Acil Çilingir**, **Kapı Açma**)
  - Fiyat bilgilerini **kalın** yaz (örn: **500-900 TL**, **100-500 TL**)
  - Önemli SEO terimlerini **kalın** yaz (örn: **${districtName} çilingir fiyatları**)
- Her hizmet için MUTLAKA doğru fiyat aralığını kullan. Fiyat bilgileri (KESINLIKLE DOĞRU KULLAN - HER HİZMET İÇİN FARKLI FİYAT VAR):
${featuredServices.map(s => `  - **${s.name}** hizmeti: MUTLAKA **${s.price.min}-${s.price.max} TL** yaz (Başka fiyat yazma, sadece bu fiyatı kullan!)`).join('\n')}
- Fiyat bilgilerini şu şekilde doğal akışta kullan:
  - "${districtName} çilingir fiyatları ${currentYear}" ifadesini kullan ve **kalın** yap
  - "${cityName} ${districtName} çilingir fiyatları ${currentYear}" ifadesini kullan ve **kalın** yap
  - "çilingir fiyatları ${currentYear} ${districtName}" ifadesini kullan ve **kalın** yap
  - "çilingir ücreti ${districtName}" ifadesini kullan ve **kalın** yap
  - "çilingir kapı açma fiyatı ${districtName} ${currentYear}" ifadesini kullan ve **kalın** yap (Kapı Açma için MUTLAKA **500-900 TL** aralığını belirt, ASLA 100-500 TL yazma!)
  - "çilingir kapı açma ücreti ${districtName} ${currentYear}" ifadesini kullan ve **kalın** yap
- Her hizmeti bahsederken MUTLAKA doğru fiyatını yaz. ÖRNEKLER:
  - "**Acil Çilingir** hizmeti **100-500 TL** aralığında" şeklinde yaz
  - "**Otomobil Çilingir** hizmeti **100-500 TL** aralığında" şeklinde yaz
  - "**Kasa Çilingir** hizmeti **100-500 TL** aralığında" şeklinde yaz
  - "**Kapı Açma** hizmeti **500-900 TL** aralığında" şeklinde yaz (ASLA 100-500 TL yazma, sadece 500-900 TL!)
- Fiyatların hizmet türüne, saatine (mesai/akşam/gece) ve duruma göre değişebileceğini belirt
- Hizmetlerin acil durumlar ve farklı saat dilimleri için sunulabildiğini vurgula
- "${districtName} anahtar kopyalama" ve "${districtName} elektronik anahtar" ifadelerini doğal bağlamda kullan ve **kalın** yap
- "${currentYear}" yılına güncel hizmet anlayışı çerçevesinde atıf yap

FİYAT BİLGİLERİ (Google Rich Snippet için - KESINLIKLE DOĞRU KULLAN):
Aşağıdaki fiyat bilgilerini metinde doğal şekilde kullan ve **kalın** yap. HER HİZMET İÇİN DOĞRU FİYATI KULLAN:
${featuredServices.map(s => `- **${s.name}**: **${s.price.min}-${s.price.max} TL** (Bu fiyatı KESINLIKLE kullan, başka fiyat yazma!)`).join('\n')}

KRİTİK UYARI: 
- **Kapı Açma** hizmeti için ASLA 100-500 TL yazma, MUTLAKA **500-900 TL** yaz!
- **Acil Çilingir**, **Otomobil Çilingir** ve **Kasa Çilingir** için **100-500 TL** kullan, başka fiyat yazma!
- Her hizmet için farklı fiyat var, karıştırma! Kapı Açma daha pahalı (500-900 TL), diğerleri daha ucuz (100-500 TL).

Bu fiyatlar "${districtName} çilingir fiyatları", "${cityName} ${districtName} çilingir fiyatları", "çilingir fiyatları ${currentYear} ${districtName}", "çilingir ücreti ${districtName}" gibi aramalar için Google'ın rich snippet gösterebilmesi için net şekilde belirtilmelidir.

EK KRİTERLER:
- Metin kullanıcıya güven veren bir ton taşımalı
- "En ucuz", "tek", "en iyi" gibi iddialı ve riskli ifadeler kullanılmamalı
- İlçe sayfası için yazıldığı net şekilde hissedilmeli
- Fiyat bilgileri Google'ın anlayabileceği şekilde yapılandırılmış olmalı (örn: "500-900 TL aralığında", "100-500 TL civarında")

Sadece açıklama metnini yaz. Başlık, madde işareti, tırnak veya ek açıklama ekleme.
Metni Markdown formatında yaz ve önemli kısımları **kalın** yap (çift yıldız ile).`

        try {
            await navigator.clipboard.writeText(prompt)
            showNotification('Prompt kopyalandı')
        } catch (error) {
            console.error('Kopyalama hatası:', error)
            // Fallback: Eski yöntem
            const textArea = document.createElement('textarea')
            textArea.value = prompt
            document.body.appendChild(textArea)
            textArea.select()
            document.execCommand('copy')
            document.body.removeChild(textArea)
            showNotification('Prompt kopyalandı')
        }
    }

    const generateDistrictDescription = async (districtId, districtName, cityName, districtSlug) => {
        setGeneratingDistrictDescriptions(prev => ({ ...prev, [districtId]: true }))
        try {
            const response = await fetch('/api/admin/districts/generate-description', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    districtName: districtName,
                    cityName: cityName,
                    districtSlug: districtSlug
                })
            })

            const result = await response.json()
            if (result.description) {
                // Functional update ile sadece bu ilçeyi güncelle
                setDistricts(prevDistricts => {
                    const district = prevDistricts.find(d => d.id === districtId)
                    if (!district) return prevDistricts

                    const updatedDistrict = { ...district, description: result.description }
                    return prevDistricts.map(d => d.id === districtId ? updatedDistrict : d)
                })

                // Filtered districts'i ayrı olarak güncelle
                setFilteredDistricts(prevFiltered => {
                    return prevFiltered.map(d => {
                        if (d.id === districtId) {
                            return { ...d, description: result.description }
                        }
                        return d
                    })
                })

                // Değişiklik kontrolü
                setDistricts(prevDistricts => {
                    const district = prevDistricts.find(d => d.id === districtId)
                    if (!district) return prevDistricts

                    const updatedDistrict = { ...district, description: result.description }

                    setEditedDistricts(prevEdited => {
                        const original = prevEdited[districtId]
                        const hasChanges = original && (
                            original.lat !== updatedDistrict.lat ||
                            original.lng !== updatedDistrict.lng ||
                            original.description !== updatedDistrict.description
                        )

                        if (hasChanges) {
                            return {
                                ...prevEdited,
                                [districtId]: { ...prevEdited[districtId], current: updatedDistrict }
                            }
                        } else {
                            const newState = { ...prevEdited }
                            if (newState[districtId]) {
                                delete newState[districtId].current
                            }
                            return newState
                        }
                    })

                    return prevDistricts
                })
            } else {
                alert('Açıklama oluşturulurken hata oluştu: ' + (result.error || 'Bilinmeyen hata'))
            }
        } catch (error) {
            console.error('Description generate hatası:', error)
            alert('Açıklama oluşturulurken hata oluştu')
        } finally {
            setGeneratingDistrictDescriptions(prev => ({ ...prev, [districtId]: false }))
        }
    }

    const saveCity = async (cityId) => {
        const edited = editedCities[cityId]
        if (!edited || !edited.current) return

        setSavingCities(prev => ({ ...prev, [cityId]: true }))
        try {
            const response = await fetch('/api/admin/provinces', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: cityId,
                    lat: edited.current.lat,
                    lng: edited.current.lng,
                    description: edited.current.description
                })
            })

            const result = await response.json()
            if (result.success) {
                // Başarılı güncelleme sonrası orijinal veriyi güncelle
                setEditedCities(prev => ({
                    ...prev,
                    [cityId]: { original: result.data }
                }))
                // Şehir listesini güncelle
                const updatedCities = cities.map(c => c.id === cityId ? result.data : c)
                setCities(updatedCities)
                setFilteredCities(updatedCities.filter(c =>
                    !searchFilter ||
                    c.name?.toLowerCase().includes(searchFilter.toLowerCase()) ||
                    c.slug?.toLowerCase().includes(searchFilter.toLowerCase())
                ))
            } else {
                alert('Şehir güncellenirken hata oluştu')
            }
        } catch (error) {
            console.error('Şehir kaydedilirken hata:', error)
            alert('Şehir kaydedilirken hata oluştu')
        } finally {
            setSavingCities(prev => ({ ...prev, [cityId]: false }))
        }
    }

    if (loading && activeTab === 'dashboard') {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Bildirim */}
            {notification.show && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 bg-green-500 text-white rounded-lg shadow-lg flex items-center gap-2 animate-fadeIn">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{notification.message}</span>
                </div>
            )}

            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Blog yönetim paneline hoş geldiniz</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                    <TabsTrigger value="cities">Şehirler</TabsTrigger>
                </TabsList>

                <TabsContent value="dashboard" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">📊</div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Toplam Blog</p>
                                    <p className="text-2xl font-semibold text-gray-900">{stats.totalBlogs}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">📄</div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Draft</p>
                                    <p className="text-2xl font-semibold text-gray-900">{stats.draftBlogs}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">🌐</div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Yayınlanan</p>
                                    <p className="text-2xl font-semibold text-gray-900">{stats.publishedBlogs}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">📦</div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Arşivlenen</p>
                                    <p className="text-2xl font-semibold text-gray-900">{stats.archivedBlogs}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">🖼️</div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Resimler</p>
                                    <p className="text-2xl font-semibold text-gray-900">{stats.totalImages}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="cities" className="mt-6">
                    <div className="space-y-4">
                        {selectedProvinceId ? (
                            // İlçe Listesi Görünümü
                            <>
                                {/* Geri Dön Butonu */}
                                <div className="bg-white rounded-lg shadow p-4">
                                    <button
                                        onClick={() => {
                                            setSelectedProvinceId(null)
                                            setSelectedProvinceName('')
                                            setDistricts([])
                                            setFilteredDistricts([])
                                            setDistrictSearchFilter('')
                                        }}
                                        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        Şehir Listesine Dön
                                    </button>
                                    <h2 className="mt-2 text-lg font-semibold text-gray-900">{selectedProvinceName} İlçeleri</h2>
                                </div>

                                {/* Filtreleme */}
                                <div className="bg-white rounded-lg shadow p-4">
                                    <input
                                        type="text"
                                        placeholder="İlçe adı veya slug ile ara..."
                                        value={districtSearchFilter}
                                        onChange={(e) => setDistrictSearchFilter(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                {districtsLoading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-lg shadow overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adı</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>Koordinatlar (Lat, Lng)</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {filteredDistricts.map((district) => {
                                                        const citySlug = cities.find(c => c.id === district.province_id)?.slug || ''
                                                        return (
                                                            <tr key={district.id} className={hasUnsavedDistrictChanges(district.id) ? 'bg-yellow-50' : ''}>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{district.id}</td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="flex items-center gap-2">
                                                                        <Link
                                                                            href={`/${citySlug}/${district.slug}`}
                                                                            target="_blank"
                                                                            className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
                                                                        >
                                                                            {district.name}
                                                                        </Link>
                                                                        <button
                                                                            onClick={() => copyDistrictName(district.name)}
                                                                            className="p-1 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                                                                            title="İlçe adını kopyala"
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                                            </svg>
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4" colSpan={2}>
                                                                    <div className="space-y-2">
                                                                        {/* Toplu Input */}
                                                                        <input
                                                                            type="text"
                                                                            placeholder="36.9975753,35.1232555"
                                                                            onBlur={(e) => {
                                                                                const value = e.target.value.trim()
                                                                                if (value.includes(',')) {
                                                                                    const parts = value.split(',').map(p => p.trim())
                                                                                    if (parts.length === 2) {
                                                                                        const lat = parts[0] === '' ? null : (isNaN(parseFloat(parts[0])) ? null : parseFloat(parts[0]))
                                                                                        const lng = parts[1] === '' ? null : (isNaN(parseFloat(parts[1])) ? null : parseFloat(parts[1]))
                                                                                        if (lat !== null || lng !== null) {
                                                                                            handleBulkDistrictCoordinateChange(district.id, lat, lng)
                                                                                            e.target.value = ''
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }}
                                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                                                        />
                                                                        {/* Ayrı Inputlar */}
                                                                        <div className="grid grid-cols-2 gap-2">
                                                                            <div>
                                                                                <label className="block text-xs text-gray-500 mb-1">Lat</label>
                                                                                <input
                                                                                    type="text"
                                                                                    value={district.lat !== null && district.lat !== undefined ? district.lat.toString() : ''}
                                                                                    onChange={(e) => {
                                                                                        const value = e.target.value.trim()
                                                                                        handleDistrictChange(district.id, 'lat', value === '' ? null : (isNaN(parseFloat(value)) ? null : parseFloat(value)))
                                                                                    }}
                                                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <label className="block text-xs text-gray-500 mb-1">Lng</label>
                                                                                <input
                                                                                    type="text"
                                                                                    value={district.lng !== null && district.lng !== undefined ? district.lng.toString() : ''}
                                                                                    onChange={(e) => {
                                                                                        const value = e.target.value.trim()
                                                                                        handleDistrictChange(district.id, 'lng', value === '' ? null : (isNaN(parseFloat(value)) ? null : parseFloat(value)))
                                                                                    }}
                                                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <div className="flex items-start gap-2">
                                                                        <textarea
                                                                            value={district.description || ''}
                                                                            onChange={(e) => handleDistrictChange(district.id, 'description', e.target.value)}
                                                                            rows={4}
                                                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                        />
                                                                        <div className="flex flex-col gap-1">
                                                                            <button
                                                                                onClick={() => generateDistrictDescription(district.id, district.name, selectedProvinceName, district.slug)}
                                                                                disabled={generatingDistrictDescriptions[district.id]}
                                                                                className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                                                title="AI ile açıklama oluştur"
                                                                            >
                                                                                {generatingDistrictDescriptions[district.id] ? (
                                                                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                                    </svg>
                                                                                ) : (
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                                                    </svg>
                                                                                )}
                                                                            </button>
                                                                            <button
                                                                                onClick={() => copyDistrictPrompt(district.name, selectedProvinceName, district.slug)}
                                                                                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-colors"
                                                                                title="Prompt'u kopyala"
                                                                            >
                                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                                                </svg>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    {hasUnsavedDistrictChanges(district.id) && (
                                                                        <button
                                                                            onClick={() => saveDistrict(district.id)}
                                                                            disabled={savingDistricts[district.id]}
                                                                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                        >
                                                                            {savingDistricts[district.id] ? 'Kaydediliyor...' : 'Kaydet'}
                                                                        </button>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            // Şehir Listesi Görünümü
                            <>
                                {/* Filtreleme */}
                                <div className="bg-white rounded-lg shadow p-4">
                                    <input
                                        type="text"
                                        placeholder="Şehir adı veya slug ile ara..."
                                        value={searchFilter}
                                        onChange={(e) => setSearchFilter(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                {/* Şehir Listesi */}
                                {citiesLoading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-lg shadow overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adı</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={2}>Koordinatlar (Lat, Lng)</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {filteredCities.map((city) => (
                                                        <tr key={city.id} className={hasUnsavedChanges(city.id) ? 'bg-yellow-50' : ''}>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{city.id}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center gap-2">
                                                                    <button
                                                                        onClick={() => {
                                                                            setSelectedProvinceId(city.id)
                                                                            setSelectedProvinceName(city.name)
                                                                        }}
                                                                        className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
                                                                    >
                                                                        {city.name}
                                                                    </button>
                                                                    <Link
                                                                        href={`/${city.slug}`}
                                                                        target="_blank"
                                                                        className="text-gray-400 hover:text-indigo-600"
                                                                        title="Şehir sayfasını aç"
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                                        </svg>
                                                                    </Link>
                                                                    <button
                                                                        onClick={() => copyCityName(city.name)}
                                                                        className="p-1 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                                                                        title="Şehir adını kopyala"
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4" colSpan={2}>
                                                                <div className="space-y-2">
                                                                    {/* Toplu Input */}
                                                                    <input
                                                                        type="text"
                                                                        placeholder="36.9975753,35.1232555"
                                                                        onBlur={(e) => {
                                                                            const value = e.target.value.trim()
                                                                            if (value.includes(',')) {
                                                                                const parts = value.split(',').map(p => p.trim())
                                                                                if (parts.length === 2) {
                                                                                    const lat = parts[0] === '' ? null : (isNaN(parseFloat(parts[0])) ? null : parseFloat(parts[0]))
                                                                                    const lng = parts[1] === '' ? null : (isNaN(parseFloat(parts[1])) ? null : parseFloat(parts[1]))
                                                                                    if (lat !== null || lng !== null) {
                                                                                        handleBulkCoordinateChange(city.id, lat, lng)
                                                                                        e.target.value = ''
                                                                                    }
                                                                                }
                                                                            }
                                                                        }}
                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                                                    />
                                                                    {/* Ayrı Inputlar */}
                                                                    <div className="grid grid-cols-2 gap-2">
                                                                        <div>
                                                                            <label className="block text-xs text-gray-500 mb-1">Lat</label>
                                                                            <input
                                                                                type="text"
                                                                                value={city.lat !== null && city.lat !== undefined ? city.lat.toString() : ''}
                                                                                onChange={(e) => {
                                                                                    const value = e.target.value.trim()
                                                                                    handleCityChange(city.id, 'lat', value === '' ? null : (isNaN(parseFloat(value)) ? null : parseFloat(value)))
                                                                                }}
                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <label className="block text-xs text-gray-500 mb-1">Lng</label>
                                                                            <input
                                                                                type="text"
                                                                                value={city.lng !== null && city.lng !== undefined ? city.lng.toString() : ''}
                                                                                onChange={(e) => {
                                                                                    const value = e.target.value.trim()
                                                                                    handleCityChange(city.id, 'lng', value === '' ? null : (isNaN(parseFloat(value)) ? null : parseFloat(value)))
                                                                                }}
                                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-start gap-2">
                                                                    <textarea
                                                                        value={city.description || ''}
                                                                        onChange={(e) => handleCityChange(city.id, 'description', e.target.value)}
                                                                        rows={4}
                                                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                                    />
                                                                    <div className="flex flex-col gap-1">
                                                                        <button
                                                                            onClick={() => generateDescription(city.id, city.name, city.slug)}
                                                                            disabled={generatingDescriptions[city.id]}
                                                                            className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                                            title="AI ile açıklama oluştur"
                                                                        >
                                                                            {generatingDescriptions[city.id] ? (
                                                                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                                </svg>
                                                                            ) : (
                                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                                                </svg>
                                                                            )}
                                                                        </button>
                                                                        <button
                                                                            onClick={() => copyPrompt(city.name, city.slug)}
                                                                            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-colors"
                                                                            title="Prompt'u kopyala"
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                                            </svg>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                {hasUnsavedChanges(city.id) && (
                                                                    <button
                                                                        onClick={() => saveCity(city.id)}
                                                                        disabled={savingCities[city.id]}
                                                                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                    >
                                                                        {savingCities[city.id] ? 'Kaydediliyor...' : 'Kaydet'}
                                                                    </button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
