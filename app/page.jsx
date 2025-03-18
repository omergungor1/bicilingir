import React from "react";
import Link from "next/link";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import Hero from "../components/Hero";
import SearchForm from "../components/SearchForm";

const styles = {
  accentButton: {
    backgroundColor: '#6495ED',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 16px',
    fontWeight: 'bold',
  },
  jobCard: {
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    backgroundColor: '#ffffff',
  },
  companyLogo: {
    width: '50px',
    height: '50px',
    backgroundColor: '#4169E1',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontWeight: 'bold',
  },
  starRating: {
    display: 'flex',
    alignItems: 'center',
  },
  star: {
    color: '#FFD700',
    marginRight: '2px',
  }
};

// Örnek çilingir verileri
const locksmithData = [
  {
    id: 1,
    name: "Anahtar Usta",
    location: "İstanbul, Kadıköy",
    rating: 4.8,
    reviewCount: 124,
    services: ["Kapı Açma", "Kilit Değiştirme", "Çelik Kapı"],
    price: "150₺ - 300₺",
    timeAgo: "2 saat önce",
    description: "7/24 acil kapı açma ve kilit değiştirme hizmetleri. Profesyonel ekip ile hızlı ve güvenilir çözümler sunuyoruz."
  },
  {
    id: 2,
    name: "Hızlı Çilingir",
    location: "İstanbul, Beşiktaş",
    rating: 4.6,
    reviewCount: 98,
    services: ["Acil Çilingir", "Oto Çilingir", "Kasa Çilingir"],
    price: "200₺ - 350₺",
    timeAgo: "5 saat önce",
    description: "15 dakika içinde kapınızdayız. Oto, ev ve iş yeri için profesyonel çilingir hizmetleri."
  },
  {
    id: 3,
    name: "Güvenli Anahtar",
    location: "İstanbul, Şişli",
    rating: 4.9,
    reviewCount: 156,
    services: ["Çelik Kapı", "Kasa Çilingir", "Kilit Değiştirme"],
    price: "180₺ - 400₺",
    timeAgo: "1 gün önce",
    description: "Yüksek güvenlikli kilit sistemleri ve çelik kapı uzmanı. 20 yıllık tecrübe ile hizmetinizdeyiz."
  },
  {
    id: 4,
    name: "Usta Çilingir",
    location: "İstanbul, Ümraniye",
    rating: 4.7,
    reviewCount: 87,
    services: ["Kapı Açma", "Oto Çilingir", "Anahtar Kopyalama"],
    price: "120₺ - 250₺",
    timeAgo: "3 saat önce",
    description: "Uygun fiyat garantisi ile tüm çilingir hizmetleri. Anahtar kopyalama ve oto çilingir konusunda uzmanız."
  },
  {
    id: 5,
    name: "Profesyonel Çilingir",
    location: "İstanbul, Maltepe",
    rating: 4.5,
    reviewCount: 76,
    services: ["Acil Çilingir", "Kilit Değiştirme", "Çelik Kapı"],
    price: "170₺ - 320₺",
    timeAgo: "6 saat önce",
    description: "Profesyonel ekip ve ekipmanlarla kaliteli çilingir hizmetleri. 7/24 acil servis mevcuttur."
  },
  {
    id: 6,
    name: "Anahtar Dünyası",
    location: "İstanbul, Bakırköy",
    rating: 4.4,
    reviewCount: 65,
    services: ["Kasa Çilingir", "Anahtar Kopyalama", "Kilit Değiştirme"],
    price: "160₺ - 280₺",
    timeAgo: "1 gün önce",
    description: "Her türlü kasa açma ve kilit değiştirme işlemleri yapılır. Anahtar kopyalama konusunda uzmanız."
  },
  {
    id: 7,
    name: "Acil Çilingir",
    location: "İstanbul, Beylikdüzü",
    rating: 4.7,
    reviewCount: 112,
    services: ["Acil Çilingir", "Kapı Açma", "Oto Çilingir"],
    price: "140₺ - 260₺",
    timeAgo: "4 saat önce",
    description: "30 dakika içinde kapınızdayız. Acil durumlarda 7/24 hizmet veriyoruz."
  },
  {
    id: 8,
    name: "Kilit Uzmanı",
    location: "İstanbul, Pendik",
    rating: 4.6,
    reviewCount: 93,
    services: ["Çelik Kapı", "Kilit Değiştirme", "Kasa Çilingir"],
    price: "190₺ - 340₺",
    timeAgo: "2 gün önce",
    description: "Yüksek güvenlikli kilit sistemleri ve çelik kapı montajı. Güvenliğiniz bizim önceliğimizdir."
  }
];

