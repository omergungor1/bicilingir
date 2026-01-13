import Link from 'next/link';

export const metadata = {
    title: '2026 Güncel Çilingir Fiyat Listesi - Kapı Açma, Anahtar Yapımı, Oto Çilingir Fiyatları',
    description: 'Türkiye genelinde 2026 yılı güncel çilingir hizmet fiyatları. Ev, otomobil, kasa açma ve anahtar yapımı için güncel ve detaylı fiyat listesi.',
    keywords: 'çilingir fiyatları, kapı açma ücreti, anahtar yapımı fiyatları, oto çilingir fiyatları, kasa açma ücreti, çelik kapı açma fiyatı, 2026 çilingir fiyatları',
    alternates: {
        canonical: 'https://bicilingir.com/fiyat-listesi'
    }
};

export default function FiyatListesi() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Breadcrumb navigasyon */}
            <nav className="flex mb-6 text-sm text-gray-500">
                <ol className="flex items-center space-x-1">
                    <li>
                        <Link href="/" className="hover:text-blue-600 hover:underline">
                            Ana Sayfa
                        </Link>
                    </li>
                    <li>
                        <span className="mx-2">/</span>
                    </li>
                    <li className="font-medium text-gray-700">
                        Çilingir Fiyat Listesi
                    </li>
                </ol>
            </nav>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">2026 Güncel Çilingir Fiyat Listesi</h1>
            <p className="text-lg text-gray-600 mb-6">Türkiye genelinde ev, otomobil, kasa ve servis alanlarındaki çilingir hizmetleri için detaylı ve güncel fiyat bilgileri.</p>

            <div className="bg-blue-50 p-5 rounded-lg mb-8 border border-blue-100">
                <h2 className="text-blue-800 text-lg font-semibold mb-2">Çilingir Fiyatları Hakkında Önemli Bilgiler</h2>
                <p className="text-blue-800 text-sm mb-3">
                    Aşağıda listelenen fiyatlar yaklaşık değerler olup, şu faktörlere bağlı olarak değişiklik gösterebilir:
                </p>
                <ul className="text-blue-700 text-sm list-disc pl-5 space-y-1">
                    <li>Hizmetin türü ve zorluğu (Standart, yüksek güvenlikli vb.)</li>
                    <li>Hizmetin verildiği saat (Mesai saati içi, akşam, gece)</li>
                    <li>Hizmet mesafesi (Yakın mesafe azami 1 km olarak kabul edilir)</li>
                    <li>Kullanılan malzeme ve ekipmanın kalitesi</li>
                    <li>Çilingirin deneyimi ve uzmanlık alanı</li>
                </ul>
                <p className="text-blue-800 text-sm mt-3">
                    <strong>Kesin fiyat bilgisi için her zaman çilingir ile önceden görüşmeniz tavsiye edilir.</strong> Bu fiyat listesi güncel olmakla birlikte bölgesel fiyat farklılıkları olabilir.
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
                    Fiyatlar son güncelleme tarihi: 01/05/2026
                </p>
            </div>

            {/* SSS - Sıkça Sorulan Sorular */}
            <section className="my-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Çilingir Hizmetleri Hakkında Sıkça Sorulan Sorular</h2>

                <div className="space-y-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Çilingir fiyatları neye göre değişiklik gösterir?</h3>
                        <p className="text-gray-600">
                            Çilingir fiyatları genellikle hizmetin türüne, kapı veya kilidin modelini, hizmetin verildiği saate ve mesafeye göre değişiklik gösterir. Örneğin, standart bir kapı açımı ile yüksek güvenlikli bir çelik kapı açımı arasında fiyat farkı vardır. Ayrıca gece saatlerinde veya resmi tatillerde verilen hizmetler için ek ücret talep edilebilir.
                        </p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Acil durumda gece çilingir hizmeti alabilir miyim?</h3>
                        <p className="text-gray-600">
                            Evet, birçok çilingir 7/24 hizmet vermektedir. Gece saatlerinde verilen hizmetler için genellikle ek ücret talep edilir. BiÇilingir üzerinden konumunuza en yakın ve o anda hizmet verebilecek çilingirlere anında ulaşabilirsiniz.
                        </p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Oto anahtarı yaptırmak için araç ruhsatı gerekli midir?</h3>
                        <p className="text-gray-600">
                            Evet, güvenlik nedeniyle araç anahtarı yaptırmak için araç ruhsatı ve kimlik belgesi istenir. Bu, aracın sahibinin gerçekten siz olduğunu doğrulamak için gereklidir. Immobilizer/transponder içeren modern araç anahtarları için yetkili servis veya özel donanıma sahip çilingirler hizmet verebilir.
                        </p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Kapı kilidini değiştirmek ne kadar sürer?</h3>
                        <p className="text-gray-600">
                            Standart bir kapı kilidi değişimi genellikle 30-60 dakika arasında tamamlanır. Ancak çelik kapılarda veya özel güvenlik sistemlerinde bu süre uzayabilir. Kilit değişiminde kapı tipine uygun yeni bir kilit seçilmesi önemlidir.
                        </p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Kasa şifremi unuttum, çilingir kasayı açabilir mi?</h3>
                        <p className="text-gray-600">
                            Evet, profesyonel çilingirler çoğu kasayı açabilirler. Ancak kasa modeline göre işlem süresi ve fiyatı değişiklik gösterir. Kasa açma işlemleri için genellikle kasanın satın alındığı yerin faturası veya kasanın size ait olduğunu gösteren belgeler istenebilir.
                        </p>
                    </div>
                </div>
            </section>

            {/* Çilingir Hizmetleri Hakkında Bilgi */}
            <section className="my-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Çilingir Hizmetleri Hakkında</h2>

                <div className="prose max-w-none text-gray-600">
                    <p>Çilingir hizmetleri, günlük hayatın kritik bir parçasıdır. Kapı dışarıda kilitli kaldığınızda, anahtarınızı kaybettiğinizde veya kilit sistemlerinizin bakımı gerektiğinde profesyonel çilingir hizmetine ihtiyaç duyarsınız.</p>

                    <h3 className="text-xl font-semibold mt-6 mb-3">Çilingir Hizmet Türleri</h3>

                    <p>Çilingirler geniş bir hizmet yelpazesi sunarlar:</p>

                    <ul className="list-disc pl-6 my-4">
                        <li><strong>Kapı Açma:</strong> Ev, iş yeri veya araç kapılarını anahtarsız açma</li>
                        <li><strong>Anahtar Yapımı:</strong> Her türlü kapı, kilit veya araç için yedek anahtar üretimi</li>
                        <li><strong>Kilit Değişimi:</strong> Eski, hasarlı veya güvenliği zayıflamış kilitlerin yenilenmesi</li>
                        <li><strong>Kilit Tamir ve Bakımı:</strong> Mevcut kilitlerin onarımı ve düzenli bakımı</li>
                        <li><strong>Çelik Kapı Servisi:</strong> Çelik kapıların kilit, menteşe ve mekanizma bakım-onarımı</li>
                        <li><strong>Kasa Açma ve Şifre Değişimi:</strong> Şifresi unutulan kasaların açılması ve yeniden programlanması</li>
                        <li><strong>Oto Çilingir Hizmetleri:</strong> Araç kapılarının açılması, kontak ve immobilizer işlemleri</li>
                    </ul>

                    <h3 className="text-xl font-semibold mt-6 mb-3">Çilingir Seçerken Dikkat Edilmesi Gerekenler</h3>

                    <p>Güvenilir bir çilingir seçmek için şu noktalara dikkat etmelisiniz:</p>

                    <ul className="list-disc pl-6 my-4">
                        <li>Lisanslı ve sigortalı çilingirler tercih edilmelidir</li>
                        <li>Önceki müşteri yorumları ve değerlendirmeleri kontrol edilmelidir</li>
                        <li>7/24 hizmet veren çilingirler acil durumlar için tercih sebebidir</li>
                        <li>Hizmet öncesi net fiyat bilgisi alınmalıdır</li>
                        <li>Modern kilit teknolojileri konusunda bilgili olmalıdır</li>
                    </ul>

                    <p>BiÇilingir platformu, ihtiyacınıza uygun çilingirleri bulmanıza yardımcı olur. Konumunuzu belirterek size en yakın çilingirleri görüntüleyebilir, fiyatları karşılaştırabilir ve hemen iletişime geçebilirsiniz.</p>
                </div>
            </section>

            <div className="mt-8 text-center">
                <Link
                    href="/"
                    className="inline-flex items-center justify-center bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    En Yakın Çilingiri Bul
                </Link>
            </div>
        </div>
    );
} 