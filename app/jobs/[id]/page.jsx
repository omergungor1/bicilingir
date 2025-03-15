import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const styles = {
  header: {
    background: 'linear-gradient(to right, #4169E1, #6495ED)',
    color: '#ffffff'
  },
  companyLogo: {
    width: '60px',
    height: '60px',
    backgroundColor: '#4169E1',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontWeight: 'bold',
  },
  smallCompanyLogo: {
    width: '40px',
    height: '40px',
    backgroundColor: '#4169E1',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: '12px'
  },
  jobCard: {
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    backgroundColor: '#ffffff',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  newsletterSection: {
    background: 'linear-gradient(to right, #4169E1, #6495ED)',
    color: '#ffffff',
    padding: '48px 0',
  }
};

export default async function JobDetail({ params }) {
  // Next.js 14'te params'ı await ile beklemek gerekiyor
  const id = params.id;
  
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
              <li><Link href="/" className="text-white hover:text-blue-200 transition-colors">Home</Link></li>
              <li><Link href="#" className="text-white hover:text-blue-200 transition-colors">About</Link></li>
              <li><Link href="#" className="text-white hover:text-blue-200 transition-colors">Find Job</Link></li>
              <li><Link href="#" className="text-white hover:text-blue-200 transition-colors">Subscribe</Link></li>
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

      {/* Geri Butonu */}
      <div className="container mx-auto px-4 py-4">
        <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          <span>Back</span>
        </Link>
      </div>

      {/* Ana İçerik Alanı */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Sol Bölüm - İş Detayları */}
            <div className="w-full lg:w-2/3 p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-gray-200">
              <div className="mb-6">
                <div style={styles.companyLogo} className="mb-3">
                  <span>TV</span>
                </div>
                <div className="text-gray-500 mb-1">Microsoft</div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Need Senior MERN Stack Developer</h1>
                <p className="text-gray-500">İş İlanı ID: {id}</p>
              </div>

              <div className="border-t border-gray-200 pt-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Description</h2>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Overview</h3>
                <p className="text-gray-600 mb-4">
                  We are looking for a talented Social Media Manager to join our marketing team. As a Social Media Manager, you will be responsible for developing and implementing our social media strategy to increase our online presence and improve our marketing and sales efforts. You will be working closely with the marketing and content teams to ensure brand consistency and develop engaging content for our social media platforms.
                </p>
                <p className="text-gray-600 mb-4">
                  The ideal candidate should have excellent communication skills, be creative, and have experience with social media management tools. You should be able to handle multiple projects simultaneously and work well under pressure.
                </p>
              </div>

              <div className="border-t border-gray-200 pt-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Requirements</h2>
                <ul className="list-disc pl-5 text-gray-600 space-y-2">
                  <li>4+ years experience as UI designer in SaaS or ecommerce</li>
                  <li>Proficiency in Adobe Creative Suite (Illustrator, InDesign, Photoshop)</li>
                  <li>Prototyping tools like Sketch</li>
                  <li>HTML5, CSS3, and JavaScript skills</li>
                  <li>Attention to detail and aesthetics</li>
                  <li>Communication skills</li>
                  <li>Track record of success in fast-paced environments</li>
                </ul>
              </div>

              <div className="border-t border-gray-200 pt-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Skill & Experience</h2>
                <ul className="list-disc pl-5 text-gray-600 space-y-2">
                  <li>4+ years experience as UI designer in SaaS or ecommerce</li>
                  <li>Proficiency in Adobe Creative Suite (Illustrator, InDesign, Photoshop)</li>
                  <li>Prototyping tools like Sketch</li>
                  <li>HTML5, CSS3, and JavaScript skills</li>
                  <li>Attention to detail and aesthetics</li>
                  <li>Communication skills</li>
                  <li>Track record of success in fast-paced environments</li>
                </ul>
              </div>

              <div className="border-t border-gray-200 pt-6 mb-6">
                <div className="flex items-center mb-4">
                  <span className="font-semibold text-gray-700 mr-3">Share:</span>
                  <div className="flex space-x-2">
                    <a href="#" className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                      </svg>
                    </a>
                    <a href="#" className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                      </svg>
                    </a>
                    <a href="#" className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center text-white">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                      </svg>
                    </a>
                    <a href="#" className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                      </svg>
                    </a>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="font-semibold text-gray-800 mb-1">Interested in this job?</p>
                  <p className="text-gray-500 mb-4">100 days left to apply</p>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg flex items-center">
                    Apply Now
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </Button>
                </div>
              </div>

              {/* İlgili İşler */}
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Related Jobs</h2>
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} style={styles.jobCard} className="hover:transform hover:translate-y-[-2px] hover:shadow-lg">
                      <div className="flex flex-col md:flex-row md:items-center">
                        <div className="mb-4 md:mb-0 md:mr-4">
                          <div style={styles.smallCompanyLogo}>
                            <span>TV</span>
                          </div>
                        </div>
                        
                        <div className="flex-grow">
                          <h3 className="text-lg font-bold text-gray-800 mb-1">Frontend Developer</h3>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Full Time</span>
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">$5k-$7k</span>
                            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">2 days ago</span>
                          </div>
                          <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                          </p>
                        </div>
                        
                        <div className="mt-4 md:mt-0 md:ml-4">
                          <Link href={`/jobs/${item}`} className="text-blue-600 hover:text-blue-800 flex items-center">
                            View Job
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sağ Bölüm - Özet Detaylar */}
            <div className="w-full lg:w-1/3 p-6 lg:p-8">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 mb-6">
                Apply for this position
              </Button>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Job Details</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date Posted:</span>
                    <span className="text-gray-800 font-medium">Apr 04, 2023</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Job Type:</span>
                    <span className="text-gray-800 font-medium">Full Time</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Job Role:</span>
                    <span className="text-gray-800 font-medium">Product Designer</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Salary:</span>
                    <span className="text-gray-800 font-medium">$5k - 7k</span>
                  </div>
                </div>
              </div>

              {/* Reklam Alanı */}
              <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center text-gray-500 text-center p-4">
                You can place ads 300x250
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bülten Bölümü */}
      <section style={styles.newsletterSection} className="w-full mt-12">
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
                <li><Link href="/" className="hover:text-blue-300 transition-colors">Home</Link></li>
                <li><Link href="#" className="hover:text-blue-300 transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-blue-300 transition-colors">Find Job</Link></li>
                <li><Link href="#" className="hover:text-blue-300 transition-colors">Contact</Link></li>
              </ul>
            </nav>
            
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="#" className="hover:text-blue-300 transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-blue-300 transition-colors">Privacy Policy</Link>
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