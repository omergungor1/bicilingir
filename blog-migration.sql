-- Blog İçin Gerekli Tablolar ve Konfigürasyonlar
-- Önce blog_images tablosunu oluşturalım
CREATE TABLE blog_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url TEXT NOT NULL,               -- CDN veya storage yolu
    alt_text TEXT,                   -- SEO ve erişilebilirlik için
    file_size INTEGER,               -- Dosya boyutu (bytes)
    file_type VARCHAR(50),           -- image/jpeg, image/png vb.
    width INTEGER,                   -- Görsel genişliği
    height INTEGER,                  -- Görsel yüksekliği
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog yazıları tablosu
CREATE TABLE blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    result TEXT,                     -- İçeriğin özet hali
    excerpt TEXT,                    -- Kısa açıklama (liste görünümü + meta description fallback)
    image_id UUID REFERENCES blog_images(id) ON DELETE SET NULL,
    province_id INTEGER REFERENCES provinces(id) ON DELETE SET NULL,
    district_id INTEGER REFERENCES districts(id) ON DELETE SET NULL,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    locksmith_id UUID REFERENCES locksmiths(id) ON DELETE SET NULL,
    views INTEGER DEFAULT 0 CHECK (views >= 0),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    meta_title VARCHAR(255),         -- SEO için özel başlık (title tag)
    meta_description VARCHAR(500),   -- SEO açıklaması (Google snippet)
    meta_keywords VARCHAR(500),      -- Anahtar kelimeler
    is_featured BOOLEAN DEFAULT FALSE, -- Öne çıkarılmış yazı mı?
    author_id UUID,                  -- İleride kullanım için
    reading_time INTEGER DEFAULT 0   -- Tahmini okuma süresi (dakika)
);

-- Blog görüntülenme logları (isteğe bağlı - detaylı analiz için)
CREATE TABLE blog_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blog_id UUID NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- İndeksler - Performans için
CREATE INDEX idx_blogs_status ON blogs(status);
CREATE INDEX idx_blogs_published_at ON blogs(published_at DESC) WHERE status = 'published';
CREATE INDEX idx_blogs_province_id ON blogs(province_id) WHERE province_id IS NOT NULL;
CREATE INDEX idx_blogs_district_id ON blogs(district_id) WHERE district_id IS NOT NULL;
CREATE INDEX idx_blogs_service_id ON blogs(service_id) WHERE service_id IS NOT NULL;
CREATE INDEX idx_blogs_locksmith_id ON blogs(locksmith_id) WHERE locksmith_id IS NOT NULL;
CREATE INDEX idx_blogs_slug ON blogs(slug);
CREATE INDEX idx_blogs_is_featured ON blogs(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_blogs_views ON blogs(views DESC);

-- Blog images için indeksler
CREATE INDEX idx_blog_images_is_deleted ON blog_images(is_deleted) WHERE is_deleted = FALSE;
CREATE INDEX idx_blog_images_created_at ON blog_images(created_at DESC);

-- Blog views için indeksler
CREATE INDEX idx_blog_views_blog_id ON blog_views(blog_id);
CREATE INDEX idx_blog_views_created_at ON blog_views(created_at DESC);

-- Trigger fonksiyonu - updated_at otomatik güncelleme
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger'lar
CREATE TRIGGER update_blogs_updated_at 
    BEFORE UPDATE ON blogs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_images_updated_at 
    BEFORE UPDATE ON blog_images 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Slug benzersizliği için fonksiyon
CREATE OR REPLACE FUNCTION generate_unique_slug(base_slug TEXT, table_name TEXT)
RETURNS TEXT AS $$
DECLARE
    unique_slug TEXT;
    counter INTEGER := 1;
    slug_exists BOOLEAN;
BEGIN
    unique_slug := base_slug;
    
    LOOP
        -- Slug'ın mevcut olup olmadığını kontrol et
        EXECUTE format('SELECT EXISTS(SELECT 1 FROM %I WHERE slug = $1)', table_name) 
        INTO slug_exists USING unique_slug;
        
        -- Eğer slug mevcut değilse, döndür
        IF NOT slug_exists THEN
            RETURN unique_slug;
        END IF;
        
        -- Slug mevcutsa, sayı ekleyerek yeni slug oluştur
        unique_slug := base_slug || '-' || counter;
        counter := counter + 1;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- RLS (Row Level Security) Politikaları

-- Blog images için RLS
ALTER TABLE blog_images ENABLE ROW LEVEL SECURITY;

-- Herkes yayınlanmış blog resimlerini görebilir
CREATE POLICY "Blog images are viewable by everyone" ON blog_images
    FOR SELECT USING (is_deleted = FALSE);

-- Sadece admin kullanıcıları blog resimleri ekleyebilir/güncelleyebilir
-- (Bu politikayı admin kontrolü ile birlikte uygulayacağız)

-- Blogs için RLS
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Herkes yayınlanmış blogları görebilir
CREATE POLICY "Published blogs are viewable by everyone" ON blogs
    FOR SELECT USING (status = 'published');

-- Views güncellemesi için özel politika (sadece views alanı güncellenebilir)
CREATE POLICY "Anyone can update blog views" ON blogs
    FOR UPDATE USING (status = 'published')
    WITH CHECK (status = 'published');

-- Blog views için RLS
ALTER TABLE blog_views ENABLE ROW LEVEL SECURITY;

-- Herkes blog view ekleyebilir (görüntülenme sayısı için)
CREATE POLICY "Everyone can insert blog views" ON blog_views
    FOR INSERT WITH CHECK (true);

-- Supabase Storage için blog-images bucket oluşturma komutu
-- Bu komutu Supabase dashboard'dan çalıştırın:
-- 
-- INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
-- VALUES ('blog-images', 'blog-images', true, false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

-- Storage için RLS politikaları
-- Bu politikaları Supabase dashboard'dan ekleyin:
--
-- Bucket: blog-images
-- Policy Name: "Admin can upload blog images"
-- Operation: INSERT
-- Target: authenticated users only
-- Policy: (auth.jwt() ->> 'role')::text = 'admin'
--
-- Policy Name: "Everyone can view blog images"  
-- Operation: SELECT
-- Target: public
-- Policy: true
--
-- Policy Name: "Admin can update blog images"
-- Operation: UPDATE  
-- Target: authenticated users only
-- Policy: (auth.jwt() ->> 'role')::text = 'admin'
--
-- Policy Name: "Admin can delete blog images"
-- Operation: DELETE
-- Target: authenticated users only  
-- Policy: (auth.jwt() ->> 'role')::text = 'admin'
