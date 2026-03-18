'use client';

import React, { useState, useEffect } from 'react';

export default function PostFeed({ posts = [] }) {
    const postList = posts || [];
    const [favorites, setFavorites] = useState(new Set());
    const [isMounted, setIsMounted] = useState(false);

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

    if (postList.length === 0) return null;

    const CardContent = ({ post, isFavorited, onToggle }) => (
        <article
            className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden
                shadow-sm hover:shadow-xl hover:border-amber-200/60
                transition-all duration-300 ease-out"
        >
            {/* Sol kenar vurgusu */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="p-6 sm:p-7">
                {/* Başlık alanı */}
                <div className="flex items-start justify-between gap-4 mb-4">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 leading-tight pr-10">
                        {post.title}
                    </h2>
                    <button
                        onClick={() => onToggle(post.id)}
                        className={`flex-shrink-0 p-2 rounded-full transition-all duration-200
                            ${isFavorited
                                ? 'text-rose-500 bg-rose-50'
                                : 'text-gray-300 hover:text-rose-400 hover:bg-rose-50/50'
                            }`}
                        aria-label={isFavorited ? 'Beğeniyi kaldır' : 'Beğen'}
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
                </div>

                {/* Özet paragraf */}
                {post.summary && (
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                        {post.summary}
                    </p>
                )}

                {/* Madde listesi */}
                {post.points && post.points.length > 0 && (
                    <ul className="space-y-2 mb-4">
                        {post.points.map((point, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-medium mt-0.5">
                                    {idx + 1}
                                </span>
                                <span>{point}</span>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Önemli ipucu kutusu */}
                {post.tip && (
                    <div className="mt-4 p-4 rounded-xl bg-amber-50/80 border border-amber-100">
                        <p className="text-sm text-amber-900 font-medium flex items-start gap-2">
                            <span className="text-amber-500 flex-shrink-0">💡</span>
                            <span>{post.tip}</span>
                        </p>
                    </div>
                )}
            </div>
        </article>
    );

    return (
        <div className="space-y-5">
            {postList.map((post) => (
                <CardContent
                    key={post.id}
                    post={post}
                    isFavorited={isMounted && favorites.has(post.id)}
                    onToggle={toggleFavorite}
                />
            ))}
        </div>
    );
}
