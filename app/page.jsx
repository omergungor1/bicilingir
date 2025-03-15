import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const styles = {
  header: {
    background: 'linear-gradient(to right, #4169E1, #6495ED)',
    color: '#ffffff'
  },
  heroSection: {
    background: 'linear-gradient(to right, #4169E1, #6495ED)',
    color: '#ffffff'
  },
  accentButton: {
    backgroundColor: '#6495ED',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 16px',
    fontWeight: 'bold',
  },
  jobCard: {
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    backgroundColor: '#ffffff',
  },
  companyLogo: {
    width: '50px',
    height: '50px',
    backgroundColor: '#4169E1',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontWeight: 'bold',
  },
  newsletterSection: {
    background: 'linear-gradient(to right, #4169E1, #6495ED)',
    color: '#ffffff',
    padding: '48px 0',
  }
};

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Header Bölümü */}
      <header style={styles.header} className="w-full text-white">
        <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between">
          {/* Logo */}
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-10 h-10 mr-2 bg-white rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.65 10A5.99 5.99 0 0 0 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6a5.99 5.99 0 0 0 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">Bi Çilingir</span>
          </div>

          {/* Navbar - Orta */}
          <nav className="flex mb-4 md:mb-0">
            <ul className="flex space-x-6">
              <li><a href="#" className="text-white hover:text-blue-200 transition-colors">Home</a></li>
              <li><a href="#" className="text-white hover:text-blue-200 transition-colors">About</a></li>
              <li><a href="#" className="text-white hover:text-blue-200 transition-colors">Find Job</a></li>
              <li><a href="#" className="text-white hover:text-blue-200 transition-colors">Subscribe</a></li>
            </ul>
          </nav>

          {/* Aksiyon Butonu - Sağ */}
          <div>
            <Button className="bg-blue-400 hover:bg-blue-500 text-white font-bold">
              Post a Job
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Bölümü */}
      <section style={styles.heroSection} className="w-full py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Ultimate Job Search Companion</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Are you looking for the perfect job or the ideal candidate? Find your dream job with thousands of job postings across industries.
          </p>
          
          {/* Arama Çubuğu */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex gap-2 justify-center items-center shadow-lg">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <Input 
                  type="text" 
                  placeholder="Adresinizi giriniz" 
                  className="pl-10 py-3 h-12 bg-white text-gray-800 rounded-l-lg w-full"
                />
              </div>
              <Button className="bg-blue-600 h-12 hover:bg-blue-700 cursor-pointer text-white font-bold py-3 px-6 rounded-r-lg">
                Ara
              </Button>
            </div>
          </div>
          
          <p className="text-lg mb-8">1,000+ Çilingir</p>
          
          {/* Şirket Logoları Carousel */}
          <div className="flex items-center justify-center space-x-8 mt-8">
            <button className="text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            
            <div className="flex space-x-8">
              <div className="bg-white p-3 rounded-lg">
                <span className="font-bold text-blue-600">Microsoft</span>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <span className="font-bold text-blue-600">Bidlet.com</span>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <span className="font-bold text-blue-600">Alliance</span>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <span className="font-bold text-blue-600">Google</span>
              </div>
            </div>
            
            <button className="text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* İş İlanları Bölümü */}
      <section className="w-full bg-gray-50 py-16 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Latest Jobs</h2>
            <span className="text-gray-500">2,645 found</span>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sol Sidebar - Filtreler */}
            <div className="w-full md:w-1/4">
              <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <h3 className="text-lg font-bold mb-4 text-gray-800">Job Type</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Checkbox id="fulltime" />
                    <label htmlFor="fulltime" className="ml-2 text-gray-700">Full Time</label>
                  </div>
                  
                  <div className="flex items-center">
                    <Checkbox id="parttime" />
                    <label htmlFor="parttime" className="ml-2 text-gray-700">Part Time</label>
                  </div>
                  
                  <div className="flex items-center">
                    <Checkbox id="remote" />
                    <label htmlFor="remote" className="ml-2 text-gray-700">Remote</label>
                  </div>
                  
                  <div className="flex items-center">
                    <Checkbox id="internship" />
                    <label htmlFor="internship" className="ml-2 text-gray-700">Internship</label>
                  </div>
                </div>
                
                <Button className="mt-4 w-full bg-white text-blue-600 border border-blue-600 hover:bg-blue-50">
                  Clear
                </Button>
              </div>
              
              {/* Reklam Alanı */}
              <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Advertisement</span>
              </div>
            </div>
            
            {/* İş İlanları Listesi */}
            <div className="w-full md:w-3/4">
              <div className="space-y-4">
                {/* İş İlanı Kartı 1 */}
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                  <div key={item} style={styles.jobCard}>
                    <div className="flex flex-col md:flex-row md:items-center">
                      <div className="mb-4 md:mb-0 md:mr-4">
                        <div style={styles.companyLogo}>
                          <span>TV</span>
                        </div>
                      </div>
                      
                      <div className="flex-grow">
                        <h3 className="text-xl font-bold text-gray-800 mb-1">Need Senior MERN Stack Developer</h3>
                        <p className="text-gray-600 mb-2">Microsoft</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Full Time</span>
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">$8k-$7k</span>
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">12 hours ago</span>
                        </div>
                        <p className="text-gray-500 text-sm mb-3">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                      </div>
                      
                      <div className="mt-4 md:mt-0 md:ml-4">
                        <Button className="bg-white text-blue-600 border border-blue-600 hover:bg-blue-50">
                          <Link href={`/jobs/${item}`} className="flex items-center">
                            View Job
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3">
                  SEE ALL JOBS
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bülten Bölümü */}
      <section style={styles.newsletterSection} className="w-full">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Subscribe Newsletter</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Sign up to our newsletter to get $10 off your first order, as well as news of our latest offers and product releases.
          </p>
          
          <div className="max-w-md mx-auto flex">
            <Input 
              type="email" 
              placeholder="Your email address" 
              className="bg-white text-gray-800 rounded-l-lg w-full"
            />
            <Button className="bg-white text-blue-600 font-bold py-2 px-6 rounded-r-lg">
              SUBSCRIBE
            </Button>
          </div>
        </div>
      </section>

      {/* Footer Bölümü */}
      <footer className="w-full bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-10 h-10 mr-2 bg-white rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.65 10A5.99 5.99 0 0 0 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6a5.99 5.99 0 0 0 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
                </svg>
              </div>
              <span className="text-xl font-bold">Bi Çilingir</span>
            </div>
            
            <nav>
              <ul className="flex flex-wrap justify-center gap-6">
                <li><a href="#" className="hover:text-blue-300 transition-colors">Home</a></li>
                <li><a href="#" className="hover:text-blue-300 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-blue-300 transition-colors">Find Job</a></li>
                <li><a href="#" className="hover:text-blue-300 transition-colors">Contact</a></li>
              </ul>
            </nav>
            
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-blue-300 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-blue-300 transition-colors">Privacy Policy</a>
            </div>
          </div>
          
          <div className="text-center text-gray-400 text-sm">
            <p>© 2023 JS Template. All Right Reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
} 