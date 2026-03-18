'use client';

import React, { useState, useRef, useEffect } from 'react';

function VideoPlayer({ video, isActive, onPlay, onPause }) {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        setShowControls(true);
    }, []);

    useEffect(() => {
        if (!videoRef.current) return;
        if (!isActive && isPlaying) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
            setIsPlaying(false);
        }
    }, [isActive, isPlaying]);

    useEffect(() => {
        if (videoRef.current && !hasLoaded) {
            const handleLoadedMetadata = () => {
                if (videoRef.current && !isPlaying) {
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

    const handleMouseEnter = () => setShowControls(true);
    const handleMouseLeave = () => {
        if (!isPlaying) setShowControls(true);
        else setTimeout(() => setShowControls(false), 2000);
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
                muted
                disablePictureInPicture
                controlsList="nodownload nofullscreen noremoteplayback"
                onPlay={() => { setIsPlaying(true); if (onPlay) onPlay(); }}
                onPause={() => { setIsPlaying(false); if (onPause) onPause(); }}
                onEnded={() => { setIsPlaying(false); if (onPause) onPause(); }}
            >
                Tarayıcınız video oynatmayı desteklemiyor.
            </video>
            {isMounted && showControls && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <button
                        onClick={(e) => { e.stopPropagation(); togglePlay(); }}
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

export default function VideoSection({ videos = [] }) {
    const videoList = videos || [];
    const scrollContainerRef = useRef(null);
    const videoRefs = useRef({});
    const [activeVideoId, setActiveVideoId] = useState(null);
    const [isScrolling, setIsScrolling] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.intersectionRatio > 0.7) {
                        const videoId = parseInt(entry.target.getAttribute('data-video-id'));
                        if (videoId && !isScrolling) setActiveVideoId(videoId);
                    }
                });
            },
            { threshold: [0.7, 0.8, 0.9, 1.0], rootMargin: '0px' }
        );
        Object.values(videoRefs.current).forEach((ref) => { if (ref) observer.observe(ref); });
        return () => Object.values(videoRefs.current).forEach((ref) => { if (ref) observer.unobserve(ref); });
    }, [isScrolling]);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;
        let scrollTimeout;
        const handleScroll = () => {
            setIsScrolling(true);
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => setIsScrolling(false), 150);
        };
        container.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            container.removeEventListener('scroll', handleScroll);
            clearTimeout(scrollTimeout);
        };
    }, []);

    useEffect(() => {
        if (activeVideoId === null && videoList.length > 0) setActiveVideoId(videoList[0].id);
    }, [activeVideoId, videoList]);

    const scrollToVideo = (direction) => {
        const currentIndex = videoList.findIndex((v) => v.id === activeVideoId);
        const targetIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
        if (targetIndex < 0 || targetIndex >= videoList.length) return;
        const targetVideoId = videoList[targetIndex].id;
        const targetEl = videoRefs.current[targetVideoId];
        if (targetEl) {
            setIsScrolling(true);
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            setActiveVideoId(targetVideoId);
            setTimeout(() => setIsScrolling(false), 400);
        }
    };

    const currentIndex = videoList.findIndex((v) => v.id === activeVideoId);
    const canGoPrev = currentIndex > 0;
    const canGoNext = currentIndex >= 0 && currentIndex < videoList.length - 1;
    const navButtonClass = "absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-all hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 hidden md:flex";

    if (videoList.length === 0) return null;

    return (
        <div className="relative w-full">
            <button type="button" onClick={() => scrollToVideo('prev')} disabled={!canGoPrev} className={`${navButtonClass} left-2 md:left-4`} aria-label="Önceki video">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button type="button" onClick={() => scrollToVideo('next')} disabled={!canGoNext} className={`${navButtonClass} right-2 md:right-4`} aria-label="Sonraki video">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
            <div ref={scrollContainerRef} className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
                {videoList.map((video, index) => {
                    const isActive = activeVideoId === video.id;
                    const isFirst = index === 0;
                    const isLast = index === videoList.length - 1;
                    return (
                        <article key={video.id} ref={(el) => { videoRefs.current[video.id] = el; }} data-video-id={video.id} className="flex-shrink-0 snap-center w-[calc(75vw-1rem)] md:w-[320px] lg:w-[360px]" style={{ paddingLeft: isFirst ? '1rem' : '0.75rem', paddingRight: isLast ? '1rem' : '0.75rem' }}>
                            <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow w-full">
                                <VideoPlayer video={video} isActive={isActive} onPlay={() => {
                                    Object.keys(videoRefs.current).forEach((id) => {
                                        if (parseInt(id) !== video.id) {
                                            const otherVideo = videoRefs.current[id]?.querySelector('video');
                                            if (otherVideo) otherVideo.pause();
                                        }
                                    });
                                }} onPause={() => { }} />
                            </div>
                        </article>
                    );
                })}
            </div>
        </div>
    );
}
