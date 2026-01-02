
import React, { useState, useEffect } from 'react';
import { Sparkles, Book, Send, Camera, Megaphone, Loader2, Trophy, Award, Download, Printer, X, User } from 'lucide-react';
import { askAiTutor } from '../../services/geminiService';
import { dataService } from '../../services/supabaseService';
import { useNavigate } from "react-router-dom";

const StudentHome: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [broadcasts, setBroadcasts] = useState<any[]>([]);
  const [myAchievements, setMyAchievements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAchievement, setSelectedAchievement] = useState<any>(null);
  
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      const res = await dataService.getCurrentUserProfile();
      if (res?.profile) {
        setProfile(res.profile);
        const [bRes, achRes] = await Promise.all([
          dataService.getBroadcasts(res.profile.school_id, 'STUDENTS'),
          dataService.getMyAchievements(res.profile.id)
        ]);
        if (bRes.data) setBroadcasts(bRes.data);
        if (achRes.data) setMyAchievements(achRes.data);
      }
      setIsLoading(false);
    };
    fetch();
  }, []);

  const handleAiAsk = async () => {
    if (!aiQuery.trim()) return;
    setIsAiLoading(true);
    setAiResponse('');
    const answer = await askAiTutor(aiQuery, 'General School Subject');
    setAiResponse(answer);
    setIsAiLoading(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 pb-20">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .certificate-print-area, .certificate-print-area * { visibility: visible; }
          .certificate-print-area {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            display: flex !important;
            align-items: center;
            justify-content: center;
            background: white !important;
          }
        }
      `}</style>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-teal-500 to-teal-400 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl shadow-teal-100/20">
          <div className="relative z-10">
            <div className="flex items-center gap-6 mb-8">
               <div className="w-20 h-20 rounded-[28px] border-4 border-white/20 overflow-hidden bg-white/10 shrink-0">
                  {profile?.avatar ? (
                    <img src={profile.avatar} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><User size={32}/></div>
                  )}
               </div>
               <div>
                  <h1 className="text-3xl font-black mb-1 leading-none">Halo, {profile?.full_name?.split(' ')[0] || 'Siswa'}! 👋</h1>
                  <p className="text-white/80 font-medium uppercase text-[10px] tracking-widest">{profile?.classes?.name} • NIS {profile?.nis || '-'}</p>
               </div>
            </div>
            <p className="opacity-90 font-medium mb-10 max-w-sm leading-relaxed text-sm">Cek jadwal pelajaranmu hari ini dan pastikan sudah melakukan absensi mandiri.</p>
            <button onClick={() => navigate('/dashboard/schedule')} className="bg-white text-teal-600 px-10 py-4 rounded-2xl font-black text-sm shadow-xl hover:bg-gray-50 transition active:scale-95">Lihat Jadwal Pelajaran</button>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-12 translate-y-12"><Book size={320} /></div>
        </div>

        <div className="bg-white rounded-[40px] p-10 shadow-2xl shadow-teal-100/10 border border-gray-100 flex flex-col items-center justify-center text-center group">
          <button onClick={() => navigate('/dashboard/student-attendance')} className="w-24 h-24 rounded-[32px] bg-orange-100 flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all shadow-xl shadow-orange-100">
             <Camera size={40} />
          </button>
          <h3 className="font-black text-dark text-xl uppercase tracking-tight">Presensi Mandiri</h3>
          <p className="text-gray-400 font-medium text-sm mt-1 leading-tight">Ambil selfie untuk memverifikasi kehadiran hari ini.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[40px] p-10 shadow-2xl shadow-teal-100/5 border border-gray-100">
             <div className="flex items-center justify-between mb-8">
                <h2 className="font-black text-xl text-dark uppercase tracking-tight flex items-center gap-3"><Trophy size={28} className="text-orange-400"/> Prestasi Saya</h2>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {myAchievements.length > 0 ? myAchievements.map(ach => (
                   <div key={ach.id} className="p-6 rounded-[32px] bg-gray-50 border border-gray-100 hover:border-primary/30 transition-all group relative overflow-hidden">
                      <div className="flex items-start justify-between mb-6">
                         <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors"><Award size={24}/></div>
                         <button onClick={() => setSelectedAchievement(ach)} className="p-3 bg-white rounded-xl text-primary shadow-sm hover:bg-primary hover:text-white transition active:scale-90"><Download size={20}/></button>
                      </div>
                      <h4 className="font-black text-dark uppercase text-sm leading-tight mb-1 truncate">{ach.title}</h4>
                      <p className="text-[10px] text-primary font-black uppercase tracking-widest leading-none">{ach.rank}</p>
                      <div className="absolute -right-6 -bottom-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity"><Trophy size={100}/></div>
                   </div>
                )) : (
                   <div className="col-span-full py-16 text-center text-gray-400 italic font-medium bg-gray-50/50 rounded-[32px] border-2 border-dashed border-gray-100">Belum ada prestasi yang tercatat dalam sistem.</div>
                )}
             </div>
          </div>

          <div className="bg-white rounded-[40px] p-10 shadow-2xl shadow-teal-100/5 border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-black text-xl text-dark uppercase tracking-tight flex items-center gap-3"><Megaphone size={24} className="text-primary"/> Pengumuman Terbaru</h2>
            </div>
            <div className="space-y-4">
              {isLoading ? <div className="py-10 text-center"><Loader2 className="animate-spin mx-auto text-primary" /></div> : broadcasts.length > 0 ? broadcasts.slice(0, 3).map((ann) => (
                <div key={ann.id} className="flex items-start gap-6 p-6 rounded-[32px] bg-gray-50 hover:bg-primary/5 transition-all border border-gray-50">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-primary shrink-0"><Megaphone size={20} /></div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-dark text-base uppercase leading-tight mb-1 truncate">{ann.title}</h4>
                    <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">{ann.content}</p>
                  </div>
                </div>
              )) : <p className="text-gray-400 italic text-center py-10 font-medium">Belum ada pengumuman sekolah saat ini.</p>}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[40px] p-8 shadow-2xl shadow-teal-100/5 border border-gray-100 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-lg shadow-indigo-100"><Sparkles size={20} /></div>
            <h2 className="font-black text-xl text-dark uppercase tracking-tight">AI Tutor</h2>
          </div>
          <div className="flex-1 bg-gray-50 rounded-[32px] p-6 mb-6 overflow-y-auto max-h-[400px] custom-scrollbar">
            {aiResponse ? (
              <div className="prose prose-sm text-gray-700 leading-relaxed font-medium"><p>{aiResponse}</p></div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center gap-4 opacity-40 py-10">
                 <Sparkles size={48} className="text-indigo-400" />
                 <p className="text-gray-400 text-xs font-bold uppercase tracking-widest leading-relaxed">Tanya AI mengenai tugas <br/> atau materi belajarmu hari ini!</p>
              </div>
            )}
            {isAiLoading && (
              <div className="flex items-center justify-center mt-6 space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></div>
              </div>
            )}
          </div>
          <div className="relative">
            <input 
              type="text" 
              value={aiQuery} 
              onChange={(e) => setAiQuery(e.target.value)} 
              placeholder="Tulis pertanyaanmu di sini..." 
              className="w-full bg-gray-100 border-none rounded-2xl py-5 pl-6 pr-14 text-sm font-bold focus:ring-2 focus:ring-primary focus:bg-white transition shadow-inner" 
              onKeyDown={(e) => e.key === 'Enter' && handleAiAsk()} 
            />
            <button onClick={handleAiAsk} className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-primary text-white rounded-xl hover:bg-teal-600 transition shadow-lg active:scale-90"><Send size={18} /></button>
          </div>
        </div>
      </div>

      {/* Certificate Preview Modal */}
      {selectedAchievement && (
        <div className="fixed inset-0 bg-black/90 z-[150] flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto no-print">
           <div className="max-w-5xl w-full">
              <div className="flex justify-between items-center mb-6 no-print">
                 <h2 className="text-white font-black text-2xl uppercase flex items-center gap-3"><Award size={28}/> Piagam Penghargaan Digital</h2>
                 <div className="flex gap-4">
                    <button onClick={() => window.print()} className="bg-primary text-white px-10 py-4 rounded-2xl font-black shadow-2xl flex items-center gap-2 hover:bg-teal-600 transition active:scale-95"><Printer size={20}/> Download PDF</button>
                    <button onClick={() => setSelectedAchievement(null)} className="p-4 bg-white/10 text-white rounded-full hover:bg-white/20 transition"><X size={24}/></button>
                 </div>
              </div>

              <div className="bg-white p-4 md:p-12 shadow-2xl relative certificate-print-area aspect-[1.414/1] overflow-hidden flex items-center justify-center">
                 <div className="absolute inset-4 border-[12px] border-double border-teal-800 pointer-events-none"></div>
                 <div className="absolute inset-10 border-[1px] border-teal-800 pointer-events-none"></div>
                 
                 <div className="relative z-10 w-full max-w-3xl text-center space-y-6">
                    <div className="flex flex-col items-center gap-4">
                       <div className="p-4 border-2 border-teal-900/20 rounded-2xl bg-white shadow-sm">
                          <img src={selectedAchievement.schools?.logo || "https://i.pinimg.com/736x/e4/fc/df/e4fcdfa9937a726e285649eb54615769.jpg"} className="w-16 h-16 object-contain" />
                       </div>
                       <h4 className="text-teal-900 font-black text-sm uppercase tracking-[0.3em]">{selectedAchievement.schools?.name}</h4>
                    </div>

                    <div className="space-y-1">
                      <h1 className="text-6xl font-serif text-teal-900 italic font-bold leading-none">Piagam Penghargaan</h1>
                      <p className="text-[10px] font-black text-teal-800/60 uppercase tracking-[0.5em] mt-4">Diberikan Kepada :</p>
                    </div>
                    
                    <div className="py-4">
                      <h2 className="text-5xl font-black text-teal-950 uppercase border-b-2 border-teal-900/20 inline-block px-12 pb-2 leading-none">{profile?.full_name}</h2>
                      <p className="text-xl font-bold text-teal-900 mt-4 tracking-tight">
                        {profile?.nis || 'NIS-'} • {profile?.classes?.name || 'Kelas-'}
                      </p>
                    </div>
                    
                    <div className="max-w-2xl mx-auto space-y-4">
                      <p className="text-teal-900 text-lg leading-relaxed font-medium">
                         Atas Capaian Luar Biasa Sebagai <br/>
                         <strong className="text-3xl text-teal-950 uppercase font-black">{selectedAchievement.rank}</strong> <br/>
                         Dalam Ajang <br/>
                         <strong className="text-2xl text-teal-950 font-black tracking-tight">{selectedAchievement.title}</strong>
                      </p>
                    </div>

                    <div className="pt-10 flex justify-around items-end">
                       <div className="text-center w-64 mb-8">
                          <p className="text-[11px] text-teal-800 uppercase font-bold mb-4">{new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
                          <p className="text-[11px] text-teal-800 font-bold uppercase mb-16">Kepala Sekolah</p>
                          <div className="h-[1px] bg-teal-900/30 w-full mb-3"></div>
                          <p className="font-black text-teal-950 text-base uppercase leading-tight">{selectedAchievement.schools?.principal || "Kepala Sekolah"}</p>
                          <p className="text-[10px] text-teal-800 uppercase tracking-widest font-bold">NIP. 1928374650000</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default StudentHome;
