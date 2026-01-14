**(Biçilingir – Rehber Sayfası / Instagram Benzeri UX)**

---

### 📌 PROMPT BAŞLANGICI

Aşağıdaki gereksinimlere uygun olarak **“cilingir-cagirmadan-once-bilmeniz-gerekenler”** adlı **SEO odaklı, rehber niteliğinde, sosyal medya hissi veren** bir web sayfası oluştur.

Tüm resim ve videolar supabase storage da yüklü.

Bu sayfa:

* Bir **rehber sayfasıdır** (blog değildir)
* Kullanıcıyı **sayfada uzun süre tutmayı** hedefler
* Google’ın **Helpful Content + UX sinyallerini** güçlendirmelidir
* Instagram / LinkedIn benzeri **timeline mantığında** aşağı doğru akan içeriklerden oluşmalıdır

---

## 🧱 TEKNİK & GENEL KURALLAR

* Sayfa **çok hızlı açılmalı**
* Tüm görseller ve short videolar **lazy loading** ile yüklenmeli
* İlk ekranda **SEO için metin mutlaka bulunmalı**
* Skeleton loader kullanılmalı
* JS ile render edilen içeriklerde **SEO bozulmamalı**
* Semantik HTML (`article`, `section`, `header`, `main`)
* Mobil öncelikli tasarım (mobile-first)
* Core Web Vitals dostu (CLS, LCP, INP)

---

## 🧠 SAYFA AMACI

Kullanıcı bu sayfaya girdiğinde:

* “Çilingir çağırmadan önce ne yapmalıyım?” sorusuna **tam cevap almalı**
* Güven duymalı
* Eğlenceli, dolu ve kaliteli bir platformda olduğunu hissetmeli
* Rehberden diğer rehberlere, fiyatlara ve lokasyonlara kolayca geçebilmeli

---

## 🧭 SAYFA YAPISI (WIRE-LIKE)

### 🔝 1️⃣ STORY ALANI (EN ÜST)

* Yatay kaydırılabilir
* Yuvarlak, Instagram story gibi
* Her biri bir alt rehber başlığına scroll eder

Story başlıkları:

* “Kapıda kaldım”
* “Anahtar içeride”
* “Fiyatlar”
* “Gece çilingir”
* “Yapılan hatalar”

📌 Story içeriği görsel/video olabilir
📌 Story başlıkları **HTML text olarak da yazılsın** (SEO için)


Örnek Story Resimlerinih Url:
https://ocljqspluklgxppjctnj.supabase.co/storage/v1/object/public/storybox/images/img-1.avif
https://ocljqspluklgxppjctnj.supabase.co/storage/v1/object/public/storybox/images/img-2.jpg
https://ocljqspluklgxppjctnj.supabase.co/storage/v1/object/public/storybox/images/img-3.jpg
https://ocljqspluklgxppjctnj.supabase.co/storage/v1/object/public/storybox/images/img-4.jpg

---

### 🧠 2️⃣ BAŞLIK + KISA AÇIKLAMA (SEO ÇEKİRDEK)

**H1:**
Çilingir Çağırmadan Önce Bilmeniz Gerekenler

Altına 2–3 paragraflık:

* Panik anında ne yapılmalı
* Yanlış kararların maliyeti
* Bu rehberin ne kazandıracağı

Bu alan **tamamen metin ağırlıklı olmalı**

---

### 📰 3️⃣ SOSYAL MEDYA / LINKEDIN TARZI METİN POST AKIŞI

Rehber içeriğini **post post** böl:

Her post:

* Üstte “Biçilingir Rehberi” avatar + zaman etiketi
* İçerik rehber bilgisidir ama **post gibi yazılmıştır**
* Bullet, emoji, kısa paragraflar kullan

Örnek post konuları:

* “Çilingir çağırmadan önce yapılan en büyük hata”
* “Kapıyı zorlamak neden yanlıştır?”
* “Fiyat sormadan çağırmanın riski”

Post altlarında:

* ❤️ 💬 🔁 ikonları (sadece görsel, fake interaction)

