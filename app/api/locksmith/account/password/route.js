import { NextResponse } from 'next/server';
import { checkAuth } from '../../../utils';

export async function PUT(request) {
  try {
    const { supabase } = await checkAuth(request);

    const { oldPassword, newPassword } = await request.json();

    // Eksik parametreleri kontrol et
    if (!oldPassword || !newPassword) {
      return NextResponse.json({ 
        error: 'Mevcut şifre ve yeni şifre gereklidir' 
      }, { status: 400 });
    }

    // Önce kullanıcı bilgilerini al
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ 
        error: 'Kullanıcı bulunamadı' 
      }, { status: 401 });
    }
    
    // Mevcut şifre ile giriş yapmayı dene
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: oldPassword
    });
    
    // Mevcut şifre hatalıysa
    if (signInError) {
      return NextResponse.json({ 
        error: 'Mevcut şifre doğru değil',
        details: signInError.message
      }, { status: 400 });
    }
    
    // Şifreyi güncelle
    const { data, error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (updateError) {
      return NextResponse.json({ 
        error: 'Şifre güncellenirken bir hata oluştu',
        details: updateError.message
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      message: "Şifreniz başarıyla güncellendi",
    });
  } catch (error) {
    console.error('Şifre güncelleme hatası:', error);
    return NextResponse.json({ 
      error: 'Şifre güncellenirken bir hata oluştu',
      details: error.message 
    }, { status: 500 });
  }
} 