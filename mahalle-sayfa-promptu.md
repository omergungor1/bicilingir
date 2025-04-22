Next.js ve Tailwind CSS kullanarak yeniden kullanılabilir ve SEO uyumlu bir dinamik hizmet sayfası oluştur. Bu sayfa, BiÇilingir adlı çilingir hizmet platformu için mahalle bazlı yerel hedeflemeye göre yapılacak.

URL Yapısı:
/[il]/[ilce]/[mahalle]/[hizmet-kategori]

Örnek URL:
/bursa/osmangazi/kuplupinar/acil-cilingir

Sayfa tam mobil uyumlu olmalı. Aşağıdaki bileşenler sayfada yer almalı:

🔖  SEO Başlık ve Meta Etiketler:
- Sayfa başlığı (<title>) dinamik olarak il, ilçe, mahalle ve hizmet adını içermeli.
Örnek: Bursa Osmangazi Küplüpınar Acil Çilingir - 7/24 Hizmet
- Meta açıklama (160 karakter): Lokasyon ve hizmet bilgisi içermeli
- Open Graph etiketleri (sosyal medya paylaşımı için)
- Canonical URL

📍 Mahalleye Özel İçerik Alanı:
- Mahalle hakkında kısa bir tanıtım
- Yakındaki önemli yerler, ulaşım bilgisi
- Lokasyona özel bilgiler

🔑 Anahtar Kelimeler & Yerel SEO:
-“kuplupinar mahallesinde acil çilingir” gibi lokal anahtar kelimeler içerikte kullanılmalı
-HTML semantik etiketler kullanılmalı (<h1>, <h2> vb.)

🖼️ Görsel Galeri:
- Hizmete veya bölgeye ait örnek görseller (örnek olarak ekle)
- next/image ile optimize edilerek kullanılmalı

🗺️ Harita Entegrasyonu:
-Google Maps iframe olarak gömülmeli
-Koordinatlar veya embed linki dinamik olarak eklenebilmeli

💰 Hizmet Bilgisi ve Fiyatlandırma:
-Kart veya tablo şeklinde:
-Hizmet adı
-Ortalama ulaşım süresi
-Fiyat aralığı (örnek: 200₺ – 500₺)

🧑‍💬 Müşteri Yorumları:
-Kullanıcı adı, yıldızlı puan ve yorum metni ile birlikte 3-4 adet örnek yorum
-Statik veya dinamik olabilir

📣 Call to Action (CTA) Alanı:
-“Hemen Ara”, “WhatsApp’tan Yaz” gibi butonlar
-tel: ve wa.me linkleri

📊 Yapısal Veri (Schema Markup):
-JSON-LD formatında LocalBusiness şeması
-İçerik:
-işletme adı
-adres (il, ilçe, mahalle)
-telefon
-koordinat
-web adresi
-hizmet tipi

🌐 Ek Özellikler:
-Breadcrumb navigasyonu
-Diğer hizmetlere ve blog yazılarına dahili linkler (domain otoritesini artırmak için)

🔍 Arama Motoru Optimizasyonu:
-İçerik içinde lokal anahtar kelimeler kullanılmalı
-HTML semantik etiketler kullanılmalı

🧩 Sayfa Versiyonları:
Aşağıdaki hizmet kategorileri için 6 ayrı örnek sayfa oluştur:
acil-cilingir
oto-cilingir
ev-cilingir
kasa-cilingir
724-cilingir
cilingir-hizmeti

Her sayfada örnek lokasyon olarak:
İl: Bursa
İlçe: Osmangazi
Mahalle: Küplüpınar
Kullanılabilir props örnekleri:
-il, ilce, mahalle, kategori, fiyat, aciklama, yorumlar, haritaEmbedUrl
-title
-description
-image
-location
-phone
-rating

-> Dinamik route sistemine uygun şekilde oluşturulmalıdır.
