import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Client component'lerde kullanılacak Supabase istemcisi
export const supabase = createClientComponentClient();

// Admin işlemleri için servis rolü ile istemci (sadece server-side işlemlerde kullan)
// export const supabaseAdmin = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL,
//   process.env.SUPABASE_SERVICE_ROLE_KEY
// ); 