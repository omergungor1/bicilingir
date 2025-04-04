import { NextResponse } from 'next/server';

const PAGE_SIZE = 10;

export async function GET(request) {
  return NextResponse.json({
    success: true,
    message: "Bu API route henüz implemente edilmemiştir.",
  })
} 