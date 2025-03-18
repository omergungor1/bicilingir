"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Checkbox } from "../../components/ui/checkbox";

export default function CilingirPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Çilingir Yönetim Paneli</h1>
      
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
                  onClick={() => setActiveTab("profile")}
                  className={`p-4 text-left hover:bg-gray-100 transition-colors ${activeTab === "profile" ? "bg-gray-100 font-medium" : ""}`}
                >
                  Profil Bilgileri
                </button>
                <button 
                  onClick={() => setActiveTab("services")}
                  className={`p-4 text-left hover:bg-gray-100 transition-colors ${activeTab === "services" ? "bg-gray-100 font-medium" : ""}`}
                >
                  Hizmetlerim
                </button>
                <button 
                  onClick={() => setActiveTab("jobs")}
                  className={`p-4 text-left hover:bg-gray-100 transition-colors ${activeTab === "jobs" ? "bg-gray-100 font-medium" : ""}`}
                >
                  İş Geçmişi
                </button>
                <button 
                  onClick={() => setActiveTab("reviews")}
                  className={`p-4 text-left hover:bg-gray-100 transition-colors ${activeTab === "reviews" ? "bg-gray-100 font-medium" : ""}`}
                >
                  Değerlendirmeler
                </button>
                <button 
                  onClick={() => setActiveTab("settings")}
                  className={`p-4 text-left hover:bg-gray-100 transition-colors ${activeTab === "settings" ? "bg-gray-100 font-medium" : ""}`}
                >
                  Hesap Ayarları
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
                <CardDescription>Hesap genel bakış</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-sm text-gray-500">Tamamlanan İşler</p>
                      <h3 className="text-2xl font-bold">124</h3>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-sm text-gray-500">Ortalama Puan</p>
                      <h3 className="text-2xl font-bold">4.8/5</h3>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-sm text-gray-500">Aylık Kazanç</p>
                      <h3 className="text-2xl font-bold">₺12,450</h3>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mb-8">
                  <h4 className="font-medium mb-4">Aktif İşler</h4>
                  <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                      <Card key={item}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h5 className="font-medium">Kapı Açma Hizmeti #{item}</h5>
                              <p className="text-sm text-gray-500">Kadıköy, İstanbul</p>
                              <p className="text-sm text-gray-500">15 Mart 2024, 15:30</p>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">Detaylar</Button>
                              <Button size="sm">Tamamlandı</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-4">Son Değerlendirmeler</h4>
                  <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="border-b pb-4">
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 rounded-full bg-gray-200 mr-2"></div>
                          <div>
                            <p className="font-medium">Müşteri {item}</p>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} className={`w-4 h-4 ${i < 5 ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                </svg>
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700">Çok hızlı ve profesyonel hizmet. Teşekkürler!</p>
                      </div>
                    ))}
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
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>
                    <Button>Fotoğraf Yükle</Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm mb-1">İşletme Adı</label>
                      <Input defaultValue="Anahtar Çilingir" />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Sahibi</label>
                      <Input defaultValue="Ahmet Yılmaz" />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">E-posta</label>
                      <Input defaultValue="info@anahtarcilingir.com" />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Telefon</label>
                      <Input defaultValue="+90 555 123 4567" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm mb-1">Adres</label>
                      <Input defaultValue="Kadıköy, İstanbul" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm mb-1">Hakkında</label>
                      <textarea 
                        className="w-full min-h-[100px] p-2 border rounded-md"
                        defaultValue="10 yıllık tecrübemizle İstanbul'un her bölgesinde hizmet vermekteyiz. 7/24 acil çilingir hizmeti sunuyoruz."
                      ></textarea>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Çalışma Saatleri</h4>
                    <div className="space-y-2">
                      {["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"].map((day) => (
                        <div key={day} className="flex items-center justify-between">
                          <span>{day}</span>
                          <div className="flex items-center space-x-2">
                            <Input className="w-24" defaultValue="09:00" />
                            <span>-</span>
                            <Input className="w-24" defaultValue="18:00" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button>Değişiklikleri Kaydet</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "services" && (
            <Card>
              <CardHeader>
                <CardTitle>Hizmetlerim</CardTitle>
                <CardDescription>Sunduğunuz hizmetleri yönetin</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <Button>Yeni Hizmet Ekle</Button>
                </div>
                
                <div className="space-y-4">
                  {[
                    { name: "Kapı Açma", price: "₺150 - ₺300", active: true },
                    { name: "Çelik Kapı Açma", price: "₺250 - ₺500", active: true },
                    { name: "Kasa Açma", price: "₺500 - ₺1000", active: false },
                    { name: "Anahtar Kopyalama", price: "₺30 - ₺100", active: true },
                    { name: "Kilit Değiştirme", price: "₺200 - ₺400", active: true }
                  ].map((service, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h5 className="font-medium">{service.name}</h5>
                            <p className="text-sm text-gray-500">Fiyat: {service.price}</p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <Checkbox id={`active-${index}`} defaultChecked={service.active} />
                              <label htmlFor={`active-${index}`} className="text-sm">Aktif</label>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">Düzenle</Button>
                              <Button variant="outline" size="sm" className="text-red-500">Sil</Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "jobs" && (
            <Card>
              <CardHeader>
                <CardTitle>İş Geçmişi</CardTitle>
                <CardDescription>Tamamlanan işlerinizi görüntüleyin</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <Input placeholder="İş ara..." className="max-w-sm" />
                  <div className="flex space-x-2">
                    <Button variant="outline">Filtrele</Button>
                    <Button variant="outline">Dışa Aktar</Button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">İş ID</th>
                        <th className="text-left p-3">Hizmet</th>
                        <th className="text-left p-3">Müşteri</th>
                        <th className="text-left p-3">Tarih</th>
                        <th className="text-left p-3">Tutar</th>
                        <th className="text-left p-3">Durum</th>
                        <th className="text-left p-3">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                        <tr key={item} className="border-b hover:bg-gray-50">
                          <td className="p-3">#JOB{1000 + item}</td>
                          <td className="p-3">Kapı Açma</td>
                          <td className="p-3">Müşteri {item}</td>
                          <td className="p-3">12.03.2024</td>
                          <td className="p-3">₺{150 + (item * 10)}</td>
                          <td className="p-3">
                            <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                              Tamamlandı
                            </span>
                          </td>
                          <td className="p-3">
                            <Button variant="outline" size="sm">Detay</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-gray-500">Toplam 120 kayıt</p>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Önceki</Button>
                    <Button variant="outline" size="sm">Sonraki</Button>
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
                </div>
                
                <div className="space-y-6">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="border-b pb-6">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                          <div>
                            <p className="font-medium">Müşteri {item}</p>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} className={`w-4 h-4 ${i < (6 - Math.min(item, 5)) ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                </svg>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">10 Mart 2024</div>
                      </div>
                      <p className="text-gray-700">
                        {item % 2 === 0 
                          ? "Çok hızlı ve profesyonel hizmet aldım. Kesinlikle tavsiye ederim." 
                          : "Zamanında geldi ve işini çok iyi yaptı. Fiyat da gayet uygundu. Teşekkürler."}
                      </p>
                      
                      {item === 3 && (
                        <div className="mt-3 bg-gray-50 p-3 rounded-md">
                          <p className="text-sm font-medium">Yanıtınız:</p>
                          <p className="text-sm text-gray-700">Değerlendirmeniz için teşekkür ederiz. Tekrar görüşmek dileğiyle.</p>
                        </div>
                      )}
                      
                      {item !== 3 && (
                        <div className="mt-3">
                          <Button variant="outline" size="sm">Yanıtla</Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-center mt-6">
                  <Button variant="outline">Daha Fazla Yükle</Button>
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
                        <Input type="password" />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Yeni Şifre</label>
                        <Input type="password" />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Yeni Şifre (Tekrar)</label>
                        <Input type="password" />
                      </div>
                      <Button>Şifreyi Güncelle</Button>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h4 className="font-medium mb-4">Bildirim Ayarları</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="email-notifications" defaultChecked />
                        <label htmlFor="email-notifications">E-posta bildirimleri</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="sms-notifications" defaultChecked />
                        <label htmlFor="sms-notifications">SMS bildirimleri</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="app-notifications" defaultChecked />
                        <label htmlFor="app-notifications">Uygulama bildirimleri</label>
                      </div>
                      <Button>Bildirimleri Güncelle</Button>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h4 className="font-medium mb-4">Hesap Durumu</h4>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="account-active" defaultChecked />
                        <label htmlFor="account-active">Hesabım aktif</label>
                      </div>
                      <p className="text-sm text-gray-500">
                        Hesabınızı devre dışı bırakırsanız, profiliniz ve hizmetleriniz platformda görünmeyecektir.
                      </p>
                      <Button>Durumu Güncelle</Button>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h4 className="font-medium mb-4 text-red-600">Tehlikeli Bölge</h4>
                    <p className="text-sm text-gray-500 mb-4">
                      Hesabınızı silmek geri alınamaz bir işlemdir. Tüm verileriniz kalıcı olarak silinecektir.
                    </p>
                    <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                      Hesabımı Sil
                    </Button>
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