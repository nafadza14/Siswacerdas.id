
import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Award, Plus, X, Save, Image as ImageIcon, Printer, Loader2, Trash2 } from 'lucide-react';
import { dataService, stringifyError } from '../../services/supabaseService';
import { UserRole } from '../../types';

const AchievementManager: React.FC = () => {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [schoolInfo, setSchoolInfo] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<any>(null);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    student_id: '',
    title: '',
    category: 'Akademik',
    level: 'Sekolah',
    rank: 'Juara 1',
    achievement_date: new Date().toISOString().split('T')[0],
    description: '',
    proof_image: ''
  });

  const loadData = async () => {
    setIsLoading(true);
    const res = await dataService.getCurrentUserProfile();
    if (res?.profile) {
      setSchoolInfo(res.profile.schools || res.profile);
      const schoolId = res.profile.school_id;
      
      const [achRes, stdRes] = await Promise.all([
        dataService.getAchievements(schoolId),
        dataService.getProfilesBySchool(schoolId, UserRole.STUDENT)
      ]);
      
      if (achRes.data) setAchievements(achRes.data);
      if (stdRes.data) setStudents(stdRes.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, proof_image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolInfo?.id) return;
    setIsSubmitting(true);

    const payload = {
      ...formData,
      school_id: schoolInfo.id
    };

    const { error } = await dataService.addAchievement(payload);
    if (error) {
      alert(stringifyError(error));
    } else {
      setIsModalOpen(false);
      setFormData({
        student_id: '', title: '', category: 'Akademik', level: 'Sekolah',
        rank: 'Juara 1', achievement_date: new Date().toISOString().split('T')[0],
        description: '', proof_image: ''
      });
      await loadData();
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Hapus data prestasi ini?')) {
      await dataService.deleteAchievement(id);
      await loadData();
    }
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  const openCertificate = (item: any) => {
    setSelectedAchievement(item);
    setIsCertModalOpen(true);
  };

  if (isLoading) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-primary" size={48} /></div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
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
            padding: 0 !important;
            margin: 0 !important;
          }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-dark tracking-tight uppercase">Database Prestasi Siswa</h1>
          <p className="text-gray-500 font-medium">Rekam jejak capaian dan penghargaan siswa sekolah.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-teal-100 hover:bg-teal-600 transition flex items-center gap-2 active:scale-95"
        >
          {/* Fixed invalid JSX prop syntax: size(20) -> size={20} */}
          <Plus size={20} /> Tambah Prestasi Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {achievements.length > 0 ? achievements.map(ac => (
           <div key={ac.id} className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden flex flex-col">
              <div className="flex justify-between items-start mb-6">
                 <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
                    <Trophy size={32} />
                 </div>
                 <div className="flex gap-1">
                    <button onClick={() => openCertificate(ac)} className="p-2 text-gray-300 hover:text-primary hover:bg-primary/5 rounded-xl transition" title="Generate Sertifikat"><Award size={18}/></button>
                    <button onClick={() => handleDelete(ac.id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition"><Trash2 size={18}/></button>
                 </div>
              </div>
              
              <div className="flex-1">
                 <div className="flex gap-2 mb-3">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-lg text-gray-500">{ac.category}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-orange-100 px-3 py-1 rounded-lg text-orange-600">{ac.level}</span>
                 </div>
                 <h3 className="text-xl font-black text-dark uppercase leading-tight mb-2 tracking-tight group-hover:text-primary transition-colors">{ac.title}</h3>
                 <p className="text-sm font-bold text-gray-400 mb-1">Siswa: {ac.profiles?.full_name}</p>
                 <p className="text-xs text-primary font-black uppercase tracking-tighter">{ac.rank}</p>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-50 flex justify-between items-center">
                 <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{new Date(ac.achievement_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                 <button onClick={() => openCertificate(ac)} className="text-xs font-black text-secondary hover:underline uppercase tracking-widest">Detail & Sertifikat</button>
              </div>
           </div>
         )) : (
            <div className="col-span-full py-24 text-center bg-gray-50 rounded-[50px] border-2 border-dashed border-gray-200">
               <Trophy size={64} className="mx-auto text-gray-200 mb-4" />
               <p className="text-gray-400 font-bold italic">Belum ada data prestasi siswa yang tercatat.</p>
            </div>
         )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-[70] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
           <div className="bg-white w-full max-w-4xl rounded-[50px] shadow-2xl overflow-hidden animate-fade-in-up">
              <div className="p-10 pb-4 flex justify-between items-center">
                 <h2 className="text-3xl font-black text-dark tracking-tighter uppercase">Input Capaian Prestasi</h2>
                 <button onClick={() => setIsModalOpen(false)} className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition"><X size={24}/></button>
              </div>
              
              <form onSubmit={handleSave} className="p-10 pt-4 grid grid-cols-1 lg:grid-cols-2 gap-10">
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Pilih Siswa Berprestasi</label>
                       <select required value={formData.student_id} onChange={e => setFormData({...formData, student_id: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-dark focus:ring-2 focus:ring-primary appearance-none">
                          <option value="">Cari Nama Siswa...</option>
                          {students.map(s => <option key={s.id} value={s.id}>{s.full_name} ({s.classes?.name})</option>)}
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Nama Lomba / Event</label>
                       <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Contoh: OSN Matematika Tingkat Nasional" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-dark focus:ring-2 focus:ring-primary" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Kategori</label>
                          <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-dark focus:ring-2 focus:ring-primary">
                             {['Akademik', 'Sains', 'Olahraga', 'Seni', 'Religius', 'Lainnya'].map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Peringkat</label>
                          <input required type="text" value={formData.rank} onChange={e => setFormData({...formData, rank: e.target.value})} placeholder="Juara 1 / Emas" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-dark focus:ring-2 focus:ring-primary" />
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Tingkat</label>
                          <select value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-dark focus:ring-2 focus:ring-primary">
                             {['Sekolah', 'Kecamatan', 'Kabupaten', 'Provinsi', 'Nasional', 'Internasional'].map(l => <option key={l} value={l}>{l}</option>)}
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Tanggal</label>
                          <input required type="date" value={formData.achievement_date} onChange={e => setFormData({...formData, achievement_date: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-dark focus:ring-2 focus:ring-primary" />
                       </div>
                    </div>
                 </div>
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Foto Bukti / Sertifikat</label>
                       <div 
                         onClick={() => fileInputRef.current?.click()}
                         className="aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-[32px] overflow-hidden flex flex-col items-center justify-center group cursor-pointer hover:border-primary transition relative"
                       >
                          {formData.proof_image ? (
                             <img src={formData.proof_image} className="w-full h-full object-cover" />
                          ) : (
                             <>
                                <ImageIcon className="text-gray-300 group-hover:text-primary transition mb-2" size={48} />
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Klik untuk Unggah</p>
                             </>
                          )}
                       </div>
                       <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Deskripsi Tambahan</label>
                       <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Detail singkat mengenai prestasi..." className="w-full bg-gray-50 border-none rounded-2xl p-4 font-medium text-dark focus:ring-2 focus:ring-primary resize-none" />
                    </div>
                    <button disabled={isSubmitting} className="w-full bg-primary text-white py-5 rounded-[24px] font-black text-lg shadow-2xl shadow-teal-100 flex items-center justify-center gap-3 hover:bg-teal-600 transition active:scale-95 disabled:opacity-50">
                       {isSubmitting ? <Loader2 className="animate-spin" size={24}/> : <Save size={24}/>} 
                       Simpan Data Prestasi
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {isCertModalOpen && selectedAchievement && (
        <div className="fixed inset-0 bg-black/90 z-[80] flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto no-print">
           <div className="max-w-5xl w-full">
              <div className="flex justify-between items-center mb-6 no-print">
                 <h2 className="text-white font-black text-2xl uppercase tracking-widest flex items-center gap-3"><Award size={28}/> Sertifikat Digital</h2>
                 <div className="flex gap-4">
                    <button onClick={handlePrintCertificate} className="bg-primary text-white px-8 py-3 rounded-xl font-black shadow-xl flex items-center gap-2 hover:bg-teal-600 transition"><Printer size={20}/> Download PDF</button>
                    <button onClick={() => setIsCertModalOpen(false)} className="p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition"><X size={24}/></button>
                 </div>
              </div>

              <div className="bg-white p-4 md:p-12 shadow-2xl relative certificate-print-area aspect-[1.414/1] overflow-hidden flex items-center justify-center">
                 <div className="absolute inset-4 border-[12px] border-double border-teal-800 pointer-events-none"></div>
                 <div className="absolute inset-10 border-[1px] border-teal-800 pointer-events-none"></div>
                 
                 <div className="relative z-10 w-full max-w-3xl text-center space-y-6 py-6">
                    <div className="flex flex-col items-center gap-3">
                       <div className="p-3 border-2 border-teal-900/20 rounded-2xl bg-white shadow-sm">
                          <img src={schoolInfo?.logo || "https://i.pinimg.com/736x/e4/fc/df/e4fcdfa9937a726e285649eb54615769.jpg"} className="w-16 h-16 object-contain" />
                       </div>
                       <h4 className="text-teal-900 font-black text-sm uppercase tracking-[0.3em]">{schoolInfo?.name || "NAMA SEKOLAH ANDA"}</h4>
                    </div>

                    <div className="space-y-1">
                       <h1 className="text-6xl font-serif text-teal-900 italic font-bold">Piagam Penghargaan</h1>
                       <p className="text-xs font-black text-teal-800/60 uppercase tracking-[0.5em]">Diberikan Kepada :</p>
                    </div>

                    <div className="py-2">
                       <h2 className="text-5xl font-black text-teal-950 uppercase border-b-2 border-teal-900/20 inline-block px-10 pb-2 leading-none">{selectedAchievement.profiles?.full_name}</h2>
                       <p className="text-xl font-bold text-teal-900 mt-2">
                          {selectedAchievement.profiles?.nis || 'NIS-'} • {selectedAchievement.profiles?.classes?.name || 'Kelas-'}
                       </p>
                    </div>

                    <div className="max-w-2xl mx-auto space-y-3">
                       <p className="text-teal-900 text-lg leading-relaxed">
                          Atas Capaian Luar Biasa Sebagai <br/>
                          <strong className="text-2xl text-teal-950 uppercase font-black">{selectedAchievement.rank}</strong> <br/>
                          Dalam Ajang <br/>
                          <strong className="text-xl text-teal-950 font-bold">{selectedAchievement.title}</strong>
                       </p>
                    </div>

                    <div className="pt-4 flex justify-around items-end">
                       {/* Left area - empty or just Verification metadata */}
                       <div className="text-center w-64 opacity-0">
                          <p className="font-black text-teal-950 text-sm uppercase">Verification Footer</p>
                       </div>
                       
                       {/* Middle area - empty now as requested */}
                       <div className="flex flex-col items-center opacity-0">
                          <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mb-2"></div>
                       </div>

                       {/* Right area - Principal section moved up */}
                       <div className="text-center w-64 mb-4">
                          <p className="text-[11px] text-teal-800 uppercase font-bold mb-3">{new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
                          <p className="text-[11px] text-teal-800 font-bold uppercase mb-10">Kepala Sekolah</p>
                          <div className="h-[1px] bg-teal-900/30 w-full mb-2"></div>
                          <p className="font-black text-teal-950 text-base uppercase leading-tight">{schoolInfo?.principal || "Nama Kepala Sekolah"}</p>
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

export default AchievementManager;
