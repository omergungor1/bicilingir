import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// OpenAI istemcisini global olarak bir kez oluştur
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Önbellek için basit bir mekanizma
const cache = new Map();
const CACHE_TTL = 1000 * 60 * 60; // 1 saat

export async function POST(request) {
  try {
    const { field, businessName, currentText, location, services = [] } = await request.json();
    
    if (!field || !businessName) {
      return NextResponse.json({ 
        success: false, 
        error: 'Gerekli alanlar eksik: field ve businessName zorunludur' 
      }, { status: 400 });
    }
    
    // Önbellek anahtarı oluştur
    const cacheKey = JSON.stringify({ field, businessName, currentText, location, services });
    
    // Önbellekte varsa ve süresi dolmamışsa, önbellekten döndür
    if (cache.has(cacheKey)) {
      const { data, timestamp } = cache.get(cacheKey);
      if (Date.now() - timestamp < CACHE_TTL) {
        return NextResponse.json({
          success: true,
          text: data,
          cached: true
        });
      }
    }
    
    let prompt = '';
    let maxTokens = 0;
    
    if (field === 'tagline') {
      prompt = `Bir çilingir şirketi için etkileyici ve kısa bir slogan yaz. Şirket adı: "${businessName}". ${
        location ? `Konum: ${location}. ` : ''
      }${
        services.length > 0 ? `Sundukları hizmetler: ${services.join(', ')}. ` : ''
      }${
        currentText ? `Mevcut slogan: "${currentText}". Bunu geliştir. ` : ''
      }Slogan kısa, akılda kalıcı ve müşterilerin güvenini kazanacak şekilde olsun. En fazla 150 karakter olsun. Sadece sloganı yaz, tırnak işaretleri kullanma ve açıklama ekleme. Direkt olarak sloganı yaz.`;
      
      maxTokens = 60; // Tagline için kısa bir cevap yeterli
    } 
    else if (field === 'hakkinda') {
      prompt = `Bir çilingir şirketi için profesyonel, güven verici ve detaylı bir tanıtım metni yaz. Şirket adı: "${businessName}". ${
        location ? `Konum: ${location}. ` : ''
      }${
        services.length > 0 ? `Sundukları hizmetler: ${services.join(', ')}. ` : ''
      }${
        currentText ? `Mevcut metin: "${currentText}". Bunu geliştir ve daha profesyonel hale getir. ` : ''
      }Metin, müşterilere güven vermeli, işletmenin profesyonelliği ve tecrübesi vurgulanmalı. En fazla 1000 karakter olsun.`;
      
      maxTokens = 500; // Hakkında için daha uzun bir cevap gerekli
    } 
    else {
      return NextResponse.json({ 
        success: false, 
        error: 'Geçersiz alan: sadece "tagline" veya "hakkinda" alanları desteklenmektedir' 
      }, { status: 400 });
    }
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Sen profesyonel bir metin yazarısın. Çilingir işletmeleri için etkileyici metinler yazıyorsun." },
        { role: "user", content: prompt }
      ],
      max_tokens: maxTokens,
      temperature: 0.7,
    });
    
    let generatedText = response.choices[0].message.content.trim();
    
    if (field === 'tagline') {
      // Tırnak işaretlerini daha kapsamlı bir şekilde temizleyelim
      
      // Çeşitli tırnak işaretleri için temizleme:
      // " (düz), " (açılış), " (kapanış), ' (tek), ' (açılış), ' (kapanış) karakterlerini temizle
      const quoteMarks = ['"', '"', '"', "'", "'", "'"];
      
      // Başta ve sonda tırnak işareti varsa temizle
      quoteMarks.forEach(quote => {
        if (generatedText.startsWith(quote)) {
          generatedText = generatedText.substring(1);
        }
        if (generatedText.endsWith(quote)) {
          generatedText = generatedText.substring(0, generatedText.length - 1);
        }
      });
      
      // Eğer metin hala "slogan" veya 'slogan' formatındaysa içindeki metni al
      const quotedTextRegex = /^["'"](.+)["'"]$/;
      const match = generatedText.match(quotedTextRegex);
      if (match) {
        generatedText = match[1];
      }
      
      // Bazen AI "Slogan: " gibi bir ön ek ekleyebilir, bunları kaldır
      generatedText = generatedText.replace(/^(slogan:?\s*)/i, '');
    }
    
    // Sonucu önbelleğe ekle
    cache.set(cacheKey, {
      data: generatedText,
      timestamp: Date.now()
    });
    
    return NextResponse.json({
      success: true,
      text: generatedText
    });
    
  } catch (error) {
    console.error('AI metin üretme hatası:', error);
    
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Metin üretilirken bir hata oluştu'
    }, { status: 500 });
  }
} 