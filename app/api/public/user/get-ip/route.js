import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const headers = request.headers;
    
    // IP adresini çeşitli headerlardan almaya çalış
    const forwardedFor = headers.get('x-forwarded-for');
    const realIp = headers.get('x-real-ip');
    
    // Öncelik sırası: x-forwarded-for, x-real-ip veya varsayılan olarak '0.0.0.0'
    const clientIp = forwardedFor 
      ? forwardedFor.split(',')[0] 
      : realIp 
        ? realIp 
        : '0.0.0.0';
    
    return NextResponse.json({
      success: true,
      ip: clientIp
    });
  } catch (error) {
    console.error('IP adresi alınırken hata:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Bilinmeyen hata',
      ip: '0.0.0.0'
    }, { status: 500 });
  }
} 