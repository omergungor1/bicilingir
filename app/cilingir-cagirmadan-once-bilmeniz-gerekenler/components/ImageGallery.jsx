'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

const images = [
    {
        id: 1,
        url: 'https://ocljqspluklgxppjctnj.supabase.co/storage/v1/object/public/storybox/images/img-5.avif',
        alt: 'Kapı kilidi açma işlemi - Profesyonel çilingir aletleri'
    },
    {
        id: 2,
        url: 'https://ocljqspluklgxppjctnj.supabase.co/storage/v1/object/public/storybox/images/img-6.jpeg',
        alt: 'Çelik kapı kilit sistemi - Modern güvenlik kilitleri'
    },
    {
        id: 3,
        url: 'https://ocljqspluklgxppjctnj.supabase.co/storage/v1/object/public/storybox/images/img-7.jpg',
        alt: 'Oto anahtar kopyalama - Araç anahtarı yapımı'
    },
    {
        id: 4,
        url: 'https://ocljqspluklgxppjctnj.supabase.co/storage/v1/object/public/storybox/images/img-8.jpg',
        alt: 'Kasa açma işlemi - Güvenlik kasası çilingir hizmeti'
    },
    {
        id: 5,
        url: 'https://ocljqspluklgxppjctnj.supabase.co/storage/v1/object/public/storybox/images/img-9.webp',
        alt: 'Çilingir aletleri - Profesyonel ekipmanlar'
    },
    {
        id: 6,
        url: 'https://ocljqspluklgxppjctnj.supabase.co/storage/v1/object/public/storybox/images/img-10.jpg',
        alt: 'Kapı montajı - Yeni kilit takımı'
    }
];

export default function ImageGallery() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollContainerRef = useRef(null);
    const imageRefs = useRef([]);

    // Intersection Observer ile aktif resmi tespit et
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const observerOptions = {
            root: container,
            rootMargin: '0px',
            threshold: 0.5 // Resmin %50'si görünürse aktif say
        };

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const index = imageRefs.current.findIndex(ref => ref === entry.target);
                    if (index !== -1) {
                        setActiveIndex(index);
                    }
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        // Her resmi observe et
        imageRefs.current.forEach((ref) => {
            if (ref) {
                observer.observe(ref);
            }
        });

        return () => {
            imageRefs.current.forEach((ref) => {
                if (ref) {
                    observer.unobserve(ref);
                }
            });
        };
    }, []);

    // Dot'a tıklayınca resme scroll et
    const scrollToImage = (index) => {
        const container = scrollContainerRef.current;
        const imageRef = imageRefs.current[index];

        if (container && imageRef) {
            const containerWidth = container.clientWidth;
            const imageRect = imageRef.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const scrollLeft = container.scrollLeft;
            const imageLeft = imageRect.left - containerRect.left + scrollLeft;
            const imageCenter = imageLeft + imageRect.width / 2;
            const targetScroll = imageCenter - containerWidth / 2;

            container.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
        }
    };

    return (
        <>
            {/* Horizontal Scroll Gallery */}
            <div className="relative">
                <div
                    ref={scrollContainerRef}
                    className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 hide-scrollbar"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none'
                    }}
                >
                    {images.map((image, index) => (
                        <div
                            key={image.id}
                            ref={(el) => (imageRefs.current[index] = el)}
                            className="flex-shrink-0 snap-center w-full max-w-md"
                        >
                            <button
                                onClick={() => setSelectedImage(image)}
                                className="relative w-full aspect-square rounded-lg overflow-hidden group hover:opacity-90 transition-opacity"
                            >
                                <Image
                                    src={image.url}
                                    alt={image.alt}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    loading={index < 2 ? 'eager' : 'lazy'}
                                />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Dot Indicators */}
                <div className="flex justify-center gap-2 mt-4">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => scrollToImage(index)}
                            className={`transition-all duration-300 rounded-full ${activeIndex === index
                                    ? 'w-8 h-2 bg-blue-600'
                                    : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                                }`}
                            aria-label={`Resim ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-4xl max-h-[90vh]">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImage(null);
                            }}
                            className="absolute top-4 right-4 text-white text-2xl font-bold z-10 hover:text-gray-300"
                            aria-label="Kapat"
                        >
                            ×
                        </button>
                        <Image
                            src={selectedImage.url}
                            alt={selectedImage.alt}
                            width={1200}
                            height={1200}
                            className="max-w-full max-h-[90vh] object-contain rounded-lg"
                        />
                    </div>
                </div>
            )}
        </>
    );
}
