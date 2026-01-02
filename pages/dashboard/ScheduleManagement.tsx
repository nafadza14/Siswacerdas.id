
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Plus, Trash2, Edit2, BookOpen, User, Loader2, X, Save, ChevronRight } from 'lucide-react';
import { dataService, stringifyError } from '../../services/supabaseService';
import { UserRole } from '../../types';

const ScheduleManagement: React.FC = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState('Senin');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [schoolId, setSchoolId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    subject: '',
    teacher_id: '',
    room: '',
    start_time: '',
    end_time: ''
  });

  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  const loadSchedules = async (classId: string) => {
    const { data } = await dataService.getSchedulesByClass(classId);
    if (data) setSchedules(data);
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const res = await dataService.getCurrentUserProfile();
      const sId = res?.profile?.school_id;
      if (sId) {
        setSchoolId(sId);
        const [clsRes, tcRes] = await Promise.all([
          dataService.getClassesBySchool(sId),
          dataService.getProfilesBySchool(sId, UserRole.TEACHER)
        ]);
        if (clsRes.data) {
          setClasses(clsRes.data);
          if (clsRes.data.length > 0) {
            setSelectedClass(clsRes.data[0].id);
            await loadSchedules(clsRes.data[0].id);
          }
        }
        if (tcRes.data) setTeachers(tcRes.data);
      }
      setIsLoading(false);
    };
    init();
  }, []);

  const handleClassChange = async (id: string) => {
    setSelectedClass(id);
    await loadSchedules(id);
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({ subject: '', teacher_id: '', room: '', start_time: '', end_time: '' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: any) => {
    setEditingId(item.id);
    setFormData({
      subject: item.subject,
      teacher_id: item.teacher_id,
      room: item.room || '',
      start_time: item.start_time.slice(0, 5),
      end_time: item.end_time.slice(0, 5)
    });
    setIsModalOpen(true);
  };

  const handleSaveSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass || !schoolId) return;
    setIsSubmitting(true);

    const payload = {
      ...formData,
      day: activeDay,
      class_id: selectedClass,
      school_id: schoolId
    };

    let result;
    if (editingId) {
      result = await dataService.updateSchedule(editingId, payload);
    } else {
      result = await dataService.addSchedule(payload);
    }

    if (result.error) {
      alert(stringifyError(result.error));
    } else {
      setIsModalOpen(false);
      await loadSchedules(selectedClass);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus jadwal ini? Tindakan ini tidak dapat dibatalkan.')) {
      const { error } = await dataService.deleteSchedule(id);
      if (error) {
        alert(stringifyError(error));
      } else {
        // Refresh local data
        setSchedules(prev => prev.filter(s => s.id !== id));
      }
    }
  };

  const currentDaySchedules = schedules
    .filter(s => s.day === activeDay)
    .sort((a, b) => a.start_time.localeCompare(b.start_time));

  if (isLoading) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-primary" size={48} /></div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-[32px] border border-gray-100 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-2xl"><Calendar size={24} /></div>
          <div>
            <h1 className="text-xl font-bold text-dark">Manajemen Jadwal Pelajaran</h1>
            <p className="text-sm text-gray-500">Kelola jadwal belajar mengajar per kelas secara dinamis.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm h-fit">
          <h2 className="font-bold text-dark mb-4 flex items-center gap-2"><BookOpen size={18} className="text-primary" /> Daftar Kelas</h2>
          <div className="space-y-2">
            {classes.map(cls => (
              <button key={cls.id} onClick={() => handleClassChange(cls.id)} className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all ${selectedClass === cls.id ? 'bg-primary text-white shadow-lg' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
                <span className="text-sm font-bold">{cls.name}</span>
                <ChevronRight size={16} className={selectedClass === cls.id ? 'opacity-100' : 'opacity-30'} />
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-2 rounded-2xl border border-gray-100 flex overflow-x-auto gap-1 shadow-sm sticky top-0 z-10">
            {days.map(day => (
              <button key={day} onClick={() => setActiveDay(day)} className={`flex-1 py-2 px-6 rounded-xl text-sm font-bold transition-all ${activeDay === day ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}>{day}</button>
            ))}
          </div>

          <div className="flex justify-between items-center px-2">
            <h3 className="font-bold text-dark flex items-center gap-2">
              <Clock size={18} className="text-primary" />
              Jadwal Hari {activeDay}
            </h3>
            <button onClick={handleOpenAddModal} className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-teal-600 transition-all shadow-lg shadow-teal-100"><Plus size={16} /> Tambah Slot</button>
          </div>

          <div className="space-y-4">
            {currentDaySchedules.length > 0 ? currentDaySchedules.map((item) => (
              <div key={item.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-6 group hover:border-primary/30 transition-all">
                <div className="px-4 py-2 rounded-2xl font-mono font-bold text-sm bg-blue-50 text-blue-600 min-w-[120px] text-center">{item.start_time.slice(0,5)} - {item.end_time.slice(0,5)}</div>
                <div className="flex-1">
                   <h4 className="font-black text-dark uppercase text-lg leading-tight tracking-tight">{item.subject}</h4>
                   <div className="flex flex-wrap gap-4 mt-1">
                      <span className="text-xs text-gray-400 flex items-center gap-1.5"><User size={12} className="text-primary"/> {item.profiles?.full_name || 'Guru Belum Ditentukan'}</span>
                      <span className="text-xs text-gray-400 flex items-center gap-1.5"><MapPin size={12} className="text-primary"/> {item.room || 'Ruangan -'}</span>
                   </div>
                </div>
                <div className="flex items-center gap-2">
                   <button onClick={() => handleOpenEditModal(item)} className="p-2.5 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="Edit Jadwal"><Edit2 size={18} /></button>
                   <button onClick={() => handleDelete(item.id)} className="p-2.5 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Hapus Jadwal"><Trash2 size={18} /></button>
                </div>
              </div>
            )) : (
              <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-[32px] p-16 text-center text-gray-400 italic">
                <Calendar size={48} className="mx-auto mb-4 opacity-20" />
                <p>Belum ada jadwal pelajaran yang diatur untuk hari {activeDay}.</p>
                <button onClick={handleOpenAddModal} className="mt-4 text-primary font-bold hover:underline text-sm">Klik di sini untuk menambah</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-[40px] p-8 shadow-2xl relative">
            <div className="flex justify-between items-center mb-8">
               <h2 className="text-2xl font-black text-dark tracking-tighter">{editingId ? 'Edit Jadwal' : 'Tambah Jadwal'}</h2>
               <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition"><X size={24} /></button>
            </div>
            <form onSubmit={handleSaveSchedule} className="space-y-5">
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Nama Mata Pelajaran</label>
                  <input required type="text" placeholder="Contoh: Matematika Wajib" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-dark focus:ring-2 focus:ring-primary" />
               </div>
               
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Lokasi Ruangan</label>
                  <input required type="text" placeholder="Contoh: Lab Komputer 1" value={formData.room} onChange={e => setFormData({...formData, room: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-dark focus:ring-2 focus:ring-primary" />
               </div>

               <div className="space-y-1.5">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Guru Pengajar</label>
                 <select required value={formData.teacher_id} onChange={e => setFormData({...formData, teacher_id: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-dark appearance-none focus:ring-2 focus:ring-primary">
                    <option value="">Pilih Guru Pengajar</option>
                    {teachers.map(t => <option key={t.id} value={t.id}>{t.full_name}</option>)}
                 </select>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Jam Mulai</label>
                    <input required type="time" value={formData.start_time} onChange={e => setFormData({...formData, start_time: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-dark focus:ring-2 focus:ring-primary" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Jam Selesai</label>
                    <input required type="time" value={formData.end_time} onChange={e => setFormData({...formData, end_time: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-dark focus:ring-2 focus:ring-primary" />
                  </div>
               </div>

               <button disabled={isSubmitting} className="w-full bg-primary text-white py-5 rounded-[24px] font-black text-lg shadow-xl shadow-teal-100 flex items-center justify-center gap-3 hover:bg-teal-600 transition-all active:scale-95 disabled:opacity-50 mt-4">
                  {isSubmitting ? <Loader2 className="animate-spin" size={24}/> : <Save size={24}/>} 
                  {editingId ? 'Simpan Perubahan' : 'Terbitkan Jadwal'}
               </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleManagement;
