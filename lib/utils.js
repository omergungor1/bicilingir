import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { getSupabaseServer } from "./supabase";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Telefon numarasını formatlama fonksiyonu
export const formatPhoneNumber = (value) => {
  if (!value) return '';

  const phoneNumber = value.replace(/[^\d]/g, '');

  // Telefon numarası formatlama (05XX XXX XX XX)
  if (phoneNumber.length < 5) return phoneNumber;
  if (phoneNumber.length < 8) return `${phoneNumber.slice(0, 4)} ${phoneNumber.slice(4)}`;
  if (phoneNumber.length < 10) return `${phoneNumber.slice(0, 4)} ${phoneNumber.slice(4, 7)} ${phoneNumber.slice(7)}`;
  return `${phoneNumber.slice(0, 4)} ${phoneNumber.slice(4, 7)} ${phoneNumber.slice(7, 9)} ${phoneNumber.slice(9)}`;
};

export async function getUserRole() {
  const supabase = getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: roles } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  return roles?.role || null;
}


// // Renk seçimi için bir bileşen oluşturalım
// export const ColorPicker = ({ title, colors, onColorSelect, buttonClass }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <div className="relative">
//       <button
//         type="button"
//         onClick={() => setIsOpen(!isOpen)}
//         className={buttonClass}
//         title={title}
//       >
//         {title}
//       </button>

//       {isOpen && (
//         <div className="absolute z-10 top-full left-0 mt-1 bg-white rounded shadow-lg p-2 border border-gray-200 flex flex-wrap gap-1 w-[200px]">
//           {colors.map((color) => (
//             <button
//               key={color}
//               type="button"
//               title={color}
//               onClick={() => {
//                 onColorSelect(color);
//                 setIsOpen(false);
//               }}
//               className="w-6 h-6 rounded-sm border border-gray-300"
//               style={{ backgroundColor: color }}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// // Emoji seçimi için bir bileşen
// export const EmojiPicker = ({ onEmojiSelect }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const emojis = [
//     '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊',
//     '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗',
//     '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐',
//     '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟',
//     '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢',
//     '😭', '😤', '😠', '😡', '🤬', '😈', '👿', '💀', '☠️',
//     '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖', '🎃',
//     '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾',
//     '👍', '👎', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✌️',
//     '🌟', '⭐', '🔥', '💯', '❤️', '🧡', '💛', '💚', '💙', '💜'
//   ];

//   return (
//     <div className="relative">
//       <button
//         type="button"
//         onClick={() => setIsOpen(!isOpen)}
//         className="px-2 py-1 rounded text-sm bg-gray-100 text-gray-700"
//         title="Emoji Ekle"
//       >
//         Emoji 😊
//       </button>

//       {isOpen && (
//         <div className="absolute z-10 top-full left-0 mt-1 bg-white rounded shadow-lg p-2 border border-gray-200 flex flex-wrap gap-1 w-[240px] max-h-[200px] overflow-y-auto">
//           {emojis.map((emoji) => (
//             <button
//               key={emoji}
//               type="button"
//               onClick={() => {
//                 onEmojiSelect(emoji);
//                 setIsOpen(false);
//               }}
//               className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded"
//               title={emoji}
//             >
//               {emoji}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// // Basit bir toolbar bileşeni oluşturalım
// export const TiptapToolbar = ({ editor }) => {
//   if (!editor) {
//     return null;
//   }

//   const [moreToolsOpen, setMoreToolsOpen] = useState(false);

//   const textColors = [
//     '#000000', '#434343', '#666666', '#999999', '#cccccc',
//     '#ff0000', '#ff4d00', '#ffff00', '#00ff00', '#00ffff',
//     '#0000ff', '#9900ff', '#ff00ff', '#663300', '#336600'
//   ];

//   const bgColors = [
//     '#ffffff', '#f5f5f5', '#ffe0e0', '#fff0e0', '#fffde0',
//     '#e0ffe0', '#e0ffff', '#e0e0ff', '#ffe0ff', '#ffd6d6',
//     '#ffebd6', '#fffbd6', '#d6ffd6', '#d6ffff', '#d6d6ff'
//   ];

//   // Resim yükleme işlevi
//   const addImage = () => {
//     const url = window.prompt('Resim URL\'i girin:');
//     if (url) {
//       editor.chain().focus().setImage({ src: url }).run();
//     }
//   };

//   return (
//     <div className="border-b border-gray-200 flex flex-wrap gap-1 bg-gray-50">
//       {/* Ana Araç Çubuğu */}
//       <div className="p-1 flex flex-wrap gap-1 w-full">
//         {/* Temel Biçimlendirme Araçları */}
//         <div className="flex gap-1 mr-2 flex-wrap">
//           <button
//             type="button"
//             onClick={() => editor.chain().focus().toggleBold().run()}
//             className={`px-2 py-1 rounded text-sm ${editor.isActive('bold') ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'}`}
//             title="Kalın"
//           >
//             B
//           </button>
//           <button
//             type="button"
//             onClick={() => editor.chain().focus().toggleItalic().run()}
//             className={`px-2 py-1 rounded text-sm ${editor.isActive('italic') ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'}`}
//             title="İtalik"
//           >
//             I
//           </button>
//           <button
//             type="button"
//             onClick={() => editor.chain().focus().toggleUnderline().run()}
//             className={`px-2 py-1 rounded text-sm ${editor.isActive('underline') ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'}`}
//             title="Altı Çizili"
//           >
//             U
//           </button>
//           <button
//             type="button"
//             onClick={() => editor.chain().focus().toggleStrike().run()}
//             className={`px-2 py-1 rounded text-sm ${editor.isActive('strike') ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'}`}
//             title="Üstü Çizili"
//           >
//             S
//           </button>
//         </div>

