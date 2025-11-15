# BiÇilingir Blog Özelliği

Bu dokümanda BiÇilingir projesine eklenen SEO uyumlu blog özelliği hakkında bilgiler yer almaktadır.

## 📋 İçindekiler

1. [Veritabanı Yapısı](#veritabanı-yapısı)
2. [API Endpoint'leri](#api-endpointleri)
3. [Frontend Sayfalar](#frontend-sayfalar)
4. [SEO Özellikleri](#seo-özellikleri)
5. [Kurulum](#kurulum)
6. [Kullanım](#kullanım)

## 🗄️ Veritabanı Yapısı

### Blog Tabloları

#### `blogs` Tablosu
- **id**: UUID, Primary Key
- **title**: Blog başlığı
- **slug**: SEO uyumlu URL (benzersiz)
- **content**: Blog içeriği (HTML)
- **result**: İçeriğin özet hali
- **excerpt**: Kısa açıklama (liste görünümü için)
- **image_id**: Kapak görseli referansı
- **province_id**: İl bazlı içerik için
- **district_id**: İlçe bazlı içerik için
- **service_id**: Hizmet referansı
- **locksmith_id**: Çilingire özel yazı için
- **views**: Görüntülenme sayısı
- **status**: Yayın durumu (draft/published/archived)
- **published_at**: Yayın tarihi
- **meta_title**: SEO başlığı
- **meta_description**: SEO açıklaması
- **meta_keywords**: Anahtar kelimeler
- **is_featured**: Öne çıkarılmış yazı
- **reading_time**: Tahmini okuma süresi (dakika)

#### `blog_images` Tablosu
- **id**: UUID, Primary Key
- **url**: Görsel URL'i
- **alt_text**: SEO için alt metin
- **file_size**: Dosya boyutu
- **file_type**: Dosya tipi
- **width/height**: Görsel boyutları
- **is_deleted**: Soft delete için

#### `blog_views` Tablosu
- **id**: UUID, Primary Key
- **blog_id**: Blog referansı
- **user_id**: Kullanıcı referansı (opsiyonel)
- **ip_address**: Ziyaretçi IP'si
- **user_agent**: Tarayıcı bilgisi
- **referrer**: Nereden geldiği
- **created_at**: Görüntülenme zamanı

### Supabase Storage

- **Bucket**: `blog-images`
- **Max Size**: 10MB
- **Allowed Types**: JPEG, PNG, WebP, GIF
- **Public Access**: Evet (okuma için)

## 🔌 API Endpoint'leri

### Public Endpoints

#### Blog Listesi
```
GET /api/public/blogs
```

**Query Parameters:**
- `province_id`: İl filtresi
- `district_id`: İlçe filtresi
- `service_id`: Hizmet filtresi
- `locksmith_id`: Çilingir filtresi
- `is_featured`: Öne çıkan yazılar
- `search`: Arama terimi
- `limit`: Sayfa başına kayıt (varsayılan: 12)
- `offset`: Başlangıç noktası

#### Blog Detayı
```
GET /api/public/blogs/[slug]
```

Blog detayını getirir ve görüntülenme sayısını artırır.

### Admin Endpoints

#### Blog Yönetimi
```
GET /api/admin/blogs              # Blog listesi
POST /api/admin/blogs             # Yeni blog oluştur
GET /api/admin/blogs/[id]         # Blog detayı
PUT /api/admin/blogs/[id]         # Blog güncelle
DELETE /api/admin/blogs/[id]      # Blog sil
PATCH /api/admin/blogs/[id]/publish # Yayınla/Taslağa al
```

#### Blog Resimleri
```
GET /api/admin/blog-images        # Resim listesi
POST /api/admin/blog-images       # Yeni resim yükle
PUT /api/admin/blog-images/[id]   # Resim bilgilerini güncelle
DELETE /api/admin/blog-images/[id] # Resmi sil (soft delete)
```

## 🎨 Frontend Sayfalar

### Blog Ana Sayfası
- **URL**: `/blog`
- **Özellikler**: 
  - Filtreleme (il, ilçe, hizmet)
  - Arama
  - Sayfalama
  - Responsive tasarım

### Blog Detay Sayfası
- **URL**: `/blog/[slug]`
- **Özellikler**:
  - SEO uyumlu breadcrumb navigasyon
  - İlgili çilingir kartları
  - Sosyal paylaşım
  - Görüntülenme sayısı
  - Okuma süresi

## 🔍 SEO Özellikleri

### Meta Tags
- Dynamic title ve description
- Open Graph tags
- Twitter Card
- Canonical URL
- Keywords

### Breadcrumb Navigasyon
Örnek yapılar:
- `Ana Sayfa > Blog > Blog Başlığı`
- `Ana Sayfa > Bursa > Gemlik > Blog Başlığı`
- `Ana Sayfa > Bursa > Nilüfer > Acil Çilingir > Blog Başlığı`

### Sitemap
- Blog ana sayfası ve tüm blog yazıları sitemap'e dahil
- Otomatik güncellenen lastModified tarihleri
- Priority ve changeFrequency ayarları

### Performans
- Lazy loading görseller
- CDN ile görsel servisi
- Optimized database queries
- Sayfalama

## 🚀 Kurulum

### 1. Veritabanı Kurulumu
```sql
-- blog-migration.sql dosyasını Supabase'de çalıştırın
psql -h your-host -U your-user -d your-db -f blog-migration.sql
```

### 2. Supabase Storage Kurulumu
Supabase Dashboard'dan:
1. Storage > Create bucket: `blog-images`
2. Public access: Enable
3. File size limit: 10MB
4. Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`, `image/gif`

### 3. RLS Politikaları
```sql
-- Public okuma erişimi
CREATE POLICY "Everyone can view published blogs" ON blogs
FOR SELECT USING (status = 'published');

-- Admin yönetim erişimi (checkAdminAuth fonksiyonu ile)
```

## 📝 Kullanım

### Admin Paneli
1. Mobil uygulamada admin girişi yapın
2. Blog yönetimi bölümüne gidin
3. Yeni blog yazısı oluşturun:
   - Başlık ve içerik girin
   - Kapak görseli seçin/yükleyin
   - Lokasyon ve hizmet bilgilerini seçin
   - SEO meta bilgilerini girin
   - Yayınlayın

### Blog Yazma İpuçları
1. **Başlık**: Anahtar kelime içeren, çekici başlık
2. **Excerpt**: 150-160 karakter özet
3. **İçerik**: HTML formatında, başlıklar ve paragraflar
4. **Resim**: 1200x630 boyutunda kapak görseli
5. **SEO**: Meta title, description ve keywords
6. **Lokasyon**: İl/ilçe bilgisi SEO için önemli

### Örnek Blog Yapısı
```html
<h2>Giriş</h2>
<p>Blog yazısının giriş paragrafı...</p>

<h3>Alt Başlık</h3>
<p>İçerik paragrafı...</p>

<ul>
<li>Liste öğesi 1</li>
<li>Liste öğesi 2</li>
</ul>

<h3>Sonuç</h3>
<p>Sonuç paragrafı...</p>
```

## 🔧 Geliştirme Notları

### Slug Üretimi
- Türkçe karakterler İngilizce'ye çevrilir
- Benzersizlik için otomatik sayı eklenir
- URL dostu format

### Görüntülenme Takibi
- Her blog görüntülenmesinde `views` artırılır
- Detaylı analiz için `blog_views` tablosu
- IP ve user agent bilgileri saklanır

### İlgili Çilingirler
- Blog'un lokasyon bilgisine göre
- Hizmet filtrelemesi
- Rating'e göre sıralama

### Performans Optimizasyonları
- Database indeksleri
- Lazy loading
- CDN entegrasyonu
- Sayfalama

## 🐛 Sorun Giderme

### Yaygın Hatalar
1. **Slug çakışması**: Otomatik çözülür
2. **Görsel yükleme**: Dosya boyutu ve tip kontrolü
3. **SEO metadata**: Boş değerler için fallback

### Loglama
- Server hatları console.error ile loglanır
- API response'ları success/error format
- Frontend error handling

## 📊 Analitik

### Takip Edilen Metrikler
- Blog görüntülenme sayıları
- Popüler blog yazıları
- Lokasyon bazlı performans
- Referrer analizi

### Raporlama
```sql
-- En popüler bloglar
SELECT title, views FROM blogs 
WHERE status = 'published' 
ORDER BY views DESC LIMIT 10;

-- Lokasyon bazlı blog performansı
SELECT p.name, COUNT(*) as blog_count, AVG(b.views) as avg_views
FROM blogs b
JOIN provinces p ON b.province_id = p.id
WHERE b.status = 'published'
GROUP BY p.name;
```

---

**Not**: Bu blog sistemi tam SEO uyumlu olarak tasarlanmıştır ve Google'da organik sıralamada başarılı olması için gerekli tüm teknik altyapıyı içermektedir.
