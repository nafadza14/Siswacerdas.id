
import React, { useState, useEffect } from 'react';
import { GraduationCap, Briefcase, School, Users, Plus, X, Save, Loader2, Trash2, Search } from 'lucide-react';
import { dataService, stringifyError } from '../../services/supabaseService';

const TracerStudy: React.FC = () => {
  const [alumni, setAlumni] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    full_name: '',
    graduation_year: new Date().getFullYear(),
    status: 'Kuliah',
    institution: '',
    major_or_position: ''
  });

  const loadData = async () => {
    setIsLoading(true);
    const res = await dataService.getCurrentUserProfile();
    if (res?.profile?.school_id) {
      setSchoolId(res.profile.school_id);
      const alumniRes = await dataService.getAlumni(res.profile.school_id);
      if (alumniRes.data) setAlumni(alumniRes.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolId) return;
    setIsSubmitting(true);
    
    const { error } = await dataService.addAlumni({
      ...formData,
      school_id: schoolId
    });

    if (error) {
      alert(stringifyError(error));
    } else {
      setIsModalOpen(false);
      setFormData({
        full_name: '',
        graduation_year: new Date().getFullYear(),
        status: 'Kuliah',
        institution: '',
        major_or_position: ''
      });
      await loadData();
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Hapus data alumni ini?')) {
      await dataService.deleteAlumni(id);
      await loadData();
    }
  };

  // Kalkulasi Statistik Dinamis
  const total = alumni.length;
  const stats = {
    kuliah: total > 0 ? Math.round((alumni.filter(a => a.status === 'Kuliah').length / total) * 100) : 0,
    kerja: total > 0 ? Math.round((alumni.filter(a => a.status === 'Kerja').length / total) * 100) : 0,
    wirausaha: total > 0 ? Math.round((alumni.filter(a => a.status === 'Wirausaha').length / total) * 100) : 0,
    lainnya: total > 0 ? Math.round((alumni.filter(a => a.status === 'Lainnya').length / total) * 100) : 0,
  };

  const filteredAlumni = alumni.filter(a => 
    a.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.institution.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-dark tracking-tight uppercase">Tracer Study Alumni</h1>
          <p className="text-gray-500 font-medium">Monitoring karir dan studi lanjut lulusan sekolah.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-teal-100 hover:bg-teal-600 transition flex items-center gap-2 active:scale-95"
        >
          <Plus size={20} /> Tambah Data Alumni
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Kuliah', val: `${stats.kuliah}%`, icon: School, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Kerja', val: `${stats.kerja}%`, icon: Briefcase, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Wirausaha', val: `${stats.wirausaha}%`, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Lainnya', val: `${stats.lainnya}%`, icon: GraduationCap, color: 'text-gray-600', bg: 'bg-gray-50' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-2xl shadow-teal-100/5 flex flex-col gap-4">
             <div className={`w-12 h-12 ${s.bg} rounded-2xl flex items-center justify-center`}><s.icon className={s.color} size={24} /></div>
             <div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.label}</p>
               <p className="text-2xl font-black text-dark tracking-tight">{s.val}</p>
             </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-2xl shadow-teal-100/5">
         <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="font-black text-dark uppercase text-xl">Database Alumni Terlacak</h2>
            <div className="relative w-full md:w-80">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18}/>
               <input 
                 type="text" 
                 placeholder="Cari nama atau instansi..." 
                 value={searchTerm}
                 onChange={e => setSearchTerm(e.target.value)}
                 className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary"
               />
            </div>
         </div>
         <div className="overflow-x-auto">
            {isLoading ? (
              <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-primary" /></div>
            ) : (
              <table className="w-full text-left">
                 <thead className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <tr>
                       <th className="px-8 py-5">Nama Alumni</th>
                       <th className="px-8 py-5">Angkatan</th>
                       <th className="px-8 py-5">Status</th>
                       <th className="px-8 py-5">Instansi / Kampus</th>
                       <th className="px-8 py-5 text-right">Aksi</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                    {filteredAlumni.length > 0 ? filteredAlumni.map(a => (
                      <tr key={a.id} className="group hover:bg-gray-50/50 transition">
                         <td className="px-8 py-4 font-bold text-dark">{a.full_name}</td>
                         <td className="px-8 py-4 text-sm font-mono text-gray-500">{a.graduation_year}</td>
                         <td className="px-8 py-4">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                              a.status === 'Kuliah' ? 'bg-blue-100 text-blue-600' : 
                              a.status === 'Kerja' ? 'bg-green-100 text-green-600' :
                              a.status === 'Wirausaha' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                            }`}>{a.status}</span>
                         </td>
                         <td className="px-8 py-4">
                            <p className="text-sm font-bold text-dark">{a.institution}</p>
                            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">{a.major_or_position || '-'}</p>
                         </td>
                         <td className="px-8 py-4 text-right">
                            <button onClick={() => handleDelete(a.id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition">
                               <Trash2 size={18}/>
                            </button>
                         </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={5} className="py-20 text-center text-gray-400 italic">Belum ada data alumni yang ditemukan.</td></tr>
                    )}
                 </tbody>
              </table>
            )}
         </div>
      </div>

      {/* MODAL INPUT ALUMNI */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-[80] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
           <div className="bg-white w-full max-w-2xl rounded-[50px] shadow-2xl overflow-hidden animate-fade-in-up">
              <div className="p-10 pb-4 flex justify-between items-center">
                 <h2 className="text-3xl font-black text-dark tracking-tighter uppercase">Tambah Alumni</h2>
                 <button onClick={() => setIsModalOpen(false)} className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition"><X size={24}/></button>
              </div>
              
              <form onSubmit={handleSave} className="p-10 pt-4 space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Nama Lengkap Alumni</label>
                    <input required type="text" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} placeholder="Nama Alumni..." className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-dark focus:ring-2 focus:ring-primary" />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Tahun Lulus</label>
                       <input required type="number" value={formData.graduation_year} onChange={e => setFormData({...formData, graduation_year: parseInt(e.target.value)})} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-dark focus:ring-2 focus:ring-primary" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Status Saat Ini</label>
                       <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-dark focus:ring-2 focus:ring-primary">
                          {['Kuliah', 'Kerja', 'Wirausaha', 'Lainnya'].map(s => <option key={s} value={s}>{s}</option>)}
                       </select>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Nama Kampus / Perusahaan</label>
                    <input required type="text" value={formData.institution} onChange={e => setFormData({...formData, institution: e.target.value})} placeholder="Contoh: Universitas Indonesia / PT Gojek Indonesia" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-dark focus:ring-2 focus:ring-primary" />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Jurusan / Jabatan (Opsional)</label>
                    <input type="text" value={formData.major_or_position} onChange={e => setFormData({...formData, major_or_position: e.target.value})} placeholder="Contoh: S1 Teknik Informatika / Senior Developer" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-dark focus:ring-2 focus:ring-primary" />
                 </div>

                 <button disabled={isSubmitting} className="w-full bg-primary text-white py-5 rounded-[24px] font-black text-lg shadow-2xl shadow-teal-100 flex items-center justify-center gap-3 hover:bg-teal-600 transition active:scale-95 disabled:opacity-50">
                    {isSubmitting ? <Loader2 className="animate-spin" size={24}/> : <Save size={24}/>} 
                    Simpan Data Alumni
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default TracerStudy;
