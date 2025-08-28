'use client'

import { useState, useEffect } from 'react'

export default function ImageLibraryModal({ isOpen, onClose, onSelectImage }) {
    const [images, setImages] = useState([])
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null)
    const [newAltText, setNewAltText] = useState('')
    const [uploadFile, setUploadFile] = useState(null)
    const [uploadAltText, setUploadAltText] = useState('')

    useEffect(() => {
        if (isOpen) {
            fetchImages()
        }
    }, [isOpen])

    const fetchImages = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/admin/images')
            const data = await response.json()
            if (response.ok) {
                setImages(data.images)
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

    const handleUpdateAltText = async (imageId) => {
        try {
            const response = await fetch(`/api/admin/images/${imageId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ alt_text: newAltText })
            })

            if (response.ok) {
                const data = await response.json()
                setImages(images.map(img =>
                    img.id === imageId ? data.image : img
                ))
                setSelectedImage(null)
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

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose} />

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Resim Kütüphanesi
                            </h3>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Yeni Resim Yükleme */}
                        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-3">Yeni Resim Yükle</h4>
                            <div className="space-y-3">
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setUploadFile(e.target.files[0])}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                />
                                <input
                                    type="text"
                                    placeholder="Alt etiket (SEO için önemli)"
                                    value={uploadAltText}
                                    onChange={(e) => setUploadAltText(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                />
                                <button
                                    onClick={handleUpload}
                                    disabled={!uploadFile || uploading}
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {uploading ? 'Yükleniyor...' : 'Yükle'}
                                </button>
                            </div>
                        </div>

                        {/* Resim Listesi */}
                        <div className="max-h-96 overflow-y-auto">
                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                                </div>
                            ) : images.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    Henüz resim yüklenmemiş
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {images.map((image) => (
                                        <div key={image.id} className="relative group">
                                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                                <img
                                                    src={image.url}
                                                    alt={image.alt_text}
                                                    className="w-full h-full object-cover cursor-pointer hover:opacity-75"
                                                    onClick={() => onSelectImage(image)}
                                                />
                                            </div>

                                            {/* Hover Actions */}
                                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                                                <button
                                                    onClick={() => onSelectImage(image)}
                                                    className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700"
                                                    title="Seç"
                                                >
                                                    ✓
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedImage(image)
                                                        setNewAltText(image.alt_text || '')
                                                    }}
                                                    className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
                                                    title="Düzenle"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(image.id)}
                                                    className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                                                    title="Sil"
                                                >
                                                    🗑️
                                                </button>
                                            </div>

                                            {/* Alt text */}
                                            <div className="mt-1 text-xs text-gray-500 truncate">
                                                {image.alt_text || 'Alt etiket yok'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Alt Text Düzenleme Modal */}
                    {selectedImage && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
                            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                                <h4 className="font-medium text-gray-900 mb-3">Alt Etiket Düzenle</h4>
                                <img
                                    src={selectedImage.url}
                                    alt={selectedImage.alt_text}
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
                                        onClick={() => handleUpdateAltText(selectedImage.id)}
                                        className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700"
                                    >
                                        Güncelle
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedImage(null)
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
            </div>
        </div>
    )
}
