
import React, { useState, useRef } from 'react';
// Fix: Re-writing the import to resolve "no exported member" errors
import { Link, useNavigate } from "react-router-dom";
import { Building2, CheckCircle, ArrowRight, ShieldCheck, Mail, Phone, MapPin, Hash, User, Lock, Eye, EyeOff, Navigation, Globe, Upload, Image as ImageIcon, X } from 'lucide-react';
import { dataService } from '../../services/supabaseService';

const RegisterSchool: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    npsn: '',
    address: '',
    district: '',
    city: '',
    province: '',
    postalCode: '',
    principal: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    latitude: '',
    longitude: '',
    logo: ''
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran logo maksimal 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation tidak didukung oleh browser Anda.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString()
        }));
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        alert("Gagal mendapatkan lokasi. Pastikan izin lokasi diaktifkan.");
      },
      { enableHighAccuracy: true }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Basic Validation
    if (formData.password !== formData.confirmPassword) {
      alert("Konfirmasi password tidak cocok.");
      setIsSubmitting(false);
      return;
    }

    if (formData.password.length < 6) {
      alert("Password minimal 6 karakter.");
      setIsSubmitting(false);
      return;
    }

    if (formData.npsn.length < 8) {
      alert("NPSN harus minimal 8 karakter.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Fix: Casting registration result to any to avoid TypeScript 'never' inference issue on the next line
      const res: any = await dataService.registerSchool(formData);
      
      if (res.error) {
        // Robust error message extraction
        let errorMessage = "Terjadi kesalahan tidak dikenal";
        
        if (typeof res.error === 'string') {
          errorMessage = res.error;
        } else if (res.error && typeof res.error === 'object') {
          errorMessage = (res.error as any).message || JSON.stringify(res.error);
        }
        
        console.error("Final Registration Error Object:", res.error);
        alert(`Pendaftaran Gagal:\n\n${errorMessage}`);
        setIsSubmitting(false);
        return;
      }

      setSuccess(true);
    } catch (err: any) {
      console.error("Critical Exception in Form Submission:", err);
      const catchMsg = err.message || JSON.stringify(err) || "Masalah koneksi tidak diketahui.";
      alert(`Terjadi kesalahan sistem:\n\n${catchMsg}`);
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#fffcf8] flex items-center justify-center p-4 text-center">
        <div className="max-w-md w-full animate-fade-in-up">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-100">
            <CheckCircle size={48} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-black text-dark mb-4 leading-tight lowercase">
            terimakasih pendaftaranmu berhasil
          </h1>
          <p className="text-gray-500 mb-10 leading-relaxed font-medium">
            Akun administrator sekolah Anda telah aktif. Anda dapat langsung masuk ke dashboard untuk mulai mengelola data sekolah.
          </p>
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => navigate('/login')}
              className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-5 rounded-2xl font-black shadow-2xl shadow-teal-100 hover:bg-teal-600 transition transform hover:-translate-y-1"
            >
              Lanjut ke Halaman Login <ArrowRight size={20} />
            </button>
            <Link to="/" className="text-gray-400 font-bold hover:text-dark transition text-sm">
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffcf8] py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-teal-100">
              <span className="text-white font-black text-2xl">S</span>
            </div>
            <span className="font-bold text-2xl text-dark tracking-tight">Siswa<span className="text-primary">Cerdas</span></span>
          </Link>
          <h1 className="text-4xl font-black text-dark mb-4 tracking-tight">Pendaftaran Sekolah Baru</h1>
          <p className="text-gray-500 font-medium text-lg max-w-2xl mx-auto">Daftarkan institusi Anda dan mulai gunakan platform digital Siswa Cerdas hari ini.</p>
        </div>

        <div className="bg-white rounded-[40px] shadow-2xl shadow-orange-100/50 border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 md:p-16 space-y-12">
             
             {/* Section 1: Identity */}
             <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-50 pb-3">
                   <div className="p-2 bg-primary/10 rounded-lg text-primary"><Building2 size={20}/></div>
                   <h3 className="text-sm font-black text-dark uppercase tracking-widest">1. Identitas Institusi</h3>
                </div>
                
                <div className="flex flex-col lg:flex-row gap-10">
                   <div className="shrink-0">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 block mb-3">Logo Resmi Sekolah</label>
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-32 h-32 lg:w-40 lg:h-40 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[32px] overflow-hidden cursor-pointer hover:border-primary/50 transition-all flex flex-col items-center justify-center group relative shadow-inner"
                      >
                         {formData.logo ? (
                            <img src={formData.logo} className="w-full h-full object-contain p-4" alt="School Logo" />
                         ) : (
                            <div className="text-center p-4">
                               <ImageIcon className="mx-auto text-gray-300 mb-2 group-hover:text-primary transition-colors" size={32} />
                               <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Klik Upload</p>
                            </div>
                         )}
                         {formData.logo && (
                            <button 
                              type="button"
                              onClick={(e) => { e.stopPropagation(); setFormData({...formData, logo: ''}); }}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            >
                               <X size={12} />
                            </button>
                         )}
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleLogoChange} 
                        accept="image/*" 
                        className="hidden" 
                      />
                   </div>

                   <div className="flex-1 space-y-6">
                      <div className="space-y-1.5">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Nama Lengkap Sekolah</label>
                         <input required type="text" placeholder="Contoh: SMA Negeri 1 Bandar Lampung" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 font-bold text-dark focus:ring-2 focus:ring-primary focus:bg-white transition" />
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Nomor NPSN (8 Digit)</label>
                         <input required type="text" maxLength={8} placeholder="1080XXXX" value={formData.npsn} onChange={e => setFormData({...formData, npsn: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 font-mono font-bold text-dark focus:ring-2 focus:ring-primary focus:bg-white transition" />
                      </div>
                   </div>
                </div>
             </div>

             {/* Section 2: Location */}
             <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-50 pb-3">
                   <div className="p-2 bg-secondary/10 rounded-lg text-secondary"><MapPin size={20}/></div>
                   <h3 className="text-sm font-black text-dark uppercase tracking-widest">2. Detail Lokasi & Alamat</h3>
                </div>
                <div className="space-y-6">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Alamat Jalan & Nomor</label>
                      <input required type="text" placeholder="Jl. Raya Utama No. 45..." value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 font-bold text-dark focus:ring-2 focus:ring-primary focus:bg-white transition" />
                   </div>
                   
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-1.5">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Kecamatan</label>
                         <input required type="text" placeholder="Kecamatan" value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-dark focus:ring-2 focus:ring-primary" />
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Kabupaten/Kota</label>
                         <input required type="text" placeholder="Kota" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-dark focus:ring-2 focus:ring-primary" />
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Provinsi</label>
                         <input required type="text" placeholder="Provinsi" value={formData.province} onChange={e => setFormData({...formData, province: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-dark focus:ring-2 focus:ring-primary" />
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Kode Pos</label>
                         <input required type="text" maxLength={5} placeholder="651XX" value={formData.postalCode} onChange={e => setFormData({...formData, postalCode: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-mono font-bold text-dark focus:ring-2 focus:ring-primary" />
                      </div>
                   </div>
                </div>
             </div>

             {/* Section 3: Geolocation */}
             <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-50 pb-3">
                   <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Globe size={20}/></div>
                   <h3 className="text-sm font-black text-dark uppercase tracking-widest">3. Titik Koordinat Sekolah</h3>
                </div>
                <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100/50">
                   <p className="text-xs text-blue-600 font-bold mb-6 leading-relaxed">
                     Koordinat ini digunakan for verifikasi absensi berbasis lokasi (Geo-fencing).
                   </p>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                      <div className="space-y-1.5">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Latitude</label>
                         <input required type="text" placeholder="-6.1754" value={formData.latitude} onChange={e => setFormData({...formData, latitude: e.target.value})} className="w-full bg-white border-none rounded-2xl px-5 py-4 font-mono font-bold text-dark focus:ring-2 focus:ring-blue-500 transition" />
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Longitude</label>
                         <input required type="text" placeholder="106.8272" value={formData.longitude} onChange={e => setFormData({...formData, longitude: e.target.value})} className="w-full bg-white border-none rounded-2xl px-5 py-4 font-mono font-bold text-dark focus:ring-2 focus:ring-blue-500 transition" />
                      </div>
                   </div>

                   <div className="flex flex-col sm:flex-row gap-4">
                      <button 
                        type="button"
                        onClick={getMyLocation}
                        disabled={isLocating}
                        className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition disabled:opacity-50 shadow-lg shadow-blue-100"
                      >
                         {isLocating ? (
                           <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                         ) : <Navigation size={18}/>}
                         {isLocating ? 'Mendeteksi...' : 'Dapatkan Lokasi Saya'}
                      </button>
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${formData.latitude || -6.1754},${formData.longitude || 106.8272}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 bg-white border border-blue-200 text-blue-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-50 transition"
                      >
                         Cek di Google Maps <Globe size={18}/>
                      </a>
                   </div>
                </div>
             </div>

             {/* Section 4: Contact */}
             <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-50 pb-3">
                   <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><User size={20}/></div>
                   <h3 className="text-sm font-black text-dark uppercase tracking-widest">4. Penanggung Jawab</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Nama Kepala Sekolah / Operator</label>
                      <input required type="text" placeholder="Nama Lengkap" value={formData.principal} onChange={e => setFormData({...formData, principal: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 font-bold text-dark focus:ring-2 focus:ring-primary" />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Nomor WhatsApp</label>
                      <input required type="text" placeholder="628123456789" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 font-bold text-dark focus:ring-2 focus:ring-primary" />
                   </div>
                </div>
             </div>

             {/* Section 5: Credentials */}
             <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-50 pb-3">
                   <div className="p-2 bg-orange-100 rounded-lg text-orange-600"><Lock size={20}/></div>
                   <h3 className="text-sm font-black text-dark uppercase tracking-widest">5. Akun Administrator</h3>
                </div>
                <div className="space-y-6">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Email Sekolah (Untuk Login)</label>
                      <div className="relative">
                         <input required type="email" placeholder="admin@sekolah.sch.id" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 font-bold text-dark focus:ring-2 focus:ring-primary focus:bg-white transition" />
                         <Mail size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300" />
                      </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-1.5">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Password</label>
                         <div className="relative">
                            <input required type={showPassword ? "text" : "password"} placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 font-bold text-dark focus:ring-2 focus:ring-primary focus:bg-white transition" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-primary transition">
                               {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                         </div>
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Konfirmasi Password</label>
                         <div className="relative">
                            <input required type={showPassword ? "text" : "password"} placeholder="••••••••" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 font-bold text-dark focus:ring-2 focus:ring-primary focus:bg-white transition" />
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-10 border-t border-gray-100">
                <div className="flex items-center gap-4 text-gray-400">
                   <ShieldCheck className="shrink-0" size={32} />
                   <p className="text-[10px] leading-relaxed uppercase font-black tracking-widest">
                     Keamanan data Anda adalah prioritas kami.
                   </p>
                </div>
                <button 
                  disabled={isSubmitting}
                  type="submit" 
                  className="w-full md:w-auto bg-primary text-white px-12 py-5 rounded-2xl font-black shadow-2xl shadow-teal-100 hover:bg-teal-600 transition flex items-center justify-center gap-3 disabled:opacity-70 active:scale-95 group"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>Kirim Pendaftaran Sekolah <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
                  )}
                </button>
             </div>
          </form>
        </div>

        <div className="mt-12 text-center text-gray-400 text-sm font-medium">
           Sudah mendaftarkan sekolah? <Link to="/login" className="text-secondary font-bold hover:underline">Masuk ke Dashboard</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterSchool;
