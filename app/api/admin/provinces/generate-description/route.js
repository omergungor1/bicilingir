import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { ServiceList } from '../../../../../lib/service-list';

export async function POST(request) {
    try {
        // Auth kontrolü
        const cookieStore = await cookies();
        const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
        }

        // Admin kontrolü
        const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .single();

        if (roleData?.role !== 'admin') {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 });
        }

        const { cityName, citySlug } = await request.json();

        if (!cityName) {
            return NextResponse.json({ error: 'Şehir adı gerekli' }, { status: 400 });
        }

        const openaiApiKey = process.env.OPENAI_API_KEY;
        if (!openaiApiKey) {
            return NextResponse.json({ error: 'OpenAI API anahtarı bulunamadı' }, { status: 500 });
        }

        // Featured servisleri filtrele (isFeatured: true olanlar)
        const featuredServices = ServiceList.filter(service => service.isFeatured === true);

        // SEO odaklı prompt hazırla
        const currentYear = new Date().getFullYear();
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
- Metni Markdown formatında yaz: Önemli kısımları **kalın** yap (çift yıldız ile)
- Hizmet isimleri, fiyat bilgileri ve önemli SEO terimleri **kalın** olmalı

İÇERİK YAPISI:

1. PARAGRAF (Yerel bağlam + ihtiyaç):
- "${cityName}" şehrinin günlük yaşam temposu, nüfus yoğunluğu veya şehir yapısına kısa ve özgün bir şekilde değin
- Anahtar kaybı, kapıda kalma, kilit arızası gibi gerçek kullanıcı problemlerinden bahset
- "${cityName}" genelinde hızlı ve güvenilir çilingir hizmetinin neden önemli olduğunu açıkla
- "${cityName} çilingir" ve "çilingir ${cityName}" ifadelerini doğal şekilde kullan

2. PARAGRAF (Hizmetler + fiyat bilgileri - Rich Snippet için):
- "${cityName}"'da sunulan öne çıkan çilingir hizmetlerini detaylandır. Sadece şu hizmetleri kullan:
  ${featuredServices.map(s => s.name).join(', ')}
- Metni Markdown formatında yaz ve önemli kısımları **kalın** yap:
  - Hizmet isimlerini **kalın** yaz (örn: **Acil Çilingir**, **Kapı Açma**)
  - Fiyat bilgilerini **kalın** yaz (örn: **500-900 TL**, **100-500 TL**)
  - Önemli SEO terimlerini **kalın** yaz (örn: **${cityName} çilingir fiyatları**)
- Her hizmet için MUTLAKA doğru fiyat aralığını kullan. Fiyat bilgileri (KESINLIKLE DOĞRU KULLAN - HER HİZMET İÇİN FARKLI FİYAT VAR):
${featuredServices.map(s => `  - **${s.name}** hizmeti: MUTLAKA **${s.price.min}-${s.price.max} TL** yaz (Başka fiyat yazma, sadece bu fiyatı kullan!)`).join('\n')}
- Fiyat bilgilerini şu şekilde doğal akışta kullan:
  - "${cityName} çilingir fiyatları ${currentYear}" ifadesini kullan ve **kalın** yap
  - "çilingir fiyatları ${currentYear} ${cityName}" ifadesini kullan ve **kalın** yap
  - "çilingir ücreti ${cityName}" ifadesini kullan ve **kalın** yap
  - "çilingir kapı açma fiyatı ${cityName} ${currentYear}" ifadesini kullan ve **kalın** yap (Kapı Açma için MUTLAKA **500-900 TL** aralığını belirt, ASLA 100-500 TL yazma!)
  - "çilingir kapı açma ücreti ${cityName} ${currentYear}" ifadesini kullan ve **kalın** yap
