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
    description: "Anahtarınızı kaybettiniz mi? Kilitli kalan kapınız mı var? 7/24 hizmet veren çilingirlerimiz kapınızı hızlı ve hasarsız açar.",
    details: [
      "Ev, iş yeri, apartman kapısı açma",
      "Acil durumlarda 15-30 dakikada müdahale",
      "Hasarsız açma yöntemleri",
      "Gizli kilit sistemlerine özel çözümler",
      "Anahtar içeride kaldıysa hızlı destek"
    ]
  },
  {
    id: 2,
    title: "Acil Çilingir Hizmeti",
    icon: "🚨",
    description: "Gece gündüz fark etmeden kapıda mı kaldınız? Acil çilingir ihtiyaçlarınızda en yakın çilingiri hemen bulun.",
    details: [
      "7/24 çilingir hizmeti",
      "Mobil ekiplerle hızlı ulaşım",
      "Tüm mahallelerde hızlı hizmet",
      "Bayram ve tatil günlerinde aktif"
    ]
  },
  {
    id: 3,
    title: "Kilit Değişimi ve Yenileme",
    icon: "🛠️",
    description: "Evinizde veya iş yerinizde güvenliği artırmak için kilitlerinizi değiştiriyoruz.",
    details: [
      "Kırılan veya arızalı kilitlerin değişimi",
      "Yüksek güvenlikli kilit sistemleri",
      "Çelik kapı kilit değişimi",
      "Hırsızlığa karşı özel kilit sistemleri"
    ]
  },
  {
    id: 4,
    title: "Anahtar Kopyalama",
    icon: "🗝️",
    description: "Yedek anahtara mı ihtiyacınız var? Anahtar kopyalama hizmetimizle dakikalar içinde çözüm sunuyoruz.",
    details: [
      "Ev, ofis, çelik kapı anahtarı çoğaltma",
      "Otomobil anahtarı yedekleme",
      "İmmobilizerli anahtar kopyalama",
      "Garantili ve hızlı anahtar çoğaltma"
    ]
  },
  {
    id: 5,
    title: "Otomobil Çilingir Hizmeti",
    icon: "🚗",
    description: "Aracınızın kapısı mı kilitlendi? Anahtarınızı içeride mi unuttunuz? Otomobil çilingirleri hizmetinizde.",
    details: [
      "Araç kapısı açma (hasarsız)",
      "Otomobil anahtar kopyalama ve yedekleme",
      "Kayıp oto anahtarı yapımı",
      "Çipli ve uzaktan kumandalı anahtar çözümleri"
    ]
  },
  {
    id: 6,
    title: "Kasa Açma Hizmeti",
    icon: "🧰",
    description: "Şifreli veya anahtarlı kasanızı açamıyor musunuz? Uzman çilingirler kasanızı zarar vermeden açar.",
    details: [
      "Ev tipi, ofis tipi ve dijital kasa açma",
      "Şifreli kasa çözümleri",
      "Kilitli kalan kasalara özel müdahale",
      "Şifre sıfırlama ve kilit değişimi"
    ]
  },
  {
    id: 7,
    title: "Elektronik Kilit ve Kartlı Giriş Sistemleri",
    icon: "🔐",
    description: "Modern güvenlik çözümleri için elektronik kilit ve kartlı sistem kurulumları yapıyoruz.",
    details: [
      "Otel tipi kartlı kilit sistemleri",
      "Apartmanlara ve iş yerlerine parmak izi kilidi",
      "Şifreli kapı kilidi kurulumu",
      "Akıllı ev güvenlik sistemleri entegrasyonu"
    ]
  },
  {
    id: 8,
    title: "Elektronik Otopark Sistemi Kurulumu ve Kumanda Hizmetleri",
    icon: "🅿️",
    description: "Apartman ve sitelere özel otopark kumandası sistemleri kurulumu, tamiri ve kumanda kopyalama hizmeti.",
    details: [
      "Otopark bariyer sistemi kurulumu",
      "Uzaktan kumanda kopyalama",
      "Bozulan otopark sistemlerinin tamiri",
      "Site giriş sistemleri için teknik destek"
    ]
  },
  {
    id: 9,
    title: "Apartman Hırsız Kilidi Montajı",
    icon: "🛡️",
    description: "Apartman giriş kapılarına özel, hırsızlara karşı koruma sağlayan yüksek güvenlikli kilit montajı.",
    details: [
      "Çelik destekli kilit montajı",
      "Anti-hırsız sistemler",
      "Hırsızların açamayacağı kilit sistemleri",
      "Toplu konutlara uygun çözümler"
    ]
  },
  {
    id: 10,
    title: "İmmobilizer Anahtar Hizmetleri",
    icon: "📡",
    description: "Çipli araç anahtarlarınızın tamiri, kopyalanması veya yeniden programlanması için hizmet veriyoruz.",
    details: [
      "İmmobilizer çip kopyalama",
      "Otomobil kumandası tamiri",
      "Kayıp çipli anahtarların yeniden üretimi",
      "Yedek oto anahtarı programlama"
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
      />

      {/* Hizmetler Listesi */}
      <section className="w-full py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-blue-700">Tüm Çilingir Hizmetleri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
                <div className="p-6 flex-grow">
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
                <div className="px-6 py-4 bg-gray-50 border-t mt-auto">
                  <Link href="/" className="text-white">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Çilingir Bul
                    </Button>
                  </Link>
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