import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const cookieStore = cookies();
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get: (name) => cookieStore.get(name)?.value,
          set: (name, value, options) => cookieStore.set(name, value, options),
          remove: (name, options) => cookieStore.set(name, '', { ...options, maxAge: 0 }),
        },
      }
    );
    
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect back to the page user tried to access before login
  const redirectTo = requestUrl.searchParams.get('redirectTo') || '/';
  return NextResponse.redirect(new URL(redirectTo, request.url));
} 