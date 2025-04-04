import { NextResponse } from 'next/server';

const PAGE_SIZE = 10;

export async function GET(request) {
  //review stats ve reviews dönecek -> pagination yapılacak
  return NextResponse.json({
    success: true,
    message: "Bu API route henüz implemente edilmemiştir.",
   })
} 