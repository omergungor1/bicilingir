//çilingir ekleme yapılacak. -> Çilingir tablolarını ver öyle yapsın

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Bu API route henüz implemente edilmemiştir.",
  })
}

export async function PUT(request) {
  return NextResponse.json({
    success: true,
    message: "Bu API route henüz implemente edilmemiştir.",
  })
} 