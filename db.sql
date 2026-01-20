-- Servis Kategorileri Tablosu
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    icon_url TEXT,
    isActive BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    minPriceMesai int2,
    maxPriceMesai int2,
    minPriceAksam int2,
    maxPriceAksam int2,
    minPriceGece int2,
    maxPriceGece int2,
    note TEXT,
    slug TEXT UNIQUE NOT NULL,
    sortOrder INT DEFAULT 0
);

-- İl (Province) Tablosu
CREATE TABLE provinces (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT UNIQUE NOT NULL,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    description TEXT,
    locksmith1Id UUID REFERENCES locksmiths(id) ON DELETE SET NULL,
    locksmith2Id UUID REFERENCES locksmiths(id) ON DELETE SET NULL,
    adsCallLocksmithId UUID REFERENCES locksmiths(id) ON DELETE SET NULL,
    code TEXT
);

-- İlçe (District) Tablosu
CREATE TABLE districts (
    id SERIAL PRIMARY KEY,
    province_id INTEGER NOT NULL REFERENCES provinces(id),
    region VARCHAR(20) NULL, -- avrupa, anadolu
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    locksmith1Id UUID REFERENCES locksmiths(id) ON DELETE SET NULL,
    locksmith2Id UUID REFERENCES locksmiths(id) ON DELETE SET NULL,
    adsCallLocksmithId UUID REFERENCES locksmiths(id) ON DELETE SET NULL,
    UNIQUE(province_id, name)
);

-- Mahalle (Neighborhood) Tablosu
CREATE TABLE neighborhoods (
    id SERIAL PRIMARY KEY,
    province_id INTEGER NOT NULL REFERENCES provinces(id),
    district_id INTEGER NOT NULL REFERENCES districts(id),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    UNIQUE(province_id, district_id, name)
);


-- Çilingirler Tablosu
CREATE TABLE locksmiths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    provinceId INTEGER REFERENCES provinces(id),
    districtId INTEGER REFERENCES districts(id),
    businessName TEXT,
    fullName TEXT NOT NULL,
    tagline TEXT,
    email TEXT UNIQUE NOT NULL,
    phoneNumber TEXT NOT NULL,
    whatsappNumber TEXT UNIQUE,
    avgRating NUMERIC(3,2) DEFAULT 0,
    totalReviewCount INTEGER DEFAULT 0,
    profileimageurl TEXT,
    authid UUID REFERENCES auth.users(id),
    isVerified BOOLEAN DEFAULT FALSE,
    isActive BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    createdat TIMESTAMPTZ DEFAULT NOW()
);

-- Çilingir Detayları Tablosu
CREATE TABLE locksmith_details (
    locksmithId UUID PRIMARY KEY REFERENCES locksmiths(id),
    taxNumber TEXT,
    fullAddress TEXT,
    aboutText TEXT,
    websiteUrl TEXT,
    startDate DATE,
    isEmailVerified BOOLEAN DEFAULT FALSE,
    isPhoneVerified BOOLEAN DEFAULT FALSE,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    createdAt TIMESTAMPTZ DEFAULT NOW(),
    lastLogin TIMESTAMPTZ,
    postal_code VARCHAR(10),
    map_url TEXT,
    plus_code TEXT,
    business_type TEXT
);

-- Çilingir Resimleri Tablosu
CREATE TABLE locksmith_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    locksmith_id UUID REFERENCES locksmiths(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_main BOOLEAN DEFAULT FALSE,
    is_profile BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Çilingir Çalışma Saatleri Tablosu
CREATE TABLE locksmith_working_hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    locksmithId UUID REFERENCES locksmiths(id) ON DELETE CASCADE,
    dayOfWeek INTEGER CHECK (dayOfWeek BETWEEN 0 AND 6), -- 0 = Pazar, 6 = Cumartesi
    is24HOpen BOOLEAN DEFAULT FALSE, -- 24 saat açık mı?
    isWorking BOOLEAN DEFAULT TRUE, -- O gün çalışıyor mu?
    openTime TIME, -- Açılış saati
    closeTime TIME, -- Kapanış saati
    UNIQUE (locksmithId, dayOfWeek) -- Aynı çilingir için aynı gün tekrar eklenemesin
);

