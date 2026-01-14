'use client';

import React from 'react';

const priceData = [
    {
        islem: 'Kapı açma',
        ortalamaSure: '15-30 dakika',
        ortalamaFiyat: '300-500 ₺',
    },
    {
        islem: 'Çelik kapı açma',
        ortalamaSure: '20-45 dakika',
        ortalamaFiyat: '400-700 ₺',
    },
    {
        islem: 'Oto anahtar kopyalama',
        ortalamaSure: '30-60 dakika',
        ortalamaFiyat: '200-800 ₺',
    },
    {
        islem: 'Kilit değişimi',
        ortalamaSure: '30-60 dakika',
        ortalamaFiyat: '500-1500 ₺',
    },
    {
        islem: 'Gece servisi (22:00-06:00)',
        ortalamaSure: '15-30 dakika',
        ortalamaFiyat: '500-1000 ₺',
    }
];

export default function PriceTable() {
    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">İşlem</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Ortalama Süre</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Ortalama Fiyat</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {priceData.map((row, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 text-sm text-gray-900 font-medium">{row.islem}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{row.ortalamaSure}</td>
                                <td className="px-4 py-3 text-sm text-gray-900 font-semibold">{row.ortalamaFiyat}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="px-4 py-3 bg-gray-50 border-t">
                <p className="text-sm text-gray-600">
                    <strong>Not:</strong> Fiyatlar şehre, saate ve kilit tipine göre değişebilir.
                    Net fiyat bilgisi için çilingir ile iletişime geçmenizi öneririz.
                </p>
            </div>
        </div>
    );
}
