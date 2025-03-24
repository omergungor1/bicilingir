import React from "react";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import Hero from "../../components/Hero";
import SearchForm from "../../components/SearchForm";

const teamMembers = [
  {
    id: 1,
    name: "Ali Yılmaz",
    role: "Kurucu & CEO",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    bio: "10 yıllık yazılım ve girişimcilik deneyimine sahip. Bi Çilingir'i kurarak çilingir hizmetlerini daha erişilebilir hale getirmeyi hedefliyor."
  },
  {
    id: 2,
    name: "Ayşe Kaya",
    role: "Operasyon Müdürü",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    bio: "Lojistik ve operasyon alanında 8 yıllık deneyime sahip. Bi Çilingir'de çilingir ağının sorunsuz çalışmasını sağlıyor."
  },
  {
    id: 3,
    name: "Mehmet Demir",
    role: "Teknoloji Direktörü",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    bio: "Yazılım geliştirme ve teknoloji alanında 12 yıllık deneyime sahip. Bi Çilingir'in teknolojik altyapısını yönetiyor."
  },
  {
    id: 4,
    name: "Zeynep Şahin",
    role: "Müşteri İlişkileri Müdürü",
    image: "https://randomuser.me/api/portraits/women/28.jpg",
    bio: "Müşteri hizmetleri alanında 6 yıllık deneyime sahip. Bi Çilingir'de müşteri memnuniyetini en üst seviyede tutmayı hedefliyor."
  }
];

const stats = [
  { id: 1, value: "10,000+", label: "Tamamlanan İş" },
  { id: 2, value: "500+", label: "Aktif Çilingir" },
  { id: 3, value: "81", label: "Hizmet Verilen İl" },
  { id: 4, value: "4.8/5", label: "Müşteri Memnuniyeti" }
];

const values = [
  {
    id: 1,
    title: "Güvenilirlik",
    icon: "🔒",
    description: "Tüm çilingirlerimiz güvenlik kontrolünden geçer ve sertifikalıdır. Müşterilerimizin güvenliği bizim için en önemli önceliktir."
  },
  {
    id: 2,
    title: "Hız",
    icon: "⚡",
    description: "Acil durumlarda hızlı müdahale hayati önem taşır. Çilingirlerimiz en kısa sürede müşterilerimizin yanında olur."
  },
  {
    id: 3,
    title: "Kalite",
    icon: "✨",
    description: "Yüksek kaliteli hizmet sunmak için çilingirlerimizi düzenli olarak denetler ve eğitiriz. Kalite standartlarımızdan ödün vermeyiz."
  },
  {
    id: 4,
    title: "Şeffaflık",
    icon: "👁️",
    description: "Fiyatlarımız ve hizmet standartlarımız konusunda tamamen şeffafız. Müşterilerimiz her zaman ne için ödeme yaptıklarını bilirler."
  }
];

