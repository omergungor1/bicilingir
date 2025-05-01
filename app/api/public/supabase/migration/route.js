import { NextResponse } from 'next/server';
import { createRouteClient } from '../../../utils';
import { getSupabaseServer } from '../../../../../lib/supabase';

export async function POST(request) {
  try {
    const { supabase } = createRouteClient(request);
    const { action } = await request.json();

    // Doğrudan SQL çalıştırmak için admin rolüne sahip bir Supabase istemcisi oluştur
    const supabaseAdmin = getSupabaseServer();

    if (action === 'create_tables') {
      // Kullanıcı tablosunu oluştur
      const { error: usersError } = await supabaseAdmin.from('users').select('count').limit(1);

      if (usersError && usersError.code === 'PGRST204') {
        console.log('Users tablosu oluşturuluyor...');

        // Direk SQL çalıştır
        try {
          // Önce uuid-ossp eklentisini etkinleştir
          const { error: uuidError } = await supabaseAdmin.sql(`
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
          `);

          if (uuidError) {
            console.error('UUID eklentisi etkinleştirilemedi:', uuidError);
          }

          // Users tablosunu oluştur
          const { error: createUsersError } = await supabaseAdmin.sql(`
            CREATE TABLE IF NOT EXISTS users (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              sessionid TEXT,
              userip TEXT,
              useragent TEXT,
              createdat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updatedat TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
          `);

          if (createUsersError) {
            console.error('Users tablosu oluşturma hatası:', createUsersError);
            throw createUsersError;
          }
        } catch (sqlError) {
          console.error('SQL hatası (users):', sqlError);
          throw sqlError;
        }
      }

      // Aktivite tablosunu oluştur - önce enum'u kontrol et
      try {
        const { data: enumData, error: enumError } = await supabaseAdmin.sql(`
          SELECT EXISTS (
            SELECT 1 FROM pg_type 
            WHERE typname = 'user_activity_type_enum'
          );
        `);

        // Enum yoksa oluştur
        if (enumData && enumData.length > 0 && !enumData[0].exists) {
          console.log('user_activity_type_enum oluşturuluyor...');

          const { error: createEnumError } = await supabaseAdmin.sql(`
            CREATE TYPE user_activity_type_enum AS ENUM (
              'search',
              'locksmith_list_view',
              'locksmith_detail_view',
              'call_request',
              'review_submit',
              'profile_visit',
              'whatsapp_message',
              'website_visit'
            );
          `);

          if (createEnumError) {
            console.error('Enum oluşturma hatası:', createEnumError);
          }
        }
      } catch (enumError) {
        console.error('Enum kontrol hatası:', enumError);
        // Hata olsa bile devam et
      }

      // Aktivite log tablosu oluştur
      const { error: logsError } = await supabaseAdmin.from('user_activity_logs').select('count').limit(1);

      if (logsError && logsError.code === 'PGRST204') {
        console.log('user_activity_logs tablosu oluşturuluyor...');

        try {
          // Tablo oluştur
          const { error: createLogsError } = await supabaseAdmin.sql(`
            CREATE TABLE IF NOT EXISTS user_activity_logs (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              userid UUID, 
              searchprovinceid INTEGER,
              searchdistrictid INTEGER,
              searchserviceid UUID,
              activitytype user_activity_type_enum NOT NULL,
              locksmithid UUID,
              reviewid UUID,
              sessionid UUID,
              devicetype TEXT,
              keyamount INTEGER DEFAULT 0,
              usagetypeid UUID,
              metadata JSONB,
              createdat TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
          `);

          if (createLogsError) {
            console.error('Logs tablosu oluşturma hatası:', createLogsError);
            throw createLogsError;
          }
        } catch (sqlError) {
          console.error('SQL hatası (logs):', sqlError);

          // Eğer enum hatası nedeniyle oluşturulamadıysa, user_activity_type_enum olmadan tekrar dene
          try {
            console.log('Alternatif tablo oluşturma deneniyor (enum olmadan)...');

            const { error: createAltLogsError } = await supabaseAdmin.sql(`
              CREATE TABLE IF NOT EXISTS user_activity_logs (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                userid UUID, 
                searchprovinceid INTEGER,
                searchdistrictid INTEGER,
                searchserviceid UUID,
                activitytype TEXT NOT NULL,
                locksmithid UUID,
                reviewid UUID,
                sessionid UUID,
                devicetype TEXT,
                keyamount INTEGER DEFAULT 0,
                usagetypeid UUID,
                metadata JSONB,
                createdat TIMESTAMP WITH TIME ZONE DEFAULT NOW()
              );
            `);

            if (createAltLogsError) {
              console.error('Alternatif logs tablosu oluşturma hatası:', createAltLogsError);
              throw createAltLogsError;
            }
          } catch (altError) {
            console.error('Alternatif tablo oluşturma hatası:', altError);
            throw altError;
          }
        }
      }

      // Key usage types tablosunu oluştur
      const { error: keyUsageTypesError } = await supabaseAdmin.from('key_usage_types').select('count').limit(1);

      if (keyUsageTypesError && keyUsageTypesError.code === 'PGRST204') {
        console.log('key_usage_types tablosu oluşturuluyor...');

        try {
          // Tablo oluştur
          const { error: createKeyUsageTypesError } = await supabaseAdmin.sql(`
            CREATE TABLE IF NOT EXISTS key_usage_types (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              name TEXT NOT NULL,
              level INTEGER NOT NULL,
              keyAmount INTEGER NOT NULL,
              description TEXT,
              isActive BOOLEAN DEFAULT TRUE,
              createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              UNIQUE(name, level)
            );
          `);

          if (createKeyUsageTypesError) {
            console.error('Key usage types tablosu oluşturma hatası:', createKeyUsageTypesError);
            throw createKeyUsageTypesError;
          }

          // Varsayılan key_usage_types değerlerini ekle
          const { error: insertKeyUsageTypesError } = await supabaseAdmin.sql(`
            INSERT INTO key_usage_types (name, level, keyAmount, description, isActive)
            VALUES 
            ('search', 1, 1, 'Arama işlemi', true),
            ('locksmith_list_view', 1, 5, 'Çilingir listesi görüntüleme - 1. sıra', true),
            ('locksmith_list_view', 2, 3, 'Çilingir listesi görüntüleme - 2. sıra', true),
            ('locksmith_list_view', 3, 1, 'Çilingir listesi görüntüleme - 3+ sıra', true),
            ('locksmith_detail_view', 1, 3, 'Çilingir detay görüntüleme', true),
            ('call_request', 1, 10, 'Çilingir arama', true),
            ('review_submit', 1, 0, 'Çilingir değerlendirme', true),
            ('whatsapp_message', 1, 5, 'WhatsApp mesajı gönderme', true),
            ('website_visit', 1, 1, 'Web sitesi ziyareti', true)
            ON CONFLICT (name, level) DO NOTHING;
          `);

          if (insertKeyUsageTypesError) {
            console.error('Key usage types değerleri eklenirken hata:', insertKeyUsageTypesError);
          }
        } catch (sqlError) {
          console.error('SQL hatası (key_usage_types):', sqlError);
          throw sqlError;
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Tablolar başarıyla oluşturuldu'
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Geçersiz işlem'
    }, { status: 400 });
  } catch (error) {
    console.error('Migration hatası:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Bilinmeyen hata'
    }, { status: 500 });
  }
} 