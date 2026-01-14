'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import StoryModal from './StoryModal';

const stories = [
    {
        id: 1,
        title: 'Kapıda kaldım',
        image: 'https://ocljqspluklgxppjctnj.supabase.co/storage/v1/object/public/storybox/images/img-1.avif',
        description: 'Kapınız kilitli kaldıysa panik yapmayın. Profesyonel çilingirler özel aletlerle kapıyı hasarsız açabilir.',
        scrollTo: 'kapida-kaldim'
    },
    {
        id: 2,
        title: 'Anahtar içeride',
        image: 'https://ocljqspluklgxppjctnj.supabase.co/storage/v1/object/public/storybox/images/img-2.jpg',
        description: 'Anahtarınız içeride kaldıysa, kapıyı zorlamak yerine çilingir çağırın. Zorlama kalıcı hasara yol açar.',
        scrollTo: 'anahtar-iceride'
    },
    {
        id: 3,
        title: 'Fiyatlar',
        image: 'https://ocljqspluklgxppjctnj.supabase.co/storage/v1/object/public/storybox/images/img-3.jpg',
        description: 'Çilingir fiyatları hizmet türüne, saate ve mesafeye göre değişir. Önceden fiyat bilgisi alın.',
        scrollTo: 'fiyatlar'
    },
    {
        id: 4,
        title: 'Gece çilingir',
        image: 'https://ocljqspluklgxppjctnj.supabase.co/storage/v1/object/public/storybox/images/img-4.jpg',
        description: 'Gece saatlerinde çilingir hizmeti için ek ücret alınabilir. Acil durumlarda 7/24 hizmet veren çilingirler mevcuttur.',
        scrollTo: 'gece-cilingir'
    },
    {
        id: 5,
        title: 'Yapılan hatalar',
        image: 'https://ocljqspluklgxppjctnj.supabase.co/storage/v1/object/public/storybox/images/img-1.avif',
        description: 'Kapıyı zorlamak, fiyat sormadan çağırmak ve güvenilir olmayan çilingir seçmek en büyük hatalardır.',
        scrollTo: 'yapilan-hatalar'
    }
];

export default function StorySection() {
    const scrollRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 200;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const handleStoryClick = (index) => {
        console.log('🎯 Story tıklandı, modal açılıyor:', { index, storyTitle: stories[index]?.title });
        setSelectedStoryIndex(index);
        setIsModalOpen(true);
    };

    return (
        <div className="relative">
            <div className="flex items-center gap-2 px-4">
                <button
                    onClick={() => scroll('left')}
                    className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors z-10"
                    aria-label="Sola kaydır"
                >
                    ←
                </button>

                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-2"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {stories.map((story, index) => (
                        <button
                            key={story.id}
                            onClick={() => handleStoryClick(index)}
                            className="flex flex-col items-center gap-2 flex-shrink-0 group"
                            aria-label={story.title}
                        >
                            <div
                                className="relative rounded-full flex items-center justify-center"
                                style={{
                                    background: 'linear-gradient(135deg, #ec4899, #f97316)',
                                    width: '80px',
                                    height: '80px',
                                }}
                            >
                                <div className="relative rounded-full overflow-hidden bg-white" style={{ width: 'calc(100% - 6px)', height: 'calc(100% - 6px)' }}>
                                    <Image
                                        src={story.image}
                                        alt={story.title}
                                        fill
                                        sizes="80px"
                                        className="object-cover rounded-full p-0.5"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                            <span className="text-xs font-medium text-gray-900 text-center max-w-[80px] truncate">
                                {story.title}
                            </span>
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => scroll('right')}
                    className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors z-10"
                    aria-label="Sağa kaydır"
                >
                    →
                </button>
            </div>

            {/* Story Modal */}
            {isModalOpen && (
                <StoryModal
                    stories={stories}
                    initialIndex={selectedStoryIndex}
                    onClose={() => {
                        console.log('🚪 Modal kapatılıyor');
                        setIsModalOpen(false);
                    }}
                />
            )}
        </div>
    );
}
