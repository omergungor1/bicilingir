Locksmith yönetim paneli için API endpoint önerileri:
Şimdilik sadece test datası ile çalışacağız. Bu yüzden supabase entegrasyonunu sonra yapacağız. 
Test modu yok!


### 1. Dashboard Endpoint'leri
```
GET /api/locksmith/dashboard/stats
- Parametre: period (today, yesterday, last7days, last30days, thisMonth, thisYear, allTime)
- İşlev: Toplam sayfa görüntüleme, arama sayısı, yorum istatistikleri
- Response: İstatistik detayları

GET /api/locksmith/dashboard/recent-activities
- Son 5 aktiviteyi getirir
```

### 2. Profil Bilgileri Endpoint'leri
```
GET /api/locksmith/profile
- Mevcut profil bilgilerini getirir

PUT /api/locksmith/profile
- Profil bilgilerini günceller
- Request Body: işletme-adı, Ad-soyad, e-posta, telefon, il, ilçe, hakkında, sosyal medya URL'leri

POST /api/locksmith/profile/avatar
- Profil resmini yükler

DELETE /api/locksmith/profile/avatar
- Profil resmini siler

POST /api/locksmith/profile/certificates
- Sertifika yükler

DELETE /api/locksmith/profile/certificates/{certificateId}
- Sertifikayı siler

POST /api/locksmith/profile/business-images
- İşletme fotoğrafı yükler

DELETE /api/locksmith/profile/business-images/{imageId}
- İşletme fotoğrafını siler
```

### 3. Hizmetler Endpoint'leri
```
GET /api/locksmith/services
- Mevcut hizmetleri getirir

PUT /api/locksmith/services
- Hizmetleri günceller
- Request Body: Seçili/pasif hizmetler listesi
```

### 4. Aktivite Geçmişi Endpoint'leri
```
GET /api/locksmith/activities
- Parametreler: 
  - page (sayfa numarası)
  - type (tümü, görüntüleme, ziyaret, çağrı, değerlendirme)
- Aktivite listesini (+toplam sayfa sayısı -> sayfa başı 10 aktivite) getirir
```

### 5. Değerlendirmeler Endpoint'leri
```
GET /api/locksmith/reviews/stats
- İşlev: Toplam review istatistikleri (kaç adet 5 yıldız, yüzdesi, kaç adet 4 yıldız yüzdesi ...)
- Response: Review yıldız dağılım istatistiği

GET /api/locksmith/reviews
- Parametreler:
  - page (sayfa numarası)
  - rating (1,2,3,4,5 yıldız filtreleri)
- Tüm yorumları getirir
```

### 6. Reklam Yönetimi Endpoint'leri
```
GET /api/locksmith/ads/balance
- Anahtar bakiyesini getirir

GET /api/locksmith/ads/packages
- Anahtar paketlerini listeler

GET /api/locksmith/ads/usage
- Parametreler:
  - page (sayfa numarası)
  - period (günlük, haftalık, aylık)
- Anahtar kullanım geçmişini getirir

PUT /api/locksmith/ads/usage-preferences
- Günlük anahtar kullanım tercihlerini (açma-kapama ve kullanılacak anahtar adedini) günceller

PUT /api/locksmith/ads/buy-package
- Parametreler:
  - Paket id
- Anahtar satın alma talebi oluşturur
```

### 7. Hesap Yönetimi Endpoint'leri
```
PUT /api/locksmith/account/password
- Şifre güncelleme
- Request Body: Mevcut şifre, yeni şifre

GET /api/locksmith/account/notification-settings
- Bildirim ayarlarını getiri

PUT /api/locksmith/account/notification-settings
- Bildirim ayarlarını günceller
- Request Body: E-posta, SMS bildirimleri

PUT /api/locksmith/account/status
- Hesap aktiflik durumunu değiştirir
- Request Body: isActive: true-false

DELETE /api/locksmith/account
- Hesabı tamamen siler
```

### Genel Notlar:
- Tüm endpoint'ler authentication gerektirecek. (Sadece supabase auth ile oturum açan çilingir kendi verilerini çekebilmesi ve güncelleyebilmesi gerekiyor. )
- Hata durumunda uygun HTTP status code'ları döndürmeli.
- Gerekli input validasyonları yapılır.
- Hassas işlemler için ek güvenlik kontrolleri uygulanabilir.