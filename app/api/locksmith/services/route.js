import { NextResponse } from 'next/server';

// Tüm hizmetleri ve çilingirin aktif hizmetlerini getirir
export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Bu API route henüz implemente edilmemiştir.",
   })
}

// Çilingirin aktif hizmetlerini günceller
export async function PUT(request) {
  return NextResponse.json({
    success: true,
    message: "Bu API route henüz implemente edilmemiştir.",
   })
} 