'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Clock, Eye, MapPin, Phone, MessageCircle, Star, ArrowLeft, Share2 } from 'lucide-react';
import LocksmithCard from '../ui/locksmith-card';

// Markdown to HTML converter
const markdownToHtml = (markdown) => {
    if (!markdown) return ''

    return markdown
        // Headers
        .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold text-gray-900 mt-8 mb-4">$1</h3>')
        .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold text-gray-900 mt-10 mb-6">$1</h2>')
        .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold text-gray-900 mt-12 mb-8">$1</h1>')
        // Bold
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
        // Italic
        .replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>')
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">$1</a>')
        // Unordered lists
        .replace(/^\* (.+$)/gm, '<li class="mb-2">$1</li>')
        .replace(/(<li class="mb-2">.*?<\/li>)/gs, '<ul class="list-disc list-inside mb-6 space-y-2 text-gray-700">$1</ul>')
        // Ordered lists
        .replace(/^\d+\. (.+$)/gm, '<li class="mb-2">$1</li>')
        .replace(/(<li class="mb-2">.*?<\/li>)/gs, '<ol class="list-decimal list-inside mb-6 space-y-2 text-gray-700">$1</ol>')
        // Code blocks
        .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-4 rounded-lg mb-6 overflow-x-auto"><code class="text-sm">$1</code></pre>')
        // Inline code
        .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>')
        // Blockquotes
        .replace(/^> (.+$)/gm, '<blockquote class="border-l-4 border-blue-500 pl-4 italic text-gray-600 mb-6">$1</blockquote>')
        // Tables - Daha güvenilir tablo parsing (önce tabloları işle)
        .replace(/((\|[^|\n]+)+\|\n(\|[\s\-:]+)+\|\n((\|[^|\n]+)+\|\n?)*)/gm, (match) => {
            const lines = match.trim().split('\n');
            const headerLine = lines[0];
            const separatorLine = lines[1]; // | --- | --- | formatı
            const bodyLines = lines.slice(2);

            // Header'ı parse et
            const headerCells = headerLine.split('|').slice(1, -1).map(cell => cell.trim());
            const headerRow = headerCells.map(cell =>
                `<th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-300 bg-gray-50">${cell}</th>`
            ).join('');

            // Body rows'ları parse et
            const bodyRows = bodyLines.map(line => {
                const cells = line.split('|').slice(1, -1).map(cell => cell.trim());
                return '<tr>' + cells.map(cell =>
                    `<td class="px-4 py-3 text-sm text-gray-900 border border-gray-300">${cell}</td>`
                ).join('') + '</tr>';
            }).join('');

            return `<TABLE_PLACEHOLDER>${headerRow}|${bodyRows}</TABLE_PLACEHOLDER>`;
        })
        // Horizontal rule
        .replace(/^---$/gm, '<hr class="border-t border-gray-300 my-8">')
        // Line breaks and paragraphs
        .replace(/\n\n/g, '</p><p class="mb-4 text-gray-700 leading-relaxed">')
        .replace(/\n/g, '<br>')
        // Wrap content in paragraphs (tablo, liste ve diğer elementleri hariç tut)
        .replace(/^(?!<[h|u|o|l|p|b|c|hr|d])/gm, '<p class="mb-4 text-gray-700 leading-relaxed">')
        .replace(/(?<!>)$/gm, '</p>')
        // Clean up empty paragraphs
        .replace(/<p class="mb-4 text-gray-700 leading-relaxed"><\/p>/g, '')
        // Fix nested list issues
        .replace(/<\/ul>\s*<ul class="list-disc list-inside mb-6 space-y-2 text-gray-700">/g, '')
        .replace(/<\/ol>\s*<ol class="list-decimal list-inside mb-6 space-y-2 text-gray-700">/g, '')
        // Clean up paragraph wrapping around tables and other block elements
        .replace(/<p class="mb-4 text-gray-700 leading-relaxed">(<div class="overflow-x-auto)/g, '$1')
        .replace(/(<\/div>)<\/p>/g, '$1')
        // Son olarak tablo placeholder'larını gerçek HTML'e çevir
        .replace(/<TABLE_PLACEHOLDER>(.*?)\|(.*?)<\/TABLE_PLACEHOLDER>/g, (match, headerRow, bodyRows) => {
            return `<div class="overflow-x-auto my-6"><table class="min-w-full border-collapse border border-gray-300"><thead><tr>${headerRow}</tr></thead><tbody class="bg-white divide-y divide-gray-200">${bodyRows}</tbody></table></div>`;
        })
        // Başlıklar etrafındaki gereksiz br tag'lerini temizle
        .replace(/<br>\s*(<h[1-6][^>]*>)/g, '$1')
        .replace(/(<\/h[1-6]>)\s*<br>/g, '$1')
}

export default function BlogDetailPage({
    slug,
    province = null,
    district = null,
    neighborhood = null,
    service = null,
    blogData = null,
    isPreview = false
}) {
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showShareMenu, setShowShareMenu] = useState(false);

    useEffect(() => {
        if (blogData) {
            // Preview modunda: blog verisi prop olarak gelir
            setBlog(blogData);
            setLoading(false);
            // Preview modunda da ilgili çilingirleri al
            if (isPreview) {
                fetchRelatedLocksmiths(blogData);
            }
        } else if (slug) {
            // Normal modda: API'den blog verisini al
            fetchBlog();
        }
    }, [slug, province, district, neighborhood, service, blogData, isPreview]);

    // Menü dışında tıklandığında menüyü kapat
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showShareMenu && !event.target.closest('.relative')) {
                setShowShareMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showShareMenu]);

    const fetchBlog = async () => {
        try {
            setLoading(true);

            // API endpoint'ini route parametrelerine göre belirle
            let apiUrl = `/api/public/blogs/${slug}`;
            const params = new URLSearchParams();

            if (province) params.append('province', province);
            if (district) params.append('district', district);
            if (neighborhood) params.append('neighborhood', neighborhood);
            if (service) params.append('service', service);

            if (params.toString()) {
                apiUrl += `?${params.toString()}`;
            }

            const response = await fetch(apiUrl);
            const result = await response.json();

            if (result.success) {
                setBlog(result.data);

                // SEO meta güncellemeleri
                if (typeof document !== 'undefined') {
                    document.title = result.data.meta_title || result.data.title;

                    const metaDescription = document.querySelector('meta[name="description"]');
                    if (metaDescription) {
                        metaDescription.content = result.data.meta_description || result.data.excerpt || '';
                    }

                    const metaKeywords = document.querySelector('meta[name="keywords"]');
                    if (metaKeywords && result.data.meta_keywords) {
                        metaKeywords.content = result.data.meta_keywords;
                    }
                }
            } else {
                setError(result.error);
            }
        } catch (error) {
            console.error('Blog alınamadı:', error);
            setError('Blog yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const fetchRelatedLocksmiths = async (blogData) => {
        try {
            // Blog ile ilgili çilingirleri al
            let relatedLocksmiths = [];

            // Eğer blogda konum bilgileri varsa, o konumdaki çilingirleri getir
            if (blogData.province_id || blogData.district_id || blogData.neighborhood_id) {
                const params = new URLSearchParams();
                if (blogData.province_id) params.append('province_id', blogData.province_id);
                if (blogData.district_id) params.append('district_id', blogData.district_id);
                if (blogData.neighborhood_id) params.append('neighborhood_id', blogData.neighborhood_id);
                params.append('limit', '4'); // En fazla 4 çilingir

                const response = await fetch(`/api/public/locksmiths?${params.toString()}`);

                if (!response.ok) {
                    console.error('Locksmiths API response not ok:', response.status, response.statusText);
                    return;
                }

                const result = await response.json();

                if (result.success && result.data) {
                    relatedLocksmiths = result.data.map(locksmith => ({
                        id: locksmith.id,
                        slug: locksmith.slug,
                        name: locksmith.businessname || locksmith.fullname,
                        businessname: locksmith.businessname,
                        fullname: locksmith.fullname,
                        phone: locksmith.phonenumber,
                        whatsapp: locksmith.whatsappnumber,
                        rating: locksmith.avgrating,
                        totalReviewCount: locksmith.totalreviewcount,
                        profileimageurl: locksmith.profileimageurl,
                        description: locksmith.tagline || '',
                        provinces: locksmith.provinces,
                        districts: locksmith.districts,
                        locksmith_details: locksmith.locksmith_details
                    }));
                }
            }

            // Blog state'ini güncelleyerek ilgili çilingirleri ekle
            setBlog(prevBlog => ({
                ...prevBlog,
                relatedLocksmiths
            }));

        } catch (error) {
            console.error('İlgili çilingirler alınamadı:', error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleShare = () => {
        setShowShareMenu(!showShareMenu);
    };

    const copyToClipboard = async () => {
        try {
            const url = window.location.href;
            await navigator.clipboard.writeText(url);
            alert('Link kopyalandı!');
            setShowShareMenu(false);
        } catch (err) {
            console.error('Link kopyalanamadı:', err);
        }
    };

    const shareToWhatsApp = () => {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(`${blog.title} - ${blog.excerpt || ''}`);
        window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
        setShowShareMenu(false);
    };

    const shareToFacebook = () => {
        const url = encodeURIComponent(window.location.href);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        setShowShareMenu(false);
    };

    const shareToInstagram = () => {
        copyToClipboard();
        alert('Link kopyalandı! Instagram\'da manuel olarak paylaşabilirsiniz.');
        setShowShareMenu(false);
    };

    // Breadcrumb yapısını oluştur
    const buildBreadcrumbs = () => {
        const breadcrumbItems = [
            { label: 'Ana Sayfa', href: '/' }
        ];

        if (blog) {
            // Province level
            if (province && blog.provinces) {
                breadcrumbItems.push({
                    label: blog.provinces.name,
                    href: `/${blog.provinces.slug}`
                });
            }

            // District level
            if (district && blog.districts) {
                breadcrumbItems.push({
                    label: blog.districts.name,
                    href: `/${blog.provinces.slug}/${blog.districts.slug}`
                });
            }

            // Neighborhood level
            if (neighborhood && blog.neighborhoods) {
                breadcrumbItems.push({
                    label: blog.neighborhoods.name,
                    href: `/${blog.provinces.slug}/${blog.districts.slug}/${blog.neighborhoods.slug}`
                });
            }

            // Service level
            if (service && blog.services) {
                let serviceHref = `/${blog.provinces.slug}`;
                if (blog.districts) serviceHref += `/${blog.districts.slug}`;
                if (blog.neighborhoods) serviceHref += `/${blog.neighborhoods.slug}`;
                serviceHref += `/${blog.services.slug}`;

                breadcrumbItems.push({
                    label: blog.services.name,
                    href: serviceHref
                });
            }

            // Blog section
            let blogHref = '/blog';
            if (province && district && neighborhood && service) {
                blogHref = `/${blog.provinces.slug}/${blog.districts.slug}/${blog.neighborhoods.slug}/${blog.services.slug}/blog`;
            } else if (province && district && neighborhood) {
                blogHref = `/${blog.provinces.slug}/${blog.districts.slug}/${blog.neighborhoods.slug}/blog`;
            } else if (province && district && service) {
                blogHref = `/${blog.provinces.slug}/${blog.districts.slug}/${blog.services.slug}/blog`;
            } else if (province && district) {
                blogHref = `/${blog.provinces.slug}/${blog.districts.slug}/blog`;
            } else if (province && service) {
                blogHref = `/${blog.provinces.slug}/${blog.services.slug}/blog`;
            } else if (province) {
                blogHref = `/${blog.provinces.slug}/blog`;
            }

            breadcrumbItems.push({
                label: 'Blog',
                href: blogHref
            });

            // Current blog post
            breadcrumbItems.push({
                label: blog.title,
                current: true
            });
        }

        return breadcrumbItems;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-lg shadow-sm p-8">
                            <div className="animate-pulse">
                                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded mb-6"></div>
                                <div className="h-64 bg-gray-200 rounded"></div>
                            </div>
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
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Blog Bulunamadı</h2>
                                <p className="text-gray-600 mb-6">{error}</p>
                                <Link href="/blog" className="text-blue-600 hover:text-blue-800">
                                    ← Blog listesine dön
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    if (!blog) {
        return null;
    }

    const breadcrumbItems = buildBreadcrumbs();

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-2 md:px-4 py-2 md:py-8">
                <div className="max-w-4xl mx-auto bg-white md:shadow-sm">
                    {/* Blog Header */}
                    <div className="md:bg-white p-2 md:p-8 md:pb-2">
                        {/* Breadcrumb - MainContent tarzı navigasyon */}
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

                        {/* Meta bilgiler */}
                        <div className="flex flex-wrap items-center gap-4 mb-2 md:mb-6 md:text-sm">
                            {isPreview && (
                                <Badge variant={blog.status === 'published' ? 'default' : blog.status === 'draft' ? 'secondary' : 'outline'}>
                                    {blog.status === 'draft' ? 'Taslak' : blog.status === 'published' ? 'Yayınlandı' : 'Arşivlendi'}
                                </Badge>
                            )}
                            {blog.provinces && (
                                <Badge variant="outline">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {blog.provinces.name}
                                    {blog.districts && ` / ${blog.districts.name}`}
                                    {blog.neighborhoods && ` / ${blog.neighborhoods.name}`}
                                </Badge>
                            )}

                            {/* Paylaş butonu */}
                            <div className="relative ml-auto">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleShare}
                                    className="w-auto flex-shrink-0"
                                >
                                    <Share2 className="w-4 h-4 mr-2" />
                                    Paylaş
                                </Button>

                                {showShareMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                                        <div className="py-1">
                                            <button
                                                onClick={copyToClipboard}
                                                className="flex items-center w-full px-4 py-3 sm:py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                                Link Kopyala
                                            </button>
                                            <button
                                                onClick={shareToWhatsApp}
                                                className="flex items-center w-full px-4 py-3 sm:py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                                </svg>
                                                WhatsApp
                                            </button>
                                            <button
                                                onClick={shareToFacebook}
                                                className="flex items-center w-full px-4 py-3 sm:py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                                </svg>
                                                Facebook
                                            </button>
                                            <button
                                                onClick={shareToInstagram}
                                                className="flex items-center w-full px-4 py-3 sm:py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                                </svg>
                                                Instagram
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Blog resmi */}
                        {blog.blog_images && (
                            <div className="relative h-64 md:h-96 mb-2 md:mb-8 rounded-md md:rounded-lg overflow-hidden">
                                <Image
                                    src={blog.blog_images.url}
                                    alt={blog.blog_images.alt_text || blog.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                                    className="object-cover"
                                    priority
                                    loading="eager"
                                />
                            </div>
                        )}

                        {/* Başlık */}
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-1 md:mb-6">
                            {blog.title}
                        </h1>

                        {/* Blog istatistikleri - Mobil uyumlu tek satır */}
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-3 md:mb-6">
                            <div className="flex items-center gap-3 sm:gap-4">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span className="sm:hidden">{blog.reading_time}dk</span>
                                    <span className="hidden sm:inline">{blog.reading_time} dakika okuma</span>
                                </span>
                                <span className="flex items-center gap-1">
                                    <Eye className="w-4 h-4" />
                                    <span className="sm:hidden">{blog.views.toLocaleString('tr-TR')}</span>
                                    <span className="hidden sm:inline">{blog.views.toLocaleString('tr-TR')} görüntülenme</span>
                                </span>
                            </div>
                            <span className="text-gray-500 flex-shrink-0">
                                {formatDate(blog.created_at)}
                            </span>
                        </div>

                        {/* Excerpt */}
                        {blog.excerpt && (
                            <p className="text-lg text-gray-600 leading-relaxed border-l-4 border-blue-500 pl-4 -mb-4 md:mb-2">
                                {blog.excerpt}
                            </p>
                        )}
                    </div>

                    {/* Blog İçeriği */}
                    <div className="md:bg-white p-2 md:pl-8 md:pr-8">
                        <div
                            className="prose prose-lg max-w-none"
                            dangerouslySetInnerHTML={{ __html: markdownToHtml(blog.content) }}
                        />

                    </div>

                    {/* İlgili Çilingirler */}
                    {blog.relatedLocksmiths && blog.relatedLocksmiths.length > 0 && (
                        <div className="md:bg-white p-2 md:pl-8 md:pr-8 mb-2">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2 md:mb-6">
                                {blog.provinces && blog.districts && blog.neighborhoods
                                    ? `${blog.provinces.name} ${blog.districts.name} ${blog.neighborhoods.name} Çilingir Listesi`
                                    : blog.provinces && blog.districts
                                        ? `${blog.provinces.name} ${blog.districts.name} Çilingir Listesi`
                                        : blog.provinces
                                            ? `${blog.provinces.name} Çilingir Listesi`
                                            : 'Önerilen Çilingirler'
                                }
                            </h2>
                            <p className="text-gray-600 mb-2 md:mb-6">Aşağıdaki listeden size en uygun çilingiri seçip hemen arayarak detaylı bilgi alabilirsiniz.</p>

                            <div className="grid grid-cols-1 gap-2 md:gap-6">
                                {blog.relatedLocksmiths.map((locksmith) => (
                                    <LocksmithCard
                                        showLocation={true}
                                        key={locksmith.id}
                                        locksmith={locksmith}
                                        showDistance={false}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Result bölümü - Blog yazısının devamı olarak */}
                    {blog.result && (
                        <div className="md:bg-white p-2 md:pl-8 md:pr-8 mb-2">
                            <div
                                className="prose prose-lg max-w-none"
                                dangerouslySetInnerHTML={{ __html: markdownToHtml(blog.result) }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
