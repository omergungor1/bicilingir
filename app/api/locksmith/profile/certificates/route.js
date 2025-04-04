import { NextResponse } from 'next/server';

export async function GET(request) {
 return NextResponse.json({
  success: true,
  message: "Bu API route henüz implemente edilmemiştir.",
 })
}

export async function POST(request) {
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

export async function DELETE(request) {
  return NextResponse.json({
    success: true,
    message: "Bu API route henüz implemente edilmemiştir.",
   })
} 
