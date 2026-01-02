
import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Search, CheckCircle2, Send, Loader2, Trash2, Layout, Filter, ArrowRight, X, Layers, User, ChevronRight, Palette, QrCode, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { dataService, stringifyError } from '../../services/supabaseService';
import { UserRole } from '../../types';

// Toast Notification Component
interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-6 right-6 z-[110] flex items-center gap-4 px-6 py-5 rounded-[28px] shadow-2xl border backdrop-blur-md animate-fade-in-left ${
      type === 'success' ? 'bg-teal-500/95 border-teal-400 text-white' : 'bg-red-500/95 border-red-400 text-white'
    }`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${type === 'success' ? 'bg-white/20' : 'bg-white/20'}`}>
        {type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
      </div>
      <div>
        <p className="font-black text-sm tracking-tight uppercase leading-none mb-1">{type === 'success' ? 'Berhasil!' : 'Gagal'}</p>
        <p className="font-bold text-xs opacity-90">{message}</p>
      </div>
      <button onClick={onClose} className="ml-4 p-1 hover:bg-white/20 rounded-full transition"><X size={18}/></button>
    </div>
  );
};

const CARD_TEMPLATES = [
  { id: 't1', name: 'Modern Teal', colors: 'from-teal-600 to-cyan-500' },
  { id: 't2', name: 'Deep Ocean', colors: 'from-blue-700 to-blue-500' },
  { id: 't3', name: 'Sunrise Orange', colors: 'from-orange-600 to-orange-400' },
  { id: 't4', name: 'Elegant Dark', colors: 'from-gray-900 to-gray-700' },
  { id: 't5', name: 'Royal Purple', colors: 'from-purple-700 to-purple-500' },
  { id: 't6', name: 'Nature Green', colors: 'from-emerald-700 to-emerald-500' },
  { id: 't7', name: 'Cherry Red', colors: 'from-rose-700 to-rose-500' },
  { id: 't8', name: 'Cyberpunk', colors: 'from-indigo-900 to-fuchsia-600' },
  { id: 't9', name: 'Soft Pastel', colors: 'from-pink-300 to-indigo-300' },
  { id: 't10', name: 'Business Blue', colors: 'from-slate-800 to-blue-900' },
  { id: 't11', name: 'Classic Gold', colors: 'from-yellow-700 to-yellow-500' },
  { id: 't12', name: 'Minimalist White', colors: 'from-gray-100 to-white' },
  { id: 't13', name: 'Forest Dark', colors: 'from-green-950 to-green-800' },
  { id: 't14', name: 'Sunset Glow', colors: 'from-red-600 to-yellow-500' },
  { id: 't15', name: 'Ocean Mist', colors: 'from-cyan-600 to-blue-400' },
  { id: 't16', name: 'Midnight', colors: 'from-black to-slate-900' },
  { id: 't17', name: 'Corporate Teal', colors: 'from-teal-800 to-teal-600' },
  { id: 't18', name: 'Berry Mix', colors: 'from-purple-800 to-rose-600' }
];

