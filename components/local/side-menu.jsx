"use client"
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { MapPin, ChevronRight } from "lucide-react";
import Link from "next/link";
import Map from "../Map";
import { services } from "../../lib/test-data";

import PriceDisplay from "../ui/price-display";


export default function SideMenu(params) {

    const { map = { locksmithPositions: [], mapCenter: { lat: 0, lng: 0 } }, nearbySection = { title: 'Yakındaki Mahalleler', description: '', data: [{ id: 1, name: '', slug: '' }] }, locksmithPricing = { title: '', description: '', data: [{ id: 1, name: '', minPrice: 0, maxPrice: 0 }] }, categorySection = { title: '', description: '', data: [{ id: 1, name: '', slug: '' }] }, formattedName = '', type = 'city' } = params || {};

    const locksmithPositions = map.locksmithPositions
    const mapCenter = map.mapCenter

    return (
        <div>
            {/* Harita */}
            {locksmithPositions.length > 0 && <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Konum</h3>
                <div className="h-[300px] rounded-lg overflow-hidden border">
                    <Map
                        center={mapCenter}
                        zoom={type === 'city' ? 8 : type === 'district' ? 12 : 13}
                        markers={locksmithPositions.map(l => ({
                            position: l.position,
                            title: l.title,
                            description: l.description
                        }))}
                    />
                </div>
            </div>}

            {/* Yakın Caddeler */}
            {nearbySection && <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="text-lg">{nearbySection.title}</CardTitle>
                    <CardDescription>{nearbySection.description}</CardDescription>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                    <ul className="space-y-2">
                        {nearbySection.data.map((street, index) => (
                            <li key={index}>
                                <Link
                                    href={`/${street.slug}`}
                                    className="flex items-center text-sm hover:text-primary"
                                >
                                    <MapPin size={14} className="mr-2" />
                                    {formattedName} {street.name} Çilingir Anahtarcı
                                </Link>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>}


            {/* Çilingir Hizmeti Ne Kadar? */}
            {locksmithPricing.data.length > 0 && <Card className='mb-6'>
                <CardHeader>
                    <CardTitle className="text-lg">{locksmithPricing.title}</CardTitle>
                    <CardDescription>{locksmithPricing.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm mb-4">
                        Çilingir hizmet fiyatları işin türüne, kapı modeline ve saate göre değişiklik gösterebilir.
                    </p>
                    <div className="space-y-3">
                        {locksmithPricing.data.map((service, index) => (
                            <div key={index} className="flex justify-between items-center text-sm">
                                <span>{service.name}</span>
                                <PriceDisplay prices={{ mesai: service.price1, aksam: service.price2, gece: service.price3 }} />
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 text-xs text-gray-500">
                        * Fiyatlar yaklaşık değerlerdir. Kesin fiyat için çilingir ile görüşmeniz gerekmektedir.
                    </div>
                    <div className="mt-4 text-xs text-gray-500 flex items-center gap-2 cursor-pointer flex justify-end">
                        <Link href='#' className="text-blue-800 hover:underline flex items-center">
                            Detaylı Fiyat Listesi
                        </Link>
                        <ChevronRight size={16} />
                    </div>
                </CardContent>
            </Card>}



            {/* Daha fazla kategori */}
            {categorySection && <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="text-lg">{categorySection.title}</CardTitle>
                    <CardDescription>{categorySection.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {categorySection.data.map((service, index) => (
                            <li key={index}>
                                <Link href={`/${service.slug}`} className="text-blue-600 hover:underline flex items-center">
                                    <span className="mr-2">•</span>
                                    {formattedName} {service.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>}

            {/* Hizmetler */}
            {services && <Card className="mb-6">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg"> {formattedName} Çilingir Hizmetleri</CardTitle>
                    <CardDescription>{formattedName} tüm çilingir anahtar hizmetleri</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-4 mb-6">
                        {services.map((service, index) => (
                            <div key={index} className="flex items-start">
                                <div className="rounded-full bg-primary/10 p-2 mr-3">
                                    <MapPin className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-medium mb-1">{service.name}</h4>
                                    <p className="text-sm text-gray-600">{service.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>}
        </div>
    )
}