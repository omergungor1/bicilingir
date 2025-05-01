import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';

// CLIENT COMPONENTS: Client component'lerde kullanılacak Supabase istemcisi (auth desteği ile)
let clientInstance = null;
export function getSupabaseClient() {
  if (typeof window === 'undefined') {
    throw new Error('getSupabaseClient sadece client componentlerde kullanılabilir');
  }

  if (!clientInstance) {
    clientInstance = createClientComponentClient({
      auth: {
        persistSession: true,
        storageKey: 'sb-auth-token',
        storage: {
          getItem: (key) => {
            const item = window.localStorage.getItem(key);
            return item;
          },
          setItem: (key, value) => {
            window.localStorage.setItem(key, value);
          },
          removeItem: (key) => {
            window.localStorage.removeItem(key);
          }
        }
      }
    });
  }
  return clientInstance;
}

// SERVER-SIDE: Server tarafında auth olmadan kullanılacak istemci
let serverInstance = null;
export function getSupabaseServer() {
  if (typeof window !== 'undefined') {
    throw new Error('getSupabaseServer sadece server-side kodlarda kullanılabilir');
  }

  if (!serverInstance) {
    serverInstance = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
  }
  return serverInstance;
}

// Admin işlemleri için servis rolü ile istemci (sadece server-side işlemlerde kullan)
// let adminInstance = null;
// export function getSupabaseAdmin() {
//   if (typeof window !== 'undefined') {
//     throw new Error('getSupabaseAdmin sadece server-side kodlarda kullanılabilir');
//   }

//   if (!adminInstance) {
//     adminInstance = createClient(
//       process.env.NEXT_PUBLIC_SUPABASE_URL,
//       process.env.SUPABASE_SERVICE_ROLE_KEY
//     );
//   }
//   return adminInstance;
// } 