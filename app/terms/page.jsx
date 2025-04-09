"use client";

import React from "react";
import Link from "next/link";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "../../components/ui/breadcrumb";

export default function TermsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between py-12 px-4 sm:px-6 lg:px-8">
      <div className="container max-w-5xl mx-auto">
        <Breadcrumb className="mb-6">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Ana Sayfa</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>Hizmet Şartları</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">Hizmet Şartları</h1>
          
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6">
              Son güncelleme: {new Date().toLocaleDateString('tr-TR', {year: 'numeric', month: 'long', day: 'numeric'})}
            </p>
            
            <h2 className="text-xl font-semibold mb-4 text-gray-800">1. Giriş</h2>
            <p className="mb-4">
              Bi Çilingir platformuna hoş geldiniz. Bu Hizmet Şartları, Bi Çilingir web sitesini, mobil uygulamasını ve platformla ilgili tüm hizmetleri (toplu olarak "Hizmet") kullanımınızı düzenlemektedir. Platformumuzu kullanarak, bu şartları kabul etmiş olursunuz.
            </p>

            <h2 className="text-xl font-semibold mb-4 text-gray-800">2. Hizmet Tanımı</h2>
            <p className="mb-4">
              Bi Çilingir, kullanıcıları çilingirlerle buluşturan bir aracı platform olarak hizmet vermektedir. Platformumuz, kullanıcıların bulundukları bölgedeki çilingirleri bulmalarına, iletişim kurmalarına ve hizmet almalarına yardımcı olur.
            </p>
            <p className="mb-4">
              Biz sadece bir aracı platform olarak hizmet vermekteyiz ve çilingirlerin sağladığı hizmetlerden doğrudan sorumlu değiliz. Platformumuz üzerinden iletişime geçilen çilingirlerin sağladığı hizmetlerin kalitesi, fiyatlandırması ve diğer detayları çilingirler tarafından belirlenir.
            </p>

            <h2 className="text-xl font-semibold mb-4 text-gray-800">3. Hesap Oluşturma ve Kullanım</h2>
            <p className="mb-4">
              Platformumuzda çilingir olarak kayıt olmak için, gerekli bilgileri doğru ve eksiksiz olarak sağlamanız gerekmektedir. Hesabınızın güvenliğinden ve hesabınız altında gerçekleşen tüm aktivitelerden siz sorumlusunuz.
            </p>
            <p className="mb-4">
              Platformumuzu kullanarak, aşağıdakileri kabul etmiş olursunuz:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>18 yaşından büyük olduğunuzu</li>
              <li>Geçerli ve yasal bir çilingir olduğunuzu veya çilingir hizmeti almak isteyen bir kullanıcı olduğunuzu</li>
              <li>Platformu yasalara uygun şekilde kullanacağınızı</li>
              <li>Başkalarının platformu kullanmasını engelleyecek davranışlarda bulunmayacağınızı</li>
              <li>Platformun güvenliğini tehlikeye atacak faaliyetlerde bulunmayacağınızı</li>
            </ul>

            <h2 className="text-xl font-semibold mb-4 text-gray-800">4. Çilingir Sorumlulukları</h2>
            <p className="mb-4">
              Platformumuzda kayıtlı çilingirler aşağıdaki sorumlulukları kabul etmiş sayılır:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Sunulan hizmetlerin profesyonel standartlara uygun olması</li>
              <li>Doğru ve güncel iletişim bilgilerinin sağlanması</li>
              <li>Müşterilere adil ve dürüst davranılması</li>
              <li>Hizmet fiyatlarının şeffaf bir şekilde belirlenmesi</li>
              <li>Gerekli izin ve lisanslara sahip olunması</li>
              <li>Tüketici haklarına saygı gösterilmesi</li>
            </ul>

            <h2 className="text-xl font-semibold mb-4 text-gray-800">5. Kullanıcı Sorumlulukları</h2>
            <p className="mb-4">
              Platformumuzun kullanıcıları aşağıdaki sorumlulukları kabul etmiş sayılır:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Çilingirlerle iletişimde dürüst ve saygılı olmak</li>
              <li>Hizmet alımı sırasında doğru bilgiler sağlamak</li>
              <li>Asılsız veya yanıltıcı değerlendirmeler yapmamak</li>
              <li>Çilingirlerle yapılan anlaşmalara uymak</li>
            </ul>

            <h2 className="text-xl font-semibold mb-4 text-gray-800">6. İçerik Politikası</h2>
            <p className="mb-4">
              Platformumuzda paylaşılan tüm içerikler (yorumlar, değerlendirmeler, profil bilgileri, vb.) aşağıdaki kurallara uygun olmalıdır:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Yasalara uygun olmalı</li>
              <li>Başkalarının haklarını ihlal etmemeli</li>
              <li>Yanıltıcı veya aldatıcı olmamalı</li>
              <li>Nefret söylemi, taciz veya ayrımcılık içermemeli</li>
              <li>Müstehcen veya uygunsuz içerik barındırmamalı</li>
            </ul>
            <p className="mb-4">
              Bu kurallara uymayan içerikler, herhangi bir bildirimde bulunulmaksızın kaldırılabilir ve ilgili hesaplar askıya alınabilir veya sonlandırılabilir.
            </p>

            <h2 className="text-xl font-semibold mb-4 text-gray-800">7. Fikri Mülkiyet</h2>
            <p className="mb-4">
              Bi Çilingir platformu ve içeriği, fikri mülkiyet hakları ile korunmaktadır. Platformdaki logolar, tasarımlar, metinler ve diğer içerikler bizim mülkiyetimizde veya lisans altında kullanılmaktadır. Bu içeriklerin, önceden yazılı izin alınmadan kopyalanması, dağıtılması veya kullanılması yasaktır.
            </p>

            <h2 className="text-xl font-semibold mb-4 text-gray-800">8. Sorumluluk Reddi</h2>
            <p className="mb-4">
              Platformumuz üzerinden iletişime geçilen çilingirlerin sağladığı hizmetlerden doğrudan sorumlu değiliz. Çilingirler ve kullanıcılar arasındaki anlaşmazlıklarda aracı rolü üstlenmeyiz. Platformumuz "olduğu gibi" ve "mevcut olduğu şekilde" sunulmaktadır ve hizmetlerimizle ilgili açık veya zımni hiçbir garanti vermemekteyiz.
            </p>
            <p className="mb-4">
              Platformumuz aracılığıyla alınan hizmetlerden kaynaklanan doğrudan veya dolaylı herhangi bir zarar veya kayıptan sorumlu değiliz. Kullanıcılar, çilingirlerle ilgili kararlarını verirken kendi değerlendirmelerini yapmalıdır.
            </p>

            <h2 className="text-xl font-semibold mb-4 text-gray-800">9. Değişiklikler</h2>
            <p className="mb-4">
              Bu Hizmet Şartları'nı herhangi bir zamanda değiştirme hakkını saklı tutarız. Değişiklikler, platformda yayınlandıktan sonra geçerli olacaktır. Değişikliklerden sonra platformu kullanmaya devam etmeniz, güncellenmiş şartları kabul ettiğiniz anlamına gelir.
            </p>

            <h2 className="text-xl font-semibold mb-4 text-gray-800">10. İletişim</h2>
            <p className="mb-4">
              Hizmet Şartları hakkında sorularınız veya endişeleriniz varsa, lütfen bizimle <Link href="/iletisim" className="text-blue-600 hover:underline">iletişime geçin</Link>.
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