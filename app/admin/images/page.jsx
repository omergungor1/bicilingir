'use client'

import { useState, useEffect } from 'react'

export default function ImageLibrary() {
    const [images, setImages] = useState([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [pagination, setPagination] = useState({})
    const [selectedImages, setSelectedImages] = useState([])
    const [editingImage, setEditingImage] = useState(null)
    const [newAltText, setNewAltText] = useState('')
    const [uploadFile, setUploadFile] = useState(null)
    const [uploadAltText, setUploadAltText] = useState('')

    useEffect(() => {
        fetchImages()
    }, [])

    const fetchImages = async (page = 1) => {
        try {
            setLoading(true)
            const response = await fetch(`/api/admin/images?page=${page}&limit=20`)
            const data = await response.json()

            if (response.ok) {
                setImages(data.images)
                setPagination(data.pagination)
            } else {
                console.error('Resimler yüklenemedi:', data.error)
            }
        } catch (error) {
            console.error('Resimler yüklenirken hata:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpload = async () => {
        if (!uploadFile) return

        setUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', uploadFile)
            formData.append('alt_text', uploadAltText)

            const response = await fetch('/api/admin/images', {
                method: 'POST',
                body: formData
            })

            const data = await response.json()
            if (response.ok) {
                setImages([data.image, ...images])
                setUploadFile(null)
                setUploadAltText('')
                document.getElementById('file-upload').value = ''
            } else {
                alert('Hata: ' + data.error)
            }
        } catch (error) {
            alert('Yükleme sırasında hata oluştu')
        } finally {
            setUploading(false)
        }
    }

    const handleUpdateAltText = async () => {
        if (!editingImage) return

        try {
            const response = await fetch(`/api/admin/images/${editingImage.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ alt_text: newAltText })
            })

            if (response.ok) {
                const data = await response.json()
                setImages(images.map(img =>
                    img.id === editingImage.id ? data.image : img
                ))
                setEditingImage(null)
                setNewAltText('')
            } else {
                const data = await response.json()
                alert('Hata: ' + data.error)
            }
        } catch (error) {
            alert('Güncelleme sırasında hata oluştu')
        }
    }

    const handleDelete = async (imageId) => {
        if (!confirm('Bu resmi silmek istediğinizden emin misiniz?')) return

        try {
            const response = await fetch(`/api/admin/images/${imageId}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                setImages(images.filter(img => img.id !== imageId))
                const data = await response.json()
                alert(data.message)
            } else {
                const data = await response.json()
                alert('Hata: ' + data.error)
            }
        } catch (error) {
            alert('Silme sırasında hata oluştu')
        }
    }

    const handleBulkDelete = async () => {
        if (selectedImages.length === 0) return
        if (!confirm(`${selectedImages.length} resmi silmek istediğinizden emin misiniz?`)) return

        try {
            await Promise.all(
                selectedImages.map(imageId =>
                    fetch(`/api/admin/images/${imageId}`, { method: 'DELETE' })
                )
            )

            setImages(images.filter(img => !selectedImages.includes(img.id)))
            setSelectedImages([])
        } catch (error) {
            alert('Toplu silme sırasında hata oluştu')
        }
    }

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Başlık */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Resim Kütüphanesi</h1>
                <div className="text-sm text-gray-500">
                    Toplam {pagination.total} resim
                </div>
            </div>

            {/* Yeni Resim Yükleme */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Yeni Resim Yükle</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Resim Dosyası</label>
                        <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setUploadFile(e.target.files[0])}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Alt Etiket</label>
                        <input
                            type="text"
                            value={uploadAltText}
                            onChange={(e) => setUploadAltText(e.target.value)}
                            placeholder="SEO için alt etiket"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        />
                    </div>
                    <div>
                        <button
                            onClick={handleUpload}
                            disabled={!uploadFile || uploading}
                            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {uploading ? 'Yükleniyor...' : 'Yükle'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Toplu İşlemler */}
            {selectedImages.length > 0 && (
                <div className="bg-red-50 p-4 rounded-md">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-red-700">
                            {selectedImages.length} resim seçildi
                        </span>
                        <button
                            onClick={handleBulkDelete}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                        >
                            Seçilenleri Sil
                        </button>
                    </div>
                </div>
            )}

            {/* Resim Galerisi */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {images.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-4xl mb-4">🖼️</div>
                        <p className="text-gray-500">Henüz resim yüklenmemiş</p>
                        <p className="text-sm text-gray-400 mt-1">Yukarıdaki formu kullanarak ilk resminizi yükleyin</p>
                    </div>
                ) : (
                    <>
                        <div className="p-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedImages(images.map(img => img.id))
                                            } else {
                                                setSelectedImages([])
                                            }
                                        }}
                                        checked={selectedImages.length === images.length}
                                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Tümünü Seç</span>
                                </label>
                                <div className="text-sm text-gray-500">
                                    {images.length} resim gösteriliyor
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {images.map((image) => (
                                    <div key={image.id} className="relative group">
                                        {/* Seçim Checkbox */}
                                        <div className="absolute top-2 left-2 z-10">
                                            <input
                                                type="checkbox"
                                                checked={selectedImages.includes(image.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedImages([...selectedImages, image.id])
                                                    } else {
                                                        setSelectedImages(selectedImages.filter(id => id !== image.id))
                                                    }
                                                }}
                                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 bg-white"
                                            />
                                        </div>

                                        {/* Resim */}
                                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                            <img
                                                src={image.url}
                                                alt={image.alt_text}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Hover Actions */}
                                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                                            <button
                                                onClick={() => {
                                                    setEditingImage(image)
                                                    setNewAltText(image.alt_text || '')
                                                }}
                                                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
                                                title="Alt etiket düzenle"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(image.url)
                                                    alert('URL kopyalandı!')
                                                }}
                                                className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700"
                                                title="URL'yi kopyala"
                                            >
                                                📋
                                            </button>
                                            <button
                                                onClick={() => handleDelete(image.id)}
                                                className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                                                title="Sil"
                                            >
                                                🗑️
                                            </button>
                                        </div>

                                        {/* Resim Bilgileri */}
                                        <div className="mt-2 space-y-1">
                                            <p className="text-xs text-gray-600 truncate">
                                                {image.alt_text || 'Alt etiket yok'}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {formatFileSize(image.file_size)} • {image.file_type}
                                            </p>
                                            {image.width && image.height && (
                                                <p className="text-xs text-gray-400">
                                                    {image.width} × {image.height}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Sayfalama */}
            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                        Toplam {pagination.total} sonuçtan {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} arası gösteriliyor
                    </div>
                    <div className="flex space-x-2">
                        {pagination.page > 1 && (
                            <button
                                onClick={() => fetchImages(pagination.page - 1)}
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700"
                            >
                                Önceki
                            </button>
                        )}
                        {pagination.page < pagination.totalPages && (
                            <button
                                onClick={() => fetchImages(pagination.page + 1)}
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700"
                            >
                                Sonraki
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Alt Text Düzenleme Modal */}
            {editingImage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                        <h4 className="font-medium text-gray-900 mb-3">Alt Etiket Düzenle</h4>
                        <img
                            src={editingImage.url}
                            alt={editingImage.alt_text}
                            className="w-full h-32 object-cover rounded mb-3"
                        />
                        <input
                            type="text"
                            value={newAltText}
                            onChange={(e) => setNewAltText(e.target.value)}
                            placeholder="Alt etiket"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-4"
                        />
                        <div className="flex space-x-3">
                            <button
                                onClick={handleUpdateAltText}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700"
                            >
                                Güncelle
                            </button>
                            <button
                                onClick={() => {
                                    setEditingImage(null)
                                    setNewAltText('')
                                }}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-400"
                            >
                                İptal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
