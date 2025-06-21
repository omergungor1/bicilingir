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
