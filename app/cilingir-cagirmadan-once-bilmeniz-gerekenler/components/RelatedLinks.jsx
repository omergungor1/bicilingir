'use client';

import React from 'react';
import Link from 'next/link';

const relatedLinks = [
    {
        id: 1,
        title: 'Anahtar içeride kaldı rehberi',
        description: 'Anahtarınız içeride kaldıysa ne yapmalısınız?',
        href: '/cilingir-cagirmadan-once-bilmeniz-gerekenler#anahtar-iceride',
        icon: '🔑'
    },
    {
        id: 2,
        title: 'Kapıda kaldım rehberi',
        description: 'Kapınız kilitli kaldıysa adım adım ne yapmalısınız?',
        href: '/cilingir-cagirmadan-once-bilmeniz-gerekenler#kapida-kaldim',
        icon: '🚪'
    },
    {
        id: 3,
        title: 'Güncel çilingir fiyatları',
        description: '2024 çilingir hizmet fiyatları ve detaylı bilgiler',
        href: '/fiyat-listesi',
        icon: '💰'
    },
    {
        id: 4,
        title: 'İl / ilçe çilingir bul',
        description: 'Size en yakın çilingiri bulun ve hemen iletişime geçin',
        href: '/',
        icon: '📍'
    }
];

export default function RelatedLinks() {
    return (
        <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
                Bunlara da Göz At
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedLinks.map((link) => (
                    <Link
                        key={link.id}
                        href={link.href}
                        className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-200 group"
                    >
                        <div className="flex items-start gap-4">
                            <div className="text-4xl flex-shrink-0">{link.icon}</div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                    {link.title}
                                </h3>
                                <p className="text-gray-600 text-sm">{link.description}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