export default function HakkimizdaPage() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Hero Bölümü */}
      <Hero 
        title="Hakkımızda" 
        description="Bi Çilingir, çilingir hizmetlerini daha erişilebilir, güvenilir ve şeffaf hale getirmek için kurulmuş bir platformdur."
      />

      {/* Hikayemiz Bölümü */}
      <section className="w-full py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Hikayemiz</h2>
          <div className="prose prose-lg mx-auto">
            <p className="text-gray-600 mb-4">
              Bi Çilingir, 2020 yılında kuruldu. Ömer, bir gün evinin anahtarını kaybettiğinde güvenilir bir çilingir bulmakta zorlandı. Saatlerce araştırma yaptıktan sonra, sonunda bir çilingir bulabildi, ancak bu süreç oldukça stresli ve zaman alıcıydı.
            </p>
            <p className="text-gray-600 mb-4">
              Bu deneyimden sonra, Ömer çilingir hizmetlerini daha erişilebilir hale getirmek için bir platform oluşturmaya karar verdi. Böylece Bi Çilingir doğdu - insanların güvenilir, profesyonel ve uygun fiyatlı çilingirlere hızlıca ulaşabilecekleri bir platform.
            </p>
            <p className="text-gray-600 mb-4">
              Bugün, Bi Çilingir Türkiye'nin 81 ilinde hizmet veren 500'den fazla profesyonel çilingiri bir araya getiriyor. Platformumuz sayesinde, müşteriler ihtiyaç duydukları çilingir hizmetine sadece birkaç tıkla ulaşabiliyorlar.
            </p>
          </div>
        </div>
      </section>

      {/* Misyonumuz ve Vizyonumuz */}
      <section className="w-full py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Misyonumuz</h2>
              <p className="text-gray-600 mb-4">
                Çilingir hizmetlerini herkes için daha erişilebilir, güvenilir ve şeffaf hale getirmek. Acil durumlarda insanların yardıma hızlıca ulaşabilmelerini sağlamak.
              </p>
              <p className="text-gray-600">
                Müşterilerimize en iyi hizmeti sunmak için, platformumuzdaki tüm çilingirleri titizlikle seçiyor ve düzenli olarak denetliyoruz. Müşteri memnuniyeti bizim için en önemli önceliktir.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Vizyonumuz</h2>
              <p className="text-gray-600 mb-4">
                Türkiye'nin ve dünyanın en büyük ve en güvenilir çilingir platformu olmak. Teknoloji ve inovasyonu kullanarak çilingir hizmetlerini sürekli olarak geliştirmek ve iyileştirmek.
              </p>
              <p className="text-gray-600">
                Gelecekte, yapay zeka ve IoT teknolojilerini kullanarak daha akıllı ve daha hızlı çilingir hizmetleri sunmayı hedefliyoruz. Amacımız, müşterilerimizin güvenlik ihtiyaçlarını en iyi şekilde karşılamaktır.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* İstatistikler */}
      <section className="w-full py-16 px-4 bg-blue-600 text-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.id}>
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Değerlerimiz */}
      <section className="w-full py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Değerlerimiz</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.id} className="bg-gray-50 rounded-lg p-6 shadow-md text-center">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-blue-600">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ekibimiz */}
      <section className="w-full py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Ekibimiz</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="bg-white rounded-lg overflow-hidden shadow-md">
                <img src={member.image} alt={member.name} className="w-full h-64 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1 text-gray-800">{member.name}</h3>
                  <p className="text-blue-600 mb-4">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platformun Avantajları */}
      <section className="w-full py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Platformumuzun Avantajları</h2>
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="bg-blue-100 rounded-full p-4 text-blue-600 text-2xl">
                <span>1</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">Hızlı ve Kolay Erişim</h3>
                <p className="text-gray-600">
                  Bi Çilingir sayesinde, müşteriler ihtiyaç duydukları çilingir hizmetine sadece birkaç tıkla ulaşabilirler. Acil durumlarda zaman çok önemlidir ve platformumuz bu süreci olabildiğince hızlı ve kolay hale getirir.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="bg-blue-100 rounded-full p-4 text-blue-600 text-2xl">
                <span>2</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">Güvenilir Çilingirler</h3>
                <p className="text-gray-600">
                  Platformumuzdaki tüm çilingirler titizlikle seçilir ve düzenli olarak denetlenir. Müşterilerimiz, güvenilir ve profesyonel çilingirlerle çalıştıklarından emin olabilirler.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="bg-blue-100 rounded-full p-4 text-blue-600 text-2xl">
                <span>3</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">Şeffaf Fiyatlandırma</h3>
                <p className="text-gray-600">
                  Bi Çilingir'de tüm fiyatlar şeffaftır. Müşteriler, hizmet almadan önce yaklaşık maliyeti görebilir ve sürpriz fiyatlarla karşılaşmazlar.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="bg-blue-100 rounded-full p-4 text-blue-600 text-2xl">
                <span>4</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">Müşteri Yorumları ve Puanları</h3>
                <p className="text-gray-600">
                  Platformumuzda müşteriler, aldıkları hizmeti değerlendirebilir ve yorum yapabilirler. Bu sayede, diğer müşteriler en iyi çilingirleri kolayca bulabilirler.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="bg-blue-100 rounded-full p-4 text-blue-600 text-2xl">
                <span>5</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">7/24 Müşteri Desteği</h3>
                <p className="text-gray-600">
                  Bi Çilingir olarak, müşterilerimize 7/24 destek sunuyoruz. Herhangi bir sorun veya soru olduğunda, müşteri destek ekibimiz her zaman yardıma hazırdır.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bölümü */}
      <section className="w-full py-16 px-4 bg-blue-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Hemen Çilingir Bulun</h2>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Kapınız kilitli kaldı? Anahtarınızı kaybettiniz? Endişelenmeyin, Bi Çilingir yanınızda!
          </p>
          <Button className="bg-white text-blue-600 hover:bg-gray-100 font-bold text-lg px-8 py-4">
            <Link href="/">Çilingir Bul</Link>
          </Button>
        </div>
      </section>
    </main>
  );
} 