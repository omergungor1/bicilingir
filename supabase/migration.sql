-- Bu SQL kodu, Supabase veritabanını hazırlar
-- Supabase yönetim panelinden SQL editörüne yapıştırıp çalıştırın

-- USERS (AUTH) EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- STORAGE
CREATE EXTENSION IF NOT EXISTS postgis;

-- PROFILES (LOCKSMITHS) TABLOSU
CREATE TABLE IF NOT EXISTS locksmiths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    phone TEXT NOT NULL,
    description TEXT,
    detailed_description TEXT,
    experience TEXT,
    price_range TEXT,
    address TEXT,
    website TEXT,
    email TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT FALSE,
    rocket_balance INTEGER DEFAULT 0,
    average_rating NUMERIC(3, 2) DEFAULT 0,
    review_count INTEGER DEFAULT 0
);

-- SERVICES TABLOSU (Hizmet Kategorileri)
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- LOCKSMITH_SERVICES TABLOSU (Çilingir-Hizmet İlişkisi)
CREATE TABLE IF NOT EXISTS locksmith_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    locksmith_id UUID REFERENCES locksmiths(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (locksmith_id, service_id)
);

-- WORKING_HOURS TABLOSU
CREATE TABLE IF NOT EXISTS working_hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    locksmith_id UUID REFERENCES locksmiths(id) ON DELETE CASCADE,
    day TEXT NOT NULL,
    open_time TEXT NOT NULL,
    close_time TEXT NOT NULL,
    is_open BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (locksmith_id, day)
);

-- REVIEWS TABLOSU
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    locksmith_id UUID REFERENCES locksmiths(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    user_email TEXT,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    location TEXT,
    status TEXT DEFAULT 'pending', -- pending, approved, rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- IMAGES TABLOSU (Çilingir Görselleri)
CREATE TABLE IF NOT EXISTS images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    locksmith_id UUID REFERENCES locksmiths(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    is_profile BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- DOCUMENTS TABLOSU (Çilingir Belgeleri - Sertifikalar)
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    locksmith_id UUID REFERENCES locksmiths(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PACKAGES TABLOSU (Roket Paketleri)
CREATE TABLE IF NOT EXISTS packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    rocket_amount INTEGER NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_unlimited BOOLEAN DEFAULT FALSE,
    valid_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SALES TABLOSU (Roket Satış Geçmişi)
CREATE TABLE IF NOT EXISTS sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    locksmith_id UUID REFERENCES locksmiths(id) ON DELETE CASCADE,
    package_id UUID REFERENCES packages(id) ON DELETE SET NULL,
    package_name TEXT NOT NULL,
    rocket_amount INTEGER NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'completed', -- completed, refunded, pending
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ACTIVITIES TABLOSU (Aktivite Geçmişi)
CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_type TEXT NOT NULL, -- locksmith, user, review, call
    description TEXT NOT NULL,
    subject_id UUID, -- İlgili kayıt ID (çilingir id, değerlendirme id vb.)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- VERİ GÜVENLİĞİ POLİTİKALARI
-- RLS (Row Level Security) Etkinleştir
ALTER TABLE locksmiths ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE locksmith_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE working_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Çilingirler için politikalar
CREATE POLICY "Çilingirler kendi profillerini okuyabilir" 
ON locksmiths FOR SELECT 
USING (auth.uid() = auth_id);

CREATE POLICY "Çilingirler kendi profillerini güncelleyebilir" 
ON locksmiths FOR UPDATE 
USING (auth.uid() = auth_id);

-- Adminler tüm tabloları görebilir ve düzenleyebilir
CREATE POLICY "Adminler tüm çilingirleri görebilir" 
ON locksmiths FOR ALL 
USING (EXISTS (SELECT 1 FROM auth.users WHERE auth.uid() = id AND auth.users.role = 'admin'));

-- Herkese açık okuma politikaları
CREATE POLICY "Herkes aktif çilingirleri görebilir" 
ON locksmiths FOR SELECT 
USING (is_active = TRUE AND is_verified = TRUE);

CREATE POLICY "Herkes hizmetleri görebilir" 
ON services FOR SELECT 
USING (is_active = TRUE);

CREATE POLICY "Herkes çilingir-hizmet ilişkilerini görebilir" 
ON locksmith_services FOR SELECT 
USING (TRUE);

CREATE POLICY "Herkes çalışma saatlerini görebilir" 
ON working_hours FOR SELECT 
USING (TRUE);

CREATE POLICY "Herkes onaylanmış değerlendirmeleri görebilir" 
ON reviews FOR SELECT 
USING (status = 'approved');

CREATE POLICY "Herkes görselleri görebilir" 
ON images FOR SELECT 
USING (TRUE);

-- Çilingirler için diğer politikalar
CREATE POLICY "Çilingirler kendi hizmetlerini yönetebilir" 
ON locksmith_services FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM locksmiths 
        WHERE locksmiths.id = locksmith_id 
        AND locksmiths.auth_id = auth.uid()
    )
);

CREATE POLICY "Çilingirler kendi çalışma saatlerini yönetebilir" 
ON working_hours FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM locksmiths 
        WHERE locksmiths.id = locksmith_id 
        AND locksmiths.auth_id = auth.uid()
    )
);

CREATE POLICY "Çilingirler kendi değerlendirmelerini görebilir" 
ON reviews FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM locksmiths 
        WHERE locksmiths.id = locksmith_id 
        AND locksmiths.auth_id = auth.uid()
    )
);

CREATE POLICY "Çilingirler kendi görsellerini yönetebilir" 
ON images FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM locksmiths 
        WHERE locksmiths.id = locksmith_id 
        AND locksmiths.auth_id = auth.uid()
    )
);

CREATE POLICY "Çilingirler kendi belgelerini yönetebilir" 
ON documents FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM locksmiths 
        WHERE locksmiths.id = locksmith_id 
        AND locksmiths.auth_id = auth.uid()
    )
);

-- Çilingirlerin kendi resimlerini yüklemesine izin ver
(bucket_id = 'locksmiths'::text) AND 
(auth.uid() IN (
    SELECT auth_id FROM locksmiths 
    WHERE id::text = (storage.foldername(name))[1]
))

-- ÖRNEK VERİLER (TEST İÇİN)
-- Hizmet kategorileri
INSERT INTO services (name) VALUES 
('Kapı Açma'),
('Kilit Değiştirme'),
('Çelik Kapı'),
('Acil Çilingir'),
('Oto Çilingir'),
('Kasa Çilingir');

-- Roket paketleri
INSERT INTO packages (name, description, rocket_amount, price, is_active) VALUES
('Başlangıç', 'İlk kez kullananlar için ideal paket', 20, 200.00, TRUE),
('Orta', 'Orta ölçekli çilingirler için', 50, 450.00, TRUE),
('Pro', 'Yoğun iş yapan çilingirler için', 100, 800.00, TRUE),
('VIP', 'En kapsamlı paket', 200, 1500.00, TRUE);