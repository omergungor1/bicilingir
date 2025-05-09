/**
 * Türkçe'de, kelimenin son harfinin sesli veya sessiz oluşuna göre 
 * "de/da" veya "te/ta" eklerinden uygun olanını belirler.
 * 
 * Eğer kelime sert sessiz harfle bitiyorsa (f, s, t, k, ç, ş, h, p) "te/ta" eki kullanılır,
 * diğer hallerde "de/da" eki kullanılır.
 * 
 * @param {string} kelime - Ek getirilecek kelime
 * @returns {string} Kelimenin son harfine uygun olan "de", "da", "te" veya "ta" eki
 */
export function getBulunmaEki(kelime) {
    if (!kelime || kelime.length === 0) return 'de';

    // Kelimenin son harfini al ve küçük harfe çevir
    const sonHarf = kelime.charAt(kelime.length - 1).toLowerCase();

    // Sert sessiz harfler: f, s, t, k, ç, ş, h, p
    const sertSessizler = ['f', 's', 't', 'k', 'ç', 'ş', 'h', 'p'];

    // Kelime sert sessiz ile bitiyorsa "te/ta", değilse "de/da" eki kullanılır
    // Büyük ünlü uyumu kontrol edilmeli: a, ı, o, u harfleri varsa "da/ta", e, i, ö, ü harfleri varsa "de/te"

    // Ünlü harfleri bulmak için kelimeyi tersten tarayalım
    let sonUnlu = null;
    for (let i = kelime.length - 1; i >= 0; i--) {
        const harf = kelime.charAt(i).toLowerCase();
        if ('aeıioöuü'.includes(harf)) {
            sonUnlu = harf;
            break;
        }
    }

    // Eğer hiç ünlü yoksa varsayılan olarak "de" kullanılır
    if (sonUnlu === null) {
        return 'de';
    }

    // Kalın ünlüler: a, ı, o, u
    const kalinUnluler = ['a', 'ı', 'o', 'u'];

    const kalinMi = kalinUnluler.includes(sonUnlu);
    const sertMi = sertSessizler.includes(sonHarf);

    if (sertMi) {
        return kalinMi ? 'ta' : 'te';
    } else {
        return kalinMi ? 'da' : 'de';
    }
}

/**
 * Verilen bir şehir veya yer ismi için doğru bulunma ekini belirler
 * ve bu eki ismin sonuna ekler.
 * 
 * @param {string} yerIsmi - Ek getirilecek yer ismi (örn: İstanbul, Bursa)
 * @returns {string} Yer ismi ve uygun bulunma eki (örn: İstanbul'da, Bursa'da)
 */
export function yerIsmiBulunmaEkiEkle(yerIsmi) {
    if (!yerIsmi || yerIsmi.length === 0) return '';

    const ek = getBulunmaEki(yerIsmi);

    // Kesme işareti ekle ve eki birleştir
    return `${yerIsmi}'${ek}`;
} 