'use client';

import React from 'react';

const trustCards = [
    {
        id: 1,
        title: 'Neden rastgele çilingir çağırmamalısınız?',
        content: 'Rastgele çilingir çağırmak güvenlik riski oluşturabilir. Kimlik kontrolü yapmayan, sertifikasız veya güvenilir olmayan çilingirler hem maddi hem de güvenlik açısından sorun yaratabilir. Bi Çilingir\'de tüm çilingirler doğrulanmış ve güvenilirdir.',
        icon: '⚠️'
    },
    {
        id: 2,
        title: 'Biçilingir nasıl doğrular?',
        content: 'Platformumuzdaki tüm çilingirler lisans ve sertifika kontrolünden geçer. Müşteri yorumları, hizmet kalitesi ve güvenilirlik kriterleri düzenli olarak değerlendirilir. Sadece onaylı ve güvenilir çilingirler platformumuzda yer alır.',
        icon: '✅'
    },
    {
        id: 3,
        title: 'Usta – müşteri güven modeli',
        content: 'Bi Çilingir, şeffaf bir platform sunar. Müşteriler çilingirleri değerlendirebilir, yorum yapabilir ve fiyatları önceden görebilir. Çilingirler ise profesyonel profilleri ile kendilerini tanıtabilir. Bu karşılıklı güven modeli her iki taraf için de avantajlıdır.',
        icon: '🤝'
    }
];

export default function TrustSection() {
    return (
        <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
                Güvenli Çilingir Hizmeti
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {trustCards.map((card) => (
                    <article
                        key={card.id}
                        className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-200"
                    >
                        <div className="text-4xl mb-4">{card.icon}</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{card.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{card.content}</p>
                    </article>
                ))}
            </div>
        </div>
    );
}