- Her hizmeti bahsederken MUTLAKA doğru fiyatını yaz. ÖRNEKLER:
  - "**Acil Çilingir** hizmeti **100-500 TL** aralığında" şeklinde yaz
  - "**Otomobil Çilingir** hizmeti **100-500 TL** aralığında" şeklinde yaz
  - "**Kasa Çilingir** hizmeti **100-500 TL** aralığında" şeklinde yaz
  - "**Kapı Açma** hizmeti **500-900 TL** aralığında" şeklinde yaz (ASLA 100-500 TL yazma, sadece 500-900 TL!)
- Fiyatların hizmet türüne, saatine (mesai/akşam/gece) ve duruma göre değişebileceğini belirt
- Hizmetlerin acil durumlar ve farklı saat dilimleri için sunulabildiğini vurgula
- "${cityName} anahtar kopyalama" ve "${cityName} elektronik anahtar" ifadelerini doğal bağlamda kullan ve **kalın** yap
- "${currentYear}" yılına güncel hizmet anlayışı çerçevesinde atıf yap

FİYAT BİLGİLERİ (Google Rich Snippet için - KESINLIKLE DOĞRU KULLAN):
Aşağıdaki fiyat bilgilerini metinde doğal şekilde kullan ve **kalın** yap. HER HİZMET İÇİN DOĞRU FİYATI KULLAN:
${featuredServices.map(s => `- **${s.name}**: **${s.price.min}-${s.price.max} TL** (Bu fiyatı KESINLIKLE kullan, başka fiyat yazma!)`).join('\n')}

KRİTİK UYARI: 
- **Kapı Açma** hizmeti için ASLA 100-500 TL yazma, MUTLAKA **500-900 TL** yaz!
- **Acil Çilingir**, **Otomobil Çilingir** ve **Kasa Çilingir** için **100-500 TL** kullan, başka fiyat yazma!
- Her hizmet için farklı fiyat var, karıştırma! Kapı Açma daha pahalı (500-900 TL), diğerleri daha ucuz (100-500 TL).

Bu fiyatlar "${cityName} çilingir fiyatları", "çilingir fiyatları ${currentYear} ${cityName}", "çilingir ücreti ${cityName}" gibi aramalar için Google'ın rich snippet gösterebilmesi için net şekilde belirtilmelidir.

EK KRİTERLER:
- Metin kullanıcıya güven veren bir ton taşımalı
- "En ucuz", "tek", "en iyi" gibi iddialı ve riskli ifadeler kullanılmamalı
- İl sayfası için yazıldığı net şekilde hissedilmeli
- Fiyat bilgileri Google'ın anlayabileceği şekilde yapılandırılmış olmalı (örn: "500-900 TL aralığında", "100-500 TL civarında")

Sadece açıklama metnini yaz. Başlık, madde işareti, tırnak veya ek açıklama ekleme.
Metni Markdown formatında yaz ve önemli kısımları **kalın** yap (çift yıldız ile).
`;

        // Timeout ile fetch (45 saniye)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 45000);

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
                        content: 'Sen çilingir hizmetleri ve şehir tanıtımları konusunda uzman bir SEO içerik yazarısın. Türkçe yazıyorsun ve SEO dostu, özgün içerikler üretiyorsun. İstenen görevi yerine getir ve sadece sonucu döndür. Hiçbir açıklama, yorum veya ek metin ekleme. Metinlerin başında ve sonunda tırnak işareti kullanma.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 1000
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({
                error: 'OpenAI API hatası: ' + (errorData.error?.message || 'Bilinmeyen hata')
            }, { status: 500 });
        }

        const data = await response.json();
        const description = data.choices[0].message.content.trim();

        // Tırnak işaretlerini temizle
        const cleanDescription = description.replace(/^["']|["']$/g, '').trim();

        return NextResponse.json({ description: cleanDescription });

    } catch (fetchError) {
        if (fetchError.name === 'AbortError') {
            return NextResponse.json({
                error: 'İstek zaman aşımına uğradı. Lütfen tekrar deneyin.'
            }, { status: 504 });
        }

        console.error('Description generate hatası:', fetchError);
        return NextResponse.json({
            error: 'Açıklama oluşturulurken bir hata oluştu: ' + fetchError.message
        }, { status: 500 });
    }
}
