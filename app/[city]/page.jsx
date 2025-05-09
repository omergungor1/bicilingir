// http://localhost:3000/sehirler/bursa

import CityContent from '../../components/city/CityContent';
import { getMetaData, getLocksmithsList } from '../utils/seo';
import Script from 'next/script';
import { getSupabaseServer } from '../../lib/supabase';
import { notFound } from 'next/navigation';
import { yerIsmiBulunmaEkiEkle, getBulunmaEki } from '../utils/stringUtils';

// Sunucu tarafında tüm verileri yükleyen yardımcı fonksiyon
async function getCityData(citySlug) {
    try {
        // Supabase client
        const supabase = getSupabaseServer();

        // Şehir bilgilerini çek
        const { data: cityData, error: cityError } = await supabase
            .from('provinces')
            .select('id, name, lat, lng')
            .eq('slug', citySlug)
            .single();

        if (cityError || !cityData) {
            console.error('Şehir bilgisi alınamadı');
            throw new Error('Şehir bilgisi alınamadı');
        }

        // Her iki veri isteğini paralel olarak çalıştır
        const locksmiths = await getLocksmithsList({ citySlug, count: 2 });
        const metadata = await getMetaData({
            citySlug,
            districtSlug: null,
            neighborhoodSlug: null,
            servicetypeSlug: null,
            locksmiths
        });


        // İlçeleri çek
        const { data: districtsData, error: districtsError } = await supabase
            .from('districts')
            .select('id, name, slug')
            .eq('province_id', cityData.id);

        if (districtsError || !districtsData) {
            console.error('İlçe bilgisi alınamadı');
            throw new Error('İlçeler bulunamadı');
        }

        districtsData.forEach(district => {
            district.slug = citySlug + '/' + district.slug;
        });

        // Hizmetleri çek
        const { data: servicesData, error: servicesError } = await supabase
            .from('services')
            .select('id, name, slug, description, minPriceMesai, maxPriceMesai, minPriceAksam, maxPriceAksam, minPriceGece, maxPriceGece')
            .eq('isActive', true);

        if (servicesError || !servicesData) {
            console.error('Hizmet bilgisi alınamadı');
            throw new Error('Hizmet bulunamadı');
        }

        servicesData.forEach(service => {
            service.slug = citySlug + '/' + service.slug;
        });

        // SideMenu için parametreleri hazırla
        const sideMenuParams = {
            map: {
                locksmithPositions: locksmiths.map(locksmith => ({
                    position: { lat: locksmith.location.lat, lng: locksmith.location.lng },
                    title: locksmith.name,
                    description: locksmith.description,
                })),
                mapCenter: { lat: cityData.lat, lng: cityData.lng }
            },
            nearbySection: {
                title: 'Yakındaki İlçeler',
                description: '',
                data: districtsData.map(district => ({
                    id: district.id,
                    name: district.name,
                    slug: district.slug
                }))
            },
            locksmithPricing: {
                title: 'Çilingir Hizmetleri Fiyatları',
                description: 'Çilingir hizmetleri fiyatları, çilingirin hizmet türüne, kapı modeline ve saate göre değişiklik gösterebilir. Fiyatlar yaklaşık değerlerdir. Kesin fiyat için çilingir ile görüşmeniz gerekmektedir.',
                data: servicesData.map(service => ({
                    name: service.name,
                    description: service.description,
                    price1: { min: service.minPriceMesai, max: service.maxPriceMesai },
                    price2: { min: service.minPriceAksam, max: service.maxPriceAksam },
                    price3: { min: service.minPriceGece, max: service.maxPriceGece }
                }))
            },
            categorySection: {
                title: 'Çilingir Hizmetleri Kategorileri',
                description: '',
                data: servicesData.map(service => ({
                    id: service.id,
                    name: service.name,
                    slug: service.slug
                }))
            },
            formattedName: cityData.name,
            type: 'city'
        };

        // Şehir bilgilerini hazırla
        const cityInfoData = {
            id: 1,
            name: cityData.name,
            description: `${cityData.name}\'${getBulunmaEki(cityData.name)} çilingir hizmetine mi ihtiyacınız var? ${cityData.name}\'${getBulunmaEki(cityData.name)} tüm çilingir hizmetleri geniş hizmet yelpazesi ile uzman çilingirler tarafından sunulmaktadır. Aşağıda listelenen çilingirlerin hepsi ${cityData.name}\'${getBulunmaEki(cityData.name)} hizmet vermektedir.`,
            longDescription: `${cityData.name}\'${getBulunmaEki(cityData.name)} çilingir hizmetleri geniş bir ağla sunulmaktadır. Bir çok çilingir bölgede aktif olarak hizmet vermektedir.\n${cityData.name}\'${getBulunmaEki(cityData.name)} çilingir fiyatları, ilçe ve hizmete göre değişkenlikler göstermektedir. ${cityData.name}\'${getBulunmaEki(cityData.name)} ev çilingiri, otomobil çilingiri, acil çilingir, 724 çilingir hizmetleri bulmak oldukça kolaydır.\nBiÇilingir platformu sayesinde ${cityData.name}\'${getBulunmaEki(cityData.name)} tüm mahallelerinde hizmet veren en yakın çilingiri bulabilir, fiyatları görebilirsiniz. Arama formunu kullanarak konumunuza en yakın çilingiri bulabilir ve hemen iletişime geçebilirsiniz.`,
            districts: districtsData,
            neighborhoods: [],
            location: { lat: cityData.lat, lng: cityData.lng }
        };

        // SSS listesini hazırla
        const sssList = [
            { id: 1, question: `${yerIsmiBulunmaEkiEkle(cityData.name)} en yakın çilingir nerede?`, answer: `BiÇilingir platformu sayesinde ${cityData.name}\'${getBulunmaEki(cityData.name)} hizmet veren en yakın çilingiri bulabilir, fiyatları görebilirsiniz. Arama formunu kullanarak konumunuza en yakın çilingiri tespit edebilir ve hemen iletişime geçebilirsiniz.` },
            { id: 2, question: `${yerIsmiBulunmaEkiEkle(cityData.name)} çilingir ücretleri ne kadar?`, answer: `${cityData.name}\'${getBulunmaEki(cityData.name)} çilingir ücretleri genellikle 300₺ ile 1000₺ arasında değişmektedir. Kapı açma işlemleri ortalama 300₺-500₺, kilit değiştirme 500₺-1000₺, çelik kapı tamiri ise 500₺-1500₺ arasındadır. Fiyatlar mesafeye, zamana ve hizmet türüne göre farklılık gösterebilir.` },
            { id: 3, question: `${yerIsmiBulunmaEkiEkle(cityData.name)} gece çilingir hizmeti alabilir miyim?`, answer: `Evet, ${cityData.name}\'${getBulunmaEki(cityData.name)} 7/24 hizmet veren çilingir ekiplerimiz bulunmaktadır. Gece saatlerinde de kapınız kilitli kaldığında veya acil kilit değişimi gerektiğinde çilingir hizmetimize ulaşabilirsiniz.` },
            { id: 4, question: `${yerIsmiBulunmaEkiEkle(cityData.name)} oto çilingir hizmeti var mı?`, answer: `Evet, ${cityData.name}\'${getBulunmaEki(cityData.name)} bir çok uzman oto çilingir ekipleri hizmet vermektedir. Araç anahtarı kopyalama, kayıp anahtar yerine yenisini yapma, immobilizer programlama ve araç kapısı açma gibi tüm hizmetler sunulmaktadır. Detaylı bilgi için en yakın oto çilingiri BiÇilingir ile bulabilir ve hemen arayabilirsiniz.` },
            { id: 6, question: `${cityData.name}\'${getBulunmaEki(cityData.name)} 7/24 açık çilingir var mı?`, answer: `Evet, ${cityData.name}\'${getBulunmaEki(cityData.name)} 7/24 açık çilingir hizmeti veren işletmeler bulunmaktadır. BiÇilingir platformu üzerinden istediğiniz saat diliminde hizmet veren çilingirleri bulabilir ve acil durumlarınızda iletişime geçebilirsiniz.` },
            { id: 7, question: `${cityData.name} çilingir kaç dakikada gelir?`, answer: `${cityData.name}\'${getBulunmaEki(cityData.name)} çilingirler genellikle bulunduğunuz konuma göre 15-30 dakika içerisinde gelebilmektedir. Acil durumlarda ve yoğun olmayan saatlerde daha hızlı ulaşım sağlanabilmektedir. Trafik durumu ve mesafeye bağlı olarak bu süre değişiklik gösterebilir.` },
            { id: 8, question: `Gece saatlerinde ${cityData.name}\'${getBulunmaEki(cityData.name)} çilingir bulabilir miyim?`, answer: `Evet, ${cityData.name}\'${getBulunmaEki(cityData.name)} gece saatlerinde de hizmet veren çilingirler bulunmaktadır. BiÇilingir platformumuz üzerinden 24 saat boyunca hizmet veren çilingirlere ulaşabilirsiniz. Gece saatlerinde fiyatlarda artış olabileceğini unutmayınız.` },
            { id: 9, question: `${cityData.name}\'${getBulunmaEki(cityData.name)} en hızlı gelen çilingir hangisi?`, answer: `${cityData.name}\'${getBulunmaEki(cityData.name)} en hızlı çilingir hizmetini almak için konumunuza en yakın çilingiri tercih etmeniz önerilir. BiÇilingir platformumuz üzerinden size en yakın çilingirleri görebilir ve hızlı hizmet alabilirsiniz. Ayrıca platform üzerinden çilingirlerin değerlendirmelerini inceleyerek en hızlı hizmet veren çilingirleri seçebilirsiniz.` },
            { id: 10, question: `${cityData.name} çilingirleri yasal mı, kimlik soruyorlar mı?`, answer: `Evet, BiÇilingir platformunda bulunan tüm çilingirler yasal olarak hizmet vermektedir. Güvenlik gereği kapı açma hizmetlerinde kimlik kontrolü yapılmaktadır. Ev sahibi olduğunuzu kanıtlayan belge veya kimliğinizi göstermeniz gerekmektedir. Bu uygulama, hırsızlık ve güvenlik sorunlarını önlemek için standart bir prosedürdür.` },
            { id: 11, question: `Ev açtırmak için ${cityData.name}\'${getBulunmaEki(cityData.name)} hangi belgeler gerekir?`, answer: `${cityData.name}\'${getBulunmaEki(cityData.name)} ev açtırmak için kimliğiniz ve eve ait olduğunuzu kanıtlayan bir belge (tapu, kira sözleşmesi, fatura vb.) gereklidir. Çilingirler yasal sorumlulukları gereği bu belgeleri kontrol etmek zorundadır. Yanınızda kapı açma işlemi için gerekli belgeleri bulundurmanız önemlidir.` },
            { id: 13, question: `İlçeler arasında çilingir fiyat farkı var mı?`, answer: `Evet, ${cityData.name}\'${getBulunmaEki(cityData.name)} ilçeler arasında çilingir fiyatlarında küçük farklılıklar olabilir. Bu farklar genellikle şehir merkezine olan uzaklık, hizmet saati ve talep yoğunluğuna bağlıdır. Merkeze uzak ilçelerde yol ücreti talep edilebilmektedir. Güncel ve net fiyat bilgisi için çilingir ile önceden görüşmeniz önerilir.` },
            { id: 14, question: `${cityData.name}\'${getBulunmaEki(cityData.name)} anahtar kapıda kaldı, ne yapmalıyım?`, answer: `Anahtarınız kapıda kaldıysa, BiÇilingir platformu üzerinden size en yakın çilingiri bulabilir ve hemen iletişime geçebilirsiniz. Çilingir gelene kadar kapıya zarar vermemeye çalışın. Çilingirlerimiz özel aletlerle kapınıza zarar vermeden açma işlemi gerçekleştirebilmektedir.` },
            { id: 15, question: `${cityData.name}\'${getBulunmaEki(cityData.name)} anahtar kırıldı, ne yapmalıyım?`, answer: `Anahtarınız kırıldıysa hemen BiÇilingir üzerinden bir çilingir ile iletişime geçin. Çilingirlerimiz kilit değişimi ve tamir hizmetleri de sunmaktadır. Size uygun tamir veya kilit değişimi konusunda da yardımcı olacaklardır.` },
            { id: 16, question: `Ev kapısı açtırmak ne kadar sürer?`, answer: `${cityData.name}\'${getBulunmaEki(cityData.name)} ev kapısı açtırma işlemi genellikle kilit tipine bağlı olarak 5-15 dakika sürmektedir. Standart kilitler daha hızlı açılırken, yüksek güvenlikli veya çelik kapı kilitleri daha uzun sürebilir. Çilingirlerimiz profesyonel ekipmanlar kullanarak kapınızı en hızlı ve güvenli şekilde açmaya çalışırlar.` },
            { id: 17, question: `Çilingir kapıyı kırmadan açar mı?`, answer: `Evet, profesyonel çilingirler kapıyı kırmadan özel aletler kullanarak açabilirler. BiÇilingir platformundaki çilingirlerimiz, kapıya ve kilide zarar vermeden açma konusunda uzmanlaşmıştır. Ancak bazı yüksek güvenlikli veya hasarlı kilitlerin açılması daha zor olabilir. Çilingirlerimiz her durumda en az hasarla çözüm üretmeye çalışırlar.` },
            { id: 18, question: `Kapıyı açtırmak için ev sahibi olmak şart mı?`, answer: `Evet, güvenlik nedeniyle kapıyı açtırmak için o evin sahibi veya yasal kiracısı olduğunuzu kanıtlamanız gerekmektedir. Çilingirler, kapı açma işlemi öncesinde kimlik kontrolü yapar ve gerekli durumlarda eve ait belge talep ederler. Bu uygulama, hırsızlık ve yasal sorunları önlemek için standarttır.` },
            { id: 19, question: `Araba anahtarı içeride kaldı, çilingir açabilir mi?`, answer: `Evet, ${cityData.name}\'${getBulunmaEki(cityData.name)} oto çilingirlerimiz araç kapısını açabilmektedir. Modern araçlarda kapı açma işlemi özel ekipmanlar gerektirmektedir. BiÇilingir üzerinden araç modelinize uygun hizmet veren oto çilingirlerini bulabilirsiniz. İşlem sırasında araç sahibi olduğunuzu kanıtlamanız istenecektir.` },
            { id: 20, question: `Kontak kilidim bozuldu, çilingir tamir eder mi?`, answer: `Evet, ${cityData.name}\'${getBulunmaEki(cityData.name)} oto çilingirlerimiz kontak kilidi tamiri ve değişimi yapabilmektedir. Araç modeline göre değişen kontak kilidi tamir süreçleri için uzman oto çilingirlerimizle iletişime geçebilirsiniz. BiÇilingir platformu üzerinden aracınıza uygun hizmet veren çilingirleri bulabilirsiniz.` },
            { id: 21, question: `Araba çilingiri her marka aracı açabilir mi?`, answer: `Çoğu oto çilingiri birçok yaygın araç markasına hizmet verebilir, ancak bazı özel veya yüksek güvenlikli araçlar için marka veya model uzmanlığı gerekebilir. BiÇilingir platformunda aracınızın markasına uygun uzmanlaşmış oto çilingirlerini bulabilirsiniz. Arama yaparken araç markanızı belirtmeniz, size doğru çilingiri bulmanıza yardımcı olacaktır.` },
            { id: 22, question: `Şifreli kasa açılır mı?`, answer: `${cityData.name}\'${getBulunmaEki(cityData.name)} kasa çilingirlerimiz şifreli kasaların açılmasında da hizmet vermektedir. Unutulan şifreler veya arızalı kasa kilitleri için profesyonel yardım alabilirsiniz. Ancak kasa açma işlemi için kasa sahibi olduğunuzu kanıtlayan belgeleri sunmanız gerekmektedir. Kasa modeline bağlı olarak açma işlemi ve süre değişiklik gösterebilir.` },
            { id: 23, question: `Kasa çilingiri kimlik ister mi?`, answer: `Evet, kasa çilingirleri yasal sorumlulukları gereği kasa açma işlemi öncesinde kimlik ve kasa sahipliğini kanıtlayan belge talep ederler. Bu belgelendirme, yasal olmayan açma işlemlerini önlemek ve güvenliği sağlamak için zorunludur. BiÇilingir platformundaki tüm kasa çilingirleri bu prosedürü takip etmektedir.` },
            { id: 24, question: `Kasa çilingir hizmeti ne kadar sürer?`, answer: `${cityData.name}\'${getBulunmaEki(cityData.name)} kasa açma hizmeti, kasanın modeline, kilit tipine ve durumuna bağlı olarak 30 dakika ile birkaç saat arasında değişebilir. Basit şifre unutulma durumlarında işlem daha hızlı olurken, hasarlı veya yüksek güvenlikli kasalarda süreç uzayabilir. Çilingir, inceleme sonrası tahmini bir süre bilgisi verecektir.` },
            { id: 25, question: `${cityData.name} mahallelerinde çilingir telefon numarası nedir?`, answer: `${cityData.name}\'${getBulunmaEki(cityData.name)} tüm mahallelerinde hizmet veren çilingirlerin telefon numaralarına BiÇilingir platformu üzerinden ulaşabilirsiniz. Platformumuzda mahallenizi seçerek size en yakın çilingirleri görüntüleyebilir ve telefon numaralarına tek tıkla erişebilirsiniz.` },
            { id: 26, question: `${cityData.name} gece çilingir çağırmak güvenilir mi?`, answer: `Evet, BiÇilingir platformunda listelenen gece çilingir hizmetleri güvenilirdir. Tüm çilingirlerimiz kimlik kontrolü yapılarak platformumuza kabul edilmektedir. Gece hizmeti veren çilingirlerimiz de aynı profesyonel standartlarda çalışmaktadır. Müşteri değerlendirmeleri ve derecelendirmeleri inceleyerek en güvenilir çilingirleri seçebilirsiniz.` },
            { id: 28, question: `${cityData.name} acil kapı açma servisi kaç dakikada gelir?`, answer: `${cityData.name}\'${getBulunmaEki(cityData.name)} acil çilingir hizmetlerimiz genellikle 15-30 dakika içerisinde konumunuza ulaşabilmektedir. Bu süre, trafik durumu, mesafe ve hava koşullarına göre değişebilir. BiÇilingir platformunda konumunuza en yakın çilingirleri görüntüleyerek daha hızlı hizmet alabilirsiniz.` },
        ];

        // İlçe bazlı dinamik SSS soruları ekle
        let districtQuestionId = 29;
        districtsData.forEach(district => {
            // İlçe için ek sorular
            sssList.push(
                {
                    id: districtQuestionId++,
                    question: `${district.name}\'${getBulunmaEki(district.name)} 7/24 açık çilingir var mı?`,
                    answer: `Evet, ${district.name}\'${getBulunmaEki(district.name)} 7/24 hizmet veren çilingirlerimiz bulunmaktadır. Gece geç saatlerde bile anahtarınızı kaybettiğinizde veya kapınız kilitli kaldığında BiÇilingir platformu üzerinden ${district.name}\'${getBulunmaEki(district.name)} en yakın çilingire ulaşabilirsiniz. Acil durumlarda hızlı yardım alabilmeniz için 24 saat hizmet vermekteyiz.`
                },
                {
                    id: districtQuestionId++,
                    question: `${district.name} çilingir kaç dakikada gelir?`,
                    answer: `${district.name}\'${getBulunmaEki(district.name)} çilingirlerimiz genellikle bulunduğunuz konuma bağlı olarak 15-30 dakika içerisinde hizmet verebilmektedir. BiÇilingir platformu üzerinden ${district.name}\'${getBulunmaEki(district.name)} size en yakın çilingiri bularak daha hızlı hizmet alabilirsiniz. Acil durumlarda ve trafiğin yoğun olmadığı saatlerde bu süre daha da kısalabilir.`
                },
                {
                    id: districtQuestionId++,
                    question: `Gece saatlerinde ${district.name}\'${getBulunmaEki(district.name)} çilingir bulabilir miyim?`,
                    answer: `Evet, ${district.name}\'${getBulunmaEki(district.name)} gece saatlerinde de hizmet veren çilingirlerimiz mevcuttur. BiÇilingir platformumuz üzerinden 24 saat boyunca ${district.name}\'${getBulunmaEki(district.name)} hizmet veren çilingirlere kolayca ulaşabilirsiniz. Gece çilingir hizmetlerinde normal mesai saatlerine göre fiyat farkı olabileceğini unutmayınız.`
                }
            );
        });

        // Acil durum ve özel durumlar için ek sorular
        sssList.push(
            {
                id: districtQuestionId++,
                question: `Çocuğum evde kilitli kaldı, acil çilingir hizmeti nasıl alabilirim?`,
                answer: `Hemen BiÇilingir platformu ana sayfası üzerinden ${cityData.name}\'${getBulunmaEki(cityData.name)} acil çilingir hizmeti alabileceğin çilingirleri bulabilirsin. Acil durum olduğunu belirtirseniz, çilingirler öncelikli olarak size hizmet verecektir. Size en yakın çilingiri bulup, doğrudan arayarak durumu açıklayabilirsiniz. Bu tür acil durumlarda çilingirler genellikle 15 dakika içinde ulaşmaya çalışırlar.`
            },
            {
                id: districtQuestionId++,
                question: `${cityData.name}\'${getBulunmaEki(cityData.name)} çilingirler kredi kartı kabul ediyor mu?`,
                answer: `Evet, ${cityData.name}\'${getBulunmaEki(cityData.name)} bulunan çilingirlerin çoğu nakit ödemenin yanı sıra kredi kartı, banka kartı ve bazı durumlarda mobil ödeme seçenekleri de sunmaktadır. Ödeme seçenekleri hakkında bilgi almak için hizmet öncesinde çilingir ile görüşebilirsiniz. BiÇilingir platformumuzda ödeme seçeneklerini gösteren filtreleme özelliği de bulunmaktadır.`
            },
            {
                id: districtQuestionId++,
                question: `${cityData.name}\'${getBulunmaEki(cityData.name)} parmak izi kilit sistemi kurulumu yapılıyor mu?`,
                answer: `Evet, ${cityData.name}\'${getBulunmaEki(cityData.name)} çilingirlerimiz arasında parmak izi, kart okuyuculu ve şifreli elektronik kilit sistemleri kurulumu yapan uzmanlar bulunmaktadır. Modern güvenlik sistemleri için BiÇilingir platformumuzdan bu hizmeti veren çilingirleri filtreleyerek bulabilirsiniz. Akıllı kilit sistemleri kurulum fiyatları kilit markası ve modeline göre değişiklik göstermektedir.`
            },
            {
                id: districtQuestionId++,
                question: `Çelik kasam açılmıyor, ${cityData.name}\'${getBulunmaEki(cityData.name)} kasa açma hizmeti nerede bulabilirim?`,
                answer: `${cityData.name}\'${getBulunmaEki(cityData.name)} kasa açma konusunda uzmanlaşmış çilingirlerimiz mevcuttur. BiÇilingir platformumuzda 'kasa çilingiri' filtresini kullanarak size en yakın kasa çilingirini bulabilirsiniz. Profesyonel çilingirlerimiz, çelik kasa, elektronik kasa ve şifreli kasa gibi farklı kasa tipleri için açma hizmeti sunmaktadır. Hizmet sırasında kasa sahibi olduğunuzu kanıtlamanız gerektiğini unutmayınız.`
            },
            {
                id: districtQuestionId++,
                question: `${cityData.name}\'${getBulunmaEki(cityData.name)} master kilit yaptırabileceğim çilingir var mı?`,
                answer: `Evet, ${cityData.name}\'${getBulunmaEki(cityData.name)} master kilit (ana anahtar) sistemi kurabilen uzman çilingirlerimiz mevcuttur. Apartman, iş yeri veya otel gibi çok kapılı mekanlarda tek bir anahtarla tüm kapıları açabilen master kilit sistemleri için BiÇilingir platformu üzerinden uzman çilingirlerimize ulaşabilirsiniz. Sistem kurulumu için gerekli bilgileri çilingir ile görüşerek alabilirsiniz.`
            },
            {
                id: districtQuestionId++,
                question: `Çelik kapımın kilidi bozuldu, tamir için ${cityData.name}\'${getBulunmaEki(cityData.name)} özel servis var mı?`,
                answer: `Evet, ${cityData.name}\'${getBulunmaEki(cityData.name)} çelik kapı kilidi tamiri ve değişimi konusunda uzmanlaşmış çilingirlerimiz hizmet vermektedir. BiÇilingir platformu üzerinden çelik kapı uzmanı çilingirleri filtreleyerek bulabilirsiniz. Uzman çilingirlerimiz çelik kapı kilidi tamiri, değişimi, sigorta yükseltme, elektronik kilit entegrasyonu gibi hizmetler sunmaktadır.`
            },
            {
                id: districtQuestionId++,
                question: `${cityData.name}\'${getBulunmaEki(cityData.name)} multilock kilit için anahtar kopyalama yapan çilingir var mı?`,
                answer: `Evet, ${cityData.name}\'${getBulunmaEki(cityData.name)} Multilock, Kale, Yale gibi yüksek güvenlikli kilit sistemleri için anahtar kopyalama hizmeti veren uzman çilingirlerimiz bulunmaktadır. Bu özel anahtarlar için orijinal makine ve ekipmanlarla çalışan çilingirleri BiÇilingir platformumuzda bulabilirsiniz. Güvenlik sertifikalı anahtarlar için kilit kartınızı yanınızda bulundurmanız gerekebilir.`
            },
            {
                id: districtQuestionId++,
                question: `${cityData.name}\'${getBulunmaEki(cityData.name)} immobilizer anahtar kopyalama ve kodlama yapılır mı?`,
                answer: `Evet, ${cityData.name}\'${getBulunmaEki(cityData.name)} immobilizer (çipli) araç anahtarı kopyalama ve kodlama hizmeti veren oto çilingirlerimiz mevcuttur. BiÇilingir platformumuzda oto çilingiri kategorisinde, aracınızın markasına uygun hizmet veren çilingirleri bulabilirsiniz. Modern araçların çipli anahtarları için özel ekipmanlarla profesyonel hizmet sunulmaktadır.`
            },
            {
                id: districtQuestionId++,
                question: `Elektrikli sürgülü kapının kilidi çalışmıyor, ${cityData.name}\'${getBulunmaEki(cityData.name)} tamir eden var mı?`,
                answer: `Evet, ${cityData.name}\'${getBulunmaEki(cityData.name)} elektrikli sürgülü kapı, otomatik kapı ve bahçe kapısı sistemleri tamiri konusunda uzman çilingirlerimiz bulunmaktadır. BiÇilingir platformumuzda bu alanda hizmet veren uzmanları filtreleyerek bulabilirsiniz. Elektrikli kapı motorları, kumandalar, sensörler ve kilit sistemleri için tamir ve bakım hizmetleri sunulmaktadır.`
            },
            {
                id: districtQuestionId++,
                question: `${cityData.name}\'${getBulunmaEki(cityData.name)} çelik kapı montajı yapan çilingir var mı?`,
                answer: `Evet, ${cityData.name}\'${getBulunmaEki(cityData.name)} çelik kapı satışı, montajı ve değişimi konusunda uzmanlaşmış çilingirlerimiz hizmet vermektedir. BiÇilingir platformumuzda, çelik kapı kategorisinde filtreleme yaparak size en yakın ve uygun fiyatlı çelik kapı montajı yapan çilingirleri bulabilirsiniz. Ücretsiz keşif ve ölçü almak için bu uzmanlarla iletişime geçebilirsiniz.`
            }
        );

        // MainContent için parametreleri hazırla
        const mainContentParams = {
            navbarList: [
                { id: 1, name: 'Ana Sayfa', slug: '/' },
                { id: 2, name: cityData.name, slug: '#' },
            ],
            mainCard: { title: `${cityData.name} Çilingir Anahtarcı`, description: cityInfoData.description },
            locksmitList: { title: `${cityData.name} Çilingirler`, description: `${cityData.name}\'${getBulunmaEki(cityData.name)} hizmet veren çilingirler`, data: locksmiths },
            seconCard: { title: `${cityData.name} Hakkında`, longDescription: cityInfoData.longDescription },
            serviceList: { title: 'Çilingir Hizmetleri Kategorileri', description: '', data: servicesData, neighborhoods: districtsData },
            sssList: { title: `${cityData.name} Çilingir Sık Sorulan Sorular`, description: `${yerIsmiBulunmaEkiEkle(cityData.name)} bir çok kişi çilingirler hakkında bazı soruların cevabını merak ediyor. Sık sorulan soruların cevaplarını aşağıdaki listede bulabilirsiniz.`, data: sssList },
            detailedDistrictList: { title: `${cityData.name} Tüm İlçelerindeki Çilingirler`, description: `${yerIsmiBulunmaEkiEkle(cityData.name)} çilingir hizmetleri verilen ilçeler`, secondTitle: 'İlçeler', data: districtsData },
            sideMenuParams: sideMenuParams,
            formatedName: cityData.name,
            type: 'city'
        };

        return {
            locksmiths,
            metadata,
            cityData: cityInfoData,
            sideMenuParams,
            mainContentParams,
            sssList
        };
    } catch (error) {
        notFound();
    }
}

// Metadata fonksiyonu - bu sunucu tarafında çalışır
export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const { metadata } = await getCityData(resolvedParams.city);
    return metadata;
}

// Bu sayfa otomatik olarak sunucu tarafında render edilir
export default async function CityPage({ params }) {
    const resolvedParams = await params;
    const { city: citySlug } = resolvedParams;

    // Tüm verileri çek ve sayfayı render etmeden önce hazırla
    const { locksmiths, metadata, cityData, sideMenuParams, mainContentParams, sssList } = await getCityData(citySlug);

    // Structured data bilgisi
    const structuredData = metadata?.other?.structuredData;

    return (
        <>
            {structuredData && (
                <Script id="schema-data" type="application/ld+json" strategy="beforeInteractive">
                    {structuredData}
                </Script>
            )}
            <CityContent
                citySlug={citySlug}
                locksmiths={locksmiths}
                cityData={cityData}
                sideMenuParams={sideMenuParams}
                mainContentParams={mainContentParams}
                sssList={sssList}
            />
        </>
    );
} 