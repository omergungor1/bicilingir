import { NextResponse } from 'next/server';

// Test verileri
const testActivities = [
  {
    id: 1,
    locksmithId: 1,
    type: 'visit',
    date: '2025-03-23 10:00:00',
    location: 'Beşiktaş',
    serviceType: 'Acil Çilingir',
    activityCount: 1,
  },
  {
    id: 2,
    locksmithId: 2,
    type: 'call',
    date: '2025-03-23 10:00:00',
    location: 'Beşiktaş', 
    serviceType: 'Oto Çilingir',
    activityCount: 1,
  },
  {
    id: 3,
    locksmithId: 3, 
    type: 'search',
    date: '2025-03-23 10:00:00',
    location: 'Kartal',
    serviceType: 'Kasa Çilingir',
    activityCount: 1,
  },  
  {
    id: 4,
    locksmithId: 4,
    type: 'review',
    date: '2025-03-23 10:00:00',
    location: 'Avcılar',
    serviceType: 'Kasa Çilingir',
    activityCount: 1,
  },
  {
    id: 5,
    locksmithId: 5,
    type: 'call',
    date: '2025-03-23 10:00:00',
    location: 'Kartal',
    serviceType: 'Kasa Çilingir',
    activityCount: 1,
  },
  {
    id: 6,
    locksmithId: 6,
    type: 'search',
    date: '2025-03-23 10:00:00',
    location: 'Kartal',
    serviceType: 'Oto Çilingir',
    activityCount: 1,
  }
];


export async function GET() {
  try {
    return NextResponse.json(testActivities);
  } catch (error) {
    console.error("API hatası:", error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
} 