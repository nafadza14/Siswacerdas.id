
import React, { useState, useEffect } from 'react';
import { Users, UserCheck, GraduationCap, LayoutGrid, ArrowUpRight, Loader2 } from 'lucide-react';
import { dataService } from '../../services/supabaseService';
import { UserRole } from '../../types';

const SchoolDashboard: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({ students: 0, teachers: 0, classes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const res = await dataService.getCurrentUserProfile();
        if (res?.profile) {
          setProfile(res.profile);
          const schoolId = res.profile.school_id;
          
          if (schoolId) {
            // Fetch all required stats in parallel for performance
            const [stRes, tcRes, clsRes] = await Promise.all([
              dataService.getProfilesBySchool(schoolId, UserRole.STUDENT),
              dataService.getProfilesBySchool(schoolId, UserRole.TEACHER),
              dataService.getClassesBySchool(schoolId)
            ]);

            setStats({ 
              students: stRes.data?.length || 0, 
              teachers: tcRes.data?.length || 0,
              classes: clsRes.data?.length || 0
            });
          }
        }
      } catch (err) {
        console.error("Load Stats Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  const cards = [
    { label: 'Total Siswa', value: stats.students, icon: Users, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Guru', value: stats.teachers, icon: UserCheck, color: 'bg-green-50 text-green-600' },
    { label: 'Jumlah Kelas', value: stats.classes, icon: LayoutGrid, color: 'bg-purple-50 text-purple-600' },
    { label: 'Alumni Terlacak', value: '0', icon: GraduationCap, color: 'bg-orange-50 text-orange-600' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
             <h1 className="text-3xl font-black text-dark tracking-tight">{profile?.schools?.name || profile?.name || 'Sekolah'}</h1>
          </div>
          <p className="text-gray-500 font-medium">NPSN: {profile?.schools?.npsn || profile?.npsn || '-'} • Kepala Sekolah: {profile?.schools?.principal || profile?.principal || '-'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((s, i) => (
          <div key={i} className="bg-white p-8 rounded-[40px] shadow-2xl shadow-teal-100/10 border border-gray-100">
            <div className="flex justify-between mb-4">
              <div className={`p-4 rounded-2xl ${s.color}`}><s.icon size={24} /></div>
              <ArrowUpRight className="text-gray-300" />
            </div>
            <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest">{s.label}</h3>
            <p className="text-3xl font-black text-dark mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[40px] p-12 shadow-2xl shadow-teal-100/10 border border-gray-100 text-center">
         <LayoutGrid className="mx-auto text-gray-100 mb-6" size={80} />
         <h2 className="text-2xl font-black text-dark mb-2">Selamat Datang di Dashboard Admin</h2>
         <p className="text-gray-400 max-w-md mx-auto">Kelola data sekolah Anda secara efisien. Saat ini terdapat <strong>{stats.classes} kelas</strong> yang terdaftar di sistem.</p>
      </div>
    </div>
  );
};

export default SchoolDashboard;
