
import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Upload, Edit, Trash2, X, Save, User, Mail, Shield, Loader2, Camera, Phone, Image as ImageIcon, BookOpen, Layers, Users, ChevronRight, CheckCircle, AlertCircle, Lock, Hash } from 'lucide-react';
import { dataService, stringifyError } from '../../services/supabaseService';
import { UserRole } from '../../types';

// Toast Component
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
    <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-md animate-fade-in-left ${
      type === 'success' ? 'bg-teal-500/90 border-teal-400 text-white' : 'bg-red-500/90 border-red-400 text-white'
    }`}>
      {type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
      <p className="font-bold text-sm tracking-tight">{message}</p>
      <button onClick={onClose} className="ml-4 opacity-50 hover:opacity-100 transition"><X size={16}/></button>
    </div>
  );
};

const DataMaster: React.FC = () => {
  const [tab, setTab] = useState<'CLASSES' | UserRole.STUDENT | UserRole.TEACHER>('CLASSES');
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [adminProfile, setAdminProfile] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingClassStudents, setViewingClassStudents] = useState<any | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [newClassName, setNewClassName] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    whatsapp: '', 
    password: '',
    avatar: '',
    classId: '',
    nis: '',
    subjects: '',
    taughtClasses: [] as string[]
  });

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const resizeImage = (base64Str: string, maxWidth = 400, maxHeight = 500): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = base64Str;
      img.onerror = (e) => reject(e);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
    });
  };

  const loadUsers = async (schoolId: string, role: UserRole) => {
    if (!schoolId) return;
    const { data, error } = await dataService.getProfilesBySchool(schoolId, role);
    if (!error && data) {
      setUsers(data.filter(Boolean));
    }
  };

  const loadClassesAndStudents = async (schoolId: string) => {
    if (!schoolId) return;
    const [clsRes, stdRes] = await Promise.all([
      dataService.getClassesBySchool(schoolId),
      dataService.getProfilesBySchool(schoolId, UserRole.STUDENT)
    ]);
    if (clsRes.data) setClasses(clsRes.data);
    if (stdRes.data) setAllStudents(stdRes.data);
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        const res = await dataService.getCurrentUserProfile();
        if (res?.profile) {
          setAdminProfile(res.profile);
          const schoolId = res.profile.school_id;
          if (schoolId) {
            await loadClassesAndStudents(schoolId);
            if (tab !== 'CLASSES') {
              await loadUsers(schoolId, tab as UserRole);
            }
          }
        }
      } catch (err) {
        console.error("Init error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [tab]);

  const handleAddClass = async () => {
    if (!newClassName.trim() || !adminProfile?.school_id) return;
    setIsSubmitting(true);
    const { error } = await dataService.addClass(adminProfile.school_id, newClassName);
    if (error) showNotification(stringifyError(error), "error");
    else {
      setNewClassName('');
      await loadClassesAndStudents(adminProfile.school_id);
      showNotification("Kelas berhasil ditambahkan");
    }
    setIsSubmitting(false);
  };

  const handleEditUser = (user: any) => {
    setEditingUserId(user.id);
    setFormData({
      name: user.full_name || '',
      email: user.email || '',
      whatsapp: user.whatsapp || '',
      password: '', 
      avatar: user.avatar || '',
      classId: user.class_id || '',
      nis: user.nis || '',
      subjects: user.subjects ? user.subjects.join(', ') : '',
      taughtClasses: user.taught_classes || []
    });
    setIsAdding(true);
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm(`Hapus data ini secara permanen?`) || !adminProfile?.school_id) return;
    const { error } = await dataService.deleteProfile(id);
    if (error) showNotification(stringifyError(error), "error");
    else {
      showNotification("Data berhasil dihapus");
      await loadUsers(adminProfile.school_id, tab as UserRole);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        if (typeof reader.result === 'string') {
          try {
            const resized = await resizeImage(reader.result);
            setFormData(prev => ({ ...prev, avatar: resized }));
          } catch (err) {
            showNotification("Gagal memproses gambar", "error");
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const takePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      const photo = canvas.toDataURL('image/jpeg');
      
      const stream = videoRef.current.srcObject;
      if (stream instanceof MediaStream) {
        stream.getTracks().forEach(track => track.stop());
      }

      resizeImage(photo).then(resized => {
        setFormData(prev => ({ ...prev, avatar: resized }));
        setIsCameraOpen(false);
      }).catch(() => {
        showNotification("Gagal mengambil foto", "error");
      });
    }
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminProfile?.school_id) {
      showNotification("Identitas sekolah belum dimuat. Mohon tunggu.", "error");
      return;
    }
    setIsSubmitting(true);

    try {
      if (editingUserId) {
        const updates: any = { 
          full_name: formData.name, 
          whatsapp: formData.whatsapp, 
          avatar: formData.avatar, 
          nis: formData.nis 
        };
        if (tab === UserRole.STUDENT) updates.class_id = formData.classId;
        if (tab === UserRole.TEACHER) {
          updates.subjects = formData.subjects.split(',').map(s => s.trim()).filter(Boolean);
          updates.taught_classes = formData.taughtClasses;
        }
        const { error } = await dataService.updateProfile(editingUserId, updates);
        if (error) throw error;
        
        showNotification("Data berhasil diperbarui!");
        setIsAdding(false); 
        setEditingUserId(null);
        await loadUsers(adminProfile.school_id, tab as UserRole);
      } else {
        const { error } = await dataService.signUp({
          email: formData.email, 
          password: formData.password, 
          fullName: formData.name, 
          role: tab as UserRole,
          schoolId: adminProfile.school_id, 
          whatsapp: formData.whatsapp, 
          avatar: formData.avatar,
          nis: formData.nis,
          classId: tab === UserRole.STUDENT ? formData.classId : undefined,
          subjects: tab === UserRole.TEACHER ? formData.subjects.split(',').map(s => s.trim()).filter(Boolean) : undefined,
        });
        
        if (error) {
          showNotification("Gagal Simpan: " + stringifyError(error), "error");
          setIsSubmitting(false);
          return;
        }
        
        showNotification(`Berhasil mendaftarkan ${formData.name}!`);
        setIsAdding(false);
        setFormData({ name: '', email: '', whatsapp: '', password: '', avatar: '', classId: '', nis: '', subjects: '', taughtClasses: [] });
        
        setTimeout(async () => {
          await loadUsers(adminProfile.school_id, tab as UserRole);
        }, 1200);
      }
    } catch (err) {
      showNotification(`Kesalahan: ${stringifyError(err)}`, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = users.filter(u => {
    if (!u) return false;
    const search = searchTerm.toLowerCase();
    const nameMatch = u.full_name?.toLowerCase().includes(search);
    const emailMatch = u.email?.toLowerCase().includes(search);
    const nisMatch = u.nis ? u.nis.toLowerCase().includes(search) : false;
    return nameMatch || emailMatch || nisMatch;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-dark tracking-tight">Manajemen Data Master</h1>
          <p className="text-gray-500 font-medium text-sm">Database Kelas, Siswa & Guru Sekolah</p>
        </div>
        <div className="flex gap-2">
          {tab !== 'CLASSES' && (
            <button 
              disabled={isLoading}
              onClick={() => { 
                setEditingUserId(null); 
                setIsAdding(true); 
                setFormData({ 
                  name: '', email: '', whatsapp: '', avatar: '', classId: '', nis: '', subjects: '', taughtClasses: [],
                  password: Math.random().toString(36).slice(-8) 
                }); 
              }} 
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-xl shadow-teal-100 text-sm hover:bg-teal-600 transition disabled:opacity-50"
            >
              <Plus size={16} /> Tambah {tab === UserRole.STUDENT ? 'Siswa' : 'Guru'}
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-[40px] shadow-2xl shadow-teal-100/10 border border-gray-100 overflow-hidden mb-8">
        <div className="flex border-b border-gray-100 overflow-x-auto">
           <button onClick={() => setTab('CLASSES')} className={`px-10 py-5 font-black text-[10px] uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${tab === 'CLASSES' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-gray-400 hover:text-dark'}`}>Manajemen Kelas</button>
           <button onClick={() => setTab(UserRole.STUDENT)} className={`px-10 py-5 font-black text-[10px] uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${tab === UserRole.STUDENT ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-gray-400 hover:text-dark'}`}>Database Siswa</button>
           <button onClick={() => setTab(UserRole.TEACHER)} className={`px-10 py-5 font-black text-[10px] uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${tab === UserRole.TEACHER ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-gray-400 hover:text-dark'}`}>Database Guru</button>
        </div>

        <div className="p-8">
           {tab === 'CLASSES' ? (
             <div className="space-y-8 animate-fade-in">
                <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                   <h3 className="font-bold text-dark mb-4 text-sm uppercase tracking-widest">Tambah Kelas Baru</h3>
                   <div className="flex flex-col sm:flex-row gap-4">
                      <input type="text" value={newClassName} onChange={e => setNewClassName(e.target.value)} placeholder="Contoh: X IPA 1, XI IPS 2" className="flex-1 bg-white border-none rounded-2xl px-5 py-4 font-bold text-dark focus:ring-2 focus:ring-primary shadow-sm" />
                      <button onClick={handleAddClass} disabled={isSubmitting || !newClassName.trim() || !adminProfile?.school_id} className="bg-primary text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-teal-100 hover:bg-teal-600 transition disabled:opacity-50 flex items-center justify-center gap-2">
                         {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />} 
                         {isSubmitting ? 'Simpan...' : 'Simpan Kelas'}
                      </button>
                   </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {classes.map(c => (
                        <div key={c.id} className="bg-white p-6 rounded-[32px] border border-gray-100 hover:border-primary/40 transition-all group shadow-sm hover:shadow-xl hover:shadow-teal-100/20">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-black text-xl group-hover:bg-primary group-hover:text-white transition-colors">{c.name?.charAt(0)}</div>
                                <button onClick={(e) => { e.stopPropagation(); if(confirm('Hapus kelas?')) dataService.deleteClass(c.id).then(() => loadClassesAndStudents(adminProfile?.school_id)); }} className="p-2 text-gray-300 hover:text-red-500 rounded-xl transition"><Trash2 size={18}/></button>
                            </div>
                            <h4 className="font-black text-dark text-xl mb-1">{c.name}</h4>
                            <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-6"><Users size={14} className="text-primary" /> {allStudents.filter(s => s.class_id === c.id || s.classId === c.id).length} Siswa Terdaftar</div>
                            <button onClick={() => setViewingClassStudents(c)} className="w-full py-3 bg-gray-50 text-gray-500 font-bold rounded-2xl group-hover:bg-primary group-hover:text-white transition-all flex items-center justify-center gap-2 text-sm">Lihat Daftar <ChevronRight size={16} /></button>
                        </div>
                   ))}
                </div>
             </div>
           ) : (
             <>
               <div className="relative mb-8">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                  <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder={`Cari nama, email, atau NIS...`} className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary focus:bg-white transition font-medium" />
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                           <th className="pb-4 px-6">Informasi Personal</th>
                           <th className="pb-4 px-6">{tab === UserRole.STUDENT ? 'Kelas & NIS' : 'Mapel'}</th>
                           <th className="pb-4 px-6 text-center">Status</th>
                           <th className="pb-4 px-6 text-center">Aksi</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50">
                        {isLoading ? (
                          <tr><td colSpan={4} className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-primary" /></td></tr>
                        ) : filteredUsers.length > 0 ? filteredUsers.map(u => (
                            <tr key={u?.id} className="group hover:bg-gray-50/50 transition">
                               <td className="py-5 px-6">
                                  <div className="flex items-center gap-4">
                                     {u?.avatar ? <img src={u.avatar} className="w-12 h-12 rounded-2xl object-cover" /> : <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black">{u?.full_name?.charAt(0)}</div>}
                                     <div><p className="font-bold text-dark text-base mb-0.5">{u?.full_name}</p><p className="text-xs text-gray-400">{u?.email}</p></div>
                                  </div>
                               </td>
                               <td className="py-5 px-6">
                                  <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-lg uppercase w-max">
                                      {tab === UserRole.STUDENT 
                                        ? (classes.find(c => c.id === u.class_id || c.id === u.classId)?.name || 'N/A') 
                                        : (u.subjects?.join(', ') || 'N/A')}
                                    </span>
                                    {tab === UserRole.STUDENT && u.nis && <span className="text-[10px] font-mono text-primary bg-primary/5 px-3 py-1 rounded-lg w-max">NIS: {u.nis}</span>}
                                  </div>
                               </td>
                               <td className="py-5 px-6 text-center"><span className="px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest">AKTIF</span></td>
                               <td className="py-5 px-6 text-center">
                                  <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition">
                                     <button onClick={() => handleEditUser(u)} className="p-3 text-blue-500 hover:bg-blue-50 rounded-xl transition"><Edit size={18}/></button>
                                     <button onClick={() => handleDeleteUser(u.id)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition"><Trash2 size={18}/></button>
                                  </div>
                               </td>
                            </tr>
                        )) : (
                          <tr><td colSpan={4} className="py-20 text-center text-gray-400 italic">Database kosong.</td></tr>
                        )}
                     </tbody>
                  </table>
               </div>
             </>
           )}
        </div>
      </div>

      {/* Modal View Class Students */}
      {viewingClassStudents && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-md">
            <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl animate-fade-in-up flex flex-col max-h-[85vh]">
                <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-2xl font-black text-dark tracking-tight">Daftar Siswa {viewingClassStudents.name}</h2>
                    <button onClick={() => setViewingClassStudents(null)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition"><X size={24}/></button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-4">
                    {allStudents.filter(s => s.class_id === viewingClassStudents.id || s.classId === viewingClassStudents.id).map(s => (
                        <div key={s.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-3xl group hover:border-primary/30 transition">
                            <div className="flex items-center gap-4">
                                {s.avatar ? <img src={s.avatar} className="w-12 h-12 rounded-2xl object-cover" /> : <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center font-black">{s.full_name?.charAt(0)}</div>}
                                <div>
                                  <p className="font-bold text-dark">{s.full_name}</p>
                                  <p className="text-[10px] text-gray-400">NIS: {s.nis || '-'}</p>
                                </div>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                               <button onClick={() => { setViewingClassStudents(null); handleEditUser(s); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit size={16}/></button>
                               <button onClick={() => handleDeleteUser(s.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}

      {/* MODAL REGISTRASI */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto">
          <div className="bg-white w-full max-w-5xl rounded-[50px] p-0 shadow-2xl animate-fade-in-up my-8 relative overflow-hidden">
            <div className="p-10 pb-4 flex justify-between items-center">
               <h2 className="text-4xl font-black text-dark tracking-tighter lowercase">
                 {editingUserId ? `perbarui ${tab === UserRole.STUDENT ? 'siswa' : 'guru'}` : `registrasi ${tab === UserRole.STUDENT ? 'siswa' : 'guru'}`}
               </h2>
               <button onClick={() => { setIsAdding(false); setEditingUserId(null); setIsCameraOpen(false); }} className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition text-dark"><X size={24}/></button>
            </div>
            
            <form onSubmit={handleSaveUser} className="px-10 pb-10 pt-4">
               <div className="flex flex-col lg:flex-row gap-12">
                 <div className="flex-1 space-y-8">
                    <div>
                        <label className="text-[11px] font-black text-gray-400 uppercase block mb-3 px-1 tracking-widest">Nama Lengkap</label>
                        <div className="relative">
                          <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Masukkan nama..." className="w-full bg-gray-50 border-none rounded-2xl px-6 py-5 font-bold text-dark focus:ring-2 focus:ring-primary focus:bg-white transition" />
                          <User size={22} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-200" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {tab === UserRole.STUDENT && (
                          <div className="space-y-3">
                              <label className="text-[11px] font-black text-gray-400 uppercase block px-1 tracking-widest">Nomor Induk Siswa (NIS)</label>
                              <div className="relative">
                                 <input required type="text" value={formData.nis} onChange={e => setFormData({...formData, nis: e.target.value})} placeholder="Masukkan NIS..." className="w-full bg-gray-50 border-none rounded-2xl px-6 py-5 font-bold text-dark focus:ring-2 focus:ring-primary transition" />
                                 <Hash size={22} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-200" />
                              </div>
                          </div>
                        )}
                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-gray-400 uppercase block px-1 tracking-widest">WhatsApp</label>
                            <div className="relative">
                               <input required type="text" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} placeholder="08..." className="w-full bg-gray-50 border-none rounded-2xl px-6 py-5 font-bold text-dark focus:ring-2 focus:ring-primary transition" />
                               <Phone size={22} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-200" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {tab === UserRole.STUDENT && (
                          <div className="space-y-3">
                              <label className="text-[11px] font-black text-gray-400 uppercase block px-1 tracking-widest">Pilih Kelas</label>
                              <div className="relative">
                                 <select required value={formData.classId} onChange={e => setFormData({...formData, classId: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-5 font-bold text-dark focus:ring-2 focus:ring-primary appearance-none">
                                    <option value="">Pilih Kelas</option>
                                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                 </select>
                                 <Layers size={22} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-200 pointer-events-none" />
                              </div>
                          </div>
                        )}
                        {tab === UserRole.TEACHER && (
                          <div className="space-y-3">
                              <label className="text-[11px] font-black text-gray-400 uppercase block px-1 tracking-widest">Mata Pelajaran</label>
                              <div className="relative">
                                 <input required type="text" value={formData.subjects} onChange={e => setFormData({...formData, subjects: e.target.value})} placeholder="Matematika, IPA" className="w-full bg-gray-50 border-none rounded-2xl px-6 py-5 font-bold text-dark focus:ring-2 focus:ring-primary transition" />
                                 <BookOpen size={22} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-200" />
                              </div>
                          </div>
                        )}
                    </div>

                    {!editingUserId && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-gray-400 uppercase block px-1 tracking-widest">Email Login</label>
                            <div className="relative">
                               <input required type="email" placeholder="email@sekolah.sch.id" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 font-bold text-dark focus:ring-2 focus:ring-primary transition" />
                               <Mail size={22} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-200" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-gray-400 uppercase block px-1 tracking-widest">Password</label>
                            <div className="relative">
                               <input required type="text" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="min 6 karakter" className="w-full bg-gray-50 border-none rounded-2xl px-6 py-5 font-mono font-bold text-gray-500 focus:ring-2 focus:ring-primary" />
                               <Lock size={22} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-200" />
                            </div>
                        </div>
                      </div>
                    )}
                 </div>

                 <div className="w-full lg:w-[450px] shrink-0 space-y-6">
                    <label className="text-[11px] font-black text-gray-400 uppercase block px-1 tracking-widest">Pas Foto Profil</label>
                    <div className="aspect-[4/5] bg-gray-100 rounded-[50px] overflow-hidden relative group border-4 border-white shadow-2xl">
                        {formData.avatar ? (
                          <>
                            <img src={formData.avatar} className="w-full h-full object-cover" />
                            <button type="button" onClick={() => setFormData({...formData, avatar: ''})} className="absolute top-6 right-6 p-4 bg-red-500 text-white rounded-full shadow-2xl hover:scale-110 transition active:scale-95"><X size={24} /></button>
                          </>
                        ) : isCameraOpen ? (
                          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center gap-6 p-10 text-center">
                            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-300"><ImageIcon size={48} /></div>
                            <div>
                               <p className="font-black text-dark text-lg">Unggah Foto Profil</p>
                               <p className="text-gray-400 text-sm mt-1">Format JPG/PNG, Ukuran Optimal 400x500px</p>
                            </div>
                          </div>
                        )}
                    </div>
                    {!formData.avatar && (
                      <div className="grid grid-cols-2 gap-4">
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center gap-3 bg-white border-2 border-gray-100 py-5 rounded-2xl font-black text-dark text-sm hover:bg-gray-50 transition active:scale-95"><Upload size={20}/> Unggah</button>
                        <button type="button" onClick={async () => { try { const s = await navigator.mediaDevices.getUserMedia({video: true}); setIsCameraOpen(true); setTimeout(() => { if(videoRef.current) videoRef.current.srcObject = s; }, 100); } catch (e) { showNotification("Izin kamera ditolak", "error"); } }} className="flex items-center justify-center gap-3 bg-dark text-white py-5 rounded-2xl font-black text-sm hover:bg-black transition active:scale-95"><Camera size={20}/> Kamera</button>
                      </div>
                    )}
                    {isCameraOpen && <button type="button" onClick={takePhoto} className="w-full bg-primary text-white py-5 rounded-3xl font-black text-xl shadow-xl shadow-teal-100 transition active:scale-95">Ambil Gambar</button>}
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                 </div>
               </div>

               <div className="mt-16">
                  <button disabled={isSubmitting} type="submit" className="w-full bg-primary text-white py-7 rounded-[30px] font-black text-2xl shadow-2xl shadow-teal-200 flex items-center justify-center gap-4 hover:bg-teal-600 transition active:scale-95 disabled:opacity-50">
                     {isSubmitting ? <Loader2 className="animate-spin" size={28} /> : <Save size={30} />} 
                     {isSubmitting ? 'sedang memproses...' : (editingUserId ? 'simpan perubahan' : 'daftarkan sekarang')}
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataMaster;
