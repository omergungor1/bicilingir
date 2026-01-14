'use client';

import React, { useState, useRef, useEffect } from 'react';

const videos = [
    {
        id: 1,
        url: 'https://ocljqspluklgxppjctnj.supabase.co/storage/v1/object/public/storybox/shorts/short-1.mp4',
        description: 'Bu videoda çilingirin kapıyı hasarsız açma sürecini görüyorsunuz. Profesyonel aletlerle kapıya zarar vermeden işlem yapılıyor.'
    },
    {
        id: 2,
        url: 'https://ocljqspluklgxppjctnj.supabase.co/storage/v1/object/public/storybox/shorts/short-2.mp4',
        description: 'Çelik kapı açma işlemi. Modern kilit sistemlerinde özel teknikler kullanılıyor.'
    },
    {
        id: 3,
        url: 'https://ocljqspluklgxppjctnj.supabase.co/storage/v1/object/public/storybox/shorts/short-3.mp4',
        description: 'Oto anahtar kopyalama süreci. Çipli anahtarlar için özel ekipmanlar kullanılıyor.'
    },
    {
        id: 4,
        url: 'https://ocljqspluklgxppjctnj.supabase.co/storage/v1/object/public/storybox/shorts/short-4.mp4',
        description: 'Kilit değişimi işlemi. Eski kilit çıkarılıp yeni güvenlik kilidi takılıyor.'
    },
    {
        id: 5,
        url: 'https://ocljqspluklgxppjctnj.supabase.co/storage/v1/object/public/storybox/shorts/short-5.mp4',
        description: 'Gece acil çilingir hizmeti. 7/24 hizmet veren profesyonel ekipler.'
    }
];

