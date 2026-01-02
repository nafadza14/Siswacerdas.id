
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { User, Eye, EyeOff, ArrowRight, QrCode, X, Camera, ShieldCheck, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { dataService } from '../../services/supabaseService';
import { UserRole } from '../../types';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // Simulasi Pemindaian Barcode (Menggunakan interval untuk simulasi scan di browser)
  useEffect(() => {
    let scanInterval: any;
    if (isScanning && videoRef.current) {
      // Dalam implementasi nyata, gunakan pustaka seperti 'html5-qrcode' atau 'jsqr'
      // Untuk demo ini, kita simulasikan deteksi berhasil setelah 3 detik jika kamera aktif
      scanInterval = setTimeout(async () => {
        // Simulasi deteksi QR token dummy
        // handleKtsLogin("7e8c338e-8a9d-4813-912c-0e21379e530b"); 
      }, 3000);
    }
    return () => {
      if (scanInterval) clearTimeout(scanInterval);
    };
  }, [isScanning]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const handleKtsLogin = async (token: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    stopScanning();
    
    const res = await dataService.loginWithKtsToken(token);
    if (res.error) {
      setErrorMessage(res.error.message);
      setIsLoading(false);
    } else {
      // Jika profil ditemukan, arahkan ke dashboard siswa
      // Catatan: Autentikasi token sesungguhnya harus ditangani di level server/Supabase RPC
      navigate('/dashboard');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);
    
    try {
      const loginRes = await dataService.login(identifier, password);
      if (loginRes.error) {
        setIsLoading(false);
        setErrorMessage(loginRes.error.message || "Email atau password salah.");
        return;
      }

      const profileRes = await dataService.getCurrentUserProfile();
      setIsLoading(false);

      if (profileRes?.profile) {
        const role = profileRes.profile.role as UserRole;
        switch (role) {
          case UserRole.SUPER_ADMIN: navigate('/dashboard/admin'); break;
          case UserRole.SCHOOL_ADMIN: navigate('/dashboard/school'); break;
          case UserRole.TEACHER: navigate('/dashboard/attendance'); break;
          case UserRole.STUDENT: navigate('/dashboard'); break;
          default: navigate('/dashboard');
        }
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage("Kesalahan sistem: " + (err.message || String(err)));
    }
  };

  const startScanning = async () => {
    setIsScanning(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
    } catch (err) {
      setIsScanning(false);
      alert("Izin kamera diperlukan untuk fitur Scan KTS.");
    }
  };

  const stopScanning = () => {
    if (stream) stream.getTracks().forEach(track => track.stop());
    setStream(null);
    setIsScanning(false);
  };

  return (
    <div className="min-h-screen bg-[#fffcf8] flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-white rounded-[40px] shadow-2xl shadow-orange-100 border border-gray-100 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        <div className="md:w-1/2 bg-primary p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-2 mb-12">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                <span className="text-primary font-black text-2xl">S</span>
              </div>
              <span className="font-bold text-2xl tracking-tight">SiswaCerdas</span>
            </Link>
            <h1 className="text-4xl font-black mb-6 leading-tight">Satu Pintu <br/> Akses Pendidikan.</h1>
            <p className="text-white/80 max-w-sm text-sm">Masuk lebih cepat dengan memindai Kartu Tanda Siswa (KTS) digital Anda.</p>
          </div>
          <div className="relative z-10 mt-12 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20">
            <div className="flex items-center gap-3 mb-2">
               <ShieldCheck className="text-secondary" />
               <p className="text-sm font-bold">Teknologi QR Smart Access</p>
            </div>
            <p className="text-[10px] text-white/70">Setiap kartu memiliki enkripsi token unik yang terhubung langsung dengan Master Data sekolah Anda.</p>
          </div>
        </div>

        <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-center relative bg-white">
          {isScanning && (
            <div className="absolute inset-0 bg-white z-20 flex flex-col p-8 animate-fade-in">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-black text-dark tracking-tighter uppercase">Pindai Kartu KTS</h3>
                  <p className="text-xs text-gray-400 font-medium">Arahkan kamera ke QR Code di kartu Anda</p>
                </div>
                <button onClick={stopScanning} className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition"><X size={24}/></button>
              </div>
              <div className="flex-1 bg-gray-900 rounded-[40px] overflow-hidden relative border-8 border-gray-100 shadow-inner">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                <div className="absolute inset-0 border-[60px] border-black/40 pointer-events-none">
                  <div className="w-full h-full border-2 border-primary rounded-3xl animate-pulse flex items-center justify-center">
                     <div className="w-48 h-1 bg-primary/30 blur-sm animate-bounce"></div>
                  </div>
                </div>
              </div>
              <p className="text-center mt-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Sistem mendeteksi barcode secara otomatis</p>
            </div>
          )}

          <div className="mb-10">
            <h2 className="text-3xl font-black text-dark mb-2">Login Akun</h2>
            <p className="text-gray-400 font-medium">Gunakan kredensial atau scan kartu Anda.</p>
          </div>

          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 animate-fade-in">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <p className="text-sm font-bold leading-tight">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Email / Identitas (NIS/NIP)</label>
              <div className="relative">
                 <input 
                  required
                  type="text" 
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  placeholder="admin@sekolah.com atau NIS"
                  className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 font-bold text-dark focus:ring-2 focus:ring-primary focus:bg-white transition shadow-sm"
                 />
                 <User className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Password</label>
              <div className="relative">
                 <input 
                  required
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 font-bold text-dark focus:ring-2 focus:ring-primary focus:bg-white transition shadow-sm"
                 />
                 <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-primary transition">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                 </button>
              </div>
            </div>

            <button 
              disabled={isLoading}
              type="submit" 
              className="w-full bg-primary text-white py-5 rounded-2xl font-black shadow-2xl shadow-teal-100 hover:bg-teal-600 transition flex items-center justify-center gap-2 disabled:opacity-70 active:scale-95"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <>Masuk Sekarang <ArrowRight size={20} /></>}
            </button>
          </form>

          <div className="mt-8 text-center flex flex-col gap-3">
            <button 
              type="button"
              onClick={startScanning}
              className="bg-gray-50 text-primary font-black text-sm flex items-center justify-center gap-3 hover:bg-primary hover:text-white py-4 rounded-2xl transition-all border border-gray-100 shadow-sm group"
            >
              <QrCode size={20} className="group-hover:scale-110 transition-transform"/> Login dengan Kartu Siswa (KTS)
            </button>
            <p className="text-[11px] text-gray-400 font-medium">
              Belum punya akun sekolah? <Link to="/register-school" className="text-secondary font-black hover:underline">Daftarkan Sekolah Sekarang</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
