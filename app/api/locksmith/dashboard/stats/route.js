import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/**
 * Belirli bir periyoda göre tarih aralığı oluşturur
 * @param {string} period - Periyot (today, yesterday, last7days, last30days, thisMonth, thisYear, all)
 * @returns {Object} başlangıç ve bitiş tarihleri
 */
function getDateRangeForPeriod(period) {
  const now = new Date();
  const startDate = new Date();
  let endDate = new Date();
  
  switch (period) {
    case 'today':
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'yesterday':
      startDate.setDate(startDate.getDate() - 1);
      startDate.setHours(0, 0, 0, 0);
      endDate.setDate(endDate.getDate() - 1);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'last7days':
      startDate.setDate(startDate.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'last30days':
      startDate.setDate(startDate.getDate() - 30);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'thisMonth':
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'thisYear':
      startDate.setMonth(0, 1);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'all':
    default:
      startDate.setFullYear(2000, 0, 1); // Çok eski bir tarih
      break;
  }
  
  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString()
  };
}

/**
 * Bir önceki periyotta aynı aktivite tiplerinin verilerini alır
 * @param {Object} supabase - Supabase istemcisi
 * @param {string} locksmithId - Çilingir ID
 * @param {string} period - Mevcut periyot
 * @returns {Object} Önceki periyoda ait veriler
 */
async function getPreviousPeriodData(supabase, locksmithId, period) {
  // Mevcut periyodun iki katı süreyi önceki periyot olarak hesapla
  let prevPeriod;
  switch (period) {
    case 'today':
      prevPeriod = 'yesterday';
      break;
    case 'yesterday':
      prevPeriod = 'yesterday'; // Önceki gün, 2 gün öncesi olacak
      break;
    case 'last7days':
      prevPeriod = 'last7days'; // Önceki 7 gün, 14 gün öncesinden 7 gün öncesine kadar
      break;
    case 'last30days':
      prevPeriod = 'last30days'; // Önceki 30 gün
      break;
    case 'thisMonth':
      prevPeriod = 'thisMonth'; // Önceki ay
      break;
    case 'thisYear':
      prevPeriod = 'thisYear'; // Önceki yıl
      break;
    case 'all':
    default:
      prevPeriod = 'all';
      break;
  }
  
  return calculateStatsForPeriod(supabase, locksmithId, prevPeriod);
}

/**
 * Belirli bir periyot için istatistikleri hesaplar
 * @param {Object} supabase - Supabase istemcisi
 * @param {string} locksmithId - Çilingir ID
 * @param {string} period - Periyot
 * @returns {Object} Hesaplanan istatistikler
 */
async function calculateStatsForPeriod(supabase, locksmithId, period) {
  try {
    const { startDate, endDate } = getDateRangeForPeriod(period);
    
    // Görüntülenme sayısı (profil ziyaret + arama sonuçlarında görüntülenme)
    const { data: viewData, error: viewError } = await supabase
      .from('user_activity_logs')
      .select('activityType, count')
      .eq('locksmithId', locksmithId)
      .in('activityType', ['locksmith_detail_view', 'locksmith_list_view'])
      .gte('createdAt', startDate)
      .lte('createdAt', endDate)
      .count();
      
    if (viewError) throw viewError;
    
    // Arama sayısı
    const { data: callData, error: callError } = await supabase
      .from('user_activity_logs')
      .select('activityType, count')
      .eq('locksmithId', locksmithId)
      .eq('activityType', 'call_request')
      .gte('createdAt', startDate)
      .lte('createdAt', endDate)
      .count();
      
    if (callError) throw callError;
    
    // Ziyaret sayısı (search aktivitesi)
    const { data: visitData, error: visitError } = await supabase
      .from('user_activity_logs')
      .select('activityType, count')
      .eq('locksmithId', locksmithId)
      .eq('activityType', 'search')
      .gte('createdAt', startDate)
      .lte('createdAt', endDate)
      .count();
      
    if (visitError) throw visitError;
    
    // Değerlendirme sayısı
    const { data: reviewData, error: reviewError } = await supabase
      .from('user_activity_logs')
      .select('activityType, count')
      .eq('locksmithId', locksmithId)
      .eq('activityType', 'review_submit')
      .gte('createdAt', startDate)
      .lte('createdAt', endDate)
      .count();
      
    if (reviewError) throw reviewError;
    
    return {
      see: viewData.length || 0,
      call: callData.length || 0,
      visit: visitData.length || 0,
      review: reviewData.length || 0,
    };
  } catch (error) {
    console.error(`İstatistik hesaplama hatası (${period}):`, error);
    return {
      see: 0,
      call: 0,
      visit: 0,
      review: 0
    };
  }
}