-- Çilingir Servis İlişkileri Tablosu
CREATE TABLE locksmith_services (
    locksmithId UUID REFERENCES locksmiths(id) ON DELETE CASCADE,
    serviceId UUID REFERENCES services(id) ON DELETE CASCADE,
    isActive BOOLEAN DEFAULT TRUE,
    updatedAt TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (locksmithId, serviceId)
);

-- Çilingir İlçe Servis İlişkileri Tablosu
CREATE TABLE locksmith_districts (
    locksmithId UUID REFERENCES locksmiths(id) ON DELETE CASCADE,
    provinceId INTEGER REFERENCES provinces(id) ON DELETE CASCADE,
    districtId INTEGER REFERENCES districts(id) ON DELETE CASCADE,
    isactive BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (locksmithId, districtId)
);

-- İncelemeler Tablosu
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    locksmithId UUID NOT NULL REFERENCES locksmiths(id),
    userId UUID NOT NULL REFERENCES users(id),
    userName TEXT,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    ipAddress INET,
    deviceType TEXT,
    userAgent TEXT,
    moderatorId UUID,    -- Yorumun onaylayan admin/moderatör kimliği
    approvedAt TIMESTAMPTZ, -- Onaylandığı tarih
    createdAt TIMESTAMPTZ DEFAULT NOW()
);

-- Bildirim Tablosu
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    locksmithId UUID NOT NULL REFERENCES locksmiths(id),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL, -- 'info', 'warning', 'success', 'error' vb.
    link TEXT, -- Opsiyonel: Bildirime tıklandığında gidilecek sayfa/URL
    isRead BOOLEAN DEFAULT FALSE,
    isDismissed BOOLEAN DEFAULT FALSE,
    metadata JSONB, -- Ek bilgiler için esnek alan
    createdAt TIMESTAMPTZ DEFAULT NOW(),
    updatedAt TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fingerprintId TEXT UNIQUE,
    userIp INET,              
    userAgent TEXT,          
    islocksmith BOOLEAN DEFAULT false,
    locksmithId UUID REFERENCES locksmiths(id),
    isSuspicious BOOLEAN DEFAULT false,
    isFraudulent BOOLEAN DEFAULT false,
    latitude decimal(9,6),
    longitude decimal(9,6),
    location_accuracy integer,
    location_source varchar(20),
    createdAt TIMESTAMPTZ DEFAULT NOW(),   
    updatedAt TIMESTAMPTZ DEFAULT NOW()    
);


-- Kullanıcı Aktivite Türleri
CREATE TYPE user_activity_type_enum AS ENUM (
    'search',
    'locksmith_list_view',
    'locksmith_detail_view',
    'call_request',
    'review_submit',
    'whatsapp_message',
    'website_visit',
);


-- Kullanıcı Aktivite Logları Tablosu
CREATE TABLE user_activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    userId UUID REFERENCES users(id) ON DELETE CASCADE, 

    searchProvinceId INTEGER REFERENCES provinces(id),
    searchDistrictId INTEGER REFERENCES districts(id),
    searchServiceId UUID REFERENCES services(id),
    
    activityType user_activity_type_enum NOT NULL,  
    locksmithId UUID REFERENCES locksmiths(id),
    reviewid UUID REFERENCES reviews(id),
    sessionId UUID,
    deviceType TEXT,

    systemNote TEXT,
    
    createdAt TIMESTAMPTZ DEFAULT NOW() 
);


-- Sertifikalar tablosu
CREATE TABLE locksmith_certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    fileurl VARCHAR(512) NOT NULL,
    createdat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    locksmithid UUID NOT NULL,
    filetype VARCHAR(50),
    FOREIGN KEY (locksmithid) REFERENCES locksmiths(id) ON DELETE CASCADE
);

