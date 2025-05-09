import Link from 'next/link';

export const metadata = {
    title: 'Detaylı Çilingir Fiyat Listesi - BiÇilingir',
    description: 'Çilingir hizmetleri için güncel ve detaylı fiyat listesi. Ev, servis, otomobil-motosiklet ve kasa hizmetleri için tüm fiyatlar.',
    keywords: 'çilingir fiyatları, anahtar yapımı fiyatları, kapı açma fiyatları, kasa açma fiyatları, çelik kapı açma ücreti',
    alternates: {
        canonical: 'https://bicilingir.com/fiyat-listesi'
    }
};

export default function FiyatListesi() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="flex items-center mb-6">
                <Link
                    href="/"
                    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Ana Sayfaya Dön
                </Link>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Detaylı Çilingir Fiyat Listesi</h1>

            <div className="bg-blue-50 p-4 rounded-lg mb-8">
                <p className="text-blue-800 text-sm">
                    <strong>Not:</strong> Fiyatlar yaklaşık değerler olup, hizmetin türüne,
                    mesafeye, saate ve özel durumlara göre değişiklik gösterebilir.
                    Kesin fiyat bilgisi için lütfen çilingir ile iletişime geçiniz.
                </p>
            </div>

            {/* Kategori seçimi */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
                <a href="#ev" className="bg-blue-600 text-white text-center py-3 px-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Ev Hizmetleri
                </a>
                <a href="#otomobil" className="bg-blue-600 text-white text-center py-3 px-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Otomobil-Motosiklet
                </a>
                <a href="#servis" className="bg-blue-600 text-white text-center py-3 px-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Servis
                </a>
                <a href="#kasa" className="bg-blue-600 text-white text-center py-3 px-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Kasa
                </a>
            </div>

            {/* Ev Hizmetleri */}
            <section id="ev" className="mb-12">
                <div className="flex items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Ev Hizmetleri</h2>
                    <div className="flex-1 h-0.5 bg-gray-200 ml-4"></div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-3 px-4 text-left font-medium text-gray-700 border-b">Hizmet</th>
                                <th className="py-3 px-4 text-right font-medium text-gray-700 border-b">Fiyat</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-800">Düz anahtar (yerli)</td>
                                <td className="py-3 px-4 text-right font-medium">50₺</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-800">Düz anahtar (Renkli)</td>
                                <td className="py-3 px-4 text-right font-medium">70₺</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-800">Bilyalı anahtar (yerli)</td>
                                <td className="py-3 px-4 text-right font-medium">80₺</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-800">Bilyalı anahtar (Avrupa-renkli)</td>
                                <td className="py-3 px-4 text-right font-medium">100₺</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-800">Çivi anahtar (Yerli)</td>
                                <td className="py-3 px-4 text-right font-medium">100₺</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-800">Elektronik kartlı ve Chipli Anahtar (Göstergeç-Mifare)</td>
                                <td className="py-3 px-4 text-right font-medium">150₺</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-800">Elektronik Kartlı ve Chipli Anahtar (Göstergeç-125 MHZ)</td>
                                <td className="py-3 px-4 text-right font-medium">150₺</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-800">Fişeli Anahtar (Yerli)</td>
                                <td className="py-3 px-4 text-right font-medium">450₺</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-800">Patentli Düz Anahtar (Özel Profil)</td>
                                <td className="py-3 px-4 text-right font-medium">450₺-1500₺</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-800">Patenli Bilyalı Anahtar</td>
                                <td className="py-3 px-4 text-right font-medium">900₺-1000₺</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-800">Oda Kapısı Anahtarı</td>
                                <td className="py-3 px-4 text-right font-medium">80₺</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-800">Gardrop Anahtarı</td>
                                <td className="py-3 px-4 text-right font-medium">80₺</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-800">Düz Tip Bareli Tek Anahtar Yapımı (Yerli)</td>
                                <td className="py-3 px-4 text-right font-medium">200₺</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-800">Bilyalı Bareli Tek Anahtar yapımı (Yerli)</td>
                                <td className="py-3 px-4 text-right font-medium">200₺</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-800">Emniyet Kilidi montajı</td>
                                <td className="py-3 px-4 text-right font-medium">1000₺</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-800">Otomatik Tirajlı Kilit-Basaç Montajı</td>
                                <td className="py-3 px-4 text-right font-medium">1000₺</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-800">Kapı Açma (Yakın Mesafe)</td>
                                <td className="py-3 px-4 text-right font-medium">600₺</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-800">Çelik Kapı Açma Rozetli-Tıranlı (Yakın Mesafe)</td>
                                <td className="py-3 px-4 text-right font-medium">600₺</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-800">Çelik Kapı Açma (Yüksek Güvenlik-yakın Mesafe)</td>
                                <td className="py-3 px-4 text-right font-medium">1000₺</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-800">Hidrolik Kapı Yayı Montajı (Yakın Mesafe)</td>
                                <td className="py-3 px-4 text-right font-medium">1000₺</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-800">Fişeli Kapı Açma (Yakın Mesafe)</td>
                                <td className="py-3 px-4 text-right font-medium">1400₺-5000₺</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-800">İcra-Tahliye (Yakın Mesafe)</td>
                                <td className="py-3 px-4 text-right font-medium">2000₺</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-800">Bariyer ve Kepeng Kumandası-Fix Code (Rolling Code Hariç)</td>
                                <td className="py-3 px-4 text-right font-medium">600₺</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Otomobil-Motosiklet */}
            <section id="otomobil" className="mb-12">
                <div className="flex items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Otomobil-Motosiklet</h2>
                    <div className="flex-1 h-0.5 bg-gray-200 ml-4"></div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-3 px-4 text-left font-medium text-gray-700 border-b">Hizmet</th>
                                <th className="py-3 px-4 text-right font-medium text-gray-700 border-b">Fiyat</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-800">Oto-Motosiklet Anahtarı (Klasik)</td>
                                <td className="py-3 px-4 text-right font-medium">200₺</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-800">Oto Kumandalı Anahtar (Üniversal Üretim)</td>
                                <td className="py-3 px-4 text-right font-medium">1.500₺-4.500₺</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-800">Oto Anahtar İçin Boş Kumanda Kabı (Klasik)</td>
                                <td className="py-3 px-4 text-right font-medium">650₺</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-800">Oto Anahtar için Boş Kumanda Kabı (Çakılı)</td>
                                <td className="py-3 px-4 text-right font-medium">600₺</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-800">Uzaktan Kumandaya Anahtar Ucu Takmak</td>
                                <td className="py-3 px-4 text-right font-medium">450₺</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-800">Ham Oto Anahtarına Diş Açma</td>
                                <td className="py-3 px-4 text-right font-medium">300₺</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-800">Pantograflı - Ford Çivi Anahtar</td>
                                <td className="py-3 px-4 text-right font-medium">500₺</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-800">Otomobil Anahtarı (Chip Soketli Boş Anahtar)</td>
                                <td className="py-3 px-4 text-right font-medium">550₺</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-800">Elektronik Anahtar (Immobilizer/Transponder-RW-T5)</td>
                                <td className="py-3 px-4 text-right font-medium">1.000₺</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-800">Elektronik Anahtar (Immobilizer/Transponder-Texas-Crypto)</td>
                                <td className="py-3 px-4 text-right font-medium">2.000₺</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-800">Motosiklet-Oto Kapı veya Kontağına Tek Anahtar Yapımı (Dükkanda-Standart)</td>
                                <td className="py-3 px-4 text-right font-medium">1.000₺</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-800">Otomobil Kapısı Açma (Klasik)</td>
                                <td className="py-3 px-4 text-right font-medium">1.000₺</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-800">Otomobil Kapısı Açma (Yüksek Güvenlik)</td>
                                <td className="py-3 px-4 text-right font-medium">1.000₺</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-800">Pantograflı Otomobil Kapı ve Kontağına Anahtar Yapımı (Dükkanda)</td>
                                <td className="py-3 px-4 text-right font-medium">3.000₺-5.000₺</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Servis */}
            <section id="servis" className="mb-12">
                <div className="flex items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Servis</h2>
                    <div className="flex-1 h-0.5 bg-gray-200 ml-4"></div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-3 px-4 text-left font-medium text-gray-700 border-b">Hizmet</th>
                                <th className="py-3 px-4 text-right font-medium text-gray-700 border-b">Fiyat</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-800">Hidrolik Ayarı, Barel Değişimi, Rozet Montajı vs.</td>
                                <td className="py-3 px-4 text-right font-medium">600₺</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Kasa */}
            <section id="kasa" className="mb-12">
                <div className="flex items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Kasa</h2>
                    <div className="flex-1 h-0.5 bg-gray-200 ml-4"></div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-3 px-4 text-left font-medium text-gray-700 border-b">Hizmet</th>
                                <th className="py-3 px-4 text-right font-medium text-gray-700 border-b">Fiyat</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-800">Kasa Anahtarı Tek Taraflı (Yerli)</td>
                                <td className="py-3 px-4 text-right font-medium">750₺</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-800">Kasa Anahtarı Çift Taraflı (Yerli)</td>
                                <td className="py-3 px-4 text-right font-medium">1.000₺</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-800">Kasa Anahtarı (Kademeli)</td>
                                <td className="py-3 px-4 text-right font-medium">1.500₺</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-800">Kasa Anahtarı (Masis Tip) - Kiralık Kasa Anahtarı</td>
                                <td className="py-3 px-4 text-right font-medium">1.000₺</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-800">Yerli Kasa Açma (Yakın Mesafe - Tek Kilit)</td>
                                <td className="py-3 px-4 text-right font-medium">1.500₺</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-800">Yerli Kasa Açma (Birden Fazla Kilit)</td>
                                <td className="py-3 px-4 text-right font-medium">2.500₺</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-800">Kasa Kilidine Tek Anahtar Yapımı (Şifre Değişimi - Dükkanda)</td>
                                <td className="py-3 px-4 text-right font-medium">2.000₺</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-800">Masis ve Şifreli Kasa Açma (Tek Kilit)</td>
                                <td className="py-3 px-4 text-right font-medium">3.000₺-10.000₺</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-800">Kiralık Kasa Açma</td>
                                <td className="py-3 px-4 text-right font-medium">3.000₺</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-8">
                <p className="text-yellow-800 text-sm">
                    <strong>Önemli Bilgiler:</strong>
                </p>
                <ul className="list-disc pl-5 mt-2 text-sm text-yellow-800">
                    <li>Bu liste mesai saatleri içinde geçerlidir.</li>
                    <li>Yakın mesafe azami 1 km&apos;dir.</li>
                    <li>Özel ve döküm anahtarların fiyatları değişkendir.</li>
                    <li>Özel yapım ve Avrupa kasa açma fiyatı değişkendir.</li>
                    <li>Özel kilit ve montaj fiyatı değişkendir.</li>
                    <li>Kesin fiyat bilgisi için çilingir ile görüşmeniz gerekmektedir.</li>
                    <li>Mal ve hizmet ücretlerine KDV dahildir.</li>
                </ul>
            </div>

            <div className="text-center mt-10">
                <p className="text-gray-500 text-sm">
                    Fiyatlar son güncelleme tarihi: 01/05/2025
                </p>
            </div>

            <div className="mt-8 text-center">
                <Link
                    href="/"
                    className="inline-flex items-center justify-center bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Ana Sayfaya Dön
                </Link>
            </div>
        </div>
    );
} 