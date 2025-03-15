import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const styles = {
  header: {
    backgroundColor: '#52cc00', // primary-600
    color: '#ffffff'
  },
  heroSection: {
    background: 'linear-gradient(to bottom, #66ff00, #3d9900)', // primary-500 to primary-700
    color: '#ffffff'
  },
  accentButton: {
    backgroundColor: '#ffe600', // accent-500
    color: '#000000',
    border: '2px solid #ffeb33', // accent-400
  },
  // Diğer stil tanımlamaları...
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Header Bölümü */}
      <header style={styles.header} className="w-full text-inverted">
        <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between">
          {/* Logo */}
          <div className="flex items-center mb-4 md:mb-0">
            <svg className="w-10 h-10 mr-2 text-accent-300" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.65 10A5.99 5.99 0 0 0 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6a5.99 5.99 0 0 0 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
            </svg>
            <span className="text-xl font-bold text-accent-200">Çilingir Pazaryeri</span>
          </div>

          {/* Navbar - Orta */}
          <nav className="flex mb-4 md:mb-0">
            <ul className="flex space-x-6">
              <li><a href="#" className="text-accent-100 hover:text-accent-300 transition-colors">Ana Sayfa</a></li>
              <li><a href="#" className="text-accent-100 hover:text-accent-300 transition-colors">Hizmetler</a></li>
              <li><a href="#" className="text-accent-100 hover:text-accent-300 transition-colors">Çilingirler</a></li>
              <li><a href="#" className="text-accent-100 hover:text-accent-300 transition-colors">Hakkımızda</a></li>
            </ul>
          </nav>

          {/* Aksiyon Butonu - Sağ */}
          <div>
            <Button className="bg-accent-500 hover:bg-accent-600 text-text-dark font-bold border-2 border-accent-400 shadow-md">
              Çilingir Ol
            </Button>
          </div>
        </div>
      </header>

       {/* Hero Bölümü */}
       <section style={styles.heroSection} className="w-full text-inverted py-16 md:py-24 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6" style={{color: '#fff066'}}>
            Kapınız Kilitli Kaldı mı?
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto" style={{color: '#e0ffcc'}}>
            Türkiye'nin her yerinde profesyonel çilingir hizmetine anında ulaşın. 
            7/24 hizmet, uygun fiyatlar.
          </p>

          {/* Arama Kutusu */}
          <div className="max-w-3xl mx-auto bg-white rounded-lg p-4 shadow-xl border-2" style={{borderColor: '#fff066'}}>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-grow relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-5 h-5" style={{color: '#52cc00'}} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <Input 
                  type="text" 
                  placeholder="Adresinizi girin (Mahalle, İlçe, İl)" 
                  className="pl-10 bg-white border-gray-200 focus:border-accent-400"
                />
              </div>
              <Button style={styles.accentButton} className="px-8 shadow-md font-bold">
                Çilingir Bul
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Çilingir Listesi Bölümü */}
      <section style={styles.listingSection} className="w-full py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8" style={{color: '#3d9900'}}>
            Çilingir Firmaları
          </h2>
          <p className="text-center mb-12 max-w-2xl mx-auto text-gray-600">
            2,640 sonuç bulundu
          </p>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Filtre Sidebar */}
            <div style={styles.filterSidebar} className="w-full md:w-64 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-6" style={{color: '#3d9900'}}>Hizmet Tipi</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-2">
                  <Checkbox id="fullTime" />
                  <label htmlFor="fullTime" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Tam Zamanlı
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="partTime" />
                  <label htmlFor="partTime" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Yarı Zamanlı
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="remote" />
                  <label htmlFor="remote" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Acil Durum
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="internship" />
                  <label htmlFor="internship" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Randevulu
                  </label>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-6" style={{color: '#3d9900'}}>Hizmet Bölgesi</h3>
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-2">
                  <Checkbox id="istanbul" />
                  <label htmlFor="istanbul" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    İstanbul
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="ankara" />
                  <label htmlFor="ankara" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Ankara
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="izmir" />
                  <label htmlFor="izmir" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    İzmir
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="other" />
                  <label htmlFor="other" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Diğer İller
                  </label>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-6" style={{color: '#3d9900'}}>Fiyat Aralığı</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="price1" />
                  <label htmlFor="price1" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    100₺ - 200₺
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="price2" />
                  <label htmlFor="price2" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    200₺ - 300₺
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="price3" />
                  <label htmlFor="price3" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    300₺ - 400₺
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="price4" />
                  <label htmlFor="price4" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    400₺+
                  </label>
                </div>
              </div>

              <div className="mt-8">
                <Button className="w-full" style={{backgroundColor: '#52cc00', color: 'white'}}>
                  Filtreleri Uygula
                </Button>
              </div>
            </div>

            {/* Çilingir Listesi */}
            <div className="flex-1 space-y-6">
              {/* Arama Kutusu */}
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <Input 
                  type="text" 
                  placeholder="Firma Adı veya Hizmet Ara" 
                  className="pl-10 bg-white border-gray-200 focus:border-accent-400 w-full"
                />
              </div>

              {/* Çilingir Kartı 1 */}
              <div style={styles.listingCard} className="p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-md flex items-center justify-center" style={{backgroundColor: '#f0ffe6'}}>
                      <svg style={{color: '#52cc00'}} className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.65 10A5.99 5.99 0 0 0 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6a5.99 5.99 0 0 0 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold" style={{color: '#3d9900'}}>Anahtar Usta</h3>
                        <p className="text-sm text-gray-600 mb-2">İstanbul, Kadıköy</p>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2 md:mb-0">
                        <span className="text-xs px-2 py-1 rounded-full" style={{backgroundColor: '#f0ffe6', color: '#3d9900'}}>Tam Zamanlı</span>
                        <span className="text-xs px-2 py-1 rounded-full" style={{backgroundColor: '#fffde6', color: '#998a00'}}>150₺ - 250₺</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Profesyonel çilingir hizmetleri. Kapı açma, kilit değiştirme ve anahtar kopyalama işlemleri yapılır. 7/24 hizmet.
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">12 saat önce</span>
                      <Button className="text-sm" style={{backgroundColor: '#ffe600', color: '#000000'}}>
                        İncele →
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Çilingir Kartı 2 */}
              <div style={styles.listingCard} className="p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-md flex items-center justify-center" style={{backgroundColor: '#f0ffe6'}}>
                      <svg style={{color: '#52cc00'}} className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.65 10A5.99 5.99 0 0 0 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6a5.99 5.99 0 0 0 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold" style={{color: '#3d9900'}}>Kilit Profesyonelleri</h3>
                        <p className="text-sm text-gray-600 mb-2">Ankara, Çankaya</p>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2 md:mb-0">
                        <span className="text-xs px-2 py-1 rounded-full" style={{backgroundColor: '#f0ffe6', color: '#3d9900'}}>Tam Zamanlı</span>
                        <span className="text-xs px-2 py-1 rounded-full" style={{backgroundColor: '#fffde6', color: '#998a00'}}>200₺ - 300₺</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Yüksek güvenlikli kilit sistemleri uzmanı. Ev ve iş yeri güvenlik çözümleri. Acil durum hizmetleri mevcuttur.
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">6 saat önce</span>
                      <Button className="text-sm" style={{backgroundColor: '#ffe600', color: '#000000'}}>
                        İncele →
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Çilingir Kartı 3 */}
              <div style={styles.listingCard} className="p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-md flex items-center justify-center" style={{backgroundColor: '#f0ffe6'}}>
                      <svg style={{color: '#52cc00'}} className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.65 10A5.99 5.99 0 0 0 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6a5.99 5.99 0 0 0 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold" style={{color: '#3d9900'}}>Hızlı Çilingir</h3>
                        <p className="text-sm text-gray-600 mb-2">İzmir, Karşıyaka</p>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2 md:mb-0">
                        <span className="text-xs px-2 py-1 rounded-full" style={{backgroundColor: '#f0ffe6', color: '#3d9900'}}>Acil Durum</span>
                        <span className="text-xs px-2 py-1 rounded-full" style={{backgroundColor: '#fffde6', color: '#998a00'}}>180₺ - 280₺</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      15 dakika içinde kapınızda. Hasarsız kapı açma garantisi. Uygun fiyat, kaliteli hizmet.
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">2 saat önce</span>
                      <Button className="text-sm" style={{backgroundColor: '#ffe600', color: '#000000'}}>
                        İncele →
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Daha Fazla Göster Butonu */}
              <div className="text-center mt-8">
                <Button className="px-8" style={{backgroundColor: '#52cc00', color: 'white'}}>
                  Daha Fazla Göster
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Çağrı Bölümü */}
      <section className="w-full py-12 px-4" style={{backgroundColor: '#ffe600', color: '#000000'}}>
        <div className="container mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Acil Durumda mısınız?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            7/24 hizmet veren çilingir ağımız ile en yakın çilingire hemen ulaşın.
          </p>
          <Button className="px-8 py-6 text-lg font-bold shadow-lg border-2" style={{backgroundColor: '#52cc00', color: 'white', borderColor: '#3d9900'}}>
            Hemen Ara: 0850 123 45 67
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-primary-800 text-inverted py-8 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-accent-300">Çilingir Pazaryeri</h3>
              <p className="text-sm text-primary-200">
                Türkiye'nin en büyük çilingir ağı ile 7/24 hizmetinizdeyiz.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-accent-300">Hızlı Erişim</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-primary-200 hover:text-accent-300">Ana Sayfa</a></li>
                <li><a href="#" className="text-primary-200 hover:text-accent-300">Hizmetlerimiz</a></li>
                <li><a href="#" className="text-primary-200 hover:text-accent-300">Çilingirler</a></li>
                <li><a href="#" className="text-primary-200 hover:text-accent-300">Hakkımızda</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-accent-300">İletişim</h3>
              <ul className="space-y-2 text-sm">
                <li className="text-primary-200">Telefon: 0850 123 45 67</li>
                <li className="text-primary-200">E-posta: info@cilingirpazaryeri.com</li>
                <li className="text-primary-200">Adres: Kilit Sokak No:1, İstanbul</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-accent-300">Bizi Takip Edin</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-primary-200 hover:text-accent-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-primary-200 hover:text-accent-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="text-primary-200 hover:text-accent-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-primary-700 mt-8 pt-6 text-center text-sm text-primary-300">
            <p>© 2023 Çilingir Pazaryeri. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </main>
  );
} 