function VideoPlayer({ video, isActive, onPlay, onPause }) {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);

    // Client-side mount kontrolü - hydration hatasını önlemek için
    useEffect(() => {
        setIsMounted(true);
        setShowControls(true);
    }, []);

    // Aktif olmayan videoları durdur
    useEffect(() => {
        if (!videoRef.current) return;

        if (!isActive && isPlaying) {
            // Aktif olmayan video dursun
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
            setIsPlaying(false);
        }
    }, [isActive, isPlaying]);

    // Video yüklendiğinde ilk frame'i göster
    useEffect(() => {
        if (videoRef.current && !hasLoaded) {
            const handleLoadedMetadata = () => {
                if (videoRef.current && !isPlaying) {
                    // İlk frame'i göstermek için currentTime'ı ayarla
                    videoRef.current.currentTime = 0.1;
                    setTimeout(() => {
                        if (videoRef.current && !isPlaying) {
                            videoRef.current.currentTime = 0;
                        }
                    }, 100);
                }
            };

            const handleLoadedData = () => {
                if (videoRef.current && !isPlaying) {
                    // İlk frame'i göstermek için currentTime'ı ayarla
                    videoRef.current.currentTime = 0.1;
                    setTimeout(() => {
                        if (videoRef.current && !isPlaying) {
                            videoRef.current.currentTime = 0;
                        }
                    }, 100);
                    setHasLoaded(true);
                }
            };

            videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
            videoRef.current.addEventListener('loadeddata', handleLoadedData);

            return () => {
                if (videoRef.current) {
                    videoRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
                    videoRef.current.removeEventListener('loadeddata', handleLoadedData);
                }
            };
        }
    }, [hasLoaded, isPlaying]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
                if (onPause) onPause();
            } else {
                videoRef.current.play();
                setIsPlaying(true);
                if (onPlay) onPlay();
            }
        }
    };

    const handleVideoClick = (e) => {
        e.stopPropagation();
        togglePlay();
    };

    const handleMouseEnter = () => {
        setShowControls(true);
    };

    const handleMouseLeave = () => {
        if (!isPlaying) {
            setShowControls(true);
        } else {
            setTimeout(() => {
                setShowControls(false);
            }, 2000);
        }
    };

    return (
        <div
            className="relative aspect-[9/16] cursor-pointer group"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleVideoClick}
        >
            <video
                ref={videoRef}
                src={video.url}
                className="w-full h-full object-cover"
                preload="auto"
                playsInline
                disablePictureInPicture
                controlsList="nodownload nofullscreen noremoteplayback"
                onPlay={() => {
                    setIsPlaying(true);
                    if (onPlay) onPlay();
                }}
                onPause={() => {
                    setIsPlaying(false);
                    if (onPause) onPause();
                }}
                onEnded={() => {
                    setIsPlaying(false);
                    if (onPause) onPause();
                }}
            >
                Tarayıcınız video oynatmayı desteklemiyor.
            </video>

            {/* Custom Play/Pause Button */}
            {isMounted && showControls && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            togglePlay();
                        }}
                        className="w-16 h-16 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 flex items-center justify-center transition-all pointer-events-auto shadow-lg"
                        aria-label={isPlaying ? 'Duraklat' : 'Oynat'}
                    >
                        {isPlaying ? (
                            <svg className="w-8 h-8 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                            </svg>
                        ) : (
                            <svg className="w-8 h-8 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}

export default function VideoSection() {
    const scrollContainerRef = useRef(null);
    const videoRefs = useRef({});
    const [activeVideoId, setActiveVideoId] = useState(null);
    const [isScrolling, setIsScrolling] = useState(false);

    // Intersection Observer ile aktif videoyu tespit et
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.intersectionRatio > 0.7) {
                        const videoId = parseInt(entry.target.getAttribute('data-video-id'));
                        if (videoId && !isScrolling) {
                            setActiveVideoId(videoId);
                        }
                    }
                });
            },
            {
                threshold: [0.7, 0.8, 0.9, 1.0],
                rootMargin: '0px'
            }
        );

        Object.values(videoRefs.current).forEach((ref) => {
            if (ref) {
                observer.observe(ref);
            }
        });

        return () => {
            Object.values(videoRefs.current).forEach((ref) => {
                if (ref) {
                    observer.unobserve(ref);
                }
            });
        };
    }, [isScrolling]);

    // Scroll event handler
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        let scrollTimeout;
        const handleScroll = () => {
            setIsScrolling(true);
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                setIsScrolling(false);
            }, 150);
        };

        container.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            container.removeEventListener('scroll', handleScroll);
            clearTimeout(scrollTimeout);
        };
    }, []);

    // İlk videoyu aktif yap
    useEffect(() => {
        if (activeVideoId === null && videos.length > 0) {
            setActiveVideoId(videos[0].id);
        }
    }, [activeVideoId]);

    return (
        <div className="relative w-full">
            <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    WebkitOverflowScrolling: 'touch',
                }}
            >
                {videos.map((video, index) => {
                    const isActive = activeVideoId === video.id;
                    const isFirst = index === 0;
                    const isLast = index === videos.length - 1;

                    return (
                        <article
                            key={video.id}
                            ref={(el) => {
                                videoRefs.current[video.id] = el;
                            }}
                            data-video-id={video.id}
                            className="flex-shrink-0 snap-center"
                            style={{
                                width: 'calc(75vw - 1rem)',
                                paddingLeft: isFirst ? '1rem' : '0.75rem',
                                paddingRight: isLast ? '1rem' : '0.75rem',
                            }}
                        >
                            <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow w-full">
                                <VideoPlayer
                                    video={video}
                                    isActive={isActive}
                                    onPlay={() => {
                                        // Diğer videoları durdur
                                        Object.keys(videoRefs.current).forEach((id) => {
                                            if (parseInt(id) !== video.id) {
                                                const otherVideo = videoRefs.current[id]?.querySelector('video');
                                                if (otherVideo) {
                                                    otherVideo.pause();
                                                }
                                            }
                                        });
                                    }}
                                    onPause={() => { }}
                                />
                            </div>
                        </article>
                    );
                })}
            </div>
        </div>
    );
}
