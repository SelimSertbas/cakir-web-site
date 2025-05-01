import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Facebook, Instagram, Youtube, Twitter, Music } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-16">
        <div className="container-content">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-coffee-900 dark:text-coffee-100 mb-6">
            Hakkımda
          </h1>
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="md:w-1/3">
              <img 
                src="/lovable-uploads/14f96f6a-555f-4f61-a62e-21b4e346c9c7.png" 
                alt="Ahmet Çakır" 
                className="rounded-lg shadow-md w-full h-auto mb-6" 
              />
              
              <div className="bg-coffee-50 dark:bg-coffee-800/40 rounded-lg p-6 border border-coffee-100 dark:border-coffee-700">
                <h3 className="font-serif text-xl font-medium text-coffee-800 dark:text-coffee-200 mb-4">İletişim</h3>
                <ul className="space-y-4 text-coffee-700 dark:text-coffee-300">
                  <li>
                    <span className="font-medium mb-2 block">Sosyal Medya:</span>
                    <div className="flex space-x-4">
                      <a 
                        href="https://www.facebook.com/profile.php?id=61563547570013" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-coffee-600 hover:text-coffee-900 dark:text-coffee-400 dark:hover:text-coffee-200 transition-colors flex items-center gap-2"
                      >
                        <Facebook className="h-5 w-5" />
                        <span>Facebook</span>
                      </a>
                    </div>
                    <div className="flex space-x-4 mt-2">
                      <a 
                        href="https://www.instagram.com/ahmetcakirresmi/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-coffee-600 hover:text-coffee-900 dark:text-coffee-400 dark:hover:text-coffee-200 transition-colors flex items-center gap-2"
                      >
                        <Instagram className="h-5 w-5" />
                        <span>Instagram</span>
                      </a>
                    </div>
                    <div className="flex space-x-4 mt-2">
                      <a 
                        href="https://x.com/ahmedcakirrr?s=21" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-coffee-600 hover:text-coffee-900 dark:text-coffee-400 dark:hover:text-coffee-200 transition-colors flex items-center gap-2"
                      >
                        <Twitter className="h-5 w-5" />
                        <span>X (Twitter)</span>
                      </a>
                    </div>
                    <div className="flex space-x-4 mt-2">
                      <a 
                        href="https://www.tiktok.com/@ahmetcakirresmi?lang=tr-TR" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-coffee-600 hover:text-coffee-900 dark:text-coffee-400 dark:hover:text-coffee-200 transition-colors flex items-center gap-2"
                      >
                        <Music className="h-5 w-5" />
                        <span>TikTok</span>
                      </a>
                    </div>
                    <div className="flex space-x-4 mt-2">
                      <a 
                        href="https://www.youtube.com/@ahmedcakirresmi" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-coffee-600 hover:text-coffee-900 dark:text-coffee-400 dark:hover:text-coffee-200 transition-colors flex items-center gap-2"
                      >
                        <Youtube className="h-5 w-5" />
                        <span>YouTube</span>
                      </a>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="md:w-2/3 prose dark:prose-invert">
              <p className="dark:text-white/90">
                Ahmet Çakır, 2005 yılında İstanbul'un Pendik ilçesinde dünyaya geldi. Aslen Trabzon Sürmenelidir.
                Türk Kızılayı Kartal Anadolu Lisesi'nden mezun olduktan sonra eğitim hayatına İstanbul Medeniyet Üniversitesi 
                Tarih Bölümü'nde devam etmektedir.
              </p>
              
              <p className="dark:text-white/90">
                Genç yaşına rağmen çeşitli gazete ve dergilerde köşe yazarlığı yapmış olup, şu anda 
                Mergen Haber'de yazarlığa devam etmektedir. Tarih ve edebiyat alanlarında YouTube ve 
                Instagram gibi platformlarda içerik üretimi de sürdürmektedir.
              </p>
              
              <h2 className="dark:text-white/95">Eğitim</h2>
              <ul className="dark:text-white/85">
                <li>İstanbul Medeniyet Üniversitesi, Tarih Bölümü - (Devam Ediyor)</li>
                <li>Türk Kızılayı Kartal Anadolu Lisesi - (Mezun)</li>
              </ul>
              
              <h2 className="dark:text-white/95">Çalışmalar</h2>
              <p className="dark:text-white/90">
                Akademik ilgileri arasında Genel Türk Tarihi ve Avrupa Tarihi yer almaktadır. Aynı zamanda Orta Çağ üzerine de çalışmalar yapmaktadır.
              </p>
              
              <p className="dark:text-white/90">
                Yazdığı makaleler ve köşe yazılarında tarihsel olayları tarihçi kimliğinin sunduğu bakış açısıyla, bir metodoloji içerisinde objektif bir şekilde ele almaktadır. Aynı zamanda geçmişin anlaşılmasının, bugünün sorunlarına çözüm bulunmasında nasıl yardımcı olabileceğini araştırmaktadır.
              </p>
              
              <h2 className="dark:text-white/95">İçerik Üretimi</h2>
              <p className="dark:text-white/90">
                Sosyal medya platformlarında hazırladığı içeriklerle tarihi ve edebi konuları geniş kitlelere 
                ulaştırmayı amaçlamaktadır. YouTube kanalında tarihsel olaylar ve kişilikler hakkında belgesel 
                tadında videolar hazırlarken, Instagram hesabında daha kısa ve özlü bilgileri paylaşmaktadır.
              </p>
              
              <p className="dark:text-white/90">
                Özellikle gençlerin tarih bilincini geliştirmeyi ve kültürel mirasımıza sahip çıkmayı teşvik 
                eden içerikler üretmeyi kendine misyon edinmiştir.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
