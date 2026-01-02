
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Layout, Palette, CreditCard, Download, Eye, Sparkles, ChevronRight, ChevronLeft, QrCode } from 'lucide-react';

const CARD_TEMPLATES = [
  { id: 't1', name: 'Modern Teal', colors: 'from-teal-600 to-primary', pattern: 'bg-white/10' },
  { id: 't2', name: 'Deep Ocean', colors: 'from-blue-700 to-blue-500', pattern: 'bg-blue-400/20' },
  { id: 't3', name: 'Sunrise Orange', colors: 'from-orange-600 to-orange-400', pattern: 'bg-white/10' },
  { id: 't4', name: 'Elegant Dark', colors: 'from-gray-900 to-gray-700', pattern: 'bg-white/5' },
  { id: 't5', name: 'Royal Purple', colors: 'from-purple-700 to-purple-500', pattern: 'bg-purple-400/20' },
  { id: 't6', name: 'Nature Green', colors: 'from-emerald-700 to-emerald-500', pattern: 'bg-white/10' },
  { id: 't7', name: 'Cherry Red', colors: 'from-rose-700 to-rose-500', pattern: 'bg-white/10' },
  { id: 't8', name: 'Cyberpunk', colors: 'from-indigo-900 to-fuchsia-600', pattern: 'bg-white/10' },
  { id: 't9', name: 'Soft Pastel', colors: 'from-pink-300 to-indigo-300', pattern: 'bg-white/20' },
  { id: 't10', name: 'Business Blue', colors: 'from-slate-800 to-blue-900', pattern: 'bg-blue-500/10' },
  { id: 't11', name: 'Classic Gold', colors: 'from-yellow-700 to-yellow-500', pattern: 'bg-black/10' },
  { id: 't12', name: 'Minimalist White', colors: 'from-gray-100 to-white', pattern: 'bg-gray-200/50', text: 'text-dark' },
  { id: 't13', name: 'Forest Dark', colors: 'from-green-950 to-green-800', pattern: 'bg-white/5' },
  { id: 't14', name: 'Sunset Glow', colors: 'from-red-600 to-yellow-500', pattern: 'bg-white/10' },
  { id: 't15', name: 'Ocean Mist', colors: 'from-cyan-600 to-blue-400', pattern: 'bg-white/20' },
  { id: 't16', name: 'Midnight', colors: 'from-black to-slate-900', pattern: 'bg-blue-500/10' },
  { id: 't17', name: 'Corporate Teal', colors: 'from-teal-800 to-teal-600', pattern: 'bg-white/10' },
  { id: 't18', name: 'Berry Mix', colors: 'from-purple-800 to-rose-600', pattern: 'bg-white/10' }
];

