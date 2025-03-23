import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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