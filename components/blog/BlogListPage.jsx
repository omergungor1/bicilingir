'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Clock, Eye, MapPin, Search, Calendar, Filter } from 'lucide-react';
import { Input } from '../ui/input';

export default function BlogListPage({
    pageTitle = "Blog Yazıları",
    breadcrumbItems = [],
    province = null,
    district = null,
    neighborhood = null,
    service = null
}) {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchBlogs();
    }, [province, district, neighborhood, service]);

    useEffect(() => {
        filterBlogs();
    }, [blogs, searchTerm, selectedCategory]);

    const fetchBlogs = async () => {
        try {
            setLoading(true);

            // API endpoint'ini route parametrelerine göre belirle
            let apiUrl = '/api/public/blogs';
            const params = new URLSearchParams();

            if (province) params.append('province', province);
            if (district) params.append('district', district);
            if (neighborhood) params.append('neighborhood', neighborhood);
            if (service) params.append('service', service);

            // Sayfa başına blog sayısını sınırla
            params.append('limit', '12');

            if (params.toString()) {
                apiUrl += `?${params.toString()}`;
            }

            const response = await fetch(apiUrl);
            const result = await response.json();

            if (result.success) {
                setBlogs(result.data || []);

                // Kategorileri çıkar
                const uniqueCategories = [...new Set(result.data?.map(blog => blog.category).filter(Boolean))];
                setCategories(uniqueCategories);
            } else {
                setError(result.error);
            }
        } catch (error) {
            console.error('Bloglar alınamadı:', error);
            setError('Bloglar yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const filterBlogs = () => {
        let filtered = blogs;

        // Arama terimine göre filtrele
        if (searchTerm) {
            filtered = filtered.filter(blog =>
                blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                blog.meta_keywords?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Kategoriye göre filtrele
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(blog => blog.category === selectedCategory);
        }

        setFilteredBlogs(filtered);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const truncateText = (text, maxLength = 150) => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-6xl mx-auto">
                        {/* Header skeleton */}
                        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                            <div className="animate-pulse">
                                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded mb-6 w-1/2"></div>
                                <div className="h-10 bg-gray-200 rounded w-full"></div>
                            </div>
                        </div>

                        {/* Blog cards skeleton */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="bg-white rounded-lg shadow-sm p-6">
                                    <div className="animate-pulse">
                                        <div className="h-48 bg-gray-200 rounded mb-4"></div>
                                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                                        <div className="h-3 bg-gray-200 rounded mb-1"></div>
                                        <div className="h-3 bg-gray-200 rounded mb-1"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-4xl mx-auto">
                        <Card>
                            <CardContent className="p-8 text-center">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Bir Hata Oluştu</h2>
                                <p className="text-gray-600 mb-6">{error}</p>
                                <Button onClick={() => window.location.reload()}>
                                    Tekrar Dene
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-2 md:px-4 py-2 md:py-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="md:bg-white md:rounded-lg md:shadow-sm p-2 md:p-8 mb-2 md:mb-8">
                        {/* Breadcrumb */}
                        {breadcrumbItems.length > 0 && (
                            <nav className="flex text-sm text-gray-600 mb-1 md:mb-6 flex-wrap">
                                {breadcrumbItems.map((item, index) => (
                                    <React.Fragment key={index}>
                                        {item.current ? (
                                            <span className="text-gray-900 font-medium">{item.label}</span>
                                        ) : (
                                            <>
                                                <Link href={item.href} className="hover:text-blue-600">
                                                    {item.label}
                                                </Link>
                                                <span className="mx-1">&gt;</span>
                                            </>
                                        )}
                                    </React.Fragment>
                                ))}
                            </nav>
                        )}

                        {/* Başlık */}
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-4">
                            {pageTitle}
                        </h1>

                        <p className="text-gray-600 mb-2 md:mb-6">
                            Çilingirlik hizmetleri, güvenlik sistemleri ve daha birçok konuda faydalı bilgilere ulaşın.
                        </p>

                        {/* Arama ve Filtreler */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-2 md:mb-0">
                            {/* Arama */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    type="text"
                                    placeholder="Blog ara..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            {/* Kategori Filtresi */}
                            {categories.length > 0 && (
                                <div className="flex items-center gap-2">
                                    <Filter className="w-4 h-4 text-gray-400" />
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="all">Tüm Kategoriler</option>
                                        {categories.map(category => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Blog Listesi */}
                    {filteredBlogs.length === 0 ? (
                        <div className="md:bg-white md:rounded-lg md:shadow-sm p-2 md:p-8 text-center">
                            <div className="py-12">
                                <h3 className="text-xl font-medium text-gray-900 mb-2">
                                    {searchTerm || selectedCategory !== 'all'
                                        ? 'Arama kriterlerinize uygun blog bulunamadı'
                                        : 'Henüz blog yazısı bulunmuyor'
                                    }
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    {searchTerm || selectedCategory !== 'all'
                                        ? 'Lütfen farklı anahtar kelimeler deneyin veya filtreleri temizleyin.'
                                        : 'Yakında faydalı içeriklerle burada olacağız.'
                                    }
                                </p>
                                {(searchTerm || selectedCategory !== 'all') && (
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setSearchTerm('');
                                            setSelectedCategory('all');
                                        }}
                                    >
                                        Filtreleri Temizle
                                    </Button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6">
                            {filteredBlogs.map((blog, index) => (
                                <Card key={blog.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                                    <div className="relative">
                                        {/* Blog Resmi */}
                                        {blog.blog_images ? (
                                            <div className="relative h-48 overflow-hidden">
                                                <Image
                                                    src={blog.blog_images.url}
                                                    alt={blog.blog_images.alt_text || blog.title}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                    priority={index === 0}
                                                    loading={index === 0 ? "eager" : "lazy"}
                                                    className="object-cover transition-transform duration-200 hover:scale-105"
                                                />
                                            </div>
                                        ) : (
                                            <div className="h-48 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                                                <div className="text-center">
                                                    <Calendar className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                                                    <p className="text-blue-600 font-medium">Blog Yazısı</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Kategori Badge */}
                                        {blog.category && (
                                            <Badge
                                                variant="secondary"
                                                className="absolute top-3 left-3 bg-white/90 text-gray-700"
                                            >
                                                {blog.category}
                                            </Badge>
                                        )}
                                    </div>

                                    <CardContent className="p-4 md:p-6">
                                        {/* Lokasyon Bilgisi */}
                                        {(blog.provinces || blog.districts || blog.neighborhoods) && (
                                            <div className="flex items-center gap-1 mb-2">
                                                <MapPin className="w-3 h-3 text-gray-400" />
                                                <span className="text-xs text-gray-500">
                                                    {blog.provinces?.name}
                                                    {blog.districts && ` / ${blog.districts.name}`}
                                                    {blog.neighborhoods && ` / ${blog.neighborhoods.name}`}
                                                </span>
                                            </div>
                                        )}

                                        {/* Başlık */}
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                            <Link
                                                href={`/blog/${blog.slug}`}
                                                className="hover:text-blue-600 transition-colors"
                                            >
                                                {blog.title}
                                            </Link>
                                        </h3>

                                        {/* Özet */}
                                        {blog.excerpt && (
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                                {truncateText(blog.excerpt)}
                                            </p>
                                        )}

                                        {/* Meta Bilgiler */}
                                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                            <div className="flex items-center gap-3">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {blog.reading_time}dk
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Eye className="w-3 h-3" />
                                                    {blog.views?.toLocaleString('tr-TR')}
                                                </span>
                                            </div>
                                            <span>
                                                {formatDate(blog.created_at)}
                                            </span>
                                        </div>

                                        {/* Devamını Oku Butonu */}
                                        <Link href={`/blog/${blog.slug}`}>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                                            >
                                                Devamını Oku
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Blog Sayısı Bilgisi */}
                    {filteredBlogs.length > 0 && (
                        <div className="mt-8 text-center">
                            <p className="text-gray-600 text-sm">
                                Toplam {filteredBlogs.length} blog yazısı gösteriliyor
                                {searchTerm && ` "${searchTerm}" araması için`}
                                {selectedCategory !== 'all' && ` "${selectedCategory}" kategorisinde`}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
