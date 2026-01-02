
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Play, CheckCircle, Shield, Smartphone, CreditCard, BarChart } from 'lucide-react';
// Fix: Re-writing the import to resolve "no exported member" errors
import { Link } from "react-router-dom";

const LandingPage: React.FC = () => {
  const [heroImage] = useState<string>("https://awsimages.detik.net.id/community/media/visual/2025/02/04/ilustrasi-siswa-sma_169.jpeg?w=1200");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const scrollToFeatures = () => {
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#fffcf8]">
      <Navbar />

      {/* Hero Section */}
      <header className="relative pt-12 pb-24 lg:pt-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            
            {/* Text Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-secondary rounded-full text-sm font-semibold mb-6">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                30 Days free trial
              </div>
              <h1 className="text-4xl lg:text-6xl font-extrabold text-dark leading-tight mb-6">
                Membangun Bangsa <br/> dengan <span className="relative inline-block">
                  <span className="relative z-10 text-white bg-secondary px-4 py-1 transform -rotate-2 rounded-lg inline-block">Platform</span>
                </span> <br/>
                <span className="gradient-text">Pendidikan Cerdas</span>
              </h1>
              <p className="text-gray-500 text-lg mb-8 max-w-lg mx-auto lg:mx-0">
                Solusi digital terintegrasi dengan <strong>Kartu Tanda Siswa (KTS)</strong>. Kelola presensi, ujian online, dan administrasi sekolah dalam satu genggaman.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link to="/register-school" className="px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-teal-500 transition hover:-translate-y-1 w-full sm:w-auto">
                  Mulai Sekarang
                </Link>
                <Link to="/login" className="px-8 py-4 bg-dark text-white font-bold rounded-xl shadow-lg hover:bg-gray-800 transition hover:-translate-y-1 flex items-center justify-center gap-2 w-full sm:w-auto text-center">
                   Akses Dashboard
                </Link>
                <button onClick={scrollToFeatures} className="px-8 py-4 flex items-center gap-2 text-gray-600 font-semibold hover:text-dark transition">
                  <span className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-secondary">
                    <Play size={20} fill="currentColor" />
                  </span>
                  Lihat Demo
                </button>
              </div>

              <div className="mt-10 flex items-center justify-center lg:justify-start gap-[-10px]">
                 <div className="flex -space-x-3">
                   <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://i.pinimg.com/474x/89/f5/2c/89f52c332192fac82fd0d912d3e204b2.jpg" alt="User" referrerPolicy="no-referrer" />
                   <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiDv-LjRi05qCuadGZX95WdtCpa-v5WtiaVzICghu5QsNbg6fTldbcQ_kPCLB2IMB7L0Rjzl9KpTU1bt2C6AwrNpYv3DfPl9wkh9Usnq30o0A5t9b_BgzBpu21RZptNaqxoaf-3sZZ4o5RP/s1600/mico-pasfoto-3x4.jpg" alt="User" referrerPolicy="no-referrer" />
                   <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://i.pinimg.com/originals/21/f8/58/21f8587b36f837225afd6754aacda567.jpg" alt="User" referrerPolicy="no-referrer" />
                   <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://cdn.pengajartekno.co.id/q:i/r:0/wp:1/w:400/u:https://blog.pengajartekno.co.id/wp-content/uploads/2023/03/PAS-Foto-SMA-16.jpg" alt="User" referrerPolicy="no-referrer" />
                 </div>
                 <div className="ml-4 text-left">
                   <p className="text-dark font-bold">10.000+ Siswa</p>
                   <p className="text-gray-500 text-sm">Aktif Menggunakan</p>
                 </div>
              </div>
            </div>

            {/* Hero Image / Illustration */}
            <div className="flex-1 relative mt-12 lg:mt-0 flex flex-col items-center">
              <div className="relative z-10 mx-auto w-full max-w-[500px]">
                 <div className="absolute top-10 right-0 p-4 bg-white rounded-2xl shadow-xl z-20 animate-bounce delay-700 duration-[3000ms]">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        <CheckCircle size={20} />
                     </div>
                     <div>
                       <p className="font-bold text-dark text-sm">Presensi Sukses</p>
                       <p className="text-xs text-gray-400">
                         {currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - Tepat Waktu
                       </p>
                     </div>
                   </div>
                 </div>

                 <div className="blob-shape overflow-hidden border-8 border-white shadow-2xl bg-secondary/10 relative h-[500px]">
                    <img 
                      src={heroImage} 
                      alt="Indonesian High School Student" 
                      className="w-full h-full object-cover relative z-10"
                      referrerPolicy="no-referrer"
                    />
                 </div>
              </div>
              
              <div className="absolute top-1/2 left-0 w-24 h-24 bg-primary/20 rounded-full blur-2xl -z-10"></div>
              <div className="absolute bottom-0 right-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Preview */}
      <section className="py-20 bg-white" id="features">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-secondary uppercase tracking-widest mb-2">Mengapa Siswa Cerdas?</h2>
            <h3 className="text-3xl font-bold text-dark">Fitur Unggulan Untuk Sekolah Modern</h3>
            <p className="text-gray-500 max-w-2xl mx-auto mt-4">Platform kami dirancang khusus for kebutuhan sekolah di Indonesia dengan teknologi terkini.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             <div className="p-8 rounded-3xl bg-[#fffcf8] border border-gray-100 hover:shadow-xl transition group">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                  <Smartphone size={28} />
                </div>
                <h4 className="text-xl font-bold text-dark mb-3">Smart Attendance</h4>
                <p className="text-gray-500 text-sm mb-4">Absensi menggunakan Face Recognition dan Geotagging. Notifikasi WhatsApp otomatis terkirim ke orang tua jika siswa terlambat atau tidak hadir.</p>
                <ul className="space-y-2">
                   <li className="flex items-center text-sm text-gray-600 gap-2"><CheckCircle size={14} className="text-green-500"/> Real-time WhatsApp Alert</li>
                   <li className="flex items-center text-sm text-gray-600 gap-2"><CheckCircle size={14} className="text-green-500"/> Anti-Fake GPS</li>
                </ul>
             </div>

             <div className="p-8 rounded-3xl bg-[#fffcf8] border border-gray-100 hover:shadow-xl transition group">
                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
                  <Shield size={28} />
                </div>
                <h4 className="text-xl font-bold text-dark mb-3">CBT Anti-Cheat</h4>
                <p className="text-gray-500 text-sm mb-4">Ujian berbasis komputer dengan sistem keamanan tinggi. Mendeteksi perpindahan tab, split screen, dan aktivitas mencurigakan lainnya.</p>
                 <ul className="space-y-2">
                   <li className="flex items-center text-sm text-gray-600 gap-2"><CheckCircle size={14} className="text-green-500"/> Focus Detection</li>
                   <li className="flex items-center text-sm text-gray-600 gap-2"><CheckCircle size={14} className="text-green-500"/> Timer Otomatis</li>
                </ul>
             </div>

             <div className="p-8 rounded-3xl bg-[#fffcf8] border border-gray-100 hover:shadow-xl transition group">
                <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-secondary mb-6">
                  <CreditCard size={28} />
                </div>
                <h4 className="text-xl font-bold text-dark mb-3">Integrasi Kartu Siswa</h4>
                <p className="text-gray-500 text-sm mb-4">Satu kartu untuk semua akses. Login platform, absensi QR, dan identitas siswa yang terintegrasi dengan database sekolah.</p>
                 <ul className="space-y-2">
                   <li className="flex items-center text-sm text-gray-600 gap-2"><CheckCircle size={14} className="text-green-500"/> 18 Pilihan Desain</li>
                   <li className="flex items-center text-sm text-gray-600 gap-2"><CheckCircle size={14} className="text-green-500"/> QR Code Login</li>
                </ul>
             </div>

             <div className="p-8 rounded-3xl bg-[#fffcf8] border border-gray-100 hover:shadow-xl transition group">
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-6">
                  <BarChart size={28} />
                </div>
                <h4 className="text-xl font-bold text-dark mb-3">Laporan Akademik</h4>
                <p className="text-gray-500 text-sm mb-4">Pantau perkembangan siswa dengan grafik analitik. Nilai ujian, kehadiran, dan kedisiplinan terekam rapi.</p>
             </div>

             <div className="p-8 rounded-3xl bg-[#fffcf8] border border-gray-100 hover:shadow-xl transition group">
                <div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-600 mb-6">
                  <Smartphone size={28} />
                </div>
                <h4 className="text-xl font-bold text-dark mb-3">Mobile Friendly</h4>
                <p className="text-gray-500 text-sm mb-4">Akses platform dari mana saja menggunakan Smartphone, Tablet, atau Laptop dengan tampilan yang responsif.</p>
             </div>

              <div className="p-8 rounded-3xl bg-primary text-white shadow-xl transition group flex flex-col justify-center items-center text-center">
                <h4 className="text-2xl font-bold mb-3">Coba Gratis Sekarang</h4>
                <p className="text-white/80 text-sm mb-6">Rasakan kemudahan mengelola sekolah dengan Siswa Cerdas.</p>
                <Link to="/register-school" className="px-6 py-3 bg-white text-primary font-bold rounded-xl hover:bg-gray-100 transition w-full">
                  Daftar Sekolah
                </Link>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
