import { NextResponse } from 'next/server';
import { checkAdminAuth } from '../../utils';


// Anahtar taleplerini listele
export async function GET(request) {
    try {
        const { supabase } = await checkAdminAuth(request);


        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') || 'all';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const searchTerm = searchParams.get('search') || '';
        const offset = (page - 1) * limit;

        // Query oluştur
        let query = supabase
            .from('key_transactions')
            .select('*, locksmiths(id,fullname, businessname,provinces(name), email, phonenumber), key_packages(id, name, keyAmount, price)', { count: 'exact' });

        // Status filtresi
        if (status !== 'all') {
            query = query.eq('status', status);
        }

        // Arama filtresi
        if (searchTerm) {
            query = query.or(`locksmiths.fullname.ilike.%${searchTerm}%,locksmiths.name.ilike.%${searchTerm}%,locksmiths.email.ilike.%${searchTerm}%,locksmiths.phonenumber.ilike.%${searchTerm}%,requestnote.ilike.%${searchTerm}%`);
        }

        // Sıralama ve sayfalama
        const { data: transactions, count, error } = await query
            .order('createdat', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) {
            console.error('Anahtar talepleri getirme hatası:', error);
            return NextResponse.json({ error: 'Talepler getirilemedi' }, { status: 500 });
        }

        return NextResponse.json({
            transactions,
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit)
        });
    } catch (error) {
        console.error('Beklenmeyen hata:', error);
        return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 });
    }
}

// Talep durumunu güncelle (onay veya red)
export async function PUT(request) {
    try {
        const { supabase } = await checkAdminAuth(request);


        const { id, status, adminNote } = await request.json();

        if (!id || !status) {
            return NextResponse.json({ error: 'Gerekli alanlar eksik' }, { status: 400 });
        }

        // Önce işlemi getir
        const { data: transaction, error: fetchError } = await supabase
            .from('key_transactions')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError) {
            console.error('İşlem bulunamadı:', fetchError);
            return NextResponse.json({ error: 'İşlem bulunamadı' }, { status: 404 });
        }

        // İşlem zaten onaylanmış veya reddedilmişse hata döndür
        if (transaction.status !== 'pending') {
            return NextResponse.json({
                error: 'Bu işlem zaten işlenmiş',
                currentStatus: transaction.status
            }, { status: 400 });
        }

        // Durum güncelleme
        const updateData = {
            status,
            adminnote: adminNote || null,
            updatedat: new Date().toISOString()
        };

        const { error: updateError } = await supabase
            .from('key_transactions')
            .update(updateData)
            .eq('id', id);

        if (updateError) {
            console.error('Durum güncelleme hatası:', updateError);
            return NextResponse.json({ error: 'Durum güncellenemedi' }, { status: 500 });
        }

        // Eğer onaylandıysa, kullanıcının anahtar bakiyesini güncelle
        if (status === 'approved') {
            const { data: keyBalance, error: balanceError } = await supabase
                .from('key_balance')
                .select('totalkeybalance')
                .eq('locksmithid', transaction.locksmithid)
                .single();

            if (balanceError) {
                console.error('Kullanıcı bakiyesi bulunamadı:', balanceError);
                return NextResponse.json({ error: 'Kullanıcı bakiyesi bulunamadı' }, { status: 500 });
            }

            const newBalance = keyBalance.totalkeybalance + transaction.keyamount;

            // Bakiyeyi güncelle
            const { error: balanceUpdateError } = await supabase
                .from('key_balance')
                .update({
                    totalkeybalance: newBalance,
                    lastupdated: new Date().toISOString()
                })
                .eq('locksmithid', transaction.locksmithid);

            if (balanceUpdateError) {
                console.error('Bakiye güncelleme hatası:', balanceUpdateError);
                return NextResponse.json({ error: 'Bakiye güncellenemedi' }, { status: 500 });
            }

            // İşlemin son bakiye bilgisini güncelle
            const { error: transactionUpdateError } = await supabase
                .from('key_transactions')
                .update({
                    balanceafter: newBalance,
                    status: 'completed'
                })
                .eq('id', id);

            if (transactionUpdateError) {
                console.error('İşlem güncelleme hatası:', transactionUpdateError);
            }
        }

        return NextResponse.json({
            success: true,
            message: status === 'approved' ? 'Talep onaylandı ve bakiye güncellendi' : 'Talep reddedildi'
        });
    } catch (error) {
        console.error('Beklenmeyen hata:', error);
        return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 });
    }
} 