const CardGenerator: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [side, setSide] = useState<'front' | 'back'>('front');

  const dummyStudent = {
    full_name: 'Clarisa Putri',
    nis: '202401099',
    class: 'X IPA 1',
    avatar: 'https://i.pinimg.com/736x/c2/ec/95/c2ec953ef952d591b2b8ae0d98f59e96.jpg',
    school_name: 'SMA CENDIKIA CEMERLANG'
  };

  const currentTemplate = CARD_TEMPLATES[selectedIdx];

  const FrontCard = () => (
    <div className={`w-full h-full bg-gradient-to-br ${currentTemplate.colors} ${currentTemplate.text || 'text-white'} p-6 relative overflow-hidden flex flex-col shadow-2xl animate-fade-in`}>
       <div className={`absolute top-0 right-0 w-40 h-40 ${currentTemplate.pattern} rounded-full -mr-20 -mt-20 blur-2xl`}></div>
       <div className={`absolute bottom-0 left-0 w-32 h-32 ${currentTemplate.pattern} rounded-full -ml-16 -mb-16 blur-2xl`}></div>
       
       <div className="flex items-center gap-3 border-b border-white/20 pb-4 mb-4 z-10">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1 shadow-sm">
             <span className="text-primary font-black text-xl">S</span>
          </div>
          <div className="min-w-0">
             <h2 className="font-extrabold text-[12px] uppercase leading-tight truncate">{dummyStudent.school_name}</h2>
             <p className="text-[8px] opacity-80 uppercase tracking-widest">Digital Student ID Card</p>
          </div>
       </div>

       <div className="flex-1 flex gap-5 items-center z-10">
          <div className="w-1/3 aspect-[3/4] border-4 border-white shadow-xl rounded-2xl overflow-hidden shrink-0 bg-gray-200">
             <img src={dummyStudent.avatar} className="w-full h-full object-cover" alt="Student" />
          </div>
          <div className="flex-1 min-w-0">
             <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Nama Siswa</p>
             <h3 className="text-2xl font-black uppercase leading-none mb-4 truncate tracking-tighter">{dummyStudent.full_name}</h3>
             
             <div className="space-y-3">
                <div className="flex flex-col">
                   <span className="text-[8px] font-bold uppercase opacity-60">NIS / ID</span>
                   <span className="text-sm font-mono font-bold tracking-widest">{dummyStudent.nis}</span>
                </div>
                <div className="flex flex-col">
                   <span className="text-[8px] font-bold uppercase opacity-60">Kelas</span>
                   <span className="text-xs font-black uppercase">{dummyStudent.class}</span>
                </div>
             </div>
          </div>
       </div>

       <div className="mt-4 flex justify-between items-end z-10">
          <div className="w-12 h-12 bg-white p-1 rounded-lg">
             <QrCode className="w-full h-full text-dark" />
          </div>
          <div className="text-right">
             <p className="text-[8px] font-black uppercase tracking-tighter italic opacity-40">System Powered by SiswaCerdas.id</p>
          </div>
       </div>
    </div>
  );

  const BackCard = () => (
    <div className="w-full h-full bg-white text-dark p-8 relative flex flex-col shadow-2xl animate-fade-in border-2 border-gray-100">
       <div className={`absolute top-0 right-0 w-full h-2 bg-gradient-to-r ${currentTemplate.colors}`}></div>
       <div className="flex-1">
          <h4 className="font-black text-sm uppercase mb-4 border-b pb-2">Ketentuan & Tata Tertib</h4>
          <ul className="space-y-2 text-[10px] text-gray-500 font-medium">
             <li className="flex gap-2"><span>1.</span> Kartu ini wajib dibawa selama berada di lingkungan sekolah.</li>
             <li className="flex gap-2"><span>2.</span> Digunakan untuk presensi, perpustakaan, dan ujian online.</li>
             <li className="flex gap-2"><span>3.</span> Penyalahgunaan kartu akan dikenakan sanksi disiplin.</li>
             <li className="flex gap-2"><span>4.</span> Jika menemukan kartu ini, harap kembalikan ke kantor TU.</li>
          </ul>
       </div>
       <div className="flex justify-between items-end">
          <div className="text-center w-32 border-t pt-2">
             <p className="text-[8px] font-bold uppercase">{dummyStudent.full_name}</p>
             <p className="text-[6px] text-gray-400">Pemegang Kartu</p>
          </div>
          <div className="text-center w-32 border-t pt-2">
             <p className="text-[8px] font-bold uppercase">H. Ahmad Baidowi, M.Pd</p>
             <p className="text-[6px] text-gray-400">Kepala Sekolah</p>
          </div>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fffcf8]">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-20">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            
            <div className="space-y-10">
               <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest">
                  <Sparkles size={16} /> Showcase Desain Kartu
               </div>
               <h1 className="text-5xl lg:text-7xl font-black text-dark tracking-tighter leading-[0.9]">
                  18 Pilihan <br/> Desain <span className="text-primary italic">Eksklusif</span>
               </h1>
               <p className="text-gray-500 text-lg max-w-lg font-medium leading-relaxed">
                  Pilih dari 18 template premium yang dapat disesuaikan dengan identitas sekolah Anda. Semua kartu terintegrasi dengan QR Code Smart Access.
               </p>

               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                     <div className="w-10 h-10 bg-orange-50 text-secondary rounded-xl flex items-center justify-center mb-3"><Layout size={20}/></div>
                     <p className="font-black text-dark text-sm uppercase tracking-tight">Layout Beragam</p>
                     <p className="text-xs text-gray-400 mt-1">Sesuai standar ID-Card Internasional.</p>
                  </div>
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                     <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center mb-3"><Palette size={20}/></div>
                     <p className="font-black text-dark text-sm uppercase tracking-tight">Warna Sekolah</p>
                     <p className="text-xs text-gray-400 mt-1">Sesuaikan dengan palet warna brand.</p>
                  </div>
               </div>
            </div>

            <div className="relative group">
               {/* Template Navigation */}
               <div className="absolute top-1/2 -left-12 -translate-y-1/2 z-20 flex flex-col gap-4 no-print">
                  <button onClick={() => setSelectedIdx(p => (p - 1 + CARD_TEMPLATES.length) % CARD_TEMPLATES.length)} className="w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-dark hover:bg-primary hover:text-white transition active:scale-90 border border-gray-100"><ChevronLeft size={24}/></button>
                  <button onClick={() => setSelectedIdx(p => (p + 1) % CARD_TEMPLATES.length)} className="w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-dark hover:bg-primary hover:text-white transition active:scale-90 border border-gray-100"><ChevronRight size={24}/></button>
               </div>

               <div className="bg-white p-10 rounded-[60px] shadow-2xl border border-gray-100 relative">
                  <div className="flex gap-2 mb-10 bg-gray-50 p-1 rounded-2xl w-max mx-auto">
                     <button onClick={() => setSide('front')} className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${side === 'front' ? 'bg-white text-primary shadow-sm' : 'text-gray-400'}`}>Tampak Depan</button>
                     <button onClick={() => setSide('back')} className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${side === 'back' ? 'bg-white text-primary shadow-sm' : 'text-gray-400'}`}>Tampak Belakang</button>
                  </div>

                  <div className="aspect-[86/54] w-full max-w-md mx-auto rounded-[32px] overflow-hidden">
                     {side === 'front' ? <FrontCard /> : <BackCard />}
                  </div>

                  <div className="mt-10 text-center">
                     <h4 className="font-black text-dark text-xl uppercase">{currentTemplate.name}</h4>
                     <p className="text-gray-400 text-sm font-medium">Template #{selectedIdx + 1} dari {CARD_TEMPLATES.length}</p>
                  </div>
               </div>
               
               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-100 rounded-full blur-3xl -z-10 opacity-50"></div>
            </div>

         </div>
      </div>
    </div>
  );
};

export default CardGenerator;
