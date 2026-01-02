
import React, { useState, useEffect, useRef } from 'react';
import { Save, Building2, MapPin, Hash, Phone, Mail, Award, User, Loader2, Upload, X } from 'lucide-react';
import { dataService } from '../../services/supabaseService';
import { PREVIEW_LOGO } from '../../constants';

const SchoolProfile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      const res = await dataService.getCurrentUserProfile();
      if (res?.profile) {
        setProfile(res.profile.schools || res.profile);
      }
      setIsLoading(false);
    };
    fetchProfile();
  }, []);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran logo maksimal 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev: any) => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!profile?.id) return;
    setIsSaving(true);
    
    const { error } = await dataService.updateSchoolProfile(profile.id, {
      name: profile.name,
      address: profile.address,
      phone: profile.phone,
      principal: profile.principal,
      logo: profile.logo
    });

    if (error) {
      alert('Gagal memperbarui profil: ' + (error as any).message);
    } else {
      alert('Profil sekolah berhasil diperbarui!');
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-12 text-center text-gray-400">
        Profil sekolah tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-dark">Profil Sekolah</h1>
        <p className="text-gray-500 font-medium">Kelola informasi dasar sekolah untuk identitas platform</p>
      </div>

      <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-2xl shadow-teal-100/10 space-y-8">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start border-b border-gray-50 pb-8">
           <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-32 h-32 rounded-[32px] overflow-hidden border-2 border-gray-100 bg-gray-50 relative">
                <img src={profile.logo || PREVIEW_LOGO} className="w-full h-full object-contain p-2" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                   <Upload className="text-white" size={24} />
                </div>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoChange} />
              <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-xl shadow-lg">
                <Building2 size={16} />
              </div>
           </div>
           
           <div className="flex-1 space-y-4 w-full text-center md:text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase flex items-center justify-center md:justify-start gap-1 tracking-widest"><Building2 size={10}/> Nama Sekolah</label>
                    <input 
                      type="text" 
                      value={profile.name || ''} 
                      onChange={e => setProfile({...profile, name: e.target.value})}
                      className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 font-bold text-dark focus:ring-2 focus:ring-primary text-center md:text-left" 
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase flex items-center justify-center md:justify-start gap-1 tracking-widest"><Hash size={10}/> NPSN</label>
                    <input 
                      type="text" 
                      value={profile.npsn || ''} 
                      readOnly
                      className="w-full bg-gray-100 border-none rounded-xl px-4 py-2 font-mono text-gray-500 text-center md:text-left" 
                    />
                 </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase flex items-center justify-center md:justify-start gap-1 tracking-widest"><MapPin size={10}/> Alamat Lengkap</label>
                <textarea 
                  value={profile.address || ''} 
                  onChange={e => setProfile({...profile, address: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 text-dark focus:ring-2 focus:ring-primary text-center md:text-left" 
                  rows={2}
                />
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1 tracking-widest"><Mail size={10}/> Email Sekolah</label>
              <input 
                type="email" 
                value={profile.email || ''} 
                className="w-full bg-gray-100 border-none rounded-xl px-4 py-2 text-gray-500 font-medium" 
                readOnly
              />
           </div>
           <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1 tracking-widest"><Phone size={10}/> Nomor Telepon</label>
              <input 
                type="text" 
                value={profile.phone || ''} 
                onChange={e => setProfile({...profile, phone: e.target.value})}
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 text-dark focus:ring-2 focus:ring-primary" 
              />
           </div>
           <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1 tracking-widest"><User size={10}/> Kepala Sekolah</label>
              <input 
                type="text" 
                value={profile.principal || ''} 
                onChange={e => setProfile({...profile, principal: e.target.value})}
                className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 text-dark focus:ring-2 focus:ring-primary" 
              />
           </div>
        </div>

        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-primary text-white py-5 rounded-2xl font-bold shadow-2xl shadow-teal-100 flex items-center justify-center gap-2 hover:bg-teal-600 transition disabled:opacity-70 active:scale-95"
        >
          {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
          {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>
    </div>
  );
};

export default SchoolProfile;
