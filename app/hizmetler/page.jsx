import React from "react";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import Hero from "../../components/Hero";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import SearchForm from "../../components/SearchForm";

const services = [
  {
    id: 1,
    title: "Kapı Açma",
    icon: "🔑",
    description: "Anahtarınızı kaybettiyseniz veya içeride unuttaysanız, profesyonel çilingirlerimiz kapınızı hasarsız bir şekilde açar.",
    details: [
      "Ev, ofis ve araç kapıları için acil açma hizmeti",
      "Hasarsız açma teknikleri",
      "Ortalama 15-30 dakika içinde hizmet",
      "7/24 acil servis"
    ]
  },
  {
    id: 2,
    title: "Kilit Değişimi",
    icon: "🔒",
    description: "Güvenliğiniz için kilit değişimi ve yükseltme hizmetleri. En son teknoloji kilitler ile evinizi ve iş yerinizi güvende tutun.",
    details: [
      "Tüm kilit tipleri için değişim hizmeti",
      "Yüksek güvenlikli kilit sistemleri",
      "Çelik kapı kilitleri",
      "Sigorta onaylı kilitler"
    ]
  },
  {
    id: 3,
    title: "Oto Çilingir",
    icon: "🚗",
    description: "Araç anahtarınızı kaybettiyseniz veya arabanızda unuttaysanız, uzman oto çilingirlerimiz yardımcı olur.",
    details: [
      "Tüm araç markaları için anahtar yapımı",
      "İmmobilizer programlama",
      "Araç kapı açma",
      "Yedek anahtar yapımı"
    ]
  },
  {
    id: 4,
    title: "Kasa Çilingir",
    icon: "💰",
    description: "Kasa şifrenizi unuttunuz mu? Kasanızı açamıyor musunuz? Uzman kasa çilingirlerimiz yardımcı olur.",
    details: [
      "Ev ve ofis kasaları için açma hizmeti",
      "Kasa şifre sıfırlama",
      "Kasa tamir ve bakım",
      "Yeni kasa kurulumu"
    ]
  },
  {
    id: 5,
    title: "Anahtar Kopyalama",
    icon: "🗝️",
    description: "Her türlü anahtar için hızlı ve doğru kopyalama hizmeti. Yedek anahtarlarınızı hazırlayın.",
    details: [
      "Ev, ofis ve araç anahtarları",
      "Çip anahtarlar",
      "Yüksek güvenlikli anahtarlar",
      "Uzaktan kumandalar"
    ]
  },
  {
    id: 6,
    title: "Çelik Kapı Servisi",
    icon: "🚪",
    description: "Çelik kapı montajı, tamiri ve bakımı için profesyonel hizmet.",
    details: [
      "Çelik kapı montajı",
      "Kilit değişimi",
      "Kapı tamiri",
      "Kapı kolu değişimi"
    ]
  },
  {
    id: 7,
    title: "Elektronik Kilit Sistemleri",
    icon: "🔐",
    description: "Modern ve güvenli elektronik kilit sistemleri kurulumu ve bakımı.",
    details: [
      "Parmak izi okuyuculu kilitler",
      "Şifreli kilitler",
      "Kart okuyuculu kilitler",
      "Akıllı ev entegrasyonu"
    ]
  },
  {
    id: 8,
    title: "Acil Çilingir",
    icon: "⚡",
    description: "7/24 acil çilingir hizmeti. Kapınız kilitli kaldığında, anahtarınızı kaybettiğinizde veya kırıldığında hemen yanınızdayız.",
    details: [
      "15 dakika içinde kapınızda",
      "7/24 hizmet",
      "Tüm acil durumlar için çözüm",
      "Hasarsız açma teknikleri"
    ]
  }
];

export default function HizmetlerPage() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Hero Bölümü */}
      <Hero 
        title="Çilingir Hizmetlerimiz" 
        description="Bi Çilingir olarak, kapsamlı çilingir hizmetleri sunuyoruz. Acil durumlardan rutin bakımlara kadar tüm ihtiyaçlarınız için profesyonel çözümler."
      >
        <SearchForm />
      </Hero>

      {/* Hizmetler Listesi */}
      <section className="w-full py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3 className="text-2xl font-bold mb-2 text-blue-600">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.details.map((detail, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Link href="/" className="text-white">Çilingir Bul</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Acil Durum Bölümü */}
      <section className="w-full py-16 px-4 bg-blue-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Hızlı Çilingir Hizmeti</h2>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Kapınız kilitli kaldı? Anahtarınızı kaybettiniz? Endişelenmeyin, 7/24 hızlı çilingir hizmeti ile en kısa sürede yanınızdayız.
          </p>
          <Link href="/">
          <Button className="bg-white text-blue-600 hover:bg-gray-100 font-bold text-lg px-8 py-4 cursor-pointer">
            Hızlı Çilingir Bul
          </Button>
          </Link>
        </div>
      </section>
    </main>
  );
} 