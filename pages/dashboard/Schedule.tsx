
import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Loader2, Calendar } from 'lucide-react';
import { dataService } from '../../services/supabaseService';

const Schedule: React.FC = () => {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [classInfo, setClassInfo] = useState<string>('');

  const today = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][new Date().getDay()];

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      const res = await dataService.getCurrentUserProfile();
      if (res?.profile?.class_id) {
        // Ambil info nama kelas dari relasi schools jika ada, atau fetch manual
        const { data } = await dataService.getSchedulesByClass(res.profile.class_id);
        if (data) setSchedules(data.filter(s => s.day === today));
      }
      setIsLoading(false);
    };
    fetch();
  }, [today]);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between gap-4">
        <div>
           <h1 className="text-2xl font-black text-dark uppercase">Jadwal Pelajaran</h1>
           <p className="text-gray-500 font-medium">{today}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <div className="bg-primary/10 text-primary px-6 py-2 rounded-2xl flex items-center justify-center font-bold text-sm">
           Aktif Hari Ini
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-primary" size={40} /></div>
      ) : schedules.length > 0 ? (
        <div className="space-y-4">
          {schedules.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-[32px] border border-gray-100 flex flex-col sm:flex-row items-center gap-6 shadow-sm group hover:shadow-md transition">
               <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-2xl font-mono font-bold text-sm flex items-center gap-2">
                 <Clock size={16} /> {item.start_time.slice(0,5)} - {item.end_time.slice(0,5)}
               </div>
               <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl font-black text-dark uppercase group-hover:text-primary transition-colors">{item.subject}</h3>
                  <p className="text-gray-500 text-sm">Guru: {item.profiles?.full_name}</p>
               </div>
               <div className="bg-gray-50 px-4 py-2 rounded-2xl text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <MapPin size={14} className="text-primary"/> {item.room}
               </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white rounded-[40px] border border-gray-100">
           <Calendar className="mx-auto text-gray-100 mb-4" size={64} />
           <p className="text-gray-400 font-bold italic">Tidak ada jadwal pelajaran untuk hari ini ({today}).</p>
        </div>
      )}
    </div>
  );
};

export default Schedule;
