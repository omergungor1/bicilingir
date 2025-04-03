"use client";

import { useState, useEffect, Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Checkbox } from "../../components/ui/checkbox";
import { Info, Phone, Star, Eye, PhoneCall, Instagram, Menu, X, Footprints, File, ExternalLinkIcon, Clock, Search, CheckCircle, AlertTriangle, AlertCircle, Bell, User, Trash2 } from "lucide-react";
import { useToast } from "../../components/ToastContext";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../../components/ui/dialog"
import turkiyeIlIlce from "../../data/turkiye-il-ilce.js";
import { useSelector, useDispatch } from "react-redux";
import { supabase } from "../../lib/supabase";
import { Textarea } from "../../components/ui/textarea";


function CilingirPanelContent() {
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get('tab');

  // Anahtar paketleri için state
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [purchaseNote, setPurchaseNote] = useState("");
  const [isPurchasePending, setIsPurchasePending] = useState(false);
  const [profileImageIndex, setProfileImageIndex] = useState(0);

  const [activeTab, setActiveTab] = useState(tabParam || "dashboard");
  const [isCertificateDialogOpen, setIsCertificateDialogOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeReviewFilter, setActiveReviewFilter] = useState("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [keyBalance, setKeyBalance] = useState(1500); // Örnek roket bakiyesi
  const [maxCustomersPerHour, setMaxCustomersPerHour] = useState(2);
  const [selectedCity, setSelectedCity] = useState(1);
  const [selectedDistrict, setSelectedDistrict] = useState(1);

  const [locksmith, setLocksmith] = useState({
    aboutText: "",
    avgrating:0,
    businessImageUrls:[],
    businessname:"",
    certificates:[],
    customerlimitperhour:0,
    districtid:0,
    provinceid:0,
    documents:[],
    email:"",
    whatsappnumber:"",
    phonenumber:"",
    fulladdress:"",
    fullname:"",
    isactive:"",
    isemailverified:"",
    isphoneverified:"",
    isverified:"",
    profileimageurl:"",
    instagram_url:"",
    facebook_url:"",
    tiktok_url:"",
    youtube_url:"",
    status:"",
    tagline:"",
    taxnumber:"",
    totalreviewcount:0,
    averageRating:0,
    websiteurl:"",
  });
  
  const [dailyHours, setDailyHours] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  const [activeDashboardFilter, setActiveDashboardFilter] = useState("today");
  const [dashboardStats, setDashboardStats] = useState({
    see: 0,
    see_percent: 0,
    call: 0,
    call_percent: 0,
    visit: 0,
    visit_percent: 0,
    review: 0,
    review_percent: 0,
  });

  const handleLoadRecentActivities = async () => {
    const response = await fetch('/api/locksmith/dashboard/recent-activities');
    const data = await response.json();
    setRecentActivities(data);
  };


  const handleDashboardFilterChange = async (filter) => {
    setActiveDashboardFilter(filter);
    try {
      const response = await fetch(`/api/locksmith/dashboard/stats?period=${filter}`);
      const data = await response.json();
      setDashboardStats(data);

    } catch (error) {
      console.error("Dashboard verisi güncellenirken hata:", error);
      showToast("İstatistikler alınırken bir hata oluştu", "error");
    }
  };

  const handleLogout = () => {
    supabase.auth.signOut();
    router.push('/cilingir/auth/login');
  };

  const [dailyKeys, setDailyKeys] = useState({
    Pazartesi: {key: 50, isOpen: true},
    Salı: {key: 50, isOpen: true},
    Çarşamba: {key: 50, isOpen: true},
    Perşembe: {key: 50, isOpen: true},
    Cuma: {key: 50, isOpen: true},
    Cumartesi: {key: 100, isOpen: true},
    Pazar: {key: 100, isOpen: true},
  });
  const [keyUsageHistory, setKeyUsageHistory] = useState([
    { id: 1, keyUsage: 5, activite: "Aramada listelendin", date: "2025-03-23 10:00:00"},
    { id: 2, keyUsage: 30, activite: "Bir arama aldınız", date: "2025-03-23 10:00:00" },
    { id: 3, keyUsage: 5, activite: "Aramada listelendin", date: "2025-03-23 10:00:00" },
    { id: 4, keyUsage: 5, activite: "Aramada listelendin", date: "2025-03-23 10:00:00" },
    { id: 5, keyUsage: 30, activite: "Bir arama aldınız", date: "2025-03-23 10:00:00" },
    { id: 6, keyUsage: 30, activite: "Bir arama aldınız", date: "2025-03-23 10:00:00" },
    { id: 7, keyUsage: 5, activite: "Aramada listelendin", date: "2025-03-23 10:00:00" },
    { id: 8, keyUsage: 5, activite: "Aramada listelendin", date: "2025-03-23 10:00:00" },
    
  ]);


  const [serviceList, setServiceList] = useState([]);
  const fetchServices = async () => {
    //api/public/services
    const response = await fetch('/api/public/services');
    const data = await response.json();
    setServiceList(data.services);
  };
  const fetchReviews = async () => {
    // const response = await getLocksmithsReviews();
    // setReviews(response.reviews);
  };
  // Dashboard istatistiklerini de yükle
  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/locksmith/dashboard/stats', {
        credentials: 'include' // Çerezleri isteğe dahil et
      });
      const data = await response.json();
      
      if (data && data.stats) {
        setDashboardStats(data.stats);
      } else if (data && data.error) {
        console.error('Dashboard stats hatası:', data.error);
        showToast("İstatistikler yüklenirken bir hata oluştu", "error");
      }
    } catch (error) {
      console.error('Dashboard stats alınırken bir hata oluştu:', error);
      showToast("İstatistikler yüklenirken bir hata oluştu", "error");
    }
  };

  const fetchDailyHours = async () => {
    try {
      // Supabase oturum bilgilerini burada kullanarak isteğimizi gönderelim
      // Önce fetch'e headers ekleyerek Supabase Cookie bilgilerini göndermesini sağlayalım
      const response = await fetch('/api/locksmith/profile/working-hours', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Diğer header'lar otomatik eklenecek (credentials: 'include' sayesinde)
        },
        credentials: 'include', // Bu önemli, cookie'leri istek ile göndermeyi sağlar
      });
      
      const data = await response.json();
      
      // Hata olduğunda bile bir veri dizisi gelecek şekilde API tasarlandı
      // Data varsa ve bir array ise direkt kullan
      if (data && Array.isArray(data)) {
        setDailyHours(data);
      } else if (data.error) {
        showToast("Çalışma saatleri alınırken bir hata oluştu", "error");
      }
    } catch (error) {
      showToast("Çalışma saatleri alınırken bir hata oluştu", "error");
    }
  };

  const fetchLocksmith = async () => {
    try {
      const response = await fetch('/api/locksmith/profile', {
        credentials: 'include' // Çerezleri isteğe dahil et
      });
      const data = await response.json();
      console.log('Çilingir profili verileri:', data.locksmith);
      if (data && !data.error) {
        setLocksmith(data.locksmith);
      } else if (data.error) {
        console.error('Profil getirme hatası:', data.error);
        showToast("Profil bilgileriniz yüklenirken bir hata oluştu", "error");
      }
    } catch (error) {
      console.error('Çilingir profili alınırken bir hata oluştu:', error);
      showToast("Profil bilgileriniz yüklenirken bir hata oluştu", "error");
    }
  };

  const fetchNotifications = async () => {
    const response = await fetch('/api/locksmith/notifications');
    const data = await response.json();
    setNotifications(data);
  };

  useEffect(() => {
    fetchServices();
    fetchReviews();
    fetchDashboardStats();
    handleLoadRecentActivities();
    fetchDailyHours();
    fetchLocksmith();
    fetchNotifications();
  }, []);

  const [activeServices, setActiveServices] = useState([1,2,4]);

  const [businessImages, setBusinessImages] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [deleteImageId, setDeleteImageId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [keyPackages, setKeyPackages] = useState([]);


  const [certificates, setCertificates] = useState([
    { name: "TSE Belgesi", url: "https://www.tse.gov.tr/images/belge/tse-belgesi.pdf" },
    { name: "Mesleki Yeterlilik Belgesi", url: "https://www.tse.gov.tr/images/belge/mesleki-yeterlilik-belgesi.pdf" },
    { name: "Ustalık Belgesi", url: "https://www.tse.gov.tr/images/belge/ustalik-belgesi.pdf" },
  ]);


  const [newCertificate, setNewCertificate] = useState({ name: '', file: null, fileSize: 0, fileType: '' });

  useEffect(() => {
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // URL'yi güncelle
    const params = new URLSearchParams(searchParams);
    params.set('tab', tab);
    router.push(`?${params.toString()}`);
  };

  const handleDailyKeyChange = (day, value) => {
    setDailyKeys(prev => ({
      ...prev,
      [day]: { ...prev[day], key: parseInt(value) || 0 }
    }));
  };

  const handleServiceActiveChange = (id, checked) => {
    if (checked) {
      setActiveServices(prevServices => [...prevServices, id]);
    } else {
      setActiveServices(prevServices => prevServices.filter(s => s !== id));
    }
  };

  // Profil ve işletme resimlerini getir
  const fetchBusinessImages = async () => {
    try {
      const response = await fetch("/api/locksmith/profile/image", {
        credentials: "include",
      });

      if (!response.ok) {
        console.error("İşletme resimleri alınırken bir hata oluştu");
        return;
      }

      const data = await response.json();
      
      // Veritabanından gelen resimleri state'e aktar
      if (Array.isArray(data) && data.length > 0) {
        // Ana görsel varsa onu bul
        const mainImageIdx = data.findIndex(img => img.is_main);
        const profileImageIdx = data.findIndex(img => img.is_profile);
        setBusinessImages(data);
        setMainImageIndex(mainImageIdx >= 0 ? mainImageIdx : 0);
        setProfileImageIndex(profileImageIdx >= 0 ? profileImageIdx : 0);
      } else {
        // Eğer hiç resim yoksa varsayılan görseller
        setBusinessImages([]);
        setMainImageIndex(-1);
      }
    } catch (error) {
      console.error("İşletme resimleri yüklenirken bir hata oluştu:", error);
    }
  };

  const handleRemoveImage = async (imageId) => {
    // Modal açıp onay iste
    setDeleteImageId(imageId);
    setShowDeleteModal(true);
  };

  const confirmDeleteImage = async () => {
    if (!deleteImageId) return;
    
    try {
      const response = await fetch(`/api/locksmith/profile/image?id=${deleteImageId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Resim silinirken bir hata oluştu');
      }
      
      // Resimler değiştiği için yeniden yükle
      await fetchBusinessImages();
      showToast("Resim başarıyla kaldırıldı.", "success");
    } catch (error) {
      console.error('Resim silinirken bir hata oluştu:', error);
      showToast("Resim silinirken bir hata oluştu.", "error");
    } finally {
      // Modal'ı kapat ve ID'yi temizle
      setShowDeleteModal(false);
      setDeleteImageId(null);
    }
  };

  const cancelDeleteImage = () => {
    setShowDeleteModal(false);
    setDeleteImageId(null);
  };

  const setMainImage = async (imageId) => {
    try {
      const response = await fetch('/api/locksmith/profile/image', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: imageId,
          isMain: true
        }),
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Ana resim ayarlanırken bir hata oluştu');
      }
      
      // Resimler değiştiği için yeniden yükle
      await fetchBusinessImages();
      showToast("Ana resim başarıyla güncellendi.", "success");
    } catch (error) {
      console.error('Ana resim ayarlanırken bir hata oluştu:', error);
      showToast("Ana resim ayarlanırken bir hata oluştu.", "error");
    }
  };

  const setProfileImage = async (imageId) => {
    try {
      const response = await fetch('/api/locksmith/profile/image', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: imageId,
          isProfile: true
        }),
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Profil resmi ayarlanırken bir hata oluştu');
      }
      
      // Resimler değiştiği için yeniden yükle
      await fetchBusinessImages();
      showToast("Profil resmi başarıyla güncellendi.", "success");
    } catch (error) {
      console.error('Profil resmi ayarlanırken bir hata oluştu:', error);
      showToast("Profil resmi ayarlanırken bir hata oluştu.", "error");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleImageUpload({ target: { files } });
  };

  const handlePackagePurchase = (id) => {
    // Seçilen paketi bul
    const selectedPkg = keyPackages.find(pkg => pkg.id === id);
    if (selectedPkg) {
      setSelectedPackage(selectedPkg);
      setIsPackageModalOpen(true);
    } else {
      showToast("Paket bulunamadı", "error");
    }
  };


  const handleAddCertificate = () => {
    if (!newCertificate.name || !newCertificate.file) return;
    
    if (certificates.length < 5) {
      setCertificates([...certificates, newCertificate]);
      // Formu temizle
      setNewCertificate({ name: '', file: null, fileSize: 0, fileType: '' });
      showToast('Sertifika başarıyla eklendi.', "success");
    } else {
      showToast('En fazla 5 sertifika ekleyebilirsiniz.', "error");
    }
    setIsCertificateDialogOpen(false);
  };

  const handleRemoveCertificate = (index) => {
    const updatedCertificates = [...certificates];
    updatedCertificates.splice(index, 1);
    setCertificates(updatedCertificates);
    showToast("Sertifika başarıyla kaldırıldı.", "success");
  };

  // Sertifika görüntüleme
  const handleViewCertificate = (cert) => {
    if (cert.file) {
      if (cert.file instanceof File) {  
        // Dosya henüz yüklendi ve bir File objesi
        showToast(`${cert.name} sertifikası başarıyla yüklendi, kaydedildikten sonra görüntülenebilecek.`, "success");
      } else {
        // Dosya zaten sunucuda ve bir URL
        window.open(cert.file, '_blank');
      }
    }
  };
  
  // Satın alma işlemini gerçekleştir
  const handlePurchaseSubmit = async () => {
    try {
      setIsPurchasePending(true);
      
      // API isteği simülasyonu - gerçek uygulamada burası API çağrısı olacak
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // İstek başarılı oldu
      showToast("Anahtar paketi satın alma isteğiniz yöneticiye iletildi", "success");
      setIsPackageModalOpen(false);
      setPurchaseNote("");
      setSelectedPackage(null);
      setIsPurchasePending(false);
    } catch (error) {
      console.error("Satın alma hatası:", error);
      showToast("Satın alma işlemi sırasında bir hata oluştu", "error");
      setIsPurchasePending(false);
    }
  };


  // Çalışma saatleri güncelleme fonksiyonu
  const handleWorkingHoursUpdate = async () => {
    try {
      const response = await fetch('/api/locksmith/profile/working-hours', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(
          dailyHours.map(day => ({
            ...day,
            isworking: day.isworking || false,
            opentime: day.opentime || day.start,
            closetime: day.closetime || day.end
          }))
        )
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showToast("Çalışma saatleri başarıyla güncellendi", "success");
      } else {
        showToast("Çalışma saatleri güncellenirken bir hata oluştu", "error");
        console.error("Çalışma saatleri güncelleme hatası:", data);
      }
    } catch (error) {
      showToast("Çalışma saatleri güncellenirken bir hata oluştu", "error");
      console.error("Çalışma saatleri güncelleme hatası:", error);
    }
  };

  // Çalışma gününün açık/kapalı durumunu değiştirme
  const handleWorkDayToggle = (dayIndex, isOpen) => {    
    // dailyHours dizisindeki ilgili günü güncelle
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

  // İşletme verilerini güncelleyecek fonksiyon
  const handleLocksmithDataChange = (field, value) => {
    setLocksmith(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdateLocksmithData = async () => {
    try {
      const response = await fetch('/api/locksmith/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(locksmith),
        credentials: 'include'
      });
  
      if (!response.ok) {
        throw new Error('Profil bilgileri güncellenirken bir hata oluştu');
      }
  
      showToast("Profil bilgileri başarıyla güncellendi", "success");
    } catch (error) {
      showToast("Profil bilgileri güncellenirken bir hata oluştu", "error");
      console.error("Profil bilgileri güncellenirken bir hata oluştu:", error);
    }
  };

  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordChange = (field, value) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDismissNotification = async (notificationId) => {
    try {
      // Bildirim listesini güncelle
      const updatedNotifications = notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isdismissed: true } 
          : notification
      );
      
      // Önce UI'ı güncelle
      setNotifications(updatedNotifications);
      
      // Sonra API'ye güncelleme isteği gönder
      const response = await fetch('/api/locksmith/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: notificationId,
          isdismissed: true
        }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        console.error('Bildirim güncellenirken bir hata oluştu');
        // Hata durumunda eski listeye dön
        fetchNotifications();
      }
    } catch (error) {
      console.error('Bildirim kapatılırken bir hata oluştu:', error);
      fetchNotifications();
    }
  };

  const handleReadNotification = async (notificationId) => {
    try {
      // Bildirim listesini güncelle
      const updatedNotifications = notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isread: true } 
          : notification
      );
      
      // Önce UI'ı güncelle
      setNotifications(updatedNotifications);
      
      // Sonra API'ye güncelleme isteği gönder
      const response = await fetch('/api/locksmith/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: notificationId,
          isread: true
        }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        console.error('Bildirim güncellenirken bir hata oluştu');
        // Hata durumunda eski listeye dön
        fetchNotifications();
      }
    } catch (error) {
      console.error('Bildirim okundu olarak işaretlenirken bir hata oluştu:', error);
      fetchNotifications();
    }
  };

  const fetchKeyPackages = async () => {
    const response = await fetch('/api/locksmith/ads/packages');
    const data = await response.json();
    setKeyPackages(data.packages);
  };

  useEffect(() => {
    Promise.all([
      fetchLocksmith(),
      fetchDailyHours(),
      fetchDashboardStats(),
      fetchReviews(),
      fetchServices(),
      fetchNotifications(),
      fetchKeyPackages(),
      fetchBusinessImages(),
    ]);
  }, []);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    if (businessImages.length + files.length > 10) {
      showToast("En fazla 10 resim yükleyebilirsiniz.", "error");
      return;
    }
    
    const validFiles = files.filter(file => {
      // 5MB kontrolü
      if (file.size > 5 * 1024 * 1024) {
        showToast(`${file.name} dosyası 5MB'dan büyük!`, "error");
        return false;
      }

      // Resim kontrolü
      if (!file.type.startsWith('image/')) {
        showToast(`${file.name} bir resim dosyası değil!`, "error");
        return false;
      }
      
      return true;
    });
    
    if (validFiles.length === 0) return;
    
    setIsUploading(true);
    
    try {
      const uploadPromises = validFiles.map(async (file, index) => {
        const formData = new FormData();
        formData.append('file', file);
        
        // İlk resimse ve hiç resim yoksa ana resim yap
        const isMain = businessImages.length === 0 && index === 0;
        
        formData.append('isMain', isMain);
        formData.append('isProfile', false);
        formData.append('displayOrder', businessImages.length + index);
        
        const response = await fetch('/api/locksmith/profile/image', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error(`${file.name} yüklenirken bir hata oluştu`);
        }
        
        return await response.json();
      });
      
      await Promise.all(uploadPromises);
      
      // Resimler yüklendikten sonra tüm resimleri yeniden yükle
      await fetchBusinessImages();
      showToast(`${validFiles.length} resim başarıyla yüklendi.`, "success");
    } catch (error) {
      console.error('Resim yüklenirken bir hata oluştu:', error);
      showToast("Resimler yüklenirken bir hata oluştu.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto pb-10 px-2">
      <div className="md:hidden sticky top-2 flex justify-between items-center mb-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
        <div className="flex items-center space-x-2">
          <Image src="/logo.png" alt="Bi Çilingir" width={40} height={40} />
          <div>
            <h1 className="text-xl md:text-3xl font-bold">Bi Çilingir</h1>
            <p className="text-sm">Yönetim Paneli</p>
          </div>
        </div>
        <button 
          className="md:hidden p-2 rounded-md bg-blue-50 text-blue-600"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setMobileMenuOpen(!mobileMenuOpen)}
          }
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar - Desktop */}
        <div className={`md:col-span-3 col-span-12 ${mobileMenuOpen ? 'block' : 'hidden md:block'}`}>
          <Card className="sticky top-4">
            <CardContent className="p-0">
              <div className="p-4 border-b">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Beyoğlu Çilingir</h3>
                    <p className="text-sm text-gray-500">Çilingir Paneli</p>
                  </div>
                </div>
              </div>
              <nav className="flex flex-col p-2">
                <button 
                  onClick={() => handleTabChange("dashboard")}
                  className={`flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${activeTab === "dashboard" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Panel</span>
                </button>
                
                <button 
                  onClick={() => handleTabChange("profile")}
                  className={`flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${activeTab === "profile" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Profil Bilgileri</span>
                </button>
                
                <button 
                  onClick={() => handleTabChange("services")}
                  className={`flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${activeTab === "services" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Hizmetlerim</span>
                </button>
                
                <button 
                  onClick={() => handleTabChange("jobs")}
                  className={`flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${activeTab === "jobs" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>Aktivite Geçmişi</span>
                </button>
                
                <button 
                  onClick={() => handleTabChange("reviews")}
                  className={`flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${activeTab === "reviews" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <span>Değerlendirmeler</span>
                </button>
                
                <button 
                  onClick={() => handleTabChange("advertising")}
                  className={`flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${activeTab === "advertising" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  <span>Reklam Yönetimi</span>
                </button>
                
                <button 
                  onClick={() => handleTabChange("settings")}
                  className={`flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${activeTab === "settings" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Hesap Ayarları</span>
                </button>

                <div className="border-t my-2"></div>

                <Link href="/cilingir/auth/login">
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-3 p-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors w-full"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Güvenli Çıkış</span>
                  </button>
                </Link>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="col-span-12 md:col-span-9 mt-4">
          {activeTab === "dashboard" && (
            <Card>
              <CardHeader>
                <CardTitle>Panel</CardTitle>
                <CardDescription>Hesap genel bakış</CardDescription>
              </CardHeader>
              <CardContent>

                {notifications.length > 0 && <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <Card className="col-span-3">
                    <CardHeader className="pb-2">
                      <CardTitle>Bildirimler</CardTitle>
                      <CardDescription>Son bildirimlerinizi buradan takip edebilirsiniz</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                        {notifications.filter(notification => !notification.isdismissed).length === 0 && (
                          <div className="text-center py-8 text-gray-500">
                            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>Hiç bildiriminiz bulunmuyor</p>
                          </div>
                        )}
                        
                        {notifications
                          .filter(notification => !notification.isdismissed)
                          .map(notification => (
                            <div 
                              key={notification.id} 
                              className={`flex items-start p-3 rounded-lg border ${notification.isread ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'}`}
                            >
                              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                                notification.type === 'success' ? 'bg-green-100' : 
                                notification.type === 'warning' ? 'bg-amber-100' : 
                                notification.type === 'error' ? 'bg-red-100' : 'bg-blue-100'
                              }`}>
                                {notification.type === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
                                {notification.type === 'warning' && <AlertTriangle className="h-5 w-5 text-amber-500" />}
                                {notification.type === 'error' && <AlertCircle className="h-5 w-5 text-red-500" />}
                                {notification.type === 'info' && <Info className="h-5 w-5 text-blue-500" />}
                              </div>
                              <div className="flex-grow">
                                <div className="flex justify-between items-start">
                                  <h4 className={`text-sm font-medium ${
                                    notification.type === 'success' ? 'text-green-700' : 
                                    notification.type === 'warning' ? 'text-amber-700' : 
                                    notification.type === 'error' ? 'text-red-700' : 'text-blue-700'
                                  }`}>
                                    {notification.title}
                                  </h4>
                                  <button 
                                    onClick={() => handleDismissNotification(notification.id)}
                                    className="text-gray-400 hover:text-gray-600"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                                <div className="flex justify-between items-center mt-2">
                                  <span className="text-xs text-gray-400">
                                    {new Date(notification.createdat).toLocaleString('tr-TR', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                  {!notification.isread && (
                                    <button 
                                      onClick={() => handleReadNotification(notification.id)}
                                      className="text-xs text-blue-600 hover:text-blue-800"
                                    >
                                      Okundu olarak işaretle
                                    </button>
                                  )}
                                  {notification.link && (
                                    <Link href={notification.link} className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                                      Detaylar
                                    </Link>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>}


                {/* Filter buttons -> Today, Yedterday, last 7 days, last 30 days, All time */}
                <div className="flex justify-start gap-1 mb-4 w-full overflow-x-auto scrollbar-hide scrollbar-thumb-blue-500 scrollbar-track-gray-100">
                  <Button
                  onClick={() => handleDashboardFilterChange("today")}
                  variant="outline"
                  className={`${activeDashboardFilter === "today" ? "bg-blue-500 text-white" : "bg-white text-gray-800"}`}
                  >Bugün</Button>
                  <Button
                  onClick={() => handleDashboardFilterChange("yesterday")}
                  variant="outline"
                  className={`${activeDashboardFilter === "yesterday" ? "bg-blue-500 text-white" : "bg-white text-gray-800"}`}
                  >Dün</Button>
                  <Button
                  onClick={() => handleDashboardFilterChange("last7days")}
                  variant="outline"
                  className={`${activeDashboardFilter === "last7days" ? "bg-blue-500 text-white" : "bg-white text-gray-800"}`}
                  >Son 7 Gün</Button>
                  <Button
                  onClick={() => handleDashboardFilterChange("last30days")}
                  variant="outline"
                  className={`${activeDashboardFilter === "last30days" ? "bg-blue-500 text-white" : "bg-white text-gray-800"}`}
                  >Son 30 Gün</Button>
                  <Button 
                  onClick={() => handleDashboardFilterChange("all")}
                  variant="outline"
                  className={`${activeDashboardFilter === "all" ? "bg-blue-500 text-white" : "bg-white text-gray-800"}`}
                  >Tümü</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Görüntülenme</p>
                          <h3 className="text-3xl font-bold text-gray-800">{dashboardStats.see}</h3>
                          {dashboardStats.see_percent !== 0 && <p className={`text-sm ${dashboardStats.see_percent > 0 ? "text-green-600" : "text-red-600"} mt-2 flex items-center`}>
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            %{dashboardStats.see_percent} {dashboardStats.see_percent > 0 ? "artış" : "azalma"}
                          </p>}
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                      </div>
                      <div className="mt-4 h-1 w-full bg-gray-100 rounded">
                        <div className="h-1 bg-blue-500 rounded" style={{ width: '70%' }}></div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Arama</p>
                          <h3 className="text-3xl font-bold text-gray-800">{dashboardStats.call}</h3>
                          {dashboardStats.call_percent !== 0 && <p className={`text-sm ${dashboardStats.call_percent > 0 ? "text-green-600" : "text-red-600"} mt-2 flex items-center`}>
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            %{dashboardStats.call_percent} {dashboardStats.call_percent > 0 ? "artış" : "azalma"}
                          </p>}
                        </div>
                        <div className="bg-purple-100 p-3 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                      </div>
                      <div className="mt-4 h-1 w-full bg-gray-100 rounded">
                        <div className="h-1 bg-purple-500 rounded" style={{ width: '60%' }}></div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Toplam Profil Ziyareti */}
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Profil Ziyareti</p>
                          <h3 className="text-3xl font-bold text-gray-800">{dashboardStats.visit}</h3>
                          {dashboardStats.visit_percent !== 0 && <p className={`text-sm ${dashboardStats.visit_percent > 0 ? "text-green-600" : "text-red-600"} mt-2 flex items-center`}>
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            %{dashboardStats.visit_percent} {dashboardStats.visit_percent > 0 ? "artış" : "azalma"}
                          </p>}
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                          <Footprints className="h-8 w-8 text-green-600" />
                        </div>
                      </div>
                      <div className="mt-4 h-1 w-full bg-gray-100 rounded">
                        <div className="h-1 bg-green-500 rounded" style={{ width: '80%' }}></div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Yorum</p>
                          <div className="flex items-center">
                            <h3 className="text-3xl font-bold text-gray-800">{dashboardStats.review}</h3>
                          </div>
                          {dashboardStats.review_percent !== 0 && <p className={`text-sm ${dashboardStats.review_percent > 0 ? "text-green-600" : "text-red-600"} mt-2 flex items-center`}>
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            %{dashboardStats.review_percent} {dashboardStats.review_percent > 0 ? "artış" : "azalma"}
                          </p>}
                        </div>  
                        <div className="bg-yellow-100 p-3 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </div>
                      </div>
                      <div className="mt-4 h-1 w-full bg-gray-100 rounded">
                        <div className="h-1 bg-yellow-500 rounded" style={{ width: '95%' }}></div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mb-8">
                  <h4 className="font-medium mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Son İşlemler
                  </h4>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <Card key={index} className="hover:shadow-md transition-all border-l-4" 
                            style={{ borderLeftColor: 
                              activity.type === "search" ? "#3b82f6" : 
                              activity.type === "review" ? "#f59e0b" : 
                              activity.type === "call" ? "#22c55e" :
                              activity.type === "visit" ? "#f97316" : "#3b82f6"
                            }}>
                        <CardContent className="p-4">
                          <div className="flex items-center">
                            <div className={`p-3 rounded-full mr-4 ${
                              activity.type === "search" ? "bg-blue-100 text-blue-600" : 
                              activity.type === "review" ? "bg-yellow-100 text-yellow-600" : 
                              activity.type === "call" ? "bg-green-100 text-green-600" :
                              activity.type === "visit" ? "bg-orange-100 text-orange-600" :
                              "bg-blue-100 text-blue-600"
                            }`}>
                              {activity.type === "search" ? (
                                <Search className="h-6 w-6" />
                              ) : activity.type === "review" ? (
                                <Star className="h-6 w-6" />
                              ) : activity.type === "call" ? (
                                <PhoneCall className="h-6 w-6" />
                              ) : activity.type === "visit" ? (
                                <Footprints className="h-6 w-6" />
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-grow">
                              <div className="flex md:justify-between items-start md:items-center md:flex-row flex-col justify-between">
                                <h5 className="font-medium text-gray-900">{activity.type === "search" ? "Adınız Aramada Listelendi" : activity.type === "review" ? "Bir Müşteri Yorumunuz Var" : activity.type === "call" ? "Bir Arama Alındı" : activity.type === "visit" ? "Profiliniz Ziyaret Edildi" : "Diğer"}</h5>
                                <span className="text-sm text-gray-500 flex items-center md:mt-0 mt-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {activity.date}
                                </span>
                              </div>
                              <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center text-sm text-gray-600">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  {activity.location} - {activity.serviceType}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <Button 
                    onClick={() => {
                      setActiveTab("jobs")
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                      Tüm İşlemleri Görüntüle
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Profil Bilgileri</CardTitle>
                <CardDescription>İşletme bilgilerinizi güncelleyin</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    {businessImages.length > 0 && businessImages[profileImageIndex] ? (
                      <div className="relative w-24 h-24 rounded-full overflow-hidden">
                        <Image 
                          src={businessImages[profileImageIndex].image_url} 
                          alt="İşletme Profil Resmi" 
                          className="object-cover"
                          fill
                          sizes="96px"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm mb-1">İşletme Adı</label>
                      <Input 
                        value={locksmith?.businessname || ""} 
                        onChange={(e) => handleLocksmithDataChange('businessname', e.target.value)} 
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Ad Soyad</label>
                      <Input 
                        value={locksmith?.fullname || ""} 
                        onChange={(e) => handleLocksmithDataChange('fullname', e.target.value)} 
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">E-posta</label>
                      <Input 
                        value={locksmith?.email || ""} 
                        onChange={(e) => handleLocksmithDataChange('email', e.target.value)} 
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Telefon</label>
                      <Input 
                        value={locksmith?.phonenumber || ""} 
                        onChange={(e) => handleLocksmithDataChange('phonenumber', e.target.value)} 
                      />
                    </div>
                    {/* İl - ilçe seçimi */}  
                    <div className="md:col-span-1">
                      <label className="block text-sm mb-1">İl</label>
                      <select 
                        className="w-full p-2 border rounded-md" 
                        onChange={(e) => handleLocksmithDataChange('provinceid', e.target.value)}
                        value={locksmith?.provinceid}
                      >
                        {turkiyeIlIlce.provinces.map((il) => (
                          <option key={il.id} value={il.id}>{il.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-sm mb-1">İlçe</label>
                      <select 
                        className="w-full p-2 border rounded-md" 
                        onChange={(e) => handleLocksmithDataChange('districtid', e.target.value)}
                        value={locksmith?.districtid}
                      >
                        {turkiyeIlIlce.districts.filter(ilce => ilce.province_id === locksmith?.provinceid).map((ilce) => (
                          <option key={ilce.id} value={ilce.id}>{ilce.name}</option>
                        ))}
                      </select>
                    </div>
                    {/*tagline*/}
                    <div className="md:col-span-2">
                      <label className="block text-sm mb-1">Kısa Tanıtım</label>
                      <Input 
                        value={locksmith?.tagline || ""} 
                        onChange={(e) => handleLocksmithDataChange('tagline', e.target.value)} 
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm mb-1">Hakkında</label>
                      <textarea 
                        className="w-full min-h-[100px] p-2 border rounded-md"
                        value={locksmith?.aboutText || ""}
                        onChange={(e) => handleLocksmithDataChange('abouttext', e.target.value)}
                      ></textarea>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 my-6" />

                  {/* Maksimum müşteri sayısı */}
                  <div>
                    <h4 className="font-medium mb-4 mt-6">Bir saat içinde maksimum kaç müşteriye hizmet verebilirsiniz?</h4>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-gray-500">Maksimum müşteri sayısı</p>
                      <Input 
                      className="w-24"
                      type="number" 
                      defaultValue={locksmith?.customerlimitperhour || 0} 
                      onChange={(e) => handleLocksmithDataChange('customerlimitperhour', e.target.value)} 
                      placeholder="Örn: 10" />
                      <p className="text-sm text-gray-500">/saat</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 my-6" />
                  
                  {/* Çalışma Saatleri */}
                  <div>
                    <h4 className="font-medium mb-4 mt-6">Çalışma Saatleri</h4>
                    <div className="space-y-4">
                      { dailyHours.map((day) => (
                        <div key={day.dayofweek} className="flex md:items-center items-start md:flex-row flex-col justify-between border p-3 rounded-md bg-gray-50">
                          <div className="flex items-center space-x-3">
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
                              {day.dayofweek==0 ? "Pazartesi" : day.dayofweek==1 ? "Salı" : day.dayofweek==2 ? "Çarşamba" : day.dayofweek==3 ? "Perşembe" : day.dayofweek==4 ? "Cuma" : day.dayofweek==5 ? "Cumartesi" : "Pazar"}
                            </label>
                          </div>
                          <div className="flex items-center space-x-2 md:mt-0 mt-2">
                            <div className="flex items-center space-x-2 mr-4">
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
                            <span className={`ml-2 text-sm ${day.isworking ? "text-green-600" : "text-red-500"}`}>
                              {day.isworking ? "Açık" : "Kapalı"}
                            </span>
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-end mt-4">
                        <Button 
                          onClick={handleWorkingHoursUpdate}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Çalışma Saatlerini Kaydet
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 my-6" />

                  {/* Sertifikalar */}
                  <div className="mt-6">
                    <h4 className="font-medium mb-4">Sertifikalar</h4>
                    <div className="space-y-4">
                      {/* Sertifika Yükleme Alanı */}

                      <Dialog
                        open={isCertificateDialogOpen}
                        onOpenChange={setIsCertificateDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button>Sertifika Yükle</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Sertifika Yükle</DialogTitle>
                            <DialogDescription>Yeni bir sertifika yüklemek için lütfen dosyayı seçin ve sertifika adını girin.</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <Input type="file" onChange={(e) => {
                              setNewCertificate({ ...newCertificate, file: e.target.files[0] });
                            }} />
                            <Input type="text" placeholder="Sertifika Adı" onChange={(e) => setNewCertificate({ ...newCertificate, name: e.target.value })} />
                          </div>
                          <DialogFooter>
                            <Button onClick={handleAddCertificate}>Yükle</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>


                      {/* Mevcut Sertifikalar */}
                      {certificates.length > 0 ? (
                        <div className="mt-4">
                          <h5 className="font-medium mb-3">Mevcut Sertifikalar ({certificates.length}/5)</h5>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {certificates.map((cert, index) => (
                              <div key={index} className="relative group">
                                <div className="aspect-square overflow-hidden rounded-lg hover:border hover:transition-all hover:duration-100 hover:border-blue-500">
                                  {/* name and Url */}
                                  <div 
                                  onClick={() => handleViewCertificate(cert)}
                                  className="w-full h-full flex items-center justify-center bg-gray-100 border-2 cursor-pointer"
                                  >
                                    <div className="text-center">
                                        <ExternalLinkIcon className="h-10 w-10 text-gray-400" />
                                    </div>
                                  </div>
                                </div>
                                <h3 className="text-sm text-center font-medium">{cert.name}</h3>
                                <button
                                  onClick={() => handleRemoveCertificate(index)}
                                  className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ):(
                      <div className="mt-4">
                        <div className="flex items-center justify-center gap-2">
                          <Info className="h-5 w-5 text-gray-400" />
                          <p className="text-sm text-gray-500">Henüz sertifika yüklemediniz.</p>
                        </div>
                      </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 my-6" />
                  
                  {/* İşletme Fotoğrafları */}
                  <div className="mt-6">
                    <h4 className="font-medium mb-4">İşletme Fotoğrafları</h4>
                    <div className="space-y-4">
                      {/* Fotoğraf Yükleme Alanı */}
                      <div 
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        onDragEnter={(e) => {
                          e.preventDefault();
                          e.currentTarget.classList.add('border-blue-400', 'bg-blue-50');
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault();
                          e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
                        }}
                      >
                        {isUploading ? (
                          <div className="flex flex-col items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-2"></div>
                            <p className="text-gray-500">Yükleniyor...</p>
                          </div>
                        ) : (
                          <label htmlFor="businessImages" className="cursor-pointer flex flex-col items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-gray-500 mb-1">Fotoğrafları buraya sürükleyin veya</p>
                            <Button
                            onClick={() => document.getElementById('businessImages').click()}
                            variant="outline" size="sm" className="mt-2">Dosya Seç</Button>
                            <p className="text-sm text-gray-500 mt-2">En fazla 10 resim, her biri 5MB'dan küçük (JPEG, PNG)</p>
                            <input 
                              id="businessImages" 
                              type="file" 
                              multiple 
                              accept="image/*" 
                              className="hidden"
                              onChange={handleImageUpload}
                            />
                          </label>
                        )}
                      </div>
                      
                      {/* Mevcut Fotoğraflar */}
                      {businessImages.length > 0 ? (
                        <div className="mt-4">
                          <h5 className="font-medium mb-3">Mevcut Fotoğraflar ({businessImages.length}/10)</h5>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {businessImages.map((image, index) => (
                              <div key={image.id} className="relative group">
                                <div className={`relative h-24 w-full overflow-hidden rounded-md ${image.is_main ? 'ring-2 ring-blue-500' : ''}`}>
                                  <Image 
                                    src={image.image_url} 
                                    alt={`İşletme resmi ${index + 1}`} 
                                    className="object-cover"
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                  />
                                </div>
                                <div className="absolute top-1 right-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  {!image.is_main && (
                                    <button 
                                      onClick={() => setMainImage(image.id)}
                                      className="p-1 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors"
                                      title="Ana resim yap"
                                    >
                                      <Star className="h-3 w-3 text-white" />
                                    </button>
                                  )}
                                  <button 
                                    onClick={() => setProfileImage(image.id)}
                                    className={`p-1 ${image.is_profile ? 'bg-green-500' : 'bg-gray-500'} rounded-full hover:bg-green-600 transition-colors`}
                                    title={image.is_profile ? "Profil resmi" : "Profil resmi yap"}
                                  >
                                    <User className="h-3 w-3 text-white" />
                                  </button>
                                  <button 
                                    onClick={() => handleRemoveImage(image.id)}
                                    className="p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                                    title="Sil"
                                  >
                                    <Trash2 className="h-3 w-3 text-white" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ):
                      <div className="mt-4">
                        <div className="flex items-center justify-center gap-2">
                          <Info className="h-5 w-5 text-gray-400" />
                          <p className="text-sm text-gray-500">Henüz fotoğraf yüklemediniz.</p>
                        </div>
                      </div>
                      }
                    </div>
                  </div>
                  

                  <div className="border-t border-gray-200 my-6" />

                  {/* Sosyal Medya Hesapları */}
                  <h4 className="font-medium mb-4 mt-6">Sosyal Medya Hesapları</h4>
                  <div className="space-y-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Instagram */}
                    <div className="pb-6">
                      <div className="flex items-center mb-4">
                        <Instagram className="h-6 w-6 text-pink-600 mr-2" />
                        <h3 className="text-lg font-medium">Instagram</h3>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Input 
                          placeholder="Instagram profil linkiniz" 
                          value={ locksmith?.instagram_url||""}
                          onChange={(e) => handleLocksmithDataChange('instagram_url', e.target.value)}
                          className="flex-grow"
                        />
                      </div>
                    </div>

                    {/* Facebook */}
                    <div className="pb-6">
                      <div className="flex items-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        <h3 className="text-lg font-medium">Facebook</h3>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Input 
                          placeholder="Facebook profil linkiniz" 
                          value={ locksmith?.facebook_url||""}
                          onChange={(e) => handleLocksmithDataChange('facebook_url', e.target.value)}
                          className="flex-grow"
                        />
                      </div>
                    </div>

                    {/* YouTube */}
                    <div className="pb-6">
                      <div className="flex items-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                        <h3 className="text-lg font-medium">YouTube</h3>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Input 
                          placeholder="YouTube profil linkiniz" 
                          value={ locksmith?.youtube_url||""}
                          onChange={(e) => handleLocksmithDataChange('youtube_url', e.target.value)}
                          className="flex-grow"
                        />
                      </div>
                    </div>

                    {/* TikTok */}
                    <div className="pb-6">
                      <div className="flex items-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                        </svg>
                        <h3 className="text-lg font-medium">TikTok</h3>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Input 
                          placeholder="TikTok profil linkiniz" 
                          value={ locksmith?.tiktok_url||""}
                          onChange={(e) => handleLocksmithDataChange('tiktok_url', e.target.value)}
                          className="flex-grow"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      onClick={()=> handleUpdateLocksmithData()}
                    >Değişiklikleri Kaydet</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "services" && (
            <Card>
              <CardHeader>
                <CardTitle>Hizmetlerim</CardTitle>
                <CardDescription>Sunduğunuz hizmetleri yönetin ve varsayılan hizmet fiyatlandırmasını görebilirsiniz</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  {serviceList.map((service, index) => (
                    <Card key={index} className={`mb-4 overflow-hidden transition-all duration-200 hover:shadow-md border ${activeServices.includes(service.id) ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
                      <CardContent className="p-0">
                        <div className="flex flex-col">
                          {/* Başlık ve Checkbox Kısmı */}
                          <div className="flex items-center p-4 border-b border-gray-100">
                            <Checkbox 
                              id={`service-${service.id}`} 
                              checked={activeServices.includes(service.id)}
                              onCheckedChange={(checked) => handleServiceActiveChange(service.id, checked)}
                              className="mr-3 h-5 w-5"
                            />
                            <label 
                              htmlFor={`service-${service.id}`} 
                              className={`font-medium text-lg ${activeServices.includes(service.id) ? 'text-blue-700' : 'text-gray-500'}`}
                            >
                              {service.name}
                            </label>
                            
                            {!activeServices.includes(service.id) && (
                              <span className="ml-auto text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-600">Aktif Değil</span>
                            )}
                            
                            {activeServices.includes(service.id) && (
                              <span className="ml-auto text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600">Aktif</span>
                            )}
                          </div>
                          
                          {/* Fiyat Bilgileri */}
                          <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 ${activeServices.includes(service.id) ? 'opacity-100' : 'opacity-70'}`}>
                            {/* Mesai Tarifesi */}
                            <div className="flex flex-col p-3 rounded-lg bg-white shadow-sm">
                              <div className="flex items-center mb-2">
                                <Clock className="h-4 w-4 mr-2 text-blue-500" />
                                <span className="text-sm font-medium text-gray-700">Mesai Saatleri</span>
                              </div>
                              <div className="text-center">
                                <span className="text-xl font-bold text-gray-800">{service.minPriceMesai} - {service.maxPriceMesai} ₺</span>
                              </div>
                            </div>
                            
                            {/* Akşam Tarifesi */}
                            <div className="flex flex-col p-3 rounded-lg bg-white shadow-sm">
                              <div className="flex items-center mb-2">
                                <Clock className="h-4 w-4 mr-2 text-orange-500" />
                                <span className="text-sm font-medium text-gray-700">Akşam Saatleri</span>
                              </div>
                              <div className="text-center">
                                <span className="text-xl font-bold text-gray-800">{service.minPriceAksam} - {service.maxPriceAksam} ₺</span>
                              </div>
                            </div>
                            
                            {/* Gece Tarifesi */}
                            <div className="flex flex-col p-3 rounded-lg bg-white shadow-sm">
                              <div className="flex items-center mb-2">
                                <Clock className="h-4 w-4 mr-2 text-indigo-500" />
                                <span className="text-sm font-medium text-gray-700">Gece Saatleri</span>
                              </div>
                              <div className="text-center">
                                <span className="text-xl font-bold text-gray-800">{service.minPriceGece} - {service.maxPriceGece} ₺</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Bilgi Notu */}
                          <div className="bg-gray-50 p-3 text-xs text-gray-500 flex items-center border-t border-gray-100">
                            <Info className="h-4 w-4 mr-2 text-gray-400" />
                            <span>Fiyatlandırma tarifesi tarafından belirlenen varsayılan değerlerdir ve değiştirilemez.</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="flex justify-start">
                  <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white">
                    Değişiklikleri Kaydet
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "jobs" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Platform Aktivitelerim
                </CardTitle>
                <CardDescription>Görüntülenmeler, çağrılar ve değerlendirmelerinizi görüntüleyin</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex space-x-2 w-full overflow-x-auto scrollbar-hide ">
                    <Button variant="outline" className={`${activeFilter === 'all' ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}`} onClick={() => setActiveFilter('all')}>Tümü</Button>
                    <Button variant="outline" className={`${activeFilter === 'views' ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}`} onClick={() => setActiveFilter('views')}>Görüntülenmeler</Button>
                    <Button variant="outline" className={`${activeFilter === 'calls' ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}`} onClick={() => setActiveFilter('calls')}>Çağrılar</Button>
                    <Button variant="outline" className={`${activeFilter === 'reviews' ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}`} onClick={() => setActiveReviewFilter('reviews')}>Değerlendirmeler</Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {[
                    {
                      type: 'view',
                      title: 'Bir Aramada Görüntülendiniz',
                      description: 'Oto Çilingir hizmeti aramasında profiliniz görüntülendi',
                      location: 'Gemlik',
                      service: 'Oto Çilingir',
                      date: '15 Mart 2024, 15:30',
                      icon: <Eye className="h-6 w-6" />,
                      color: 'blue'
                    },
                    {
                      type: 'visit',
                      title: 'Profiliniz Ziyaret Edildi',
                      description: 'Oto Çilingir hizmeti aramasında profiliniz ziyaret edildi',
                      location: 'Osmangazi',
                      service: 'Oto Çilingir',
                      date: '15 Mart 2024, 15:30',
                      icon: <Footprints className="h-6 w-6" />,
                      color: 'orange'
                    },
                    {
                      type: 'call',
                      title: 'Bir Arama Aldınız',
                      description: 'Müşteri, Kilit Değiştirme hizmeti için sizi aradı',
                      location: 'Beşiktaş',
                      service: 'Kilit Değiştirme',
                      date: '15 Mart 2024, 14:20',
                      icon: <PhoneCall className="h-6 w-6" />,
                      color: 'green'
                    },
                    {
                      type: 'review',
                      title: 'Bir Değerlendirme Aldınız',
                      description: '5 üzerinden 5 yıldız aldınız: "Zamanında geldi, çok profesyonel"',
                      location: 'Kadıköy',
                      service: 'Kapı Açma',
                      date: '14 Mart 2024, 11:45',
                      icon: <Star className="h-6 w-6" />,
                      color: 'yellow'
                    },
                    {
                      type: 'view',
                      title: 'Bir Aramada Görüntülendiniz',
                      description: 'Kapı Açma hizmeti aramasında profiliniz görüntülendi',
                      location: 'Üsküdar',
                      service: 'Kapı Açma',
                      date: '13 Mart 2024, 18:10',
                      icon: <Eye className="h-6 w-6" />,
                      color: 'blue'
                    },
                    {
                      type: 'call',
                      title: 'Bir Arama Aldınız',
                      description: 'Müşteri, Anahtar Kopyalama hizmeti için sizi aradı',
                      location: 'Şişli',
                      service: 'Anahtar Kopyalama',
                      date: '13 Mart 2024, 15:35',
                      icon: <PhoneCall className="h-6 w-6" />,
                      color: 'green'
                    },
                    {
                      type: 'review',
                      title: 'Bir Değerlendirme Aldınız',
                      description: '5 üzerinden 4 yıldız aldınız: "İyi hizmet, teşekkürler"',
                      location: 'Beylikdüzü',
                      service: 'Çelik Kapı Açma',
                      date: '12 Mart 2024, 20:15',
                      icon: <Star className="h-6 w-6" />,
                      color: 'yellow'
                    },
                    {
                      type: 'view',
                      title: 'Bir Aramada Görüntülendiniz',
                      description: 'Kasa Açma hizmeti aramasında profiliniz görüntülendi',
                      location: 'Bakırköy',
                      service: 'Kasa Açma',
                      date: '11 Mart 2024, 14:40',
                      icon: <Eye className="h-6 w-6" />,
                      color: 'blue'
                    },
                    {
                      type: 'call',
                      title: 'Bir Arama Aldınız',
                      description: 'Müşteri, Kapı Açma hizmeti için sizi aradı',
                      location: 'Mecidiyeköy',
                      service: 'Kapı Açma',
                      date: '10 Mart 2024, 09:25',
                      icon: <PhoneCall className="h-6 w-6" />,
                      color: 'green'
                    }
                  ].map((activity, index) => (
                    <Card key={index} className="hover:shadow-md transition-all border-l-4" 
                          style={{ borderLeftColor: activity.color === "blue" ? "#3b82f6" : activity.color === "yellow" ? "#f59e0b" : activity.color === "orange" ? "#f97316" : "#22c55e" }}>
                      <CardContent className="p-4">
                        <div className="flex items-start">
                          <div className={`p-3 rounded-full mr-4 flex-shrink-0 ${
                            activity.color === "blue" ? "bg-blue-100 text-blue-600" : 
                            activity.color === "yellow" ? "bg-yellow-100 text-yellow-600" : 
                            activity.color === "orange" ? "bg-orange-100 text-orange-600" : 
                            "bg-green-100 text-green-600"
                          }`}>
                            {activity.icon}
                          </div>
                          <div className="flex-grow">
                            <div className="flex md:flex-row flex-col justify-between items-start">
                              <div>
                                <h5 className="font-medium text-gray-900">{activity.title}</h5>
                                <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                              </div>
                              <span className="text-sm text-gray-500 flex items-center md:mt-0 mt-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {activity.date}
                              </span>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center text-sm text-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {activity.location} - {activity.service}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="flex justify-between items-center mt-6">
                  <p className="text-sm text-gray-500">10 aktivite gösteriliyor</p>
                  <div className="flex items-center">
                    <span className="mr-4 text-sm">Sayfa 1 / 15</span>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Önceki</Button>
                      <Button variant="outline" size="sm">Sonraki</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "reviews" && (
            <Card>
              <CardHeader>
                <CardTitle>Değerlendirmeler</CardTitle>
                <CardDescription>Müşteri değerlendirmelerinizi görüntüleyin</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold">4.8</div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-5 h-5 ${i < 5 ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                        ))}
                      </div>
                      <div className="text-sm text-gray-500">124 değerlendirme</div>
                    </div>
                    
                    <div className="flex-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-2 mb-1">
                          <div className="text-sm w-2">{5-i}</div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-yellow-400 h-2 rounded-full" 
                              style={{ width: `${i === 0 ? 70 : i === 1 ? 20 : i === 2 ? 5 : i === 3 ? 3 : 2}%` }}
                            ></div>
                          </div>
                          <div className="text-sm text-gray-500">
                            {i === 0 ? 70 : i === 1 ? 20 : i === 2 ? 5 : i === 3 ? 3 : 2}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Yıldız Filtreleme Butonları */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <button 
                      className={`flex items-center space-x-1 border border-gray-200 hover:bg-blue-50 hover:border-blue-200 rounded-lg px-3 py-1.5 transition-colors ${activeReviewFilter === "all" ? "bg-blue-50 border-blue-200" : ""}`}
                      onClick={() => setActiveReviewFilter("all")}
                    >
                      Tümü
                    </button>
                    {[5, 4, 3, 2, 1].map((star) => (
                      <button 
                        key={star}
                        className={`flex items-center space-x-1 border border-gray-200 hover:bg-blue-50 hover:border-blue-200 rounded-lg px-3 py-1.5 transition-colors ${activeReviewFilter === star.toString() ? "bg-blue-50 border-blue-200" : ""}`}
                        onClick={() => setActiveReviewFilter(star.toString())}
                      >
                        <span className="font-medium">{star}</span>
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-6 h-42">
                  { reviews.length === 0 && (
                      <div className="text-center text-gray-500">
                        <p>Henüz değerlendirme yapılmamış</p>
                      </div>)
                  }

                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                          <div>
                            <p className="font-medium">{review.userName}</p>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} className={`w-4 h-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                </svg>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">{review.createdAt.split(' ')[0]}</div>
                      </div>
                      <p className="text-gray-700">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-6">
                  <p className="text-sm text-gray-500">10 yorum gösteriliyor</p>
                  <div className="flex items-center">
                    <span className="mr-4 text-sm">Sayfa 1 / 1</span>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Önceki</Button>
                      <Button variant="outline" size="sm">Sonraki</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "advertising" && (
            <Card>
              <CardHeader>
                <CardTitle>Reklam Yönetimi</CardTitle>
                <CardDescription>Anahtar paketleri ve reklam ayarlarınızı yönetin</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Mevcut Anahtar Bakiyesi */}
                <div className="mb-8">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Anahtar Bakiyeniz</h3>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                      <span className="text-3xl font-bold text-blue-600"> {keyBalance} Anahtar</span>
                    </div>
                    <div className="flex items-center ml-2 mt-2 text-gray-600">
                      <Info className="w-4 h-4 mr-2"/>
                      <p className="text-sm">Tahmini anahtar bitiş tarihi: 10.04.2025</p> 
                    </div>
                  </div>
                </div>

                {/* Anahtar Paketleri */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Anahtar Paketleri</h3>
                  <p className="text-sm text-gray-500 mb-4">Öne çıkartma anahtarları ile müşterilerinizin sizlere daha çok ulaşmasını sağlayabilirsiniz.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {
                      keyPackages.length === 0 && (
                        <div className="text-center text-gray-500 h-full w-full flex items-center justify-center">
                          <p>Anahtar paketleri yükleniyor...</p>
                        </div>
                      )
                    }
                    {keyPackages.map((pkg) => (
                      <div key={pkg.id} className={`border flex flex-col justify-between rounded-lg p-4 hover:shadow-md transition-shadow relative ${pkg.isRecommended ? 'border-blue-500 border-2' : ''}`}>
                        {pkg.isRecommended && (
                          <div className="absolute -top-3 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                            Popüler Seçim
                          </div>
                        )}
                        <div className="text-center mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-blue-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                          </svg>
                          <h4 className="font-bold text-lg">{pkg.keyAmount} Anahtar</h4>
                          <p className="text-lg font-semibold text-gray-900">{pkg.name}</p>
                          <p className="text-sm text-gray-600">{pkg.description}</p>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={`font-bold text-lg ${pkg.isRecommended ? 'text-blue-600' : ''}`}>{pkg.price} ₺</span>
                          <Button 
                          onClick={() => handlePackagePurchase(pkg.id)}
                          variant={pkg.isRecommended ? "default" : "outline"} 
                          className={pkg.isRecommended ? "bg-blue-600 hover:bg-blue-700" : ""}
                          size="sm">Satın Al</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Günlük Anahtar Kullanım Tercihleri */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Günlük Anahtar Kullanım Tercihleriniz</h3>
                  <p className="text-sm text-gray-500 mb-4 flex items-center"><Info className="w-4 h-4 mr-2"/> Tahmini Aylık Anahtar Kullanımı: {Object.values(dailyKeys).reduce((sum, day) => sum + (4*day.key || 0), 0)} Anahtar</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(dailyKeys).map(([day, _]) => (
                      <div key={day} className="border rounded-lg p-4 bg-gray-10">
                        <label className="block text-md font-bold text-gray-700 mb-2">{day}</label>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id={`adday-${day}`} 
                            checked={dailyKeys[day].isOpen}
                            onCheckedChange={(checked) => {
                              setDailyKeys(prev => ({
                                ...prev,
                                [day]: { ...prev[day], isOpen: !!checked }
                              }));
                            }}
                          />
                          <label 
                            htmlFor={`adday-${day}`} 
                            className={`font-medium ${!dailyKeys[day].isOpen ? "text-gray-400" : ""}`}
                          >
                            Reklam Açık
                          </label>
                        </div>
                        <div className="flex items-center space-x-2 md:mt-2 mt-2">
                          <label className={`font-medium ${!dailyKeys[day].isOpen ? "text-gray-400" : ""}`}>
                            Günlük Anahtar:
                          </label>
                          <Input 
                            type="number"
                            min="1"
                            max="100"
                            value={dailyKeys[day].key || 10}
                            onChange={(e) => handleDailyKeyChange(day, parseInt(e.target.value))}
                            disabled={!dailyKeys[day].isOpen}
                            className={`w-20 ${!dailyKeys[day].isOpen ? "bg-gray-100 text-gray-400" : ""}`}
                          />
                          <span className={`ml-2 text-sm ${dailyKeys[day].isOpen ? "text-green-600" : "text-red-500"}`}>
                            {dailyKeys[day].isOpen ? "Reklam Açık" : "Reklam Kapalı"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>


                  <div className="mt-6">
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      Değişiklikleri Kaydet
                    </Button>
                  </div>
                  
                {/* Anahtar Kullanım Geçmişi */}
                <div className="my-8">
                  <div className="flex items-center mb-4">
                    <Clock className="h-6 w-6 text-blue-600 mr-2" />
                    <h3 className="text-xl font-bold text-gray-800">Anahtar Kullanım Geçmişi</h3>
                  </div>
                  <div className="bg-white shadow-sm rounded-lg border border-gray-100">
                    {keyUsageHistory.length === 0 ? (
                      <div className="p-6 text-center text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                        <p>Henüz anahtar kullanım geçmişiniz bulunmamaktadır.</p>
                      </div>
                    ) : (
                      <ul className="divide-y divide-gray-100">
                        {keyUsageHistory.map((activity) => (
                          <li key={activity.id} className="flex items-center p-4 hover:bg-blue-50 transition-colors">
                            <div className="flex-shrink-0 mr-4">
                              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">{activity.activite}</p>
                              <p className="text-sm text-gray-500">{activity.date}</p>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-blue-600">
                              {activity.keyUsage} Anahtar
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                    {keyUsageHistory.length > 0 && (
                      <div className="px-4 py-3 bg-gray-50 text-right rounded-b-lg">
                        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                          Tüm Geçmişi Görüntüle
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "settings" && (
            <Card>
              <CardHeader>
                <CardTitle>Hesap Ayarları</CardTitle>
                <CardDescription>Hesap ayarlarınızı güncelleyin</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-4">Şifre Değiştir</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm mb-1">Mevcut Şifre</label>
                        <Input 
                          type="password"
                          value={passwordForm.currentPassword}
                          onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Yeni Şifre</label>
                        <Input 
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Yeni Şifre (Tekrar)</label>
                        <Input 
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                        />
                      </div>
                      <Button onClick={() => {
                        if (passwordForm.newPassword === passwordForm.confirmPassword) {
                          showToast("Şifre başarıyla güncellendi", "success");
                        } else {
                          showToast("Şifreler eşleşmiyor", "error");
                        }
                      }}>Şifreyi Güncelle</Button>
                    </div>
                  </div>
                
                  
                  <div className="border-t pt-6">
                    <h4 className="font-medium mb-4">Hesap Durumu</h4>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-500">
                        Hesabınızı devre dışı bırakırsanız, profiliniz ve hizmetleriniz platformda görünmeyecektir.
                      </p>
                      <Button
                      variant="destructive"
                      >Hesabımı Kapat</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Anahtar Paketi Satın Alma Modalı */}
      <Dialog open={isPackageModalOpen} onOpenChange={setIsPackageModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Anahtar Paketi Satın Al</DialogTitle>
            <DialogDescription>
              Aşağıdaki bilgileri inceleyip satın alma talebinizi oluşturabilirsiniz.
            </DialogDescription>
          </DialogHeader>
          
          {selectedPackage && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-between">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-lg text-gray-900">{selectedPackage.keyAmount} Anahtar</h4>
                    <p className="text-sm text-gray-600">Paket No: #{selectedPackage.id}</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-blue-700">{selectedPackage.price} ₺</span>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Satın Alma Notu (İsteğe Bağlı)</label>
                <Textarea 
                  value={purchaseNote} 
                  onChange={(e) => setPurchaseNote(e.target.value)}
                  placeholder="Yöneticiye satın alma işlemi hakkında iletmek istediğiniz bir not yazabilirsiniz."
                  className="w-full"
                />
              </div>
              
              <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg flex items-start space-x-2">
                <Info className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <p>Satın alma işleminiz site yöneticisi tarafından onaylandıktan sonra anahtar bakiyenize eklenecektir. Size e-posta ile bilgilendirme yapılacaktır.</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPackageModalOpen(false)}
              disabled={isPurchasePending}
            >
              İptal
            </Button>
            <Button 
              onClick={handlePurchaseSubmit}
              disabled={isPurchasePending}
              className="relative"
            >
              {isPurchasePending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  İşleniyor...
                </>
              ) : (
                'Satın Alma Talebi Oluştur'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Resmi Sil</h3>
            <p className="text-gray-600 mb-6">Bu resmi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.</p>
            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={cancelDeleteImage}
              >
                İptal
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmDeleteImage}
              >
                Evet, Sil
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CilingirPanel() {
  const { isAuthenticated, role, loading } = useSelector(state => state.auth);
  const router = useRouter();

  useEffect(() => {
    // Oturum açılmamışsa veya yetkili rol değilse login sayfasına yönlendir
    if (!loading && (!isAuthenticated || (role !== 'cilingir' && role !== 'admin'))) {
      router.push('/cilingir/auth/login');
    }
  }, [isAuthenticated, role, loading, router]);
  
  // Yükleniyor veya yetki kontrolü
  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Yükleniyor...</h2>
          <p className="text-gray-500">Lütfen bekleyin, çilingir paneli hazırlanıyor.</p>
        </div>
      </div>
    );
  }
  
  // Yetki kontrolü
  if (role !== 'cilingir' && role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Erişim Engellendi</h2>
          <p className="text-gray-500">Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
          <Button 
            onClick={() => router.push('/cilingir/auth/login')}
            className="mt-4"
          >
            Giriş Sayfasına Dön
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Yükleniyor...</h2>
          <p className="text-gray-500">Lütfen bekleyin, çilingir paneli hazırlanıyor.</p>
        </div>
      </div>
    }>
      <CilingirPanelContent />
    </Suspense>
  );
} 