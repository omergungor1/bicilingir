'use client';

import React, { useState, useEffect } from 'react';

const posts = [
    {
        id: 1,
        title: 'Çilingir çağırmadan önce yapılan en büyük hata',
        content: `❌ Kapıyı zorlamak veya kırmaya çalışmak\n\n✅ Doğrusu: Çilingir gelene kadar sabırlı olun. Zorlama kapıya kalıcı hasar verir ve maliyeti artırır.\n\n💡 İpucu: Çilingir özel aletlerle kapıyı hasarsız açabilir.`,
        time: '2 saat önce',
        reactions: 125,
        comments: 23
    },
    {
        id: 2,
        title: 'Kapıyı zorlamak neden yanlıştır?',
        content: `🔒 Kapıyı zorlamak:\n\n• Kilit mekanizmasını bozar\n• Kapı çerçevesine zarar verir\n• Tamir maliyetini 2-3 kat artırır\n• Güvenlik riski oluşturur\n\n✅ Çözüm: Profesyonel çilingir çağırın.`,
        time: '5 saat önce',
        reactions: 89,
        comments: 15
    },
    {
        id: 3,
        title: 'Fiyat sormadan çağırmanın riski',
        content: `💰 Fiyat sormadan çilingir çağırmak:\n\n⚠️ Sürpriz fiyatlarla karşılaşabilirsiniz\n⚠️ Gece ücreti eklenebilir\n⚠️ Mesafe ücreti eklenebilir\n\n✅ Çözüm: Bi Çilingir'de önceden fiyat bilgisi alın.`,
        time: '1 gün önce',
        reactions: 67,
        comments: 12
    },
    {
        id: 4,
        title: 'Güvenilir çilingir nasıl seçilir?',
        content: `🔍 Kontrol listesi:\n\n✓ Lisanslı ve sertifikalı olmalı\n✓ Müşteri yorumlarını okuyun\n✓ Fiyat bilgisini önceden alın\n✓ Kimlik kontrolü yapmalı\n✓ Garanti vermeli\n\n✅ Bi Çilingir'de tüm çilingirler doğrulanmıştır.`,
        time: '2 gün önce',
        reactions: 203,
        comments: 45
    }
];

export default function PostFeed() {
    const [favorites, setFavorites] = useState(new Set());
    const [isMounted, setIsMounted] = useState(false);

    // Client-side mount kontrolü - hydration hatasını önlemek için
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const toggleFavorite = (postId) => {
        setFavorites(prev => {
            const newSet = new Set(prev);
            if (newSet.has(postId)) {
                newSet.delete(postId);
            } else {
                newSet.add(postId);
            }
            return newSet;
        });
    };

    // Server-side render'da boş div döndür
    if (!isMounted) {
        return (
            <div className="space-y-4">
                {posts.map((post) => (
                    <article
                        key={post.id}
                        className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                    >
                        <header className="flex items-start justify-between p-4 pb-3">
                            <div className="flex items-start gap-3 flex-1">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                    BÇ
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-gray-900 text-sm">Biçilingir Rehberi</h3>
                                    </div>
                                    <p className="text-xs text-gray-600 text-xs mb-1 truncate">
                                        Çilingir Hizmetleri Rehberi
                                    </p>
                                    <p className="text-xs text-gray-500">{post.time} • Düzenlendi</p>
                                </div>
                            </div>
                            <div className="w-7 h-7"></div>
                        </header>
                        <div className="px-4 pb-3">
                            <div className="text-gray-900 whitespace-pre-line leading-relaxed text-sm">
                                {post.content}
                            </div>
                        </div>
                        <div className="px-4 pb-4 flex items-center gap-2 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                                <span className="text-sm">👍</span>
                                <span className="text-sm">💡</span>
                                <span className="text-sm">❤️</span>
                            </div>
                            <span>{post.reactions}</span>
                            <span>•</span>
                            <span>{post.comments} Yorum</span>
                        </div>
                    </article>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {posts.map((post) => {
                const isFavorited = favorites.has(post.id);
                return (
                    <article
                        key={post.id}
                        className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                    >
                        {/* Post Header */}
                        <header className="flex items-start justify-between p-4 pb-3">
                            <div className="flex items-start gap-3 flex-1">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                    BÇ
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-gray-900 text-sm">Biçilingir Rehberi</h3>
                                    </div>
                                    <p className="text-xs text-gray-600 text-xs mb-1 truncate">
                                        Çilingir Hizmetleri Rehberi
                                    </p>
                                    <p className="text-xs text-gray-500">{post.time} • Düzenlendi</p>
                                </div>
                            </div>
                            <button
                                onClick={() => toggleFavorite(post.id)}
                                className={`p-1 rounded hover:bg-gray-100 transition-colors ${isFavorited
                                    ? 'text-red-600'
                                    : 'text-gray-400 hover:text-red-600'
                                    }`}
                                aria-label={isFavorited ? 'Favorilerden çıkar' : 'Favorilere ekle'}
                            >
                                {isFavorited ? (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                )}
                            </button>
                        </header>

                        {/* Post Content */}
                        <div className="px-4 pb-3">
                            <div className="text-gray-900 whitespace-pre-line leading-relaxed text-sm">
                                {post.content}
                            </div>
                        </div>

                        {/* Engagement Metrics */}
                        <div className="px-4 pb-4 flex items-center gap-2 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                                <span className="text-sm">👍</span>
                                <span className="text-sm">💡</span>
                                <span className="text-sm">❤️</span>
                            </div>
                            <span>{post.reactions}</span>
                            <span>•</span>
                            <span>{post.comments} Yorum</span>
                        </div>
                    </article>
                );
            })}
        </div>
    );
}
