"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import LocksmithCard from '../ui/locksmith-card';
import SideMenu from '../local/side-menu';


export default function MainContent(params) {


    const {
        navbarList = [{ id: 1, name: '', slug: '' }],
        mainCard = { title: '', description: '' },
        locksmitList = { title: '', description: '', data: [{ id: 1, name: '', description: '', imageUrl: '', slug: '' }] },
        seconCard = { title: '', longDescription: '' },
        serviceList = { title: '', description: '', data: [{ id: 1, name: '', description: '', icon: '', slug: '' }] },
        sssList = { title: '', description: '', data: [{ id: 1, question: '', answer: '' }] },
        detailedDistrictList = { title: '', description: '', secondTitle: '', data: [{ id: 1, name: '', slug: '' }] },
        sideMenuParams,
        formatedName,
        type = 'city' } = params;


    return (
        <div>
            {/* Breadcrumb navigasyonu */}
            <nav className="flex text-sm text-gray-600 mb-2 md:mb-6 flex-wrap">
                {navbarList.map((item, index) => (
                    <React.Fragment key={index}>
                        {index === navbarList.length - 1 ? (
                            <span className="text-gray-900 font-medium">{item.name}</span>
                        ) : (
                            <>
                                <Link href={`${item.slug}`} className="hover:text-blue-600">
                                    {item.name}
                                </Link>
                                <span className="mx-1">&gt;</span>
                            </>
                        )}
                    </React.Fragment>
                ))}
            </nav>
            {/* Sayfa başlığı */}

            <h1 className="text-xl font-semibold mb-1 md:mb-6">{locksmitList.title}</h1>
            <a data-gtm="ilce-secimi" id="ilce-secimi" href="/" className="inline-block text-blue-600 hover:text-blue-800 mb-1 md:mb-3">
                📍 Başka ilçede misin? İlçeni seç!
            </a>
            <p className="text-gray-600 mb-2 md:mb-6">{locksmitList.description}</p>
            <div className="grid grid-cols-1 gap-2 md:gap-6 mb-4 md:mb-8">
                {locksmitList.data.map((locksmith, index) => (
                    <LocksmithCard key={index} locksmith={locksmith} index={index} />
                ))}
            </div>
            <h2 className="text-2xl font-bold mb-2">{mainCard.title}</h2>
            <p className="text-gray-600 mb-6">{mainCard.description}</p>

            {/**Second Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                <h2 className="text-xl font-semibold mb-4">{seconCard.title}</h2>
                {seconCard.longDescription && seconCard.longDescription.split('\n').map((line, index) => (
                    <p className="mt-2" key={index}>{line}</p>
                ))}
            </div>

            <h2 className="text-xl font-semibold mb-4">{serviceList.title}</h2>
            <p className="text-gray-600 mb-6">{serviceList.description}</p>

            {/**Service List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {serviceList.data.map((service) => (
                    <div key={service.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="text-4xl mb-3">{service.icon}</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{service.name}</h3>
                        <p className="text-gray-600 mb-4">{service.description}</p>

                        {serviceList.neighborhoods && serviceList.neighborhoods.length > 0 ? (
                            <details className="mt-2">
                                <summary className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium">
                                    {serviceList.name} {service.name} Bul
                                </summary>
                                <div className="mt-2 pl-4 space-y-1">
                                    {serviceList.neighborhoods.map((neighborhood, index) => (
                                        <Link
                                            key={index}
                                            href={`/${neighborhood.slug}/${service.slug.split("/").pop()}`}
                                            className="block text-blue-600 hover:text-blue-800 hover:underline py-1"
                                        >
                                            {serviceList.name} {neighborhood.name} {service.name}
                                        </Link>
                                    ))}
                                </div>
                            </details>
                        ) : (
                            <Link
                                href={`/${service.slug}`}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                                {formatedName} {service.name} Bul
                            </Link>
                        )}
                    </div>
                ))}
            </div>

            <div className='block md:hidden'>
                {sideMenuParams && <SideMenu {...sideMenuParams} />}
            </div>


            {/* Sık Sorulan Sorular */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-6">{sssList.title}</h2>
                <p className="text-gray-600 mb-6">{sssList.description}</p>

                <div className="space-y-4">
                    {
                        sssList.data.map((item, index) => (
                            <details key={index} className="bg-gray-50 rounded-lg p-4">
                                <summary className="font-semibold text-gray-800 cursor-pointer">{item.question}</summary>
                                <p className="mt-2 text-gray-600">
                                    {item.answer}
                                </p>
                            </details>
                        ))
                    }
                </div>
            </div>


            {/* İlçe bilgileri */}
            {detailedDistrictList.data.length > 1 && <Card className="mb-8">
                <CardHeader>
                    <CardTitle>
                        {detailedDistrictList.title}
                    </CardTitle>
                    <CardDescription>
                        {detailedDistrictList.description}
                    </CardDescription>
                </CardHeader>
                <CardContent>

                    <h3 className="font-semibold text-lg mt-4 mb-2">{detailedDistrictList.secondTitle}</h3>
                    <div className="flex flex-wrap gap-2">
                        {detailedDistrictList.data.map((mahalle, index) => (
                            <Link href={`/${mahalle.slug}`} key={index}>
                                <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {mahalle.name} Çilingir Anahtarcı
                                </Badge>
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>}
        </div>
    );
}