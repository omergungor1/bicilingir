'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

// Debug: Konsolda window.__DEBUG_GALLERY = true yaparak logları aç

export default function ImageGallery({ images = [] }) {
    const imageList = images || [];
    const [selectedImage, setSelectedImage] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollContainerRef = useRef(null);
    const imageRefs = useRef([]);
    const isScrollingProgrammatically = useRef(false);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;
        const observerOptions = { root: container, rootMargin: '0px', threshold: 0.5 };
        const observerCallback = (entries) => {
            if (isScrollingProgrammatically.current) return;
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const index = imageRefs.current.findIndex(ref => ref === entry.target);
                    if (index !== -1) {
                        if (typeof window !== 'undefined' && window.__DEBUG_GALLERY) console.log('[ImageGallery] observer aktif resim', { index });
                        setActiveIndex(index);
                    }
                }
            });
        };
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        const observeRefs = () => {
            for (let i = 0; i < imageList.length; i++) {
                const ref = imageRefs.current[i];
                if (ref) observer.observe(ref);
            }
        };
        const id = setTimeout(observeRefs, 0);
        return () => {
            clearTimeout(id);
            imageRefs.current.forEach((ref) => { if (ref) observer.unobserve(ref); });
        };
    }, [imageList.length]);

    const scrollToImage = (index) => {
        const imageRef = imageRefs.current[index];
        if (imageRef) {
            if (typeof window !== 'undefined' && window.__DEBUG_GALLERY) console.log('[ImageGallery] scrollToImage', { index, activeIndex, imageRef: !!imageRef });
            isScrollingProgrammatically.current = true;
            setActiveIndex(index);
            imageRef.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            setTimeout(() => { isScrollingProgrammatically.current = false; }, 500);
        } else if (typeof window !== 'undefined' && window.__DEBUG_GALLERY) {
            console.warn('[ImageGallery] scrollToImage - imageRef yok', { index, refs: imageRefs.current });
        }
    };

    const canGoPrev = activeIndex > 0;
    const canGoNext = activeIndex < imageList.length - 1;
    const navButtonClass = "absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-all hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 hidden md:flex";

    if (imageList.length === 0) return null;

    return (
        <>
            <div className="relative">
                <button type="button" onClick={() => scrollToImage(activeIndex - 1)} disabled={!canGoPrev} className={`${navButtonClass} left-2 md:left-4`} aria-label="Önceki resim">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button type="button" onClick={() => scrollToImage(activeIndex + 1)} disabled={!canGoNext} className={`${navButtonClass} right-2 md:right-4`} aria-label="Sonraki resim">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
                <div ref={scrollContainerRef} className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {imageList.map((image, index) => (
                        <div key={image.id} ref={(el) => (imageRefs.current[index] = el)} className="flex-shrink-0 snap-center w-full max-w-md">
                            <button onClick={() => setSelectedImage(image)} className="relative w-full aspect-square rounded-lg overflow-hidden group hover:opacity-90 transition-opacity">
                                <Image src={image.url} alt={image.alt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-300" loading={index < 2 ? 'eager' : 'lazy'} />
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center gap-2 mt-4">
                    {imageList.map((_, index) => (
                        <button key={index} onClick={() => scrollToImage(index)} className={`transition-all duration-300 rounded-full ${activeIndex === index ? 'w-8 h-2 bg-blue-600' : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'}`} aria-label={`Resim ${index + 1}`} />
                    ))}
                </div>
            </div>
            {selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
                    <div className="relative max-w-4xl max-h-[90vh]">
                        <button onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }} className="absolute top-4 right-4 text-white text-2xl font-bold z-10 hover:text-gray-300" aria-label="Kapat">×</button>
                        <Image src={selectedImage.url} alt={selectedImage.alt} width={1200} height={1200} className="max-w-full max-h-[90vh] object-contain rounded-lg" />
                    </div>
                </div>
            )}
        </>
    );
}
