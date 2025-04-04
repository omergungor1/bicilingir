import { NextResponse } from 'next/server';


export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Bu API route henüz implemente edilmemiştir.",
  })
} 