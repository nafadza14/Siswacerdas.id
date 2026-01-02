
import React, { useState, useEffect } from 'react';
import { Camera, Search, Filter, Loader2, User, Clock, MapPin, Layers, X, ChevronRight, CheckCircle2 } from 'lucide-react';
import { dataService, stringifyError } from '../../services/supabaseService';

const SchoolAttendanceView: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [schoolId, setSchoolId] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    const res = await dataService.getCurrentUserProfile();
    if (res?.profile?.school_id) {
      const sId = res.profile.school_id;
      setSchoolId(sId);
      const [clsRes, logRes] = await Promise.all([
        dataService.getClassesBySchool(sId),
        dataService.getAttendanceLogs(sId, selectedClass || undefined)
      ]);
      if (clsRes.data) setClasses(clsRes.data);
      if (logRes.data) setLogs(logRes.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [selectedClass]);

  const filteredLogs = logs.filter(log => 
    log.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.profiles?.nis?.includes(searchTerm)
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-dark tracking-tight uppercase leading-none">Rekap Presensi Harian</h1>
          <p className="text-gray-500 font-medium mt-2">Monitoring kehadiran siswa secara real-time berbasis foto & lokasi.</p>
        </div>
        <div className="bg-orange-50 px-6 py-3 rounded-2xl border border-orange-100 flex items-center gap-3">
          <Clock size={20} className="text-orange-500" />
          <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Sistem Retensi: Data Otomatis Terhapus Setiap 2 Minggu</p>
        </div>
      </div>

      <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-2xl shadow-teal-100/10 space-y-8">
        <div className="flex flex-wrap gap-4 items-center justify-between">
           <div className="relative flex-1 max-w-md">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={20}/>
              <input 
                type="text" 
                placeholder="Cari nama atau NIS siswa..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl font-bold text-dark focus:ring-2 focus:ring-primary focus:bg-white transition"
              />
           </div>
           
           <div className="flex gap-4">
              <div className="relative">
                 <select 
                   value={selectedClass} 
                   onChange={e => setSelectedClass(e.target.value)}
                   className="pl-12 pr-10 py-4 bg-gray-50 border-none rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-500 focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                 >
                    <option value="">Semua Kelas</option>
                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                 </select>
                 <Layers size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
              </div>
           </div>
        </div>

        <div className="overflow-x-auto">
           {isLoading ? (
             <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-primary" size={40} /></div>
           ) : (
             <table className="w-full text-left">
                <thead className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                   <tr>
                      <th className="px-6 py-5">Identitas Siswa</th>
                      <th className="px-6 py-5">Kelas</th>
                      <th className="px-6 py-5">Waktu Presensi</th>
                      <th className="px-6 py-5 text-center">Bukti Foto</th>
                      <th className="px-6 py-5 text-right">Detail</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {filteredLogs.length > 0 ? filteredLogs.map(log => (
                     <tr key={log.id} className="group hover:bg-gray-50/50 transition">
                        <td className="px-6 py-5">
                           <div className="flex items-center gap-4">
                              <img src={log.profiles?.avatar || "https://i.pinimg.com/736x/e4/fc/df/e4fcdfa9937a726e285649eb54615769.jpg"} className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-sm" />
                              <div>
                                 <p className="font-bold text-dark text-base leading-none mb-1">{log.profiles?.full_name}</p>
                                 <p className="text-[10px] text-gray-400 font-mono uppercase">NIS: {log.profiles?.nis || '-'}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-5">
                           <span className="px-4 py-1.5 bg-gray-100 text-gray-500 rounded-xl text-[10px] font-black uppercase tracking-widest">
                              {log.classes?.name}
                           </span>
                        </td>
                        <td className="px-6 py-5">
                           <div className="flex flex-col">
                              <span className="font-black text-dark text-sm">{new Date(log.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</span>
                              <span className="text-[10px] text-gray-400 font-bold uppercase">{new Date(log.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                           </div>
                        </td>
                        <td className="px-6 py-5 text-center">
                           <button onClick={() => setSelectedLog(log)} className="w-14 h-10 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden inline-flex items-center justify-center hover:scale-110 transition relative group">
                              {log.photo ? <img src={log.photo} className="w-full h-full object-cover" /> : <Camera size={16} className="text-gray-300" />}
                              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"><Camera size={14} className="text-white"/></div>
                           </button>
                        </td>
                        <td className="px-6 py-5 text-right">
                           <button onClick={() => setSelectedLog(log)} className="p-3 bg-gray-50 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-2xl transition">
                              <ChevronRight size={20}/>
                           </button>
                        </td>
                     </tr>
                   )) : (
                     <tr><td colSpan={5} className="py-24 text-center text-gray-400 italic">Belum ada data presensi yang masuk.</td></tr>
                   )}
                </tbody>
             </table>
           )}
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/80 z-[120] flex items-center justify-center p-4 backdrop-blur-md">
           <div className="bg-white w-full max-w-2xl rounded-[60px] shadow-2xl overflow-hidden animate-fade-in-up flex flex-col md:flex-row">
              <div className="md:w-1/2 aspect-[3/4] bg-gray-900 relative">
                 <img src={selectedLog.photo} className="w-full h-full object-cover" />
                 <div className="absolute top-0 w-full p-8 text-white flex justify-between items-start">
                    <div className="bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                       <MapPin size={12} className="text-primary"/>
                       <span className="text-[10px] font-black uppercase tracking-widest">Terverifikasi GPS</span>
                    </div>
                    <button onClick={() => setSelectedLog(null)} className="p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition backdrop-blur-md"><X size={24}/></button>
                 </div>
              </div>
              <div className="md:w-1/2 p-10 flex flex-col justify-between">
                 <div>
                    <div className="w-12 h-12 bg-teal-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-teal-100">
                       <CheckCircle2 size={28}/>
                    </div>
                    <h2 className="text-3xl font-black text-dark tracking-tighter uppercase leading-none mb-2">{selectedLog.profiles?.full_name}</h2>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.2em] mb-8">{selectedLog.classes?.name} • NIS {selectedLog.profiles?.nis || '-'}</p>
                    
                    <div className="space-y-6">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-primary"><Clock size={20}/></div>
                          <div>
                             <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none mb-1">Waktu Masuk</p>
                             <p className="font-bold text-dark text-base">{new Date(selectedLog.created_at).toLocaleTimeString('id-ID')} WIB</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-primary"><MapPin size={20}/></div>
                          <div>
                             <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none mb-1">Koordinat Presensi</p>
                             <p className="font-mono text-xs font-bold text-dark">{selectedLog.latitude?.toFixed(5)}, {selectedLog.longitude?.toFixed(5)}</p>
                          </div>
                       </div>
                    </div>
                 </div>
                 
                 <div className="mt-10">
                    <p className="text-[10px] text-gray-400 font-medium italic mb-4">Presensi divalidasi oleh sistem Face Recognition Siswa Cerdas.</p>
                    <button onClick={() => setSelectedLog(null)} className="w-full bg-dark text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-black transition active:scale-95">Tutup Detail</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default SchoolAttendanceView;
