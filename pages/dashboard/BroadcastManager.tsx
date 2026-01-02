
import React, { useState, useEffect } from 'react';
import { Megaphone, Send, Users, UserCheck, Loader2, Trash2, Clock, CheckCircle } from 'lucide-react';
import { dataService, stringifyError } from '../../services/supabaseService';

const BroadcastManager: React.FC = () => {
  const [target, setTarget] = useState<'ALL' | 'STUDENTS' | 'TEACHERS'>('ALL');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [authorId, setAuthorId] = useState<string | null>(null);

  const loadHistory = async (sId: string) => {
    const { data } = await dataService.getBroadcasts(sId);
    if (data) setHistory(data);
  };

  useEffect(() => {
    const init = async () => {
      const res = await dataService.getCurrentUserProfile();
      if (res?.profile) {
        setSchoolId(res.profile.school_id);
        setAuthorId(res.profile.id);
        await loadHistory(res.profile.school_id);
      }
    };
    init();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !schoolId) return;
    
    setIsLoading(true);
    const payload = {
      school_id: schoolId,
      author_id: authorId,
      title,
      content,
      target,
      type: 'info'
    };

    const { error } = await dataService.addBroadcast(payload);
    if (error) {
      alert(stringifyError(error));
    } else {
      setTitle('');
      setContent('');
      await loadHistory(schoolId);
      alert('Pengumuman berhasil disebarkan!');
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Hapus pengumuman ini?')) {
      await dataService.deleteBroadcast(id);
      await loadHistory(schoolId!);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 text-primary rounded-2xl"><Megaphone size={24}/></div>
        <div>
          <h1 className="text-2xl font-black text-dark tracking-tight uppercase">Broadcast Hub</h1>
          <p className="text-gray-500 font-medium">Kirim pesan penting ke seluruh warga sekolah di aplikasi.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSend} className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-2xl shadow-teal-100/10 space-y-6 sticky top-24">
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Pilih Target Penerima</label>
              <div className="flex gap-2">
                {[
                  { id: 'ALL', label: 'Semua', icon: Megaphone },
                  { id: 'STUDENTS', label: 'Siswa', icon: Users },
                  { id: 'TEACHERS', label: 'Guru', icon: UserCheck },
                ].map(t => (
                  <button 
                    key={t.id}
                    type="button"
                    onClick={() => setTarget(t.id as any)}
                    className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                      target === t.id ? 'bg-primary/10 border-primary text-primary' : 'bg-gray-50 border-transparent text-gray-400 hover:bg-gray-100'
                    }`}
                  >
                    <t.icon size={18} />
                    <span className="text-[9px] font-black uppercase">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Judul Pesan</label>
                  <input required type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Contoh: Info Libur Semester" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-dark focus:ring-2 focus:ring-primary" />
               </div>
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Isi Pengumuman</label>
                  <textarea required rows={6} value={content} onChange={e => setContent(e.target.value)} placeholder="Tulis detail pengumuman..." className="w-full bg-gray-50 border-none rounded-2xl p-4 font-medium text-dark focus:ring-2 focus:ring-primary resize-none" />
               </div>
            </div>

            <button disabled={isLoading} className="w-full bg-primary text-white py-5 rounded-[24px] font-black shadow-xl shadow-teal-100 flex items-center justify-center gap-3 hover:bg-teal-600 transition active:scale-95 disabled:opacity-50">
               {isLoading ? <Loader2 className="animate-spin" size={20}/> : <Send size={20} />} 
               Sebarkan Sekarang
            </button>
          </form>
        </div>

        {/* History Column */}
        <div className="lg:col-span-2 space-y-6">
           <h3 className="font-black text-dark text-lg uppercase flex items-center gap-2"><Clock size={20} className="text-primary"/> Riwayat Pengiriman</h3>
           <div className="space-y-4">
              {history.length > 0 ? history.map(item => (
                <div key={item.id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm group hover:border-primary/30 transition-all flex gap-6">
                   <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                      {item.target === 'ALL' ? <Megaphone size={20}/> : item.target === 'STUDENTS' ? <Users size={20}/> : <UserCheck size={20}/>}
                   </div>
                   <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                         <h4 className="font-black text-dark text-lg uppercase truncate pr-4">{item.title}</h4>
                         <button onClick={() => handleDelete(item.id)} className="text-gray-300 hover:text-red-500 transition"><Trash2 size={16}/></button>
                      </div>
                      <p className="text-gray-500 text-sm mb-4 leading-relaxed">{item.content}</p>
                      <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                         <span className="bg-gray-100 px-3 py-1 rounded-lg">Target: {item.target}</span>
                         <span>{new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                   </div>
                </div>
              )) : (
                <div className="py-20 text-center bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
                   <Megaphone className="mx-auto text-gray-200 mb-4" size={48}/>
                   <p className="text-gray-400 font-bold italic">Belum ada pengumuman yang dikirim.</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default BroadcastManager;
