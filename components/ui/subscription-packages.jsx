"use client";

import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { Check, Users, X, AlertTriangle } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from './dialog';
import { Textarea } from './textarea';
import { useToast } from '../../components/ToastContext';
import { Loader2 } from "lucide-react";

export default function SubscriptionPackages() {
    const { showToast } = useToast();
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [purchaseNote, setPurchaseNote] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isPurchasePending, setIsPurchasePending] = useState(false);
    const [isCancelPending, setIsCancelPending] = useState(false);
    const [packages, setPackages] = useState([]);
    const [activeSubscription, setActiveSubscription] = useState(null);
    const [pendingSubscription, setPendingSubscription] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [packageToCancel, setPackageToCancel] = useState(null);

    const fetchPackages = async () => {
        setIsLoading(true);
        const response = await fetch('/api/locksmith/subscriptions/packages');
        const data = await response.json();
        setPackages(data.packages);
        data.subscription.length > 0 && data.subscription.map(sub => {
            if (sub.is_active) {
                setActiveSubscription(sub.package_id);
                console.log('active', sub.package_id);
            } else if (sub.status === 'pending' && sub.is_active === false) {
                setPendingSubscription(sub.package_id);
                console.log('pending', sub.package_id);
            }
        });
        setIsLoading(false);
    };
    useEffect(() => {
        fetchPackages();
    }, []);

    const handleSelectPackage = (pkg) => {
        setSelectedPackage(pkg);
        setIsModalOpen(true);
    };

    const handlePurchaseSubmit = async () => {
        try {
            setIsPurchasePending(true);

            // Burada gerçek API çağrısı yapılabilir
            const response = await fetch('/api/locksmith/subscriptions/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    packageId: selectedPackage.id,
                    purchaseNote: purchaseNote,
                }),
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Satın alma işlemi sırasında bir hata oluştu');
            }

            // Başarılı ise modalı kapat ve state'i temizle
            setIsModalOpen(false);
            setPurchaseNote('');
            setSelectedPackage(null);
            setTimeout(() => {
                fetchPackages();
            }, 2000);

            // Başarı mesajı göster
            showToast('Satın alma talebiniz başarıyla alındı. Ekibimiz sizinle iletişime geçecektir.', 'success');
        } catch (error) {
            console.error('Satın alma hatası:', error);
            showToast('Satın alma işlemi sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.', 'error');
        } finally {
            setIsPurchasePending(false);
        }
    };

    const handleCancelSubscription = (pkg) => {
        setPackageToCancel(pkg);
        setIsCancelModalOpen(true);
    };

    const confirmCancelSubscription = async () => {
        try {
            setIsCancelPending(true);

            const response = await fetch('/api/locksmith/subscriptions/cancel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Abonelik iptal edilemedi');
            }

            // İptal işlemi başarılı
            setIsCancelModalOpen(false);
            setPackageToCancel(null);
            showToast('Aboneliğiniz başarıyla iptal edildi.', 'success');

            // Paketleri yeniden yükle
            setTimeout(() => {
                fetchPackages();
            }, 2000);

        } catch (error) {
            console.error('İptal hatası:', error);
            showToast('Abonelik iptalinde bir hata oluştu. Lütfen daha sonra tekrar deneyin.', 'error');
        } finally {
            setIsCancelPending(false);
        }
    };

    return (
        <div className="py-10 px-4">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Abonelik Paketleri</h2>
                <p className="text-lg text-gray-600 pb-4 max-w-3xl mx-auto">
                    İşletmeniz için uygun paketi seçin, BiÇilingir platformunda öne çıkın ve daha fazla müşteriye ulaşın.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {isLoading ? (
                    <div className="col-span-3 flex justify-center items-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : (
                    packages.length > 0 && packages.map((pkg, index) => (
                        <div
                            key={index}
                            className={`relative rounded-xl shadow-md border-2 p-6 flex flex-col transition-all duration-200 ${pkg.is_popular && activeSubscription !== pkg.id
                                ? 'border-blue-500 md:scale-105 md:translate-y-[-10px] shadow-xl'
                                : activeSubscription === pkg.id
                                    ? 'border-green-500 md:scale-105 md:translate-y-[-10px] shadow-xl'
                                    : pkg.color
                                }`}
                        >
                            {pkg.is_popular && activeSubscription !== pkg.id && (
                                <div className="absolute -top-4 left-0 right-0 mx-auto w-36 bg-blue-600 text-white py-1 px-2 rounded-full text-sm font-bold text-center">
                                    En Popüler
                                </div>
                            )}
                            {activeSubscription === pkg.id && (
                                <div className="absolute -top-4 left-0 right-0 mx-auto w-36 bg-green-600 text-white py-1 px-2 rounded-full text-sm font-bold text-center">
                                    Aktif Abonelik
                                </div>
                            )}
                            <h3 className={`text-xl font-bold mb-2 ${pkg.is_popular && activeSubscription !== pkg.id ? 'text-blue-700' : activeSubscription === pkg.id ? 'text-green-700' : 'text-gray-800'}`}>
                                {pkg.name}
                            </h3>
                            <div className="flex items-end mb-4">
                                <span className="text-3xl font-bold">{pkg.price.toLocaleString()}₺</span>
                                <span className="text-gray-500 ml-2">/ay</span>
                            </div>
                            <div className="flex items-center mb-4">
                                <div className={`flex items-center border border-gray-200 rounded-full px-3 py-1 bg-white ${activeSubscription === pkg.id ? 'border-green-200' : ''
                                    }`}>
                                    <Users className={`h-5 w-5 mr-2 ${activeSubscription === pkg.id ? 'text-green-500' : 'text-gray-500'
                                        }`} />
                                    <span className={`text-sm font-medium ${activeSubscription === pkg.id ? 'text-green-700' : 'text-gray-700'
                                        }`}>
                                        {pkg.customer_multiplier}x müşteri potansiyeli
                                    </span>
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>
                            <div className="flex-grow space-y-3 mb-6">
                                {pkg.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-start">
                                        <div className={`flex-shrink-0 rounded-full p-1 ${activeSubscription === pkg.id
                                            ? 'bg-green-100'
                                            : pkg.is_popular
                                                ? 'bg-blue-100'
                                                : 'bg-gray-100'
                                            }`}>
                                            <Check className={`h-4 w-4 ${activeSubscription === pkg.id
                                                ? 'text-green-600'
                                                : pkg.is_popular
                                                    ? 'text-blue-600'
                                                    : 'text-blue-500'
                                                }`} />
                                        </div>
                                        <span className="text-gray-700 text-sm ml-2">{feature}</span>
                                    </div>
                                ))}
                            </div>
                            {activeSubscription === pkg.id &&
                                <Button
                                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                                    variant="destructive"
                                    onClick={() => handleCancelSubscription(pkg)}
                                >
                                    Aboneliği İptal Et
                                </Button>}
                            {(activeSubscription !== pkg.id && pendingSubscription === null) && <Button
                                className={`w-full ${pkg.is_popular
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : ''
                                    }`}
                                variant={pkg.is_popular ? 'default' : 'outline'}
                                onClick={() => handleSelectPackage(pkg)}
                            >
                                Paketi Seç
                            </Button>}
                            {
                                (activeSubscription !== pkg.id && pendingSubscription === pkg.id) && <Button
                                    className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                                    variant="default"
                                    disabled
                                >
                                    Yönetici Onayı Bekliyor
                                </Button>}
                        </div>
                    )))}
            </div>

            <div className="text-center text-sm text-gray-500 mt-8 max-w-3xl mx-auto">
                * Tüm paketler aylık olarak faturalandırılır ve otomatik yenilenir. Abonelik iptali için müşteri hizmetleriyle iletişime geçin. Fiyatlara KDV dahildir.
            </div>

            {/* Satın Alma Modalı */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Paketi Satın Al</DialogTitle>
                        <DialogDescription>
                            {selectedPackage && `${selectedPackage.name} - ${selectedPackage.price.toLocaleString()}₺/ay`}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col space-y-4 py-4">
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="note" className="text-sm font-medium text-gray-700">
                                Eklemek istediğiniz not (opsiyonel)
                            </label>
                            <Textarea
                                id="note"
                                placeholder="Özel gereksinimleriniz veya sorularınız varsa belirtebilirsiniz."
                                value={purchaseNote}
                                onChange={(e) => setPurchaseNote(e.target.value)}
                                className="min-h-[100px]"
                            />
                        </div>
                        <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-800">
                            <p>Satın alma işleminiz platform yöneticileri tarafından onaylanacak ve sizinle iletişime geçilecektir.</p>
                        </div>
                    </div>
                    <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                            İptal
                        </Button>
                        <Button
                            type="submit"
                            onClick={handlePurchaseSubmit}
                            disabled={isPurchasePending}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {isPurchasePending ? 'İşleniyor...' : 'Satın Alma Talebini Gönder'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Abonelik İptal Modalı */}
            <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center text-red-600">
                            <AlertTriangle className="h-5 w-5 mr-2" /> Aboneliği İptal Et
                        </DialogTitle>
                        <DialogDescription>
                            {packageToCancel && `${packageToCancel.name} aboneliğinizi iptal etmek istediğinizden emin misiniz?`}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col space-y-4 py-4">
                        <div className="bg-red-50 p-4 rounded-md text-sm text-red-800">
                            <p>Bu işlem geri alınamaz. Aboneliğinizi iptal ettiğinizde, paket avantajlarını kaybedeceksiniz ve platformdaki görünürlüğünüz azalacaktır.</p>
                        </div>
                    </div>
                    <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                        <Button variant="outline" onClick={() => setIsCancelModalOpen(false)}>
                            Vazgeç
                        </Button>
                        <Button
                            type="submit"
                            onClick={confirmCancelSubscription}
                            disabled={isCancelPending}
                            variant="destructive"
                        >
                            {isCancelPending ? 'İşleniyor...' : 'Aboneliği İptal Et'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
} 