//         {/* Hizalama Araçları */}
//         <div className="flex gap-1 mr-2 flex-wrap">
//           <button
//             type="button"
//             onClick={() => editor.chain().focus().setTextAlign('left').run()}
//             className={`px-2 py-1 rounded text-sm ${editor.isActive({ textAlign: 'left' }) ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'}`}
//             title="Sola Hizala"
//           >
//             ⟮
//           </button>
//           <button
//             type="button"
//             onClick={() => editor.chain().focus().setTextAlign('center').run()}
//             className={`px-2 py-1 rounded text-sm ${editor.isActive({ textAlign: 'center' }) ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'}`}
//             title="Ortala"
//           >
//             ≡
//           </button>
//           <button
//             type="button"
//             onClick={() => editor.chain().focus().setTextAlign('right').run()}
//             className={`px-2 py-1 rounded text-sm ${editor.isActive({ textAlign: 'right' }) ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'}`}
//             title="Sağa Hizala"
//           >
//             ⟯
//           </button>
//         </div>

//         {/* Liste Araçları */}
//         <div className="flex gap-1 mr-2 flex-wrap">
//           <button
//             type="button"
//             onClick={() => editor.chain().focus().toggleBulletList().run()}
//             className={`px-2 py-1 rounded text-sm ${editor.isActive('bulletList') ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'}`}
//             title="Madde İşaretli Liste"
//           >
//             • Liste
//           </button>
//           <button
//             type="button"
//             onClick={() => editor.chain().focus().toggleOrderedList().run()}
//             className={`px-2 py-1 rounded text-sm ${editor.isActive('orderedList') ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'}`}
//             title="Numaralı Liste"
//           >
//             1. Liste
//           </button>
//         </div>

//         {/* Ek Araçlar Butonu (Mobil uyumlu) */}
//         <div className="ml-auto">
//           <button
//             type="button"
//             onClick={() => setMoreToolsOpen(!moreToolsOpen)}
//             className="px-2 py-1 rounded text-sm bg-blue-50 text-blue-600 flex items-center"
//           >
//             {moreToolsOpen ? 'Araçları Gizle' : 'Daha Fazla Araç'}
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={moreToolsOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
//             </svg>
//           </button>
//         </div>
//       </div>

//       {/* Genişletilmiş Araçlar */}
//       {moreToolsOpen && (
//         <div className="w-full p-1 border-t border-gray-200 flex flex-wrap gap-2">
//           {/* Başlıklar */}
//           <div className="flex gap-1 mr-2 mb-1">
//             <button
//               type="button"
//               onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
//               className={`px-2 py-1 rounded text-sm ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'}`}
//               title="Büyük Başlık"
//             >
//               H2
//             </button>
//             <button
//               type="button"
//               onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
//               className={`px-2 py-1 rounded text-sm ${editor.isActive('heading', { level: 3 }) ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'}`}
//               title="Orta Başlık"
//             >
//               H3
//             </button>
//             <button
//               type="button"
//               onClick={() => editor.chain().focus().setParagraph().run()}
//               className={`px-2 py-1 rounded text-sm ${editor.isActive('paragraph') ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'}`}
//               title="Paragraf"
//             >
//               P
//             </button>
//             <button
//               type="button"
//               onClick={() => editor.chain().focus().toggleBlockquote().run()}
//               className={`px-2 py-1 rounded text-sm ${editor.isActive('blockquote') ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'}`}
//               title="Alıntı"
//             >
//               Alıntı
//             </button>
//           </div>

//           {/* Renk ve Görsel Araçları */}
//           <div className="flex gap-1 mr-2 mb-1 flex-wrap">
//             <ColorPicker
//               title="Metin Rengi"
//               colors={textColors}
//               onColorSelect={(color) => {
//                 editor.chain().focus().setColor(color).run();
//               }}
//               buttonClass={`px-2 py-1 rounded text-sm bg-gray-100 text-gray-700`}
//             />

//             <ColorPicker
//               title="Arka Plan"
//               colors={bgColors}
//               onColorSelect={(color) => {
//                 editor.chain().focus().setHighlight({ color }).run();
//               }}
//               buttonClass={`px-2 py-1 rounded text-sm bg-gray-100 text-gray-700`}
//             />

//             <button
//               type="button"
//               onClick={addImage}
//               className={`px-2 py-1 rounded text-sm bg-gray-100 text-gray-700`}
//               title="Resim Ekle"
//             >
//               Resim
//             </button>

//             <EmojiPicker
//               onEmojiSelect={(emoji) => {
//                 editor.chain().focus().insertContent(emoji).run();
//               }}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// UUID oluşturma fonksiyonu
export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Kullanıcı ID'sini alma veya oluşturma
export function getUserId() {
  if (typeof window !== 'undefined') {
    let userId = localStorage.getItem('userId');

    // Eğer userId yoksa oluştur ve kaydet
    if (!userId) {
      userId = generateUUID();
      localStorage.setItem('userId', userId);
    }

    return userId;
  }

  return null; // Server-side rendering için null döndür
}

export function getSessionId() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('sessionId');
  }
  return null;
}
