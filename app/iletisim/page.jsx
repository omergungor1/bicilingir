"use client";

import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { formatPhoneNumber } from "../../lib/utils";
import SearchForm from "../../components/SearchForm";
import Hero from "../../components/Hero";

export default function Iletisim() {
  const [formData, setFormData] = useState({
    type: "customer", // müşteri veya çilingir
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    preferredContact: "phone",
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Hata mesajını temizle
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Ad Soyad alanı zorunludur";
    }
    
    if (!formData.preferredContact) {
      newErrors.preferredContact = "Lütfen bir iletişim şekli seçin";
    }
    
    if (formData.preferredContact === "phone" && !formData.phone.trim()) {
      newErrors.phone = "Telefon numarası zorunludur";
    } else if (formData.preferredContact === "phone" && formData.phone.length < 11) {
      newErrors.phone = "Geçerli bir telefon numarası giriniz";
    }
    
    if (formData.preferredContact === "email" && !formData.email.trim()) {
      newErrors.email = "E-posta adresi zorunludur";
    } else if (formData.preferredContact === "email" && !isValidEmail(formData.email)) {
      newErrors.email = "Geçerli bir e-posta adresi giriniz";
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = "Konu alanı zorunludur";
    }
    
    if (!formData.message.trim()) {
      newErrors.message = "Mesaj alanı zorunludur";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // API çağrısı simülasyonu
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Başarılı
      setSubmitSuccess(true);
      setFormData({
        type: "customer",
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        preferredContact: "phone",
      });
      
      // 5 saniye sonra başarı mesajını kaldır
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
      
    } catch (error) {
      console.error("Gönderim hatası:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Hero Bölümü */}
      <Hero 
        title="Bizimle İletişime Geçin" 
        description="Sorularınız, önerileriniz veya herhangi bir konuda yardım için bizimle iletişime geçebilirsiniz. En kısa sürede size geri dönüş yapacağız."
       />
    <div className="container mx-auto pb-16 pt-16 px-4">
      
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sol Taraf - İletişim Formu */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md p-8">
            {submitSuccess ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">
                <strong className="font-bold">Teşekkürler!</strong>
                <span className="block sm:inline"> Mesajınız başarıyla gönderildi. En kısa sürede size geri dönüş yapacağız.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <div className="flex space-x-4 mb-6">
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="customer" 
                        name="type" 
                        value="customer" 
                        checked={formData.type === "customer"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <label htmlFor="customer" className="text-gray-700">Müşteriyim</label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="locksmith" 
                        name="type" 
                        value="locksmith" 
                        checked={formData.type === "locksmith"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <label htmlFor="locksmith" className="text-gray-700">Çilingirim</label>
                    </div>
                  </div>
                
                  <div>
                    <div>
                      <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Ad Soyad *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Adınız ve soyadınız"
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                  </div>
                
                  <div className="flex flex-col gap-6 mt-6">
                    <div className="flex md:flex-row flex-col md:items-center gap-4">
                      <label className="block text-gray-700 font-medium">Tercih Edilen İletişim Şekli: </label>
                      <div className="flex space-x-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="preferredContact"
                            value="phone"
                            checked={formData.preferredContact === "phone"}
                            onChange={handleChange}
                            className="form-radio text-blue-600"
                          />
                          <span className="text-gray-700">Telefon</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="preferredContact"
                            value="email"
                            checked={formData.preferredContact === "email"}
                            onChange={handleChange}
                            className="form-radio text-blue-600"
                          />
                          <span className="text-gray-700">E-posta</span>
                        </label>
                      </div>
                      {errors.preferredContact && <p className="text-red-500 text-sm mt-1">{errors.preferredContact}</p>}
                    </div>
                    <div>
                      <div className={`${formData.preferredContact !== "phone" ? 'hidden' : ''}`}>
                        <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Telefon *</label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formatPhoneNumber(formData.phone)}
                          onChange={(e) => {
                            // Sadece rakam girişine izin ver
                            const newValue = e.target.value.replace(/[^0-9]/g, '');
                            // Maksimum 11 karakter (0599 999 99 99 formatı için)
                            if (newValue.length <= 11) {
                              setFormData({ ...formData, phone: newValue });
                            }
                          }}
                          className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${formData.preferredContact === "email" ? 'opacity-50 cursor-not-allowed' : ''}`}
                          placeholder="05XX XXX XX XX"
                          maxLength={14}
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                      </div>

                      <div className={`${formData.preferredContact !== "email" ? 'hidden' : ''}`}>
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">E-posta *</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'} ${formData.preferredContact === "phone" ? 'opacity-50 cursor-not-allowed' : ''}`}
                          placeholder="ornek@mail.com"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                      </div>
                    </div>
                  </div>
                </div>
                
              

                <div className="mb-6">
                  <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Mesajınız *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Mesajınızı buraya yazın..."
                  ></textarea>
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                </div>
                
                <div>
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Gönderiliyor...
                      </span>
                    ) : "Mesajı Gönder"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
        
        {/* Sağ Taraf - İletişim Bilgileri */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-xl font-bold mb-6 text-gray-800">İletişim Bilgilerimiz</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-gray-700 font-medium">Telefon</h3>
                  <p className="text-gray-600">+90 (212) 123 45 67</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-gray-700 font-medium">E-posta</h3>
                  <p className="text-gray-600">info@bicilingir.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-gray-700 font-medium">Adres</h3>
                  <p className="text-gray-600">
                    Bağdat Caddesi No:123<br />
                    Kadıköy, İstanbul<br />
                    Türkiye
                  </p>
                </div>
              </div>
            
            <div className="mt-8">
              <h3 className="text-gray-700 font-medium mb-4">Bizi Takip Edin</h3>
              <div className="flex space-x-4">
                <a href="#" className="bg-blue-100 p-3 rounded-full text-blue-600 hover:bg-blue-200 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </a>
                <a href="#" className="bg-blue-100 p-3 rounded-full text-blue-600 hover:bg-blue-200 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </main>
  );        
}