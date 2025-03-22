// Test verileri - Gerçek veritabanı olmadan çalışmak için geçici veri
export const testLocksmiths = [
  {
    id: '1',
    name: "Anahtar Ustası",
    location: "İstanbul, Kadıköy",
    rating: 4.8,
    reviewCount: 124,
    services: [
      { name: "Kapı Açma" },
      { name: "Kilit Değiştirme" },
      { name: "Çelik Kapı" }
    ],
    price: "150₺ - 300₺",
    description: "7/24 acil kapı açma ve kilit değiştirme hizmetleri. Profesyonel ekip ile hızlı ve güvenilir çözümler sunuyoruz.",
    detailedDescription: "Anahtar Usta olarak 15 yıldır İstanbul'da hizmet vermekteyiz. Profesyonel ekibimiz ve modern ekipmanlarımızla kapı açma, kilit değiştirme, çelik kapı montajı ve tamiratı gibi tüm çilingir hizmetlerini sunuyoruz. Acil durumlarda 20 dakika içinde kapınızdayız. Tüm hizmetlerimizde kalite ve müşteri memnuniyeti önceliğimizdir. Uygun fiyat garantisi veriyoruz.",
    phone: "0532 123 45 67",
    experience: "15 yıl",
    address: "Caferağa Mah. Moda Cad. No:123, Kadıköy/İstanbul",
    website: "www.anahtarusta.com",
    workingHours: {
      Pazartesi: { open: "09:00", close: "18:00", isOpen: true, is24Hours: false },
      Salı: { open: "09:00", close: "18:00", isOpen: true, is24Hours: false },
      Çarşamba: { open: "09:00", close: "18:00", isOpen: true, is24Hours: false },
      Perşembe: { open: "09:00", close: "18:00", isOpen: true, is24Hours: false },
      Cuma: { open: "09:00", close: "18:00", isOpen: true, is24Hours: false },
      Cumartesi: { open: "10:00", close: "16:00", isOpen: true, is24Hours: false },
      Pazar: { open: "Kapalı", close: "Kapalı", isOpen: false, is24Hours: false }
    },
    images: [
      "/images/dukkan1.jpg",
      "/images/dukkan2.jpg",
      "/images/dukkan3.jpg",
      "/images/dukkan4.jpg"
    ],
    certificates: ["TSE Belgesi", "Mesleki Yeterlilik Belgesi", "Ustalık Belgesi"],
    reviews: [
      { user: "Ahmet Y.", rating: 5, comment: "Çok hızlı geldiler ve kapımı hasarsız açtılar. Teşekkürler!", date: "2 hafta önce" },
      { user: "Ayşe K.", rating: 4, comment: "Kilit değişimi için çağırdım, işlerini profesyonelce yaptılar.", date: "1 ay önce" },
      { user: "Mehmet S.", rating: 5, comment: "Gece yarısı aradım, 15 dakikada geldiler. Harika hizmet!", date: "3 ay önce" }
    ]
  },
  {
    id: '2',
    name: "Hızlı Çilingir",
    location: "İstanbul, Beşiktaş",
    rating: 4.6,
    reviewCount: 98,
    services: [
      { name: "Acil Çilingir" },
      { name: "Oto Çilingir" },
      { name: "Kasa Çilingir" }
    ],
    price: "200₺ - 350₺",
    description: "15 dakika içinde kapınızdayız. Oto, ev ve iş yeri için profesyonel çilingir hizmetleri.",
    detailedDescription: "Hızlı Çilingir olarak 7/24 acil çilingir hizmeti sunmaktayız. Özellikle otomobil kilitleri konusunda uzmanız. Anahtar kopyalama, çelik kasa açma ve kilit değiştirme gibi tüm hizmetleri sunuyoruz.",
    phone: "0533 234 56 78",
    experience: "10 yıl",
    address: "Sinanpaşa Mah. Ihlamurdere Cad. No:45, Beşiktaş/İstanbul",
    website: "www.hizlicilingir.com",
    workingHours: {
      Pazartesi: { open: "00:00", close: "24:00", isOpen: true, is24Hours: true },
      Salı: { open: "00:00", close: "24:00", isOpen: true, is24Hours: true },
      Çarşamba: { open: "00:00", close: "24:00", isOpen: true, is24Hours: true },
      Perşembe: { open: "00:00", close: "24:00", isOpen: true, is24Hours: true },
      Cuma: { open: "00:00", close: "24:00", isOpen: true, is24Hours: true },
      Cumartesi: { open: "00:00", close: "24:00", isOpen: true, is24Hours: true },
      Pazar: { open: "00:00", close: "24:00", isOpen: true, is24Hours: true }
    },
    images: [
      "/images/dukkan1.jpg",
      "/images/dukkan2.jpg",
      "/images/dukkan3.jpg"
    ],
    certificates: ["TSE Belgesi", "Oto Çilingir Sertifikası"],
    reviews: [
      { user: "Kemal B.", rating: 5, comment: "Araç anahtarımı kaybetmiştim, yenisini hızlıca yaptılar.", date: "1 ay önce" },
      { user: "Zeynep D.", rating: 4, comment: "Kilit değişimi için geldiler, hızlı ve profesyonel çalıştılar.", date: "2 ay önce" }
    ]
  },
  {
    id: '3',
    name: "Güvenli Anahtar",
    location: "İstanbul, Şişli",
    rating: 4.9,
    reviewCount: 156,
    services: [
      { name: "Çelik Kapı" },
      { name: "Kasa Çilingir" },
      { name: "Kilit Değiştirme" }
    ],
    price: "180₺ - 400₺",
    description: "Yüksek güvenlikli kilit sistemleri ve çelik kapı uzmanı. 20 yıllık tecrübe ile hizmetinizdeyiz.",
    detailedDescription: "Güvenli Anahtar olarak yüksek güvenlikli kilit sistemleri konusunda uzmanız. Çelik kapı montajı, elektronik kilit sistemleri, parmak izi veya kart okuyuculu özel sistemler kuruyoruz. 20 yıllık tecrübemizle en üst düzey güvenlik çözümleri sağlıyoruz.",
    phone: "0532 345 67 89",
    experience: "20 yıl",
    address: "Mecidiyeköy Mah. Büyükdere Cad. No:78, Şişli/İstanbul",
    website: "www.guvenlianahtar.com",
    workingHours: {
      Pazartesi: { open: "08:00", close: "20:00", isOpen: true, is24Hours: false },
      Salı: { open: "08:00", close: "20:00", isOpen: true, is24Hours: false },
      Çarşamba: { open: "08:00", close: "20:00", isOpen: true, is24Hours: false },
      Perşembe: { open: "08:00", close: "20:00", isOpen: true, is24Hours: false },
      Cuma: { open: "08:00", close: "20:00", isOpen: true, is24Hours: false },
      Cumartesi: { open: "09:00", close: "18:00", isOpen: true, is24Hours: false },
      Pazar: { open: "10:00", close: "16:00", isOpen: true, is24Hours: false }
    },
    images: [
      "/images/dukkan1.jpg",
      "/images/dukkan2.jpg",
      "/images/dukkan3.jpg",
      "/images/dukkan4.jpg"
    ],
    certificates: ["TSE Belgesi", "Elektronik Kilit Sistemleri Sertifikası", "Çelik Kapı Montaj Sertifikası"],
    reviews: [
      { user: "Ali T.", rating: 5, comment: "Çelik kapı montajını çok profesyonel yaptılar, çok memnun kaldım.", date: "3 hafta önce" },
      { user: "Fatma Y.", rating: 5, comment: "Parmak izi okuyuculu kilit taktırdık, mükemmel çalışıyor.", date: "1 ay önce" },
      { user: "Hasan Ş.", rating: 5, comment: "Kasama şifreli kilit taktırdım, işlerinde çok profesyoneller.", date: "2 ay önce" }
    ]
  }
];

