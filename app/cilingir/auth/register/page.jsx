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

import Link from 'next/link';

import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../../redux/features/authSlice";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../../components/ui/dialog";


// Dosya yükleme işlevleri
const uploadFileToBucket = async (file, bucketName) => {
  if (!file) return null;

  try {
    // Form data oluştur
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucketName', bucketName);

    // API endpoint'e gönder
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Dosya yükleme hatası: ${errorData.error || response.statusText}`);
    }

    const data = await response.json();

    return {
      name: file.name,
      url: data.url,
      path: data.path,
      size: file.size,
      type: file.type
    };
  } catch (error) {
    console.error('Dosya yükleme hatası:', error);
    throw error;
  }
};

// Birden fazla dosya yükleme
const uploadFilesToBucket = async (files, bucketName) => {
  if (!files || files.length === 0) return [];

  try {
    // Her dosyayı sırayla yükle
    const promises = Array.from(files).map(file => uploadFileToBucket(file, bucketName));
    return await Promise.all(promises);
  } catch (error) {
    console.error('Çoklu dosya yükleme hatası:', error);
    throw error;
  }
};

// Slug oluşturma fonksiyonu
const generateSlug = (businessName) => {
  //, provinceName, districtName
  if (!businessName) return '';

  // Türkçe karakterleri ve boşlukları düzelt
  const turkishToEnglish = {
    'ğ': 'g', 'Ğ': 'G', 'ü': 'u', 'Ü': 'U', 'ş': 's', 'Ş': 'S',
    'ı': 'i', 'İ': 'I', 'ö': 'o', 'Ö': 'O', 'ç': 'c', 'Ç': 'C'
  };

  let slug = businessName.toLowerCase();

  // Türkçe karakterleri değiştir
  Object.keys(turkishToEnglish).forEach(key => {
    slug = slug.replace(new RegExp(key, 'g'), turkishToEnglish[key]);
  });

  // Alfanumerik ve boşluk dışındaki karakterleri kaldır
  slug = slug.replace(/[^a-z0-9\s]/g, '');

  // Boşlukları tire ile değiştir
  slug = slug.replace(/\s+/g, '-');

  // // İl ve ilçe ekle (varsa)
  // if (provinceName) {
  //   let province = provinceName.toLowerCase();
  //   Object.keys(turkishToEnglish).forEach(key => {
  //     province = province.replace(new RegExp(key, 'g'), turkishToEnglish[key]);
  //   });
  //   province = province.replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
  //   slug += `-${province}`;
  // }

  // if (districtName) {
  //   let district = districtName.toLowerCase();
  //   Object.keys(turkishToEnglish).forEach(key => {
  //     district = district.replace(new RegExp(key, 'g'), turkishToEnglish[key]);
  //   });
  //   district = district.replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
  //   slug += `-${district}`;
  // }

  // Fazla tireleri temizle
  slug = slug.replace(/-+/g, '-');

  // Baştaki ve sondaki tireleri kaldır
  slug = slug.replace(/^-+|-+$/g, '');

  return slug;
};

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
        </div>
      )}
    </div>
  );
};

export default function CilingirKayit() {
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const authState = useSelector(state => state.auth);
  const [activeStep, setActiveStep] = useState(0);
  const [isLoadingAi, setIsLoadingAi] = useState({
    tagline: false,
    hakkinda: false
  });

  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const [areYouSure, setAreYouSure] = useState(false);

  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorText, setErrorText] = useState("");
  const [isClient, setIsClient] = useState(false); // Client render kontrolü için state

  // Daha sonra sertifikayı da aynı isimle isimlendireceğiz.
  const [certificates, setCertificates] = useState([]);
  const [formDataIsletmeResimleri, setFormDataIsletmeResimleri] = useState([]);
  const [formDataIsletmeBelgesi, setFormDataIsletmeBelgesi] = useState(null);
  const [formDataProfilResmiIndex, setFormDataProfilResmiIndex] = useState(-1);


  const [dailyHours, setDailyHours] = useState([
    {
      dayofweek: 0,
      opentime: "09:00",
      closetime: "18:00",
      is24hopen: false,
      isworking: true
    },
    {
      dayofweek: 1,
      opentime: "09:00",
      closetime: "18:00",
      is24hopen: false,
      isworking: true
    },
    {
      dayofweek: 2,
      opentime: "09:00",
      closetime: "18:00",
      is24hopen: false,
      isworking: true
    },
    {
      dayofweek: 3,
      opentime: "09:00",
      closetime: "18:00",
      is24hopen: false,
      isworking: true
    },
    {
      dayofweek: 4,
      opentime: "09:00",
      closetime: "18:00",
      is24hopen: false,
      isworking: true
    },
    {
      dayofweek: 5,
      opentime: "09:00",
      closetime: "18:00",
      is24hopen: false,
      isworking: true
    },
    {
      dayofweek: 6,
      opentime: "09:00",
      closetime: "18:00",
      is24hopen: false,
      isworking: true
    }
  ]);

  const [formData, setFormData] = useState({
    adSoyad: "",
    telefon: "",
    email: "",
    sifre: "",
    sifreTekrari: "",
    isletmeAdi: "",
    vergiNo: "", // Opsiyonel
    websiteUrl: "", // Opsiyonel
    tagline: "", // Şirket sloganı
    hakkinda: "", // Şirket hakkında
    il: "",
    ilce: "",
    acikAdres: "",
    postaKodu: "",
    startDate: "",
    hizmetBolgeleri: [],
    hizmetler: [],
    termsAccepted: false,
    privacyAccepted: false,
    marketingAccepted: false,
    dataAccuracyAccepted: false
  });

  // Gerekiyor mu? Gereksiz ise sil
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
    },
    // SSR sorunu için bu seçeneği ekliyoruz
    immediatelyRender: false
  }, [isClient]); // isClient'i bağımlılık olarak ekledik, sadece client tarafında render edilsin

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
      if (field === 'tagline') {
        const currentText = formData.tagline || "";
        const businessName = formData.isletmeAdi;

        if (!businessName) {
          showToast("Önce işletme adı girin", "warning");
          setIsLoadingAi(prev => ({ ...prev, [field]: false }));
          return;
        }

        // İl bilgisi
        const location = formData.il ? turkiyeIlIlce.provinces.find(il => il.id === formData.il)?.name : "";

        // Seçilen hizmetlerin isimlerini al
        const selectedServices = formData.hizmetler.map(hizmetId => {
          const hizmet = hizmetListesi.find(h => h.id === hizmetId);
          return hizmet ? hizmet.name : "";
        }).filter(Boolean);

        // AI API'sine istek gönder
        const response = await fetch('/api/ai/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            field: 'tagline',
            businessName,
            currentText,
            location,
            services: selectedServices
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "AI ile slogan oluşturulurken bir hata oluştu");
        }

        const data = await response.json();

        // Üretilen tagline'ı set et
        setFormData(prev => ({ ...prev, tagline: data.text }));
        showToast("Slogan AI ile iyileştirildi", "success");
      }
      else if (field === 'hakkinda') {
        const currentText = formData.hakkinda || "";
        const businessName = formData.isletmeAdi;

        if (!businessName) {
          showToast("Önce işletme adı girin", "warning");
          setIsLoadingAi(prev => ({ ...prev, [field]: false }));
          return;
        }

        // İl bilgisi
        const location = formData.il ? turkiyeIlIlce.provinces.find(il => il.id === formData.il)?.name : "";

        // Seçilen hizmetlerin isimlerini al
        const selectedServices = formData.hizmetler.map(hizmetId => {
          const hizmet = hizmetListesi.find(h => h.id === hizmetId);
          return hizmet ? hizmet.name : "";
        }).filter(Boolean);

        // AI API'sine istek gönder
        const response = await fetch('/api/ai/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            field: 'hakkinda',
            businessName,
            currentText: currentText.replace(/<[^>]*>/g, ' ').trim(), // HTML taglerini kaldır
            location,
            services: selectedServices
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "AI ile hakkında metni oluşturulurken bir hata oluştu");
        }

        const data = await response.json();

        // Üretilen HTML içeriğini set et
        setFormData(prev => ({ ...prev, hakkinda: data.text }));

        // Editörü güncelle
        if (editor) {
          editor.commands.setContent(data.text);
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
    setCertificates(prev => [
      ...prev,
      {
        name: certificateData.name,
        key: certificateData.key,  // Otomatik oluşturulan camelCase anahtar
        file: certificateData.file,
        previewUrl: certificateData.previewUrl
      }
    ]);
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
    if (fieldName === 'isletmeBelgesi') {
      setFormDataIsletmeBelgesi(file);
    } else {
      setFormData({
        ...formData,
        [fieldName]: file
      });
    }

    // Hata varsa temizle
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: undefined }));
    }
  };

  const handleIsletmeResimleriChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Halihazırda yüklenen resimleri kontrol et
    if (formDataIsletmeResimleri.length + files.length > 10) {
      showToast("En fazla 10 adet resim yükleyebilirsiniz.", "error");
      return;
    }

    // Geçerli resimleri koru
    let newIsletmeResimleri = [...formDataIsletmeResimleri];
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
    let profilResmiIndex = formDataProfilResmiIndex;
    if (profilResmiIndex === -1 && newIsletmeResimleri.length > 0) {
      profilResmiIndex = 0; // İlk resmi otomatik profil resmi yap
    }

    // Form verilerini güncelle
    setFormDataIsletmeResimleri(newIsletmeResimleri);
    setFormDataProfilResmiIndex(profilResmiIndex);

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
    const newIsletmeResimleri = [...formDataIsletmeResimleri];
    const newPreviewUrls = [...previewUrls.isletmeResimleri];

    // URL'yi serbest bırak
    URL.revokeObjectURL(newPreviewUrls[index]);

    // Resmi kaldır
    newIsletmeResimleri.splice(index, 1);
    newPreviewUrls.splice(index, 1);

    // Profil resmi indeksini güncelle
    let newProfilResmiIndex = formDataProfilResmiIndex;

    if (newIsletmeResimleri.length === 0) {
      newProfilResmiIndex = -1; // Resim kalmadıysa indeksi sıfırla
    } else if (index === formDataProfilResmiIndex) {
      newProfilResmiIndex = 0; // Silinen profil resmiyse ilk resmi profil yap
    } else if (index < formDataProfilResmiIndex) {
      newProfilResmiIndex--; // Silinen resim profil resminden önceyse indeksi azalt
    }

    // Güncelle
    setFormDataIsletmeResimleri(newIsletmeResimleri);
    setFormDataProfilResmiIndex(newProfilResmiIndex);

    setPreviewUrls({
      ...previewUrls,
      isletmeResimleri: newPreviewUrls
    });
  };

  const handleSetProfilResmi = (index) => {
    setFormDataProfilResmiIndex(index);
  };

  const validateAllFields = () => {
    const requiredFields = [
      'adSoyad', 'telefon', 'email', 'isletmeAdi',
      'il', 'ilce', 'acikAdres', 'startDate'
    ];


    // Temel alanları kontrol et
    for (const field of requiredFields) {
      if (!formData[field] || formData[field].trim() === '') {
        return false;
      }
    }

    // Hizmet bölgeleri
    if (!formData.hizmetBolgeleri || formData.hizmetBolgeleri.length === 0) {
      return false;
    }

    // Hizmetler
    if (!formData.hizmetler || formData.hizmetler.length === 0) {
      return false;
    }

    // İşletme resimleri
    if (!formDataIsletmeResimleri || formDataIsletmeResimleri.length === 0) {
      return false;
    }

    // İşletme belgesi
    if (!formDataIsletmeBelgesi) {
      return false;
    }

    // Kabul zorunlu koşullar
    if (!formData.termsAccepted || !formData.privacyAccepted || !formData.dataAccuracyAccepted) {
      return false;
    }

    return true;
  };

  const validateStep = async (step) => {
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

      //is email unique
      const response = await fetch('/api/register/auth/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          phone: formData.telefon
        }),
      });
      const data = await response.json();

      if (data.exists) {
        newErrors.email = 'Bu e-posta veya telefon numarası zaten kayıtlı. Lütfen değiştiriniz.';
        return 'Bu e-posta veya telefon numarası zaten kayıtlı. Lütfen değiştiriniz.';
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

      if (!formData.startDate || formData.startDate.trim() === '') {
        newErrors.startDate = 'İşe başlangıç yılı seçimi zorunludur';
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
      if (!formDataIsletmeResimleri || formDataIsletmeResimleri.length === 0) {
        newErrors.isletmeResimleri = 'En az bir işletme resmi yüklemelisiniz';
        return 'En az bir işletme resmi yüklemelisiniz';
      }
    }

    // Adım 6: Belgeler doğrulaması
    else if (step === 6) {
      if (!formDataIsletmeBelgesi) {
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

    // setErrors(newErrors);
    return true; // Tüm doğrulamalar başarılı
  };

  const nextStep = async () => {
    // Mevcut adımı doğrula
    const validationResult = await validateStep(activeStep);
    if (validationResult !== true) {
      showToast(validationResult, "error");
      return;
    }

    setActiveStep(activeStep + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    } else if (activeStep === 1) {
      setActiveStep(0);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Açılış/kapanış saatlerini güncelleme
  const handleTimeChange = (dayIndex, field, value) => {
    setDailyHours(prev =>
      prev.map(day => {
        if (day.dayofweek === dayIndex) {
          return {
            ...day,
            [field === 'start' ? 'opentime' : 'closetime']: value
          };
        }
        return day;
      })
    );
  };

  // Çalışma gününün açık/kapalı durumunu değiştirme
  const handleWorkDayToggle = (dayIndex, isOpen) => {
    setDailyHours(prev =>
      prev.map(day => {
        if (day.dayofweek === dayIndex) {
          return {
            ...day,
            isworking: isOpen
          };
        }
        return day;
      })
    );
  };

  // 24 saat açık durumunu değiştirme
  const handle24HourToggle = (dayIndex, is24h) => {
    setDailyHours(prev =>
      prev.map(day => {
        if (day.dayofweek === dayIndex) {
          return {
            ...day,
            is24hopen: is24h,
            opentime: is24h ? "00:00" : "09:00",
            closetime: is24h ? "00:00" : "18:00"
          };
        }
        return day;
      })
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsFormSubmitting(true);

    // Son formun doğrulamasını yap
    const validationResult = await validateStep(activeStep);
    if (validationResult !== true) {
      showToast(validationResult, "error");
      setIsFormSubmitting(false);
      return;
    }

    // Tüm formun bir son kontrolü
    const allFieldsValid = await validateAllFields();
    if (!allFieldsValid) {
      setErrorText("Lütfen tüm zorunlu alanları doldurun.");
      showToast("Lütfen tüm zorunlu alanları doldurun.", "error");
      setIsFormSubmitting(false);
      return;
    }

    try {
      showToast("Kaydınız işleniyor, lütfen bekleyin...", "info");

      // 1. Önce Supabase Auth ile yeni hesap oluştur
      const authResponse = await fetch('/api/register/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.sifre,
          fullName: formData.adSoyad,
          phone: formData.telefon
        }),
      });

      if (!authResponse.ok) {
        const errorData = await authResponse.json();
        throw new Error(errorData.error || "Kullanıcı kaydı sırasında bir hata oluştu");
      }

      const authData = await authResponse.json();
      const userId = authData.id; // Auth.users tablosundan gelen id



      // 5. İl adı ve ilçe adını al
      // const provinceName = turkiyeIlIlce.provinces.find(il => il.id === formData.il)?.name || '';
      // const districtName = turkiyeIlIlce.districts.find(ilce => ilce.id === formData.ilce)?.name || '';

      // 6. Slug oluştur
      const slug = generateSlug(formData.isletmeAdi);


      const locksmithInsertData = {
        authid: userId,
        slug: slug,
        provinceid: formData.il,
        districtid: formData.ilce,
        businessname: formData.isletmeAdi,
        fullname: formData.adSoyad,
        tagline: formData.tagline,
        email: formData.email,
        phonenumber: formData.telefon,
        profileimageurl: null,
        isverified: false,
        isactive: false,
      }

      const locksmithDetailsInsertData = {
        taxnumber: formData.vergiNo || null,
        fulladdress: formData.acikAdres,
        abouttext: formData.hakkinda,
        websiteurl: formData.websiteUrl || null,
        startdate: `${formData.startDate}-01-01`,
      }

      const locksmithDistrictsInsertData = {
        provinceid: formData.il,
        districts: formData.hizmetBolgeleri,
      }

      const locksmithWorkingHoursInsertData = {
        workinghours: dailyHours
      }

      const locksmithServicesInsertData = {
        services: formData.hizmetler
      }


      // Locksmith inserts
      const locksmithResponse = await fetch('/api/register/locksmiths', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          locksmithInsertData,
          locksmithDetailsInsertData,
          locksmithServicesInsertData,
          locksmithDistrictsInsertData,
          locksmithWorkingHoursInsertData
        }),
      });


      if (!locksmithResponse.ok) {
        const errorData = await locksmithResponse.json();
        throw new Error(errorData.error || "Çilingir kaydı sırasında bir hata oluştu");
      }

      const locksmithResponseData = await locksmithResponse.json();
      const locksmithid = await locksmithResponseData.locksmithid;


      try {
        await dispatch(loginUser({
          email: formData.email,
          password: formData.sifre
        }));
      } catch (loginError) {
        console.error('Giriş hatası:', loginError);
        showToast("Kayıt başarılı fakat otomatik giriş yapılamadı. Lütfen manuel olarak giriş yapın.", "warning");
      }


      // 2. İşletme resimlerini Supabase bucket'a yükle
      const uploadedImages = await uploadFilesToBucket(formDataIsletmeResimleri, 'business-images');

      // 3. İşletme belgesini Supabase bucket'a yükle
      const uploadedDocument = await uploadFileToBucket(formDataIsletmeBelgesi, 'business-documents');

      // 4. Sertifikaları Supabase bucket'a yükle
      const uploadedCertificates = await uploadFilesToBucket(
        certificates.map(cert => cert.file),
        'business-certificates'
      );

      //add cert.name to uploadedCertificates
      uploadedCertificates.forEach((cert, index) => {
        uploadedCertificates[index].name = certificates[index].name;
      });


      const locksmithCertificatesInsertData = {
        certificates: uploadedCertificates
      }

      const locksmithDocumentsInsertData = {
        documents: uploadedDocument
      }


      const locksmithImagesInsertData = {
        images: uploadedImages.map((img, index) => ({
          image_url: img.url,
          is_profile: index === formDataProfilResmiIndex,
          display_order: index
        }))
      }

      // Locksmith inserts
      const locksmithUpdateResponse = await fetch('/api/register/locksmiths', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          locksmithid,
          locksmithImagesInsertData,
          locksmithCertificatesInsertData,
          locksmithDocumentsInsertData
        }),
      });

      if (!locksmithUpdateResponse.ok) {
        const errorData = await locksmithUpdateResponse.json();
        throw new Error(errorData.error || "Çilingir ayarları yapılırken bir hata oluştu");
      }

      // Başvuru tamamlandı mesajını göster
      showToast("Başvurunuz başarıyla alındı!", "success");
      setActiveStep(8);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Kayıt hatası:", error);
      showToast(error.message || "Kayıt sırasında bir hata oluştu", "error");
    } finally {
      setIsFormSubmitting(false);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-400 to-blue-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {activeStep > 0 && <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-md">Çilingir Kayıt</h1>
          <p className="text-blue-100">Bi Çilingir platformuna üye olarak müşterilerinize daha kolay ulaşın</p>
        </div>}

        {activeStep > 0 && activeStep < 7 && <div className="mb-8 bg-white/20 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          {/* Büyük ekranlar için adım göstergeleri */}
          <div className="flex justify-between items-center relative">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div key={step} className="flex flex-col items-center relative z-10">
                <div
                  onClick={() => handleStepClick(step)}
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center cursor-pointer shadow-md transition-all duration-300 
                    ${activeStep >= step
                      ? 'bg-blue-600 text-white border-2 border-white'
                      : 'bg-white/80 text-blue-600'}`}
                >
                  {step}
                </div>
                <span className={`mt-3 text-sm font-medium ${activeStep >= step ? 'text-white' : 'text-blue-100'} hidden md:block`}>
                  {step === 1 && "Kişisel Bilgiler"}
                  {step === 2 && "İşletme Bilgileri"}
                  {step === 3 && "Hizmetler ve Bölgeler"}
                  {step === 4 && "İşletme Açıklaması"}
                  {step === 5 && "İşletme Resimleri"}
                  {step === 6 && "Evrak Yükleme"}
                </span>
              </div>
            ))}
            <div className="absolute top-4 md:top-6 left-0 right-0 h-2 bg-white/30 -z-10 rounded-full">
              <div
                className="h-full bg-white rounded-full transition-all shadow-md"
                style={{ width: `${(activeStep - 1) * 20}%` }}
              ></div>
            </div>
          </div>

          {/* Mobil için adım adı */}
          <div className="md:hidden flex flex-col justify-center text-center mt-4 py-3 px-4 bg-white/80 rounded-md shadow-md transition-all duration-300 transform hover:shadow-lg">
            <span className="text-blue-700 font-medium">
              {activeStep} -&nbsp;
              {activeStep === 1 && "Kişisel Bilgiler"}
              {activeStep === 2 && "İşletme Bilgileri"}
              {activeStep === 3 && "Hizmetler ve Bölgeler"}
              {activeStep === 4 && "İşletme Açıklaması"}
              {activeStep === 5 && "İşletme Resimleri"}
              {activeStep === 6 && "Evrak Yükleme"}
            </span>
            <span className="text-blue-600 font-regular text-sm">
              {activeStep === 1 && "Lütfen kişisel bilgilerinizi girin"}
              {activeStep === 2 && "İşletmeniz hakkında detayları girin"}
              {activeStep === 3 && "Hizmet verdiğiniz bölgeleri ve sunduğunuz hizmetleri seçin"}
              {activeStep === 4 && "İşletme açıklamasını girin"}
              {activeStep === 5 && "İşletme resimlerinizi yükleyin"}
              {activeStep === 6 && "Gerekli belgeleri yükleyin"}
              {activeStep === 7 && "Başvurunuzu tamamlamak için gereken onayları verin"}
              {activeStep === 8 && "Başvurunuz başarıyla alınmıştır"}
            </span>
          </div>
        </div>}

        <Card className="max-w-4xl mx-auto backdrop-blur-sm bg-white/90 shadow-2xl border-0">
          {activeStep > 0 && <CardHeader className="hidden md:block bg-gradient-to-r from-blue-600 to-blue-800 text-white py-1">
            <CardTitle className="text-2xl">
              {activeStep === 0 && "Bi Çilingir'e Hoş Geldiniz"}
              {activeStep === 1 && "Kişisel Bilgiler"}
              {activeStep === 2 && "İşletme Bilgileri"}
              {activeStep === 3 && "Bölge ve Hizmetler"}
              {activeStep === 4 && "İşletme Açıklaması"}
              {activeStep === 5 && "İşletme Resimleri"}
              {activeStep === 6 && "Evrak Yükleme"}
              {activeStep === 7 && "Onaylar"}
              {activeStep === 8 && "Başvuru Tamamlandı"}
            </CardTitle>
            <CardDescription className="text-blue-100">
              {activeStep === 0 && "Türkiye'nin ilk ve tek çilingir platformuna katılın ve işlerinizi büyütün"}
              {activeStep === 1 && "Lütfen kişisel bilgilerinizi girin"}
              {activeStep === 2 && "İşletmeniz hakkında detayları girin"}
              {activeStep === 3 && "Hizmet verdiğiniz bölgeleri ve sunduğunuz hizmetleri seçin"}
              {activeStep === 4 && "İşletme açıklamasını girin"}
              {activeStep === 5 && "İşletme resimlerinizi yükleyin"}
              {activeStep === 6 && "Gerekli belgeleri yükleyin"}
              {activeStep === 7 && "Başvurunuzu tamamlamak için gereken onayları verin"}
              {activeStep === 8 && "Başvurunuz başarıyla alınmıştır"}
            </CardDescription>
          </CardHeader>}
          <CardContent>
            <form onSubmit={handleSubmit}>

              {/* İptal Onay Modal */}
              <Dialog open={areYouSure} onOpenChange={setAreYouSure}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Kayıt işleminden çıkmak istediğinize emin misiniz?</DialogTitle>
                  </DialogHeader>
                  <div className="py-4 text-center">
                    <p className="text-muted-foreground mb-2">Kayıt işleminden çıkarsanız, şimdiye kadar girdiğiniz bilgiler kaydedilmeyecektir.</p>
                  </div>
                  <DialogFooter className="flex flex-row justify-center gap-2 sm:justify-center">
                    <Button variant="outline" onClick={() => setAreYouSure(false)}>
                      Hayır, kaydıma devam et
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => window.location.href = "/bilgi"}
                    >
                      Evet, çıkacağım
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Hoş Geldin Ekranı */}
              {activeStep === 0 && (
                <div className="py-6">
                  <div className="flex flex-col items-center mb-10">
                    <h2 className="text-2xl font-bold text-center mb-4">Çilingir İşletmenizi Büyütün</h2>
                    <p className="text-center text-gray-600 max-w-2xl mb-8">
                      Bi Çilingir platformu ile işletmenizi dijital dünyada tanıtın, daha fazla müşteriye ulaşın ve işlerinizi büyütün.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-blue-50 p-6 rounded-lg text-center hover:shadow-md transition-all">
                      <div className="bg-blue-100 w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-gray-800">Daha Fazla Müşteri</h3>
                      <p className="text-gray-600">Çilingir arayanlar artık size kolayca ulaşabilir. Size özel profil sayfanızla müşterilerinizi artırın.</p>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg text-center hover:shadow-md transition-all">
                      <div className="bg-blue-100 w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-gray-800">Artan Kazanç</h3>
                      <p className="text-gray-600">Dijital kanallar üzerinden gelen ilave müşterilerle işletmenizin cirosu artacak ve daha yüksek kazanç elde edeceksiniz.</p>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg text-center hover:shadow-md transition-all">
                      <div className="bg-blue-100 w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-gray-800">Profesyonel Görünüm</h3>
                      <p className="text-gray-600">Profesyonel iş profili ve müşteri yorumlarıyla işletmenize güven oluşturun ve markanızı büyütün.</p>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Button
                      type="button"
                      onClick={() => setActiveStep(1)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-lg shadow-lg transition-all hover:scale-105"
                    >
                      Hemen Kayıt Olmaya Başla →
                    </Button>
                  </div>
                </div>
              )}

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
                        htmlFor="startDate"
                        className="block text-sm font-medium text-gray-700 mb-1">
                        İşe Başlangıç Yılı
                      </label>
                      <select
                        id="startDate"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className={`mt-1 p-2 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                        ${errors.startDate ? 'border-red-500' : 'border-gray-300'}`}
                      >
                        <option value="">Yıl Seçiniz</option>
                        {Array.from({ length: new Date().getFullYear() - 2000 }, (_, i) => 2000 + i).map((yil) => (
                          <option key={yil} value={yil}>
                            {yil}
                          </option>
                        ))}
                      </select>
                      {errors.startDate && (
                        <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
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

                  <div className="flex justify-between mt-8">
                    <Button type="button" variant="outline" onClick={() => setAreYouSure(true)}>İptal</Button>
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
                        {turkiyeIlIlce.districts.filter(ilce => ilce.province_id == formData.il).map((ilce) => (
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

                  {/* Çalışma Saatleri */}
                  <div>
                    <h4 className="font-medium mb-4 mt-6">Çalışma Saatleri</h4>
                    <div className="space-y-4">
                      {dailyHours.map((day) => (
                        <div key={day.dayofweek} className="flex flex-col md:flex-row justify-between border p-3 rounded-md bg-gray-50">
                          <div className="flex items-center space-x-3 mb-3 md:mb-0">
                            <Checkbox
                              id={`workday-${day.dayofweek}`}
                              checked={day.isworking}
                              onCheckedChange={(checked) => {
                                handleWorkDayToggle(day.dayofweek, !!checked);
                              }}
                            />
                            <label
                              htmlFor={`workday-${day.dayofweek}`}
                              className={`font-medium ${!day.isworking ? "text-gray-400" : ""}`}
                            >
                              {day.dayofweek == 0 ? "Pazartesi" : day.dayofweek == 1 ? "Salı" : day.dayofweek == 2 ? "Çarşamba" : day.dayofweek == 3 ? "Perşembe" : day.dayofweek == 4 ? "Cuma" : day.dayofweek == 5 ? "Cumartesi" : "Pazar"}
                              <span className={`ml-2 text-sm ${day.isworking ? "text-green-600" : "text-red-500"}`}>
                                {day.isworking ? "(Açık)" : "(Kapalı)"}
                              </span>
                            </label>
                          </div>

                          <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center">
                            <div className="flex items-center space-x-2 mb-2 md:mb-0 md:mr-4">
                              <Checkbox
                                id={`24hours-${day.dayofweek}`}
                                checked={day.isworking && day.is24hopen}
                                onCheckedChange={(checked) => {
                                  handle24HourToggle(day.dayofweek, !!checked);
                                }}
                                disabled={!day.isworking}
                              />
                              <label
                                htmlFor={`24hours-${day.dayofweek}`}
                                className={`text-sm ${!day.isworking ? "text-gray-400" : ""}`}
                              >
                                24 Saat
                              </label>
                            </div>

                            <div className="flex items-center space-x-2 flex-wrap md:flex-nowrap">
                              <Input
                                type="time"
                                value={day.opentime ? day.opentime.substring(0, 5) : "09:00"}
                                onChange={(e) => {
                                  handleTimeChange(day.dayofweek, 'start', e.target.value);
                                }}
                                disabled={!day.isworking || day.is24hopen}
                                className={`w-24 ${(!day.isworking || day.is24hopen) ? "bg-gray-100 text-gray-400" : ""}`}
                              />
                              <span className={!day.isworking ? "text-gray-400" : ""}>-</span>
                              <Input
                                type="time"
                                value={day.closetime ? day.closetime.substring(0, 5) : "18:00"}
                                onChange={(e) => {
                                  handleTimeChange(day.dayofweek, 'end', e.target.value);
                                }}
                                disabled={!day.isworking || day.is24hopen}
                                className={`w-24 ${(!day.isworking || day.is24hopen) ? "bg-gray-100 text-gray-400" : ""}`}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
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
                      {turkiyeIlIlce.districts.filter(ilce => ilce.province_id == formData.il).map((ilce) => (
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
                        İşletme Sloganı ({formData.tagline.length}/150)
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
                        İşletme Hakkında ({formData.hakkinda.length}/1000)
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
                    {formDataIsletmeResimleri.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-medium text-gray-700 mb-2">Yüklenen Resimler ({formDataIsletmeResimleri.length}/10)</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {previewUrls.isletmeResimleri.map((url, index) => (
                            <div key={index} className={`relative group rounded-md overflow-hidden border-2 ${formDataProfilResmiIndex === index ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}`}>
                              <img
                                src={url}
                                alt={`İşletme resmi ${index + 1}`}
                                className="w-full h-32 object-cover"
                              />

                              {/* Profil Resmi Rozeti */}
                              {formDataProfilResmiIndex === index && (
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
                          <div className={`border-2 border-dashed ${formDataIsletmeBelgesi ? 'border-blue-400' : 'border-gray-300'} rounded-md p-6 text-center cursor-pointer hover:bg-gray-50 relative`}>
                            {!formDataIsletmeBelgesi ? (
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
                                {formDataIsletmeBelgesi.type.startsWith('image/') ? (
                                  <div className="flex flex-col items-center">
                                    <img
                                      src={previewUrls.isletmeBelgesi}
                                      alt="İşletme belgesi önizleme"
                                      className="max-h-40 object-contain mb-3 rounded"
                                    />
                                    <p className="text-sm text-gray-500">{formDataIsletmeBelgesi.name}</p>
                                  </div>
                                ) : (
                                  <div className="flex flex-col items-center">
                                    <svg className="w-12 h-12 text-blue-500 mb-2" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                    </svg>
                                    <p className="text-sm text-blue-600 font-medium">PDF dosyası</p>
                                    <p className="text-sm text-gray-500 mt-1">{formDataIsletmeBelgesi.name}</p>
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
                        {formDataIsletmeBelgesi && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              URL.revokeObjectURL(previewUrls.isletmeBelgesi);
                              setFormDataIsletmeBelgesi(null);
                              setPreviewUrls({ ...previewUrls, isletmeBelgesi: null });
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
                          {turkiyeIlIlce.provinces.find(il => il.id == formData.il)?.name},
                          {turkiyeIlIlce.districts.find(ilce => ilce.id == formData.ilce)?.name}
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
                    <Button
                      disabled={isFormSubmitting}
                      type="submit">{isFormSubmitting ? "İşleniyor..." : "Kaydımı Tamamla"}</Button>
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
    </div>
  );
} 