'use client'

import { useState } from 'react'

export default function AIButton({ text, onTextChange, fieldType = 'content' }) {
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [customPrompt, setCustomPrompt] = useState('')

    const handleAction = async (action) => {
        if (!text?.trim()) {
            alert('Metin boş olamaz')
            return
        }

        setLoading(true)
        try {
            const body = { text, action, fieldType }
            if (action === 'custom' && customPrompt) {
                body.customPrompt = customPrompt
            }

            // Timeout ile fetch (50 saniye)
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 50000)

            const response = await fetch('/api/admin/ai/improve-text', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
                signal: controller.signal
            })

            clearTimeout(timeoutId)

            const data = await response.json()

            if (response.ok) {
                onTextChange(data.improvedText)
                setIsOpen(false)
                setCustomPrompt('')
            } else {
                if (response.status === 408) {
                    alert('İşlem zaman aşımına uğradı. Lütfen daha kısa bir metin deneyin.')
                } else {
                    alert('Hata: ' + data.error)
                }
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                alert('İşlem zaman aşımına uğradı. Lütfen daha kısa bir metin deneyin.')
            } else {
                alert('AI isteği başarısız oldu: ' + error.message)
            }
        } finally {
            setLoading(false)
        }
    }

    const actions = [
        { key: 'rewrite', label: 'Tekrar Yaz', icon: '🔄' },
        { key: 'improve', label: 'İyileştir', icon: '✨' },
        { key: 'extend', label: 'Uzat', icon: '📏' },
        { key: 'shorten', label: 'Kısalt', icon: '✂️' },
        { key: 'engaging', label: 'Daha Etkileyici Yap', icon: '🎯' },
    ]

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={loading}
                className="inline-flex items-center px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-100 rounded hover:bg-indigo-200 disabled:opacity-50"
                title="AI ile iyileştir"
            >
                {loading ? '⏳' : '🤖'} AI
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                    <div className="py-2">
                        <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b">
                            AI İyileştirme Seçenekleri
                        </div>

                        {actions.map((action) => (
                            <button
                                key={action.key}
                                onClick={() => handleAction(action.key)}
                                disabled={loading}
                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 flex items-center"
                            >
                                <span className="mr-2">{action.icon}</span>
                                {action.label}
                            </button>
                        ))}

                        <div className="border-t mt-2 pt-2 px-3">
                            <input
                                type="text"
                                placeholder="Özel talimat yazın..."
                                value={customPrompt}
                                onChange={(e) => setCustomPrompt(e.target.value)}
                                className="w-full text-sm border border-gray-300 rounded px-2 py-1 mb-2"
                            />
                            <button
                                onClick={() => handleAction('custom')}
                                disabled={loading || !customPrompt.trim()}
                                className="w-full bg-indigo-600 text-white text-sm py-1 rounded hover:bg-indigo-700 disabled:opacity-50"
                            >
                                Özel Talimat Uygula
                            </button>
                        </div>

                        <div className="border-t mt-2 pt-2">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-full text-left px-3 py-2 text-sm text-gray-500 hover:bg-gray-100"
                            >
                                Kapat
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
