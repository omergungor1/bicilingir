"use client"

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import Hero from "../../components/Hero";

const benefits = [
  {
    id: 1,
    title: "Daha Fazla Müşteri",
    icon: "👥",
    description: "Bi Çilingir platformu sayesinde binlerce potansiyel müşteriye ulaşın ve iş hacminizi artırın."
  },
  {
    id: 2,
    title: "Esnek Çalışma",
    icon: "🕒",
    description: "Kendi çalışma saatlerinizi belirleyin ve istediğiniz zaman, istediğiniz bölgede hizmet verin."
  },
  {
    id: 3,
    title: "Kolay Yönetim Paneli",
    icon: "👨‍💼",
    description: "Kolay yönetim paneli ile online profilinizi kolayca yönetin. Siz işinize odaklanın, biz kalan işleri halledelim."
  },
  {
    id: 4,
    title: "Profesyonel Profil",
    icon: "👨‍💼",
    description: "Profesyonel bir profil oluşturarak müşterilere güven verin ve daha fazla iş alın."
  },
  {
    id: 5,
    title: "Müşteri Yorumları",
    icon: "⭐",
    description: "Olumlu müşteri yorumları ile itibarınızı artırın ve daha fazla müşteri çekin."
  },
  {
    id: 6,
    title: "Teknik Destek",
    icon: "🛠️",
    description: "7/24 teknik destek ekibimiz ile her türlü sorunuzda yanınızdayız."
  }
];

const steps = [
  {
    id: 1,
    title: "Kayıt Olun",
    description: "Bi Çilingir platformuna ücretsiz kayıt olun ve profilinizi oluşturun."
  },
  {
    id: 2,
    title: "Belgelerinizi Yükleyin",
    description: "Çilingirlik belgenizi ve diğer gerekli evrakları sisteme yükleyin."
  },
  {
    id: 3,
    title: "Onay Bekleyin",
    description: "Ekibimiz belgelerinizi kontrol edecek ve en kısa sürede profilinizi onaylayacaktır."
  },
  {
    id: 4,
    title: "İşleri Kabul Edin",
    description: "Onaylanan profiliniz ile size gelen çağrıları kabul edin ve çalışmaya başlayın."
  }
];

const testimonials = [
  {
    id: 1,
    name: "Hüseyin Küçük",
    location: "Bursa, Yıldırım",
    quote: "Eskiden müşteri bulmak için ilanlara para harcıyordum. Şimdi Bi Çilingir'den gelen çağrılarla çalışıyorum, sabit bir gelirim oluştu.",
    rating: 4.9,
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 2,
    name: "Osman Dizdar",
    location: "Bursa, Gemlik",
    quote: "Bi Çilingir sayesinde artık daha geniş bir müşteri ağına sahibim. Özellikle gece gelen acil çağrılar sayesinde gelirim arttı.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/31.jpg"
  },
  {
    id: 3,
    name: "Ayhan Çetindağ",
    location: "Bursa, Gemlik",
    quote: "İnternette görünür olmak zor. Bi Çilingir sayesinde Google'da öne çıktım. Günde en az 2-3 iş alıyorum. Tavsiye ederim.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/34.jpg"
  }
];

const LoginSection = () => {
  return (
    <section className="w-full py-16 px-4 bg-blue-600 text-white">
      <div className="container mx-auto text-center flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-4">Çilingir misiniz?</h2>
        <p className="text-xl max-w-3xl mx-auto mb-8">
          Kayıt ol veya giriş yap
        </p>
        <div className="flex space-x-3">
          <Link href="/cilingir/auth/login" className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded transition-colors">
            Giriş Yap
          </Link>
          <Link href="/cilingir/auth/register" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors">
            Kayıt Ol
          </Link>
        </div>
      </div>
    </section>
  );
};

