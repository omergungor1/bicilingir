Şimdi admin panele bir özellik ekleyelim. "Çilingir İmport" seçeneği. admin > layout > navigation  Csv formatında çilingir listesini import edip veri tabanına otomatik kaydetmesi için bir sayfa eklemeliyiz. Admin Csv dosyayı drop yapacak, ardından listedeki çilingirlerin önizlemesi gösterilecek bir tabloda import edilmeden önce. 


Öncelikle bir çilingir insert etmek için şu tablolara çilingiri insert etmelisin->
locksmiths
locksmith_details
locksmith_districts
locksmith_services
locksmith_working_hours
locksmith_images


Vereceğim csv deki alanlar şöyle: business_name	name_slug	name_slug_2	phone_number	maps_url	province	province_slug	province_id	district	district_id	district_slug	locsksmith_slug	adress	plus_code	web_site_url	latitude	longitude	rating	review_count	business_type	image_url	working_hours


-> Örnek 3 adet çilingir kaydı csv dosyadan örnekler: 

Adalar Anahtar	adalar anahtar	adalar-anahtar	(0216) 382 84 66	https://www.google.com/maps/place/Adalar+Anahtar/data=!4m7!3m6!1s0x14cac183715aebcf:0x816a41ac1a9ee58c!8m2!3d40.8748284!4d29.1300921!16s%2Fg%2F1hc2xcgld!19sChIJz-tacYPByhQRjOWeGqxBaoE?authuser=0&hl=tr&rclk=1	İstanbul	istanbul	34	Adalar	448	adalar	istanbul/adalar/adalar-anahtar	Maden, Çiçekli Yalı Sokak No:3, 34970 Adalar/İstanbul	V4FJ+W2 Adalar, İstanbul		40.8748284	29.1300921	3	1	Çilingir		{"Perşembe":"08:00–20:00","Cuma":"08:00–20:00","Cumartesi":"09:00–19:00","Pazar":"Kapalı","Pazartesi":"08:00–20:00","Salı":"08:00–20:00","Çarşamba":"08:00–20:00"}

Heybeliada Anahtarcısı	heybeliada anahtarcisi	heybeliada-anahtarcisi	(0535) 712 81 75	https://www.google.com/maps/place/Heybeliada+Anahtarc%C4%B1s%C4%B1/data=!4m7!3m6!1s0x14cac1b1fa41e073:0xb19befe5fe1aea1a!8m2!3d40.8772499!4d29.0988102!16s%2Fg%2F1pp2tx7jd!19sChIJc-BB-rHByhQRGuoa_uXvm7E?authuser=0&hl=tr&rclk=1	İstanbul	istanbul	34	Adalar	448	adalar	istanbul/adalar/heybeliada-anahtarcisi	Heybeliada erkal Sokak Heybeliada Anahtarcısı, 34973	V3GX+VG Adalar, İstanbul		40.8772499	29.0988102	4	5	Çilingir		{"Perşembe":"08:00–20:00","Cuma":"08:00–20:00","Cumartesi":"09:00–19:00","Pazar":"Kapalı","Pazartesi":"08:00–20:00","Salı":"08:00–20:00","Çarşamba":"08:00–20:00"}

7/24 Çilingir Elektrikçi Uydu Anahtarcı Acil	7/24 cilingir elektrikci uydu anahtarci acil	7-24-cilingir-elektrikci-uydu-anahtarci-acil	(0545) 809 27 97	https://www.google.com/maps/place/7%2F24+%C3%87ilingir+Elektrik%C3%A7i+uydu+Anahtarc%C4%B1+AC%C4%B0L/data=!4m7!3m6!1s0x14cac712a62528c1:0x1b90ed3c79d49028!8m2!3d40.9775846!4d29.1386501!16s%2Fg%2F11vrxp9c73!19sChIJwSglphLHyhQRKJDUeTztkBs?authuser=0&hl=tr&rclk=1	İstanbul	istanbul	34	Ataşehir	450	atasehir	istanbul/atasehir/7-24-cilingir-elektrikci-uydu-anahtarci-acil	İnönü, Yurtsever Cd. 11 a, 34755 Ataşehir/İstanbul	X4HQ+2F Ataşehir, İstanbul		40.9775846	29.1386501	4.5	37	Acil Çilingir Hizmeti	https://lh3.googleusercontent.com/p/AF1QipPIgenLsrnT2q4ETNgbRWbN-g3MJwxBiUw9dZd5=w408-h259-k-no	{"Perşembe":"24 saat açık","Cuma":"24 saat açık","Cumartesi":"24 saat açık","Pazar":"24 saat açık","Pazartesi":"24 saat açık","Salı":"24 saat açık","Çarşamba":"24 saat açık"}

