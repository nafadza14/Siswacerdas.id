
import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/supabaseService';
import { Search, Filter, CheckCircle, MoreHorizontal, MapPin, Clock, Building2, ExternalLink } from 'lucide-react';
import { MOCK_SCHOOLS } from '../../constants';

const SchoolManagement: React.FC = () => {
  const [schools, setSchools] = useState<any[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const fetchSchools = async () => {
    setFetchLoading(true);
    try {
      const { data, error } = await dataService.getSchools();
      if (!error && data) {
        setSchools(data.length > 0 ? data.filter(Boolean) : MOCK_SCHOOLS);
      } else {
        setSchools(MOCK_SCHOOLS);
      }
    } catch (err) {
      console.error("Fetch schools error:", err);
      setSchools(MOCK_SCHOOLS);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const handleApprove = async (id: string) => {
    if (!id) return;
    if (confirm("Setujui pendaftaran sekolah ini? Sistem akan otomatis membuat akun administrator sekolah.")) {
      setActionLoading(id);
      const { error } = await dataService.approveSchool(id);
      setActionLoading(null);
      
      if (error) {
        alert("Gagal menyetujui sekolah: " + error.message);
      } else {
        alert("Sekolah berhasil disetujui dan akun administrator telah aktif.");
        fetchSchools();
      }
    }
  };

  const filteredSchools = schools.filter(s => {
    if (!s) return false;
    const matchesSearch = (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (s.npsn || '').includes(searchTerm);
    const matchesStatus = filterStatus === 'ALL' || s.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = schools.filter(s => s?.status === 'PENDING').length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-dark tracking-tight">Manajemen Sekolah</h1>
          <p className="text-gray-500 font-medium">Monitoring dan verifikasi pendaftaran institusi baru.</p>
        </div>
        
        {pendingCount > 0 && (
           <div className="bg-orange-100 text-orange-600 px-4 py-2 rounded-xl flex items-center gap-2 animate-pulse">
              <Clock size={18}/>
              <span className="text-sm font-black uppercase tracking-widest">{pendingCount} Permohonan Baru</span>
           </div>
        )}
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-2xl shadow-teal-100/10">
        <div className="p-6 border-b border-gray-100 flex flex-wrap gap-4 items-center justify-between bg-white sticky top-0 z-10">
           <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama sekolah atau NPSN..." 
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white transition"
              />
           </div>
           <div className="flex gap-3">
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-6 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-500 focus:ring-2 focus:ring-primary cursor-pointer"
              >
                 <option value="ALL">Semua Status</option>
                 <option value="ACTIVE">Aktif</option>
                 <option value="PENDING">Pending (Baru)</option>
              </select>
              <button onClick={fetchSchools} className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-primary transition hover:bg-primary/5">
                <Filter size={20}/>
              </button>
           </div>
        </div>

        <div className="overflow-x-auto">
           {fetchLoading ? (
             <div className="py-24 text-center">
               <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
               <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Menyinkronkan Database...</p>
             </div>
           ) : (
             <table className="w-full text-left">
                <thead className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                   <tr>
                      <th className="px-8 py-5">Sekolah & Institusi</th>
                      <th className="px-6 py-5">Kepala Sekolah</th>
                      <th className="px-6 py-5">Lokasi & Alamat</th>
                      <th className="px-6 py-5 text-center">Status</th>
                      <th className="px-8 py-5 text-right">Aksi</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {filteredSchools.map(sch => (
                     <tr key={sch?.id || Math.random().toString()} className={`hover:bg-gray-50/50 transition-colors group ${sch?.status === 'PENDING' ? 'bg-orange-50/20' : ''}`}>
                        <td className="px-8 py-5">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-primary font-black overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                                 {sch?.logo ? <img src={sch.logo} className="w-full h-full object-contain p-1" alt={sch.name} /> : (sch?.name?.charAt(0) || '?')}
                              </div>
                              <div className="min-w-0">
                                 <p className="font-bold text-dark text-base truncate leading-none mb-1">{sch?.name || 'Sekolah Tanpa Nama'}</p>
                                 <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-gray-400 font-mono tracking-tighter">NPSN: {sch?.npsn || '-'}</span>
                                    {sch?.status === 'PENDING' && <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>}
                                 </div>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                             <span className="text-sm font-bold text-gray-600">{sch?.principal || '-'}</span>
                             <span className="text-[10px] text-gray-400 font-medium italic">Akreditasi {sch?.accreditation || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-1 max-w-[240px]">
                            <span className="flex items-center gap-1.5 text-xs text-gray-500 font-bold">
                               <MapPin size={14} className="text-primary shrink-0"/> {sch?.city || sch?.address || '-'}
                            </span>
                            <span className="text-[10px] text-gray-400 font-medium truncate ml-5">
                               {sch?.district ? `${sch.district}, ` : ''}{sch?.province || ''}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                           <div className="flex justify-center">
                              <span className={`flex items-center gap-1.5 text-[10px] font-black tracking-widest px-3 py-1.5 rounded-full w-max shadow-sm ${
                                sch?.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                              }`}>
                                 {sch?.status === 'ACTIVE' ? <CheckCircle size={14}/> : <Clock size={14}/>} 
                                 {sch?.status === 'ACTIVE' ? 'AKTIF' : 'BARU'}
                              </span>
                           </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                           <div className="flex items-center justify-end gap-2">
                              {sch?.status === 'PENDING' && (
                                 <button 
                                   onClick={() => handleApprove(sch.id)}
                                   disabled={actionLoading === sch.id}
                                   className="bg-primary text-white text-[10px] font-black px-4 py-2 rounded-xl shadow-lg shadow-teal-100 hover:bg-teal-600 transition flex items-center gap-2 disabled:opacity-50"
                                 >
                                    {actionLoading === sch.id ? (
                                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                      <>SETUJUI <CheckCircle size={14}/></>
                                    )}
                                 </button>
                              )}
                              <button className="p-2.5 text-gray-400 hover:text-dark hover:bg-gray-100 rounded-xl transition">
                                 <MoreHorizontal size={20}/>
                              </button>
                           </div>
                        </td>
                     </tr>
                   ))}
                   {filteredSchools.length === 0 && !fetchLoading && (
                     <tr>
                       <td colSpan={5} className="py-24 text-center">
                          <div className="max-w-xs mx-auto">
                             <Building2 className="mx-auto text-gray-100 mb-4" size={64}/>
                             <p className="text-gray-400 font-bold">Tidak ada sekolah ditemukan.</p>
                             <p className="text-gray-300 text-xs mt-2">Coba sesuaikan kata kunci atau filter status Anda.</p>
                          </div>
                       </td>
                     </tr>
                   )}
                </tbody>
             </table>
           )}
        </div>
      </div>
    </div>
  );
};

export default SchoolManagement;