export default function CilingirlerPage() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    //Tamamlanacak
    setIsLoading(true);
    console.log('Email:', email);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Abonelik hatası');
      }

      setIsSubscribed(true);
      setEmail('');
      setIsLoading(false);
    } catch (error) {
      console.error('Abonelik hatası:', error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }

  };

  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Hero Bölümü */}
      <Hero
        title="Çilingir Ağımıza Katılın"
        description="Türkiye'nin ilk ve tek çilingir arama platformuna katılarak işinizi büyütün, daha fazla müşteriye ulaşın ve kazancınızı artırın."
      >
        {/* <div className="container mx-auto text-center flex flex-col items-center">
          <div className="flex space-x-3">
            <Link href="/cilingir/auth/login" className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded transition-colors">
              Giriş Yap
            </Link>
            <Link href="/cilingir/auth/register" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors">
              Kayıt Ol
            </Link>
          </div>
        </div> */}
      </Hero>

      {/* Avantajlar Bölümü */}
      <section className="w-full py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Bi Çilingir'in Avantajları</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.id} className="bg-gray-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-blue-600">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Nasıl Çalışır Bölümü */}
      <section className="w-full py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Nasıl Çalışır?</h2>
          <div className="flex flex-col md:flex-row justify-between items-start">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-row justify-between items-start md:mb-0 px-4">
                <div className="flex-1 text-center">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {step.id}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block transform translate-x-full">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Başarı Hikayeleri */}
      <section className="w-full py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Başarı Hikayeleri</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-gray-50 rounded-lg p-6 shadow-md">
                <div className="flex items-center mb-4">
                  <img src={testimonial.image} alt={testimonial.name} className="w-16 h-16 rounded-full mr-4" />
                  <div>
                    <h3 className="font-bold text-lg">{testimonial.name}</h3>
                    <p className="text-gray-600 text-sm">{testimonial.location}</p>
                    <div className="flex text-yellow-400 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>
                          {i < Math.floor(testimonial.rating) ? "★" : (i < testimonial.rating ? "★" : "☆")}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Bölümü */}
      <section className="w-full py-16 px-4 bg-blue-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Hemen Bi Çilingir Ağına Katılın</h2>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Türkiye'nin ilk ve tek çilingir ağının bir parçası olun, işinizi büyütün ve kazancınızı artırın.
          </p>
          <Link href="/cilingir/auth/register">
            <Button className="bg-white text-blue-600 hover:bg-gray-100 font-bold text-lg px-8 py-4 cursor-pointer">
              Şimdi Başvur
            </Button>
          </Link>
        </div>
      </section>

      {/* SSS Bölümü */}
      <section className="w-full py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Sıkça Sorulan Sorular</h2>
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold mb-2 text-gray-800">Bi Çilingir'e katılmak için ne gerekiyor?</h3>
              <p className="text-gray-600">
                Bi Çilingir'e katılmak için çilingirlik mesleğini icra ettiğinizi gösteren belge ve iletişim bilgileriniz gerekiyor. Ayrıca, hizmet verdiğiniz bölgeleri ve sunduğunuz hizmetleri belirtmeniz gerekiyor.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold mb-2 text-gray-800">Bi Çilingir üzerinden ne kadar kazanabilirim?</h3>
              <p className="text-gray-600">
                Kazancınız, hizmet verdiğiniz bölgeye, sunduğunuz hizmetlere ve çalışma saatlerinize göre değişiklik gösterir. Ancak, Bi Çilingir üzerinden gelen işler sayesinde mevcut kazancınızı önemli ölçüde artırabilirsiniz.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold mb-2 text-gray-800">Ödemeler nasıl yapılıyor?</h3>
              <p className="text-gray-600">
                Ödemeler, müşteriden doğrudan size yapılır. Müşteri, hizmet bedelini nakit veya kredi kartı ile sizin tercihinize göre ödeyebilir. Bi Çilingir, sadece müşteri ile çilingir arasında bağlantı kurar. Daha fazla öne çıkmak isteyen çilingirler için reklam ücreti alır.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold mb-2 text-gray-800">İş tekliflerini reddedebilir miyim?</h3>
              <p className="text-gray-600">
                Evet, size gelen iş tekliflerini kabul etmek veya reddetmek tamamen sizin tercihinize bağlıdır. Çalışma saatlerinizi ve hizmet vermek istediğiniz bölgeleri kendiniz belirleyebilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </section>

      <LoginSection />


      {/* Bülten Bölümü */}
      <section className="w-full bg-gradient-to-r from-[#4169E1] to-[#6495ED] text-white py-16">
        <form onSubmit={handleSubscribe} className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Bültenimize Abone Olun</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Kampanyalardan, indirimlerden ve yeni hizmetlerimizden haberdar olmak için çilingirler için özenle hazırladığımız bültenimize abone olun. Güncel haberleri kaçırmayın!
          </p>

          <div className="max-w-md mx-auto flex items-center gap-2">
            <Input
              type="email"
              placeholder="E-posta adresiniz"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white text-gray-800 rounded-l-lg w-full"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className={`font-bold py-2 px-6 rounded-r-lg transition-all duration-300 ${isSubscribed
                ? "bg-green-500 text-white cursor-default hover:bg-green-500"
                : isLoading
                  ? "bg-gray-300 text-gray-500 cursor-wait"
                  : "bg-white text-blue-600 hover:bg-blue-50 cursor-pointer"
                }`}
            >
              {isSubscribed ? (
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Abone Oldunuz
                </span>
              ) : isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  İşleniyor...
                </span>
              ) : (
                "Abone Ol"
              )}
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
} 