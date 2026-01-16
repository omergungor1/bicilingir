import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

// Service role client (RLS'yi bypass eder)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Servis ID'leri (tüm çilingirlere eklenecek)
const DEFAULT_SERVICE_IDS = [
    '69fe5a65-88ee-4e23-b3e8-b53370f5721a',
    '7e18c529-faf1-4139-be87-92e2c3ed98aa',
    '915e4a47-b6b6-42c0-a3eb-424262b7b238',
    'a5570d34-ee52-4f69-8010-0dce311cbc7e',
    'a782c9d0-e2d6-48fd-b537-ad3d7482ef0e'
]

// Google'dan resim çekip Supabase storage'a yükle
async function downloadAndUploadImage(imageUrl, locksmithId) {
    try {
        if (!imageUrl || !imageUrl.startsWith('http')) {
            return null
        }

        // Google'dan resmi indir
        const response = await fetch(imageUrl)
        if (!response.ok) {
            console.warn(`Resim indirilemedi: ${imageUrl}`)
            return null
        }

        const arrayBuffer = await response.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Dosya adını oluştur
        const fileExt = imageUrl.includes('.jpg') || imageUrl.includes('.jpeg') ? 'jpg' :
            imageUrl.includes('.png') ? 'png' : 'jpg'
        const fileName = `${locksmithId}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`
        const filePath = fileName

        // Storage'a yükle
        const { data: storageData, error: storageError } = await supabaseAdmin
            .storage
            .from('business-images')
            .upload(filePath, buffer, {
                cacheControl: '3600',
                upsert: false,
                contentType: `image/${fileExt}`
            })

        if (storageError) {
            console.error('Resim yükleme hatası:', storageError)
            return null
        }

        // Public URL al
        const { data: publicURLData } = supabaseAdmin
            .storage
            .from('business-images')
            .getPublicUrl(filePath)

        return publicURLData.publicUrl
    } catch (error) {
        console.error('Resim işleme hatası:', error)
        return null
    }
}

// Telefon numarasını formatla (parantezleri kaldır)
function formatPhoneNumber(phone) {
    if (!phone) return ''
    return phone.replace(/[()]/g, '').replace(/\s+/g, ' ').trim()
}

// Rating'i parse et (default: 4)
function parseRating(rating) {
    if (!rating || rating.trim() === '') return 4.0
    const parsed = parseFloat(rating)
    return isNaN(parsed) ? 4.0 : parsed
}

// Review count'u parse et (default: 3)
function parseReviewCount(count) {
    if (!count || count.trim() === '') return 3
    const parsed = parseInt(count)
    return isNaN(parsed) ? 3 : parsed
}

// Çalışma saatlerini parse et
function parseWorkingHours(workingHoursJson) {
    const defaultHours = {
        0: { is24HOpen: true, isWorking: true }, // Pazar
        1: { is24HOpen: true, isWorking: true }, // Pazartesi
        2: { is24HOpen: true, isWorking: true }, // Salı
        3: { is24HOpen: true, isWorking: true }, // Çarşamba
        4: { is24HOpen: true, isWorking: true }, // Perşembe
        5: { is24HOpen: true, isWorking: true }, // Cuma
        6: { is24HOpen: true, isWorking: true }  // Cumartesi
    }

    if (!workingHoursJson || workingHoursJson.trim() === '') {
        return defaultHours
    }

    try {
        const hours = JSON.parse(workingHoursJson)
        const dayMap = {
            'Pazar': 0,
            'Pazartesi': 1,
            'Salı': 2,
            'Çarşamba': 3,
            'Perşembe': 4,
            'Cuma': 5,
            'Cumartesi': 6
        }

        const result = { ...defaultHours }

        for (const [dayName, timeStr] of Object.entries(hours)) {
            const dayOfWeek = dayMap[dayName]
            if (dayOfWeek === undefined) continue

            if (timeStr === 'Kapalı') {
                result[dayOfWeek] = { is24HOpen: false, isWorking: false }
            } else if (timeStr === '24 saat açık' || timeStr.includes('24 saat')) {
                result[dayOfWeek] = { is24HOpen: true, isWorking: true }
            } else {
                // Saat formatını parse et (örn: "08:00–20:00" veya "00:00–06:30, 20:30–00:00")
                const timeParts = timeStr.split(',')
                if (timeParts.length > 0) {
                    const firstTime = timeParts[0].trim()
                    const match = firstTime.match(/(\d{2}):(\d{2})[–-](\d{2}):(\d{2})/)
                    if (match) {
                        result[dayOfWeek] = {
                            is24HOpen: false,
                            isWorking: true,
                            openTime: `${match[1]}:${match[2]}`,
                            closeTime: `${match[3]}:${match[4]}`
                        }
                    } else {
                        // Parse edilemedi, 24 saat açık yap
                        result[dayOfWeek] = { is24HOpen: true, isWorking: true }
                    }
                } else {
                    result[dayOfWeek] = { is24HOpen: true, isWorking: true }
                }
            }
        }

        return result
    } catch (error) {
        console.error('Çalışma saatleri parse hatası:', error)
        return defaultHours
    }
}

