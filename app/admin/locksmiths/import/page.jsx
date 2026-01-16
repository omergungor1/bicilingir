'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LocksmithImportPage() {
    const [csvFile, setCsvFile] = useState(null)
    const [previewData, setPreviewData] = useState([])
    const [loading, setLoading] = useState(false)
    const [importing, setImporting] = useState(false)
    const [importResult, setImportResult] = useState(null)
    const router = useRouter()

    // CSV dosyasını parse et
    const handleFileUpload = async (event) => {
        const file = event.target.files[0]
        if (!file) return

        setCsvFile(file)
        setImportResult(null)

        const reader = new FileReader()
        reader.onload = (e) => {
            const text = e.target.result
            const lines = text.split('\n').filter(line => line.trim())

            if (lines.length === 0) {
                alert('CSV dosyası boş!')
                return
            }

            // CSV parse fonksiyonu (tırnak içindeki virgülleri dikkate alır)
            const parseCSVLine = (line) => {
                const result = []
                let current = ''
                let inQuotes = false

                for (let i = 0; i < line.length; i++) {
                    const char = line[i]
                    const nextChar = line[i + 1]

                    if (char === '"') {
                        if (inQuotes && nextChar === '"') {
                            // Çift tırnak (escape)
                            current += '"'
                            i++ // Bir sonraki karakteri atla
                        } else {
                            // Tırnak başlangıcı/bitişi
                            inQuotes = !inQuotes
                        }
                    } else if ((char === ',' || char === '\t') && !inQuotes) {
                        // Ayırıcı (virgül veya tab) ve tırnak dışındaysa
                        result.push(current.trim())
                        current = ''
                    } else {
                        current += char
                    }
                }
                result.push(current.trim()) // Son alan
                return result
            }

            // İlk satır header
            const headers = parseCSVLine(lines[0]).map(h => h.trim())
            const data = []

            // Format tespiti: tab mı virgül mü?
            const firstLineParts = parseCSVLine(lines[0])
            const isTabSeparated = lines[0].includes('\t') && !lines[0].includes(',')

            for (let i = 1; i < lines.length; i++) {
                const values = parseCSVLine(lines[i])
                if (values.length < headers.length) continue

                const row = {}
                headers.forEach((header, index) => {
                    // Tırnak işaretlerini kaldır
                    let value = values[index]?.trim() || ''
                    if (value.startsWith('"') && value.endsWith('"')) {
                        value = value.slice(1, -1)
                    }
                    row[header] = value
                })
                data.push(row)
            }

            setPreviewData(data)
        }
        reader.readAsText(file, 'UTF-8')
    }

    // CSV'yi import et
    const handleImport = async () => {
        if (!csvFile || previewData.length === 0) {
            alert('Lütfen önce bir CSV dosyası yükleyin!')
            return
        }

        setImporting(true)
        setImportResult(null)

        try {
            const formData = new FormData()
            formData.append('csv', csvFile)

            const response = await fetch('/api/admin/locksmiths/import', {
                method: 'POST',
                body: formData
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || 'Import işlemi başarısız oldu')
            }

            setImportResult({
                success: true,
                imported: result.imported || 0,
                failed: result.failed || 0,
                errors: result.errors || []
            })

            // Başarılı import sonrası preview'ı temizle
            if (result.imported > 0) {
                setPreviewData([])
                setCsvFile(null)
                // File input'u sıfırla
                const fileInput = document.getElementById('csv-file')
                if (fileInput) fileInput.value = ''
            }
        } catch (error) {
            setImportResult({
                success: false,
                error: error.message
            })
        } finally {
            setImporting(false)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Çilingir İmport</h1>
                <p className="text-gray-600">CSV dosyası ile çilingir listesini toplu olarak ekleyin</p>
            </div>

            {/* Dosya yükleme alanı */}
            <div className="bg-white rounded-lg shadow p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    CSV Dosyası Seçin
                </label>
                <input
                    id="csv-file"
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleFileUpload}
                    className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-indigo-50 file:text-indigo-700
                        hover:file:bg-indigo-100
                        cursor-pointer"
                />
                <p className="mt-2 text-xs text-gray-500">
                    Tab-separated (TSV) formatında CSV dosyası yükleyin
                </p>
            </div>

            {/* Önizleme tablosu */}
            {previewData.length > 0 && (
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Önizleme ({previewData.length} çilingir)
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        İşletme Adı
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        İl
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        İlçe
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Telefon
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Rating
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {previewData.slice(0, 10).map((row, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                            {row.business_name || '-'}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                            {row.province || '-'}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                            {row.district || '-'}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                            {row.phone_number || '-'}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                            {row.rating || '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {previewData.length > 10 && (
                            <div className="px-6 py-3 bg-gray-50 text-sm text-gray-500">
                                ... ve {previewData.length - 10} kayıt daha
                            </div>
                        )}
                    </div>
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <button
                            onClick={handleImport}
                            disabled={importing}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {importing ? 'İçe Aktarılıyor...' : `${previewData.length} Çilingiri İçe Aktar`}
                        </button>
                    </div>
                </div>
            )}

            {/* Import sonuçları */}
            {importResult && (
                <div className={`rounded-lg shadow p-6 ${importResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    {importResult.success ? (
                        <div>
                            <h3 className="text-lg font-semibold text-green-800 mb-2">
                                Import Başarılı!
                            </h3>
                            <p className="text-green-700">
                                {importResult.imported} çilingir başarıyla eklendi.
                                {importResult.failed > 0 && (
                                    <span className="ml-2">{importResult.failed} çilingir eklenemedi.</span>
                                )}
                            </p>
                            {importResult.errors && importResult.errors.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="font-medium text-red-800 mb-2">Hatalar:</h4>
                                    <ul className="list-disc list-inside text-sm text-red-700">
                                        {importResult.errors.slice(0, 10).map((error, index) => (
                                            <li key={index}>{error}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            <h3 className="text-lg font-semibold text-red-800 mb-2">
                                Import Başarısız
                            </h3>
                            <p className="text-red-700">{importResult.error}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
