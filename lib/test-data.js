// Eski, silinecek


const mockLocksmiths = [
  {
    id: 1,
    name: "Ahmet Usta Çilingir",
    rating: 4.9,
    reviewCount: 156,
    phone: "+90 555 123 4567",
    address: `Kükürtlü Mahallesi, Ana Cadde No: 12, Bursa/Osmangazi`,
    workingHours: "7/24 Hizmet",
    email: "ahmetusta@bicilingir.com",
    profileImage: "/images/default-profile.jpg",
    serviceNames: ["Kapı Açma", "Kilit Değişimi", "Çelik Kapı Tamiri"],
    city: "Bursa",
    district: "Osmangazi",
    price: {
      min: 100,
      max: 500,
    },
    description: "10 yıllık tecrübemle acil durumlarınızda 7/24 hizmetinizdeyim. Kapı açma, kilit değişimi, çelik kapı tamiri gibi tüm çilingir işleriniz için beni arayabilirsiniz.",
    location: { lat: 40.1883, lng: 29.0612 },
  },
  {
    id: 2,
    name: "Mehmet Usta Çilingir",
    rating: 4.7,
    reviewCount: 89,
    phone: "+90 555 765 4321",
    address: `Kükürtlü Mahallesi, Çilingir Sokak No: 5, Bursa/Osmangazi`,
    workingHours: "08:00 - 22:00",
    email: "mehmetusta@bicilingir.com",
    profileImage: "/images/default-profile.jpg",
    serviceNames: ["Oto Çilingir", "Kasa Çilingir", "Kilit Değişimi"],
    city: "Bursa",
    district: "Osmangazi",
    price: {
      min: 100,
      max: 500,
    },
    description: "15 yıllık tecrübemle özellikle oto çilingir konusunda uzmanım. Her türlü araç anahtarı yapımı ve programlama işleriniz için güvenilir hizmet.",
    location: { lat: 40.1875, lng: 29.0605 },
  }
];

// Örnek servisler
const services = [
  {
    id: 1,
    name: "Acil Çilingir",
    slug: "acil-cilingir",
    description: "7/24 hizmet veren acil çilingir ekibimiz, kapınız kilitli kaldığında en hızlı şekilde yanınızda.",
    icon: "🔑",
    price: {
      min: 100,
      max: 500,
    },
  },
  {
    id: 2,
    name: "Oto Çilingir",
    slug: "oto-cilingir",
    description: "Araç anahtarı kopyalama, immobilizer ve kilit sorunları için uzman ekibimiz yanınızda.",
    icon: "🚗",
    price: {
      min: 100,
      max: 500,
    },
  },
  {
    id: 3,
    name: "Ev Çilingir",
    slug: "ev-cilingir",
    description: "Ev ve işyeri kilit değişimi, güvenlik sistemleri ve anahtarsız kilitler için çözümler.",
    icon: "🏠",
    price: {
      min: 100,
      max: 500,
    },
  },
  {
    id: 4,
    name: "Kasa Çilingir",
    slug: "kasa-cilingir",
    description: "Kasa açma, kilit değişimi ve şifre resetleme işlemleri için profesyonel hizmet.",
    icon: "🔐",
    price: {
      min: 100,
      max: 500,
    },
  },
  {
    id: 5,
    name: "7/24 Çilingir",
    slug: "724-cilingir",
    description: "Gece gündüz, hafta sonu ve resmi tatillerde bile hizmet veren çilingir ekibi.",
    icon: "🕒",
    price: {
      min: 100,
      max: 500,
    },
  },
  {
    id: 6,
    name: "Çilingir Hizmeti",
    slug: "cilingir-hizmeti",
    description: "Her türlü anahtar ve kilit probleminiz için genel çilingir hizmetleri.",
    icon: "🔧",
    price: {
      min: 100,
      max: 500,
    },
  }
];


export { services, mockLocksmiths };