// Tek bir çilingiri import et
async function importLocksmith(row) {
    try {
        const slug = row.locsksmith_slug || row.locksmith_slug
        if (!slug) {
            throw new Error('Slug bulunamadı')
        }

        // Slug zaten var mı kontrol et
        const { data: existing } = await supabaseAdmin
            .from('locksmiths')
            .select('id')
            .eq('slug', slug)
            .single()

        if (existing) {
            throw new Error(`Slug zaten mevcut: ${slug}`)
        }

        const phoneNumber = formatPhoneNumber(row.phone_number)
        const whatsappNumber = phoneNumber
        const rating = parseRating(row.rating)
        const reviewCount = parseReviewCount(row.review_count)

        // 1. locksmiths tablosuna insert
        const { data: locksmith, error: locksmithError } = await supabaseAdmin
            .from('locksmiths')
            .insert({
                slug: slug,
                provinceid: parseInt(row.province_id) || null,
                districtid: parseInt(row.district_id) || null,
                businessname: row.business_name || null,
                fullname: row.business_name || '',
                tagline: null,
                email: `import_${Date.now()}_${Math.random().toString(36).substring(2, 9)}@imported.local`,
                phonenumber: phoneNumber,
                whatsappnumber: whatsappNumber,
                avgrating: rating,
                totalreviewcount: reviewCount,
                profileimageurl: null,
                authid: null,
                isverified: false,
                isactive: false
            })
            .select()
            .single()

        if (locksmithError) {
            throw new Error(`locksmiths insert hatası: ${locksmithError.message}`)
        }

        const locksmithId = locksmith.id

        // 2. locksmith_details tablosuna insert
        const { error: detailsError } = await supabaseAdmin
            .from('locksmith_details')
            .insert({
                locksmithid: locksmithId,
                taxnumber: null,
                fulladdress: row.adress || null,
                abouttext: null,
                websiteurl: row.web_site_url || null,
                startdate: null,
                isemailverified: false,
                isphoneverified: false,
                lat: row.latitude ? parseFloat(row.latitude) : null,
                lng: row.longitude ? parseFloat(row.longitude) : null,
                postal_code: null,
                map_url: row.maps_url || null,
                plus_code: row.plus_code || null,
                business_type: row.business_type || null
            })

        if (detailsError) {
            throw new Error(`locksmith_details insert hatası: ${detailsError.message}`)
        }

        // 3. locksmith_districts tablosuna insert
        if (row.province_id && row.district_id) {
            const { error: districtsError } = await supabaseAdmin
                .from('locksmith_districts')
                .insert({
                    locksmithid: locksmithId,
                    provinceid: parseInt(row.province_id),
                    districtid: parseInt(row.district_id),
                    isactive: true
                })

            if (districtsError) {
                throw new Error(`locksmith_districts insert hatası: ${districtsError.message}`)
            }
        }

        // 4. locksmith_services tablosuna insert
        for (const serviceId of DEFAULT_SERVICE_IDS) {
            const { error: servicesError } = await supabaseAdmin
                .from('locksmith_services')
                .insert({
                    locksmithid: locksmithId,
                    serviceid: serviceId,
                    isactive: true
                })

            if (servicesError) {
                console.warn(`Servis eklenemedi (${serviceId}):`, servicesError.message)
            }
        }

        // 5. locksmith_working_hours tablosuna insert
        const workingHours = parseWorkingHours(row.working_hours)
        for (let dayOfWeek = 0; dayOfWeek <= 6; dayOfWeek++) {
            const dayHours = workingHours[dayOfWeek] || { is24HOpen: true, isWorking: true }
            const { error: hoursError } = await supabaseAdmin
                .from('locksmith_working_hours')
                .insert({
                    locksmithid: locksmithId,
                    dayofweek: dayOfWeek,
                    is24hopen: dayHours.is24HOpen || false,
                    isworking: dayHours.isWorking !== false,
                    opentime: dayHours.openTime || null,
                    closetime: dayHours.closeTime || null
                })

            if (hoursError) {
                console.warn(`Çalışma saati eklenemedi (gün ${dayOfWeek}):`, hoursError.message)
            }
        }

        // 6. locksmith_images tablosuna insert (eğer resim varsa)
        if (row.image_url) {
            const uploadedImageUrl = await downloadAndUploadImage(row.image_url, locksmithId)
            if (uploadedImageUrl) {
                const { error: imageError } = await supabaseAdmin
                    .from('locksmith_images')
                    .insert({
                        locksmith_id: locksmithId,
                        image_url: uploadedImageUrl,
                        is_main: false,
                        is_profile: true,
                        display_order: 0
                    })

                if (imageError) {
                    console.warn('Resim kaydedilemedi:', imageError.message)
                }
            }
        }

        return { success: true, locksmithId }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

export async function POST(request) {
    try {
        const cookieStore = await cookies()
        const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

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

        // FormData'dan CSV dosyasını al
        const formData = await request.formData()
        const csvFile = formData.get('csv')

        if (!csvFile) {
            return NextResponse.json({ error: 'CSV dosyası bulunamadı' }, { status: 400 })
        }

        // CSV'yi text olarak oku
        const text = await csvFile.text()
        const lines = text.split('\n').filter(line => line.trim())

        if (lines.length < 2) {
            return NextResponse.json({ error: 'CSV dosyası boş veya geçersiz' }, { status: 400 })
        }

        // CSV parse fonksiyonu (tırnak içindeki virgülleri dikkate alır)
        const parseCSVLine = (line) => {
            const result = []
            let current = ''
            let inQuotes = false

            for (let i = 0; i < line.length; i++) {
                const char = line[i]
                const nextChar = line[i + 1]

                if (char === '"') {
                    if (inQuotes && nextChar === '"') {
                        // Çift tırnak (escape)
                        current += '"'
                        i++ // Bir sonraki karakteri atla
                    } else {
                        // Tırnak başlangıcı/bitişi
                        inQuotes = !inQuotes
                    }
                } else if ((char === ',' || char === '\t') && !inQuotes) {
                    // Ayırıcı (virgül veya tab) ve tırnak dışındaysa
                    result.push(current.trim())
                    current = ''
                } else {
                    current += char
                }
            }
            result.push(current.trim()) // Son alan
            return result
        }

        // Header'ı al
        const headers = parseCSVLine(lines[0]).map(h => h.trim())
        const data = []

        // Satırları parse et
        for (let i = 1; i < lines.length; i++) {
            const values = parseCSVLine(lines[i])
            if (values.length < headers.length) continue

            const row = {}
            headers.forEach((header, index) => {
                // Tırnak işaretlerini kaldır
                let value = values[index]?.trim() || ''
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.slice(1, -1)
                }
                row[header] = value
            })
            data.push(row)
        }

        // Her çilingiri import et
        let imported = 0
        let failed = 0
        const errors = []

        for (const row of data) {
            const result = await importLocksmith(row)
            if (result.success) {
                imported++
            } else {
                failed++
                errors.push(`${row.business_name || 'Bilinmeyen'}: ${result.error}`)
            }
        }

        return NextResponse.json({
            success: true,
            imported,
            failed,
            errors: errors.slice(0, 50) // İlk 50 hatayı gönder
        })

    } catch (error) {
        console.error('Import hatası:', error)
        return NextResponse.json({
            error: 'Import işlemi sırasında bir hata oluştu',
            details: error.message
        }, { status: 500 })
    }
}
