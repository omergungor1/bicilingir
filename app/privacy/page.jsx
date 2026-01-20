import React from "react";
import Link from "next/link";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "../../components/ui/breadcrumb";

// Static generation yapılandırma - Vercel CDN için optimize
export const dynamic = 'force-static';
export const revalidate = false;

// Build zamanında tarih oluştur
const BUILD_DATE = new Date().toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});

export default function PrivacyPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between py-12 px-4 sm:px-6 lg:px-8">
      <div className="container max-w-5xl mx-auto">
        <Breadcrumb className="mb-6">
          <BreadcrumbItem isFirst>
            <BreadcrumbLink href="/">Ana Sayfa</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>Gizlilik Politikası</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">Gizlilik Politikası</h1>

          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6">
              Son güncelleme: {BUILD_DATE}
            </p>

            <h2 className="text-xl font-semibold mb-4 text-gray-800">1. Giriş</h2>
            <p className="mb-4">
              Bi Çilingir olarak, gizliliğinize saygı duyuyor ve kişisel verilerinizin korunmasına önem veriyoruz. Bu Gizlilik Politikası, web sitemizi ve hizmetlerimizi kullanırken kişisel verilerinizin nasıl toplandığını, kullanıldığını, paylaşıldığını ve korunduğunu açıklamaktadır.
            </p>
            <p className="mb-4">
              Platformumuzu kullanarak, bu politikada belirtilen uygulamaları kabul etmiş olursunuz. Herhangi bir sorunuz veya endişeniz varsa, lütfen bizimle iletişime geçmekten çekinmeyin.
            </p>

            <h2 className="text-xl font-semibold mb-4 text-gray-800">2. Topladığımız Bilgiler</h2>
            <p className="mb-4">
              Platformumuz aracılığıyla aşağıdaki türde bilgileri toplayabiliriz:
            </p>
            <h3 className="text-lg font-medium mb-2 text-gray-700">2.1. Kullanıcılardan Topladığımız Bilgiler</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Konum bilgileri (il, ilçe, adres)</li>
              <li>Hizmet tercihleri ve arama geçmişi</li>
              <li>Çilingirler hakkında bıraktığınız değerlendirmeler ve yorumlar</li>
              <li>Hesap güvenliği için gerekli bilgiler</li>
            </ul>

            <h3 className="text-lg font-medium mb-2 text-gray-700">2.2. Çilingirlerden Topladığımız Bilgiler</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Kişisel bilgiler (ad, soyad, e-posta adresi, telefon numarası)</li>
              <li>İşletme bilgileri (işletme adı, vergi numarası, adres, lisanslar)</li>
              <li>Hizmet bölgeleri ve sunulan hizmetler</li>
              <li>Profesyonel deneyim ve sertifikalar</li>
              <li>Kimlik ve işletme belgelerinin kopyaları</li>
            </ul>

            <h3 className="text-lg font-medium mb-2 text-gray-700">2.3. Otomatik Olarak Toplanan Bilgiler</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>IP adresi ve cihaz kimliği</li>
              <li>Tarayıcı türü ve versiyonu</li>
              <li>İşletim sistemi bilgisi</li>
              <li>Platformdaki davranışlarınız ve etkileşimleriniz</li>
              <li>Çerezler ve benzer teknolojiler aracılığıyla toplanan bilgiler</li>
              <li>Lokasyon bilgileri</li>
            </ul>

            <h2 className="text-xl font-semibold mb-4 text-gray-800">3. Bilgilerin Kullanımı</h2>
            <p className="mb-4">
              Topladığımız bilgileri aşağıdaki amaçlar için kullanmaktayız:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Hizmetlerimizi sağlamak, yönetmek ve geliştirmek</li>
              <li>Kullanıcılarımızı çilingirlerle buluşturmak</li>
              <li>Hesabınızı oluşturmak ve yönetmek</li>
              <li>Güvenlik ve doğrulama süreçlerini yürütmek</li>
              <li>Müşteri hizmetleri sağlamak</li>
              <li>Platformumuz hakkında bilgi ve güncellemeler göndermek (tercihlerinize bağlı olarak)</li>
              <li>Yasal yükümlülüklerimizi yerine getirmek</li>
              <li>Platformumuzun performansını ve kullanıcı deneyimini analiz etmek</li>
              <li>Dolandırıcılık ve kötüye kullanımı önlemek</li>
            </ul>

            <h2 className="text-xl font-semibold mb-4 text-gray-800">4. Bilgilerin Paylaşımı</h2>
            <p className="mb-4">
              Kişisel bilgilerinizi şu durumlar dışında üçüncü taraflarla paylaşmayız:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Çilingirler ve Kullanıcılar:</strong> Platformun temel işlevi gereği, hizmet sağlamak için gerekli olan bilgiler çilingirler ve kullanıcılar arasında paylaşılabilir.</li>
              <li><strong>Hizmet Sağlayıcılar:</strong> Hizmetlerimizi sağlamamıza yardımcı olan güvenilir üçüncü taraf hizmet sağlayıcılarla (ödeme işlemcileri, bulut depolama sağlayıcıları, analiz hizmetleri vb.) bilgi paylaşabiliriz.</li>
              <li><strong>Google Hizmetleri:</strong> Platformumuz, reklam performansını artırmak ve kullanıcı deneyimini iyileştirmek amacıyla Google ile belirli kullanıcı verilerini paylaşabilir. Google, bu verileri yalnızca dönüşüm ölçümü ve analiz amacıyla işler. Tüm veri paylaşımı, Google'ın gizlilik standartları ve bizim Gizlilik Politikamız kapsamında güvenli bir şekilde gerçekleştirilir.</li>
              <li><strong>Yasal Zorunluluklar:</strong> Yasal bir yükümlülüğe uymak, platformumuzun haklarını ve güvenliğini korumak veya yasal bir süreç kapsamında bilgileri paylaşabiliriz.</li>
              <li><strong>İşletme Devri:</strong> Şirketimizin satışı, birleşmesi veya devri durumunda kişisel bilgiler de devredilebilir.</li>
              <li><strong>İzninizle:</strong> Açıkça izin verdiğiniz diğer durumlarda bilgilerinizi paylaşabiliriz.</li>
            </ul>
            <p className="mb-4">
              Kişisel bilgilerinizi pazarlama amaçlı olarak üçüncü taraflara satmaz veya kiralamayız.
            </p>

            <h2 className="text-xl font-semibold mb-4 text-gray-800">5. Veri Güvenliği</h2>
            <p className="mb-4">
              Kişisel verilerinizi korumak için uygun teknik ve organizasyonel güvenlik önlemleri uygulamaktayız. Bu önlemler arasında aşağıdakiler bulunmaktadır:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Veri şifreleme ve güvenli iletim protokolleri (SSL/TLS)</li>
              <li>Güvenli veri depolama sistemleri</li>
              <li>Veri erişimi için sıkı yetkilendirme kontrolleri</li>
              <li>Düzenli güvenlik değerlendirmeleri ve testleri</li>
              <li>Personel eğitimi ve farkındalık programları</li>
            </ul>
            <p className="mb-4">
              Ancak, internet üzerinden hiçbir veri iletiminin veya depolama sisteminin %100 güvenli olmadığını belirtmek isteriz. Bu nedenle, verilerinizin güvenliğini tamamen garanti edemiyoruz.
            </p>

            <h2 className="text-xl font-semibold mb-4 text-gray-800">6. Çerezler ve Takip Teknolojileri</h2>
            <p className="mb-4">
              Platformumuzda, kullanıcı deneyimini geliştirmek, analiz yapmak ve kişiselleştirilmiş içerik sunmak için çerezler ve benzer takip teknolojileri kullanmaktayız. Bu teknolojiler tarafından toplanan bilgiler, tarama davranışınız, tercihleriniz ve platformla etkileşimleriniz hakkında bilgi sağlar.
            </p>
            <p className="mb-4">
              Çerezleri tarayıcı ayarlarınızdan kontrol edebilir veya devre dışı bırakabilirsiniz. Ancak, bazı çerezleri devre dışı bırakırsanız, platformumuzun bazı özellikleri düzgün çalışmayabilir.
            </p>

            <h2 className="text-xl font-semibold mb-4 text-gray-800">7. Veri Saklama</h2>
            <p className="mb-4">
              Kişisel verilerinizi, hizmetlerimizi sağlamak, yasal yükümlülüklerimizi yerine getirmek ve meşru iş amaçlarımız için gerekli olduğu sürece saklarız. Verilerinizi saklama süreleri, veri türüne, amaca ve yasal gerekliliklere bağlı olarak değişebilir.
            </p>
            <p className="mb-4">
              Hesabınızı sildiğinizde, kişisel verilerinizi sistemlerimizden kaldırırız veya anonimleştiririz. Ancak, yasal yükümlülüklerimizi yerine getirmek, anlaşmazlıkları çözmek veya politikalarımızı uygulamak için gerekli olan bilgileri saklayabiliriz.
            </p>

            <h2 className="text-xl font-semibold mb-4 text-gray-800">8. Kullanıcıların Hakları</h2>
            <p className="mb-4">
              Kişisel verilerinizle ilgili aşağıdaki haklara sahipsiniz:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Hakkınızda hangi kişisel verileri topladığımızı öğrenme hakkı</li>
              <li>Yanlış veya eksik verilerin düzeltilmesini isteme hakkı</li>
              <li>Belirli koşullar altında kişisel verilerinizin silinmesini isteme hakkı</li>
              <li>Kişisel verilerinizin işlenmesini kısıtlama hakkı</li>
              <li>Belirli durumlarda kişisel verilerinizin işlenmesine itiraz etme hakkı</li>
            </ul>
            <p className="mb-4">
              Bu haklarınızı kullanmak isterseniz, lütfen <Link href="/iletisim" className="text-blue-600 hover:underline">iletişim sayfamız</Link> aracılığıyla bizimle iletişime geçin.
            </p>

            <h2 className="text-xl font-semibold mb-4 text-gray-800">9. Çocukların Gizliliği</h2>
            <p className="mb-4">
              Platformumuz 18 yaşın altındaki kişilere yönelik değildir ve bilerek 18 yaşın altındaki çocuklardan kişisel bilgi toplamayız. 18 yaşın altındaki bir çocuğa ait bilgileri yanlışlıkla topladığımızı fark edersek, bu bilgileri en kısa sürede sistemlerimizden silmek için adımlar atarız.
            </p>

            <h2 className="text-xl font-semibold mb-4 text-gray-800">10. Uluslararası Veri Transferleri</h2>
            <p className="mb-4">
              Platformumuz Türkiye'de faaliyet göstermektedir, ancak hizmet sağlayıcılarımız farklı ülkelerde bulunabilir. Bu nedenle, kişisel verileriniz farklı ülkelere aktarılabilir ve bu ülkelerde işlenebilir. Bu durumda, verilerinizin güvenliğini sağlamak için uygun önlemleri alacağız ve geçerli veri koruma yasalarına uygun hareket edeceğiz.
            </p>

            <h2 className="text-xl font-semibold mb-4 text-gray-800">11. Değişiklikler</h2>
            <p className="mb-4">
              Bu Gizlilik Politikası'nı zaman zaman güncelleyebiliriz. Önemli değişiklikler yaptığımızda, platformumuzda bir bildirim yayınlayacağız. Size en son değişiklikleri takip etme fırsatı vermek için, politikanın başında son güncelleme tarihini belirtiriz.
            </p>
            <p className="mb-4">
              Değişikliklerden sonra platformumuzu kullanmaya devam etmeniz, güncellenmiş Gizlilik Politikası'nı kabul ettiğiniz anlamına gelir.
            </p>

            <h2 className="text-xl font-semibold mb-4 text-gray-800">12. İletişim</h2>
            <p className="mb-4">
              Gizlilik Politikamız veya kişisel verilerinizin işlenmesi hakkında sorularınız, endişeleriniz veya talepleriniz varsa, lütfen bizimle <Link href="/iletisim" className="text-blue-600 hover:underline">iletişim sayfamız</Link> aracılığıyla iletişime geçin.
            </p>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-200">
            <Link href="/" className="text-blue-600 hover:underline">← Ana Sayfa'ya Dön</Link>
          </div>
        </div>
      </div>
    </main>
  );
} 