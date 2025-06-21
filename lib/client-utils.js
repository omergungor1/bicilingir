/**
 * Kullanıcıyı oluşturur veya günceller
 * @param {Object} supabase - Supabase istemci
 * @param {string} userId - Kullanıcı ID (varsa)
 * @param {string} sessionId - Oturum ID
 * @param {string} userIp - Kullanıcı IP adresi
 * @param {string} userAgent - Kullanıcı tarayıcı bilgisi
 * @param {string} fingerprintId - FingerprintJS visitor ID
 * @param {Object} locationData - Konum bilgileri (opsiyonel)
 * @returns {Promise<{userId: string, isNewUser: boolean, isSuspicious: boolean}>}
 */
export async function createOrUpdateUser(supabase, userId, sessionId, userIp, userAgent, fingerprintId = null, locationData = null) {
    try {
        const userData = {
            userIp,
            userAgent,
            fingerprintId,
            updatedAt: new Date().toISOString()
        };

        // Konum bilgileri varsa ekle
        if (locationData) {
            userData.latitude = locationData.latitude;
            userData.longitude = locationData.longitude;
            userData.location_accuracy = Math.round(locationData.accuracy);
            userData.location_source = 'browser_geolocation';
        }

        let newUserId = userId;
        let isNewUser = false;
        let isSuspicious = false;

        // Önce fingerprintId ile kullanıcıyı bul
        if (fingerprintId) {
            const { data: existingUserByFingerprint } = await supabase
                .from('users')
                .select()
                .eq('fingerprintid', fingerprintId)
                .single();

            if (existingUserByFingerprint) {
                newUserId = existingUserByFingerprint.id;
                const { error: updateError } = await supabase
                    .from('users')
                    .update(userData)
                    .eq('id', newUserId);

                if (updateError) throw updateError;
                return { userId: newUserId, isNewUser, isSuspicious };
            }
        }

        // Kullanıcı ID varsa güncelle
        if (newUserId) {
            const { error: updateError } = await supabase
                .from('users')
                .update(userData)
                .eq('id', newUserId);

            if (updateError) throw updateError;
            return { userId: newUserId, isNewUser, isSuspicious };
        }

        // IP adresi ile kullanıcıyı kontrol et
        const { data: existingUserByIp } = await supabase
            .from('users')
            .select()
            .eq('userip', userIp)
            .order('createdat', { ascending: false })
            .limit(1)
            .single();

        if (existingUserByIp) {
            newUserId = existingUserByIp.id;
            const { error: updateError } = await supabase
                .from('users')
                .update(userData)
                .eq('id', newUserId);

            if (updateError) throw updateError;
            return { userId: newUserId, isNewUser, isSuspicious };
        }

        // Yeni kullanıcı oluştur
        isNewUser = true;
        const insertData = {
            createdat: new Date().toISOString(),
            updatedat: new Date().toISOString(),
            issuspicious: isSuspicious,
            islocksmith: false,
            ...userData
        };

        const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert(insertData)
            .select()
            .single();

        if (insertError) throw insertError;
        newUserId = newUser.id;

        return { userId: newUserId, isNewUser, isSuspicious };
    } catch (error) {
        console.error('Kullanıcı oluşturma/güncelleme hatası:', error);
        throw error;
    }
} 