"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { SelectableCard } from "../../../../components/ui/selectable-card";
import turkiyeIlIlce from "../../../../data/turkiye-il-ilce";
import { formatPhoneNumber } from "../../../../lib/utils";
import { useToast } from "../../../../components/ToastContext";
import { AiAssistButton } from "../../../../components/ui/ai-assist-button";
import { CertificateModal } from "../../../../components/ui/certificate-modal";
import { Checkbox } from "../../../../components/ui/checkbox";
import { XCircle } from "lucide-react";
// Tiptap için gerekli importlar
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';

// Renk seçimi için bir bileşen oluşturalım
const ColorPicker = ({ title, colors, onColorSelect, buttonClass }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={buttonClass}
        title={title}
      >
        {title}
      </button>
      
      {isOpen && (
        <div className="absolute z-10 top-full left-0 mt-1 bg-white rounded shadow-lg p-2 border border-gray-200 flex flex-wrap gap-1 w-[200px]">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              title={color}
              onClick={() => {
                onColorSelect(color);
                setIsOpen(false);
              }}
              className="w-6 h-6 rounded-sm border border-gray-300"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Emoji seçimi için bir bileşen
const EmojiPicker = ({ onEmojiSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const emojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', 
    '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', 
    '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', 
    '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', 
    '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', 
    '😭', '😤', '😠', '😡', '🤬', '😈', '👿', '💀', '☠️', 
    '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖', '🎃', 
    '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾',
    '👍', '👎', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✌️',
    '🌟', '⭐', '🔥', '💯', '❤️', '🧡', '💛', '💚', '💙', '💜'
  ];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-2 py-1 rounded text-sm bg-gray-100 text-gray-700"
        title="Emoji Ekle"
      >
        Emoji 😊
      </button>
      
      {isOpen && (
        <div className="absolute z-10 top-full left-0 mt-1 bg-white rounded shadow-lg p-2 border border-gray-200 flex flex-wrap gap-1 w-[240px] max-h-[200px] overflow-y-auto">
          {emojis.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => {
                onEmojiSelect(emoji);
                setIsOpen(false);
              }}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded"
              title={emoji}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Basit bir toolbar bileşeni oluşturalım
const TiptapToolbar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const [moreToolsOpen, setMoreToolsOpen] = useState(false);

  const textColors = [
    '#000000', '#434343', '#666666', '#999999', '#cccccc', 
    '#ff0000', '#ff4d00', '#ffff00', '#00ff00', '#00ffff', 
    '#0000ff', '#9900ff', '#ff00ff', '#663300', '#336600'
  ];

  const bgColors = [
    '#ffffff', '#f5f5f5', '#ffe0e0', '#fff0e0', '#fffde0',
    '#e0ffe0', '#e0ffff', '#e0e0ff', '#ffe0ff', '#ffd6d6',
    '#ffebd6', '#fffbd6', '#d6ffd6', '#d6ffff', '#d6d6ff'
  ];

  // Resim yükleme işlevi
  const addImage = () => {
    const url = window.prompt('Resim URL\'i girin:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="border-b border-gray-200 flex flex-wrap gap-1 bg-gray-50">
      {/* Ana Araç Çubuğu */}
      <div className="p-1 flex flex-wrap gap-1 w-full">
        {/* Temel Biçimlendirme Araçları */}
        <div className="flex gap-1 mr-2 flex-wrap">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`px-2 py-1 rounded text-sm ${editor.isActive('bold') ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'}`}
            title="Kalın"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`px-2 py-1 rounded text-sm ${editor.isActive('italic') ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'}`}
            title="İtalik"
          >
            I
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`px-2 py-1 rounded text-sm ${editor.isActive('underline') ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'}`}
            title="Altı Çizili"
          >
            U
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`px-2 py-1 rounded text-sm ${editor.isActive('strike') ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'}`}
            title="Üstü Çizili"
          >
            S
          </button>
        </div>

        {/* Hizalama Araçları */}
        <div className="flex gap-1 mr-2 flex-wrap">
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`px-2 py-1 rounded text-sm ${editor.isActive({ textAlign: 'left' }) ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'}`}
            title="Sola Hizala"
          >
            ⟮
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`px-2 py-1 rounded text-sm ${editor.isActive({ textAlign: 'center' }) ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'}`}
            title="Ortala"
          >
            ≡
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`px-2 py-1 rounded text-sm ${editor.isActive({ textAlign: 'right' }) ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'}`}
            title="Sağa Hizala"
          >
            ⟯
          </button>
        </div>

        {/* Liste Araçları */}
        <div className="flex gap-1 mr-2 flex-wrap">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`px-2 py-1 rounded text-sm ${editor.isActive('bulletList') ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'}`}
            title="Madde İşaretli Liste"
          >
            • Liste
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`px-2 py-1 rounded text-sm ${editor.isActive('orderedList') ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'}`}
            title="Numaralı Liste"
          >
            1. Liste
          </button>
        </div>

        {/* Ek Araçlar Butonu (Mobil uyumlu) */}
        <div className="ml-auto">
          <button
            type="button"
            onClick={() => setMoreToolsOpen(!moreToolsOpen)}
            className="px-2 py-1 rounded text-sm bg-blue-50 text-blue-600 flex items-center"
          >
            {moreToolsOpen ? 'Araçları Gizle' : 'Daha Fazla Araç'} 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={moreToolsOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Genişletilmiş Araçlar */}
      {moreToolsOpen && (
        <div className="w-full p-1 border-t border-gray-200 flex flex-wrap gap-2">
          {/* Başlıklar */}
          <div className="flex gap-1 mr-2 mb-1">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`px-2 py-1 rounded text-sm ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'}`}
              title="Büyük Başlık"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`px-2 py-1 rounded text-sm ${editor.isActive('heading', { level: 3 }) ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'}`}
              title="Orta Başlık"
            >
              H3
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().setParagraph().run()}
              className={`px-2 py-1 rounded text-sm ${editor.isActive('paragraph') ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'}`}
              title="Paragraf"
            >
              P
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`px-2 py-1 rounded text-sm ${editor.isActive('blockquote') ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'}`}
              title="Alıntı"
            >
              Alıntı
            </button>
          </div>

          {/* Renk ve Görsel Araçları */}
          <div className="flex gap-1 mr-2 mb-1 flex-wrap">
            <ColorPicker
              title="Metin Rengi"
              colors={textColors}
              onColorSelect={(color) => {
                editor.chain().focus().setColor(color).run();
              }}
              buttonClass={`px-2 py-1 rounded text-sm bg-gray-100 text-gray-700`}
            />
            
            <ColorPicker
              title="Arka Plan"
              colors={bgColors}
              onColorSelect={(color) => {
                editor.chain().focus().setHighlight({ color }).run();
              }}
              buttonClass={`px-2 py-1 rounded text-sm bg-gray-100 text-gray-700`}
            />
            
            <button
              type="button"
              onClick={addImage}
              className={`px-2 py-1 rounded text-sm bg-gray-100 text-gray-700`}
              title="Resim Ekle"
            >
              Resim
            </button>
            
            <EmojiPicker 
              onEmojiSelect={(emoji) => {
                editor.chain().focus().insertContent(emoji).run();
              }} 
            />
          </div>

          {/* Bağlantı Araçları */}
          <div className="flex gap-1 mb-1 flex-wrap">
            <button
              type="button"
              onClick={() => {
                const url = window.prompt('URL girin:');
                if (url) {
                  editor.chain().focus().setLink({ href: url }).run();
                }
              }}
              className={`px-2 py-1 rounded text-sm ${editor.isActive('link') ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'}`}
              title="Bağlantı Ekle"
            >
              Bağlantı
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().unsetLink().run()}
              className={`px-2 py-1 rounded text-sm bg-gray-100 text-gray-700 ${!editor.isActive('link') ? 'opacity-50' : ''}`}
              title="Bağlantıyı Kaldır"
              disabled={!editor.isActive('link')}
            >
              Bağlantıyı Kaldır
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
              className={`px-2 py-1 rounded text-sm bg-gray-100 text-gray-700`}
              title="Formatı Temizle"
            >
              Temizle
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function CilingirKayit() {
  const { showToast } = useToast();
  const [activeStep, setActiveStep] = useState(6);
  const [isLoadingAi, setIsLoadingAi] = useState({
    tagline: false,
    hakkinda:false
  });

  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [errors, setErrors] = useState({});
  const [errorText, setErrorText] = useState("");
  const [isClient, setIsClient] = useState(false); // Client render kontrolü için state
  const [formData, setFormData] = useState({
    adSoyad: "",
    telefon: "",
    email: "",
    sifre: "",
    sifreTekrari: "",
    isletmeAdi: "",
    personelSayisi: "1",
    maxMusteriLimiti: "5", // Saatte max müşteri limiti
    vergiNo: "", // Opsiyonel
    websiteUrl: "", // Opsiyonel
    tagline: "", // Şirket sloganı
    hakkinda: "", // Şirket hakkında
    il: "",
    ilce: "",
    acikAdres: "",
    postaKodu: "",
    tecrube: "",
    hizmetBolgeleri: [],
    hizmetler: [],
    isletmeBelgesi: null,
    sertifikalar: [],
    isletmeResimleri: [], // İşletme resimleri için dizi
    profilResmiIndex: -1, // Profil resmi olarak seçilen resmin indeksi
    sosyalMedya: {
      instagram: "",
      facebook: "",
      youtube: "",
      tiktok: ""
    },
    termsAccepted: false,
    privacyAccepted: false,
    marketingAccepted: false,
    dataAccuracyAccepted: false
  });

  const [previewUrls, setPreviewUrls] = useState({
    isletmeBelgesi: null,
    sertifikalar: [],
    isletmeResimleri: [] // İşletme resimleri önizlemeleri
  });

  const [hizmetListesi, setHizmetListesi] = useState([]);

  useEffect(() => {
    // /api/public/services
    const fetchHizmetler = async () => {
      const response = await fetch("/api/public/services");
      const data = await response.json();
      setHizmetListesi(data.services);
    };
    fetchHizmetler();
  }, []);

  // Client tarafında olduğumuzu kontrol et
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Otomatik error temizleme
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }

    // if (name === "telefon") {
    //   value = formatPhoneNumber(value);
    // }
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSosyalMedyaChange = (e) => {
    const { name, value } = e.target;
    
    // Sosyal medya alanı adını parçalama (örn: sosyalMedya.instagram -> instagram)
    const platform = name.split('.')[1];
    
    // Hata temizleme
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    // URL doğrulama
    if (value && value.trim() !== '') {
      // URL formatını doğrula
      if (!value.startsWith('https://')) {
        setErrors(prev => ({ 
          ...prev, 
          [name]: 'URL https:// ile başlamalıdır' 
        }));
      } 
      else {
        // Platform spesifik doğrulama
        let isValid = true;
        
        if (platform === 'instagram' && !value.includes('instagram.com')) {
          isValid = false;
          setErrors(prev => ({ 
            ...prev, 
            [name]: 'Geçerli bir Instagram URL\'i girin' 
          }));
        }
        else if (platform === 'facebook' && !value.includes('facebook.com')) {
          isValid = false;
          setErrors(prev => ({ 
            ...prev, 
            [name]: 'Geçerli bir Facebook URL\'i girin' 
          }));
        }
        else if (platform === 'youtube' && !value.includes('youtube.com')) {
          isValid = false;
          setErrors(prev => ({ 
            ...prev, 
            [name]: 'Geçerli bir YouTube URL\'i girin' 
          }));
        }
        else if (platform === 'tiktok' && !value.includes('tiktok.com')) {
          isValid = false; 
          setErrors(prev => ({ 
            ...prev, 
            [name]: 'Geçerli bir TikTok URL\'i girin' 
          }));
        }
        
        if (isValid) {
          try {
            new URL(value); // URL geçerli mi kontrol et
          } catch (err) {
            setErrors(prev => ({ 
              ...prev, 
              [name]: 'Geçerli bir URL formatı değil' 
            }));
          }
        }
      }
    }
    
    // Güncelleme
    setFormData({
      ...formData,
      sosyalMedya: {
        ...formData.sosyalMedya,
        [platform]: value
      }
    });
  };

  const handleIlceChange = (ilce) => {
    let yeniHizmetBolgeleri = [...formData.hizmetBolgeleri];
    
    if (yeniHizmetBolgeleri.includes(ilce)) {
      yeniHizmetBolgeleri = yeniHizmetBolgeleri.filter(i => i !== ilce);
    } else {
      yeniHizmetBolgeleri.push(ilce);
    }
    
    setFormData({
      ...formData,
      hizmetBolgeleri: yeniHizmetBolgeleri
    });
    
    if (errors.hizmetBolgeleri && yeniHizmetBolgeleri.length > 0) {
      setErrors(prev => ({ ...prev, hizmetBolgeleri: undefined }));
    }
  };

  const handleHizmetChange = (hizmetId) => {
    let yeniHizmetler = [...formData.hizmetler];
    
    if (yeniHizmetler.includes(hizmetId)) {
      yeniHizmetler = yeniHizmetler.filter(i => i !== hizmetId);
    } else {
      yeniHizmetler.push(hizmetId);
    }
    
    setFormData({
      ...formData,
      hizmetler: yeniHizmetler
    });
    
    if (errors.hizmetler && yeniHizmetler.length > 0) {
      setErrors(prev => ({ ...prev, hizmetler: undefined }));
    }
  };

  // Tiptap editörünü başlat
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: 'İşletmeniz hakkında bilgi verin...',
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content: formData.hakkinda || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      handleHakkindaChange(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose focus:outline-none p-3 min-h-[150px] max-w-none',
      },
    }
  });

  const handleHakkindaChange = (content) => {
    setFormData({
      ...formData,
      hakkinda: content
    });
    
    if (errors.hakkinda) {
      setErrors(prev => ({ ...prev, hakkinda: undefined }));
    }
  };

  const handleCheckboxChange = (name) => {
    setFormData({
      ...formData,
      [name]: !formData[name]
    });
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleAiAssist = async (field) => {
    setIsLoadingAi(prev => ({ ...prev, [field]: true }));
    
    try {
      // Gerçek bir API çağrısı yapılabilir, şimdilik gecikme simülasyonu yapıyoruz
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Hangi alanı düzenleyeceğimize bağlı olarak AI cevabı oluşturuyoruz
      if (field === 'tagline') {
        const text = formData.tagline || formData.isletmeAdi;
        if (!text) {
          showToast("Önce bir slogan yazın veya işletme adı girin", "warning");
          setIsLoadingAi(prev => ({ ...prev, [field]: false }));
          return;
        }
        
        // Simulate AI enhancement
        const enhancedText = `${text} - Güvenilir ve Hızlı Çözümler`;
        setFormData(prev => ({ ...prev, tagline: enhancedText }));
        showToast("Slogan AI ile iyileştirildi", "success");
      } 
      else if (field === 'hakkinda') {
        const text = formData.hakkinda || formData.isletmeAdi;
        if (!text && !formData.isletmeAdi) {
          showToast("Önce bir metin girin veya işletme adı girin", "warning");
          setIsLoadingAi(prev => ({ ...prev, [field]: false }));
          return;
        }
        
        // Simulate AI enhancement - şimdi Tiptap için HTML formatında
        const enhancedText = `<p><strong>${formData.isletmeAdi}</strong> olarak ${formData.il || 'bölgemizde'} 
        en kaliteli çilingir hizmetlerini sunmaktayız. Müşteri memnuniyetini ön planda tutarak, 
        profesyonel ekibimizle 7/24 hizmet vermekteyiz. Modern ekipmanlarımız ve uzman kadromuzla 
        kapı açma, kilit değiştirme ve anahtar kopyalama gibi çeşitli hizmetleri hızlı ve güvenilir 
        bir şekilde sağlıyoruz.</p><p>Deneyimli ustalarımız en karmaşık kilit sistemleri için bile 
        çözüm sunmaktadır. Müşterilerimizin güvenliği bizim için her şeyden önemlidir.</p>`;
        
        // Önce formData'yı güncelle
        setFormData(prev => ({ ...prev, hakkinda: enhancedText }));
        
        // Ardından editörü güncelle
        if (editor) {
          editor.commands.setContent(enhancedText);
        }
        
        showToast("Hakkında metni AI ile iyileştirildi", "success");
      }
    } catch (error) {
      console.error("AI iyileştirme hatası:", error);
      showToast("AI iyileştirme sırasında bir hata oluştu", "error");
    } finally {
      setIsLoadingAi(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleAddCertificate = (certificateData) => {
    setCertificates(prev => [...prev, certificateData]);
  };

  const handleRemoveCertificate = (index) => {
    const newCertificates = [...certificates];
    
    // Önizleme URL'sini serbest bırak
    if (newCertificates[index].previewUrl) {
      URL.revokeObjectURL(newCertificates[index].previewUrl);
    }
    
    newCertificates.splice(index, 1);
    setCertificates(newCertificates);
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Dosya tipi ve boyut kontrolü
    const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const acceptedDocTypes = ['application/pdf'];
    const isImage = acceptedImageTypes.includes(file.type);
    const isPdf = acceptedDocTypes.includes(file.type);
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if ((!isImage && !isPdf) || file.size > maxSize) {
      showToast("Geçersiz dosya. Lütfen en fazla 5MB büyüklüğünde PDF veya görsel yükleyin.", "error");
      return;
    }
    
    // Önizleme URL'i oluştur (sadece görseller için)
    if (isImage) {
      const previewUrl = URL.createObjectURL(file);
      setPreviewUrls({
        ...previewUrls,
        [fieldName]: previewUrl
      });
    }
    
    // Form verilerini güncelle
    setFormData({
      ...formData,
      [fieldName]: file
    });
    
    // Hata varsa temizle
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: undefined }));
    }
  };

  const handleIsletmeResimleriChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    // Halihazırda yüklenen resimleri kontrol et
    if (formData.isletmeResimleri.length + files.length > 10) {
      showToast("En fazla 10 adet resim yükleyebilirsiniz.", "error");
      return;
    }
    
    // Geçerli resimleri koru
    let newIsletmeResimleri = [...formData.isletmeResimleri];
    let newPreviewUrls = [...previewUrls.isletmeResimleri];
    
    // Her dosyayı kontrol et
    for (const file of files) {
      // Dosya tipi ve boyut kontrolü
      const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      const acceptedDocTypes = ['application/pdf'];
      const isImage = acceptedImageTypes.includes(file.type);
      const isPdf = acceptedDocTypes.includes(file.type);
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if ((!isImage && !isPdf) || file.size > maxSize) {
        showToast("Geçersiz dosya. Lütfen en fazla 5MB büyüklüğünde PDF veya görsel yükleyin.", "error");
        continue;
      }
      
      // Dosyayı ekle
      newIsletmeResimleri.push(file);
      
      // Önizleme URL'i oluştur (sadece görseller için)
      if (isImage) {
        const previewUrl = URL.createObjectURL(file);
        newPreviewUrls.push(previewUrl);
      } else {
        newPreviewUrls.push(null); // PDF için boş önizleme
      }
    }
    
    // Profil resmi kontrolü
    let profilResmiIndex = formData.profilResmiIndex;
    if (profilResmiIndex === -1 && newIsletmeResimleri.length > 0) {
      profilResmiIndex = 0; // İlk resmi otomatik profil resmi yap
    }
    
    // Form verilerini güncelle
    setFormData({
      ...formData,
      isletmeResimleri: newIsletmeResimleri,
      profilResmiIndex: profilResmiIndex
    });
    
    // Önizleme URL'lerini güncelle
    setPreviewUrls({
      ...previewUrls,
      isletmeResimleri: newPreviewUrls
    });
    
    // Hata varsa temizle
    if (errors.isletmeResimleri) {
      setErrors(prev => ({ ...prev, isletmeResimleri: undefined }));
    }
  };

  const handleRemoveIsletmeResmi = (index) => {
    const newIsletmeResimleri = [...formData.isletmeResimleri];
    const newPreviewUrls = [...previewUrls.isletmeResimleri];
    
    // URL'yi serbest bırak
    URL.revokeObjectURL(newPreviewUrls[index]);
    
    // Resmi kaldır
    newIsletmeResimleri.splice(index, 1);
    newPreviewUrls.splice(index, 1);
    
    // Profil resmi indeksini güncelle
    let newProfilResmiIndex = formData.profilResmiIndex;
    
    if (newIsletmeResimleri.length === 0) {
      newProfilResmiIndex = -1; // Resim kalmadıysa indeksi sıfırla
    } else if (index === formData.profilResmiIndex) {
      newProfilResmiIndex = 0; // Silinen profil resmiyse ilk resmi profil yap
    } else if (index < formData.profilResmiIndex) {
      newProfilResmiIndex--; // Silinen resim profil resminden önceyse indeksi azalt
    }
    
    // Güncelle
    setFormData({
      ...formData,
      isletmeResimleri: newIsletmeResimleri,
      profilResmiIndex: newProfilResmiIndex
    });
    
    setPreviewUrls({
      ...previewUrls,
      isletmeResimleri: newPreviewUrls
    });
  };

  const handleSetProfilResmi = (index) => {
    setFormData({
      ...formData,
      profilResmiIndex: index
    });
  };


  const validateStep = (step) => {
    const newErrors = {};
    
    // Adım 1: Kişisel bilgiler doğrulaması
    if (step === 1) {
      if (!formData.adSoyad || formData.adSoyad.trim() === '') {
        newErrors.adSoyad = 'Ad soyad alanı zorunludur';
        return 'Ad soyad alanı zorunludur';
      }

      if (!formData.telefon || formData.telefon.trim() === '') {
        newErrors.telefon = 'Telefon alanı zorunludur';
        return 'Telefon alanı zorunludur';
      } else if (!/^05[0-9]{9}$/.test(formData.telefon.replace(/\s/g, ''))) {
        newErrors.telefon = 'Geçerli bir telefon numarası giriniz (05XX XXX XX XX)';
        return 'Geçerli bir telefon numarası giriniz (05XX XXX XX XX)';
      }

      if (!formData.email || formData.email.trim() === '') {
        newErrors.email = 'E-posta alanı zorunludur';
        return 'E-posta alanı zorunludur';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Geçerli bir e-posta adresi giriniz';
        return 'Geçerli bir e-posta adresi giriniz';
      }
      
      if (!formData.sifre || formData.sifre.trim() === '') {
        newErrors.sifre = 'Şifre alanı zorunludur';
        return 'Şifre alanı zorunludur';
      } else if (formData.sifre.length < 6) {
        newErrors.sifre = 'Şifre en az 6 karakter olmalıdır';
        return 'Şifre en az 6 karakter olmalıdır';
      }
      
      if (!formData.sifreTekrari || formData.sifreTekrari.trim() === '') {
        newErrors.sifreTekrari = 'Şifre tekrarı zorunludur';
        return 'Şifre tekrarı zorunludur';
      } else if (formData.sifre !== formData.sifreTekrari) {
        newErrors.sifreTekrari = 'Şifreler eşleşmiyor';
        return 'Şifreler eşleşmiyor';
      }

      if (!formData.tecrube || formData.tecrube.trim() === '') {
        newErrors.tecrube = 'İşe başlangıç yılı seçimi zorunludur';
        return 'İşe başlangıç yılı seçimi zorunludur';
      }
    }
    
    // Adım 2: İşletme bilgileri doğrulaması
    else if (step === 2) {
      if (!formData.isletmeAdi || formData.isletmeAdi.trim() === '') {
        newErrors.isletmeAdi = 'İşletme adı alanı zorunludur';
        return 'İşletme adı alanı zorunludur';
      }

      if (!formData.il || formData.il.trim() === '') {
        newErrors.il = 'İl seçimi zorunludur';
        return 'İl seçimi zorunludur';
      }

      if (!formData.ilce || formData.ilce.trim() === '') {
        newErrors.ilce = 'İlçe seçimi zorunludur';
        return 'İlçe seçimi zorunludur';
      }

      if (!formData.acikAdres || formData.acikAdres.trim() === '') {
        newErrors.acikAdres = 'Açık adres alanı zorunludur';
        return 'Açık adres alanı zorunludur';
      }
      
      // Sosyal medya URL'lerini doğrula (boş olan URL'leri atla)
      const validateSocialMediaURL = (url, platform, fieldName) => {
        if (url && url.trim() !== '') {
          if (!url.startsWith('https://')) {
            newErrors[fieldName] = 'URL https:// ile başlamalıdır';
            return 'URL https:// ile başlamalıdır';
          } 
          else if (!url.includes(`${platform}.com`)) {
            newErrors[fieldName] = `Geçerli bir ${platform} URL'i girin`;
            return `Geçerli bir ${platform} URL'i girin`;
          } 
          else {
            try {
              new URL(url);
            } catch (err) {
              newErrors[fieldName] = 'Geçerli bir URL formatı değil';
              return 'Geçerli bir URL formatı değil';
            }
          }
        }
      };
      
      validateSocialMediaURL(formData.sosyalMedya.instagram, 'instagram', 'sosyalMedya.instagram');
      validateSocialMediaURL(formData.sosyalMedya.facebook, 'facebook', 'sosyalMedya.facebook');
      validateSocialMediaURL(formData.sosyalMedya.youtube, 'youtube', 'sosyalMedya.youtube');
      validateSocialMediaURL(formData.sosyalMedya.tiktok, 'tiktok', 'sosyalMedya.tiktok');
    }
    
    // Adım 3: Hizmet bölgeleri doğrulaması
    else if (step === 3) {
      if (!formData.hizmetBolgeleri || formData.hizmetBolgeleri.length === 0) {
        newErrors.hizmetBolgeleri = 'En az bir hizmet bölgesi eklemelisiniz';
        return 'En az bir hizmet bölgesi eklemelisiniz';
      }

      if (!formData.hizmetler || formData.hizmetler.length === 0) {
        newErrors.hizmetler = 'En az bir hizmet seçmelisiniz';
        return 'En az bir hizmet seçmelisiniz';
      }
    }
    
    // Adım 4: Hizmetler ve hakkında doğrulaması
    else if (step === 4) {
      if (!formData.tagline || formData.tagline.trim() === '') {
        newErrors.tagline = 'Slogan alanı zorunludur';
        return 'Slogan alanı zorunludur';
      }
      
      // Tiptap boş içerik kontrolü
      const emptyTiptapContent = !formData.hakkinda || 
                               formData.hakkinda.trim() === '' || 
                               formData.hakkinda === '<p></p>' || 
                               formData.hakkinda === '<p><br></p>' ||
                               formData.hakkinda === '<p><br/></p>';
      
      if (emptyTiptapContent) {
        newErrors.hakkinda = 'İşletmeniz hakkında bilgi girmelisiniz';
        return 'İşletmeniz hakkında bilgi girmelisiniz';
      }
    }
    
    // Adım 5: İşletme Resimleri doğrulaması
    else if (step === 5) {
      if (!formData.isletmeResimleri || formData.isletmeResimleri.length === 0) {
        newErrors.isletmeResimleri = 'En az bir işletme resmi yüklemelisiniz';
        return 'En az bir işletme resmi yüklemelisiniz';
      }
    }
    
    // Adım 6: Belgeler doğrulaması
    else if (step === 6) {
      if (!formData.isletmeBelgesi) {
        newErrors.isletmeBelgesi = 'İşletme belgesi yüklemeniz zorunludur';
        return 'İşletme belgesi yüklemeniz zorunludur';
      }

      // Sertifika sayısı kontrolü
      if (certificates.length > 10) {
        newErrors.sertifikalar = 'En fazla 10 adet sertifika yükleyebilirsiniz';
        return 'En fazla 10 adet sertifika yükleyebilirsiniz';
      }
    }
    
    // Adım 7: Onaylar doğrulaması
    else if (step === 7) {
      if (!formData.termsAccepted) {
        newErrors.termsAccepted = 'Hizmet şartlarını kabul etmeniz gerekmektedir';
        return 'Hizmet şartlarını kabul etmeniz gerekmektedir';
      }
      
      if (!formData.privacyAccepted) {
        newErrors.privacyAccepted = 'Gizlilik politikasını kabul etmeniz gerekmektedir';
        return 'Gizlilik politikasını kabul etmeniz gerekmektedir';
      }
      
      if (!formData.dataAccuracyAccepted) {
        newErrors.dataAccuracyAccepted = 'Bilgilerin doğruluğunu onaylamanız gerekmektedir';
        return 'Bilgilerin doğruluğunu onaylamanız gerekmektedir';
      }
    }

    setErrors(newErrors);
    return true; // Tüm doğrulamalar başarılı
  };

  const nextStep = () => {
    // Mevcut adımı doğrula
    const validationResult = validateStep(activeStep);
    if (validationResult !== true) {
      showToast(validationResult, "error");
      return;
    }
    
    setActiveStep(activeStep + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setActiveStep(activeStep - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Son formun doğrulamasını yap
    const validationResult = validateStep(activeStep);
    if (validationResult !== true) {
      showToast(validationResult, "error");
      return;
    }
    
    // Sertifikaları finalFormData içine ekle
    const finalFormData = {
      ...formData,
      // Sertifikaları doğrudan certificates üzerinden al
      sertifikalar: certificates.map(cert => cert.file)
    };
    
    // Form verilerini işleme ve API'ye gönderme işlemleri burada yapılacak
    console.log("Form verileri:", finalFormData);
    console.log("Sertifikalar:", certificates);
    
    // Başvuru tamamlandı mesajını göster
    showToast("Başvurunuz başarıyla alındı!", "success");
    setActiveStep(8);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStepClick = (step) => {
    // Sadece tamamlanmış adımlar arasında geçişe izin ver
    if (step < activeStep) {
      setActiveStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Component unmount olduğunda editörü temizle
  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Çilingir Kayıt</h1>
      {activeStep<7 && <div className="mb-8">
        {/* Büyük ekranlar için adım göstergeleri */}
        <div className="flex justify-between items-center relative">
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <div key={step} className="flex flex-col items-center relative z-10">
              <div 
                onClick={() => handleStepClick(step)}
                className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer  
                  ${activeStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}
              >
                {step}
              </div>
              <span className={`mt-2 text-sm ${activeStep >= step ? 'text-blue-600' : 'text-gray-500'} hidden md:block`}>
                {step === 1 && "Kişisel Bilgiler"}
                {step === 2 && "İşletme Bilgileri"}
                {step === 3 && "Hizmetler ve Bölgeler"}
                {step === 4 && "İşletme Açıklaması"}
                {step === 5 && "İşletme Resimleri"}
                {step === 6 && "Evrak Yükleme"}
              </span>
            </div>
          ))}
          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10">
            <div 
              className="h-full bg-blue-600 transition-all" 
              style={{ width: `${(activeStep - 1) * 20}%` }}
            ></div>
          </div>
        </div>
        
        {/* Mobil için adım adı */}
        <div className="md:hidden text-center mt-4 py-3 px-4 bg-blue-50 rounded-md border border-blue-100 shadow-sm transition-all duration-300 transform hover:shadow">
          <span className="text-blue-700 font-medium">
            {activeStep === 1 && "Kişisel Bilgiler"}
            {activeStep === 2 && "İşletme Bilgileri"}
            {activeStep === 3 && "Hizmetler ve Bölgeler"}
            {activeStep === 4 && "İşletme Açıklaması"}
            {activeStep === 5 && "İşletme Resimleri"}
            {activeStep === 6 && "Evrak Yükleme"}
          </span>
        </div>
      </div>}

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>
            {activeStep === 1 && "Kişisel Bilgiler"}
            {activeStep === 2 && "İşletme Bilgileri"}
            {activeStep === 3 && "Bölge ve Hizmetler"}
            {activeStep === 4 && "İşletme Açıklaması"}
            {activeStep === 5 && "İşletme Resimleri"}
            {activeStep === 6 && "Evrak Yükleme"}
            {activeStep === 7 && "Onaylar"}
            {activeStep === 8 && "Başvuru Tamamlandı"}
          </CardTitle>
          <CardDescription>
            {activeStep === 1 && "Lütfen kişisel bilgilerinizi girin"}
            {activeStep === 2 && "İşletmeniz hakkında detayları girin"}
            {activeStep === 3 && "Hizmet verdiğiniz bölgeleri ve sunduğunuz hizmetleri seçin"}
            {activeStep === 4 && "İşletme açıklamasını girin"}
            {activeStep === 5 && "İşletme resimlerinizi yükleyin"}
            {activeStep === 6 && "Gerekli belgeleri yükleyin"}
            {activeStep === 7 && "Başvurunuzu tamamlamak için gereken onayları verin"}
            {activeStep === 8 && "Başvurunuz başarıyla alınmıştır"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {/* Adım 1: Kişisel Bilgiler */}
            {activeStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="mb-4">
                    <label 
                      htmlFor="adSoyad"
                      className="block text-sm font-medium text-gray-700 mb-1">
                      Ad Soyad
                    </label>
                    <input
                      type="text"
                      id="adSoyad"
                      name="adSoyad"
                      value={formData.adSoyad}
                      onChange={handleChange}
                      className={`mt-1 h-10 p-2 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                      ${errors.adSoyad ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.adSoyad && (
                      <p className="mt-1 text-sm text-red-600">{errors.adSoyad}</p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label 
                      htmlFor="telefon"
                      className="block text-sm font-medium text-gray-700 mb-1">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      id="telefon"
                      name="telefon"
                      value={formatPhoneNumber(formData.telefon)}
                      onChange={handleChange}
                      maxLength={14}
                      placeholder="05XX XXX XX XX"
                      className={`mt-1 p-2 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                      ${errors.telefon ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.telefon && (
                      <p className="mt-1 text-sm text-red-600">{errors.telefon}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="mb-4">
                    <label 
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1">
                      E-posta
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`mt-1 p-2 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                      ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label 
                      htmlFor="tecrube"
                      className="block text-sm font-medium text-gray-700 mb-1">
                      İşe Başlangıç Yılı
                    </label>
                    <select
                      id="tecrube"
                      name="tecrube"
                      value={formData.tecrube}
                      onChange={handleChange}
                      className={`mt-1 p-2 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                      ${errors.tecrube ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Yıl Seçiniz</option>
                      {Array.from({ length: new Date().getFullYear() - 2000 }, (_, i) => 2000 + i).map((yil) => (
                        <option key={yil} value={yil}>
                          {yil}
                        </option>
                      ))}
                    </select>
                    {errors.tecrube && (
                      <p className="mt-1 text-sm text-red-600">{errors.tecrube}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="mb-4">
                    <label 
                      htmlFor="sifre"
                      className="block text-sm font-medium text-gray-700 mb-1">
                      Şifre
                    </label>
                    <input
                      type="password"
                      id="sifre"
                      name="sifre"
                      value={formData.sifre}
                      onChange={handleChange}
                      className={`mt-1 p-2 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                      ${errors.sifre ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.sifre && (
                      <p className="mt-1 text-sm text-red-600">{errors.sifre}</p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label 
                      htmlFor="sifreTekrari"
                      className="block text-sm font-medium text-gray-700 mb-1">
                      Şifre Tekrarı
                    </label>
                    <input
                      type="password"
                      id="sifreTekrari"
                      name="sifreTekrari"
                      value={formData.sifreTekrari}
                      onChange={handleChange}
                      className={`mt-1 p-2 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                      ${errors.sifreTekrari ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.sifreTekrari && (
                      <p className="mt-1 text-sm text-red-600">{errors.sifreTekrari}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end mt-8">
                  <Button type="button" onClick={nextStep}>İleri</Button>
                </div>
              </div>
            )}

            {/* Adım 2: İşletme Bilgileri */}
            {activeStep === 2 && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="isletmeAdi" className="block text-sm font-medium text-gray-700">
                    İşletme Adı
                  </label>
                  <input
                    type="text"
                    id="isletmeAdi"
                    name="isletmeAdi"
                    className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.isletmeAdi ? 'border-red-500' : ''}`}
                    value={formData.isletmeAdi || ''}
                    onChange={handleChange}
                  />
                  {errors.isletmeAdi && <p className="mt-1 text-sm text-red-600">{errors.isletmeAdi}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Personel Sayısı</label>
                    <Input 
                      name="personelSayisi"
                      value={formData.personelSayisi}
                      onChange={handleChange}
                      placeholder="Örn: 2"
                      type="number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Saatlik Müşteri Limiti</label>
                    <Input 
                      name="maxMusteriLimiti"
                      value={formData.maxMusteriLimiti}
                      onChange={handleChange}
                      placeholder="Örn: 5"
                      type="number"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="mb-4">
                    <label 
                      htmlFor="il"
                      className="block text-sm font-medium text-gray-700 mb-1">
                      İl
                    </label>
                    <select
                      id="il"
                      name="il"
                      value={formData.il}
                      onChange={handleChange}
                      className={`mt-1 p-2 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                      ${errors.il ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">İl Seçiniz</option>
                      {turkiyeIlIlce.provinces.map((il) => (
                        <option key={il.id} value={il.id}>
                          {il.name}
                        </option>
                      ))}
                    </select>
                    {errors.il && (
                      <p className="mt-1 text-sm text-red-600">{errors.il}</p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label 
                      htmlFor="ilce"
                      className="block text-sm font-medium text-gray-700 mb-1">
                      İlçe
                    </label>
                    <select
                      id="ilce"
                      name="ilce"
                      value={formData.ilce}
                      onChange={handleChange}
                      className={`mt-1 p-2 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                      ${errors.ilce ? 'border-red-500' : 'border-gray-300'}`}
                      disabled={!formData.il}
                    >
                      <option value="">İlçe Seçiniz</option>
                      {turkiyeIlIlce.districts.filter(ilce => ilce.province_id==formData.il).map((ilce) => (
                        <option key={ilce.id} value={ilce.id}>
                          {ilce.name}
                        </option>
                      ))}
                    </select>
                    {errors.ilce && (
                      <p className="mt-1 text-sm text-red-600">{errors.ilce}</p>
                    )}
                  </div>
                </div>
                <div className="mb-4">
                  <label 
                    htmlFor="acikAdres"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    Açık Adres
                  </label>
                  <textarea
                    id="acikAdres"
                    name="acikAdres"
                    rows="3"
                    value={formData.acikAdres}
                    onChange={handleChange}
                    className={`mt-1 p-2 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                    ${errors.acikAdres ? 'border-red-500' : 'border-gray-300'}`}
                  ></textarea>
                  {errors.acikAdres && (
                    <p className="mt-1 text-sm text-red-600">{errors.acikAdres}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Sosyal Medya Linkleri */}
                  <div className="md:col-span-2 mt-4">
                    <h3 className="text-lg font-medium mb-3">Sosyal Medya Hesaplarınız</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      İşletmenizin sosyal medya hesaplarını ekleyebilirsiniz. Bu alanlar opsiyoneldir.
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <label 
                      htmlFor="instagram"
                      className="block text-sm font-medium text-gray-700 mb-1">
                      Instagram Linki
                    </label>
                    <input
                      type="text"
                      id="instagram"
                      name="sosyalMedya.instagram"
                      value={formData.sosyalMedya.instagram}
                      onChange={handleSosyalMedyaChange}
                      placeholder="https://www.instagram.com/kullaniciadi"
                      className={`mt-1 p-2 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                      ${errors['sosyalMedya.instagram'] ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors['sosyalMedya.instagram'] && (
                      <p className="mt-1 text-sm text-red-600">{errors['sosyalMedya.instagram']}</p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label 
                      htmlFor="facebook"
                      className="block text-sm font-medium text-gray-700 mb-1">
                      Facebook Linki
                    </label>
                    <input
                      type="text"
                      id="facebook"
                      name="sosyalMedya.facebook"
                      value={formData.sosyalMedya.facebook}
                      onChange={handleSosyalMedyaChange}
                      placeholder="https://www.facebook.com/sayfaadi"
                      className={`mt-1 p-2 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                      ${errors['sosyalMedya.facebook'] ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors['sosyalMedya.facebook'] && (
                      <p className="mt-1 text-sm text-red-600">{errors['sosyalMedya.facebook']}</p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label 
                      htmlFor="youtube"
                      className="block text-sm font-medium text-gray-700 mb-1">
                      YouTube Linki
                    </label>
                    <input
                      type="text"
                      id="youtube"
                      name="sosyalMedya.youtube"
                      value={formData.sosyalMedya.youtube}
                      onChange={handleSosyalMedyaChange}
                      placeholder="https://www.youtube.com/c/kanaladi"
                      className={`mt-1 p-2 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                      ${errors['sosyalMedya.youtube'] ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors['sosyalMedya.youtube'] && (
                      <p className="mt-1 text-sm text-red-600">{errors['sosyalMedya.youtube']}</p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label 
                      htmlFor="tiktok"
                      className="block text-sm font-medium text-gray-700 mb-1">
                      TikTok Linki
                    </label>
                    <input
                      type="text"
                      id="tiktok"
                      name="sosyalMedya.tiktok"
                      value={formData.sosyalMedya.tiktok}
                      onChange={handleSosyalMedyaChange}
                      placeholder="https://www.tiktok.com/@kullaniciadi"
                      className={`mt-1 p-2 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                      ${errors['sosyalMedya.tiktok'] ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors['sosyalMedya.tiktok'] && (
                      <p className="mt-1 text-sm text-red-600">{errors['sosyalMedya.tiktok']}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <Button type="button" variant="outline" onClick={prevStep}>Geri</Button>
                  <Button type="button" onClick={nextStep}>İleri</Button>
                </div>
              </div>
            )}

            {/* Adım 3: Hizmet Bölgeleri */}
            {activeStep === 3 && (
              <div className="space-y-6">
                <p className="text-sm text-gray-500 mb-4">
                  Hizmet verdiğiniz ilçeleri seçin. Birden fazla seçebilirsiniz.
                </p>
                
                <p className="text-md font-medium mb-3">Hizmet Bolgeleriniz</p>
                {!formData.il ? (
                  <div className="bg-yellow-50 p-4 rounded-md">
                    <p className="text-yellow-700">Lütfen önce bir il seçin.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {turkiyeIlIlce.districts.filter(ilce => ilce.province_id==formData.il).map((ilce) => (
                      <SelectableCard
                        key={ilce.id}
                        selected={formData.hizmetBolgeleri.includes(ilce.id)}
                        onClick={() => handleIlceChange(ilce.id)}
                        className="p-4"
                      >
                        <span className="text-sm font-medium">{ilce.name}</span>
                      </SelectableCard>
                    ))}
                  </div>
                )}

                <p className="text-md font-medium mb-3">Hizmetleriniz</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hizmetListesi.map((hizmet) => (
                    <SelectableCard
                      key={hizmet.id}
                      selected={formData.hizmetler.includes(hizmet.id)}
                      onClick={() => handleHizmetChange(hizmet.id)}
                      className="p-4"
                    >
                      <span className="text-sm font-medium">{hizmet.name}</span>
                    </SelectableCard>
                  ))}
                </div>
                
                <div className="flex justify-between mt-8">
                  <Button type="button" variant="outline" onClick={prevStep}>Geri</Button>
                  <Button type="button" onClick={nextStep}>İleri</Button>
                </div>
              </div>
            )}

            {/* Adım 4: Hizmetler */}
            {activeStep === 4 && (
              <div className="space-y-6">
                <p className="text-sm text-gray-500 mb-4">
                  İşletmeniz için slogan ve hakkında bilgilerinizi girin.
                </p>
                
                {/* Tagline (Slogan) Alanı */}
                <div className="mb-6 mt-8">
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="tagline" className="block text-sm font-medium text-gray-700">
                      İşletme Sloganı
                    </label>
                    <AiAssistButton 
                      onClick={() => handleAiAssist('tagline')} 
                      loading={isLoadingAi.tagline}
                      className="text-xs py-1 px-2"
                    />
                  </div>
                  <Input
                    type="text"
                    id="tagline"
                    name="tagline"
                    value={formData.tagline}
                    onChange={handleChange}
                    placeholder="Örn: Profesyonel çilingir hizmetleri"
                    className={errors.tagline ? 'border-red-500' : ''}
                  />
                  {errors.tagline && <p className="mt-1 text-sm text-red-600">{errors.tagline}</p>}
                </div>
                
                {/* Hakkında Alanı */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="hakkinda" className="block text-sm font-medium text-gray-700">
                      İşletme Hakkında
                    </label>
                    <AiAssistButton 
                      onClick={() => handleAiAssist('hakkinda')} 
                      loading={isLoadingAi.hakkinda}
                      className="text-xs py-1 px-2"
                    />
                  </div>
                  <div className={`border rounded-md ${errors.hakkinda ? 'border-red-500' : 'border-gray-300'} overflow-hidden`}>
                    <TiptapToolbar editor={editor} />
                    <EditorContent 
                      editor={editor} 
                      className="tiptap-editor"
                    />
                  </div>
                  {errors.hakkinda && <p className="mt-1 text-sm text-red-600">{errors.hakkinda}</p>}

                  {/* Tiptap Editörü için CSS */}
                  <style jsx global>{`
                    .tiptap-editor {
                      min-height: 200px;
                    }
                    
                    .tiptap-editor .ProseMirror {
                      min-height: 200px;
                      padding: 1rem;
                      outline: none;
                    }
                    
                    .tiptap-editor .ProseMirror p.is-editor-empty:first-child::before {
                      content: attr(data-placeholder);
                      float: left;
                      color: #adb5bd;
                      pointer-events: none;
                      height: 0;
                    }
                    
                    .tiptap-editor .ProseMirror img {
                      max-width: 100%;
                      height: auto;
                      margin: 1rem 0;
                    }
                    
                    .tiptap-editor .ProseMirror blockquote {
                      border-left: 3px solid #d1d5db;
                      padding-left: 1rem;
                      margin-left: 0;
                      margin-right: 0;
                      font-style: italic;
                    }
                    
                    .tiptap-editor .ProseMirror h2 {
                      font-size: 1.5rem;
                      font-weight: bold;
                      margin-top: 1rem;
                      margin-bottom: 0.5rem;
                    }
                    
                    .tiptap-editor .ProseMirror h3 {
                      font-size: 1.25rem;
                      font-weight: bold;
                      margin-top: 1rem;
                      margin-bottom: 0.5rem;
                    }
                    
                    .tiptap-editor .ProseMirror ul {
                      list-style-type: disc;
                      padding-left: 1.5rem;
                    }
                    
                    .tiptap-editor .ProseMirror ol {
                      list-style-type: decimal;
                      padding-left: 1.5rem;
                    }
                    
                    .tiptap-editor .ProseMirror a {
                      color: #3b82f6;
                      text-decoration: underline;
                    }
                  `}</style>
                </div>
                
                <div className="flex justify-between mt-8">
                  <Button type="button" variant="outline" onClick={prevStep}>Geri</Button>
                  <Button type="button" onClick={nextStep}>İleri</Button>
                </div>
              </div>
            )}

            {/* Adım 5: İşletme Resimleri */}
            {activeStep === 5 && (
              <div className="space-y-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">İşletme Resimleriniz</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    İşletmenize ait resimleri ekleyin. Dükkanınızın içi, dışı, kullandığınız araçlar veya iş alanınızı gösteren görseller yükleyebilirsiniz. İlk eklediğiniz resim otomatik olarak profil resmi olarak ayarlanacaktır.
                  </p>
                  <p className="text-sm text-blue-500 mb-4">
                    <strong>Not:</strong> En az 1, en fazla 10 resim yükleyebilirsiniz.
                  </p>
                  
                  {/* Resim Yükleme Alanı */}
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:bg-gray-50 relative">
                    <input
                      type="file"
                      id="isletmeResimleri"
                      name="isletmeResimleri"
                      accept="image/*"
                      multiple
                      onChange={handleIsletmeResimleriChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="space-y-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div className="flex flex-col items-center text-sm text-gray-600">
                        <label htmlFor="isletmeResimleri" className="font-medium text-blue-600 hover:underline">
                          Resim Yükle
                        </label>
                        <p className="text-xs text-gray-500">JPG, PNG veya WebP (Max 5MB)</p>
                      </div>
                    </div>
                  </div>
                  
                  {errors.isletmeResimleri && (
                    <p className="mt-2 text-sm text-red-600">{errors.isletmeResimleri}</p>
                  )}
                  
                  {/* Yüklenen Resimler Önizleme */}
                  {formData.isletmeResimleri.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-medium text-gray-700 mb-2">Yüklenen Resimler ({formData.isletmeResimleri.length}/10)</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {previewUrls.isletmeResimleri.map((url, index) => (
                          <div key={index} className={`relative group rounded-md overflow-hidden border-2 ${formData.profilResmiIndex === index ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}`}>
                            <img 
                              src={url} 
                              alt={`İşletme resmi ${index + 1}`} 
                              className="w-full h-32 object-cover"
                            />
                            
                            {/* Profil Resmi Rozeti */}
                            {formData.profilResmiIndex === index && (
                              <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                                Profil Resmi
                              </div>
                            )}
                            
                            {/* İşlem Butonları */}
                            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => handleSetProfilResmi(index)}
                                className="p-1.5 bg-blue-500 rounded-full text-white"
                                title="Profil resmi yap"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveIsletmeResmi(index)}
                                className="p-1.5 bg-red-500 rounded-full text-white"
                                title="Resmi sil"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between mt-8">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Geri
                  </Button>
                  <Button type="button" variant="default" onClick={nextStep}>
                    İleri
                  </Button>
                </div>
              </div>
            )}

            {/* Adım 6: Evrak Yükleme */}
            {activeStep === 6 && (
              <div className="space-y-6">
                <p className="text-sm text-gray-500 mb-4">
                  Lütfen aşağıdaki belgeleri yükleyin. İşletme belgesi zorunludur.
                </p>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium mb-2">İşletme Belgesi *</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Vergi levhası, ticaret sicil belgesi veya esnaf sicil belgesi yükleyin.
                    </p>
                    <div className="flex items-center space-x-4">
                      <label className="block w-full">
                        <div className={`border-2 border-dashed ${formData.isletmeBelgesi ? 'border-blue-400' : 'border-gray-300'} rounded-md p-6 text-center cursor-pointer hover:bg-gray-50 relative`}>
                          {!formData.isletmeBelgesi ? (
                            <>
                              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              <p className="mt-2 text-sm text-gray-500">
                                Dosya seçin veya buraya sürükleyin
                              </p>
                            </>
                          ) : (
                            <>
                              {formData.isletmeBelgesi.type.startsWith('image/') ? (
                                <div className="flex flex-col items-center">
                                  <img 
                                    src={previewUrls.isletmeBelgesi} 
                                    alt="İşletme belgesi önizleme" 
                                    className="max-h-40 object-contain mb-3 rounded"
                                  />
                                  <p className="text-sm text-gray-500">{formData.isletmeBelgesi.name}</p>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center">
                                  <svg className="w-12 h-12 text-blue-500 mb-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                  </svg>
                                  <p className="text-sm text-blue-600 font-medium">PDF dosyası</p>
                                  <p className="text-sm text-gray-500 mt-1">{formData.isletmeBelgesi.name}</p>
                                </div>
                              )}
                            </>
                          )}
                          <input 
                            type="file"
                            className="hidden"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileChange(e, "isletmeBelgesi")}
                            required
                          />
                        </div>
                      </label>
                      {formData.isletmeBelgesi && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            URL.revokeObjectURL(previewUrls.isletmeBelgesi);
                            setFormData({...formData, isletmeBelgesi: null});
                            setPreviewUrls({...previewUrls, isletmeBelgesi: null});
                          }}
                          className="shrink-0"
                        >
                          Kaldır
                        </Button>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Sertifiklar</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Varsa sertifikalarınızı yükleyin. Sertifikalarınızı kullanıcılar görebilir. Sertifikalı çilingirler daha güvenilir olarak kabul edilir.
                    </p>

                    <div className="flex flex-col md:flex-row gap-3 mb-6">
                      <Button 
                        type="button" 
                        onClick={() => setIsCertificateModalOpen(true)}
                        className="flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Sertifika Ekle
                      </Button>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-md mb-4 border border-blue-100">
                      <div className="flex gap-2 items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-blue-700">
                          En fazla 10 sertifika yükleyebilirsiniz. PDF veya görsel formatları desteklenir. Her dosya en fazla 5MB olabilir.
                        </p>
                      </div>
                    </div>
                  </div>

                  <CertificateModal
                    isOpen={isCertificateModalOpen}
                    onClose={() => setIsCertificateModalOpen(false)}
                    onSave={handleAddCertificate}
                  />
                  
                  {/* Sertifikalar */}
                  {certificates.length > 0 && (
                    <div className="mt-4 mb-6">
                      <h4 className="text-sm font-medium mb-2">Eklenen Sertifikalar</h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {certificates.map((certificate, index) => (
                          <li key={index} className="bg-white p-3 rounded-md border border-gray-200 shadow-sm flex items-center">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{certificate.name}</p>
                              <p className="text-xs text-gray-500 truncate">{certificate.file.name}</p>
                            </div>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleRemoveCertificate(index)}
                              className="h-8 w-8 p-0 rounded-full"
                            >
                              <XCircle className="h-5 w-5 text-red-500" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between mt-8">
                  <Button type="button" variant="outline" onClick={prevStep}>Geri</Button>
                  <Button type="button" onClick={nextStep}>Başvuruyu Kaydet</Button>
                </div>
              </div>
            )}

            {/* Adım 7: Onaylar */}
            {activeStep === 7 && (
              <div className="space-y-6">
                <div className="border-b pb-4 mb-6">
                  <h3 className="text-lg font-semibold mb-2">Başvurunuzu Gözden Geçirin</h3>
                  <p className="text-sm text-gray-500">
                    Başvurunuzu tamamlamak için lütfen aşağıdaki bilgileri gözden geçirin ve gerekli onayları verin.
                  </p>
                </div>

                {/* Özet bilgiler */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="font-medium mb-3">Özet Bilgiler</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">İşletme Adı:</span>
                      <span className="font-medium">{formData.isletmeAdi}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Ad Soyad:</span>
                      <span className="font-medium">{formData.adSoyad}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">E-posta:</span>
                      <span className="font-medium">{formData.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Telefon:</span>
                      <span className="font-medium">{formData.telefon}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Konum:</span>
                      <span className="font-medium">
                        {turkiyeIlIlce.provinces.find(il => il.id === formData.il)?.name}, 
                        {turkiyeIlIlce.districts.find(ilce => ilce.id === formData.ilce)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Hizmet Bölgesi Sayısı:</span>
                      <span className="font-medium">{formData.hizmetBolgeleri.length} bölge</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Hizmet Sayısı:</span>
                      <span className="font-medium">{formData.hizmetler.length} hizmet</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Sertifika Sayısı:</span>
                      <span className="font-medium">{certificates.length} sertifika</span>
                    </div>
                  </div>
                </div>

                {/* Onay Checkboxları */}
                <div className="space-y-4 mb-6">
                  <h4 className="font-medium mb-2">Kullanım Şartları ve Onaylar</h4>
                  
                  <div className="flex items-start space-x-3 p-3 rounded-md bg-blue-50">
                    <Checkbox 
                      id="termsAccepted" 
                      checked={formData.termsAccepted}
                      onCheckedChange={() => handleCheckboxChange('termsAccepted')}
                      className={errors.termsAccepted ? 'border-red-500 text-red-500' : ''}
                    />
                    <div>
                      <label 
                        htmlFor="termsAccepted" 
                        className={`text-sm font-medium ${errors.termsAccepted ? 'text-red-500' : 'text-gray-700'}`}
                      >
                        Hizmet Şartlarını kabul ediyorum *
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        <Link href="/terms" target="_blank" className="text-blue-600 hover:underline font-medium">
                          Hizmet Şartlarını
                        </Link> okudum ve kabul ediyorum. 
                      </p>
                      {errors.termsAccepted && (
                        <p className="mt-1 text-sm text-red-600">{errors.termsAccepted}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 rounded-md bg-blue-50">
                    <Checkbox 
                      id="privacyAccepted" 
                      checked={formData.privacyAccepted}
                      onCheckedChange={() => handleCheckboxChange('privacyAccepted')}
                      className={errors.privacyAccepted ? 'border-red-500 text-red-500' : ''}
                    />
                    <div>
                      <label 
                        htmlFor="privacyAccepted" 
                        className={`text-sm font-medium ${errors.privacyAccepted ? 'text-red-500' : 'text-gray-700'}`}
                      >
                        Gizlilik Politikasını kabul ediyorum *
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        <Link href="/privacy" target="_blank" className="text-blue-600 hover:underline font-medium">
                          Gizlilik Politikasını
                        </Link> okudum ve kabul ediyorum.
                      </p>
                      {errors.privacyAccepted && (
                        <p className="mt-1 text-sm text-red-600">{errors.privacyAccepted}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 rounded-md bg-gray-50">
                    <Checkbox 
                      id="marketingAccepted" 
                      checked={formData.marketingAccepted || false}
                      onCheckedChange={() => handleCheckboxChange('marketingAccepted')}
                    />
                    <div>
                      <label htmlFor="marketingAccepted" className="text-sm font-medium text-gray-700">
                        Pazarlama iletişimlerini kabul ediyorum
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Yeni özellikler, güncellemeler, kampanyalar ve fırsatlar hakkında bilgilendirme e-postaları almak istiyorum.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 rounded-md bg-green-50 border border-green-100">
                  <Checkbox 
                    id="dataAccuracyAccepted" 
                    checked={formData.dataAccuracyAccepted || false}
                    onCheckedChange={() => handleCheckboxChange('dataAccuracyAccepted')}
                    className={errors.dataAccuracyAccepted ? 'border-red-500 text-red-500' : ''}
                  />
                  <div>
                    <label 
                      htmlFor="dataAccuracyAccepted" 
                      className={`text-sm font-medium ${errors.dataAccuracyAccepted ? 'text-red-500' : 'text-gray-700'}`}
                    >
                      Veri doğruluğunu onaylıyorum *
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Yukarıda verdiğim tüm bilgilerin doğru ve eksiksiz olduğunu beyan ediyor ve onaylıyorum.
                    </p>
                    {errors.dataAccuracyAccepted && (
                      <p className="mt-1 text-sm text-red-600">{errors.dataAccuracyAccepted}</p>
                    )}
                  </div>
                </div>
                <div className="flex justify-between mt-8">
                  <Button type="button" variant="outline" onClick={prevStep}>Geri</Button>
                  <Button type="button" onClick={nextStep}>Başvuruyu Tamamla</Button>
                </div>
              </div>
            )}

            {/* Adım 8: Başvuru Tamamlandı */}
            {activeStep === 8 && (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-4">Başvurunuz Alındı!</h2>
                <p className="text-gray-600 mb-8">
                  Başvurunuz inceleme için ekibimize iletilmiştir. En kısa sürede size dönüş yapacağız. Başvurunuz onaylanınca mail ile bilgilendirileceksiniz. (Onay süresi genellikle 3-7 gün arasıdır.) Şifreniz mail ile gönderilecektir. Başvurunuz onaylandıktan sonra panel üzerinden giriş yapabilirsiniz.
                </p>
                <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 justify-center">
                  <Button variant="outline" type="button" onClick={() => window.location.href = "/"}>Ana Sayfaya Dön</Button>
                  <Button type="button" onClick={() => window.location.href = "/cilingir/auth/login"}>Panele Git</Button>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 