// Test paketleri
export const testPackages = [
  {
    id: '1',
    name: 'Başlangıç',
    description: 'İlk kez kullananlar için ideal paket',
    rocket_amount: 20, 
    price: 200.00,
    is_active: true,
    is_unlimited: false,
    valid_until: null,
    created_at: '2023-05-10T14:30:00.000Z'
  },
  {
    id: '2',
    name: 'Orta',
    description: 'Orta ölçekli çilingirler için',
    rocket_amount: 50, 
    price: 450.00,
    is_active: true,
    is_unlimited: false,
    valid_until: null,
    created_at: '2023-05-10T14:30:00.000Z'
  },
  {
    id: '3',
    name: 'Pro',
    description: 'Yoğun iş yapan çilingirler için',
    rocket_amount: 100, 
    price: 800.00,
    is_active: true,
    is_unlimited: false,
    valid_until: null,
    created_at: '2023-05-10T14:30:00.000Z'
  },
  {
    id: '4',
    name: 'VIP',
    description: 'En kapsamlı paket',
    rocket_amount: 200, 
    price: 1500.00,
    is_active: true,
    is_unlimited: false,
    valid_until: null,
    created_at: '2023-05-10T14:30:00.000Z'
  }
];

// Test değerlendirmeleri
export const testReviews = [
  {
    id: '1',
    locksmith_id: '1',
    user_name: 'Ahmet Yılmaz',
    rating: 5,
    comment: 'Çok hızlı geldiler ve kapımı hasarsız açtılar. Teşekkürler!',
    location: 'İstanbul, Kadıköy',
    status: 'approved',
    created_at: '2023-05-10T14:30:00.000Z',
    locksmiths: {
      name: 'Anahtar Usta',
      location: 'İstanbul, Kadıköy'
    }
  },
  {
    id: '2',
    locksmith_id: '1',
    user_name: 'Ayşe Kaya',
    rating: 4,
    comment: 'Kilit değişimi için çağırdım, işlerini profesyonelce yaptılar.',
    location: 'İstanbul, Kadıköy',
    status: 'approved',
    created_at: '2023-04-15T10:30:00.000Z',
    locksmiths: {
      name: 'Anahtar Usta',
      location: 'İstanbul, Kadıköy'
    }
  },
  {
    id: '3',
    locksmith_id: '2',
    user_name: 'Kemal Büyük',
    rating: 5,
    comment: 'Araç anahtarımı kaybetmiştim, yenisini hızlıca yaptılar.',
    location: 'İstanbul, Beşiktaş',
    status: 'approved',
    created_at: '2023-04-20T16:45:00.000Z',
    locksmiths: {
      name: 'Hızlı Çilingir',
      location: 'İstanbul, Beşiktaş'
    }
  },
  {
    id: '4',
    locksmith_id: '3',
    user_name: 'Ali Tekin',
    rating: 5,
    comment: 'Çelik kapı montajını çok profesyonel yaptılar, çok memnun kaldım.',
    location: 'İstanbul, Şişli',
    status: 'pending',
    created_at: '2023-05-05T09:15:00.000Z',
    locksmiths: {
      name: 'Güvenli Anahtar',
      location: 'İstanbul, Şişli'
    }
  },
  {
    id: '5',
    locksmith_id: '2',
    user_name: 'Zeynep Demir',
    rating: 3,
    comment: 'Biraz geç geldiler ama işlerini iyi yaptılar.',
    location: 'İstanbul, Beşiktaş',
    status: 'rejected',
    created_at: '2023-03-25T13:20:00.000Z',
    locksmiths: {
      name: 'Hızlı Çilingir',
      location: 'İstanbul, Beşiktaş'
    }
  }
];

// Test aktiviteleri
export const testActivities = [
  {
    id: '1',
    activity_type: 'locksmith',
    description: 'Yeni çilingir kaydı: Anahtar Usta',
    subject_id: '1',
    created_at: '2023-04-01T10:00:00.000Z'
  },
  {
    id: '2',
    activity_type: 'review',
    description: 'Ahmet Yılmaz isimli kullanıcı 5 yıldız değerlendirme yaptı.',
    subject_id: '1',
    created_at: '2023-05-10T14:30:00.000Z'
  },
  {
    id: '3',
    activity_type: 'locksmith',
    description: 'Yeni çilingir kaydı: Hızlı Çilingir',
    subject_id: '2',
    created_at: '2023-04-03T11:15:00.000Z'
  },
  {
    id: '4',
    activity_type: 'call',
    description: 'Acil çilingir çağrısı: Anahtar Usta',
    subject_id: '1',
    created_at: '2023-05-12T23:40:00.000Z'
  },
  {
    id: '5',
    activity_type: 'user',
    description: 'Yeni kullanıcı kaydı: Zeynep Demir',
    subject_id: null,
    created_at: '2023-03-25T13:00:00.000Z'
  }
]; 