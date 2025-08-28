import { NextResponse } from 'next/server';
import { createRouteClient } from '../../utils';

// Public çilingir listesi
export async function GET(request) {
    try {
        const { supabase } = createRouteClient(request);

        const { searchParams } = new URL(request.url);
        const province_id = searchParams.get('province_id');
        const district_id = searchParams.get('district_id');
        const neighborhood_id = searchParams.get('neighborhood_id');
        const service_id = searchParams.get('service_id');
        const limit = parseInt(searchParams.get('limit')) || 12;
        const offset = parseInt(searchParams.get('offset')) || 0;
        const search = searchParams.get('search');

        let query = supabase
            .from('locksmiths')
            .select(`
                id,
                slug,
                businessname,
                fullname,
                phonenumber,
                whatsappnumber,
                tagline,
                avgrating,
                totalreviewcount,
                profileimageurl,
                provinceid,
                districtid,
                locksmith_details (
                    abouttext,
                    lat,
                    lng
                ),
                provinces!locksmiths_provinceid_fkey (
                    id,
                    name,
                    slug
                ),
                districts!locksmiths_districtid_fkey (
                    id,
                    name,
                    slug
                )
            `)
            .eq('isactive', true)
            .eq('isverified', true)
            .order('avgrating', { ascending: false });

        // Filtreler
        if (province_id) {
            query = query.eq('provinceid', province_id);
        }
        if (district_id) {
            query = query.eq('districtid', district_id);
        }
        if (neighborhood_id) {
            // Neighborhood filtresi için - şimdilik district level'da filtrelemeyi tercih edelim
            // Çünkü locksmiths tablosunda neighborhoodid alanı olmayabilir
            // query = query.eq('neighborhoodid', neighborhood_id);
        }
        if (service_id) {
            // Servis filtresi için locksmith_services tablosunu join etmek gerekir
            // Şimdilik basit yaklaşım
        }

        // Arama
        if (search) {
            query = query.or(`businessname.ilike.%${search}%,fullname.ilike.%${search}%,tagline.ilike.%${search}%`);
        }

        // Sayfalama
        query = query.range(offset, offset + limit - 1);

        const { data: locksmithsData, error } = await query;

        if (error) {
            throw error;
        }

        // Toplam sayıyı al
        let countQuery = supabase
            .from('locksmiths')
            .select('*', { count: 'exact', head: true })
            .eq('isactive', true)
            .eq('isverified', true);

        // Aynı filtreleri count query'ye de uygula
        if (province_id) {
            countQuery = countQuery.eq('provinceid', province_id);
        }
        if (district_id) {
            countQuery = countQuery.eq('districtid', district_id);
        }
        if (neighborhood_id) {
            // countQuery = countQuery.eq('neighborhoodid', neighborhood_id);
        }
        if (search) {
            countQuery = countQuery.or(`businessname.ilike.%${search}%,fullname.ilike.%${search}%,tagline.ilike.%${search}%`);
        }

        const { count, error: countError } = await countQuery;

        if (countError) {
            console.error('Count query error:', countError);
        }

        return NextResponse.json({
            success: true,
            data: locksmithsData || [],
            pagination: {
                total: count || 0,
                limit,
                offset,
                hasMore: (count || 0) > offset + limit
            }
        });

    } catch (error) {
        console.error('Çilingirler alınamadı:', error);
        return NextResponse.json({
            success: false,
            error: 'Çilingirler yüklenirken bir hata oluştu'
        }, { status: 500 });
    }
}
