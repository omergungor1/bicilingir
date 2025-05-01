"use client";

import React, { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';
import { Clock, Info } from 'lucide-react';

/**
 * Anlık saate göre çilingir fiyatlarını gösteren bileşen
 * @param {Object} props - Bileşen parametreleri
 * @param {Object} props.prices - Fiyat bilgileri
 * @param {Object} props.prices.mesai - Normal mesai fiyatları (min-max)
 * @param {Object} props.prices.aksam - Akşam mesai fiyatları (min-max)
 * @param {Object} props.prices.gece - Gece mesai fiyatları (min-max)
 */
const PriceDisplay = ({ prices }) => {
    const [currentTimeframe, setCurrentTimeframe] = useState({
        type: 'mesai',
        label: 'Normal Mesai',
        color: 'green',
        timeLabel: '09:00 - 17:00',
        active: true
    });

    // Zaman dilimleri tanımları
    const timeframes = [
        {
            type: 'mesai',
            label: 'Normal Mesai',
            color: 'green',
            timeLabel: '09:00 - 17:00',
            active: false,
            hours: { start: 9, end: 17 }
        },
        {
            type: 'aksam',
            label: 'Akşam Mesai',
            color: 'orange',
            timeLabel: '17:00 - 21:00',
            active: false,
            hours: { start: 17, end: 21 }
        },
        {
            type: 'gece',
            label: 'Gece Mesai',
            color: 'red',
            timeLabel: '21:00 - 09:00',
            active: false,
            hours: { start: 21, end: 9 }
        }
    ];

    // Mevcut saate göre zaman dilimini belirle
    useEffect(() => {
        const getCurrentTimeframe = () => {
            const now = new Date();
            const hour = now.getHours();

            let currentFrame;

            if (hour >= 9 && hour < 17) {
                currentFrame = timeframes[0]; // Mesai
            } else if (hour >= 17 && hour < 21) {
                currentFrame = timeframes[1]; // Akşam
            } else {
                currentFrame = timeframes[2]; // Gece
            }

            setCurrentTimeframe({ ...currentFrame, active: true });
        };

        getCurrentTimeframe();

        // Her dakika güncelle
        const interval = setInterval(getCurrentTimeframe, 60000);
        return () => clearInterval(interval);
    }, []);

    // Aktif zaman dilimine göre fiyat bilgisini al
    const getCurrentPrice = () => {
        if (!prices) return { min: 0, max: 0 };

        switch (currentTimeframe.type) {
            case 'mesai':
                return prices.mesai;
            case 'aksam':
                return prices.aksam;
            case 'gece':
                return prices.gece;
            default:
                return prices.mesai;
        }
    };

    const currentPrice = getCurrentPrice();

    // Button rengini zaman dilimine göre belirle
    const getButtonColor = () => {
        switch (currentTimeframe.type) {
            case 'mesai':
                return 'bg-green-100 text-green-800 hover:bg-green-200';
            case 'aksam':
                return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
            case 'gece':
                return 'bg-red-100 text-red-800 hover:bg-red-200';
            default:
                return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={`gap-2 flex items-center ${getButtonColor()}`}
                >
                    <Clock className="h-4 w-4" />
                    <span>{currentPrice.min} - {currentPrice.max} ₺</span>
                    <Info className="h-3 w-3 opacity-70" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="space-y-4">
                    <h3 className="font-medium text-lg">Çilingir Fiyatları</h3>
                    <p className="text-sm text-gray-500">
                        Fiyatlar zaman dilimine göre değişiklik gösterebilir. Şu an <strong>{currentTimeframe.label}</strong> saatleri içindesiniz.
                    </p>

                    <div className="space-y-2">
                        {timeframes.map((timeframe) => (
                            <div
                                key={timeframe.type}
                                className={`flex justify-between items-center p-2 rounded ${timeframe.type === currentTimeframe.type
                                    ? `bg-${timeframe.color}-50 border border-${timeframe.color}-200`
                                    : ''
                                    }`}
                            >
                                <div>
                                    <p className={`font-medium text-${timeframe.color}-700`}>
                                        {timeframe.label}
                                        {timeframe.type === currentTimeframe.type && ' (Aktif)'}
                                    </p>
                                    <p className="text-xs text-gray-500">{timeframe.timeLabel}</p>
                                </div>
                                <div className={`font-bold text-${timeframe.color}-700`}>
                                    {prices[timeframe.type].min} - {prices[timeframe.type].max} ₺
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="text-xs text-gray-500 italic">
                        Not: Gösterilen fiyatlar yaklaşık olup, kesin fiyat çilingiriniz tarafından belirlenecektir.
                    </p>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default PriceDisplay; 