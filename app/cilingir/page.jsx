"use client";

import { useState, useEffect, Suspense, useRef, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Checkbox } from "../../components/ui/checkbox";
import { Info, Phone, Star, Eye, PhoneCall, Instagram, Menu, X, Footprints, File, ExternalLinkIcon, Clock, Search, CheckCircle, AlertTriangle, AlertCircle, Bell, User, Trash2, MessageCircle, Globe, MapPin, Key, ShoppingCart, Mail } from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover"
import { useSelector, useDispatch } from "react-redux";
import { getSupabaseClient } from "../../lib/supabase";
import { formatPhoneNumber } from "../../lib/utils";
// import { formatPhoneNumber, ColorPicker, EmojiPicker, TiptapToolbar } from "../../lib/utils";
import { checkAuthState } from "../../redux/features/authSlice";
import { AiAssistButton } from "../../components/ui/ai-assist-button";
import { TiptapEditor } from "../../components/ui/tiptap-editor";
import SubscriptionPackages from "../../components/ui/subscription-packages";
import { useJsApiLoader, GoogleMap, Marker, Autocomplete } from '@react-google-maps/api';


export default function CilingirPanel() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, role, isAuthenticated, loading } = useSelector(state => state.auth);


  // Kimlik doğrulama durumunu kontrol et
  useEffect(() => {
    dispatch(checkAuthState())
      .then((action) => {
        if (action.meta.requestStatus === 'fulfilled' && !action.payload) {
          router.push('/cilingir/auth/login');
        }
      })
      .catch(err => {
        console.error("Auth durum kontrolü hatası:", err);
        router.push('/cilingir/auth/login');
      });
  }, [dispatch, router]);

  // Oturum durumu değişince kontrol et
  useEffect(() => {
    // Oturum açılmamışsa veya yetkili rol değilse login sayfasına yönlendir
    if (!loading && (!isAuthenticated || (role !== 'cilingir' && role !== 'admin'))) {
      router.push('/cilingir/auth/login');
    }
  }, [isAuthenticated, role, loading, router]);

  // Yükleniyor veya yetki kontrolü
  if (loading || (role !== 'cilingir' && role !== 'admin')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Yükleniyor...</h2>
          <p className="text-gray-500">Lütfen bekleyin, çilingir paneli hazırlanıyor.</p>
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

function CilingirPanelContent() {
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get('tab');

  const [districts, setDistricts] = useState([]);
  const [provinces, setProvinces] = useState([]);
  // Anahtar paketleri için state
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [purchaseNote, setPurchaseNote] = useState("");
  const [isPurchasePending, setIsPurchasePending] = useState(false);
  const [profileImageIndex, setProfileImageIndex] = useState(0);
  const [isUpdatingServices, setIsUpdatingServices] = useState(false);

  const [isUpdatingDistricts, setIsUpdatingDistricts] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [serviceDistricts, setServiceDistricts] = useState([]);

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isWorkingHoursUpdating, setIsWorkingHoursUpdating] = useState(false);
  const [isToggleStatusAccountLoading, setIsToggleStatusAccountLoading] = useState(false);
  const [isToggleStatusAccountModalOpen, setIsToggleStatusAccountModalOpen] = useState(false);
  const [isActivitiesLoading, setIsActivitiesLoading] = useState(false);
  const [isActivitiesNextPageLoading, setIsActivitiesNextPageLoading] = useState(false);
  const [isActivitiesPreviousPageLoading, setIsActivitiesPreviousPageLoading] = useState(false);
  const [totalPagesActivities, setTotalPagesActivities] = useState(1);
  const [currentPageActivities, setCurrentPageActivities] = useState(1);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);

  const [isLoadingAi, setIsLoadingAi] = useState({
    tagline: false,
    hakkinda: false
  });

  const [provinceChanged, setProvinceChanged] = useState(false);

  const [activeTab, setActiveTab] = useState(tabParam || "dashboard");
  const [isCertificateDialogOpen, setIsCertificateDialogOpen] = useState(false);
  // const [reviews, setReviews] = useState([]);
  const [activityList, setActivityList] = useState([]);
  const [activeReviewFilter, setActiveReviewFilter] = useState("all");
  const [reviewStats, setReviewStats] = useState({});
  const [reviewList, setReviewList] = useState([]);
  const [totalPagesReviews, setTotalPagesReviews] = useState(1);
  const [currentPageReviews, setCurrentPageReviews] = useState(1);
  const [isReviewLoading, setIsReviewLoading] = useState(false);
  const [isReviewNextPageLoading, setIsReviewNextPageLoading] = useState(false);
  const [isReviewPreviousPageLoading, setIsReviewPreviousPageLoading] = useState(false);


  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [locksmith, setLocksmith] = useState({
    abouttext: "",
    avgrating: 0,
    businessname: "",
    certificates: [],
    customerlimitperhour: 0,
    districtid: 0,
    provinceid: 0,
    documents: [],
    email: "",
    whatsappnumber: "",
    phonenumber: "",
    fulladdress: "",
    fullname: "",
    isactive: "",
    isemailverified: "",
    isphoneverified: "",
    isverified: "",
    profileimageurl: "",
    instagram_url: "",
    facebook_url: "",
    tiktok_url: "",
    youtube_url: "",
    status: "",
    tagline: "",
    taxnumber: "",
    totalreviewcount: 0,
    averageRating: 0,
    websiteurl: "",
    lat: null,
    lng: null
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
    whatsapp: 0,
    whatsapp_percent: 0,
    website_visit: 0,
    website_visit_percent: 0,
  });

  const [notificationOpen, setNotificationOpen] = useState(false);

  const [isClient, setIsClient] = useState(false); // Client render kontrolü için state

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Tiptap editörünü başlat - Kaldırıldı, artık TiptapEditor bileşeni kullanılıyor

  const fetchActivities = async () => {
    handleDashboardFilterChange('today', 1);
  };

  const fetchReviews = async () => {
    handleReviewFilter('all', 1);
  };

  const handleReviewFilter = async (filter, page = 1) => {
    setActiveReviewFilter(filter);
    try {
      setIsReviewLoading(true);
      const response = await fetch(`/api/locksmith/reviews?filter=${filter}&page=${page}`,
        {
          credentials: 'include',
        }
      );
      const data = await response.json();
      setReviewStats(data.stats);
      setReviewList(data.reviews);
      setCurrentPageReviews(data.currentPage);
      setTotalPagesReviews(data.totalPages);
    } catch (error) {
      console.error("Review filtresi alınırken hata:", error);
      showToast("İstatistikler alınırken bir hata oluştu", "error");
    } finally {
      setIsReviewLoading(false);
      setIsReviewNextPageLoading(false);
      setIsReviewPreviousPageLoading(false);
    }
  };


  const handleDashboardFilterChange = async (filter, page = 1) => {
    setActiveDashboardFilter(filter);
    try {
      setIsActivitiesLoading(true);
      const response = await fetch(`/api/locksmith/dashboard/activity?period=${filter}&page=${page}`,
        {
          credentials: 'include',
        }
      );
      const data = await response.json();
      setDashboardStats(data.stats);
      setActivityList(data.list);
      setCurrentPageActivities(data.currentPage);

      setTotalPagesActivities(data.totalPages);
      setCurrentPageActivities(data.currentPage);
    } catch (error) {
      console.error("Dashboard verisi güncellenirken hata:", error);
      showToast("İstatistikler alınırken bir hata oluştu", "error");
    } finally {
      setIsActivitiesLoading(false);
      setIsActivitiesNextPageLoading(false);
      setIsActivitiesPreviousPageLoading(false);
    }

  };


  const handleLogout = () => {
    setIsLogoutLoading(true);
    const supabase = getSupabaseClient();
    supabase.auth.signOut();
    router.push('/cilingir/auth/login');
    setIsLogoutLoading(false);
  };


  const handleToggleStatusAccount = async () => {
    setIsToggleStatusAccountLoading(true);
    const response = await fetch('/api/locksmith/account/status', {
      method: 'PUT',
      credentials: 'include',
    });

    const data = await response.json();

    if (data.success) {
      showToast("Hesabınız başarıyla güncellendi", "success");
      setLocksmith(prev => ({
        ...prev,
        isactive: !prev.isactive
      }));
    } else {
      showToast("Hesabınız güncellenirken bir hata oluştu", "error");
    }
    setIsToggleStatusAccountModalOpen(false)
    setIsToggleStatusAccountLoading(false);
  };

  const [serviceList, setServiceList] = useState([]);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/locksmith/profile/active-services', {
        credentials: 'include'
      });

      if (!response.ok) {
        console.error('Aktif hizmetler getirilirken bir hata oluştu:', response.statusText);
        showToast("Hizmet listesi yüklenirken bir hata oluştu", "error");
        return;
      }

      const data = await response.json();

      if (data.error) {
        console.error('Aktif hizmet hatası:', data.error);
        showToast("Hizmet listesi yüklenirken bir hata oluştu", "error");
        return;
      }

      setServiceList(data.services || []);

    } catch (error) {
      console.error('Aktif hizmetler getirilirken bir hata oluştu:', error);
      showToast("Hizmet listesi yüklenirken bir hata oluştu", "error");
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

  const fetchProvinces = async () => {
    const response = await fetch('/api/public/provinces');
    const data = await response.json();
    setProvinces(data.provinces);
  };

  const fetchDistricts = async (provinceId) => {
    try {
      // Eğer il ID'si belirtilmemişse ve locksmith'in il değeri varsa, onu kullan
      const selectedProvinceId = provinceId || (locksmith && locksmith.provinceid);

      if (!selectedProvinceId) {
        // İl ID'si yoksa tüm ilçeleri getir
        const response = await fetch('/api/public/districts');
        const data = await response.json();
        setDistricts(data.districts || []);
      } else {
        // Belirli bir il için ilçeleri getir
        const response = await fetch(`/api/public/districts?province_id=${selectedProvinceId}`);
        const data = await response.json();
        setDistricts(data.districts || []);
      }
    } catch (error) {
      console.error('İlçe listesi getirilirken bir hata oluştu:', error);
      showToast("İlçe listesi yüklenirken bir hata oluştu", "error");
    }
  };



  useEffect(() => {
    Promise.all([
      fetchLocksmith(),
      fetchDailyHours(),
      fetchActivities(),
      fetchReviews(),
      fetchNotifications(),
      fetchServices(),
      fetchProvinces(),
      fetchDistricts(),
      fetchBusinessImages(),
      fetchServiceDistricts(),
      fetchCertificates(), // Sertifikaları getir
    ]);
  }, []);


  const [businessImages, setBusinessImages] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [deleteImageId, setDeleteImageId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);



  const [certificates, setCertificates] = useState([]);
  const [certificateToDelete, setCertificateToDelete] = useState(null);
  const [isDeleteCertificateModalOpen, setIsDeleteCertificateModalOpen] = useState(false);
  const [isUploadingCertificate, setIsUploadingCertificate] = useState(false);
  const [isDeletingCertificate, setIsDeletingCertificate] = useState(false);
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

  const handleServiceActiveChange = async (serviceId, isActive) => {
    //fetch burada değil, buton ile yapılacak.
    //Sadece state güncellenecek.

    setServiceList(prev => prev.map(service =>
      service.id === serviceId ? { ...service, isLocksmithActive: isActive } : service
    ));
  };

  const handleUpdateServices = async () => {
    setIsUpdatingServices(true);
    const serviceIds = serviceList.map(service => ({
      serviceid: service.id,
      isactive: service.isLocksmithActive
    }));
    //supabase ile güncelle
    const response = await fetch(`/api/locksmith/profile/active-services`, {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify({ serviceIds })
    });

    if (!response.ok) {
      showToast('Hizmetler güncellenirken bir hata oluştu', 'error');
      console.error('Hizmet güncellenirken bir hata oluştu');
    } else {
      showToast('Hizmetler başarıyla güncellendi', 'success');
    }
    setIsUpdatingServices(false);
  };

  const fetchServiceDistricts = async () => {
    setIsLoadingLocation(true);
    const response = await fetch('/api/locksmith/districts', {
      credentials: 'include'
    });
    const data = await response.json();
    setServiceDistricts(data.districts);
    setIsLoadingLocation(false);
  };


  const handleDistrictActiveChange = async (districtId, type, isActive) => {
    setServiceDistricts(prev => prev.map(district =>
      district.id === districtId
        ? isActive
          ? { ...district, isDayActive: true, isNightActive: true }
          : {
            ...district,
            [type === 'day' ? 'isDayActive' : 'isNightActive']: false
          }
        : district
    ));
  };

  const handleUpdateDistricts = async () => {
    setIsUpdatingDistricts(true);
    const districtIds = serviceDistricts.map(district => ({
      districtid: district.id,
      provinceid: district.province_id,
      isdayactive: district.isDayActive || false,
      isnightactive: district.isNightActive || false
    }));

    //supabase ile güncelle
    const response = await fetch(`/api/locksmith/districts`, {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify({ districtIds })
    });

    if (!response.ok) {
      console.error('İlçe güncellenirken bir hata oluştu');
    } else {
      showToast('İlçeler başarıyla güncellendi', 'success');
    }
    setIsUpdatingDistricts(false);
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




  const handleAddCertificate = async () => {
    if (!newCertificate.name || !newCertificate.file) {
      showToast('Lütfen sertifika adı ve dosyasını seçin', 'warning');
      return;
    }

    setIsUploadingCertificate(true);

    try {
      // Dosya boyutunu kontrol et (5MB)
      if (newCertificate.file.size > 5 * 1024 * 1024) {
        showToast('Dosya boyutu 5MB\'dan büyük olamaz', 'error');
        setIsUploadingCertificate(false);
        return;
      }

      // Dosya türünü kontrol et
      if (!newCertificate.file.type.startsWith('image/') && !newCertificate.file.type.startsWith('application/pdf')) {
        showToast('Yalnızca resim veya PDF formatında sertifika yükleyebilirsiniz', 'error');
        setIsUploadingCertificate(false);
        return;
      }

      // Sertifika sayısı kontrolü
      if (certificates.length >= 5) {
        showToast('En fazla 5 sertifika yükleyebilirsiniz', 'error');
        setIsUploadingCertificate(false);
        return;
      }

      // FormData hazırla
      const formData = new FormData();
      formData.append('file', newCertificate.file);
      formData.append('name', newCertificate.name);

      // API'ye istek gönder
      const response = await fetch('/api/locksmith/certificates', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Sertifika yüklenirken bir hata oluştu');
      }

      const data = await response.json();

      // Formu temizle
      setNewCertificate({ name: '', file: null, fileSize: 0, fileType: '' });
      setIsCertificateDialogOpen(false);

      // Sertifikaları yeniden yükle
      fetchCertificates();

      showToast('Sertifika başarıyla yüklendi', 'success');
    } catch (error) {
      console.error('Sertifika yükleme hatası:', error);
      showToast(error.message || 'Sertifika yüklenirken bir hata oluştu', 'error');
    } finally {
      setIsUploadingCertificate(false);
    }
  };

  // Sertifika silme modalını açma
  const handleRemoveCertificate = (certificate) => {
    setCertificateToDelete(certificate);
    setIsDeleteCertificateModalOpen(true);
  };

  // Sertifika silme onaylama
  const confirmDeleteCertificate = async () => {
    if (!certificateToDelete) return;

    setIsDeletingCertificate(true);

    try {
      const response = await fetch(`/api/locksmith/certificates?id=${certificateToDelete.id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Sertifika silinirken bir hata oluştu');
      }

      // Sertifikaları yeniden yükle
      fetchCertificates();

      // Modal'ı kapat
      setIsDeleteCertificateModalOpen(false);
      setCertificateToDelete(null);

      showToast('Sertifika başarıyla silindi', 'success');
    } catch (error) {
      console.error('Sertifika silme hatası:', error);
      showToast(error.message || 'Sertifika silinirken bir hata oluştu', 'error');
    } finally {
      setIsDeletingCertificate(false);
    }
  };

  const cancelDeleteCertificate = () => {
    setIsDeleteCertificateModalOpen(false);
    setCertificateToDelete(null);
  };

  // Sertifika görüntüleme
  const handleViewCertificate = (cert) => {
    if (cert.fileurl) {
      window.open(cert.fileurl, '_blank');
    }
  };

  // Çalışma saatleri güncelleme fonksiyonu
  const handleWorkingHoursUpdate = async () => {
    setIsWorkingHoursUpdating(true);
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
    } finally {
      setIsWorkingHoursUpdating(false);
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
    setIsUpdatingProfile(true);
    try {
      const response = await fetch('/api/locksmith/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(locksmith),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Profil bilgileri güncellenirken bir hata oluştu');
      }

      showToast("Profil bilgileri başarıyla güncellendi", "success");
      if (provinceChanged) {
        fetchServiceDistricts();
      }
    } catch (error) {
      showToast("Profil bilgileri güncellenirken bir hata oluştu", "error");
      console.error("Profil bilgileri güncellenirken bir hata oluştu:", error);
    } finally {
      setIsUpdatingProfile(false);
    }
  };


  const handleAiAssist = async (field) => {
    setIsLoadingAi(prev => ({ ...prev, [field]: true }));

    try {
      if (field === 'tagline') {
        const currentText = locksmith.tagline || "";
        const businessName = locksmith.businessname;

        if (!businessName) {
          showToast("Önce işletme adı girin", "warning");
          setIsLoadingAi(prev => ({ ...prev, [field]: false }));
          return;
        }

        // İl bilgisi
        const location = districts.filter(district => district.isDayActive).map(district => district.name).join(', ');

        // Seçilen hizmetlerin isimlerini al
        const selectedServices = serviceList.filter(service => service.isactive).map(service => service.name);

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
        setLocksmith(prev => ({ ...prev, tagline: data.text }));
        showToast("Slogan AI ile iyileştirildi", "success");
      }
      else if (field === 'hakkinda') {
        const currentText = locksmith.abouttext || "";
        const businessName = locksmith.businessname;

        if (!businessName) {
          showToast("Önce işletme adı girin", "warning");
          setIsLoadingAi(prev => ({ ...prev, [field]: false }));
          return;
        }

        // İl bilgisi
        const location = districts.filter(district => district.isDayActive).map(district => district.name).join(', ');

        // Seçilen hizmetlerin isimlerini al
        const selectedServices = serviceList.filter(service => service.isactive).map(service => service.name);

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
        handleLocksmithDataChange('abouttext', data.text);


        showToast("Hakkında metni AI ile iyileştirildi", "success");
      }
    } catch (error) {
      console.error("AI iyileştirme hatası:", error);
      showToast("AI iyileştirme sırasında bir hata oluştu", "error");
    } finally {
      setIsLoadingAi(prev => ({ ...prev, [field]: false }));
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

  // İl değiştiğinde ilçeleri getir
  const handleProvinceChange = async (provinceId) => {
    // İl değerini locksmith state'ine kaydet
    handleLocksmithDataChange('provinceid', parseInt(provinceId));

    // İlçeleri getir
    try {
      const response = await fetch(`/api/public/districts?province_id=${provinceId}`);
      const data = await response.json();

      if (data.districts) {
        setDistricts(data.districts);

        // İlk ilçeyi seç veya boş bırak
        if (data.districts.length > 0) {
          handleLocksmithDataChange('districtid', data.districts[0].id);
        } else {
          handleLocksmithDataChange('districtid', null);
        }
      }
    } catch (error) {
      console.error('İlçeler getirilirken bir hata oluştu:', error);
      showToast("İlçe listesi yüklenirken bir hata oluştu", "error");
    }
  };

  // Profil bilgileri güncellendikten sonra ilçe listesini güncelle
  useEffect(() => {
    if (locksmith && locksmith.provinceid) {
      fetchDistricts(locksmith.provinceid);
    }
  }, [locksmith?.provinceid]);


  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Şifre güncelleme fonksiyonu
  const handleUpdatePassword = async () => {
    // Şifre kontrolü
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast("Şifreler eşleşmiyor", "error");
      return;
    }

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      showToast("Mevcut şifre ve yeni şifre gereklidir", "error");
      return;
    }

    // Minimum şifre uzunluğu kontrolü
    if (passwordForm.newPassword.length < 6) {
      showToast("Yeni şifre en az 6 karakter uzunluğunda olmalıdır", "error");
      return;
    }

    setIsUpdatingPassword(true);

    try {
      const response = await fetch('/api/locksmith/account/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oldPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Şifre güncellenirken bir hata oluştu');
      }

      // Formu temizle
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      showToast("Şifreniz başarıyla güncellendi", "success");
    } catch (error) {
      console.error("Şifre güncelleme hatası:", error);
      showToast(error.message || "Şifre güncellenirken bir hata oluştu", "error");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const sendMailTest = () => {
    console.log("Mail testi gönderiliyor");
  };

  // Mevcut sertifikaları yükleme
  const fetchCertificates = async () => {
    try {
      const response = await fetch('/api/locksmith/certificates', {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Sertifikalar yüklenirken bir hata oluştu');
      }

      const data = await response.json();
      setCertificates(data.certificates || []);
    } catch (error) {
      console.error('Sertifikalar yüklenirken bir hata oluştu:', error);
      showToast('Sertifikalar yüklenirken bir hata oluştu', 'error');
    }
  };

  // Debounce için kullanılacak ref
  const debounceTimeout = useRef(null);

  // useMemo ile newCertificate değerini optimize edelim
  const memoizedHandleCertificateChange = useMemo(() => {
    return {
      nameChange: (value) => {
        setNewCertificate(prev => ({ ...prev, name: value }));

        // Debounce işlemi
        if (debounceTimeout.current) {
          clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(() => {
          // İsim girişinden sonraki ağır işlemler burada yapılabilir
        }, 100);
      },

      fileChange: (file) => {
        if (file) {
          setNewCertificate(prev => ({
            ...prev,
            file: file,
            fileSize: file.size,
            fileType: file.type
          }));
        }
      }
    };
  }, []); // Boş dependency array ile sadece bir kere oluşturulacak

  // Google Maps API yükleme durumu
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'GOOGLE_MAPS_API_KEY',
    libraries: ['places'],
  });

  // Google Maps için state
  const [map, setMap] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 40.9912, lng: 29.0211 }); // Default İstanbul koordinatları
  const mapRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [isMapLoading, setIsMapLoading] = useState(false);

  // Harita yüklendiğinde çağrılır
  const onMapLoad = (map) => {
    mapRef.current = map;
    setMap(map);

    // Eğer locksmith'in latitude ve longitude değerleri varsa, haritayı o konuma merkezle
    if (locksmith.lat && locksmith.lng) {
      setMapCenter({ lat: parseFloat(locksmith.lat), lng: parseFloat(locksmith.lng) });
    }
  };

  // Marker sürüklendiğinde konum güncelleme
  const onMarkerDragEnd = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMapCenter({ lat, lng });
    updateAddressFromLatLng(lat, lng);
    handleLocksmithDataChange('lat', lat);
    handleLocksmithDataChange('lng', lng);
  };

  // Haritada herhangi bir yere tıklandığında
  const onMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMapCenter({ lat, lng });
    updateAddressFromLatLng(lat, lng);
    handleLocksmithDataChange('lat', lat);
    handleLocksmithDataChange('lng', lng);
  };

  // Autocomplete yer seçildiğinde
  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();

      if (place && place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        setMapCenter({ lat, lng });
        handleLocksmithDataChange('lat', lat);
        handleLocksmithDataChange('lng', lng);

        if (place.formatted_address) {
          handleLocksmithDataChange('fulladdress', place.formatted_address);
        }

        // Haritayı yeni konuma merkezle
        if (mapRef.current) {
          mapRef.current.panTo({ lat, lng });
          mapRef.current.setZoom(16);
        }
      }
    }
  };

  // Koordinatlar kullanarak adres bilgisini güncelleme
  const updateAddressFromLatLng = async (lat, lng) => {
    if (!isLoaded) return;

    try {
      setIsMapLoading(true);
      const geocoder = new window.google.maps.Geocoder();

      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results[0]) {
          handleLocksmithDataChange('fulladdress', results[0].formatted_address);
        }
        setIsMapLoading(false);
      });
    } catch (error) {
      console.error("Adres alınırken hata oluştu:", error);
      setIsMapLoading(false);
    }
  };

  // Locksmith verisi yüklendiğinde harita konumunu güncelle
  useEffect(() => {
    if (isLoaded && locksmith && locksmith.lat && locksmith.lng) {
      setMapCenter({
        lat: parseFloat(locksmith.lat),
        lng: parseFloat(locksmith.lng)
      });
    }
  }, [isLoaded, locksmith?.lat, locksmith?.lng]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-4 md:px-6 sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-1">
              <Image src="/logo.png" alt="bi-çilingir" width={32} height={32} />
              <span className="font-bold text-lg text-gray-800">BiÇilingir</span>
            </div>
            <div className="flex items-center space-x-4">
              <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
                <PopoverTrigger asChild>
                  <button
                    className="relative p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Bildirimler"
                  >
                    <Bell className="h-5 w-5" />
                    {notifications?.filter(n => !n.isread && !n.isdismissed).length > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                        {notifications?.filter(n => !n.isread && !n.isdismissed).length}
                      </span>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0 max-h-96 overflow-auto">
                  <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-medium">Bildirimler</h3>
                    <span className="text-xs text-gray-500">
                      {notifications?.filter(n => !n.isdismissed).length} bildirim
                    </span>
                  </div>
                  <div className="space-y-1 p-1">
                    {notifications?.filter(n => !n.isdismissed).length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">Hiç bildiriminiz bulunmuyor</p>
                      </div>
                    ) : (
                      notifications
                        ?.filter(notification => !notification.isdismissed)
                        ?.map(notification => (
                          <div
                            key={notification.id}
                            className={`flex items-start p-2 hover:bg-gray-50 rounded-md ${notification.isread ? '' : 'bg-blue-50'}`}
                          >
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${notification.type === 'success' ? 'bg-green-100' :
                              notification.type === 'warning' ? 'bg-amber-100' :
                                notification.type === 'error' ? 'bg-red-100' : 'bg-blue-100'
                              }`}>
                              {notification.type === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
                              {notification.type === 'warning' && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                              {notification.type === 'error' && <AlertCircle className="h-4 w-4 text-red-500" />}
                              {notification.type === 'info' && <Info className="h-4 w-4 text-blue-500" />}
                            </div>
                            <div className="flex-grow">
                              <div className="flex flex-col justify-between items-start">
                                <div className="flex flex-row items-center w-full">
                                  <h4 className="font-medium text-sm flex-1">{notification.title}</h4>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDismissNotification(notification.id);
                                    }}
                                    className="text-gray-400 hover:text-gray-600 ml-1"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>

                                <Popover>
                                  <PopoverTrigger asChild>
                                    <p className="text-xs text-gray-600 mt-1 line-clamp-2 cursor-pointer hover:text-blue-500">{notification.message}</p>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-80 p-3 text-sm text-gray-700 max-h-[300px] overflow-y-auto">
                                    <div>
                                      <h3 className="font-medium mb-2">{notification.title}</h3>
                                      <p className="text-gray-600">{notification.message}</p>
                                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
                                        <span className="text-xs text-gray-400">
                                          {new Date(notification.createdat).toLocaleString('tr-TR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                          })}
                                        </span>
                                      </div>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              </div>
                              <div className="flex justify-between items-center mt-2">
                                <span className="text-xs text-gray-400">
                                  {new Date(notification.createdat).toLocaleString('tr-TR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                                <div className="flex space-x-2">
                                  {!notification.isread && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleReadNotification(notification.id);
                                      }}
                                      className="text-xs text-blue-600 hover:text-blue-800"
                                    >
                                      Okundu
                                    </button>
                                  )}
                                  {notification.link && (
                                    <Link href={notification.link} className="text-xs text-blue-600 hover:text-blue-800">
                                      Detaylar
                                    </Link>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </PopoverContent>
              </Popover>

              <button
                className="text-gray-500 hover:text-blue-600 md:hidden"
                onClick={() => {
                  if (!mobileMenuOpen) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                  setMobileMenuOpen(!mobileMenuOpen)
                }}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>

              <div className="hidden md:flex items-center space-x-4">
                <div className="h-5 w-px bg-gray-300"></div>
                <div className="flex items-center space-x-1">
                  <span className="text-sm text-gray-500">Durum:</span>
                  <span className={`text-sm font-medium ${locksmith.isactive ? 'text-green-600' : 'text-red-600'}`}>
                    {locksmith.isactive ? 'Aktif' : 'Pasif'}
                  </span>
                </div>
                <div className="h-5 w-px bg-gray-300"></div>
                <Link href={`/cilingirler/${locksmith.slug}`} target="_blank" rel="noopener noreferrer" className="hidden md:block">
                  <button className="text-sm flex items-center space-x-1 text-blue-600 hover:text-blue-800">
                    <Eye className="h-4 w-4" />
                    <span>Önizle</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto pb-10 px-2">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar - Desktop */}
          <div className={`md:col-span-3 col-span-12 mt-4 ${mobileMenuOpen ? 'block' : 'hidden md:block'}`}>
            <Card className="sticky top-20"> {/* Değişiklik burada, header yüksekliğine göre top değeri ayarlandı */}
              <CardContent className="p-0">
                <div className="p-4 border-b">
                  <div className="flex items-center space-x-3">
                    <div className="relative w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                      {businessImages.length > 0 && businessImages[profileImageIndex] ? (
                        <Image
                          src={businessImages[profileImageIndex].image_url}
                          alt="İşletme Profil Resmi"
                          className="object-cover"
                          fill
                          sizes="40px"
                        />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{locksmith?.businessname || "Çilingir Paneli"}</h3>
                      <p className="text-sm text-gray-500">Çilingir Paneli</p>
                    </div>
                  </div>
                </div>
                <nav className="flex flex-col p-2">
                  <button
                    onClick={() => handleTabChange("dashboard")}
                    className={`flex items-center space-x-3 p-3 rounded-lg text-left cursor-pointer transition-colors ${activeTab === "dashboard" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span>Panel</span>
                  </button>

                  <button
                    onClick={() => handleTabChange("subscriptions")}
                    className={`flex items-center space-x-3 p-3 rounded-lg text-left cursor-pointer transition-colors ${activeTab === "subscriptions" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Abonelik</span>
                  </button>

                  <button
                    onClick={() => handleTabChange("profile")}
                    className={`flex items-center space-x-3 p-3 rounded-lg text-left cursor-pointer transition-colors ${activeTab === "profile" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Profil Bilgileri</span>
                  </button>

                  <button
                    onClick={() => handleTabChange("services")}
                    className={`flex items-center space-x-3 p-3 rounded-lg text-left cursor-pointer transition-colors ${activeTab === "services" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>Hizmetlerim</span>
                  </button>

                  <button
                    onClick={() => handleTabChange("location")}
                    className={`flex items-center space-x-3 p-3 rounded-lg text-left cursor-pointer transition-colors ${activeTab === "location" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                  >
                    <MapPin className="h-5 w-5" />
                    <span>Hizmet Alanlarım</span>
                  </button>

                  <button
                    onClick={() => handleTabChange("reviews")}
                    className={`flex items-center space-x-3 p-3 rounded-lg text-left cursor-pointer transition-colors ${activeTab === "reviews" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <span>Değerlendirmeler</span>
                  </button>

                  <button
                    onClick={() => handleTabChange("settings")}
                    className={`flex items-center space-x-3 p-3 rounded-lg text-left cursor-pointer transition-colors ${activeTab === "settings" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
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
                      disabled={isLogoutLoading}
                      onClick={handleLogout}
                      className="flex items-center space-x-3 p-3 rounded-lg text-left cursor-pointer text-red-600 hover:bg-red-50 transition-colors w-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>{!isLogoutLoading ? 'Güvenli Çıkış' : 'Çıkış Yapılıyor...'}</span>
                    </button>
                  </Link>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className={`col-span-12 md:col-span-9 mt-4 ${mobileMenuOpen ? 'hidden md:block' : 'block'}`} >
            {activeTab === "dashboard" && (
              <Card>
                <CardHeader>
                  <CardTitle>Panel</CardTitle>
                  <CardDescription>Hesap genel bakış</CardDescription>
                </CardHeader>
                <CardContent>

                  {/* Bildirimler kısmını kaldırıyoruz */}
                  <div className="mb-8">
                    <h4 className="font-medium mb-4 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Platform Aktiviteleri
                    </h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-6">
                        <div className="flex space-x-2 w-full overflow-x-auto scrollbar-hide scrollbar-thumb-blue-500 scrollbar-track-gray-100">
                          <Button variant="outline" className={`${activeDashboardFilter === 'today' ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}`} onClick={() => handleDashboardFilterChange('today')}>Bugün</Button>
                          <Button variant="outline" className={`${activeDashboardFilter === 'yesterday' ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}`} onClick={() => handleDashboardFilterChange('yesterday')}>Dün</Button>
                          <Button variant="outline" className={`${activeDashboardFilter === 'last7days' ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}`} onClick={() => handleDashboardFilterChange('last7days')}>Son 7 Gün</Button>
                          <Button variant="outline" className={`${activeDashboardFilter === 'last30days' ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}`} onClick={() => handleDashboardFilterChange('last30days')}>Son 30 Gün</Button>
                          <Button variant="outline" className={`${activeDashboardFilter === 'all' ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}`} onClick={() => handleDashboardFilterChange('all')}>Tümü</Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
                        <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-white">
                          <CardContent className="p-4 md:p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-gray-600 mb-1 font-medium">Görüntülenme</p>
                                <h3 className="text-2xl md:text-3xl font-bold text-gray-800">{dashboardStats?.see}</h3>
                                {dashboardStats?.see_percent != 0 && <p className={`text-sm ${dashboardStats?.see_percent > 0 ? "text-green-600" : "text-red-600"} mt-2 flex items-center`}>
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d={dashboardStats?.see_percent > 0
                                        ? "M5 10l7-7m0 0l7 7m-7-7v18"
                                        : "M19 14l-7 7m0 0l-7-7m7 7V3"} />
                                  </svg>
                                  %{Math.abs(dashboardStats?.see_percent)} {dashboardStats?.see_percent > 0 ? "artış" : "azalma"}
                                </p>}
                              </div>
                              <div className="bg-blue-100 p-3 rounded-full shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </div>
                            </div>
                            <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-1 bg-blue-500 rounded-full" style={{ width: '70%' }}></div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Arama */}
                        <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-50 to-white">
                          <CardContent className="p-4 md:p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-gray-600 mb-1 font-medium">Arama</p>
                                <h3 className="text-2xl md:text-3xl font-bold text-gray-800">{dashboardStats?.call}</h3>
                                {dashboardStats?.call_percent != 0 && <p className={`text-sm ${dashboardStats?.call_percent > 0 ? "text-green-600" : "text-red-600"} mt-2 flex items-center`}>
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d={dashboardStats?.call_percent > 0
                                        ? "M5 10l7-7m0 0l7 7m-7-7v18"
                                        : "M19 14l-7 7m0 0l-7-7m7 7V3"} />
                                  </svg>
                                  %{Math.abs(dashboardStats?.call_percent)} {dashboardStats?.call_percent > 0 ? "artış" : "azalma"}
                                </p>}
                              </div>
                              <div className="bg-purple-100 p-3 rounded-full shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                              </div>
                            </div>
                            <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-1 bg-purple-500 rounded-full" style={{ width: '60%' }}></div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Toplam Profil Ziyareti */}
                        <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-green-50 to-white">
                          <CardContent className="p-4 md:p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-gray-600 mb-1 font-medium">Profil Ziyareti</p>
                                <h3 className="text-2xl md:text-3xl font-bold text-gray-800">{dashboardStats?.visit}</h3>
                                {dashboardStats?.visit_percent != 0 && <p className={`text-sm ${dashboardStats?.visit_percent > 0 ? "text-green-600" : "text-red-600"} mt-2 flex items-center`}>
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d={dashboardStats?.visit_percent > 0
                                        ? "M5 10l7-7m0 0l7 7m-7-7v18"
                                        : "M19 14l-7 7m0 0l-7-7m7 7V3"} />
                                  </svg>
                                  %{Math.abs(dashboardStats?.visit_percent)} {dashboardStats?.visit_percent > 0 ? "artış" : "azalma"}
                                </p>}
                              </div>
                              <div className="bg-green-100 p-3 rounded-full shadow-sm">
                                <Footprints className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
                              </div>
                            </div>
                            <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-1 bg-green-500 rounded-full" style={{ width: '80%' }}></div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Yorum */}
                        <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-amber-50 to-white">
                          <CardContent className="p-4 md:p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-gray-600 mb-1 font-medium">Yorum</p>
                                <div className="flex items-center">
                                  <h3 className="text-2xl md:text-3xl font-bold text-gray-800">{dashboardStats?.review}</h3>
                                </div>
                                {dashboardStats?.review_percent !== 0 && <p className={`text-sm ${dashboardStats?.review_percent > 0 ? "text-green-600" : "text-red-600"} mt-2 flex items-center`}>
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d={dashboardStats?.review_percent > 0
                                        ? "M5 10l7-7m0 0l7 7m-7-7v18"
                                        : "M19 14l-7 7m0 0l-7-7m7 7V3"} />
                                  </svg>
                                  %{Math.abs(dashboardStats?.review_percent)} {dashboardStats?.review_percent > 0 ? "artış" : "azalma"}
                                </p>}
                              </div>
                              <div className="bg-amber-100 p-3 rounded-full shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                              </div>
                            </div>
                            <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-1 bg-amber-500 rounded-full" style={{ width: '95%' }}></div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Whatsapp */}
                        <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-teal-50 to-white">
                          <CardContent className="p-4 md:p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-gray-600 mb-1 font-medium">Whatsapp</p>
                                <div className="flex items-center">
                                  <h3 className="text-2xl md:text-3xl font-bold text-gray-800">{dashboardStats?.whatsapp}</h3>
                                </div>
                                {dashboardStats?.whatsapp_percent != 0 && <p className={`text-sm ${dashboardStats?.whatsapp_percent > 0 ? "text-green-600" : "text-red-600"} mt-2 flex items-center`}>
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d={dashboardStats?.whatsapp_percent > 0
                                        ? "M5 10l7-7m0 0l7 7m-7-7v18"
                                        : "M19 14l-7 7m0 0l-7-7m7 7V3"} />
                                  </svg>
                                  %{Math.abs(dashboardStats?.whatsapp_percent)} {dashboardStats?.whatsapp_percent > 0 ? "artış" : "azalma"}
                                </p>}
                              </div>
                              <div className="bg-teal-100 p-3 rounded-full shadow-sm">
                                <MessageCircle className="h-6 w-6 md:h-8 md:w-8 text-teal-600" />
                              </div>
                            </div>
                            <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-1 bg-teal-500 rounded-full" style={{ width: '95%' }}></div>
                            </div>
                          </CardContent>
                        </Card>

                        {/*Website Ziyareti*/}
                        <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-50 to-white">
                          <CardContent className="p-4 md:p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-gray-600 mb-1 font-medium">Website Ziyareti</p>
                                <div className="flex items-center">
                                  <h3 className="text-2xl md:text-3xl font-bold text-gray-800">{dashboardStats?.website_visit}</h3>
                                </div>
                                {dashboardStats?.website_visit_percent != 0 && <p className={`text-sm ${dashboardStats?.website_visit_percent > 0 ? "text-green-600" : "text-red-600"} mt-2 flex items-center`}>
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d={dashboardStats?.website_visit_percent > 0
                                        ? "M5 10l7-7m0 0l7 7m-7-7v18"
                                        : "M19 14l-7 7m0 0l-7-7m7 7V3"} />
                                  </svg>
                                  %{Math.abs(dashboardStats?.website_visit_percent)} {dashboardStats?.website_visit_percent > 0 ? "artış" : "azalma"}
                                </p>}
                              </div>
                              <div className="bg-purple-100 p-3 rounded-full shadow-sm">
                                <Globe className="h-6 w-6 md:h-8 md:w-8 text-purple-600" />
                              </div>
                            </div>
                            <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-1 bg-purple-500 rounded-full" style={{ width: '90%' }}></div>
                            </div>
                          </CardContent>
                        </Card>

                      </div>

                      {isActivitiesLoading ? (
                        <div className="flex justify-center items-center p-12">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                      ) : activityList.length > 0 && activityList ? (
                        <div className="space-y-4">
                          {activityList.map((activity, index) => {
                            // Aktivite türüne göre renkler ve simgeler
                            const getActivityColor = (type) => {
                              switch (type) {
                                case "locksmith_list_view": return { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", icon: <Eye className="h-6 w-6 text-blue-500" /> };
                                case "locksmith_detail_view": return { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", icon: <Footprints className="h-6 w-6 text-amber-500" /> };
                                case "call_request": return { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", icon: <PhoneCall className="h-6 w-6 text-orange-500" /> };
                                case "review_submit": return { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", icon: <Star className="h-6 w-6 text-green-500" /> };
                                case "whatsapp_message": return { bg: "bg-teal-50", border: "border-teal-200", text: "text-teal-700", icon: <MessageCircle className="h-6 w-6 text-teal-500" /> };
                                case "website_visit": return { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", icon: <Globe className="h-6 w-6 text-purple-500" /> };
                                default: return { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-700", icon: <Info className="h-6 w-6 text-gray-500" /> };
                              }
                            };

                            const activityStyle = getActivityColor(activity.activitytype);

                            return (
                              <div key={index} className={`rounded-xl shadow-sm border p-4 ${activityStyle.bg} ${activityStyle.border} hover:shadow-md transition-shadow`}>
                                <div className="flex items-start gap-4">
                                  <div className="p-3 rounded-full bg-white shadow-sm flex-shrink-0">
                                    {activityStyle.icon}
                                  </div>

                                  <div className="flex-grow">
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                                      <h5 className={`font-medium ${activityStyle.text}`}>
                                        {activity.activitytype === "review_submit" ? "Yorum Aldınız" :
                                          activity.activitytype === "call_request" ? "Arama Aldınız" :
                                            activity.activitytype === "locksmith_list_view" ? "Aramada Listelendiniz" :
                                              activity.activitytype === "locksmith_detail_view" ? "Profiliniz Görüntülendi" :
                                                activity.activitytype === "whatsapp_message" ? "Whatsapp Mesajı Aldınız" :
                                                  activity.activitytype === "website_visit" ? "Web siteniz ziyaret edildi" : "Bilinmeyen"}
                                      </h5>

                                      <div className="text-xs text-gray-500 flex items-center">
                                        <Clock className="h-3.5 w-3.5 mr-1" />
                                        {new Date(activity.createdat).toLocaleString('tr-TR', {
                                          day: '2-digit',
                                          month: '2-digit',
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })}
                                      </div>
                                    </div>

                                    <p className="text-sm text-gray-600 mt-1">
                                      {activity.activitytype === "review_submit" ? (
                                        <>5 üzerinden <span className="font-medium">{activity?.reviews?.rating}</span> yıldız aldınız {activity?.reviews?.comment && ' :"'}<span className="italic">{activity?.reviews?.comment}</span>{activity?.reviews?.comment && '"'}</>
                                      ) : activity.activitytype === "call_request" ? (
                                        <><span className="font-medium">{activity?.services?.name}</span> hizmeti için arama aldınız</>
                                      ) : activity.activitytype === "locksmith_list_view" ? (
                                        <><span className="font-medium">{activity?.services?.name}</span> hizmeti aramasında profiliniz görüntülendi</>
                                      ) : activity.activitytype === "locksmith_detail_view" ? (
                                        <>Bir müşteri profilinizi ziyaret etti</>
                                      ) : activity.activitytype === "whatsapp_message" ? (
                                        <><span className="font-medium">{activity?.services?.name}</span> hizmeti için whatsapp mesajı aldınız</>
                                      ) : activity.activitytype === "website_visit" ? (
                                        <>Bir müşteri web sitenizi ziyaret etti</>
                                      ) : (
                                        <>Bilinmeyen bir aktivite</>
                                      )}
                                    </p>

                                    <div className="flex items-center mt-3 text-xs font-medium text-gray-500">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                      </svg>
                                      <span>{activity?.districts?.name} - {activity?.services?.name}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                          {totalPagesActivities > 1 && (
                            <div className="flex justify-between items-center mt-6 p-4 bg-gray-50 rounded-xl">
                              <p className="text-sm text-gray-500">10 aktivite gösteriliyor</p>
                              <div className="flex items-center gap-4">
                                <span className="text-sm">Sayfa {currentPageActivities} / {totalPagesActivities}</span>
                                <div className="flex space-x-2">
                                  <Button
                                    disabled={(currentPageActivities == 1) || isActivitiesPreviousPageLoading || isActivitiesLoading || (totalPagesActivities == 1)}
                                    variant="outline" size="sm"
                                    className="rounded-full"
                                    onClick={() => {
                                      handleDashboardFilterChange(activeDashboardFilter, Number(currentPageActivities) - 1)
                                    }}>
                                    {isActivitiesPreviousPageLoading ? (
                                      <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
                                        Yükleniyor
                                      </div>
                                    ) : 'Önceki'}
                                  </Button>
                                  <Button
                                    disabled={(currentPageActivities == totalPagesActivities) || isActivitiesNextPageLoading || isActivitiesLoading || (totalPagesActivities == 1)}
                                    variant="outline" size="sm"
                                    className="rounded-full"
                                    onClick={() => {
                                      handleDashboardFilterChange(activeDashboardFilter, Number(currentPageActivities) + 1);
                                    }}>
                                    {isActivitiesNextPageLoading ? (
                                      <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
                                        Yükleniyor
                                      </div>
                                    ) : 'Sonraki'}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-xl">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <h3 className="mt-2 text-sm font-medium text-gray-900">Aktivite bulunamadı</h3>
                          <p className="mt-1 text-sm text-gray-500">Bu tarih aralığında henüz bir aktivite bulunmuyor.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "subscriptions" && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Abonelik</CardTitle>
                      <CardDescription>BiÇilingir platformunda öne çıkmak için paket seçin</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Paket Abonelikleri */}
                  <div className="overflow-hidden">
                    <SubscriptionPackages />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "profile" && (
              <Card>
                <CardHeader>
                  <CardTitle>Profil Bilgileri</CardTitle>
                  <CardDescription className="text-sm text-gray-500 flex items-center justify-between">
                    <span>İşletme bilgilerinizi güncelleyin</span>
                    <Link href={`/cilingirler/${locksmith.slug}`} target="_blank" rel="noopener noreferrer" className="block md:hidden">
                      <button className="text-sm flex items-center space-x-1 text-blue-600 hover:text-blue-800">
                        <Eye className="h-4 w-4" />
                        <span>Önizle</span>
                      </button>
                    </Link>
                    {/* <button onClick={() => sendMailTest()} className="text-sm flex items-center space-x-1 text-blue-600 hover:text-blue-800">
                      <Mail className="h-4 w-4" />
                      <span>Mail Test</span>
                    </button> */}
                  </CardDescription>
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
                      <div className="md:col-span-2">
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
                        <label className="block text-sm mb-1">Telefon</label>
                        <Input
                          value={formatPhoneNumber(locksmith?.phonenumber) || ""}
                          onChange={(e) => handleLocksmithDataChange('phonenumber', formatPhoneNumber(e.target.value))}
                          placeholder="Örn: 05XX XXX XX XX"
                          maxLength={14}
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Whatsapp</label>
                        <Input
                          value={formatPhoneNumber(locksmith?.whatsappnumber) || ""}
                          onChange={(e) => handleLocksmithDataChange('whatsappnumber', formatPhoneNumber(e.target.value))}
                          placeholder="Örn: 05XX XXX XX XX"
                          maxLength={14}
                        />
                      </div>

                      <div>
                        <label className="block text-sm mb-1">E-posta</label>
                        <Input
                          value={locksmith?.email || ""}
                          onChange={(e) => handleLocksmithDataChange('email', e.target.value)}
                        />
                      </div>


                      {/* İl - ilçe seçimi */}
                      <div className="md:col-span-1">
                        <label className="block text-sm mb-1">İl</label>
                        <select
                          className="w-full p-2 border rounded-md"
                          onChange={(e) => {
                            handleProvinceChange(e.target.value)
                            setProvinceChanged(true)
                          }}
                          value={locksmith?.provinceid || ""}
                        >
                          <option value="">İl Seçiniz</option>
                          {provinces.map((il) => (
                            <option key={il.id} value={il.id}>{il.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-sm mb-1">İlçe</label>
                        <select
                          className="w-full p-2 border rounded-md"
                          onChange={(e) => handleLocksmithDataChange('districtid', parseInt(e.target.value))}
                          value={locksmith?.districtid || ""}
                          disabled={!locksmith?.provinceid}
                        >
                          <option value="">İlçe Seçiniz</option>
                          {districts.map((ilce) => (
                            <option key={ilce.id} value={ilce.id}>{ilce.name}</option>
                          ))}
                        </select>
                      </div>

                      {/* Tam Adres */}
                      <div className="md:col-span-2">
                        <label className="block text-sm mb-1">Konum ve Adres</label>
                        {isLoaded ? (
                          <div className="w-full mb-2">
                            <Autocomplete
                              onLoad={(autocomplete) => { autocompleteRef.current = autocomplete; }}
                              onPlaceChanged={onPlaceChanged}
                            >
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                  type="text"
                                  className="w-full pl-10 p-2 border rounded-md mb-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                  placeholder="Adres ara..."
                                  defaultValue=""
                                />
                              </div>
                            </Autocomplete>

                            <div className="h-[300px] w-full rounded-md overflow-hidden border">
                              <GoogleMap
                                mapContainerStyle={{ width: '100%', height: '100%' }}
                                center={mapCenter}
                                zoom={15}
                                onLoad={onMapLoad}
                                onClick={onMapClick}
                              >
                                <Marker
                                  position={mapCenter}
                                  draggable={true}
                                  onDragEnd={onMarkerDragEnd}
                                />
                              </GoogleMap>
                            </div>

                            <div className="mt-2 text-sm text-gray-500 flex items-center space-x-2">
                              {isMapLoading ? (
                                <div className="flex items-center">
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                                  <span>Adres yükleniyor...</span>
                                </div>
                              ) : (
                                <>
                                  <MapPin className="h-4 w-4 text-blue-500" />
                                  <span>Adres aramak için yukarıdaki kutuyu kullanın veya haritada bir konuma tıklayın</span>
                                </>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-[300px] bg-gray-100 rounded-md">
                            <div className="text-center">
                              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-2"></div>
                              <p className="text-gray-500">Google Haritalar yükleniyor...</p>
                            </div>
                          </div>
                        )}
                        <label className="block text-sm mb-1">Açık Adres</label>
                        <textarea
                          className="w-full min-h-[100px] p-2 border rounded-md"
                          value={locksmith?.fulladdress || ""}
                          onChange={(e) => handleLocksmithDataChange('fulladdress', e.target.value)}
                          placeholder="Adres haritada görüntülenmiyorsa manuel olarak yazabilirsiniz"
                        ></textarea>
                      </div>

                      {/*tagline*/}
                      <div className="md:col-span-2">
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm mb-1">Kısa Tanıtım {locksmith?.tagline?.length}/150</label>
                          <AiAssistButton
                            onClick={() => handleAiAssist('tagline')}
                            loading={isLoadingAi.tagline}
                            className="text-xs py-1 px-2"
                          />
                        </div>
                        <Input
                          maxLength={150}
                          value={locksmith?.tagline || ""}
                          onChange={(e) => handleLocksmithDataChange('tagline', e.target.value)}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          İşletme Hakkında ({locksmith?.abouttext?.length || 0}/1000)
                        </label>
                        <TiptapEditor
                          content={locksmith?.abouttext || ""}
                          onChange={(content) => handleLocksmithDataChange('abouttext', content)}
                          placeholder="İşletmeniz hakkında detaylı bilgi verin..."
                          maxLength={1000}
                          showAiAssist={true}
                          aiAssistField="hakkinda"
                          className="mt-2"
                        />
                      </div>
                    </div>

                    {/* Maksimum müşteri sayısı */}
                    <div>
                      <h4 className="font-medium mb-4 mt-6">Bir saat içinde maksimum kaç müşteriye hizmet verebilirsiniz?</h4>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm text-gray-500">Maksimum müşteri sayısı</p>
                        <Input
                          className="w-24"
                          type="number"
                          value={locksmith?.customerlimitperhour > 0 ? locksmith?.customerlimitperhour : 0}
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
                        {dailyHours.map((day) => (
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
                                {day.dayofweek == 0 ? "Pazartesi" : day.dayofweek == 1 ? "Salı" : day.dayofweek == 2 ? "Çarşamba" : day.dayofweek == 3 ? "Perşembe" : day.dayofweek == 4 ? "Cuma" : day.dayofweek == 5 ? "Cumartesi" : "Pazar"}
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
                            disabled={isWorkingHoursUpdating}
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
                        {/* Sertifika Yükleme Butonu */}
                        <Button
                          onClick={() => setIsCertificateDialogOpen(true)}
                          disabled={certificates.length >= 5}
                        >
                          Sertifika Yükle {certificates.length >= 5 && "(Limit Dolu)"}
                        </Button>

                        {/* Sertifika Yükleme Dialogu */}
                        {isCertificateDialogOpen && (
                          <Dialog
                            open={isCertificateDialogOpen}
                            onOpenChange={setIsCertificateDialogOpen}
                          >
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Sertifika Yükle</DialogTitle>
                                <DialogDescription>Yeni bir sertifika yüklemek için lütfen dosyayı seçin ve sertifika adını girin.</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <Input type="file" accept="image/*,application/pdf" onChange={(e) => {
                                  if (e.target.files && e.target.files.length > 0) {
                                    const file = e.target.files[0];
                                    memoizedHandleCertificateChange.fileChange(file);
                                  }
                                }} />
                                <Input
                                  type="text"
                                  placeholder="Sertifika Adı"
                                  value={newCertificate.name}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    memoizedHandleCertificateChange.nameChange(value);
                                  }}
                                />
                                {newCertificate.file && (
                                  <div className="text-sm text-gray-500">
                                    Dosya: {newCertificate.file.name} ({(newCertificate.file.size / 1024 / 1024).toFixed(2)} MB)
                                  </div>
                                )}
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsCertificateDialogOpen(false)}>İptal</Button>
                                <Button onClick={handleAddCertificate} disabled={isUploadingCertificate}>
                                  {isUploadingCertificate ? (
                                    <>
                                      <span className="animate-spin mr-2">&#9696;</span>
                                      Yükleniyor...
                                    </>
                                  ) : 'Yükle'}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}

                        {/* Sertifika Silme Modalı */}
                        {isDeleteCertificateModalOpen && (
                          <Dialog
                            open={isDeleteCertificateModalOpen}
                            onOpenChange={setIsDeleteCertificateModalOpen}
                          >
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Sertifikayı Sil</DialogTitle>
                                <DialogDescription>
                                  "{certificateToDelete?.name}" sertifikasını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button variant="outline" onClick={cancelDeleteCertificate}>İptal</Button>
                                <Button variant="destructive" onClick={confirmDeleteCertificate} disabled={isDeletingCertificate}>
                                  {isDeletingCertificate ? (
                                    <>
                                      <span className="animate-spin mr-2">&#9696;</span>
                                      Siliniyor...
                                    </>
                                  ) : 'Sil'}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}

                        {/* Mevcut Sertifikalar */}
                        {certificates.length > 0 ? (
                          <div className="mt-4">
                            <h5 className="font-medium mb-3">Mevcut Sertifikalar ({certificates.length}/5)</h5>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                              {certificates.map((cert) => (
                                <div key={cert.id} className="relative group">
                                  <div className="aspect-square overflow-hidden rounded-lg hover:border hover:transition-all hover:duration-100 hover:border-blue-500">
                                    {/* Dosya tipine göre ikon göster */}
                                    <div
                                      onClick={() => handleViewCertificate(cert)}
                                      className="w-full h-full flex items-center justify-center bg-gray-100 border-2 cursor-pointer"
                                    >
                                      <div className="text-center">
                                        {cert.fileurl?.includes('.pdf') ? (
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                            <polyline points="14 2 14 8 20 8" />
                                            <line x1="16" y1="13" x2="8" y2="13" />
                                            <line x1="16" y1="17" x2="8" y2="17" />
                                            <polyline points="10 9 9 9 8 9" />
                                          </svg>
                                        ) : (
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                            <circle cx="8.5" cy="8.5" r="1.5" />
                                            <polyline points="21 15 16 10 5 21" />
                                          </svg>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <h3 className="text-sm text-center font-medium mt-2 truncate">{cert.name}</h3>
                                  <button
                                    onClick={() => handleRemoveCertificate(cert)}
                                    className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Sertifikayı Sil"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="mt-4">
                            <div className="flex items-center justify-center gap-2 p-8 bg-gray-50 rounded-lg border border-gray-200">
                              <Info className="h-5 w-5 text-gray-400" />
                              <p className="text-sm text-gray-500">Henüz sertifika yüklemediniz. İşletmenizin güvenilirliğini artırmak için sertifikalarınızı ekleyin.</p>
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
                        ) :
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
                            value={locksmith?.instagram_url || ""}
                            onChange={(e) => handleLocksmithDataChange('instagram_url', e.target.value)}
                            className="flex-grow"
                          />
                        </div>
                      </div>

                      {/* Facebook */}
                      <div className="pb-6">
                        <div className="flex items-center mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-2" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                          <h3 className="text-lg font-medium">Facebook</h3>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Input
                            placeholder="Facebook profil linkiniz"
                            value={locksmith?.facebook_url || ""}
                            onChange={(e) => handleLocksmithDataChange('facebook_url', e.target.value)}
                            className="flex-grow"
                          />
                        </div>
                      </div>

                      {/* YouTube */}
                      <div className="pb-6">
                        <div className="flex items-center mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 mr-2" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                          </svg>
                          <h3 className="text-lg font-medium">YouTube</h3>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Input
                            placeholder="YouTube profil linkiniz"
                            value={locksmith?.youtube_url || ""}
                            onChange={(e) => handleLocksmithDataChange('youtube_url', e.target.value)}
                            className="flex-grow"
                          />
                        </div>
                      </div>

                      {/* TikTok */}
                      <div className="pb-6">
                        <div className="flex items-center mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black mr-2" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                          </svg>
                          <h3 className="text-lg font-medium">TikTok</h3>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Input
                            placeholder="TikTok profil linkiniz"
                            value={locksmith?.tiktok_url || ""}
                            onChange={(e) => handleLocksmithDataChange('tiktok_url', e.target.value)}
                            className="flex-grow"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button
                        onClick={() => handleUpdateLocksmithData()}
                        disabled={isUpdatingProfile}
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
                      <Card key={index} className={`mb-4 overflow-hidden transition-all duration-200 hover:shadow-md border ${service.isLocksmithActive ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
                        <CardContent className="p-0">
                          <div className="flex flex-col">
                            {/* Başlık ve Checkbox Kısmı */}
                            <div className="flex items-center p-4 border-b border-gray-100">
                              <Checkbox
                                id={`service-${service.id}`}
                                checked={service.isLocksmithActive}
                                onCheckedChange={(checked) => handleServiceActiveChange(service.id, checked)}
                                className="mr-3 h-5 w-5"
                              />
                              <label
                                htmlFor={`service-${service.id}`}
                                className={`font-medium text-lg ${service.isLocksmithActive ? 'text-blue-700' : 'text-gray-500'}`}
                              >
                                {service.name}
                              </label>

                              {!service.isLocksmithActive && (
                                <span className="ml-auto text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-600">Aktif Değil</span>
                              )}

                              {service.isLocksmithActive && (
                                <span className="ml-auto text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600">Aktif</span>
                              )}
                            </div>

                            {/* Fiyat Bilgileri */}
                            <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 ${service.isLocksmithActive ? 'opacity-100' : 'opacity-70'}`}>
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
                      onClick={() => handleUpdateServices()}
                      disabled={isUpdatingServices}
                      className="bg-blue-600 hover:bg-blue-700 text-white">
                      Değişiklikleri Kaydet
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}


            {activeTab === "location" && (
              <Card>
                <CardHeader>
                  <CardTitle>Hizmet Alanlarım</CardTitle>
                  <CardDescription>Hizmet alanlarınızı yönetin</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    {isLoadingLocation ? (
                      <div className="flex justify-center items-center h-48">
                        <div className="flex justify-center items-center p-12">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                      </div>
                    ) : (
                      serviceDistricts.map((district, index) => (
                        <Card key={index} className="mb-4 overflow-hidden transition-all duration-200 hover:shadow-md border border-gray-200 bg-white">
                          <CardContent className="p-0">
                            <div className="flex flex-col">
                              {/* Başlık Kısmı */}
                              <div className="flex items-center p-4 border-b border-gray-100 bg-gray-50">
                                <label
                                  className="font-medium text-lg text-gray-700"
                                >
                                  {district.name}
                                </label>

                                {(!district.isDayActive && !district.isNightActive) && (
                                  <span className="ml-auto text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-600">Aktif Değil</span>
                                )}

                                {(district.isDayActive && district.isNightActive) && (
                                  <span className="ml-auto text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600">24 Saat Aktif</span>
                                )}

                                {(district.isDayActive && !district.isNightActive) && (
                                  <span className="ml-auto text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-600">Gündüz Aktif</span>
                                )}

                                {(!district.isDayActive && district.isNightActive) && (
                                  <span className="ml-auto text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-600">Gece Aktif</span>
                                )}
                              </div>

                              {/* Gündüz ve Gece Seçenekleri */}
                              <div className="flex flex-col sm:flex-row">
                                <div className="flex items-center p-4 flex-1 border-b sm:border-b-0 sm:border-r border-gray-100 cursor-pointer" onClick={() => handleDistrictActiveChange(district.id, 'day', !district.isDayActive)}>
                                  <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                                    </svg>
                                    <label className="text-md font-medium mr-3 cursor-pointer">Gündüz</label>
                                  </div>
                                  <Checkbox
                                    id={`district-day-${district.id}`}
                                    checked={district.isDayActive || false}
                                    onCheckedChange={(checked) => handleDistrictActiveChange(district.id, 'day', checked)}
                                    className="ml-auto h-5 w-5"
                                  />
                                </div>

                                <div className="flex items-center p-4 flex-1 cursor-pointer" onClick={() => handleDistrictActiveChange(district.id, 'night', !district.isNightActive)}>
                                  <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                    </svg>
                                    <label htmlFor={`district-night-${district.id}`} className="text-md font-medium mr-3 cursor-pointer">Gece</label>
                                  </div>
                                  <Checkbox
                                    id={`district-night-${district.id}`}
                                    checked={district.isNightActive || false}
                                    onCheckedChange={(checked) => handleDistrictActiveChange(district.id, 'night', checked)}
                                    className="ml-auto h-5 w-5"
                                  />
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                      )))}
                  </div>

                  {!isLoadingLocation && <div className="flex justify-start">
                    <Button
                      onClick={() => handleUpdateDistricts()}
                      disabled={isUpdatingDistricts}
                      className="bg-blue-600 hover:bg-blue-700 text-white">
                      Hizmet Alanlarını Güncelle
                    </Button>
                  </div>}
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
                        <div className="text-4xl font-bold">{reviewStats?.averageRating?.toFixed(1) || 0}</div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-5 h-5 ${i < 5 ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                          ))}
                        </div>
                        <div className="text-sm text-gray-500">{reviewStats?.totalReviewsCount} değerlendirme</div>
                      </div>

                      <div className="flex-1">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="flex items-center space-x-2 mb-1">
                            <div className="text-sm w-2">{5 - i}</div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-yellow-400 h-2 rounded-full"
                                style={{ width: `${i === 0 ? reviewStats?.five?.toFixed(0) : i === 1 ? reviewStats?.four?.toFixed(0) : i === 2 ? reviewStats?.three?.toFixed(0) : i === 3 ? reviewStats?.two?.toFixed(0) : reviewStats?.one?.toFixed(0)}%` }}
                              ></div>
                            </div>
                            <div className="text-sm text-gray-500">
                              {i === 0 ? reviewStats?.five?.toFixed(0) : i === 1 ? reviewStats?.four?.toFixed(0) : i === 2 ? reviewStats?.three?.toFixed(0) : i === 3 ? reviewStats?.two?.toFixed(0) : reviewStats?.one?.toFixed(0)}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Yıldız Filtreleme Butonları */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <button
                        className={`flex items-center space-x-1 border border-gray-200 hover:bg-blue-50 hover:border-blue-200 rounded-lg px-3 py-1.5 transition-colors ${activeReviewFilter === "all" ? "bg-blue-50 border-blue-200" : ""}`}
                        onClick={() => handleReviewFilter("all")}
                      >
                        Tümü
                      </button>
                      {[5, 4, 3, 2, 1].map((star) => (
                        <button
                          key={star}
                          className={`flex items-center space-x-1 border border-gray-200 hover:bg-blue-50 hover:border-blue-200 rounded-lg px-3 py-1.5 transition-colors ${activeReviewFilter === star.toString() ? "bg-blue-50 border-blue-200" : ""}`}
                          onClick={() => handleReviewFilter(star.toString())}
                        >
                          <span className="font-medium">{star}</span>
                          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6 min-h-[300px]">
                    {reviewList?.length === 0 && (
                      <div className="text-center text-gray-500">
                        <p>Henüz değerlendirme yapılmamış</p>
                      </div>)
                    }

                    {reviewList?.map((review) => (
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
                          <div className="text-sm text-gray-500">{new Date(review.createdat).toLocaleDateString('tr-TR')}</div>
                        </div>
                        <p className="text-gray-700">
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                  {reviewList?.length > 0 && (
                    <div className="flex justify-between items-center mt-6">
                      <p className="text-sm text-gray-500">10 yorum gösteriliyor</p>
                      <div className="flex items-center">
                        <span className="mr-4 text-sm">Sayfa {currentPageReviews} / {totalPagesReviews}</span>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" disabled={currentPageReviews == 1 || isReviewPreviousPageLoading || isReviewLoading || (totalPagesReviews == 1)} onClick={() => handleReviewFilter(activeReviewFilter, Number(currentPageReviews) - 1)}>Önceki</Button>
                          <Button variant="outline" size="sm" disabled={currentPageReviews == totalPagesReviews || isReviewNextPageLoading || isReviewLoading || (totalPagesReviews == 1)} onClick={() => handleReviewFilter(activeReviewFilter, Number(currentPageReviews) + 1)}>Sonraki</Button>
                        </div>
                      </div>
                    </div>
                  )}
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
                        <Button
                          onClick={handleUpdatePassword}
                          disabled={isUpdatingPassword}
                        >
                          {isUpdatingPassword ? (
                            <div className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              İşleniyor...
                            </div>
                          ) : (
                            'Şifreyi Güncelle'
                          )}
                        </Button>
                      </div>
                    </div>


                    <div className="border-t pt-6">
                      <h4 className="font-medium mb-4">Hesap Durumu {locksmith?.isactive == true ? 'Aktif' : 'Pasif'}</h4>
                      {locksmith?.status == 'approved' &&
                        <div className="space-y-4">
                          <p className="text-sm text-gray-500">
                            {locksmith?.isactive == true ? 'Hesabınızı devre dışı bırakırsanız, profiliniz ve hizmetleriniz platformda görünmeyecektir.' : 'Hesabınızı aktifleştirirseniz, profiliniz ve hizmetleriniz platformda görünür hale gelecektir.'}
                          </p>
                          {
                            locksmith?.isactive == true ? (
                              <Button
                                variant="destructive"
                                disabled={isToggleStatusAccountLoading}
                                onClick={() => setIsToggleStatusAccountModalOpen(true)}
                              >Hesabımı Pasif Yap</Button>
                            ) : (
                              <Button
                                variant="outline"
                                disabled={isToggleStatusAccountLoading}
                                onClick={() => setIsToggleStatusAccountModalOpen(true)}
                              >Hesabımı Aktifleştir</Button>
                            )
                          }
                        </div>}
                      {locksmith?.status == 'pending' &&
                        <div className="space-y-4">
                          <p className="text-sm text-gray-500">
                            Hesabınızın onay aşamasındadır.
                          </p>
                        </div>
                      }
                      {locksmith?.status == 'rejected' &&
                        <div className="space-y-4">
                          <p className="text-sm text-gray-500">
                            Hesabınız reddedildi. Lütfen yöneticiyle iletişime geçiniz.
                          </p>
                        </div>
                      }
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      {
        showDeleteModal && (
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
        )
      }

      {
        isToggleStatusAccountModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Hesap Durumu {locksmith?.isactive == true ? 'Aktif' : 'Pasif'}</h3>
              <p className="text-gray-600 mb-6">{locksmith?.isactive == true ? 'Hesabınızı devre dışı bırakırsanız, profiliniz ve hizmetleriniz platformda görünmeyecektir.' : 'Hesabınızı aktifleştirirseniz, profiliniz ve hizmetleriniz platformda görünür hale gelecektir.'}</p>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setIsToggleStatusAccountModalOpen(false)}
                >
                  İptal
                </Button>
                <Button
                  variant={locksmith?.isactive == true ? 'destructive' : 'default'}
                  onClick={handleToggleStatusAccount}
                  disabled={isToggleStatusAccountLoading}
                >
                  {isToggleStatusAccountLoading ? 'İşleniyor...' : locksmith?.isactive == true ? 'Hesabımı Pasif Yap' : 'Hesabımı Aktifleştir'}
                </Button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
} 