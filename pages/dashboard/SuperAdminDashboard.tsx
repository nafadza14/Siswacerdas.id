
import React from 'react';
import { Building2, CreditCard, Users, ShieldAlert, TrendingUp, ArrowRight } from 'lucide-react';
import { MOCK_CARD_APPLICATIONS, MOCK_SCHOOLS } from '../../constants';

const SuperAdminDashboard: React.FC = () => {
  const stats = [
    { label: 'Total Sekolah', value: MOCK_SCHOOLS.length.toString(), icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Antrian Cetak', value: MOCK_CARD_APPLICATIONS.filter(a => a.status === 'PENDING').length.toString(), icon: CreditCard, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Siswa Aktif', value: '18.420', icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Alert Sistem', value: '0', icon: ShieldAlert, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-dark">Platform Overview</h1>
        <p className="text-gray-500">Monitoring sistem dan manajemen layanan sekolah</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`p-4 rounded-2xl ${s.bg} ${s.color}`}>
              <s.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{s.label}</p>
              <p className="text-2xl font-bold text-dark">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-bold text-dark">Pengajuan Kartu Terbaru</h2>
               <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                  Semua Antrian <ArrowRight size={14}/>
               </button>
            </div>
            <div className="space-y-4">
               {MOCK_CARD_APPLICATIONS.map(app => (
                 <div key={app.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-primary transition">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary border border-gray-100">
                          <CreditCard size={20}/>
                       </div>
                       <div>
                          <p className="font-bold text-sm text-dark">{app.schoolName}</p>
                          <p className="text-xs text-gray-400">{app.batchName} • {app.studentCount} Siswa</p>
                       </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                       app.status === 'PENDING' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                    }`}>{app.status}</span>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-dark mb-6">Statistik Pertumbuhan</h2>
            <div className="h-64 flex items-end gap-3">
               {[40, 55, 30, 85, 60, 95, 80].map((val, i) => (
                 <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-gray-50 rounded-t-lg relative group h-full">
                       <div 
                         className="absolute bottom-0 w-full bg-primary/20 rounded-t-lg transition-all group-hover:bg-primary" 
                         style={{ height: `${val}%` }} 
                       />
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Bulan {i+1}</span>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
