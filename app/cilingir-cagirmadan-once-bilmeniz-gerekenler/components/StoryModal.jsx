'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

const STORY_DURATION = 5000; // 5 saniye

export default function StoryModal({ stories, initialIndex, onClose }) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [progress, setProgress] = useState(0);
    const intervalRef = useRef(null);
    const startTimeRef = useRef(Date.now());
    const touchStartY = useRef(0);
    const touchEndY = useRef(0);
    const imageRef = useRef(null);
    const isMountedRef = useRef(true);

    // initialIndex değiştiğinde currentIndex'i güncelle (sadece initialIndex değiştiğinde)
    useEffect(() => {
        console.log('🔄 initialIndex değişti, currentIndex güncelleniyor:', { initialIndex, mevcutCurrentIndex: currentIndex });
        setCurrentIndex(initialIndex);
        setProgress(0);
        startTimeRef.current = Date.now();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialIndex]);

    const nextStoryRef = useRef();
    const prevStoryRef = useRef();
    const onCloseRef = useRef(onClose);
    const storiesLengthRef = useRef(stories.length);

    // Refs'i güncelle
    useEffect(() => {
        nextStoryRef.current = () => {
            setCurrentIndex(prev => {
                if (prev < storiesLengthRef.current - 1) {
                    return prev + 1;
                } else {
                    // Modal kapatmayı render dışına taşı
                    setTimeout(() => {
                        onCloseRef.current();
                    }, 0);
                    return prev;
                }
            });
            setProgress(0);
            startTimeRef.current = Date.now();
        };
        prevStoryRef.current = () => {
            setCurrentIndex(prev => {
                if (prev > 0) {
                    return prev - 1;
                }
                return prev;
            });
            setProgress(0);
            startTimeRef.current = Date.now();
        };
        onCloseRef.current = onClose;
        storiesLengthRef.current = stories.length;
    }, [onClose, stories.length]);

    const nextStory = useCallback(() => {
        nextStoryRef.current?.();
    }, []);

    const prevStory = useCallback(() => {
        prevStoryRef.current?.();
    }, []);

    useEffect(() => {
        // Progress bar animasyonu
        console.log('🔄 Animation başlatılıyor, currentIndex:', currentIndex);
        isMountedRef.current = true;
        setProgress(0);
        startTimeRef.current = Date.now();

        const animate = () => {
            if (!isMountedRef.current) {
                return;
            }

            const elapsed = Date.now() - startTimeRef.current;
            const newProgress = Math.min((elapsed / STORY_DURATION) * 100, 100);

            setProgress(newProgress);

            if (newProgress < 100 && isMountedRef.current) {
                intervalRef.current = requestAnimationFrame(animate);
            } else if (newProgress >= 100 && isMountedRef.current) {
                console.log('✅ Progress tamamlandı, sonraki story\'ye geçiliyor');
                // Progress tamamlandı, sonraki story'ye geç
                setTimeout(() => {
                    if (isMountedRef.current) {
                        nextStoryRef.current?.();
                    }
                }, 100);
            }
        };

        // İlk frame'i başlat
        intervalRef.current = requestAnimationFrame(animate);

        return () => {
            console.log('🧹 Cleanup - animation iptal ediliyor');
            isMountedRef.current = false;
            if (intervalRef.current) {
                cancelAnimationFrame(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [currentIndex]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') {
            // ESC tuşu - render dışına taşı
            setTimeout(() => {
                onClose();
            }, 0);
        } else if (e.key === 'ArrowRight') {
            nextStory();
        } else if (e.key === 'ArrowLeft') {
            prevStory();
        }
    }, [onClose, nextStory, prevStory]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [handleKeyDown]);

    // Swipe down to close
    const handleTouchStart = (e) => {
        touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
        touchEndY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
        const swipeDistance = touchEndY.current - touchStartY.current;
        if (swipeDistance > 100) {
            // Swipe down - render dışına taşı
            setTimeout(() => {
                onClose();
            }, 0);
        }
    };

    const currentStory = stories[currentIndex];

    return (
        <div
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
            onClick={(e) => {
                // Boşluğa tıklama - render dışına taşı
                if (e.target === e.currentTarget) {
                    setTimeout(() => {
                        onClose();
                    }, 0);
                }
            }}
        >
            {/* Progress Bars */}
            <div
                id="story-progress-bars"
                className="absolute top-0 left-0 right-0 flex gap-1 px-2 pt-2 z-50"
                style={{ zIndex: 50 }}
            >
                {stories.map((_, index) => {
                    const isWatched = index < currentIndex;
                    const isCurrent = index === currentIndex;
                    const progressWidth = isWatched
                        ? 100
                        : isCurrent
                            ? Math.max(0, Math.min(100, progress))
                            : 0;

                    return (
                        <div
                            key={index}
                            id={`progress-bar-${index}`}
                            className="flex-1 h-0.5 rounded-full overflow-hidden relative"
                            style={{
                                zIndex: 50 + index,
                                backgroundColor: 'rgba(255, 255, 255, 0.3)' // İzlenmeyen story'ler için açık beyaz
                            }}
                        >
                            <div
                                id={`progress-fill-${index}`}
                                className="h-full absolute left-0 top-0 bg-white"
                                style={{
                                    width: `${progressWidth}%`,
                                    transition: 'none', // Tüm geçişlerde anında değişim
                                    willChange: isCurrent ? 'width' : 'auto',
                                    zIndex: 51 + index
                                }}
                            />
                        </div>
                    );
                })}
            </div>

            {/* Header */}
            <div className="absolute top-0 left-0 right-0 pt-12 px-4" style={{ zIndex: 100 }}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                            BÇ
                        </div>
                        <div>
                            <p className="text-white font-semibold text-sm">Biçilingir Rehberi</p>
                            <p className="text-white text-xs opacity-75">
                                {currentIndex + 1} / {stories.length}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            // X butonu - render dışına taşı
                            setTimeout(() => {
                                onClose();
                            }, 0);
                        }}
                        className="text-white text-2xl font-bold hover:opacity-75 transition-opacity relative"
                        style={{ zIndex: 101 }}
                        aria-label="Kapat"
                    >
                        ×
                    </button>
                </div>
            </div>

            {/* Story Content */}
            <div
                ref={imageRef}
                className="relative w-full h-full flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* Left Click Area - Previous Story */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        prevStory();
                    }}
                    className="absolute left-0 top-0 bottom-0 w-1/3 cursor-pointer"
                    style={{ zIndex: 20 }}
                    aria-label="Önceki story"
                />

                {/* Story Image */}
                <div className="relative w-full h-full max-w-md mx-auto">
                    <Image
                        src={currentStory.image}
                        alt={currentStory.title}
                        fill
                        sizes="100vw"
                        className="object-contain"
                        priority
                    />
                </div>

                {/* Right Click Area - Next Story */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        nextStory();
                    }}
                    className="absolute right-0 top-0 bottom-0 w-1/3 cursor-pointer"
                    style={{ zIndex: 20 }}
                    aria-label="Sonraki story"
                />
            </div>

        </div>
    );
}
