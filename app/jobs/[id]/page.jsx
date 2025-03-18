import React from "react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

const styles = {
  header: {
    background: 'linear-gradient(to right, #4169E1, #6495ED)',
    color: '#ffffff'
  },
  companyLogo: {
    width: '60px',
    height: '60px',
    backgroundColor: '#4169E1',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontWeight: 'bold',
  },
  smallCompanyLogo: {
    width: '40px',
    height: '40px',
    backgroundColor: '#4169E1',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: '12px'
  },
  jobCard: {
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    backgroundColor: '#ffffff',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  newsletterSection: {
    background: 'linear-gradient(to right, #4169E1, #6495ED)',
    color: '#ffffff',
    padding: '48px 0',
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
    services: [
      { name: "Kapı Açma"},
      { name: "Kilit Değiştirme"},
      { name: "Çelik Kapı"}
    ],
    price: "150₺ - 300₺",
    timeAgo: "2 saat önce",
    description: "7/24 acil kapı açma ve kilit değiştirme hizmetleri. Profesyonel ekip ile hızlı ve güvenilir çözümler sunuyoruz.",
    phone: "0532 123 45 67",
    workingHours: {
      Pazartesi: { open: "09:00", close: "18:00", isOpen: true },
      Salı: { open: "09:00", close: "18:00", isOpen: true },
      Çarşamba: { open: "09:00", close: "18:00", isOpen: true },
      Perşembe: { open: "09:00", close: "18:00", isOpen: true },
      Cuma: { open: "09:00", close: "18:00", isOpen: true },
      Cumartesi: { open: "10:00", close: "16:00", isOpen: true },
      Pazar: { open: "Kapalı", close: "Kapalı", isOpen: false }
    },
    images: [
      "/images/dukkan1.jpg",
      "/images/dukkan2.jpg",
      "/images/dukkan3.jpg",
      "/images/dukkan4.jpg"
    ],
    experience: "15 yıl",
    address: "Caferağa Mah. Moda Cad. No:123, Kadıköy/İstanbul",
    website: "www.anahtarusta.com",
    detailedDescription: "Anahtar Usta olarak 15 yıldır İstanbul'da hizmet vermekteyiz. Profesyonel ekibimiz ve modern ekipmanlarımızla kapı açma, kilit değiştirme, çelik kapı montajı ve tamiratı gibi tüm çilingir hizmetlerini sunuyoruz. Acil durumlarda 20 dakika içinde kapınızdayız. Tüm hizmetlerimizde kalite ve müşteri memnuniyeti önceliğimizdir. Uygun fiyat garantisi veriyoruz.",
    certificates: ["TSE Belgesi", "Mesleki Yeterlilik Belgesi", "Ustalık Belgesi"],
    paymentMethods: ["Nakit", "Kredi Kartı", "Havale/EFT"],
    reviews: [
      { user: "Ahmet Y.", rating: 5, comment: "Çok hızlı geldiler ve kapımı hasarsız açtılar. Teşekkürler!", date: "2 hafta önce" },
      { user: "Ayşe K.", rating: 4, comment: "Kilit değişimi için çağırdım, işlerini profesyonelce yaptılar.", date: "1 ay önce" },
      { user: "Mehmet S.", rating: 5, comment: "Gece yarısı aradım, 15 dakikada geldiler. Harika hizmet!", date: "3 ay önce" }
    ]
  },
  {
    id: 2,
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
    timeAgo: "5 saat önce",
    description: "15 dakika içinde kapınızdayız. Oto, ev ve iş yeri için profesyonel çilingir hizmetleri.",
    workingHours: {
      Pazartesi: { open: "00:00", close: "24:00", isOpen: true },
      Salı: { open: "00:00", close: "24:00", isOpen: true },
      Çarşamba: { open: "00:00", close: "24:00", isOpen: true },
      Perşembe: { open: "00:00", close: "24:00", isOpen: true },
      Cuma: { open: "00:00", close: "24:00", isOpen: true },
      Cumartesi: { open: "00:00", close: "24:00", isOpen: true },
      Pazar: { open: "00:00", close: "24:00", isOpen: true }
    },
    images: [
      "/images/dukkan1.jpg",
      "/images/dukkan2.jpg",
      "/images/dukkan3.jpg",
      "/images/dukkan4.jpg"
    ]
  },
  {
    id: 3,
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
    timeAgo: "1 gün önce",
    description: "Yüksek güvenlikli kilit sistemleri ve çelik kapı uzmanı. 20 yıllık tecrübe ile hizmetinizdeyiz.",
    workingHours: {
      Pazartesi: { open: "08:00", close: "20:00", isOpen: true },
      Salı: { open: "08:00", close: "20:00", isOpen: true },
      Çarşamba: { open: "08:00", close: "20:00", isOpen: true },
      Perşembe: { open: "08:00", close: "20:00", isOpen: true },
      Cuma: { open: "08:00", close: "20:00", isOpen: true },
      Cumartesi: { open: "09:00", close: "18:00", isOpen: true },
      Pazar: { open: "10:00", close: "16:00", isOpen: true }
    },
    images: [
      "/images/dukkan1.jpg",
      "/images/dukkan2.jpg",
      "/images/dukkan3.jpg",
      "/images/dukkan4.jpg"
    ]
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

export default async function LocksmithDetail({ params }) {
  // Next.js 14'te params'ı await ile beklemek gerekiyor
  const id = parseInt(params.id);
  
  // ID'ye göre çilingir verisini bul
  const locksmith = locksmithData.find(item => item.id === id) || locksmithData[0];
  
  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Geri Butonu */}
      <div className="container mx-auto px-4 py-4">
        <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          <span>Geri Dön</span>
        </Link>
      </div>

      {/* Ana İçerik Alanı */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Sol Bölüm - Çilingir Detayları */}
            <div className="w-full lg:w-2/3 p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-gray-200">
              <div className="mb-6">
                <div style={styles.companyLogo} className="mb-3">
                  <span>{locksmith.name.substring(0, 2)}</span>
                </div>
                <div className="text-gray-500 mb-1">{locksmith.location}</div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{locksmith.name}</h1>
                
                <div className="flex items-center mb-4">
                  <StarRating rating={locksmith.rating} />
                  <span className="ml-2 text-gray-500">({locksmith.reviewCount} yorum)</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {locksmith.services.map((service, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{service.name}</span>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Hakkında</h2>
                <p className="text-gray-600 mb-4">
                  {locksmith.detailedDescription || locksmith.description}
                </p>
              </div>

              <div className="border-t border-gray-200 pt-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Hizmetler</h2>
                <ul className="list-disc pl-5 text-gray-600 space-y-2">
                  {locksmith.services.map((service, index) => (
                    <li key={index}>{service.name}</li>
                  ))}
                </ul>
              </div>

              {locksmith.certificates && (
                <div className="border-t border-gray-200 pt-6 mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Sertifikalar ve Belgeler</h2>
                  <ul className="list-disc pl-5 text-gray-600 space-y-2">
                    {locksmith.certificates.map((certificate, index) => (
                      <li key={index}>{certificate}</li>
                    ))}
                  </ul>
                </div>
              )}

              {locksmith.reviews && (
                <div className="border-t border-gray-200 pt-6 mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Müşteri Yorumları</h2>
                  <div className="space-y-4">
                    {locksmith.reviews.map((review, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold">{review.user}</span>
                          <div className="flex items-center">
                            <StarRating rating={review.rating} />
                            <span className="ml-2 text-gray-500 text-sm">{review.date}</span>
                          </div>
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-gray-200 pt-6 mb-6">
                <div className="flex items-center mb-4">
                  <span className="font-semibold text-gray-700 mr-3">Paylaş:</span>
                  <div className="flex space-x-2">
                    <a href="#" className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                      </svg>
                    </a>
                    <a href="#" className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                      </svg>
                    </a>
                    <a href="#" className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
                      </svg>
                    </a>
                    <a href="#" className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Benzer Çilingirler */}
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Benzer Çilingirler</h2>
                <div className="space-y-4">
                  {locksmithData.filter(item => item.id !== id).slice(0, 3).map((item) => (
                    <div key={item.id} style={styles.jobCard} className="hover:transform hover:translate-y-[-2px] hover:shadow-lg">
                      <div className="flex flex-col md:flex-row md:items-center">
                        <div className="mb-4 md:mb-0 md:mr-4">
                          <div style={styles.smallCompanyLogo}>
                            <span>{item.name.substring(0, 2)}</span>
                          </div>
                        </div>
                        
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-bold text-gray-800 mb-1">{item.name}</h3>
                              <p className="text-gray-600 mb-2">{item.location}</p>
                            </div>
                            <div className="flex items-center">
                              <StarRating rating={item.rating} />
                              <span className="ml-2 text-gray-500">({item.reviewCount})</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {item.services.slice(0, 2).map((service, index) => (
                              <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{service.name}</span>
                            ))}
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">{item.price}</span>
                          </div>
                          <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                        
                        <div className="mt-4 md:mt-0 md:ml-4">
                          <Link href={`/jobs/${item.id}`} className="text-blue-600 hover:text-blue-800 flex items-center">
                            Detaylar
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sağ Bölüm - İletişim ve Özet */}
            <div className="w-full lg:w-1/3 p-6 lg:p-8">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 mb-6">
                Hemen Ara: {locksmith.phone || "0532 XXX XX XX"}
              </Button>

              {/* Çalışma Saatleri */}
              {locksmith.workingHours && (
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Çalışma Saatleri</h3>
                  <div className="space-y-2">
                    {Object.entries(locksmith.workingHours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between items-center">
                        <span className="text-gray-600">{day}</span>
                        <span className={`text-sm font-medium ${hours.isOpen ? 'text-green-600' : 'text-red-500'}`}>
                          {hours.isOpen ? `${hours.open} - ${hours.close}` : 'Kapalı'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resim Galerisi */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Galeri</h3>
                <div className="grid grid-cols-2 gap-2">
                  {locksmith.images.map((image, index) => (
                    <div key={index} className="aspect-square relative overflow-hidden rounded-lg">
                      <img
                        src={image}
                        alt={`${locksmith.name} - Resim ${index + 1}`}
                        className="object-cover w-full h-full hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Adres</h3>
                <p className="text-gray-700 mb-4">{locksmith.address || `${locksmith.location} bölgesinde hizmet vermektedir.`}</p>
                <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center text-gray-500">
                  Harita Görünümü
                </div>
              </div>

              <div className="bg-yellow-100 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Acil Durum mu?</h3>
                <p className="text-gray-700 mb-4">Kapınız kilitli kaldıysa veya acil çilingir hizmetine ihtiyacınız varsa hemen arayın!</p>
                <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold">
                  Acil Çilingir Çağır
                </Button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 