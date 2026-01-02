
import React, { useState, useEffect } from 'react';
import { Save, UserCheck, MessageCircle, MapPin, Loader2, Calendar, Clock, BookOpen, Megaphone } from 'lucide-react';
import { dataService, stringifyError } from '../../services/supabaseService';
import { AttendanceStatus } from '../../types';

const Attendance: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [classes, setClasses] = useState<any[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState<Record<string, AttendanceStatus>>({});
  const [loading, setLoading] = useState(false);
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);
  const [teacherSchedules, setTeacherSchedules] = useState<any[]>([]);
  const [broadcasts, setBroadcasts] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  const getIndonesianDay = () => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[new Date().getDay()];
  };

  useEffect(() => {
    const init = async () => {
      setIsLoadingClasses(true);
      const res = await dataService.getCurrentUserProfile();
      if (res?.profile) {
        const schoolId = res.profile.school_id;
        const teacherId = res.profile.id;
        
        // Load All Classes
        const clsRes = await dataService.getClassesBySchool(schoolId);
        if (clsRes.data) {
          setClasses(clsRes.data);
          if (clsRes.data.length > 0) setSelectedClass(clsRes.data[0].id);
        }

        // Load Teacher Schedule
        const schedRes = await dataService.getSchedulesByTeacher(teacherId);
        if (schedRes.data) {
          const today = getIndonesianDay();
          setTeacherSchedules(schedRes.data.filter(s => s.day === today));
        }

        // Load Broadcasts for Teachers
        const bRes = await dataService.getBroadcasts(schoolId, 'TEACHERS');
        if (bRes.data) setBroadcasts(bRes.data);
      }
      setIsLoadingClasses(false);
    };
    init();
  }, []);

  useEffect(() => {
    const loadStudents = async () => {
      if (!selectedClass) return;
      const schoolId = classes.find(c => c.id === selectedClass)?.school_id;
      if (!schoolId) return;
      const { data } = await dataService.getProfilesBySchool(schoolId, 'STUDENT' as any);
      if (data) {
        setStudents(data.filter(s => s.class_id === selectedClass));
      }
    };
    loadStudents();
  }, [selectedClass, classes]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceData(prev => ({ ...prev, [studentId]: status }));
  };

  const submitAttendance = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Presensi Berhasil Disimpan!");
    }, 1500);
  };

  if (isLoadingClasses) {
    return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-primary" size={48} /></div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Announcements Widget for Teachers */}
      {broadcasts.length > 0 && (
        <div className="bg-primary text-white p-6 rounded-[32px] shadow-xl shadow-teal-100/20 relative overflow-hidden group">
           <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md"><Megaphone size={24}/></div>
                 <div>
                    <h3 className="font-black uppercase tracking-tight text-lg leading-none">{broadcasts[0].title}</h3>
                    <p className="text-white/80 text-sm mt-1 line-clamp-1">{broadcasts[0].content}</p>
                 </div>
              </div>
              <button onClick={() => alert(broadcasts[0].content)} className="px-5 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-black uppercase tracking-widest backdrop-blur-md transition">Baca Detail</button>
           </div>
           <div className="absolute right-0 top-0 opacity-10 group-hover:scale-110 transition-transform"><Megaphone size={120} /></div>
        </div>
      )}

      {/* Teacher's Today Schedule Widget */}
      <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-2xl shadow-teal-100/10">
         <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl"><Calendar size={24}/></div>
            <h2 className="text-xl font-black text-dark tracking-tight uppercase">Jadwal Mengajar Hari Ini</h2>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teacherSchedules.length > 0 ? teacherSchedules.map(item => (
              <div key={item.id} className="p-4 bg-gray-50 rounded-3xl border border-gray-100 flex items-center gap-4 group hover:bg-primary/5 hover:border-primary/20 transition-all cursor-pointer" onClick={() => setSelectedClass(item.class_id)}>
                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-primary border border-gray-100 group-hover:scale-110 transition-transform">
                    {item.classes?.name?.charAt(0) || 'K'}
                 </div>
                 <div className="min-w-0">
                    <p className="text-xs font-black text-dark uppercase truncate">{item.subject}</p>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                       <Clock size={10}/> {item.start_time.slice(0,5)} • {item.classes?.name}
                    </div>
                 </div>
              </div>
            )) : (
              <div className="col-span-full py-6 text-center text-gray-400 italic font-medium">Tidak ada jadwal mengajar hari ini.</div>
            )}
         </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-dark tracking-tight uppercase">Smart Attendance</h1>
          <p className="text-gray-500 font-medium">Isi presensi manual untuk kelas terpilih</p>
        </div>
        
        <div className="flex flex-wrap gap-4">
            <select 
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-6 py-3 rounded-2xl border-none bg-white shadow-sm font-bold text-sm focus:ring-2 focus:ring-primary min-w-[200px]"
            >
              <option value="">Pilih Kelas</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)}
              className="px-6 py-3 rounded-2xl border-none bg-white shadow-sm font-bold text-sm focus:ring-2 focus:ring-primary"
            />
        </div>
      </div>

      <div className="bg-white rounded-[40px] shadow-2xl shadow-teal-100/10 border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-8 py-5 font-black text-[10px] text-gray-400 uppercase tracking-widest">Nama Siswa</th>
                <th className="px-8 py-5 font-black text-[10px] text-gray-400 uppercase tracking-widest">NISN / ID</th>
                <th className="px-8 py-5 font-black text-[10px] text-gray-400 uppercase tracking-widest text-center">Metode</th>
                <th className="px-8 py-5 font-black text-[10px] text-gray-400 uppercase tracking-widest text-center">Status Kehadiran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {students.length > 0 ? students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-8 py-4 flex items-center gap-4">
                    {student.avatar ? (
                      <img src={student.avatar} alt="" className="w-10 h-10 rounded-2xl object-cover border-2 border-white shadow-sm" />
                    ) : (
                      <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-xs">{student.full_name?.charAt(0)}</div>
                    )}
                    <div>
                      <p className="font-bold text-dark">{student.full_name}</p>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{classes.find(c => c.id === selectedClass)?.name}</p>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-gray-500 font-mono text-xs">{student.nis || student.id.slice(0,8)}</td>
                  <td className="px-8 py-4 text-center">
                     <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full shadow-sm">
                       <BookOpen size={12} /> Guru Mapel
                     </span>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex justify-center gap-1">
                      {[
                        { s: AttendanceStatus.PRESENT, l: 'H', c: 'bg-green-500' },
                        { s: AttendanceStatus.LATE, l: 'T', c: 'bg-orange-400' },
                        { s: AttendanceStatus.SICK, l: 'S', c: 'bg-blue-400' },
                        { s: AttendanceStatus.ABSENT, l: 'A', c: 'bg-red-500' }
                      ].map((item) => (
                        <button
                          key={item.s}
                          onClick={() => handleStatusChange(student.id, item.s)}
                          className={`w-10 h-10 rounded-xl font-black text-sm transition-all border-2 ${
                            attendanceData[student.id] === item.s
                              ? `${item.c} text-white border-transparent shadow-lg scale-110`
                              : 'text-gray-300 border-gray-100 hover:border-gray-300'
                          }`}
                        >
                          {item.l}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="py-20 text-center text-gray-400 italic font-medium">Pilih kelas untuk menampilkan daftar siswa.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        
        {students.length > 0 && (
          <div className="p-8 bg-gray-50/50 flex justify-between items-center border-t border-gray-100">
             <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Pastikan data sudah benar sebelum menyimpan.</p>
             <button 
              onClick={submitAttendance}
              disabled={loading}
              className="flex items-center gap-3 bg-primary hover:bg-teal-600 text-white px-10 py-4 rounded-[24px] font-black shadow-2xl shadow-teal-100 transition disabled:opacity-70 active:scale-95 uppercase tracking-widest text-xs"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              Simpan Presensi
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
