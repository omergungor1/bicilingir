import { mockLocksmiths } from '../../../data/mock-gemlik-cilingirler';
import LocksmithCard from '../../../components/ui/locksmith-card';

export default function GemlikCilingirPage() {
    return (
        <div className="min-h-screen bg-gray-50 overflow-x-hidden touch-pan-y">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 px-4 md:py-12 w-screen">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        Gemlik Çilingir Servisi 🔑
                    </h1>
                    <p className="text-lg md:text-xl mb-6 text-blue-100">
                        7/24 Acil Çilingir Hizmeti - En Yakın Çilingir Burada!
                    </p>
                    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 md:p-6 space-y-3">
                        <div className="flex items-center gap-3 text-sm md:text-base">
                            <span className="flex items-center">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></span>
                                Şu anda açık çilingirler
                            </span>
                            <span className="flex items-center">
                                <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                                Hızlı Servis
                            </span>
                            <span className="flex items-center">
                                <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                                Güvenilir Hizmet
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Quick Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <div className="text-green-600 text-lg font-semibold mb-2">🕒 7/24 Hizmet</div>
                        <p className="text-gray-600">Gece gündüz, tatil demeden hizmetinizdeyiz.</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <div className="text-blue-600 text-lg font-semibold mb-2">⚡ 15 Dakika</div>
                        <p className="text-gray-600">Ortalama ulaşım süremiz 15-20 dakikadır.</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <div className="text-purple-600 text-lg font-semibold mb-2">🔒 Güvenli</div>
                        <p className="text-gray-600">Tüm çilingirlerimiz lisanslı ve güvenilirdir.</p>
                    </div>
                </div>

                {/* Locksmith List */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-semibold mb-6">Gemlik Bölgesindeki Çilingirler</h2>
                    {mockLocksmiths.map((locksmith, index) => (
                        <LocksmithCard key={locksmith.id} locksmith={locksmith} index={index} />
                    ))}
                </div>

                {/* Info Section */}
                <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-2xl font-semibold mb-4">Gemlik Çilingir Hizmeti</h2>
                    <div className="prose prose-blue max-w-none">
                        <p className="text-gray-600">
                            Gemlik'te 7/24 hizmet veren çilingir servisimiz, kapınızda kaldığınız, anahtarınızı kaybettiğiniz veya
                            herhangi bir kilitle ilgili sorununuz olduğunda yanınızda. Profesyonel ekibimiz en kısa sürede
                            yardımınıza koşuyor.
                        </p>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Hizmetlerimiz</h3>
                                <ul className="list-disc list-inside text-gray-600">
                                    <li>Kapı Açma</li>
                                    <li>Çelik Kapı Açma</li>
                                    <li>Kilit Değiştirme</li>
                                    <li>Anahtar Kopyalama</li>
                                    <li>Kasa Açma</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Neden Biz?</h3>
                                <ul className="list-disc list-inside text-gray-600">
                                    <li>7/24 Acil Servis</li>
                                    <li>15 Dakika İçinde Ulaşım</li>
                                    <li>Profesyonel Ekip</li>
                                    <li>Garantili Hizmet</li>
                                    <li>Uygun Fiyat</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Statik sayfa oluşturma
export async function generateStaticParams() {
    return [{ city: 'bursa', district: 'gemlik' }];
}

// Sayfa verilerini statik olarak oluştur
export async function generateMetadata() {
    return {
        title: 'Gemlik Çilingir - 7/24 Acil Çilingir Hizmeti',
        description: 'Gemlik bölgesinde 7/24 acil çilingir hizmeti. En yakın çilingir 15 dakika içinde yanınızda. Kapı açma, kilit değiştirme ve diğer çilingir hizmetleri.',
        keywords: 'gemlik çilingir, bursa çilingir, acil çilingir, 7/24 çilingir, kapı açma, kilit değiştirme'
    };
}