// Yıldız puanı gösterme fonksiyonu
const StarRating = ({ rating }) => {
  return (
    <div style={styles.starRating}>
      {[...Array(5)].map((_, i) => (
        <span key={i} style={styles.star}>
          {i < Math.floor(rating) ? "★" : (i < rating ? "★" : "☆")}
        </span>
      ))}
      <span className="ml-1 text-gray-700">{rating}</span>
    </div>
  );
};

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Hero Bölümü */}
      <Hero 
        title="Profesyonel Çilingir Hizmeti" 
        description="Kapınız kilitli mi kaldı? Anahtarınızı mı kaybettiniz? Endişelenmeyin, Bi Çilingir yanınızda!"
      >
        <SearchForm />
      </Hero>

      {/* Çilingir Listesi Bölümü */}
      <section className="w-full bg-gray-50 py-16 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Çilingirler</h2>
            <span className="text-gray-500">845 çilingir bulundu</span>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sol Sidebar - Filtreler */}
            <div className="w-full md:w-1/4">
              <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <h3 className="text-lg font-bold mb-4 text-gray-800">Hizmet Türü</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Checkbox id="acilCilingir" />
                    <label htmlFor="acilCilingir" className="ml-2 text-gray-700">Acil Çilingir</label>
                  </div>
                  
                  <div className="flex items-center">
                    <Checkbox id="kapiAcma" />
                    <label htmlFor="kapiAcma" className="ml-2 text-gray-700">Kapı Açma</label>
                  </div>
                  
                  <div className="flex items-center">
                    <Checkbox id="otoCilingir" />
                    <label htmlFor="otoCilingir" className="ml-2 text-gray-700">Oto Çilingir</label>
                  </div>
                  
                  <div className="flex items-center">
                    <Checkbox id="kasaCilingir" />
                    <label htmlFor="kasaCilingir" className="ml-2 text-gray-700">Kasa Çilingir</label>
                  </div>

                  <div className="flex items-center">
                    <Checkbox id="celikKapi" />
                    <label htmlFor="celikKapi" className="ml-2 text-gray-700">Çelik Kapı</label>
                  </div>

                  <div className="flex items-center">
                    <Checkbox id="kilitDegistirme" />
                    <label htmlFor="kilitDegistirme" className="ml-2 text-gray-700">Kilit Değiştirme</label>
                  </div>

                  <div className="flex items-center">
                    <Checkbox id="anahtarKopyalama" />
                    <label htmlFor="anahtarKopyalama" className="ml-2 text-gray-700">Anahtar Kopyalama</label>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold mb-4 mt-6 text-gray-800">Konum</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Checkbox id="istanbul" />
                    <label htmlFor="istanbul" className="ml-2 text-gray-700">İstanbul</label>
                  </div>
                  
                  <div className="flex items-center">
                    <Checkbox id="ankara" />
                    <label htmlFor="ankara" className="ml-2 text-gray-700">Ankara</label>
                  </div>
                  
                  <div className="flex items-center">
                    <Checkbox id="izmir" />
                    <label htmlFor="izmir" className="ml-2 text-gray-700">İzmir</label>
                  </div>
                  
                  <div className="flex items-center">
                    <Checkbox id="bursa" />
                    <label htmlFor="bursa" className="ml-2 text-gray-700">Bursa</label>
                  </div>
                </div>

                <h3 className="text-lg font-bold mb-4 mt-6 text-gray-800">Fiyat Aralığı</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Checkbox id="price1" />
                    <label htmlFor="price1" className="ml-2 text-gray-700">100₺ - 200₺</label>
                  </div>
                  
                  <div className="flex items-center">
                    <Checkbox id="price2" />
                    <label htmlFor="price2" className="ml-2 text-gray-700">200₺ - 300₺</label>
                  </div>
                  
                  <div className="flex items-center">
                    <Checkbox id="price3" />
                    <label htmlFor="price3" className="ml-2 text-gray-700">300₺ - 400₺</label>
                  </div>
                  
                  <div className="flex items-center">
                    <Checkbox id="price4" />
                    <label htmlFor="price4" className="ml-2 text-gray-700">400₺+</label>
                  </div>
                </div>
                
                <Button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold">
                  Filtreleri Uygula
                </Button>
                
                <Button className="mt-2 w-full bg-white text-blue-600 border border-blue-600 hover:bg-blue-50">
                  Temizle
                </Button>
              </div>
            </div>
            
            {/* Çilingir Listesi */}
            <div className="w-full md:w-3/4">
              <div className="space-y-4">
                {locksmithData.map((locksmith) => (
                  <div key={locksmith.id} style={styles.jobCard} className="hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center">
                      <div className="mb-4 md:mb-0 md:mr-4">
                        <div style={styles.companyLogo}>
                          <span>{locksmith.name.substring(0, 2)}</span>
                        </div>
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-1">{locksmith.name}</h3>
                            <p className="text-gray-600 mb-2">{locksmith.location}</p>
                          </div>
                          <div className="flex items-center">
                            <StarRating rating={locksmith.rating} />
                            <span className="ml-2 text-gray-500">({locksmith.reviewCount} yorum)</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-2">
                          {locksmith.services.map((service, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{service}</span>
                          ))}
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">{locksmith.price}</span>
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">{locksmith.timeAgo}</span>
                        </div>
                        
                        <p className="text-gray-500 text-sm mb-3">
                          {locksmith.description}
                        </p>
                      </div>
                      
                      <div className="mt-4 md:mt-0 md:ml-4 flex flex-col gap-2">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                          Ara
                        </Button>
                        <Button className="bg-white text-blue-600 border border-blue-600 hover:bg-blue-50 w-full">
                          <Link href={`/jobs/${locksmith.id}`} className="flex items-center justify-center">
                            Detaylar
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
            </div>
          </div>
        </div>
      </section>

      {/* Çilingir Lazım Bölümü */}
      <section className="w-full bg-yellow-400 py-12 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Çilingir mi lazım?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-800">
            7/24 hizmet veren çilingir ağımız ile en yakın çilingire hemen ulaşın.
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 text-lg rounded-lg shadow-lg">
            Hemen Çilingir Çağır
          </Button>
        </div>
      </section>
    </main>
  );
} 