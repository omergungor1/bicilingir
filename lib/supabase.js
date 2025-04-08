import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Client component'lerde kullanılacak Supabase istemcisi
export const supabase = createClientComponentClient({
  auth: {
    persistSession: true,
    storageKey: 'sb-auth-token',
    storage: {
      getItem: (key) => {
        if (typeof window === 'undefined') {
          return null;
        }
        
        const item = window.localStorage.getItem(key);
        console.log(`Supabase getItem: ${key}`, item ? 'Mevcut' : 'Yok');
        return item;
      },
      setItem: (key, value) => {
        if (typeof window === 'undefined') {
          return;
        }
        
        console.log(`Supabase setItem: ${key}`, value ? 'Değer ayarlandı' : 'Değer yok');
        window.localStorage.setItem(key, value);
      },
      removeItem: (key) => {
        if (typeof window === 'undefined') {
          return;
        }
        
        console.log(`Supabase removeItem: ${key}`);
        window.localStorage.removeItem(key);
      }
    }
  }
});

// Admin işlemleri için servis rolü ile istemci (sadece server-side işlemlerde kullan)
// export const supabaseAdmin = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL,
//   process.env.SUPABASE_SERVICE_ROLE_KEY
// ); 