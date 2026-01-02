
import React, { useState, useEffect } from 'react';
import { CreditCard, Printer, CheckCircle2, Search, Clock, FileDown, Loader2, X, Download, Building2, ChevronRight, User, QrCode, Sparkles } from 'lucide-react';
import { dataService } from '../../services/supabaseService';

const CARD_TEMPLATES: Record<string, { colors: string }> = {
  't1': { colors: 'from-teal-600 to-cyan-500' },
  't2': { colors: 'from-blue-700 to-blue-500' },
  't3': { colors: 'from-orange-600 to-orange-400' },
  't4': { colors: 'from-gray-900 to-gray-700' },
  't5': { colors: 'from-purple-700 to-purple-500' },
  't6': { colors: 'from-emerald-700 to-emerald-500' },
  't7': { colors: 'from-rose-700 to-rose-500' },
  't8': { colors: 'from-indigo-900 to-fuchsia-600' },
  't9': { colors: 'from-pink-300 to-indigo-300' },
  't10': { colors: 'from-slate-800 to-blue-900' },
  't11': { colors: 'from-yellow-700 to-yellow-500' },
  't12': { colors: 'from-gray-100 to-white' },
  't13': { colors: 'from-green-950 to-green-800' },
  't14': { colors: 'from-red-600 to-yellow-500' },
  't15': { colors: 'from-cyan-600 to-blue-400' },
  't16': { colors: 'from-black to-slate-900' },
  't17': { colors: 'from-teal-800 to-teal-600' },
  't18': { colors: 'from-purple-800 to-rose-600' }
};

