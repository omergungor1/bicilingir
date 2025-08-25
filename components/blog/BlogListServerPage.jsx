import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Clock, Eye, MapPin, Calendar } from 'lucide-react';
import { getSupabaseServer } from '../../lib/supabase';

export default async function BlogListServerPage({
    pageTitle = "Blog Yazıları",
    breadcrumbItems = [],
    province = null,
    district = null,
    neighborhood = null,
    service = null
}) {
    const supabase = getSupabaseServer();

    // API endpoint'ini route parametrelerine göre belirle
    let query = supabase
        .from('blogs')
        .select(`
            id,
            title,
            slug,
            excerpt,
            views,
            created_at,
            reading_time,
            is_featured,
            category,
            blog_images (
                id,
                url,
                alt_text,
                width,
                height
            ),
            provinces (
                id,
                name,
                slug
            ),
            districts (
                id,
                name,
                slug
            ),
            neighborhoods (
                id,
                name,
                slug
            ),
            services (
                id,
                name,
                slug
            )
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(12);

    // Slug bazlı filtreler
    if (province) {
        const { data: provinceData } = await supabase
            .from('provinces')
            .select('id')
            .eq('slug', province)
            .single();

        if (provinceData) {
            query = query.eq('province_id', provinceData.id);
        }
    }

    if (district) {
        const { data: districtData } = await supabase
            .from('districts')
            .select('id')
            .eq('slug', district)
            .single();

        if (districtData) {
            query = query.eq('district_id', districtData.id);
        }
    }

    if (neighborhood) {
        const { data: neighborhoodData } = await supabase
            .from('neighborhoods')
            .select('id')
            .eq('slug', neighborhood)
            .single();

        if (neighborhoodData) {
            query = query.eq('neighborhood_id', neighborhoodData.id);
        }
    }

    if (service) {
        const { data: serviceData } = await supabase
            .from('services')
            .select('id')
            .eq('slug', service)
            .single();

        if (serviceData) {
            query = query.eq('service_id', serviceData.id);
        }
    }

    const { data: blogs } = await query;

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

    const getBlogUrl = (blog) => {
        // Blog URL'ini lokasyon bilgilerine göre oluştur
        let baseUrl = '';

        if (blog.provinces?.slug) {
            baseUrl += `/${blog.provinces.slug}`;

            if (blog.districts?.slug) {
                baseUrl += `/${blog.districts.slug}`;

                if (blog.neighborhoods?.slug) {
                    baseUrl += `/${blog.neighborhoods.slug}`;

                    if (blog.services?.slug) {
                        baseUrl += `/${blog.services.slug}`;
                    }
                } else if (blog.services?.slug) {
                    baseUrl += `/${blog.services.slug}`;
                }
            } else if (blog.services?.slug) {
                baseUrl += `/${blog.services.slug}`;
            }
        }

        // Blog URL'ini oluştur
        if (baseUrl) {
            return `${baseUrl}/blog/${blog.slug}`;
        } else {
            return `/blog/${blog.slug}`;
        }
    };

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
                    </div>

                    {/* Blog Listesi */}
                    {!blogs || blogs.length === 0 ? (
                        <div className="md:bg-white md:rounded-lg md:shadow-sm p-2 md:p-8 text-center">
                            <div className="py-12">
                                <h3 className="text-xl font-medium text-gray-900 mb-2">
                                    Henüz blog yazısı bulunmuyor
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Yakında faydalı içeriklerle burada olacağız.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6">
                            {blogs.map((blog, index) => (
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
                                                href={getBlogUrl(blog)}
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
                                        <Link href={getBlogUrl(blog)}>
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
                    {blogs && blogs.length > 0 && (
                        <div className="mt-8 text-center">
                            <p className="text-gray-600 text-sm">
                                Toplam {blogs.length} blog yazısı gösteriliyor
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
