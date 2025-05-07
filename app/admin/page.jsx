"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  Key,
  Settings,
  Wrench,
  ChevronRight,
  UserCheck,
  Clock,
  Star,
  TrendingUp,
  PhoneCall,
  Eye,
  Calendar,
  AlertCircle,
  Rocket,
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  History,
  Activity,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  UserPlus,
  FileText,
  ShoppingCart,
  DollarSign,
  Filter,
  ChevronDown,
  Loader2,
  MoreVertical,
  Info,
  Footprints,
  MessageCircle,
  Globe,
} from "lucide-react";
import Image from "next/image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { DatePickerWithRange } from "../../components/ui/date-range-picker";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../components/ui/dialog";
import { useToast } from "../../components/ToastContext";
import { Checkbox } from "../../components/ui/checkbox";
import { useSelector } from "react-redux";
import { getSupabaseClient } from "../../lib/supabase";
import { Textarea } from "../../components/ui/textarea";

function AdminPanelContent() {
  const supabase = getSupabaseClient();
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get('tab');

  const [activeTab, setActiveTab] = useState(tabParam || "dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dateRange, setDateRange] = useState({ from: new Date(), to: new Date() });
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedTimeRange, setSelectedTimeRange] = useState("7");
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState(null);
  const [activeDashboardFilter, setActiveDashboardFilter] = useState('today');

  const [activeReviewFilter, setActiveReviewFilter] = useState("pending");
  const [reviews, setReviews] = useState([]);
  const [statsData, setStatsData] = useState({});
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isReviewsLoading, setIsReviewsLoading] = useState(true);
  const handleReviewFilterChange = (filter) => {
    setActiveReviewFilter(filter);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchReviews();
  }, [currentPage, activeReviewFilter]);


  const [isActivitiesLoading, setIsActivitiesLoading] = useState(true);
  const [isActivitiesNextPageLoading, setIsActivitiesNextPageLoading] = useState(false);
  const [isActivitiesPreviousPageLoading, setIsActivitiesPreviousPageLoading] = useState(false);
  const [activityList, setActivityList] = useState([]);
  const [currentPageActivities, setCurrentPageActivities] = useState(1);
  const [totalPagesActivities, setTotalPagesActivities] = useState(1);
  const [dashboardStats, setDashboardStats] = useState({
    total_locksmiths: 0,
    total_users: 0,
    total_activity_logs: 0,
    total_locksmiths_percent: 0,
    total_users_percent: 0,
    total_activity_logs_percent: 0,
    total_key_usage: 0,
    total_daily_key_usage: 0,
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

  const handleDashboardFilterChange = async (filter = 'today', page = 1) => {
    setActiveDashboardFilter(filter);
    try {
      setIsActivitiesLoading(true);
      const response = await fetch(`/api/admin/dashboard/activity?period=${filter}&page=${page}`,
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


  const handleReviewStatusChange = async (reviewId, status) => {
    const response = await fetch('/api/admin/reviews', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: reviewId, status: status })
    });
    const data = await response.json();
    if (data.success) {
      showToast("Değerlendirme durumu başarıyla güncellendi!", "success");
      setReviews(reviews.map(review => review.id === reviewId ? { ...review, status: status } : review));
    } else {
      showToast("Değerlendirme durumu güncellenemedi", "error");
    }
  };
  const fetchReviews = async () => {
    setIsReviewsLoading(true);
    const response = await fetch(`/api/admin/reviews?page=${currentPage}&filter=${activeReviewFilter}`);
    const data = await response.json();
    setReviews(data.data);
    setTotalCount(data.totalCount);
    setTotalPages(data.totalPages);
    setCurrentPage(data.currentPage);
    setStatsData(data.statsData);
    setIsReviewsLoading(false);
  };


  const [areYouSure, setAreYouSure] = useState({ id: null, action: null });
  const confirmAction = (id, actionName, actionFn) => {
    if (areYouSure.id === id && areYouSure.action === actionName) {
      actionFn(id);
      setAreYouSure({ id: null, action: null });
    } else {
      setAreYouSure({ id, action: actionName });

      setTimeout(() => {
        setAreYouSure({ id: null, action: null });
      }, 3000);
    }
  };


  const [newService, setNewService] = useState({
    id: "",
    name: "",
    minPriceMesai: "",
    maxPriceMesai: "",
    isActive: true
  });

  const [newPackage, setNewPackage] = useState({
    id: "",
    name: "",
    description: "",
    keyAmount: "",
    price: "",
    startdate: new Date(),
    enddate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    isActive: true,
    createdAt: new Date(),
    isUnlimited: true,
  });


  const [locksmithList, setLocksmithList] = useState([]);
  const [locksmithListLoading, setLocksmithListLoading] = useState(true);
  const [locksmithListError, setLocksmithListError] = useState(null);

  const fetchLocksmithList = async () => {
    try {
      setLocksmithListLoading(true);
      const response = await fetch('/api/admin/getLocksmiths');
      const data = await response.json();
      setLocksmithList(data.data);
    } catch (error) {
      setLocksmithList([]);
      setLocksmithListError(error);
    } finally {
      setLocksmithListLoading(false);
    }
  };


  const [servicesList, setServicesList] = useState([]);
  const [servicesListLoading, setServicesListLoading] = useState(true);
  const [servicesListError, setServicesListError] = useState(null);


  const fetchServicesList = async () => {
    try {
      setServicesListLoading(true);
      const response = await fetch('/api/admin/serviceSettings');
      const data = await response.json();
      setServicesList(data.data);
    } catch (error) {
      setServicesList([]);
      setServicesListError(error);
    } finally {
      setServicesListLoading(false);
    }
  };

  const [keyPackagesList, setKeyPackagesList] = useState([]);
  const [keyPackagesListLoading, setKeyPackagesListLoading] = useState(true);
  const [keyPackagesListError, setKeyPackagesListError] = useState(null);

  const fetchKeyPackagesList = async () => {
    try {
      setKeyPackagesListLoading(true);
      const response = await fetch('/api/admin/keyPackages');
      const data = await response.json();
      setKeyPackagesList(data.data);
    } catch (error) {
      setKeyPackagesList([]);
      setKeyPackagesListError(error);
    } finally {
      setKeyPackagesListLoading(false);
    }
  };


  useEffect(() => {
    Promise.all([
      fetchLocksmithList(),
      fetchServicesList(),
      fetchKeyPackagesList(),
      fetchReviews(),
      handleDashboardFilterChange()
    ]);
  }, []);

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

  const handleNewServiceChange = (field, value) => {
    setNewService(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isNewServiceValid = () => {
    return (
      newService.name.trim() !== "" &&
      newService.minPriceMesai !== "" &&
      newService.maxPriceMesai !== "" &&
      Number(newService.minPriceMesai) <= Number(newService.maxPriceMesai)
    );
  };

  const handleAddService = async () => {
    const response = await fetch('/api/admin/serviceSettings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newService)
    });
    const data = await response.json();
    if (data.success) {
      // Modal'ı kapat
      setShowServiceModal(false);

      // Form'u sıfırla
      setNewService({
        id: "",
        name: "",
        minPriceMesai: "",
        maxPriceMesai: "",
        isActive: true
      });

      // Başarılı bildirim göster
      showToast("Yeni hizmet başarıyla eklendi!", "success");
    } else {
      showToast("Hizmet ekleme hatası", "error");
    }
  };

  const handleApproveLocksmith = async (locksmithId) => {
    const response = await fetch('/api/admin/getLocksmiths', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: locksmithId, status: "approved" })
    });
    const data = await response.json();
    if (data.success) {
      showToast("Çilingir başarıyla onaylandı!", "success");
    } else {
      showToast("Çilingir onaylama hatası", "error");
    }
    fetchLocksmithList();
  };

  const handleRejectLocksmith = async (locksmithId) => {
    const response = await fetch('/api/admin/getLocksmiths', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: locksmithId, status: "rejected" })
    });
    const data = await response.json();
    if (data.success) {
      showToast("Çilingir başarıyla pasif edildi!", "success");
    } else {
      showToast("Çilingir pasif edilme hatası", "error");
    }
    fetchLocksmithList();
  };

  const handleNewPackageChange = (field, value) => {
    setNewPackage(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isNewPackageValid = () => {
    return (
      newPackage.name.trim() !== "" &&
      newPackage.keyAmount.toString().trim() !== "" &&
      Number(newPackage.keyAmount) > 0 &&
      newPackage.price.toString().trim() !== "" &&
      Number(newPackage.price) > 0 &&
      (newPackage.isUnlimited ||
        (newPackage.startdate && newPackage.enddate && newPackage.startdate <= newPackage.enddate))
    );
  };

  const handleAddOrUpdatePackage = async () => {
    // Burada API'ye yeni paket eklemek için istek yapılabilir
    const response = await fetch('/api/admin/keyPackages', {
      method: newPackage.id ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newPackage)
    });
    const data = await response.json();
    if (data.success) {
      if (newPackage.id) {
        showToast("Paket başarıyla güncellendi!", "success");
      } else {
        showToast("Paket başarıyla eklendi!", "success");
      }
      // Form'u sıfırla
      setNewPackage({
        name: "",
        description: "",
        keyAmount: "",
        price: "",
        isActive: true,
        isUnlimited: true,
        startdate: null,
        enddate: null
      });
      fetchKeyPackagesList();
    } else {
      showToast("Hata oluştu", "error");
    }
    // Modal'ı kapat
    setShowPackageModal(false);
  };

  const handleDeletePackage = async (packageId) => {
    if (!packageId) {
      showToast("Paket seçilmedi", "error");
      return;
    }

    const response = await fetch('/api/admin/keyPackages', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: packageId })
    });
    const data = await response.json();
    if (data.success) {
      showToast("Paket başarıyla silindi!", "success");
      fetchKeyPackagesList();
    } else {
      showToast("Paket silme hatası", "error");
    }

    setShowDeleteConfirmModal(false);

    setPackageToDelete(null);
  };

  const handleLogout = () => {
    // Supabase'de çıkış yap
    supabase.auth.signOut();

    // Yönlendirme
    router.push('/cilingir/auth/login');
  };

  // Anahtar satın alma talepleri state'leri
  const [keyRequests, setKeyRequests] = useState([]);
  const [keyRequestsLoading, setKeyRequestsLoading] = useState(false);
  const [keyRequestsTotal, setKeyRequestsTotal] = useState(0);
  const [keyRequestsPage, setKeyRequestsPage] = useState(1);
  const [keyRequestsTotalPages, setKeyRequestsTotalPages] = useState(1);
  const [keyRequestFilter, setKeyRequestFilter] = useState('all');
  const [keyRequestSearch, setKeyRequestSearch] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showRequestDetailModal, setShowRequestDetailModal] = useState(false);
  const [requestAdminNote, setRequestAdminNote] = useState('');
  const [requestProcessing, setRequestProcessing] = useState(false);
  const [showRequestApproveModal, setShowRequestApproveModal] = useState(false);
  const [showRequestRejectModal, setShowRequestRejectModal] = useState(false);
  const [requestToProcess, setRequestToProcess] = useState(null);

  // Anahtar taleplerini getir
  const fetchKeyRequests = useCallback(async (page = 1, status = 'all', search = '') => {
    setKeyRequestsLoading(true);
    try {
      const response = await fetch(`/api/admin/keyRequests?page=${page}&status=${status}&search=${search}`);
      const data = await response.json();

      if (response.ok) {
        setKeyRequests(data.transactions || []);
        setKeyRequestsTotal(data.total || 0);
        setKeyRequestsPage(data.page || 1);
        setKeyRequestsTotalPages(data.totalPages || 1);
      } else {
        console.error('Anahtar talepleri getirme hatası:', data.error);
        showToast('Anahtar talepleri getirilemedi.', 'error');
      }
    } catch (error) {
      console.error('Anahtar talepleri getirme hatası:', error);
      showToast('Bir hata oluştu.', 'error');
    } finally {
      setKeyRequestsLoading(false);
    }
  }, []);

  // Anahtar talepleri sayfasını değiştir
  const handleKeyRequestsPageChange = (page) => {
    setKeyRequestsPage(page);
    fetchKeyRequests(page, keyRequestFilter, keyRequestSearch);
  };

  // Anahtar talebi filtre veya arama değiştiğinde
  useEffect(() => {
    fetchKeyRequests(1, keyRequestFilter, keyRequestSearch);
  }, [keyRequestFilter, keyRequestSearch, fetchKeyRequests]);

  // Anahtar talebini görüntüle
  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setShowRequestDetailModal(true);
  };

  // Anahtar talebini onayla modal
  const handleApproveRequest = (requestId) => {
    setRequestToProcess(requestId);
    setRequestAdminNote('');
    setShowRequestApproveModal(true);
  };

  // Anahtar talebini reddet modal
  const handleRejectRequest = (requestId) => {
    setRequestToProcess(requestId);
    setRequestAdminNote('');
    setShowRequestRejectModal(true);
  };

  // Anahtar talebini onayla
  const confirmApproveRequest = async () => {
    setRequestProcessing(true);
    try {
      const response = await fetch('/api/admin/keyRequests', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: requestToProcess,
          status: 'approved',
          adminNote: requestAdminNote
        })
      });

      const data = await response.json();

      if (response.ok) {
        showToast('Talep başarıyla onaylandı.', 'success');
        fetchKeyRequests(keyRequestsPage, keyRequestFilter, keyRequestSearch);
      } else {
        console.error('Talep onaylama hatası:', data.error);
        showToast(data.error || 'Talep onaylanamadı.', 'error');
      }
    } catch (error) {
      console.error('Talep onaylama hatası:', error);
      showToast('Bir hata oluştu.', 'error');
    } finally {
      setRequestProcessing(false);
      setShowRequestApproveModal(false);
      setRequestToProcess(null);
    }
  };

  // Anahtar talebini reddet
  const confirmRejectRequest = async () => {
    setRequestProcessing(true);
    try {
      const response = await fetch('/api/admin/keyRequests', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: requestToProcess,
          status: 'rejected',
          adminNote: requestAdminNote
        })
      });

      const data = await response.json();

      if (response.ok) {
        showToast('Talep reddedildi.', 'success');
        fetchKeyRequests(keyRequestsPage, keyRequestFilter, keyRequestSearch);
      } else {
        console.error('Talep reddetme hatası:', data.error);
        showToast(data.error || 'Talep reddedilemedi.', 'error');
      }
    } catch (error) {
      console.error('Talep reddetme hatası:', error);
      showToast('Bir hata oluştu.', 'error');
    } finally {
      setRequestProcessing(false);
      setShowRequestRejectModal(false);
      setRequestToProcess(null);
    }
  };

  // İlk açılışta anahtar taleplerini getir
  useEffect(() => {
    if (activeTab === 'keyRequests') {
      fetchKeyRequests();
    }
  }, [activeTab, fetchKeyRequests]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Image src="/logo.png" alt="Bi Çilingir" width={40} height={40} />
              <div>
                <h1 className="text-xl font-bold">Bi Çilingir</h1>
                <p className="text-sm text-gray-500">Admin Panel</p>
              </div>
            </div>
            <button
              className="md:hidden p-2 rounded-md hover:bg-gray-100"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setMobileMenuOpen(!mobileMenuOpen);
              }}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="pt-20 pb-10">
          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar */}
            <div className={`md:col-span-3 col-span-12 ${mobileMenuOpen ? 'block' : 'hidden md:block'}`}>
              <Card className="sticky top-20">
                <CardContent className="p-0">
                  <nav className="flex flex-col p-2">
                    <button
                      onClick={() => handleTabChange("dashboard")}
                      className={`flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${activeTab === "dashboard" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                    >
                      <LayoutDashboard className="h-5 w-5" />
                      <span>Dashboard</span>
                      <ChevronRight className={`h-5 w-5 ml-auto transition-transform ${activeTab === "dashboard" ? "rotate-90" : ""}`} />
                    </button>

                    <button
                      onClick={() => handleTabChange("locksmiths")}
                      className={`flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${activeTab === "locksmiths" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                    >
                      <Key className="h-5 w-5" />
                      <span>Çilingir Yönetimi</span>
                      <ChevronRight className={`h-5 w-5 ml-auto transition-transform ${activeTab === "locksmiths" ? "rotate-90" : ""}`} />
                    </button>

                    <button
                      onClick={() => handleTabChange("services")}
                      className={`flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${activeTab === "services" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                    >
                      <Wrench className="h-5 w-5" />
                      <span>Hizmet Yönetimi</span>
                      <ChevronRight className={`h-5 w-5 ml-auto transition-transform ${activeTab === "services" ? "rotate-90" : ""}`} />
                    </button>

                    <button
                      onClick={() => handleTabChange("keyPackages")}
                      className={`flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${activeTab === "keyPackages" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                    >
                      <Key className="h-5 w-5" />
                      <span>Anahtar Paket Yönetimi</span>
                      <ChevronRight className={`h-5 w-5 ml-auto transition-transform ${activeTab === "keyPackages" ? "rotate-90" : ""}`} />
                    </button>

                    <button
                      onClick={() => handleTabChange("keyRequests")}
                      className={`flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${activeTab === "keyRequests" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                    >
                      <ShoppingCart className="h-5 w-5" />
                      <span>Anahtar Talepleri</span>
                      <ChevronRight className={`h-5 w-5 ml-auto transition-transform ${activeTab === "keyRequests" ? "rotate-90" : ""}`} />
                    </button>

                    <button
                      onClick={() => handleTabChange("reviews")}
                      className={`flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${activeTab === "reviews" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                    >
                      <Star className="h-5 w-5" />
                      <span>Değerlendirmeler</span>
                      <ChevronRight className={`h-5 w-5 ml-auto transition-transform ${activeTab === "reviews" ? "rotate-90" : ""}`} />
                    </button>

                    <button
                      onClick={() => handleTabChange("activities")}
                      className={`flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${activeTab === "activities" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                    >
                      <Activity className="h-5 w-5" />
                      <span>Aktivite Geçmişi</span>
                      <ChevronRight className={`h-5 w-5 ml-auto transition-transform ${activeTab === "activities" ? "rotate-90" : ""}`} />
                    </button>

                    <button
                      onClick={() => handleTabChange("kpi")}
                      className={`flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${activeTab === "kpi" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                    >
                      <BarChart3 className="h-5 w-5" />
                      <span>KPI Göstergeleri</span>
                      <ChevronRight className={`h-5 w-5 ml-auto transition-transform ${activeTab === "kpi" ? "rotate-90" : ""}`} />
                    </button>

                    <button
                      onClick={() => handleTabChange("settings")}
                      className={`flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${activeTab === "settings" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                    >
                      <Settings className="h-5 w-5" />
                      <span>Site Ayarları</span>
                      <ChevronRight className={`h-5 w-5 ml-auto transition-transform ${activeTab === "settings" ? "rotate-90" : ""}`} />
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
            <div className="col-span-12 md:col-span-9">
              {activeTab === "dashboard" && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <LayoutDashboard className="h-6 w-6 text-blue-600" />
                      <div>
                        <CardTitle>Dashboard</CardTitle>
                        <CardDescription>Platform genel bakış</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex space-x-2 w-full overflow-x-auto scrollbar-hide scrollbar-thumb-blue-500 scrollbar-track-gray-100">
                        <Button variant="outline" className={`${activeDashboardFilter === 'today' ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}`} onClick={() => handleDashboardFilterChange('today')}>Bugün</Button>
                        <Button variant="outline" className={`${activeDashboardFilter === 'yesterday' ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}`} onClick={() => handleDashboardFilterChange('yesterday')}>Dün</Button>
                        <Button variant="outline" className={`${activeDashboardFilter === 'last7days' ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}`} onClick={() => handleDashboardFilterChange('last7days')}>Son 7 Gün</Button>
                        <Button variant="outline" className={`${activeDashboardFilter === 'last30days' ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}`} onClick={() => handleDashboardFilterChange('last30days')}>Son 30 Gün</Button>
                        <Button variant="outline" className={`${activeDashboardFilter === 'all' ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}`} onClick={() => handleDashboardFilterChange('all')}>Tümü</Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-none hover:shadow-lg transition-all">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-purple-600 mb-1 font-medium">Kaydolan Çilingir</p>
                              <h3 className="text-2xl font-bold text-purple-900">{dashboardStats?.total_locksmiths}</h3>
                              {dashboardStats?.total_locksmiths_percent != 0 && <p className="text-sm text-purple-600 mt-2 flex items-center">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                %{dashboardStats?.total_locksmiths_percent} artış
                              </p>}
                            </div>
                            <div className="bg-purple-500 p-3 rounded-full">
                              <Key className="h-8 w-8 text-white" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-none hover:shadow-lg transition-all">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-blue-600 mb-1 font-medium">Kaydolan Kullanıcı</p>
                              <h3 className="text-2xl font-bold text-blue-900">{dashboardStats?.total_users}</h3>
                              {dashboardStats?.total_users_percent != 0 && <p className="text-sm text-blue-600 mt-2 flex items-center">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                %{dashboardStats?.total_users_percent} artış
                              </p>}
                            </div>
                            <div className="bg-blue-500 p-3 rounded-full">
                              <UserCheck className="h-8 w-8 text-white" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-none hover:shadow-lg transition-all">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-green-600 mb-1 font-medium">Eklenen Aktivite Logları</p>
                              <h3 className="text-2xl font-bold text-green-900">{dashboardStats?.total_activity_logs}</h3>
                              {dashboardStats?.total_activity_logs_percent != 0 && <p className="text-sm text-green-600 mt-2 flex items-center">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                %{dashboardStats?.total_activity_logs_percent} artış
                              </p>}
                              <p className="text-sm text-green-700 mt-2 flex items-center">
                                Anahtar (Günlük/Kullanılan) : {dashboardStats?.total_daily_key_usage}/{dashboardStats?.total_key_usage}
                              </p>
                            </div>
                            <div className="bg-green-500 p-3 rounded-full">
                              <Clock className="h-8 w-8 text-white" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* İkinci Sıra İstatistikler */}
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

                    <div className="mb-6">
                      <h4 className="font-medium mb-4 flex items-center text-gray-700">
                        <Clock className="h-5 w-5 mr-2 text-blue-600" />
                        Son Aktiviteler
                      </h4>
                      {isActivitiesLoading ? (
                        <div className="flex justify-center items-center p-12">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                      ) : activityList?.length > 0 && activityList ? (
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
                      <div className="mt-4 text-center">
                        {totalPagesActivities == 1 && (
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
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "locksmiths" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Çilingir Yönetimi</CardTitle>
                    <CardDescription>Tüm çilingirleri görüntüle ve yönet</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-6">
                      <Input
                        placeholder="Çilingir ara..." className="max-w-sm" />
                    </div>
                    {locksmithListLoading ? (
                      <div className="flex justify-center items-center h-48">
                        <Loader2 className="h-8 w-8 animate-spin" />
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        {/* if any error, show error message */}
                        {locksmithListError && (
                          <div className="flex justify-center items-center h-48">
                            <p className="text-red-500">Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.</p>
                          </div>
                        )}
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-3">Çilingir ID</th>
                              <th className="text-left p-3">İşletme Adı</th>
                              <th className="text-left p-3">Bölge</th>
                              <th className="text-left p-3">Durum</th>
                              <th className="text-left p-3">Aktiflik</th>
                              <th className="text-left p-3">Created At</th>
                              <th className="text-left p-3">İşlemler</th>
                            </tr>
                          </thead>
                          <tbody>
                            {locksmithList && locksmithList?.map((locksmith) => (
                              <tr key={locksmith.id} className="border-b hover:bg-gray-50">
                                <td className="p-3">{locksmith.id.slice(0, 5)}</td>
                                <td className="p-3">{locksmith.businessname}</td>
                                <td className="p-3">{locksmith.provinces.name} / {locksmith.districts.name}</td>
                                <td className="p-3">
                                  <span className={`px-2 py-1 rounded-full text-xs ${locksmith.status === "approved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                                    {locksmith.status === "approved" ? "Onaylandı" : locksmith.status === "pending" ? "Beklemede" : "Reddedildi"}
                                  </span>
                                </td>
                                <td className="p-3">
                                  <span className={`px-2 py-1 rounded-full text-xs ${locksmith.isactive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                    {locksmith.isactive ? "Aktif" : "Pasif"}
                                  </span>
                                </td>
                                <td className="p-3">{new Date(locksmith.createdat).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                                <td className="p-3">
                                  <div className="flex space-x-2">
                                    {locksmith.status === "pending" && <Button
                                      onClick={() => {
                                        confirmAction(locksmith.id, "approveLocksmith", handleApproveLocksmith);
                                      }}
                                      variant="outline" size="sm" className={`${areYouSure.id === locksmith.id && areYouSure.action === "approveLocksmith" ? "text-white! bg-green-500!" : "text-green-500 border-green-200 hover:bg-green-50"}`}>
                                      {areYouSure.id === locksmith.id && areYouSure.action === "approveLocksmith" ? "Eminim!" : "Onayla"}
                                    </Button>}
                                    {locksmith.status === "pending" && <Button
                                      onClick={() => {
                                        confirmAction(locksmith.id, "rejectLocksmith", handleRejectLocksmith);
                                      }}
                                      variant="outline" size="sm" className={`${areYouSure.id === locksmith.id && areYouSure.action === "rejectLocksmith" ? "text-white! bg-red-500!" : "text-red-500 border-red-200 hover:bg-red-50"}`}>
                                      {areYouSure.id === locksmith.id && areYouSure.action === "rejectLocksmith" ? "Eminim!" : "Reddet"}
                                    </Button>}
                                    <Link href={`/cilingir`}>
                                      <Button variant="outline" size="sm">Panel</Button>
                                    </Link>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {activeTab === "services" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Hizmet Yönetimi</CardTitle>
                    <CardDescription>Platformdaki hizmetleri yönet</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-start items-center mb-6">
                      <Button onClick={() => {
                        setNewService({
                          id: "",
                          name: "",
                          minPriceMesai: "",
                          maxPriceMesai: "",
                          isActive: true
                        });
                        setShowServiceModal(true)
                      }}>Yeni Hizmet</Button>
                    </div>
                    <div className="overflow-x-auto">
                      {servicesListError && (
                        <div className="flex justify-center items-center h-48">
                          <p className="text-red-500">Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.</p>
                        </div>
                      )}
                      {servicesListLoading ? (
                        <div className="flex justify-center items-center h-48">
                          <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                      ) : (<table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-3">Hizmet Adı</th>
                            <th className="text-left p-3">Mesai Tarifesi</th>
                            <th className="text-left p-3">Akşam Tarifesi</th>
                            <th className="text-left p-3">Gece Tarifesi</th>
                            <th className="text-left p-3">isActive</th>
                            <th className="text-left p-3">İşlemler</th>
                          </tr>
                        </thead>
                        <tbody>
                          {servicesList && servicesList?.map((service) => (
                            <tr key={service.id} className="border-b hover:bg-gray-50">
                              <td className="p-3">{service.name}</td>
                              <td className="p-3">{service.minPriceMesai}₺-{service.maxPriceMesai}₺</td>
                              <td className="p-3">{service.minPriceAksam}₺-{service.maxPriceAksam}₺</td>
                              <td className="p-3">{service.minPriceGece}₺-{service.maxPriceGece}₺</td>
                              <td className="p-3">
                                <span className={`px-2 py-1 rounded-full text-xs ${service.isActive ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                                  {service.isActive ? "Aktif" : "Kapalı"}
                                </span></td>
                              <td className="p-3">
                                <div className="flex space-x-2">
                                  <Button
                                    onClick={() => {
                                      setNewService(service);
                                      setShowServiceModal(true);
                                    }}
                                    variant="outline" size="sm">Düzenle</Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "keyPackages" && (
                <>
                  <Card>
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center space-x-2">
                          <Package className="h-5 w-5 text-blue-600" />
                          <CardTitle className="text-lg">Anahtar Paketleri</CardTitle>
                        </div>
                        <Button
                          size="sm"
                          className="bg-blue-600 w-full sm:w-auto"
                          onClick={() => {
                            setNewPackage({
                              id: "",
                              name: "",
                              description: "",
                              price: "",
                              startdate: null,
                              enddate: null,
                              keyAmount: "",
                              isUnlimited: true,
                              isActive: true,
                            });
                            setShowPackageModal(true)
                          }}
                        >
                          <Plus className="h-4 w-4 mr-1" /> Yeni Paket
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        {keyPackagesList && keyPackagesList.length > 0 ? keyPackagesList.map((packet, index) => (
                          <Card key={index} className="hover:shadow-md transition-all">
                            <CardContent className="p-4">
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                <div className="space-y-2 w-full sm:w-auto">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-medium text-gray-900 text-lg">{packet.name}</h4>
                                    {packet.isActive ? (
                                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                        Aktif
                                      </span>
                                    ) : (
                                      <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                                        Pasif
                                      </span>
                                    )}
                                  </div>
                                  {packet.description && (
                                    <p className="text-sm text-gray-500 line-clamp-2">{packet.description}</p>
                                  )}
                                  <div className="flex flex-wrap items-center gap-3">
                                    <div className="flex items-center bg-orange-50 px-2 py-1 rounded">
                                      <Key className="h-4 w-4 text-orange-500 mr-1" />
                                      <span className="text-sm font-semibold text-orange-700">{packet.keyAmount.toLocaleString('tr-TR')}</span>
                                    </div>
                                    <div className="flex items-center bg-green-50 px-2 py-1 rounded">
                                      <span className="text-sm font-semibold text-green-700">₺{packet.price.toLocaleString('tr-TR')}</span>
                                    </div>
                                    {packet.keyAmount > 0 && packet.price > 0 && (
                                      <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
                                        <span className="text-sm font-semibold text-blue-700">
                                          {(packet.price / packet.keyAmount).toFixed(2)} ₺/anahtar
                                        </span>
                                      </div>
                                    )}
                                    <div className="flex items-center py-1 rounded">
                                      <span className={`text-sm font-semibold p-1 rounded ${packet.isActive ? "text-green-700 bg-green-50" : "text-red-700 bg-red-50"}`}>{packet.isActive ? "Aktif" : "Kapalı"}</span>
                                    </div>
                                  </div>
                                  {!packet.isUnlimited && (
                                    <div className="text-xs text-gray-500">
                                      {packet.startdate ? new Date(packet.startdate).toLocaleDateString('tr-TR') : '-'} - {packet.enddate ? new Date(packet.enddate).toLocaleDateString('tr-TR') : '-'}
                                    </div>
                                  )}
                                  {packet.isUnlimited && (
                                    <div className="text-xs text-violet-600 font-medium">
                                      Süresiz Paket
                                    </div>
                                  )}
                                </div>
                                <div className="flex space-x-2 w-full sm:w-auto justify-end mt-3 sm:mt-0">
                                  <Button
                                    onClick={() => {
                                      setNewPackage(packet)
                                      setShowPackageModal(true)
                                    }}
                                    size="sm" variant="outline"
                                    className="flex-1 sm:flex-none"
                                  >
                                    <Edit className="h-4 w-4 mr-1 sm:mr-0" />
                                    <span className="sm:hidden">Düzenle</span>
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      setPackageToDelete(packet);
                                      setShowDeleteConfirmModal(true);
                                    }}
                                    size="sm" variant="outline"
                                    className="text-red-500 border-red-200 hover:bg-red-50 flex-1 sm:flex-none"
                                  >
                                    <Trash2 className="h-4 w-4 mr-1 sm:mr-0" />
                                    <span className="sm:hidden">Sil</span>
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )) : (
                          <div className="text-center py-6 text-gray-500">
                            Henüz paket tanımlanmamış
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {activeTab === "keyRequests" && (
                <Card>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center space-x-2">
                        <ShoppingCart className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-lg">Anahtar Satınalma Talepleri</CardTitle>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <select
                          value={keyRequestFilter}
                          onChange={(e) => setKeyRequestFilter(e.target.value)}
                          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="all">Tüm Talepler</option>
                          <option value="pending">Bekleyen</option>
                          <option value="approved">Onaylanmış</option>
                          <option value="completed">Tamamlanmış</option>
                          <option value="rejected">Reddedilmiş</option>
                          <option value="cancelled">İptal Edilmiş</option>
                        </select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 border-b text-xs sm:text-sm">
                            <th className="text-left p-3 font-medium text-gray-500">Tarih</th>
                            <th className="text-left p-3 font-medium text-gray-500">Çilingir</th>
                            <th className="text-left p-3 font-medium text-gray-500">Paket</th>
                            <th className="text-left p-3 font-medium text-gray-500">Miktar</th>
                            <th className="text-left p-3 font-medium text-gray-500">Tutar</th>
                            <th className="text-left p-3 font-medium text-gray-500">Durum</th>
                            <th className="text-right p-3 font-medium text-gray-500">İşlemler</th>
                          </tr>
                        </thead>
                        <tbody>
                          {keyRequestsLoading ? (
                            <tr>
                              <td colSpan={7} className="text-center py-4 text-gray-500">
                                <div className="flex justify-center items-center space-x-2">
                                  <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  <span>Yükleniyor...</span>
                                </div>
                              </td>
                            </tr>
                          ) : keyRequests.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="text-center py-4 text-gray-500">
                                Anahtar talebi bulunamadı
                              </td>
                            </tr>
                          ) : (
                            keyRequests.map((request) => (
                              <tr key={request.id} className="border-b hover:bg-gray-50 text-xs sm:text-sm">
                                <td className="p-3">
                                  <div>{new Date(request.createdat).toLocaleDateString('tr-TR')}</div>
                                  <div className="text-xs text-gray-500">
                                    {new Date(request.createdat).toLocaleTimeString('tr-TR')}
                                  </div>
                                </td>
                                <td className="p-3">
                                  <div className="font-medium">{request.locksmiths?.fullname}</div>
                                  <div className="text-xs text-gray-500">{request.locksmiths?.email}</div>
                                </td>
                                <td className="p-3">{request.key_packages?.name}</td>
                                <td className="p-3">
                                  <div className="flex items-center space-x-1">
                                    <Key className="h-3.5 w-3.5 text-blue-600" />
                                    <span>{request.key_packages?.keyAmount.toLocaleString('tr-TR')}</span>
                                  </div>
                                </td>
                                <td className="p-3">₺{request.paidamount.toLocaleString('tr-TR')}</td>
                                <td className="p-3">
                                  <span className={`px-2 py-1 rounded-full text-xs ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                    request.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                                      request.status === 'completed' ? 'bg-green-100 text-green-700' :
                                        request.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                          'bg-gray-100 text-gray-700'
                                    }`}>
                                    {
                                      request.status === 'pending' ? 'Beklemede' :
                                        request.status === 'approved' ? 'Onaylandı' :
                                          request.status === 'completed' ? 'Tamamlandı' :
                                            request.status === 'rejected' ? 'Reddedildi' :
                                              request.status === 'cancelled' ? 'İptal Edildi' : request.status
                                    }
                                  </span>
                                </td>
                                <td className="p-3 text-right">
                                  <div className="flex justify-end space-x-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleViewRequest(request)}
                                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                    >
                                      <Eye className="h-3.5 w-3.5" />
                                    </Button>
                                    {request.status === 'pending' && (
                                      <>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleApproveRequest(request.id)}
                                          className="text-green-600 border-green-200 hover:bg-green-50"
                                        >
                                          <CheckCircle className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleRejectRequest(request.id)}
                                          className="text-red-600 border-red-200 hover:bg-red-50"
                                        >
                                          <X className="h-3.5 w-3.5" />
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    {keyRequests.length > 0 && (
                      <div className="flex justify-between items-center p-4 border-t">
                        <div className="text-sm text-gray-500">
                          Toplam {keyRequestsTotal} talep
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={keyRequestsPage === 1}
                            onClick={() => handleKeyRequestsPageChange(keyRequestsPage - 1)}
                          >
                            Önceki
                          </Button>
                          <span className="px-3 py-2 text-sm">
                            Sayfa {keyRequestsPage} / {keyRequestsTotalPages}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={keyRequestsPage === keyRequestsTotalPages}
                            onClick={() => handleKeyRequestsPageChange(keyRequestsPage + 1)}
                          >
                            Sonraki
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {activeTab === "reviews" && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <Star className="h-6 w-6 text-yellow-500" />
                      <div>
                        <CardTitle>Değerlendirmeler</CardTitle>
                        <CardDescription>Kullanıcı değerlendirmelerini kontrol edin ve yönetin</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      {/* Ortalama Değerlendirme Puanı ve Yıldız Özeti */}
                      <Card className="mb-6">
                        <CardContent>
                          <div>
                            <div className="flex items-center space-x-4 mb-4">
                              <div className="text-center">
                                <div className="text-4xl font-bold">{statsData.avgRating}</div>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <svg key={i} className={`w-5 h-5 ${i < 5 ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                    </svg>
                                  ))}
                                </div>
                                <div className="text-sm text-gray-500">{statsData.totalReviews} değerlendirme</div>
                              </div>

                              <div className="flex-1">
                                {[5, 4, 3, 2, 1].map((rating) => (
                                  <div key={rating} className="flex items-center space-x-2 mb-1">
                                    <div className="text-sm w-2">{rating}</div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <div
                                        className="bg-yellow-400 h-2 rounded-full"
                                        style={{ width: `${rating === 5 ? statsData.fiveStar : rating === 4 ? statsData.fourStar : rating === 3 ? statsData.threeStar : rating === 2 ? statsData.twoStar : statsData.oneStar}%` }}
                                      ></div>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {rating === 5 ? statsData.fiveStar : rating === 4 ? statsData.fourStar : rating === 3 ? statsData.threeStar : rating === 2 ? statsData.twoStar : statsData.oneStar}%
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            {/* <div className="flex flex-wrap gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                              >
                                Tüm Yıldızlar
                              </Button>
                              {[5, 4, 3, 2, 1].map((star) => (
                                <Button 
                                  key={star}
                                  variant="outline" 
                                  size="sm"
                                  className="hover:bg-yellow-50"
                                >
                                  <Star className="h-3.5 w-3.5 mr-1 text-yellow-400 fill-yellow-400" />
                                  {star}
                                </Button>
                              ))}
                            </div> */}
                          </div>
                        </CardContent>
                      </Card>

                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div className="flex items-center gap-2 w-full overflow-x-auto hide-scrollbar">
                          <Button
                            variant="outline"
                            onClick={() => handleReviewFilterChange("pending")}
                            size="sm"
                            className={`hover:bg-yellow-50 ${activeReviewFilter === "pending" ? "bg-yellow-50 text-yellow-700" : ""}`}
                          >
                            Onay Bekleyen
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleReviewFilterChange("approved")}
                            size="sm"
                            className={`hover:bg-green-50 ${activeReviewFilter === "approved" ? "bg-green-50 text-green-700" : ""}`}
                          >
                            Onaylanmış
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleReviewFilterChange("rejected")}
                            size="sm"
                            className={`hover:bg-red-50 ${activeReviewFilter === "rejected" ? "bg-red-50 text-red-700" : ""}`}
                          >
                            Reddedilmiş
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {
                          isReviewsLoading && (
                            <div className="text-center text-gray-500">
                              Yükleniyor...
                            </div>
                          )
                        }
                        {!isReviewsLoading && reviews && reviews.length === 0 && (
                          <div className="text-center text-gray-500">
                            Henüz bekleyen değerlendirme yok
                          </div>
                        )
                        }
                        {!isReviewsLoading && reviews && reviews.length > 0 && reviews.map((review) => (
                          <Card key={review.id} className={`hover:shadow-md ${review.users.islocksmith && "bg-red-50"} transition-all ${review.status === "waiting" ? "border-l-4 border-l-yellow-400" :
                            review.status === "approved" ? "border-l-4 border-l-green-400" :
                              "border-l-4 border-l-red-400"
                            }`}>
                            <CardContent className="p-4">
                              <div className="flex flex-col md:flex-row justify-between">
                                <div className="mb-3 md:mb-0">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h3 className="font-semibold text-gray-900">{review.users.islocksmith ? "Çilingir" : "Müşteri"}{review.users.issuspicious && " - Şüpheli"}</h3>
                                    <span className="text-sm text-gray-500">→</span>
                                    <span className="font-medium text-blue-600">{review.locksmiths.businessname}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs ${review.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                                      review.status === "approved" ? "bg-green-100 text-green-800" :
                                        "bg-red-100 text-red-800"
                                      }`}>
                                      {review.status === "pending" ? "Onay Bekliyor" :
                                        review.status === "approved" ? "Onaylandı" :
                                          "Reddedildi"}
                                    </span>
                                  </div>
                                  <div className="flex items-center mb-2">
                                    <div className="flex mr-2">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                          key={star}
                                          className={`h-4 w-4 ${star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-sm text-gray-500">{new Date(review.createdat).toLocaleDateString('tr-TR') + ' ' + new Date(review.createdat).toLocaleTimeString('tr-TR').slice(0, 5)}</span>
                                    <span className="mx-2 text-sm text-gray-300">•</span>
                                    <span className="text-sm text-gray-500">{review.locksmiths.provinces.name}</span>
                                  </div>
                                  <p className="text-gray-700">{review.comment}</p>
                                </div>
                                <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2">
                                  {review.status === "pending" && (
                                    <>
                                      <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleReviewStatusChange(review.id, "approved")}>
                                        <CheckCircle className="h-4 w-4 mr-1" /> Onayla
                                      </Button>
                                      <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleReviewStatusChange(review.id, "rejected")}>
                                        <XCircle className="h-4 w-4 mr-1" /> Reddet
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      {!isReviewsLoading && <div className="flex md:flex-row flex-col justify-between items-center mt-6">
                        <div className="text-sm text-gray-500 md:mb-0 mb-2">
                          Toplam {totalCount} değerlendirme gösteriliyor
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" disabled={currentPage === 1 || totalPages === 0} onClick={() => {
                            setCurrentPage(currentPage - 1);
                          }}>Önceki</Button>
                          {Array.from({ length: totalPages }, (_, index) => (
                            <Button key={index} variant="outline" size="sm" className={`bg-blue-50 text-blue-600 ${currentPage === index + 1 ? 'bg-blue-100 text-blue-700' : ''}`} onClick={() => setCurrentPage(index + 1)}>
                              {index + 1}
                            </Button>
                          ))}
                          <Button variant="outline" size="sm" disabled={currentPage === totalPages || totalPages === 0} onClick={() => {
                            setCurrentPage(currentPage + 1);
                          }}>Sonraki</Button>
                        </div>
                      </div>}
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "activities" && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <Activity className="h-6 w-6 text-blue-600" />
                      <div>
                        <CardTitle>Aktivite Geçmişi</CardTitle>
                        <CardDescription>Platform üzerindeki tüm önemli aktiviteleri takip edin</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className={`bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100`}
                          >
                            Tüm Aktiviteler
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                          >
                            Çilingir
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                          >
                            Kullanıcı
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                          >
                            Değerlendirmeler
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                          >
                            Aramalar
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-0.5">
                        {[
                          {
                            id: 1,
                            type: "locksmith",
                            title: "Yeni çilingir kaydoldu",
                            description: "Hızlı Çilingir - İstanbul, Kadıköy bölgesinde",
                            time: "17 Mart 2024, 14:30",
                            icon: <Key className="h-5 w-5" />,
                            color: "blue"
                          },
                          {
                            id: 2,
                            type: "review",
                            title: "Yeni değerlendirme",
                            description: "Ahmet Yılmaz → Hızlı Çilingir - 5 yıldız",
                            time: "17 Mart 2024, 14:20",
                            icon: <Star className="h-5 w-5" />,
                            color: "yellow"
                          },
                          {
                            id: 3,
                            type: "call",
                            title: "Çilingir arandı",
                            description: "Mehmet Kaya → Usta Çilingir",
                            time: "17 Mart 2024, 13:45",
                            icon: <PhoneCall className="h-5 w-5" />,
                            color: "green"
                          },
                          {
                            id: 4,
                            type: "view",
                            title: "Çilingir profili görüntülendi",
                            description: "Pro Çilingir - 24 görüntülenme",
                            time: "17 Mart 2024, 13:30",
                            icon: <Eye className="h-5 w-5" />,
                            color: "purple"
                          },
                          {
                            id: 5,
                            type: "user",
                            title: "Yeni kullanıcı kaydı",
                            description: "Ayşe Demir - Mobil uygulama üzerinden",
                            time: "17 Mart 2024, 13:15",
                            icon: <UserCheck className="h-5 w-5" />,
                            color: "green"
                          },
                          {
                            id: 6,
                            type: "rocket",
                            title: "Roket paketi satın alındı",
                            description: "Hızlı Çilingir - Pro Paket (7000 Roket)",
                            time: "17 Mart 2024, 12:45",
                            icon: <Rocket className="h-5 w-5" />,
                            color: "orange"
                          },
                          {
                            id: 7,
                            type: "locksmith",
                            title: "Çilingir bilgileri güncellendi",
                            description: "Anahtar Çilingir - Hizmet alanı genişletildi",
                            time: "17 Mart 2024, 12:30",
                            icon: <Edit className="h-5 w-5" />,
                            color: "blue"
                          },
                          {
                            id: 8,
                            type: "view",
                            title: "Hizmet sayfası görüntülendi",
                            description: "Kapı Açma hizmeti - 47 görüntülenme",
                            time: "17 Mart 2024, 11:50",
                            icon: <Eye className="h-5 w-5" />,
                            color: "purple"
                          },
                          {
                            id: 9,
                            type: "call",
                            title: "Acil çağrı bildirimi",
                            description: "Beşiktaş bölgesinde kapı açma talebi",
                            time: "17 Mart 2024, 11:20",
                            icon: <AlertCircle className="h-5 w-5" />,
                            color: "red"
                          },
                          {
                            id: 10,
                            type: "review",
                            title: "Değerlendirme onaylandı",
                            description: "Yönetici tarafından - Mehmet Kaya → Usta Çilingir",
                            time: "17 Mart 2024, 11:05",
                            icon: <CheckCircle className="h-5 w-5" />,
                            color: "green"
                          }
                        ].map((activity) => (
                          <Card key={activity.id} className="hover:shadow-sm transition-all">
                            <CardContent className="p-4">
                              <div className="flex items-center">
                                <div className={`p-2 rounded-lg mr-4 
                                  ${activity.color === "blue" ? "bg-blue-100 text-blue-600" :
                                    activity.color === "yellow" ? "bg-yellow-100 text-yellow-600" :
                                      activity.color === "red" ? "bg-red-100 text-red-600" :
                                        "bg-green-100 text-green-600"}`}>
                                  {activity.icon}
                                </div>
                                <div className="flex-grow">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className="font-medium text-gray-900">{activity.title}</p>
                                      <p className="text-sm text-gray-500">{activity.description}</p>
                                    </div>
                                    <span className="text-sm text-gray-400">{activity.time}</span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      <div className="flex justify-between items-center mt-6">
                        <div className="text-sm text-gray-500">
                          Son 10 aktivite gösteriliyor
                        </div>
                        <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                          <History className="h-4 w-4 mr-2" />
                          Daha Fazla Yükle
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "kpi" && (
                <Card>
                  <CardHeader>
                    <CardTitle>KPI Göstergeleri</CardTitle>
                    <CardDescription>Platform performans metrikleri</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Filtreler */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Zaman Aralığı</label>
                        <Select defaultValue={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Zaman aralığı seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Son 24 Saat</SelectItem>
                            <SelectItem value="7">Son 7 Gün</SelectItem>
                            <SelectItem value="30">Son 30 Gün</SelectItem>
                            <SelectItem value="90">Son 3 Ay</SelectItem>
                            <SelectItem value="custom">Özel Aralık</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {selectedTimeRange === "custom" && (
                        <div>
                          <label className="block text-sm font-medium mb-2">Tarih Aralığı</label>
                          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium mb-2">İl</label>
                        <Select defaultValue={selectedCity} onValueChange={setSelectedCity}>
                          <SelectTrigger>
                            <SelectValue placeholder="İl seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tüm İller</SelectItem>
                            <SelectItem value="istanbul">İstanbul</SelectItem>
                            <SelectItem value="ankara">Ankara</SelectItem>
                            <SelectItem value="izmir">İzmir</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">İlçe</label>
                        <Select defaultValue={selectedDistrict} onValueChange={setSelectedDistrict}>
                          <SelectTrigger>
                            <SelectValue placeholder="İlçe seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tüm İlçeler</SelectItem>
                            <SelectItem value="kadikoy">Kadıköy</SelectItem>
                            <SelectItem value="besiktas">Beşiktaş</SelectItem>
                            <SelectItem value="sisli">Şişli</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Ana Metrikler */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="bg-blue-500 p-3 rounded-full">
                              <UserPlus className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex items-center text-green-600">
                              <ArrowUpRight className="h-4 w-4 mr-1" />
                              <span className="text-sm">+12%</span>
                            </div>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-800 mb-1">1,234</h3>
                          <p className="text-sm text-gray-600">Kayıtlı Çilingir</p>
                          <div className="mt-4 h-1 w-full bg-blue-200 rounded">
                            <div className="h-1 bg-blue-500 rounded" style={{ width: '75%' }}></div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="bg-purple-500 p-3 rounded-full">
                              <PhoneCall className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex items-center text-green-600">
                              <ArrowUpRight className="h-4 w-4 mr-1" />
                              <span className="text-sm">+8%</span>
                            </div>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-800 mb-1">5,678</h3>
                          <p className="text-sm text-gray-600">Toplam Arama</p>
                          <div className="mt-4 h-1 w-full bg-purple-200 rounded">
                            <div className="h-1 bg-purple-500 rounded" style={{ width: '65%' }}></div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="bg-green-500 p-3 rounded-full">
                              <Eye className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex items-center text-green-600">
                              <ArrowUpRight className="h-4 w-4 mr-1" />
                              <span className="text-sm">+15%</span>
                            </div>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-800 mb-1">25,431</h3>
                          <p className="text-sm text-gray-600">Tekil Ziyaretçi</p>
                          <div className="mt-4 h-1 w-full bg-green-200 rounded">
                            <div className="h-1 bg-green-500 rounded" style={{ width: '85%' }}></div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Roket Metrikleri */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <CardTitle className="text-lg">Roket Dengesi</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                              <div className="flex items-center">
                                <Rocket className="h-5 w-5 text-green-600 mr-2" />
                                <span>Yüklenen Roket</span>
                              </div>
                              <span className="font-bold text-green-600">+15,000</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                              <div className="flex items-center">
                                <Rocket className="h-5 w-5 text-red-600 mr-2" />
                                <span>Harcanan Roket</span>
                              </div>
                              <span className="font-bold text-red-600">-8,500</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                              <div className="flex items-center">
                                <Rocket className="h-5 w-5 text-blue-600 mr-2" />
                                <span>Mevcut Bakiye</span>
                              </div>
                              <span className="font-bold text-blue-600">6,500</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <CardTitle className="text-lg">Roket Kullanım Trendi</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[200px] flex items-end space-x-2">
                            {[40, 25, 35, 45, 55, 45, 40].map((height, index) => (
                              <div key={index} className="flex-1 bg-blue-100 h-full rounded-t relative group">
                                <div
                                  className="absolute bottom-0 w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                                  style={{ height: `${height}%` }}
                                >
                                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs">
                                    {height * 100}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-between mt-2 text-sm text-gray-500 px-5">
                            <span>Pzt</span>
                            <span>Sal</span>
                            <span>Çar</span>
                            <span>Per</span>
                            <span>Cum</span>
                            <span>Cmt</span>
                            <span>Paz</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Detaylı Metrikler */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <CardTitle className="text-lg">Çilingir Dağılımı</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Aktif Çilingirler</span>
                              <span className="font-bold text-green-600">856</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Pasif Çilingirler</span>
                              <span className="font-bold text-red-600">378</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Onay Bekleyenler</span>
                              <span className="font-bold text-yellow-600">45</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full mt-2">
                              <div className="h-2 bg-green-500 rounded-full" style={{ width: '65%' }}></div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <CardTitle className="text-lg">Hizmet Dağılımı</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Kapı Açma</span>
                              <span className="font-bold">45%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full">
                              <div className="h-2 bg-blue-500 rounded-full" style={{ width: '45%' }}></div>
                            </div>

                            <div className="flex justify-between items-center">
                              <span className="text-sm">Çilingir</span>
                              <span className="font-bold">30%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full">
                              <div className="h-2 bg-purple-500 rounded-full" style={{ width: '30%' }}></div>
                            </div>

                            <div className="flex justify-between items-center">
                              <span className="text-sm">Kilit Değişimi</span>
                              <span className="font-bold">25%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full">
                              <div className="h-2 bg-green-500 rounded-full" style={{ width: '25%' }}></div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <CardTitle className="text-lg">Müşteri Memnuniyeti</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center mb-4">
                            <div className="text-3xl font-bold text-green-600">4.8</div>
                            <div className="flex justify-center my-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className={`h-5 w-5 ${star <= 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                              ))}
                            </div>
                            <div className="text-sm text-gray-500">1,234 değerlendirme</div>
                          </div>
                          <div className="space-y-2">
                            {[5, 4, 3, 2, 1].map((rating) => (
                              <div key={rating} className="flex items-center space-x-2">
                                <span className="text-sm w-3">{rating}</span>
                                <div className="flex-1 h-2 bg-gray-100 rounded-full">
                                  <div
                                    className="h-2 bg-yellow-400 rounded-full"
                                    style={{ width: `${rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 5 : rating === 2 ? 3 : 2}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm text-gray-500 w-8">
                                  {rating === 5 ? "70%" : rating === 4 ? "20%" : rating === 3 ? "5%" : rating === 2 ? "3%" : "2%"}
                                </span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "settings" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Site Ayarları</CardTitle>
                    <CardDescription>Platform ayarlarını yapılandır</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium mb-2">Genel Ayarlar</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm mb-1">Site Başlığı</label>
                            <Input defaultValue="Bi Çilingir" />
                          </div>
                          <div>
                            <label className="block text-sm mb-1">Site Açıklaması</label>
                            <Input defaultValue="En yakın çilingiri bul" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">İletişim Bilgileri</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm mb-1">E-posta Adresi</label>
                            <Input defaultValue="info@bicilingir.com" />
                          </div>
                          <div>
                            <label className="block text-sm mb-1">Telefon Numarası</label>
                            <Input defaultValue="+90 212 123 4567" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Sosyal Medya</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm mb-1">Facebook</label>
                            <Input defaultValue="https://www.facebook.com/people/bicilingir/61575247862332" />
                          </div>
                          <div>
                            <label className="block text-sm mb-1">Instagram</label>
                            <Input defaultValue="https://instagram.com/bi_cilingir" />
                          </div>
                        </div>
                      </div>

                      <div className="pt-4">
                        <Button>Değişiklikleri Kaydet</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hizmet Ekleme Modal */}
      <Dialog open={showServiceModal} onOpenChange={setShowServiceModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Yeni Hizmet Ekle</DialogTitle>
            <DialogDescription>
              Platformda kullanılacak yeni bir hizmet tanımı ekleyin.
              {newService.id ? `(ID: ${newService.id})` : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="service-name" className="text-right text-sm font-medium">
                Hizmet Adı
              </label>
              <Input
                id="service-name"
                placeholder="Örn: Kasa Açma"
                className="col-span-3"
                value={newService.name}
                onChange={(e) => handleNewServiceChange("name", e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4">
              <label htmlFor="min-price" className="text-right w-36 text-sm font-medium">
                Mesai Fiyat
              </label>
              <div className="flex items-center gap-4">
                <div className="col-span-3 flex items-center">
                  <Input
                    id="min-price"
                    type="number"
                    placeholder="150"
                    value={newService.minPriceMesai}
                    onChange={(e) => handleNewServiceChange("minPriceMesai", e.target.value)}
                    className="w-3/4"
                  />
                  <span className="ml-2 text-sm font-medium">₺</span>
                </div>
                <div className="text-sm font-medium"> - </div>
                <div className="col-span-3 flex items-center">
                  <Input
                    id="max-price"
                    type="number"
                    placeholder="300"
                    value={newService.maxPriceMesai}
                    onChange={(e) => handleNewServiceChange("maxPriceMesai", e.target.value)}
                    className="w-3/4"
                  />
                  <span className="ml-2 text-sm font-medium">₺</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label htmlFor="min-price" className="text-right w-36 text-sm font-medium">
                Akşam Fiyat
              </label>
              <div className="flex items-center gap-4">
                <div className="col-span-3 flex items-center">
                  <Input
                    id="min-price"
                    type="number"
                    disabled={true}
                    placeholder="150"
                    value={newService.minPriceMesai * 1.5}
                    onChange={(e) => handleNewServiceChange("minPriceMesai", e.target.value)}
                    className="w-3/4"
                  />
                  <span className="ml-2 text-sm font-medium">₺</span>
                </div>
                <div className="text-sm font-medium"> - </div>
                <div className="col-span-3 flex items-center">
                  <Input
                    id="max-price"
                    type="number"
                    disabled={true}
                    placeholder="300"
                    value={newService.maxPriceMesai * 1.5}
                    onChange={(e) => handleNewServiceChange("maxPriceMesai", e.target.value)}
                    className="w-3/4"
                  />
                  <span className="ml-2 text-sm font-medium">₺</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label htmlFor="min-price" className="text-right w-36 text-sm font-medium">
                Gece Fiyat
              </label>
              <div className="flex items-center gap-4">
                <div className="col-span-3 flex items-center">
                  <Input
                    id="min-price"
                    type="number"
                    disabled={true}
                    placeholder="150"
                    value={newService.minPriceMesai * 2}
                    onChange={(e) => handleNewServiceChange("minPriceMesai", e.target.value)}
                    className="w-3/4"
                  />
                  <span className="ml-2 text-sm font-medium">₺</span>
                </div>
                <div className="text-sm font-medium"> - </div>
                <div className="col-span-3 flex items-center">
                  <Input
                    id="max-price"
                    type="number"
                    disabled={true}
                    placeholder="300"
                    value={newService.maxPriceMesai * 2}
                    onChange={(e) => handleNewServiceChange("maxPriceMesai", e.target.value)}
                    className="w-3/4"
                  />
                  <span className="ml-2 text-sm font-medium">₺</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label htmlFor="is-active" className="text-right w-30 text-sm font-medium">
                Durum
              </label>
              <div className="col-span-3 flex w-full items-center gap-2">
                <Checkbox
                  id="is-active"
                  checked={newService.isActive}
                  onCheckedChange={(checked) => handleNewServiceChange("isActive", checked)}
                />
                <span className={`px-2 py-1 rounded-full text-xs ${newService.isActive ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                  {newService.isActive ? "Aktif" : "Kapalı"}
                </span>
              </div>
            </div>

          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowServiceModal(false)}>
              İptal
            </Button>
            <Button
              onClick={handleAddService}
              disabled={!isNewServiceValid()}
              className={!isNewServiceValid() ? "opacity-50 cursor-not-allowed" : ""}
            >
              Kaydet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Paket Ekleme Modal */}
      <Dialog open={showPackageModal} onOpenChange={setShowPackageModal}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{newPackage.id ? "Paket Güncelle" : "Yeni Paket Ekle"}</DialogTitle>
            <DialogDescription>
              Platformda kullanılacak yeni bir paket tanımı ekleyin.
              {newPackage.id ? `(ID: ${newPackage.id})` : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="package-name" className="text-right text-sm font-medium">
                Paket Adı
              </label>
              <Input
                id="package-name"
                placeholder="Örn: Pro Paket"
                className="col-span-3"
                value={newPackage.name}
                onChange={(e) => handleNewPackageChange("name", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <label htmlFor="description" className="text-right text-sm font-medium pt-2">
                Açıklama
              </label>
              <textarea
                id="description"
                placeholder="Paket hakkında açıklama yazın"
                className="col-span-3 min-h-[80px] p-2 border rounded-md"
                value={newPackage.description || ""}
                onChange={(e) => handleNewPackageChange("description", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="key-amount" className="text-right text-sm font-medium">
                Anahtar Miktarı
              </label>
              <div className="col-span-3 flex items-center">
                <Input
                  id="key-amount"
                  type="number"
                  placeholder="1000"
                  value={newPackage.keyAmount}
                  onChange={(e) => handleNewPackageChange("keyAmount", e.target.value)}
                  className="w-full"
                />
                <span className="ml-2 text-sm font-medium"> <Key className="h-4 w-4 text-orange-500" />
                </span>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="price" className="text-right text-sm font-medium">
                Fiyat
              </label>
              <div className="col-span-3 flex items-center">
                <Input
                  id="price"
                  type="number"
                  placeholder="5000"
                  value={newPackage.price}
                  onChange={(e) => handleNewPackageChange("price", e.target.value)}
                  className="w-full"
                />
                <span className="ml-2 text-sm font-medium">₺</span>
              </div>
            </div>

            {newPackage.keyAmount > 0 && newPackage.price > 0 && (
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm font-medium">
                  Anahtar Başı Fiyat
                </label>
                <div className="col-span-3">
                  <div className="flex items-center px-3 py-2 bg-blue-50 rounded-md">
                    <span className="text-sm font-semibold text-blue-800">
                      {(newPackage.price / newPackage.keyAmount).toFixed(2)} ₺
                    </span>
                    <span className="ml-1 text-xs text-blue-600">/ anahtar</span>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="is-unlimited" className="text-right text-sm font-medium">
                Sınırsız
              </label>
              <div className="col-span-3 flex items-center">
                <Checkbox
                  id="is-unlimited"
                  checked={newPackage.isUnlimited}
                  onCheckedChange={(checked) => handleNewPackageChange("isUnlimited", checked)}
                />
                <label htmlFor="is-unlimited" className="ml-2 text-sm font-medium">
                  Süresiz Paket
                </label>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="is-active" className="text-right text-sm font-medium">
                Durum
              </label>
              <div className="col-span-3 flex items-center">
                <Checkbox
                  id="is-active"
                  checked={newPackage.isActive}
                  onCheckedChange={(checked) => handleNewPackageChange("isActive", checked)}
                />
                <label htmlFor="is-active" className="ml-2 text-sm font-medium">
                  Aktif
                </label>
              </div>
            </div>

            {!newPackage.isUnlimited && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="valid-from" className="text-right text-sm font-medium">
                    Geçerlilik Başlangıç
                  </label>
                  <div className="col-span-3 flex items-center">
                    <Input
                      id="valid-from"
                      type="date"
                      value={newPackage.startdate instanceof Date
                        ? newPackage.startdate.toISOString().split('T')[0]
                        : new Date().toISOString().split('T')[0]}
                      onChange={(e) => handleNewPackageChange("startdate", new Date(e.target.value))}
                      disabled={newPackage.isUnlimited}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="valid-to" className="text-right text-sm font-medium">
                    Geçerlilik Bitiş
                  </label>
                  <div className="col-span-3 flex items-center">
                    <Input
                      id="valid-to"
                      type="date"
                      value={newPackage.enddate instanceof Date
                        ? newPackage.enddate.toISOString().split('T')[0]
                        : new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]}
                      onChange={(e) => handleNewPackageChange("enddate", new Date(e.target.value))}
                      disabled={newPackage.isUnlimited}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter className="sm:justify-end">
            <Button variant="outline" onClick={() => setShowPackageModal(false)}>
              İptal
            </Button>
            <Button
              onClick={handleAddOrUpdatePackage}
              disabled={!isNewPackageValid()}
              className={!isNewPackageValid() ? "opacity-50 cursor-not-allowed" : ""}
            >
              {newPackage.id ? "Güncelle" : "Ekle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Paket Silme Onay Modalı */}
      <Dialog open={showDeleteConfirmModal} onOpenChange={setShowDeleteConfirmModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-red-600">Paketi Sil</DialogTitle>
            <DialogDescription>
              Bu işlem geri alınamaz. Silmek istediğinize emin misiniz?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {packageToDelete && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">{packageToDelete.name}</h4>
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <Key className="h-4 w-4 text-orange-500" />
                  <span>{packageToDelete.keyAmount.toLocaleString('tr-TR')} Anahtar</span>
                  <span className="text-gray-400">•</span>
                  <span>₺{packageToDelete.price.toLocaleString('tr-TR')}</span>
                </div>
              </div>
            )}
            <p className="mt-4 text-sm text-gray-500">
              Bu paketi sildiğinizde, bu paket üzerinden yapılan tüm işlemler geçerliliğini koruyacaktır,
              ancak yeni satın alımlar yapılamayacaktır.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteConfirmModal(false);
                setPackageToDelete(null);
              }}
            >
              İptal
            </Button>
            <Button
              variant="destructive"
              onClick={() => packageToDelete?.id && handleDeletePackage(packageToDelete.id)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Paketi Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Anahtar Talebi Detay Modalı */}
      <Dialog open={showRequestDetailModal} onOpenChange={setShowRequestDetailModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Anahtar Talebi Detayı</DialogTitle>
            {selectedRequest && (
              <DialogDescription>
                Talep tarihi: {new Date(selectedRequest.createdat).toLocaleDateString('tr-TR')} {new Date(selectedRequest.createdat).toLocaleTimeString('tr-TR')}
              </DialogDescription>
            )}
          </DialogHeader>

          {selectedRequest && (
            <div className="grid gap-6">
              <div className="grid gap-2">
                <div className="font-semibold text-gray-700">Çilingir Bilgileri</div>
                <div className="bg-gray-50 p-3 rounded-md grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">İsim:</span> {selectedRequest.locksmiths?.fullname}
                  </div>
                  <div>
                    <span className="text-gray-500">E-posta:</span> {selectedRequest.locksmiths?.email}
                  </div>
                  <div>
                    <span className="text-gray-500">Telefon:</span> {selectedRequest.locksmiths?.phonenumber}
                  </div>
                  <div>
                    <span className="text-gray-500">Çilingir ID:</span> {selectedRequest.locksmiths?.id}
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <div className="font-semibold text-gray-700">Paket Bilgileri</div>
                <div className="bg-gray-50 p-3 rounded-md grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Paket Adı:</span> {selectedRequest.key_packages?.name}
                  </div>
                  <div>
                    <span className="text-gray-500">Paket ID:</span> {selectedRequest.key_packages?.id}
                  </div>
                  <div>
                    <span className="text-gray-500">Anahtar Miktarı:</span> {selectedRequest.key_packages?.keyAmount?.toLocaleString('tr-TR')}
                  </div>
                  <div>
                    <span className="text-gray-500">Ödeme Tutarı:</span> ₺{selectedRequest.paidamount?.toLocaleString('tr-TR')}
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <div className="font-semibold text-gray-700">İşlem Bilgileri</div>
                <div className="bg-gray-50 p-3 rounded-md grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">İşlem Türü:</span> {selectedRequest.transactiontype === 'purchase' ? 'Satın Alma' : selectedRequest.transactiontype}
                  </div>
                  <div>
                    <span className="text-gray-500">Durum:</span>
                    <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${selectedRequest.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      selectedRequest.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                        selectedRequest.status === 'completed' ? 'bg-green-100 text-green-700' :
                          selectedRequest.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                      }`}>
                      {
                        selectedRequest.status === 'pending' ? 'Beklemede' :
                          selectedRequest.status === 'approved' ? 'Onaylandı' :
                            selectedRequest.status === 'completed' ? 'Tamamlandı' :
                              selectedRequest.status === 'rejected' ? 'Reddedildi' :
                                selectedRequest.status === 'cancelled' ? 'İptal Edildi' : selectedRequest.status
                      }
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Önceki Bakiye:</span> {selectedRequest.balancebefore?.toLocaleString('tr-TR')}
                  </div>
                  <div>
                    <span className="text-gray-500">Sonraki Bakiye:</span> {selectedRequest.balanceafter?.toLocaleString('tr-TR')}
                  </div>
                </div>
              </div>

              {selectedRequest.requestnote && (
                <div className="grid gap-2">
                  <div className="font-semibold text-gray-700">Çilingir Notu</div>
                  <div className="bg-gray-50 p-3 rounded-md text-sm">
                    {selectedRequest.requestnote}
                  </div>
                </div>
              )}

              {selectedRequest.adminnote && (
                <div className="grid gap-2">
                  <div className="font-semibold text-gray-700">Yönetici Notu</div>
                  <div className="bg-gray-50 p-3 rounded-md text-sm">
                    {selectedRequest.adminnote}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            {selectedRequest && selectedRequest.status === 'pending' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRequestDetailModal(false);
                    handleRejectRequest(selectedRequest.id);
                  }}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  Reddet
                </Button>
                <Button
                  onClick={() => {
                    setShowRequestDetailModal(false);
                    handleApproveRequest(selectedRequest.id);
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Onayla
                </Button>
              </>
            )}
            {selectedRequest && selectedRequest.status !== 'pending' && (
              <Button onClick={() => setShowRequestDetailModal(false)}>Kapat</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Talep Onaylama Modalı */}
      <Dialog open={showRequestApproveModal} onOpenChange={setShowRequestApproveModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Anahtar Talebini Onayla</DialogTitle>
            <DialogDescription>
              Bu işlem kullanıcının anahtar bakiyesini artıracaktır.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-start gap-4">
              <label htmlFor="admin-note" className="text-right text-sm font-medium pt-2">
                Yönetici Notu <span className="text-gray-400">(Opsiyonel)</span>
              </label>
              <textarea
                id="admin-note"
                placeholder="Onay işlemi için not ekleyin"
                className="col-span-3 min-h-[100px] p-2 border rounded-md"
                value={requestAdminNote}
                onChange={(e) => setRequestAdminNote(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRequestApproveModal(false)}
              disabled={requestProcessing}
            >
              İptal
            </Button>
            <Button
              onClick={confirmApproveRequest}
              disabled={requestProcessing}
              className="bg-green-600 hover:bg-green-700"
            >
              {requestProcessing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  İşleniyor...
                </>
              ) : 'Onayla'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Talep Reddetme Modalı */}
      <Dialog open={showRequestRejectModal} onOpenChange={setShowRequestRejectModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Anahtar Talebini Reddet</DialogTitle>
            <DialogDescription>
              Bu işlem talebi reddedecek ve kullanıcıya bildirilecektir.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-start gap-4">
              <label htmlFor="admin-note-reject" className="text-right text-sm font-medium pt-2">
                Ret Nedeni <span className="text-gray-400">(Opsiyonel)</span>
              </label>
              <textarea
                id="admin-note-reject"
                placeholder="Reddetme nedeni"
                className="col-span-3 min-h-[100px] p-2 border rounded-md"
                value={requestAdminNote}
                onChange={(e) => setRequestAdminNote(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRequestRejectModal(false)}
              disabled={requestProcessing}
            >
              İptal
            </Button>
            <Button
              onClick={confirmRejectRequest}
              disabled={requestProcessing}
              className="bg-red-600 hover:bg-red-700"
            >
              {requestProcessing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  İşleniyor...
                </>
              ) : 'Reddet'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AdminPanel() {
  const { isAuthenticated, role, loading } = useSelector(state => state.auth);
  const router = useRouter();

  useEffect(() => {
    // Oturum açılmamışsa veya admin değilse login sayfasına yönlendir
    if (!loading && (!isAuthenticated || role !== 'admin')) {
      router.push('/cilingir/auth/login');
    }
  }, [isAuthenticated, role, loading, router]);

  // Yükleniyor veya yetki kontrolü
  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Yükleniyor...</h2>
          <p className="text-gray-500">Lütfen bekleyin, admin paneli hazırlanıyor.</p>
        </div>
      </div>
    );
  }

  // Admin değilse erişim engelle
  if (role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Erişim Engellendi</h2>
          <p className="text-gray-500">Bu sayfaya sadece yöneticiler erişebilir.</p>
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
          <p className="text-gray-500">Lütfen bekleyin, admin paneli hazırlanıyor.</p>
        </div>
      </div>
    }>
      <AdminPanelContent />
    </Suspense>
  );
} 