'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import StoryModal from './StoryModal';

export default function StorySection({ stories = [] }) {
    const scrollRef = useRef(null);
    const storyList = stories || [];

    if (storyList.length === 0) return null;
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
                    {storyList.map((story, index) => (
                        <button
                            key={story.id}
                            onClick={() => handleStoryClick(index)}
                            className="flex flex-col items-center gap-2 flex-shrink-0 group outline-none focus:outline-none focus:ring-0 focus-visible:ring-0"
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

            {isModalOpen && (
                <StoryModal
                    stories={storyList}
                    initialIndex={selectedStoryIndex}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
}