// Test verileri - veritabanı olmadığında kullanılacak
// const testStats = {
//   today: {
//     see: 25,
//     see_percent: 12.5,
//     call: 3,
//     call_percent: 8.3,
//     visit: 1,
//     visit_percent: 5.6,
//     review: 45,
//     review_percent: 1.8,
//   },
//   yesterday: {
//     see: 38,
//     see_percent: 11,
//     call: 9,
//     call_percent: 4.2,
//     visit: 3,
//     visit_percent: 4.6,
//     review: 4,
//     review_percent: 7.8
//   },
//   last7days: {
//     see: 87,
//     see_percent: 6.5,
//     call: 23,
//     call_percent: 4.2,
//     visit: 4,
//     visit_percent: 4.6,
//     review: 4,
//     review_percent: 7.8
//   },
//   last30days: {
//     see: 342,
//     see_percent: 17.5,
//     call: 95,
//     call_percent: 2.2,
//     visit: 4,
//     visit_percent: -4.6,
//     review: 4,
//     review_percent: 3.8
//   },
//   thisMonth: {
//     see: 980,
//     see_percent: 6.5,
//     call: 265,
//     call_percent: 3.2,
//     visit: 78,
//     visit_percent: -4.6,
//     review: 4,
//     review_percent: 9.8
//   },
//   thisYear: {
//     see: 11540,
//     see_percent: 7.5,
//     call: 3200,
//     call_percent: 3.2,
//     visit: 950,
//     visit_percent: -4.6,
//     review: 4,
//     review_percent: 9.8
//   },
//   all: {
//     see: 25400,
//     see_percent: 12.5,
//     call: 7890,
//     call_percent: 3.2,
//     visit: 2300,
//     visit_percent: -4.6,
//     review: 4,
//     review_percent: 9.8
//   }
// };

/**
 * 
-- Kullanıcı Aktivite Türleri
CREATE TYPE user_activity_type_enum AS ENUM (
    'search',
    'locksmith_list_view',
    'locksmith_detail_view',
    'call_request',
    'review_submit',
    'profile_visit'
);


-- Kullanıcı Aktivite Logları Tablosu
CREATE TABLE user_activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    userIp INET,
    userAgent TEXT,
    sessionId UUID,
    
    searchProvinceId INTEGER REFERENCES provinces(id),
    searchDistrictId INTEGER REFERENCES districts(id),
    searchServiceId UUID REFERENCES services(id),
    
    activityType user_activity_type_enum NOT NULL,
    locksmithId UUID REFERENCES locksmiths(id),
    
    isSuspicious BOOLEAN DEFAULT FALSE,
    isRepeated BOOLEAN DEFAULT FALSE,
    activityCount INTEGER DEFAULT 0,
    lastActivityTime TIMESTAMPTZ,
    isFraudulent BOOLEAN DEFAULT FALSE,
    
    createdAt TIMESTAMPTZ DEFAULT NOW()
);
 */

export async function GET(request) {
  try {
    // URL'den period ve locksmithId parametrelerini al
    const filter = request.nextUrl.searchParams.get('period') || 'today';
    const locksmithId = request.nextUrl.searchParams.get('locksmithId');
    
    // Supabase istemcisi oluştur
    // Not: Yetki kontrolü middlewareda yapılıyor, burada tekrar kontrol etmeye gerek yok
    const requestHeaders = new Headers(request.headers);
    const response = NextResponse.next();
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            const cookieHeader = requestHeaders.get('cookie') || '';
            const cookies = {};
            
            cookieHeader.split(';').forEach(cookie => {
              const [name, ...value] = cookie.split('=');
              if (name) {
                cookies[name.trim()] = value.join('=').trim();
              }
            });
            
            return Object.entries(cookies).map(([name, value]) => ({
              name,
              value,
            }));
          },
          set(name, value, options) {
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name, options) {
            response.cookies.set({
              name,
              value: '',
              ...options,
              maxAge: 0,
            });
          }
        },
      }
    );
    
    // Mevcut periyot için istatistikleri al
    const currentPeriodStats = await calculateStatsForPeriod(supabase, locksmithId, filter);
    
    // Önceki periyot için istatistikleri al (yüzdelik değişim için)
    const previousPeriodStats = await getPreviousPeriodData(supabase, locksmithId, filter);
    
    // Yüzdelik değişimleri hesapla
    const calculatePercentageChange = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Number((((current - previous) / previous) * 100).toFixed(1));
    };
    
    // Son formatlanmış istatistikler
    const formattedStats = {
      see: currentPeriodStats.see,
      see_percent: calculatePercentageChange(currentPeriodStats.see, previousPeriodStats.see),
      call: currentPeriodStats.call,
      call_percent: calculatePercentageChange(currentPeriodStats.call, previousPeriodStats.call),
      visit: currentPeriodStats.visit,
      visit_percent: calculatePercentageChange(currentPeriodStats.visit, previousPeriodStats.visit),
      review: currentPeriodStats.review,
      review_percent: calculatePercentageChange(currentPeriodStats.review, previousPeriodStats.review)
    };
    
    return NextResponse.json(formattedStats);
  } catch (error) {
    console.error("API hatası:", error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
} 