const CardApprovalCenter: React.FC = () => {
  const [apps, setApps] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<any[] | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<any>(null);

  const loadData = async () => {
    setIsLoading(true);
    const { data } = await dataService.getKtsApplications();
    if (data) setApps(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleBatchDownload = (schoolId: string) => {
    const schoolApps = apps.filter(a => a.school_id === schoolId);
    if (schoolApps.length > 0) {
      setSelectedSchool(schoolApps[0].schools);
      setSelectedBatch(schoolApps);
    }
  };

  const groupedApps = apps.reduce((acc: any, app: any) => {
    const schoolId = app.school_id;
    if (!acc[schoolId]) {
      acc[schoolId] = {
        id: schoolId,
        schoolName: app.schools?.name,
        schoolLogo: app.schools?.logo,
        npsn: app.schools?.npsn,
        pendingCount: 0,
        totalCount: 0,
        items: []
      };
    }
    acc[schoolId].totalCount++;
    if (app.status === 'PENDING') acc[schoolId].pendingCount++;
    acc[schoolId].items.push(app);
    return acc;
  }, {});

  const filteredSchoolIds = Object.keys(groupedApps).filter(id => 
    groupedApps[id].schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    groupedApps[id].npsn.includes(searchTerm)
  );

  const getQrUrl = (token: string) => {
    if (!token) return "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=invalid_token";
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${token}&color=1e293b`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-center no-print">
        <div>
          <h1 className="text-3xl font-black text-dark tracking-tight uppercase">Pusat Persetujuan & Cetak KTS</h1>
          <p className="text-gray-500 font-medium">Kelola antrian produksi kartu siswa per sekolah.</p>
        </div>
        <div className="relative w-80">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18}/>
           <input 
             type="text" 
             placeholder="Cari nama sekolah..." 
             value={searchTerm}
             onChange={e => setSearchTerm(e.target.value)}
             className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold shadow-sm focus:ring-2 focus:ring-primary"
           />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 no-print">
         {isLoading ? (
            <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-primary" size={40} /></div>
         ) : filteredSchoolIds.length > 0 ? filteredSchoolIds.map(schoolId => {
            const school = groupedApps[schoolId];
            return (
              <div key={schoolId} className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row items-center justify-between gap-6 group">
                 <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-gray-50 rounded-[28px] flex items-center justify-center p-3 border border-gray-100 group-hover:scale-105 transition-transform">
                       <img src={school.schoolLogo || "https://i.pinimg.com/736x/e4/fc/df/e4fcdfa9937a726e285649eb54615769.jpg"} className="w-full h-full object-contain" />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-dark uppercase tracking-tight">{school.schoolName}</h3>
                       <div className="flex items-center gap-4 mt-1">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">NPSN: {school.npsn}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
                          <span className="text-[10px] font-black text-primary uppercase tracking-widest">{school.totalCount} Pengajuan</span>
                       </div>
                    </div>
                 </div>

                 <div className="flex items-center gap-4">
                    {school.pendingCount > 0 && (
                       <div className="bg-orange-100 text-orange-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                          <Clock size={14}/> {school.pendingCount} Menunggu
                       </div>
                    )}
                    <button 
                      onClick={() => handleBatchDownload(schoolId)}
                      className="bg-primary text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-teal-100 hover:bg-teal-600 transition flex items-center gap-3 active:scale-95"
                    >
                       <Download size={20}/> Download KTS Sekolah
                    </button>
                 </div>
              </div>
            );
         }) : (
            <div className="py-24 text-center bg-gray-50 rounded-[50px] border-2 border-dashed border-gray-200">
               <Building2 size={64} className="mx-auto text-gray-200 mb-4" />
               <p className="text-gray-400 font-bold italic">Belum ada pengajuan kartu masuk.</p>
            </div>
         )}
      </div>

      {/* PDF / PRINT PREVIEW MODAL */}
      {selectedBatch && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex flex-col backdrop-blur-md overflow-y-auto print-container no-scrollbar">
           {/* Top Bar (No Print) */}
           <div className="max-w-6xl w-full mx-auto p-4 md:p-10 no-print">
              <div className="flex justify-between items-center bg-white/10 p-6 rounded-[32px] backdrop-blur-xl border border-white/10 sticky top-0 z-[110] shadow-2xl">
                 <div className="flex items-center gap-4 text-white">
                    <div className="w-12 h-12 bg-white rounded-2xl p-2 flex items-center justify-center">
                        <Building2 className="text-primary w-full h-full"/>
                    </div>
                    <div>
                       <h2 className="font-black text-xl uppercase tracking-widest leading-none">{selectedSchool?.name}</h2>
                       <p className="text-white/60 text-[10px] font-bold mt-1 uppercase tracking-widest">Pratinjau Cetak • {selectedBatch.length} Kartu</p>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <button onClick={handlePrint} className="bg-white text-dark px-10 py-4 rounded-2xl font-black shadow-2xl flex items-center gap-3 hover:bg-gray-100 transition active:scale-95">
                       <Printer size={20}/> Download PDF
                    </button>
                    <button onClick={() => { setSelectedBatch(null); setSelectedSchool(null); }} className="p-4 bg-white/10 text-white rounded-full hover:bg-white/20 transition">
                       <X size={24}/>
                    </button>
                 </div>
              </div>
           </div>

           {/* Preview Grid (No Print) */}
           <div className="max-w-5xl w-full mx-auto px-10 pb-24 no-print">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                 {selectedBatch.map((app, idx) => {
                    const template = CARD_TEMPLATES[app.template_id] || CARD_TEMPLATES.t1;
                    return (
                      <div key={app.id} className="space-y-4">
                         <div className="flex items-center justify-between border-b border-white/10 pb-2">
                            <span className="text-white/40 text-[9px] font-black uppercase tracking-widest">KTS #{idx + 1} - {app.profiles?.full_name}</span>
                         </div>
                         <CardPrintLayout app={app} template={template} getQrUrl={getQrUrl} />
                      </div>
                    );
                 })}
              </div>
           </div>

           {/* Real Printing Area (Hidden from UI, Visible during Print) */}
           <div className="print-only-area">
              {selectedBatch.map((app, idx) => (
                 <div key={app.id} className="print-card-wrapper">
                    <CardPrintLayout 
                       app={app} 
                       template={CARD_TEMPLATES[app.template_id] || CARD_TEMPLATES.t1} 
                       getQrUrl={getQrUrl} 
                    />
                 </div>
              ))}
           </div>
        </div>
      )}

      {/* REFINED PRINT STYLES */}
      <style>{`
        /* Hide scrollbar but allow scrolling */
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        @media screen {
          .print-only-area { display: none !important; }
        }

        @media print {
          /* Force color adjust */
          body { 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
          }
          
          /* Hide everything except print area */
          body * { visibility: hidden !important; }
          .print-only-area, .print-only-area * { visibility: visible !important; }
          
          .print-only-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important; /* A4 Width */
            display: grid !important;
            grid-template-columns: 1fr 1fr !important; /* 2 Cards per row */
            column-gap: 10mm !important;
            row-gap: 10mm !important;
            padding: 15mm !important;
            background: white !important;
          }

          .print-card-wrapper {
            page-break-inside: avoid !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 2mm !important;
            align-items: center !important;
          }

          /* Force exact card dimensions */
          .card-to-print {
            width: 86mm !important;
            height: 54mm !important;
            min-width: 86mm !important;
            min-height: 54mm !important;
            border: 0.1mm solid #eee !important;
            border-radius: 3mm !important;
            box-shadow: none !important;
            position: relative !important;
            overflow: hidden !important;
          }

          .print-card-wrapper:nth-child(8n) {
             page-break-after: always !important;
          }
        }

        @page {
          size: A4;
          margin: 0;
        }
      `}</style>
    </div>
  );
};

const CardPrintLayout = ({ app, template, getQrUrl }: any) => {
  const schoolAddress = [
    app.schools?.address,
    app.schools?.district ? `Kec. ${app.schools.district}` : null,
    app.schools?.city,
    app.schools?.province
  ].filter(Boolean).join(', ');

  // Helper to determine font size based on name length
  const getNameStyles = (name: string = '') => {
    if (name.length > 30) return 'text-[7px] leading-[1.1]';
    if (name.length > 22) return 'text-[8px] leading-[1.1]';
    return 'text-[9px] leading-tight';
  };

  const studentName = app.profiles?.full_name || '-';
  const principalName = app.schools?.principal || 'Kepala Sekolah';

  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      {/* FRONT CARD */}
      <div className={`aspect-[86/54] w-[86mm] h-[54mm] bg-gradient-to-br ${template.colors} rounded-2xl overflow-hidden shadow-2xl relative card-to-print shrink-0 border border-white/10`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="p-4 h-full flex flex-col text-white relative z-10">
              <div className="flex items-center gap-2 mb-2.5 border-b border-white/20 pb-1.5">
                <div className="w-10 h-10 bg-white rounded-xl p-1 shadow-sm shrink-0 flex items-center justify-center">
                    <img src={app.schools?.logo || "https://i.pinimg.com/736x/e4/fc/df/e4fcdfa9937a726e285649eb54615769.jpg"} className="w-full h-full object-contain" />
                </div>
                <div className="min-w-0 flex flex-col">
                    <h4 className="text-[10.5px] font-black uppercase leading-none truncate mb-0.5 tracking-tight">{app.schools?.name}</h4>
                    <p className="text-[6.8px] leading-tight opacity-80 italic line-clamp-1 font-semibold">{schoolAddress}</p>
                </div>
              </div>
              
              <div className="flex-1 flex gap-4 items-center">
                <div className="w-[72px] h-[96px] border-2 border-white rounded-xl overflow-hidden shrink-0 shadow-lg bg-gray-200">
                    <img src={app.profiles?.avatar || "https://i.pinimg.com/736x/c2/ec/95/c2ec953ef952d591b2b8ae0d98f59e96.jpg"} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-black uppercase tracking-tighter leading-none mb-3 break-words line-clamp-2 drop-shadow-md">{studentName}</h3>
                    <div className="flex items-end gap-3">
                      <div className="flex-1 space-y-1">
                          <div className="flex flex-col">
                            <span className="text-[7.5px] font-black uppercase opacity-70 leading-none tracking-wider">NIS / No. Induk</span>
                            <span className="text-[11.5px] font-mono font-bold tracking-tighter leading-none mt-1">{app.profiles?.nis || '-'}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[7.5px] font-black uppercase opacity-70 leading-none tracking-wider">Kelas</span>
                            <span className="text-[11.5px] font-black uppercase tracking-tight leading-none mt-1">{app.profiles?.classes?.name || '-'}</span>
                          </div>
                      </div>
                      {/* Substantially Larger QR Code */}
                      <div className="w-[76px] h-[76px] bg-white p-2 rounded-xl shadow-2xl shrink-0">
                          <img src={getQrUrl(app.profiles?.kts_token)} className="w-full h-full" alt="QR" />
                      </div>
                    </div>
                </div>
              </div>
              <div className="mt-1 text-right">
                <p className="text-[6.5px] font-black uppercase opacity-70 tracking-widest font-mono">siswa cerdas smart platform</p>
              </div>
          </div>
      </div>

      {/* BACK CARD */}
      <div className="aspect-[86/54] w-[86mm] h-[54mm] bg-white rounded-2xl overflow-hidden shadow-2xl p-6 flex flex-col border border-gray-100 relative card-to-print shrink-0">
          <div className={`absolute top-0 left-0 w-full h-2.5 bg-gradient-to-r ${template.colors}`}></div>
          
          <div className="mt-2 mb-1">
            <h4 className="text-[11px] font-black uppercase text-dark tracking-tight leading-none mb-1">Ketentuan & Tata Tertib</h4>
            <div className="h-px bg-gray-100 w-full mb-3"></div>
            
            <ul className="text-[8.5px] text-gray-600 leading-normal space-y-1.5 font-medium">
                <li className="flex gap-2"><span>1.</span> Kartu ini wajib dibawa selama berada di lingkungan sekolah.</li>
                <li className="flex gap-2"><span>2.</span> Digunakan untuk presensi, perpustakaan, dan ujian online.</li>
                <li className="flex gap-2"><span>3.</span> Penyalahgunaan kartu akan dikenakan sanksi disiplin.</li>
                <li className="flex gap-2"><span>4.</span> Jika menemukan kartu ini, harap kembalikan ke kantor TU.</li>
            </ul>
          </div>

          <div className="mt-auto flex justify-between items-end gap-4">
            <div className="text-center flex-1 min-w-0">
                <div className="h-px bg-gray-200 w-full mb-2"></div>
                <p className={`font-black uppercase text-dark mb-1 break-words ${getNameStyles(studentName)}`}>{studentName}</p>
                <p className="text-[6.5px] text-gray-400 font-bold uppercase tracking-tight leading-none">Pemegang Kartu</p>
            </div>
            <div className="text-center flex-1 min-w-0">
                <div className="h-px bg-gray-200 w-full mb-2"></div>
                <p className={`font-black uppercase text-dark mb-1 break-words ${getNameStyles(principalName)}`}>{principalName}</p>
                <p className="text-[6.5px] text-gray-400 font-bold uppercase tracking-tight leading-none">Kepala Sekolah</p>
            </div>
          </div>
      </div>
    </div>
  );
};

export default CardApprovalCenter;
