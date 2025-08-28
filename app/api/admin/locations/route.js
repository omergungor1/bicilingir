import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// Lokasyon verilerini getirme
export async function GET(request) {
    try {
        const cookieStore = await cookies()
        const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
        const { searchParams } = new URL(request.url)
        const type = searchParams.get('type') // provinces, districts, neighborhoods
        const provinceId = searchParams.get('province_id')
        const districtId = searchParams.get('district_id')

        // Auth kontrolü
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
        }

        // Admin kontrolü
        const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .single()

        if (roleData?.role !== 'admin') {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 })
        }

        let data, error

        switch (type) {
            case 'provinces':
                ({ data, error } = await supabase
                    .from('provinces')
                    .select('id, name, slug')
                    .order('name'))
                break

            case 'districts':
                if (!provinceId) {
                    return NextResponse.json({ error: 'province_id gerekli' }, { status: 400 })
                }
                ({ data, error } = await supabase
                    .from('districts')
                    .select('id, name, slug')
                    .eq('province_id', provinceId)
                    .order('name'))
                break

            case 'neighborhoods':
                if (!districtId) {
                    return NextResponse.json({ error: 'district_id gerekli' }, { status: 400 })
                }
                ({ data, error } = await supabase
                    .from('neighborhoods')
                    .select('id, name, slug')
                    .eq('district_id', districtId)
                    .order('name'))
                break

            default:
                return NextResponse.json({ error: 'Geçersiz type parametresi' }, { status: 400 })
        }

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ [type]: data })

    } catch (error) {
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
    }
}
