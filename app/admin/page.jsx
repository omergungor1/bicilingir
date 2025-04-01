"use client";

import { useState, useEffect, Suspense } from "react";
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
  MessageSquare,
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
  ChevronDown
} from "lucide-react";
import Image from "next/image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { DatePickerWithRange } from "../../components/ui/date-range-picker";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../components/ui/dialog";
import { useToast } from "../../components/ToastContext";
import { Checkbox } from "../../components/ui/checkbox";

function AdminPanelContent() {
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
  const [newService, setNewService] = useState({
    name: "",
    category: "",
    minPrice: "",
    maxPrice: ""
  });
  const [newPackage, setNewPackage] = useState({
    name: "",
    rocketAmount: "",
    price: "",
    isActive: true,
    isUnlimited: false,
    validFrom: new Date(),
    validTo: new Date(new Date().setMonth(new Date().getMonth() + 1)) // 1 ay sonrası
  });
  const [serviceCategories, setServiceCategories] = useState([
    "Kapı Açma",
    "Kilit Değiştirme",
    "Anahtar Yapımı",
    "Kasa İşlemleri",
    "Oto Çilingir",
    "Diğer"
  ]);
  const [activeReviewFilter, setActiveReviewFilter] = useState("all");

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
      newService.category !== "" && 
      newService.minPrice !== "" && 
      newService.maxPrice !== "" &&
      Number(newService.minPrice) <= Number(newService.maxPrice)
    );
  };

  const handleAddService = () => {
    // Burada API'ye yeni hizmet eklemek için istek yapılabilir
    console.log("Yeni hizmet eklendi:", newService);
    
    // Modal'ı kapat
    setShowServiceModal(false);
    
    // Form'u sıfırla
    setNewService({
      name: "",
      category: "",
      minPrice: "",
      maxPrice: ""
    });
    
    // Başarılı bildirim göster
    showToast("Yeni hizmet başarıyla eklendi!", "success");
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
      newPackage.rocketAmount.toString().trim() !== "" &&
      Number(newPackage.rocketAmount) > 0 &&
      newPackage.price.toString().trim() !== "" &&
      Number(newPackage.price) > 0 &&
      (newPackage.isUnlimited || 
        (newPackage.validFrom && newPackage.validTo && newPackage.validFrom <= newPackage.validTo))
    );
  };

  const handleAddPackage = () => {
    // Burada API'ye yeni paket eklemek için istek yapılabilir
    console.log("Yeni paket eklendi:", newPackage);
    
    // Modal'ı kapat
    setShowPackageModal(false);
    
    // Form'u sıfırla
    setNewPackage({
      name: "",
      rocketAmount: "",
      price: "",
      isActive: true,
      isUnlimited: false,
      validFrom: new Date(),
      validTo: new Date(new Date().setMonth(new Date().getMonth() + 1))
    });
    
    // Başarılı bildirim göster
    showToast("Yeni paket başarıyla eklendi!", "success");
  };

  const handleDeletePackage = () => {
    // Gerçek bir API entegrasyonunda silme işlemi burada yapılır
    console.log("Paket silindi:", packageToDelete);
    
    // Silme modalını kapat
    setShowDeleteConfirmModal(false);
    
    // Silinen paket bilgisini temizle
    setPackageToDelete(null);
    
    // Başarılı bildirim göster
    showToast("Paket başarıyla silindi!", "success");
  };

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
                      onClick={() => handleTabChange("rockets")}
                      className={`flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${activeTab === "rockets" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                    >
                      <Rocket className="h-5 w-5" />
                      <span>Roket Paket Yönetimi</span>
                      <ChevronRight className={`h-5 w-5 ml-auto transition-transform ${activeTab === "rockets" ? "rotate-90" : ""}`} />
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
                      onClick={() => {/* Güvenli çıkış işlemi */}}
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-none hover:shadow-lg transition-all">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-blue-600 mb-1 font-medium">Toplam Kullanıcı</p>
                              <h3 className="text-2xl font-bold text-blue-900">1,245</h3>
                              <p className="text-sm text-blue-600 mt-2 flex items-center">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                %12.5 artış
                              </p>
                            </div>
                            <div className="bg-blue-500 p-3 rounded-full">
                              <UserCheck className="h-8 w-8 text-white" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-none hover:shadow-lg transition-all">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-purple-600 mb-1 font-medium">Toplam Çilingir</p>
                              <h3 className="text-2xl font-bold text-purple-900">328</h3>
                              <p className="text-sm text-purple-600 mt-2 flex items-center">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                %8.3 artış
                              </p>
                            </div>
                            <div className="bg-purple-500 p-3 rounded-full">
                              <Key className="h-8 w-8 text-white" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-none hover:shadow-lg transition-all">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-green-600 mb-1 font-medium">Tamamlanan İşler</p>
                              <h3 className="text-2xl font-bold text-green-900">5,672</h3>
                              <p className="text-sm text-green-600 mt-2 flex items-center">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                %15.2 artış
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                      <Card className="hover:shadow-md transition-all">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="bg-yellow-100 p-2 rounded-lg">
                              <Star className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Ort. Puan</p>
                              <p className="text-lg font-semibold">4.8/5</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="hover:shadow-md transition-all">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                              <PhoneCall className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Günlük Arama</p>
                              <p className="text-lg font-semibold">124</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="hover:shadow-md transition-all">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="bg-purple-100 p-2 rounded-lg">
                              <Eye className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Görüntülenme</p>
                              <p className="text-lg font-semibold">2,845</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="hover:shadow-md transition-all">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="bg-green-100 p-2 rounded-lg">
                              <Calendar className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Aktif Çilingir</p>
                              <p className="text-lg font-semibold">286</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-medium mb-4 flex items-center text-gray-700">
                        <Clock className="h-5 w-5 mr-2 text-blue-600" />
                        Son Aktiviteler
                      </h4>
                      <div className="space-y-4">
                        {[
                          {
                            title: "Yeni çilingir kaydoldu",
                            description: "İstanbul, Kadıköy bölgesinde",
                            time: "12 Mart 2024, 14:30",
                            icon: <Key className="h-5 w-5" />,
                            color: "blue"
                          },
                          {
                            title: "Yeni değerlendirme",
                            description: "5 yıldız - Hızlı ve güvenilir hizmet",
                            time: "12 Mart 2024, 14:25",
                            icon: <Star className="h-5 w-5" />,
                            color: "yellow"
                          },
                          {
                            title: "Acil çağrı bildirimi",
                            description: "Beşiktaş bölgesinde kapı açma talebi",
                            time: "12 Mart 2024, 14:20",
                            icon: <AlertCircle className="h-5 w-5" />,
                            color: "red"
                          },
                          {
                            title: "Yeni kullanıcı kaydı",
                            description: "Mobil uygulama üzerinden",
                            time: "12 Mart 2024, 14:15",
                            icon: <UserCheck className="h-5 w-5" />,
                            color: "green"
                          }
                        ].map((activity, index) => (
                          <Card key={index} className="hover:shadow-md transition-all">
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
                      <div className="mt-4 text-center">
                        <Button 
                        onClick={() => {
                          handleTabChange("activities");
                          setMobileMenuOpen(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                          Tüm Aktiviteleri Görüntüle
                        </Button>
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
                      <Input placeholder="Çilingir ara..." className="max-w-sm" />
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-3">Çilingir ID</th>
                            <th className="text-left p-3">İşletme Adı</th>
                            <th className="text-left p-3">Bölge</th>
                            <th className="text-left p-3">Durum</th>
                            <th className="text-left p-3">Created At</th>
                            <th className="text-left p-3">İşlemler</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[1, 2, 3, 4, 5].map((item) => (
                            <tr key={item} className="border-b hover:bg-gray-50">
                              <td className="p-3">#LCK{1000 + item}</td>
                              <td className="p-3">Çilingir {item}</td>
                              <td className="p-3">İstanbul</td>
                              <td className="p-3">
                                <span className={`px-2 py-1 rounded-full text-xs ${item % 2 === 0 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                                  {item % 2 === 0 ? "Aktif" : "Onay Bekliyor"}
                                </span>
                              </td>
                              <td className="p-3">2024-03-19</td>
                              <td className="p-3">
                                <div className="flex space-x-2">
                                  <Link href={`/cilingir`}>
                                    <Button variant="outline" size="sm">Düzenle</Button>
                                  </Link>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
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
                      <Button onClick={() => setShowServiceModal(true)}>Yeni Hizmet</Button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-3">Hizmet ID</th>
                            <th className="text-left p-3">Hizmet Adı</th>
                            <th className="text-left p-3">Kategori</th>
                            <th className="text-left p-3">Fiyat Aralığı</th>
                            <th className="text-left p-3">İşlemler</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[1, 2, 3, 4, 5].map((item) => (
                            <tr key={item} className="border-b hover:bg-gray-50">
                              <td className="p-3">#SRV{1000 + item}</td>
                              <td className="p-3">Hizmet {item}</td>
                              <td className="p-3">Kapı Açma</td>
                              <td className="p-3">₺150 - ₺300</td>
                              <td className="p-3">
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm">Düzenle</Button>
                                  <Button variant="outline" size="sm" className="text-red-500">Sil</Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "rockets" && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <Rocket className="h-6 w-6 text-blue-600" />
                      <div>
                        <CardTitle>Roket Paket Yönetimi</CardTitle>
                        <CardDescription>Roket paketlerini yönetin ve çilingirlere tanımlayın</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      {/* Paket Yönetimi */}
                      <Card className="border border-blue-100">
                        <CardHeader className="bg-blue-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Package className="h-5 w-5 text-blue-600" />
                              <CardTitle className="text-lg">Roket Paketleri</CardTitle>
                            </div>
                            <Button 
                              size="sm" 
                              className="bg-blue-600"
                              onClick={() => setShowPackageModal(true)}
                            >
                              <Plus className="h-4 w-4 mr-1" /> Yeni Paket
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="space-y-4">
                            {[
                              { id: 1, name: "Başlangıç Paketi", rockets: 1000, price: 5000 },
                              { id: 2, name: "Orta Paket", rockets: 3000, price: 12000 },
                              { id: 3, name: "Pro Paket", rockets: 7000, price: 25000 },
                              { id: 4, name: "VIP Paket", rockets: 15000, price: 50000 }
                            ].map((packet) => (
                              <Card key={packet.id} className="hover:shadow-md transition-all">
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <h4 className="font-medium text-gray-900">{packet.name}</h4>
                                      <div className="flex items-center space-x-2 mt-1">
                                        <Rocket className="h-4 w-4 text-orange-500" />
                                        <span className="text-sm font-semibold">{packet.rockets.toLocaleString('tr-TR')} Roket</span>
                                      </div>
                                      <p className="text-sm text-gray-500 mt-1">₺{packet.price.toLocaleString('tr-TR')}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                      <Button 
                                        onClick={() => {
                                          setShowPackageModal(true)
                                        }}
                                      size="sm" variant="outline">
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                      onClick={() => {
                                        setPackageToDelete(packet);
                                        setShowDeleteConfirmModal(true);
                                      }}
                                      size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50">
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Çilingir Roket Atama */}
                      <Card className="border border-purple-100">
                        <CardHeader className="bg-purple-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Key className="h-5 w-5 text-purple-600" />
                              <CardTitle className="text-lg">Çilingir Roket Tanımlama</CardTitle>
                            </div>
                            <div className="flex">
                              <Input 
                                className="max-w-[200px] mr-2 h-9" 
                                placeholder="Çilingir ara..." 
                              />
                              <Button size="sm" variant="outline" className="h-9 px-2">
                                <Search className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="space-y-4">
                            {[
                              { id: 1, name: "Ahmet Çilingir", location: "Kadıköy, İstanbul", currentRockets: 2500 },
                              { id: 2, name: "Mehmet Çilingir", location: "Beşiktaş, İstanbul", currentRockets: 750 },
                              { id: 3, name: "Ayşe Çilingir", location: "Beyoğlu, İstanbul", currentRockets: 3800 }
                            ].map((locksmith) => (
                              <Card key={locksmith.id} className="hover:shadow-md transition-all">
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <h4 className="font-medium text-gray-900">{locksmith.name}</h4>
                                      <p className="text-sm text-gray-500">{locksmith.location}</p>
                                      <div className="flex items-center space-x-2 mt-1">
                                        <Rocket className="h-4 w-4 text-orange-500" />
                                        <span className="text-sm font-semibold">{locksmith.currentRockets.toLocaleString('tr-TR')} Roket</span>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <div>
                                        <Input 
                                          type="number" 
                                          className="w-24 h-9" 
                                          placeholder="Miktar" 
                                        />
                                      </div>
                                      <Button size="sm">Ekle</Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                          <div className="mt-4 text-center">
                            <Button variant="outline" className="text-purple-600 border-purple-600 hover:bg-purple-50">
                              Daha Fazla Göster
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Satış Geçmişi */}
                    <Card className="border border-green-100">
                      <CardHeader className="bg-green-50">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-5 w-5 text-green-600" />
                          <CardTitle className="text-lg">Satış Geçmişi</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b text-sm">
                                <th className="text-left p-3">Tarih</th>
                                <th className="text-left p-3">Çilingir</th>
                                <th className="text-left p-3">Paket</th>
                                <th className="text-left p-3">Roket Miktarı</th>
                                <th className="text-left p-3">Tutar</th>
                                <th className="text-left p-3">Durum</th>
                              </tr>
                            </thead>
                            <tbody>
                              {[
                                { 
                                  id: 1, 
                                  date: "15.03.2024", 
                                  locksmith: "Ahmet Çilingir", 
                                  package: "Pro Paket", 
                                  amount: 7000, 
                                  price: 25000, 
                                  status: "Tamamlandı" 
                                },
                                { 
                                  id: 2, 
                                  date: "14.03.2024", 
                                  locksmith: "Mehmet Çilingir", 
                                  package: "Başlangıç Paketi", 
                                  amount: 1000, 
                                  price: 5000, 
                                  status: "Tamamlandı" 
                                },
                                { 
                                  id: 3, 
                                  date: "12.03.2024", 
                                  locksmith: "Ayşe Çilingir", 
                                  package: "Orta Paket", 
                                  amount: 3000, 
                                  price: 12000, 
                                  status: "Tamamlandı" 
                                },
                                { 
                                  id: 4, 
                                  date: "10.03.2024", 
                                  locksmith: "Ali Çilingir", 
                                  package: "VIP Paket", 
                                  amount: 15000, 
                                  price: 50000, 
                                  status: "Tamamlandı" 
                                }
                              ].map((sale) => (
                                <tr key={sale.id} className="border-b hover:bg-gray-50 text-sm">
                                  <td className="p-3">{sale.date}</td>
                                  <td className="p-3">{sale.locksmith}</td>
                                  <td className="p-3">{sale.package}</td>
                                  <td className="p-3">
                                    <div className="flex items-center space-x-1">
                                      <Rocket className="h-3 w-3 text-orange-500" />
                                      <span>{sale.amount.toLocaleString('tr-TR')}</span>
                                    </div>
                                  </td>
                                  <td className="p-3">₺{sale.price.toLocaleString('tr-TR')}</td>
                                  <td className="p-3">
                                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                      {sale.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="mt-4 text-center">
                          <Button variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                            Tüm Satışları Görüntüle
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
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
                                  {[5, 4, 3, 2, 1].map((rating) => (
                                    <div key={rating} className="flex items-center space-x-2 mb-1">
                                      <div className="text-sm w-2">{rating}</div>
                                      <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                          className="bg-yellow-400 h-2 rounded-full" 
                                          style={{ width: `${rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 5 : rating === 2 ? 3 : 2}%` }}
                                        ></div>
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        {rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 5 : rating === 2 ? 3 : 2}%
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2">
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
                            </div>
                </div>
              </CardContent>
            </Card>
                      
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div className="flex items-center gap-2 w-full overflow-x-auto hide-scrollbar">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className={`bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100`}
                          >
                            Tümü
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="hover:bg-yellow-50"
                          >
                            Onay Bekleyen
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="hover:bg-green-50"
                          >
                            Onaylanmış
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="hover:bg-red-50"
                          >
                            Reddedilmiş
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {[
                          {
                            id: 1,
                            status: "waiting",
                            user: "Ahmet Yılmaz",
                            locksmith: "Hızlı Çilingir",
                            date: "16 Mart 2024",
                            rating: 5,
                            comment: "Hızlı ve güvenilir hizmet. Kapıyı hiç zarar vermeden açtı. Tavsiye ederim.",
                            location: "İstanbul, Kadıköy"
                          },
                          {
                            id: 2,
                            status: "approved",
                            user: "Mehmet Kaya",
                            locksmith: "Usta Çilingir",
                            date: "15 Mart 2024",
                            rating: 4,
                            comment: "İyi hizmet ama biraz geç geldi. Yine de işini iyi yaptı.",
                            location: "İstanbul, Beşiktaş"
                          },
                          {
                            id: 3,
                            status: "waiting",
                            user: "Ayşe Demir",
                            locksmith: "Anahtar Çilingir",
                            date: "14 Mart 2024",
                            rating: 2,
                            comment: "Geç geldi, üstelik kapıma zarar verdi. Tavsiye etmiyorum.",
                            location: "İstanbul, Şişli"
                          },
                          {
                            id: 4,
                            status: "rejected",
                            user: "Ali Yıldız",
                            locksmith: "Pro Çilingir",
                            date: "13 Mart 2024",
                            rating: 1,
                            comment: "Çok kötü bir deneyimdi. Kapımı açamadı ve çok para aldı.",
                            location: "İstanbul, Üsküdar"
                          }
                        ].map((review) => (
                          <Card key={review.id} className={`hover:shadow-md transition-all ${
                            review.status === "waiting" ? "border-l-4 border-l-yellow-400" : 
                            review.status === "approved" ? "border-l-4 border-l-green-400" : 
                            "border-l-4 border-l-red-400"
                          }`}>
                            <CardContent className="p-4">
                              <div className="flex flex-col md:flex-row justify-between">
                                <div className="mb-3 md:mb-0">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h3 className="font-semibold text-gray-900">{review.user}</h3>
                                    <span className="text-sm text-gray-500">→</span>
                                    <span className="font-medium text-blue-600">{review.locksmith}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                                      review.status === "waiting" ? "bg-yellow-100 text-yellow-800" : 
                                      review.status === "approved" ? "bg-green-100 text-green-800" : 
                                      "bg-red-100 text-red-800"
                                    }`}>
                                      {review.status === "waiting" ? "Onay Bekliyor" : 
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
                                    <span className="text-sm text-gray-500">{review.date}</span>
                                    <span className="mx-2 text-sm text-gray-300">•</span>
                                    <span className="text-sm text-gray-500">{review.location}</span>
                                  </div>
                                  <p className="text-gray-700">{review.comment}</p>
                                </div>
                                <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2">
                                  {review.status === "waiting" && (
                                    <>
                                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                        <CheckCircle className="h-4 w-4 mr-1" /> Onayla
                                      </Button>
                                      <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                                        <XCircle className="h-4 w-4 mr-1" /> Reddet
                                      </Button>
                                    </>
                                  )}
                                  {review.status === "approved" && (
                                    <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                                      <XCircle className="h-4 w-4 mr-1" /> Reddet
                                    </Button>
                                  )}
                                  {review.status === "rejected" && (
                                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                      <CheckCircle className="h-4 w-4 mr-1" /> Onayla
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      <div className="flex md:flex-row flex-col justify-between items-center mt-6">
                        <div className="text-sm text-gray-500 md:mb-0 mb-2">
                          Toplam 24 değerlendirme gösteriliyor (1-4)
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" disabled>Önceki</Button>
                          <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600">1</Button>
                          <Button variant="outline" size="sm">2</Button>
                          <Button variant="outline" size="sm">3</Button>
                          <Button variant="outline" size="sm">Sonraki</Button>
                        </div>
                      </div>
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
                            <Input defaultValue="https://facebook.com/bicilingir" />
                          </div>
                          <div>
                            <label className="block text-sm mb-1">Instagram</label>
                            <Input defaultValue="https://instagram.com/bicilingir" />
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
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="service-category" className="text-right text-sm font-medium">
                Kategori
              </label>
              <Select 
                value={newService.category} 
                onValueChange={(value) => handleNewServiceChange("category", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Kategori seçin" />
                </SelectTrigger>
                <SelectContent>
                  {serviceCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="min-price" className="text-right text-sm font-medium">
                Min. Fiyat
              </label>
              <div className="col-span-3 flex items-center">
                <Input
                  id="min-price"
                  type="number"
                  placeholder="150"
                  value={newService.minPrice}
                  onChange={(e) => handleNewServiceChange("minPrice", e.target.value)}
                  className="w-full"
                />
                <span className="ml-2 text-sm font-medium">₺</span>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="max-price" className="text-right text-sm font-medium">
                Max. Fiyat
              </label>
              <div className="col-span-3 flex items-center">
                <Input
                  id="max-price"
                  type="number"
                  placeholder="300"
                  value={newService.maxPrice}
                  onChange={(e) => handleNewServiceChange("maxPrice", e.target.value)}
                  className="w-full"
                />
                <span className="ml-2 text-sm font-medium">₺</span>
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Yeni Paket Ekle</DialogTitle>
            <DialogDescription>
              Platformda kullanılacak yeni bir paket tanımı ekleyin.
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
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="rocket-amount" className="text-right text-sm font-medium">
                Roket Miktarı
              </label>
              <div className="col-span-3 flex items-center">
                <Input
                  id="rocket-amount"
                  type="number"
                  placeholder="1000"
                  value={newPackage.rocketAmount}
                  onChange={(e) => handleNewPackageChange("rocketAmount", e.target.value)}
                  className="w-full"
                />
                <span className="ml-2 text-sm font-medium"> <Rocket className="h-4 w-4 text-orange-500" />
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
                     value={newPackage.validFrom.toISOString().split('T')[0]}
                     onChange={(e) => handleNewPackageChange("validFrom", new Date(e.target.value))}
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
                     value={newPackage.validTo.toISOString().split('T')[0]}
                     onChange={(e) => handleNewPackageChange("validTo", new Date(e.target.value))}
                     disabled={newPackage.isUnlimited}
                   />
                 </div>
               </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPackageModal(false)}>
              İptal
            </Button>
            <Button 
              onClick={handleAddPackage} 
              disabled={!isNewPackageValid()}
              className={!isNewPackageValid() ? "opacity-50 cursor-not-allowed" : ""}
            >
              Kaydet
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
                  <Rocket className="h-4 w-4 text-orange-500" />
                  <span>{packageToDelete.rockets.toLocaleString('tr-TR')} Roket</span>
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
          <DialogFooter className="flex space-x-2 justify-end">
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
              onClick={handleDeletePackage}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Paketi Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AdminPanel() {
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