Ekleyeceğin tabloların tasarımları aşağıdaki gibidir. Lazım olursa diğer tüm tablo detayları ana dizinde bulunan /db.sql dosyasında var. 

CREATE TABLE locksmiths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL, //locsksmith_slug
    provinceId INTEGER REFERENCES provinces(id),
    districtId INTEGER REFERENCES districts(id),
    businessName TEXT, //business_name
    fullName TEXT NOT NULL, //boş kalacak
    tagline TEXT, //boş kalacak
    email TEXT UNIQUE NOT NULL, //boş kalacak
    phoneNumber TEXT NOT NULL, //phone_number düzenlenmesi gerekiyor -> tablodaki formatımız: 0536 601 38 57 csv dosyadaki format: (0216) 382 84 66 -> parantezleri kaldırman yeterli
    whatsappNumber TEXT UNIQUE, //phone_number yanısını parantezleri kaldırarak ekle -> tablodaki formatımız: 0536 601 38 57 csv dosyadaki format: (0216) 382 84 66 -> parantezleri kaldırman 
    avgRating NUMERIC(3,2) DEFAULT 0,  //rating -> veri yoksa boşsa 4 yazalım default. csv deki veriler türlü türlü. Bazıları tek karakter bazıları nokta içeriyor: 4 4.5 5 4.2
    totalReviewCount INTEGER DEFAULT 0, //review_count -> veri yoksa 3 yazalım default
    profileimageurl TEXT, 
    authid UUID REFERENCES auth.users(id), // null kalacak -> henüz işletmeler sahiplenilmedi
    isVerified BOOLEAN DEFAULT FALSE, //false
    isActive BOOLEAN DEFAULT FALSE, //false
    createdat TIMESTAMPTZ DEFAULT NOW()
); 

-- Çilingir Detayları Tablosu
CREATE TABLE locksmith_details (
    locksmithId UUID PRIMARY KEY REFERENCES locksmiths(id),
    taxNumber TEXT, //null
    fullAddress TEXT, // adress
    aboutText TEXT, //null
    websiteUrl TEXT, //web_site_url
    startDate DATE, //null
    isEmailVerified BOOLEAN DEFAULT FALSE, //false
    isPhoneVerified BOOLEAN DEFAULT FALSE, //false
    totalReviewsCount INTEGER DEFAULT 0, //review_count
    avgRating NUMERIC(3,2) DEFAULT 0, //rating
    lat DOUBLE PRECISION, //latitude -> veri yoksa null koyabilirsin
    lng DOUBLE PRECISION, //longitude -> veri yoksa null koyabilirsin
    createdAt TIMESTAMPTZ DEFAULT NOW(),
    lastLogin TIMESTAMPTZ,
    postal_code VARCHAR(10) //null
);

-- Çilingir İlçe Servis İlişkileri Tablosu -> sadece 1 kayıt ekleyeceksin her çilingir için. Kendi bulunduğu ilçe eklenmelidir!
CREATE TABLE locksmith_districts (
    locksmithId UUID REFERENCES locksmiths(id) ON DELETE CASCADE,
    provinceId INTEGER REFERENCES provinces(id) ON DELETE CASCADE, //province_id
    districtId INTEGER REFERENCES districts(id) ON DELETE CASCADE, //district_id
    isactive BOOLEAN DEFAULT TRUE, //true
    PRIMARY KEY (locksmithId, districtId)
);

-- Çilingir Servis İlişkileri Tablosu
-- Tüm eklediğin çilingirlere verdiğim servis id lerini otomatik insert etmelisin -> 69fe5a65-88ee-4e23-b3e8-b53370f5721a, 7e18c529-faf1-4139-be87-92e2c3ed98aa, 915e4a47-b6b6-42c0-a3eb-424262b7b238, a5570d34-ee52-4f69-8010-0dce311cbc7e, a782c9d0-e2d6-48fd-b537-ad3d7482ef0e
CREATE TABLE locksmith_services (
    locksmithId UUID REFERENCES locksmiths(id) ON DELETE CASCADE,
    serviceId UUID REFERENCES services(id) ON DELETE CASCADE,
    isActive BOOLEAN DEFAULT TRUE,
    updatedAt TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (locksmithId, serviceId)
);