---

### 🎥 4️⃣ SHORT VIDEO BLOĞU

* Dikey short videolar
* Instagram Reels / YouTube Shorts hissi
* Lazy load

Her video altında açıklama metni:

> “Bu videoda çilingirin kapıyı hasarsız açma sürecini görüyorsunuz.”

Video URL alanı placeholder:

```
https://ocljqspluklgxppjctnj.supabase.co/storage/v1/object/public/storybox/shorts/short-1.mp4
https://ocljqspluklgxppjctnj.supabase.co/storage/v1/object/public/storybox/shorts/short-2.mp4
https://ocljqspluklgxppjctnj.supabase.co/storage/v1/object/public/storybox/shorts/short-3.mp4
https://ocljqspluklgxppjctnj.supabase.co/storage/v1/object/public/storybox/shorts/short-4.mp4
https://ocljqspluklgxppjctnj.supabase.co/storage/v1/object/public/storybox/shorts/short-5.mp4
```

---

### 🖼️ 5️⃣ INSTAGRAM GİBİ GÖRSEL GALERİ

* Yatay swipe
* Kapı, kilit, oto anahtar, çilingir işi görselleri

Her görsel:

* Lazy load
* Alt text SEO uyumlu

Placeholder:

```
https://ocljqspluklgxppjctnj.supabase.co/storage/v1/object/public/storybox/images/img-5.avif
https://ocljqspluklgxppjctnj.supabase.co/storage/v1/object/public/storybox/images/img-6.jpeg
https://ocljqspluklgxppjctnj.supabase.co/storage/v1/object/public/storybox/images/img-7.jpg
https://ocljqspluklgxppjctnj.supabase.co/storage/v1/object/public/storybox/images/img-8.jpg
https://ocljqspluklgxppjctnj.supabase.co/storage/v1/object/public/storybox/images/img-9.webp
https://ocljqspluklgxppjctnj.supabase.co/storage/v1/object/public/storybox/images/img-10.jpg
```

---

### 💰 6️⃣ FİYAT & KARŞILAŞTIRMA TABLOSU

Tablo içeriği:

* Kapı açma
* Çelik kapı
* Oto anahtar
* Gece servisi

Kolonlar:

* İşlem
* Ortalama süre
* Ortalama fiyat
* Risk durumu

Altına kısa açıklama:
“Fiyatlar şehre, saate ve kilit tipine göre değişebilir.”

---

### 🧑‍🔧 7️⃣ GÜVEN BLOĞU (PLATFORM AVANTAJI)

Kartlar halinde:

* “Neden rastgele çilingir çağırmamalısınız?”
* “Biçilingir nasıl doğrular?”
* “Usta – müşteri güven modeli”

---

### ❓ 8️⃣ FAQ (SCHEMA UYUMLU)

Sorular:

* Çilingir çağırmak güvenli mi?
* Kapıya zarar verir mi?
* Kimlik ister mi?
* Gece fiyat farkı olur mu?

---

### 🔗 9️⃣ İÇ LİNK & KEŞİF ALANI

“Bunlara da göz at” alanı:

* Anahtar içeride kaldı rehberi
* Kapıda kaldım rehberi
* Güncel çilingir fiyatları
* İl / ilçe çilingir bul

---

## 🎨 TASARIM DİLİ

* Instagram + LinkedIn karışımı
* Modern, ferah
* Kart bazlı
* Yuvarlak köşeler
* Soft gölgeler
* Renkli ama göz yormayan

---

## 🚀 BEKLENEN ÇIKTI

* SEO uyumlu HTML yapısı
* Sosyal medya hissi veren rehber sayfa
* Lazy loading + skeleton
* Mobilde çok akıcı
* Kullanıcıyı **en az 3–5 dk sayfada tutacak yapı**

---

### 📌 PROMPT SONU

Bu gereksinimlere göre **tam sayfa kodunu / component yapısını üret**.
Rehber sayfası olduğu unutulmasın.
Blog gibi yazma.
Instagram hissini UX’te ver, SEO’yu metinle koru.