const StudentCardManagement: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState('t1');
  const [viewingClass, setViewingClass] = useState<any>(null);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    const res = await dataService.getCurrentUserProfile();
    if (res?.profile?.school_id) {
      const sId = res.profile.school_id;
      setSchoolId(sId);
      const [appRes, stdRes, clsRes] = await Promise.all([
        dataService.getKtsApplications(sId),
        dataService.getProfilesBySchool(sId, UserRole.STUDENT),
        dataService.getClassesBySchool(sId)
      ]);
      if (appRes.data) setApplications(appRes.data);
      if (stdRes.data) setAllStudents(stdRes.data);
      if (clsRes.data) setClasses(clsRes.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const handleApplyCollective = async (classId?: string) => {
    if (!schoolId) return;
    
    let targetStudents = allStudents;
    let batchName = "Seluruh Sekolah";
    
    if (classId) {
      targetStudents = allStudents.filter(s => (s.class_id || s.classId) === classId);
      const className = classes.find(c => c.id === classId)?.name || "Kelas";
      batchName = `Kelas ${className}`;
    }

    const appliedIds = new Set(applications.map(a => a.student_id));
    const studentsToApply = targetStudents.filter(s => !appliedIds.has(s.id));

    if (studentsToApply.length === 0) {
      showNotification("Semua siswa dalam grup ini sudah diajukan KTS.", "error");
      return;
    }

    if (!confirm(`Ajukan cetak KTS untuk ${studentsToApply.length} siswa secara kolektif?`)) return;

    setIsSubmitting(true);
    const { error } = await dataService.applyKtsCollective(
      schoolId,
      studentsToApply.map(s => s.id),
      selectedTemplate,
      `${batchName} - ${new Date().toLocaleDateString('id-ID')}`
    );

    if (error) {
      showNotification(stringifyError(error), "error");
    } else {
      showNotification(`Pengajuan untuk ${batchName} berhasil dikirim!`);
      await loadData();
    }
    setIsSubmitting(false);
  };

  const handleApplyIndividual = async (studentId: string, fullName: string) => {
    if (!schoolId) return;
    
    setIsSubmitting(true);
    const { error } = await dataService.applyKtsCollective(
      schoolId,
      [studentId],
      selectedTemplate,
      `Individu: ${fullName}`
    );

    if (error) {
      showNotification(stringifyError(error), "error");
    } else {
      showNotification(`KTS ${fullName} berhasil diajukan.`);
      await loadData();
    }
    setIsSubmitting(false);
  };

  const getStatusForClass = (classId: string) => {
    const classStudentIds = allStudents
      .filter(s => (s.class_id || s.classId) === classId)
      .map(s => s.id);
    
    if (classStudentIds.length === 0) return 'EMPTY';
    
    const classApps = applications.filter(a => classStudentIds.includes(a.student_id));
    if (classApps.length === 0) return 'READY';
    if (classApps.every(a => a.status === 'PRINTED')) return 'PRINTED';
    return 'PENDING';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-10 pb-20">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-dark tracking-tight uppercase">Dashboard KTS Kolektif</h1>
          <p className="text-gray-500 font-medium">Sistem Pengajuan Cetak Kartu Terintegrasi Master Data.</p>
        </div>
        <button 
          onClick={() => handleApplyCollective()}
          disabled={isSubmitting || allStudents.length === 0}
          className="bg-dark text-white px-10 py-5 rounded-2xl font-black shadow-2xl flex items-center gap-3 hover:bg-gray-800 transition active:scale-95 disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="animate-spin" size={24}/> : <Sparkles size={24} className="text-secondary" />} 
          Ajukan Cetak Seluruh Sekolah
        </button>
      </div>

      <section className="space-y-6">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded-xl"><Palette size={20}/></div>
            <h2 className="font-black text-dark text-xl uppercase tracking-tight">Pilih Desain Kartu Sekolah (18 Opsi)</h2>
         </div>
         
         <div className="flex overflow-x-auto gap-6 pb-6 px-1 hide-scrollbar">
            {CARD_TEMPLATES.map((t) => (
               <div 
                  key={t.id} 
                  onClick={() => setSelectedTemplate(t.id)}
                  className={`shrink-0 w-64 aspect-[86/54] rounded-2xl p-4 flex flex-col justify-between cursor-pointer transition-all relative border-4 ${
                    selectedTemplate === t.id ? 'border-primary shadow-2xl scale-105 z-10' : 'border-white shadow-md grayscale-[0.3] hover:grayscale-0'
                  } bg-gradient-to-br ${t.colors} text-white`}
               >
                  <div className="flex items-center gap-2">
                     <div className="w-5 h-5 bg-white rounded flex items-center justify-center p-0.5"><div className="w-full h-full bg-primary rounded-sm"></div></div>
                     <span className="text-[7px] font-black uppercase tracking-widest leading-none">Template #{t.id.replace('t','')}</span>
                  </div>
                  <div className="flex gap-2 items-center">
                     <div className="w-10 h-14 border border-white/50 rounded-md bg-white/20"></div>
                     <div className="flex-1 space-y-1">
                        <div className="w-full h-1 bg-white/50 rounded"></div>
                        <div className="w-2/3 h-1 bg-white/30 rounded"></div>
                        <div className="w-1/2 h-1 bg-white/30 rounded"></div>
                     </div>
                  </div>
                  <div className="flex justify-between items-end">
                     <QrCode size={12} className="opacity-50" />
                     <span className="text-[6px] font-bold opacity-40 uppercase">{t.name}</span>
                  </div>
                  {selectedTemplate === t.id && (
                    <div className="absolute -top-3 -right-3 bg-primary text-white p-1.5 rounded-full shadow-lg border-4 border-white">
                       <CheckCircle2 size={16}/>
                    </div>
                  )}
               </div>
            ))}
         </div>
      </section>

      <section className="space-y-6">
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-secondary/10 text-secondary rounded-xl"><Layers size={20}/></div>
               <h2 className="font-black text-dark text-xl uppercase tracking-tight">Daftar Pengajuan Per Kelas</h2>
            </div>
            <p className="text-xs text-gray-400 font-bold italic">Klik kelas untuk detail siswa</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
               <div className="col-span-full py-20 text-center"><Loader2 className="animate-spin mx-auto text-primary" /></div>
            ) : classes.map(c => {
               const status = getStatusForClass(c.id);
               const studentCount = allStudents.filter(s => (s.class_id || s.classId) === c.id).length;
               
               return (
                  <div key={c.id} className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm hover:shadow-2xl transition-all group">
                     <div className="flex justify-between items-start mb-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl transition-colors ${
                           status === 'PRINTED' ? 'bg-green-100 text-green-600' :
                           status === 'PENDING' ? 'bg-orange-100 text-orange-600' :
                           'bg-gray-100 text-gray-400'
                        }`}>
                           {c.name?.charAt(0)}
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                           status === 'PRINTED' ? 'bg-green-100 text-green-700' : 
                           status === 'PENDING' ? 'bg-orange-100 text-orange-700' : 
                           'bg-blue-100 text-blue-700'
                        }`}>
                           {status === 'PRINTED' ? 'SELESAI' : status === 'PENDING' ? 'PROSES' : 'READY'}
                        </span>
                     </div>
                     
                     <h3 className="text-2xl font-black text-dark uppercase mb-1">{c.name}</h3>
                     <p className="text-xs text-gray-400 font-bold mb-8 uppercase tracking-widest">{studentCount} Siswa Terdaftar</p>
                     
                     <div className="grid grid-cols-2 gap-3">
                        <button 
                           onClick={() => setViewingClass(c)}
                           className="py-4 bg-gray-50 text-gray-500 font-bold rounded-2xl flex items-center justify-center gap-2 text-xs hover:bg-gray-100 transition active:scale-95"
                        >
                           <User size={14}/> Detail Siswa
                        </button>
                        <button 
                           onClick={() => handleApplyCollective(c.id)}
                           disabled={status === 'PRINTED' || status === 'PENDING' || isSubmitting || studentCount === 0}
                           className="py-4 bg-primary text-white font-black rounded-2xl flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest hover:bg-teal-600 transition shadow-xl shadow-teal-100/30 active:scale-95 disabled:opacity-30 disabled:shadow-none"
                        >
                           <Send size={14}/> Ajukan Kelas
                        </button>
                     </div>
                  </div>
               );
            })}
         </div>
      </section>

      <div className="pt-10 border-t border-gray-100 text-center">
         <div className="bg-orange-50 p-8 rounded-[40px] border border-orange-100 max-w-2xl mx-auto">
            <h4 className="text-xl font-black text-dark uppercase mb-2">Sinkronisasi Super Admin</h4>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">Setelah mengajukan secara kolektif, data akan muncul di antrian cetak Super Admin Siswa Cerdas untuk diproses dan dikirimkan fisiknya ke sekolah.</p>
            <button 
               onClick={() => showNotification("Notifikasi manual terkirim ke Super Admin Siswa Cerdas.")}
               className="bg-secondary text-white px-10 py-4 rounded-2xl font-black shadow-2xl shadow-orange-200 hover:bg-orange-600 transition flex items-center gap-2 mx-auto active:scale-95"
            >
               <Send size={18}/> Kirim Notifikasi Pengajuan Ke Pusat
            </button>
         </div>
      </div>

      {/* MODAL VIEW CLASS STUDENTS */}
      {viewingClass && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
            <div className="bg-white w-full max-w-2xl rounded-[50px] shadow-2xl animate-fade-in-up flex flex-col max-h-[85vh] overflow-hidden">
                <div className="p-10 border-b border-gray-100 flex items-center justify-between">
                    <div>
                       <h2 className="text-3xl font-black text-dark tracking-tighter uppercase leading-none">Siswa {viewingClass.name}</h2>
                       <p className="text-xs text-gray-400 mt-2 font-bold uppercase tracking-widest">Detail Status KTS Per Siswa</p>
                    </div>
                    <button onClick={() => setViewingClass(null)} className="p-3 bg-gray-50 rounded-full hover:bg-gray-100 transition"><X size={28}/></button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-4 bg-gray-50/30">
                    {allStudents.filter(s => (s.class_id || s.classId) === viewingClass.id).map(s => {
                        const app = applications.find(a => a.student_id === s.id);
                        return (
                           <div key={s.id} className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-[30px] shadow-sm">
                               <div className="flex items-center gap-4">
                                   <img src={s.avatar || "https://i.pinimg.com/736x/e4/fc/df/e4fcdfa9937a726e285649eb54615769.jpg"} className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-sm" />
                                   <div>
                                     <p className="font-bold text-dark">{s.full_name}</p>
                                     <p className="text-[10px] text-gray-400 font-mono">NIS: {s.nis || '-'}</p>
                                   </div>
                               </div>
                               
                               <div className="flex items-center gap-2">
                                  {app ? (
                                     <div className="flex items-center gap-2 text-green-500 font-black text-[10px] uppercase tracking-widest animate-fade-in">
                                        <CheckCircle2 size={20} />
                                        <span>{app.status === 'PRINTED' ? 'Selesai' : 'Diajukan'}</span>
                                     </div>
                                  ) : (
                                     <button 
                                        onClick={() => handleApplyIndividual(s.id, s.full_name)}
                                        disabled={isSubmitting}
                                        className="px-6 py-2.5 bg-primary text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-teal-100 hover:bg-teal-600 transition active:scale-95 disabled:opacity-50"
                                     >
                                        {isSubmitting ? <Loader2 size={12} className="animate-spin" /> : 'Ajukan'}
                                     </button>
                                  )}
                               </div>
                           </div>
                        );
                    })}
                </div>
                <div className="p-8 bg-white border-t border-gray-100 text-center">
                    <button 
                       onClick={() => { setViewingClass(null); handleApplyCollective(viewingClass.id); }}
                       className="w-full bg-primary text-white py-5 rounded-[24px] font-black uppercase tracking-widest shadow-2xl shadow-teal-100 hover:bg-teal-600 transition"
                    >
                       Ajukan Cetak Kelas Ini Sekarang
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default StudentCardManagement;