-- Çilingir Çalışma Saatleri Tablosu
-- Üç ayrı formatta çalışma saatleri olabilir csv dosyada. Bunlar google mapte belirtilen formatlar. Bizde bir çilingirin toplam 7 kaydı olması gerekiyor. Aşağıya birkaç örnek bırakıyorum csv dosyada geçen:
-- {"Perşembe":"08:00–20:00","Cuma":"08:00–20:00","Cumartesi":"09:00–19:00","Pazar":"Kapalı","Pazartesi":"08:00–20:00","Salı":"08:00–20:00","Çarşamba":"08:00–20:00"}
-- {"Perşembe":"24 saat açık","Cuma":"24 saat açık","Cumartesi":"24 saat açık","Pazar":"24 saat açık","Pazartesi":"24 saat açık","Salı":"24 saat açık","Çarşamba":"24 saat açık"}
-- {"Çarşamba":"00:00–06:30, 20:30–00:00","Perşembe":"00:00–06:30, 20:30–00:00","Cuma":"Kapalı","Cumartesi":"00:00–06:30, 20:30–00:00","Pazar":"00:00–06:30, 20:00–00:00","Pazartesi":"00:00–06:30, 20:00–00:00","Salı":"00:00–06:00, 20:30–00:00"} -> bunun gibi standart dışı bir format gelirse yada çalışma saatleri boşsa "24 saat açık" yap 7 gün içinde
CREATE TABLE locksmith_working_hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    locksmithId UUID REFERENCES locksmiths(id) ON DELETE CASCADE,
    dayOfWeek INTEGER CHECK (dayOfWeek BETWEEN 0 AND 6), -- 0 = Pazar, 6 = Cumartesi
    is24HOpen BOOLEAN DEFAULT FALSE, -- 24 saat açık mı?
    isWorking BOOLEAN DEFAULT TRUE, -- O gün çalışıyor mu?
    openTime TIME, -- Açılış saati
    closeTime TIME, -- Kapanış saati
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    UNIQUE (locksmithId, dayOfWeek) -- Aynı çilingir için aynı gün tekrar eklenemesin
);



-- Çilingir Resimleri Tablosu
-- https://lh3.googleusercontent.com/gps-cs-s/AG0ilSzvDo1_2L7h3bdU8uM0wwWl8mIaW0NieT5pHDRfZJ5emmLRrHwPmENKzaZ1AKzgyWe6SIXtMQqxa- -> google sunucunda çilingirin resmi var
-- Bu resmi çekmemiz ve kendi supa storage eklememiz lazım. 
-- supabase butckets -> business-images buketine google daki resmi upload etmemiz ve resim linkini bu tabloya kaydetmemiz gerekiyor. 
CREATE TABLE locksmith_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    locksmith_id UUID REFERENCES locksmiths(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_main BOOLEAN DEFAULT FALSE,
    is_profile BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);



-- örnek işletme görseli upload kodu:
 // Dosya adını oluştur (timestamp ve random değer ile)
    const fileExt = file.name.split('.').pop();
    const fileName = `${locksmithId}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${fileName}`;

    // Storage'a dosya yükle
    const { data: storageData, error: storageError } = await supabase
      .storage
      .from('business-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      });

    if (storageError) {
      console.error('Dosya yükleme hatası:', storageError);
      return NextResponse.json({ error: 'Dosya yüklenirken bir hata oluştu' }, { status: 500 });
    }

    // Public URL al
    const { data: publicURLData } = supabase
      .storage
      .from('business-images')
      .getPublicUrl(filePath);

    const imageUrl = publicURLData.publicUrl;

    // Eğer profil fotoğrafı ise, diğer profil fotoğraflarını normal yap
    if (isProfile) {
      await supabase
        .from('locksmith_images')
        .update({ is_profile: false })
        .eq('locksmith_id', locksmithId)
        .eq('is_profile', true);
    }