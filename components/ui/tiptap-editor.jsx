"use client";

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import { AiAssistButton } from './ai-assist-button';


// Renk seçimi için bir bileşen oluşturalım
const ColorPicker = ({ title, colors, onColorSelect, buttonClass }) => {
    const [isOpen, setIsOpen] = useState(false);
  
    const handleColorSelect = useCallback((color) => {
      onColorSelect(color);
      setIsOpen(false);
    }, [onColorSelect]);

    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={buttonClass}
          title={title}
        >
          {title}
        </button>
        
        {isOpen && (
          <div className="absolute z-10 top-full left-0 mt-1 bg-white rounded shadow-lg p-2 border border-gray-200 flex flex-wrap gap-1 w-[200px]">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                title={color}
                onClick={() => handleColorSelect(color)}
                className="w-6 h-6 rounded-sm border border-gray-300"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}
      </div>
    );
};
  
// Emoji seçimi için bir bileşen
const EmojiPicker = ({ onEmojiSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const emojis = useMemo(() => [
      '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', 
      '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', 
      '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', 
      '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', 
      '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', 
      '😭', '😤', '😠', '😡', '🤬', '😈', '👿', '💀', '☠️', 
      '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖', '🎃', 
      '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾',
      '👍', '👎', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✌️',
      '🌟', '⭐', '🔥', '💯', '❤️', '🧡', '💛', '💚', '💙', '💜'
    ], []);
    
    const handleEmojiSelect = useCallback((emoji) => {
      onEmojiSelect(emoji);
      setIsOpen(false);
    }, [onEmojiSelect]);
  
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="px-2 py-1 rounded text-sm bg-gray-100 text-gray-700"
          title="Emoji Ekle"
        >
          Emoji 😊
        </button>
        
        {isOpen && (
          <div className="absolute z-10 top-full left-0 mt-1 bg-white rounded shadow-lg p-2 border border-gray-200 flex flex-wrap gap-1 w-[240px] max-h-[200px] overflow-y-auto">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleEmojiSelect(emoji)}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded"
                title={emoji}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    );
};
  
// Basit bir toolbar bileşeni oluşturalım
const TiptapToolbar = ({ editor }) => {
    if (!editor) {
      return null;
    }
  
    const [moreToolsOpen, setMoreToolsOpen] = useState(false);
  
    const textColors = useMemo(() => [
      '#000000', '#434343', '#666666', '#999999', '#cccccc', 
      '#ff0000', '#ff4d00', '#ffff00', '#00ff00', '#00ffff', 
      '#0000ff', '#9900ff', '#ff00ff', '#663300', '#336600'
    ], []);
  
    const bgColors = useMemo(() => [
      '#ffffff', '#f5f5f5', '#ffe0e0', '#fff0e0', '#fffde0',
      '#e0ffe0', '#e0ffff', '#e0e0ff', '#ffe0ff', '#ffd6d6',
      '#ffebd6', '#fffbd6', '#d6ffd6', '#d6ffff', '#d6d6ff'
    ], []);
  
    // Resim yükleme işlevi
    const addImage = useCallback(() => {
      const url = window.prompt('Resim URL\'i girin:');
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    }, [editor]);
    
    // Button event handlers
    const toggleBold = useCallback(() => editor.chain().focus().toggleBold().run(), [editor]);
    const toggleItalic = useCallback(() => editor.chain().focus().toggleItalic().run(), [editor]);
    const toggleUnderline = useCallback(() => editor.chain().focus().toggleUnderline().run(), [editor]);
    const toggleStrike = useCallback(() => editor.chain().focus().toggleStrike().run(), [editor]);
    const alignLeft = useCallback(() => editor.chain().focus().setTextAlign('left').run(), [editor]);
    const alignCenter = useCallback(() => editor.chain().focus().setTextAlign('center').run(), [editor]);
    const alignRight = useCallback(() => editor.chain().focus().setTextAlign('right').run(), [editor]);
    const toggleBulletList = useCallback(() => editor.chain().focus().toggleBulletList().run(), [editor]);
    const toggleOrderedList = useCallback(() => editor.chain().focus().toggleOrderedList().run(), [editor]);
    const toggleH2 = useCallback(() => editor.chain().focus().toggleHeading({ level: 2 }).run(), [editor]);
    const toggleH3 = useCallback(() => editor.chain().focus().toggleHeading({ level: 3 }).run(), [editor]);
    const setParagraph = useCallback(() => editor.chain().focus().setParagraph().run(), [editor]);
    const toggleBlockquote = useCallback(() => editor.chain().focus().toggleBlockquote().run(), [editor]);
    const setTextColor = useCallback((color) => editor.chain().focus().setColor(color).run(), [editor]);
    const setHighlight = useCallback((color) => editor.chain().focus().setHighlight({ color }).run(), [editor]);
    const insertEmoji = useCallback((emoji) => editor.chain().focus().insertContent(emoji).run(), [editor]);
  
    return (
      <div className="border-b border-gray-200 flex flex-wrap gap-1 bg-gray-50">
        {/* Ana Araç Çubuğu */}
        <div className="p-1 flex flex-wrap gap-1 w-full">
          {/* Temel Biçimlendirme Araçları */}
          <div className="flex gap-1 mr-2 flex-wrap">
            <button
              type="button"
              onClick={toggleBold}
              className={`px-2 py-1 rounded text-sm ${editor.isActive('bold') ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'}`}
              title="Kalın"
            >
              B
            </button>
            <button
              type="button"
              onClick={toggleItalic}
              className={`px-2 py-1 rounded text-sm ${editor.isActive('italic') ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'}`}
              title="İtalik"
            >
              I
            </button>
            <button
              type="button"
              onClick={toggleUnderline}
              className={`px-2 py-1 rounded text-sm ${editor.isActive('underline') ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'}`}
              title="Altı Çizili"
            >
              U
            </button>
            <button
              type="button"
              onClick={toggleStrike}
              className={`px-2 py-1 rounded text-sm ${editor.isActive('strike') ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'}`}
              title="Üstü Çizili"
            >
              S
            </button>
          </div>
  
          {/* Hizalama Araçları */}
          <div className="flex gap-1 mr-2 flex-wrap">
            <button
              type="button"
              onClick={alignLeft}
              className={`px-2 py-1 rounded text-sm ${editor.isActive({ textAlign: 'left' }) ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'}`}
              title="Sola Hizala"
            >
              ⟮
            </button>
            <button
              type="button"
              onClick={alignCenter}
              className={`px-2 py-1 rounded text-sm ${editor.isActive({ textAlign: 'center' }) ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'}`}
              title="Ortala"
            >
              ≡
            </button>
            <button
              type="button"
              onClick={alignRight}
              className={`px-2 py-1 rounded text-sm ${editor.isActive({ textAlign: 'right' }) ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'}`}
              title="Sağa Hizala"
            >
              ⟯
            </button>
          </div>
  
          {/* Liste Araçları */}
          <div className="flex gap-1 mr-2 flex-wrap">
            <button
              type="button"
              onClick={toggleBulletList}
              className={`px-2 py-1 rounded text-sm ${editor.isActive('bulletList') ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'}`}
              title="Madde İşaretli Liste"
            >
              • Liste
            </button>
            <button
              type="button"
              onClick={toggleOrderedList}
              className={`px-2 py-1 rounded text-sm ${editor.isActive('orderedList') ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'}`}
              title="Numaralı Liste"
            >
              1. Liste
            </button>
          </div>
  
          {/* Ek Araçlar Butonu (Mobil uyumlu) */}
          <div className="ml-auto">
            <button
              type="button"
              onClick={() => setMoreToolsOpen(!moreToolsOpen)}
              className="px-2 py-1 rounded text-sm bg-blue-50 text-blue-600 flex items-center"
            >
              {moreToolsOpen ? 'Araçları Gizle' : 'Daha Fazla Araç'} 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={moreToolsOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
              </svg>
            </button>
          </div>
        </div>
  
        {/* Genişletilmiş Araçlar */}
        {moreToolsOpen && (
          <div className="w-full p-1 border-t border-gray-200 flex flex-wrap gap-2">
            {/* Başlıklar */}
            <div className="flex gap-1 mr-2 mb-1">
              <button
                type="button"
                onClick={toggleH2}
                className={`px-2 py-1 rounded text-sm ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'}`}
                title="Büyük Başlık"
              >
                H2
              </button>
              <button
                type="button"
                onClick={toggleH3}
                className={`px-2 py-1 rounded text-sm ${editor.isActive('heading', { level: 3 }) ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'}`}
                title="Orta Başlık"
              >
                H3
              </button>
              <button
                type="button"
                onClick={setParagraph}
                className={`px-2 py-1 rounded text-sm ${editor.isActive('paragraph') ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'}`}
                title="Paragraf"
              >
                P
              </button>
              <button
                type="button"
                onClick={toggleBlockquote}
                className={`px-2 py-1 rounded text-sm ${editor.isActive('blockquote') ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'}`}
                title="Alıntı"
              >
                Alıntı
              </button>
            </div>
  
            {/* Renk ve Görsel Araçları */}
            <div className="flex gap-1 mr-2 mb-1 flex-wrap">
              <ColorPicker
                title="Metin Rengi"
                colors={textColors}
                onColorSelect={setTextColor}
                buttonClass={`px-2 py-1 rounded text-sm bg-gray-100 text-gray-700`}
              />
              
              <ColorPicker
                title="Arka Plan"
                colors={bgColors}
                onColorSelect={setHighlight}
                buttonClass={`px-2 py-1 rounded text-sm bg-gray-100 text-gray-700`}
              />
              <EmojiPicker onEmojiSelect={insertEmoji} />
            </div>
          </div>
        )}
      </div>
    );
};

export const TiptapEditor = ({ 
  content, 
  onChange, 
  placeholder = "İçerik girin...",
  maxLength = 1000,
  showAiAssist = true,
  aiAssistField = "hakkinda",
  className = ""
}) => {
  // İçerik state'i
  const [localContent, setLocalContent] = useState(content || '');
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [pendingAiContent, setPendingAiContent] = useState(null);
  
  // Değişiklik işleyicisini memoize et
  const handleUpdate = useCallback(({ editor }) => {
    const html = editor.getHTML();
    onChange(html);
  }, [onChange]);

  // Tiptap uzantılarını memoize et
  const extensions = useMemo(() => [
    StarterKit,
    Underline,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    TextStyle,
    Color,
    Highlight,
    Placeholder.configure({
      placeholder: placeholder,
    }),
  ], [placeholder]);

  // Editörü oluştur
  const editor = useEditor({
    extensions,
    content: localContent,
    onUpdate: handleUpdate,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose focus:outline-none p-4 min-h-[200px]',
      },
    }
  });

  // content prop'u değiştiğinde editörü güncelle
  useEffect(() => {
    if (editor && content !== localContent) {
      setLocalContent(content);
      editor.commands.setContent(content || '');
    }
  }, [content, editor, localContent]);

  // AI içeriği geldiğinde editörü güncelle
  useEffect(() => {
    if (editor && pendingAiContent) {
      editor.commands.setContent(pendingAiContent);
      onChange(pendingAiContent);
      setLocalContent(pendingAiContent);
      setPendingAiContent(null);
      setIsLoadingAi(false);
    }
  }, [editor, pendingAiContent, onChange]);

  // AI asistan işlev fonksiyonu
  const handleAiAssist = useCallback(() => {
    // Editor olup olmadığını kontrol et
    if (!editor) return;
    
    setIsLoadingAi(true);
    
    // AI İyileştirme API'sini çağır
    fetch('/api/ai/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        field: aiAssistField,
        businessName: "Şirket",
        currentText: editor.getText()
      }),
    })
    .then(response => {
      if (!response.ok) {
        setIsLoadingAi(false);
        throw new Error("AI ile içerik oluşturulurken bir hata oluştu");
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        // Editor'e bağımlılık olmadan içeriği güncelle
        setPendingAiContent(data.text);
      } else {
        setIsLoadingAi(false);
      }
    })
    .catch(error => {
      console.error("AI hatası:", error);
      setIsLoadingAi(false);
    });
  }, [aiAssistField, editor]);

  // Karakter sayısı hesaplama
  const characterCount = useMemo(() => {
    return editor ? editor.getText().length : 0;
  }, [editor]);

  return (
    <div className={`border rounded-md ${className}`}>
      <div className="flex justify-between items-center p-2 border-b">
        <div className="text-sm text-gray-500">
          {characterCount}/{maxLength} karakter
        </div>
        {showAiAssist && (
          <AiAssistButton 
            loading={isLoadingAi}
            onClick={handleAiAssist}
            field={aiAssistField}
          />
        )}
      </div>
      <TiptapToolbar editor={editor} />
      <EditorContent 
        editor={editor} 
        className="min-h-[200px] max-h-[400px] overflow-y-auto"
      />
    </div>
  );
}; 