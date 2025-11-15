'use client';

import React from 'react';
import { ArrowUp, MapPin } from 'lucide-react';

export default function ScrollToTopButton() {
    const scrollToIlceSection = () => {
        const element = document.getElementById('ilce-secim-bolumu');
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    return (
        <button
            onClick={scrollToIlceSection}
            className="group inline-flex items-center gap-3 bg-white/20 hover:bg-white/30 border-2 border-white/40 hover:border-white/60 rounded-xl px-6 py-4 text-base font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl backdrop-blur-sm"
            aria-label="İlçe seçim bölümüne git"
        >
            <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span>Tüm İlçeleri Gör</span>
            </div>
            <ArrowUp className="h-5 w-5 group-hover:-translate-y-1 transition-transform" />
        </button>
    );
}

