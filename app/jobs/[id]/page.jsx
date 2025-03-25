import React from "react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { getLocksmithById, getSimilarLocksmiths } from "../../actions";
import { testServices } from "../../../lib/test-data";
import { EmergencyCallButton } from "../../../components/emergency-button";
import { ImageGallery } from "../../../components/image-gallery";

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

// Server Component 
export default async function LocksmithDetail({ params }) {
  // Next.js'te params await edilmelidir
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  // ID'ye göre çilingir verisini getir
  const { locksmith, error } = await getLocksmithById(id);
  const { similarLocksmiths, error: similarError } = await getSimilarLocksmiths(id);
  
  // Hata durumunda yedek veri kullan
  if (error) {
    console.error('Çilingir verileri getirilirken hata oluştu:', error);
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Bir hata oluştu</h1>
        <p className="mb-4">Çilingir bilgileri getirilirken bir sorun oluştu.</p>
        <Link href="/" className="text-blue-600 hover:text-blue-800">
          Ana Sayfaya Dön
        </Link>
      </div>
    );
  }
  
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
                  {locksmith.serviceIds.map((serviceId, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded hover:bg-blue-200 cursor-pointer">{testServices.find(service => service.id === serviceId)?.name}</span>
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
                  {locksmith.serviceIds.map((serviceId, index) => (
                    <li key={index}>{testServices.find(service => service.id === serviceId)?.name}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Sertifikalar ve Belgeler</h2>
                <ul className="list-disc pl-5 text-gray-600 space-y-2">
                  {locksmith.certificates && locksmith.certificates.map((certificate, index) => (
                    <li key={index}>{typeof certificate === 'object' ? certificate.name : certificate}</li>
                  ))}
                </ul>
              </div>

              {locksmith.reviews && locksmith.reviews.length > 0 && (
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
                    {/* facebook, instagram, whatsapp */}
                    <a href="#" className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                      </svg>
                    </a>
                    <a href="#" className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
                    </a>                   
                    <a href="#" className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Benzer Çilingirler - Gelecekte Implementasyonu Yapılabilir */}
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Benzer Çilingirler</h2>
                <div className="space-y-4">
                  {similarLocksmiths.map((item) => (
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
                            {item.serviceIds.slice(0, 2).map((serviceId, index) => (
                              <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{testServices.find(service => service.id === serviceId)?.name}</span>
                            ))}
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">{testServices.find(service => service.id === item.serviceIds[0])?.price.max}₺ - {testServices.find(service => service.id === item.serviceIds[0])?.price.min}₺</span>
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
                        {hours.is24Hours ? <span className="text-green-600">24 Saat Açık</span> : <span className={`text-sm font-medium ${hours.isOpen ? 'text-green-600' : 'text-red-500'}`}>
                          {hours.isOpen ? `${hours.open} - ${hours.close}` : 'Kapalı'}
                        </span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resim Galerisi */}
              {locksmith.images && locksmith.images.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Galeri</h3>
                  <ImageGallery images={locksmith.images} locksmithName={locksmith.name} />
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Adres</h3>
                <p className="text-gray-700 mb-4">{`${locksmith.fullAddress} ${locksmith.district}/${locksmith.city}` || `${locksmith.city} ${locksmith.district} bölgesinde hizmet vermektedir.`}</p>
                <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center text-gray-500">
                  Harita Görünümü
                </div>
              </div>

              <div className="bg-yellow-100 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Acil Durum mu?</h3>
                <p className="text-gray-700 mb-4">Kapınız kilitli kaldıysa veya acil çilingir hizmetine ihtiyacınız varsa hemen arayın!</p>
                <EmergencyCallButton />
              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 