-- Dökümanlar tablosu
CREATE TABLE locksmith_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    fileurl VARCHAR(512) NOT NULL,
    createdat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    locksmithid UUID NOT NULL,
    FOREIGN KEY (locksmithid) REFERENCES locksmiths(id) ON DELETE CASCADE
);

-- Subscriber List
CREATE TABLE newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamp with time zone default now(),
  unsubscribed boolean default false,
  unsubscribe_at timestamp
);


  -- İletişim Formu Tablosu
CREATE TABLE contact_form (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT CHECK (type IN ('customer', 'locksmith')) NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

create table locksmith_balances (
  id uuid primary key default gen_random_uuid(),
  locksmith_id uuid references locksmiths(id) on delete cascade,
  balance numeric(12, 2) not null default 0, -- mevcut bakiye
  daily_spent_limit numeric(12, 2) not null default 0, -- günlük maksimum reklam harcaması
  suggested_daily_limit numeric(12, 2) not null default 0, -- sistemin önerdiği günlük limit
  updated_at timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);


create table locksmith_transactions (
  id uuid primary key default gen_random_uuid(),
  locksmith_id uuid references locksmiths(id) on delete cascade,
  amount numeric(12, 2) not null, -- pozitif (yükleme/düzeltme), negatif (harcama) olabilir
  transaction_type text not null check (transaction_type in (
    'manual_topup',        -- kullanıcı yüklemesi
    'user_request',        -- kullanıcı isteği
    'system_adjustment',   -- sistem düzeltmesi
    'ad_spend',            -- günlük reklam harcaması
    'refund',              -- geri ödeme
    'other'                -- diğer işlemler
  )),
  description text, -- açıklama alanı (isteğe bağlı)
  previous_balance NUMERIC,
  new_balance NUMERIC,
  created_at timestamp with time zone default now()
);


CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    locksmith_id UUID NOT NULL REFERENCES locksmiths(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    used BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE ip_ignore (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ip INET NOT NULL UNIQUE,
    userId UUID REFERENCES users(id) ON DELETE SET NULL, -- bağlantı
    reason TEXT,
    isActive BOOLEAN DEFAULT true,
    createdAt TIMESTAMPTZ DEFAULT NOW(),
    updatedAt TIMESTAMPTZ DEFAULT NOW()
);

create table locksmith_topup_requests (
    id uuid primary key default gen_random_uuid(),
    locksmith_id uuid references locksmiths(id) on delete cascade,
    amount numeric(12, 2) not null check (amount > 0),
    description text,
    status text not null check (status in (
        'pending',    -- Beklemede
        'approved',   -- Onaylandı
        'rejected'    -- Reddedildi
    )) default 'pending',
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    admin_note text                        
);

create table user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  role character varying(20) not null check (role in ('admin', 'locksmith')),
  created_at timestamp with time zone default now()
);

-- Blog Section -->
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
    neighborhood_id INTEGER REFERENCES neighborhoods(id) ON DELETE SET NULL,
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
    category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL,
    topic_id UUID REFERENCES blog_topics(id) ON DELETE SET NULL
);

-- Blog kategorileri tablosu
CREATE TABLE blog_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog konuları tablosu
CREATE TABLE blog_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES blog_categories(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog ayarları tablosu (kullanıcının seçtiği özellikler için)
CREATE TABLE blog_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blog_id UUID NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
    category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL,
    topic_id UUID REFERENCES blog_topics(id) ON DELETE SET NULL,
    user_description TEXT,
    seo_keywords TEXT,
    highlight_keywords TEXT,
    content_style VARCHAR(20) DEFAULT 'normal' CHECK (content_style IN ('normal', 'formal', 'friendly')),
    include_list BOOLEAN DEFAULT FALSE,
    include_table BOOLEAN DEFAULT FALSE,
    include_faq BOOLEAN DEFAULT FALSE,
    include_internal_links BOOLEAN DEFAULT FALSE,
    include_cta BOOLEAN DEFAULT FALSE,
    include_year BOOLEAN DEFAULT FALSE,
    light_humor BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
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