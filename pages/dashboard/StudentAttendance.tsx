
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Camera, RefreshCw, CheckCircle, Clock, X, Loader2 } from 'lucide-react';
import { dataService, stringifyError } from '../../services/supabaseService';

const StudentAttendance: React.FC = () => {
  const [step, setStep] = useState<'idle' | 'locating' | 'camera' | 'success'>('idle');
  const [locationStatus, setLocationStatus] = useState<'waiting' | 'valid' | 'invalid'>('waiting');
  const [photo, setPhoto] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [submittedTime, setSubmittedTime] = useState<Date | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await dataService.getCurrentUserProfile();
      if (res?.profile) setProfile(res.profile);
    };
    fetchProfile();
    
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [stream]);

  const startAttendance = () => {
    setStep('locating');
    if (!navigator.geolocation) {
      alert("Browser tidak mendukung lokasi.");
      setStep('idle');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationStatus('valid');
        setTimeout(() => openCamera(), 1000);
      },
      (err) => {
        alert("Gagal mendapatkan lokasi. Pastikan izin GPS aktif.");
        setStep('idle');
      },
      { enableHighAccuracy: true }
    );
  };

  const openCamera = async () => {
    setStep('camera');
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
    } catch (err) {
      alert("Izin kamera ditolak.");
      setStep('idle');
    }
  };

  const takePhoto = async () => {
    if (videoRef.current && profile) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageSrc = canvas.toDataURL('image/jpeg', 0.6);
        setPhoto(imageSrc);
        
        setIsSubmitting(true);
        const { error } = await dataService.submitAttendance({
          student_id: profile.id,
          school_id: profile.school_id,
          class_id: profile.class_id,
          status: 'PRESENT',
          photo: imageSrc,
          latitude: location?.lat,
          longitude: location?.lng
        });

        if (error) {
          alert("Gagal kirim presensi: " + stringifyError(error));
        } else {
          setSubmittedTime(new Date());
          if (stream) stream.getTracks().forEach(track => track.stop());
          setStep('success');
        }
        setIsSubmitting(false);
      }
    }
  };

  const resetProcess = () => {
    setStep('idle');
    setPhoto(null);
    setSubmittedTime(null);
    setLocationStatus('waiting');
  };

  return (
    <div className="max-w-md mx-auto min-h-[calc(100vh-100px)] flex flex-col relative pb-10">
      <div className="bg-white p-6 rounded-b-[40px] shadow-sm border-b border-gray-100 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-black text-dark uppercase tracking-tight">Presensi Mandiri</h1>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>
          <div className="text-right">
             <div className="text-2xl font-black text-primary font-mono leading-none">
               {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':')}
             </div>
             <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">WIB</span>
          </div>
        </div>

        <div className={`p-5 rounded-3xl border flex items-center gap-4 transition-all ${
           step === 'success' ? 'bg-teal-50 border-teal-100 text-teal-700' : 'bg-gray-50 border-gray-100 text-gray-400'
        }`}>
           <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
              step === 'success' ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-400'
           }`}>
              <CheckCircle size={20} />
           </div>
           <div>
              <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Status Kehadiran</p>
              <p className="font-black text-sm uppercase">
                {step === 'success' ? 'Sudah Presensi' : 'Belum Melakukan Absen'}
              </p>
           </div>
        </div>
      </div>

      <div className="flex-1 px-6 flex flex-col justify-center">
        {step === 'idle' && (
          <div className="space-y-8 text-center animate-fade-in">
            <div className="w-48 h-48 bg-teal-50 rounded-full flex items-center justify-center mx-auto relative">
               <div className="absolute inset-0 bg-teal-200 rounded-full animate-ping opacity-10"></div>
               <MapPin size={64} className="text-primary relative z-10" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-dark tracking-tighter uppercase">Siap Untuk Absen?</h2>
              <p className="text-gray-500 text-sm mt-2 max-w-[250px] mx-auto leading-relaxed">Pastikan kamu sudah berada di lingkungan sekolah untuk verifikasi lokasi.</p>
            </div>
            <button onClick={startAttendance} className="w-full bg-primary hover:bg-teal-600 text-white font-black py-5 rounded-[28px] shadow-2xl shadow-teal-100 text-lg transition-all active:scale-95 flex items-center justify-center gap-3">
              <Camera size={24} /> Ambil Selfie Sekarang
            </button>
          </div>
        )}

        {step === 'locating' && (
          <div className="text-center space-y-6">
             <Loader2 className="w-16 h-16 animate-spin mx-auto text-primary" />
             <div>
               <h3 className="font-black text-xl text-dark uppercase tracking-tight">Memverifikasi Lokasi...</h3>
               <p className="text-gray-400 text-sm font-medium">Sistem sedang mendeteksi koordinat GPS</p>
             </div>
             {locationStatus === 'valid' && (
                <div className="animate-fade-in text-teal-600 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                   <CheckCircle size={16}/> Lokasi Berhasil Divalidasi
                </div>
             )}
          </div>
        )}

        {step === 'camera' && (
          <div className="fixed inset-0 z-[100] bg-black flex flex-col">
             <div className="absolute top-0 w-full p-8 flex justify-between items-center z-10 text-white">
                <span className="font-black uppercase tracking-widest text-sm">Selfie Kehadiran</span>
                <button onClick={resetProcess} className="p-3 bg-white/20 rounded-full backdrop-blur-md hover:bg-white/30 transition"><X size={24}/></button>
             </div>
             <div className="flex-1 relative bg-gray-950 overflow-hidden flex items-center justify-center">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 border-[40px] border-black/60 pointer-events-none">
                   <div className="w-full h-full border-2 border-white/20 rounded-[40px] relative flex items-center justify-center">
                      <div className="w-64 h-80 border-2 border-teal-400 rounded-[60px] animate-pulse"></div>
                      <span className="absolute bottom-10 text-white font-black text-[10px] uppercase tracking-widest bg-black/50 px-6 py-2 rounded-full backdrop-blur-md border border-white/10">Posisikan wajah di dalam kotak</span>
                   </div>
                </div>
             </div>
             <div className="h-40 bg-black flex flex-col items-center justify-center gap-4">
                <button onClick={takePhoto} disabled={isSubmitting} className="w-24 h-24 bg-white rounded-full border-[6px] border-white/20 flex items-center justify-center active:scale-90 transition disabled:opacity-50">
                   {isSubmitting ? <Loader2 className="animate-spin text-primary" size={40}/> : <div className="w-16 h-16 bg-white rounded-full border-4 border-black"></div>}
                </button>
             </div>
          </div>
        )}

        {step === 'success' && photo && (
           <div className="text-center space-y-8 animate-fade-in-up">
              <div className="w-full aspect-[3/4] bg-gray-100 rounded-[50px] overflow-hidden shadow-2xl border-4 border-white mx-auto max-w-[280px] relative">
                 <img src={photo} alt="Selfie" className="w-full h-full object-cover" />
                 <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/90 to-transparent p-6 pt-16 text-white text-left">
                    <p className="font-black text-2xl leading-none">{submittedTime?.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':')} <span className="text-xs font-medium">WIB</span></p>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mt-1">Presensi Terverifikasi</p>
                 </div>
              </div>

              <div>
                <h2 className="text-3xl font-black text-dark uppercase tracking-tighter leading-none">Presensi Sukses!</h2>
                <p className="text-gray-400 font-medium text-sm mt-2">Data kehadiranmu telah terkirim ke sekolah.</p>
              </div>

              <div className="bg-white p-6 rounded-[32px] shadow-xl shadow-teal-100/10 border border-gray-100 text-left space-y-4">
                 <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Siswa</span>
                    <span className="font-bold text-dark text-sm">{profile?.full_name}</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Kelas</span>
                    <span className="font-bold text-dark text-sm">{profile?.classes?.name}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Waktu</span>
                    <span className="font-black text-primary text-sm uppercase tracking-tight">{submittedTime?.toLocaleTimeString('id-ID')} WIB</span>
                 </div>
              </div>

              <button onClick={() => window.location.hash = '#/dashboard'} className="text-gray-400 hover:text-dark text-xs font-black uppercase tracking-widest transition-colors">Kembali ke Beranda</button>
           </div>
        )}
      </div>
    </div>
  );
};

export default StudentAttendance;
