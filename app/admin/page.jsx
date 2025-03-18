"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Platform Yönetim Paneli</h1>
      
      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="col-span-12 md:col-span-3">
          <Card>
            <CardContent className="p-0">
              <nav className="flex flex-col">
                <button 
                  onClick={() => setActiveTab("dashboard")}
                  className={`p-4 text-left hover:bg-gray-100 transition-colors ${activeTab === "dashboard" ? "bg-gray-100 font-medium" : ""}`}
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => setActiveTab("users")}
                  className={`p-4 text-left hover:bg-gray-100 transition-colors ${activeTab === "users" ? "bg-gray-100 font-medium" : ""}`}
                >
                  Kullanıcı Yönetimi
                </button>
                <button 
                  onClick={() => setActiveTab("locksmiths")}
                  className={`p-4 text-left hover:bg-gray-100 transition-colors ${activeTab === "locksmiths" ? "bg-gray-100 font-medium" : ""}`}
                >
                  Çilingir Yönetimi
                </button>
                <button 
                  onClick={() => setActiveTab("services")}
                  className={`p-4 text-left hover:bg-gray-100 transition-colors ${activeTab === "services" ? "bg-gray-100 font-medium" : ""}`}
                >
                  Hizmet Yönetimi
                </button>
                <button 
                  onClick={() => setActiveTab("settings")}
                  className={`p-4 text-left hover:bg-gray-100 transition-colors ${activeTab === "settings" ? "bg-gray-100 font-medium" : ""}`}
                >
                  Site Ayarları
                </button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="col-span-12 md:col-span-9">
          {activeTab === "dashboard" && (
            <Card>
              <CardHeader>
                <CardTitle>Dashboard</CardTitle>
                <CardDescription>Platform genel bakış</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-sm text-gray-500">Toplam Kullanıcı</p>
                      <h3 className="text-2xl font-bold">1,245</h3>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-sm text-gray-500">Toplam Çilingir</p>
                      <h3 className="text-2xl font-bold">328</h3>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-sm text-gray-500">Tamamlanan İşler</p>
                      <h3 className="text-2xl font-bold">5,672</h3>
                    </CardContent>
                  </Card>
                </div>
                <h4 className="font-medium mb-4">Son Aktiviteler</h4>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="flex items-center justify-between border-b pb-3">
                      <div>
                        <p className="font-medium">Yeni çilingir kaydoldu</p>
                        <p className="text-sm text-gray-500">12 Mart 2024, 14:30</p>
                      </div>
                      <Button variant="outline" size="sm">Detay</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "users" && (
            <Card>
              <CardHeader>
                <CardTitle>Kullanıcı Yönetimi</CardTitle>
                <CardDescription>Tüm kullanıcıları görüntüle ve yönet</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <Input placeholder="Kullanıcı ara..." className="max-w-sm" />
                  <Button>Yeni Kullanıcı</Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Kullanıcı ID</th>
                        <th className="text-left p-3">Ad Soyad</th>
                        <th className="text-left p-3">E-posta</th>
                        <th className="text-left p-3">Kayıt Tarihi</th>
                        <th className="text-left p-3">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3, 4, 5].map((item) => (
                        <tr key={item} className="border-b hover:bg-gray-50">
                          <td className="p-3">#USR{1000 + item}</td>
                          <td className="p-3">Kullanıcı {item}</td>
                          <td className="p-3">kullanici{item}@example.com</td>
                          <td className="p-3">12.03.2024</td>
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

          {activeTab === "locksmiths" && (
            <Card>
              <CardHeader>
                <CardTitle>Çilingir Yönetimi</CardTitle>
                <CardDescription>Tüm çilingirleri görüntüle ve yönet</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <Input placeholder="Çilingir ara..." className="max-w-sm" />
                  <Button>Yeni Çilingir</Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Çilingir ID</th>
                        <th className="text-left p-3">İşletme Adı</th>
                        <th className="text-left p-3">Bölge</th>
                        <th className="text-left p-3">Durum</th>
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

          {activeTab === "services" && (
            <Card>
              <CardHeader>
                <CardTitle>Hizmet Yönetimi</CardTitle>
                <CardDescription>Platformdaki hizmetleri yönet</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <Input placeholder="Hizmet ara..." className="max-w-sm" />
                  <Button>Yeni Hizmet</Button>
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
                        <Input defaultValue="Türkiye'nin en büyük çilingir pazaryeri" />
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
  );
} 