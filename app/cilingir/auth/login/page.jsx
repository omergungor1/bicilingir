"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { useToast } from "../../../../components/ToastContext";
import Image from "next/image";

export default function CilingirLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  
  // Toast hook'unu kullan
  const { showToast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // API çağrısını simüle et
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Giriş başarılı olduğunda
      if (formData.email && formData.password) {
        showToast("Giriş başarılı! Yönlendiriliyorsunuz...", "success");
        // Yönlendirme işlemi
        setTimeout(() => {
          window.location.href = "/cilingir";
        }, 1000);
      } else {
        // Eksik bilgi varsa
        showToast("Lütfen tüm alanları doldurun.", "warning");
      }
    } catch (error) {
      // Hata durumu
      showToast("Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="flex justify-center mb-6">
            <span className="sr-only">Bi Çilingir</span>
            <Image src="/logo.png" alt="Bi Çilingir" width={60} height={60} />
          </Link>
          <h2 className="text-3xl font-extrabold text-gray-900">Çilingir Girişi</h2>
          <p className="mt-2 text-sm text-gray-600">
            Hesabınız yok mu?{" "}
            <Link href="/cilingir/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
              Hemen kayıt olun
            </Link>
          </p>
        </div>
        
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-posta
              </label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Şifre
              </label>
              <div className="mt-1">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Beni hatırla
                </label>
              </div>

              <div className="text-sm">
                <Link href="/cilingir/auth/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                  Şifremi unuttum
                </Link>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Giriş yapılıyor...
                  </span>
                ) : (
                  "Giriş Yap"
                )}
              </Button>
            </div>
          </form>
          <div className="flex flex-col space-y-4">
        
          <div className="text-xs mt-2 text-center text-gray-500">
            Giriş yaparak, Bi Çilingir'in <Link href="/terms" className="text-blue-600 hover:underline">hizmet şartlarını</Link> ve <Link href="/privacy" className="text-blue-600 hover:underline">gizlilik politikasını</Link> kabul etmiş olursunuz.
          </div>
        </div>
        </div>
      </div>
    </main>
  );
} 