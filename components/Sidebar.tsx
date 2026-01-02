
import React from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, Users, BookOpen, Calendar, Settings, LogOut, 
  CheckSquare, ShieldCheck, Database, PenTool, Camera, CreditCard,
  Megaphone, GraduationCap, Trophy, FileText, UserPlus, Building, ClipboardList
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  role: UserRole;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  
  const studentLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/dashboard/student-attendance', icon: Camera, label: 'Absensi (Scan)' },
    { to: '/dashboard/schedule', icon: Calendar, label: 'Jadwal Pelajaran' },
    { to: '/dashboard/cbt', icon: BookOpen, label: 'Ujian Online' },
    { to: '/cards', icon: CreditCard, label: 'Kartu Siswa' },
  ];

  const teacherLinks = [
    { to: '/dashboard/attendance', icon: CheckSquare, label: 'Smart Attendance' },
    { to: '/dashboard/classes', icon: Users, label: 'My Classes' },
    { to: '/dashboard/cbt', icon: ShieldCheck, label: 'CBT Exam Manager' },
    { to: '/dashboard/blog', icon: PenTool, label: 'Blog Manager' },
  ];

  const schoolAdminLinks = [
    { to: '/dashboard/school', icon: LayoutDashboard, label: 'School Overview' },
    { to: '/dashboard/profile', icon: Building, label: 'Profil Sekolah' },
    { to: '/dashboard/master-data', icon: Database, label: 'Master Data' },
    { to: '/dashboard/rekap-presensi', icon: ClipboardList, label: 'Rekap Presensi' },
    { to: '/dashboard/schedule-manage', icon: Calendar, label: 'Manajemen Jadwal' },
    { to: '/dashboard/broadcast', icon: Megaphone, label: 'Broadcast Info' },
    { to: '/dashboard/achievements', icon: Trophy, label: 'Prestasi Siswa' },
    { to: '/dashboard/tracer-study', icon: GraduationCap, label: 'Tracer Study' },
    { to: '/dashboard/card-management', icon: CreditCard, label: 'Kartu Siswa' },
    { to: '/dashboard/blog', icon: PenTool, label: 'Edit Blog Sekolah' },
  ];

  const superAdminLinks = [
    { to: '/dashboard/admin', icon: LayoutDashboard, label: 'Platform Stats' },
    { to: '/dashboard/schools', icon: Building, label: 'Manage Schools' },
    { to: '/dashboard/approval-center', icon: CreditCard, label: 'Card Approval' },
    { to: '/dashboard/architecture', icon: Database, label: 'Architecture' },
  ];

  const getLinks = () => {
    if (role === UserRole.SUPER_ADMIN) return superAdminLinks;
    if (role === UserRole.SCHOOL_ADMIN) return schoolAdminLinks;
    if (role === UserRole.TEACHER) return teacherLinks;
    if (role === UserRole.STUDENT) return studentLinks;
    return [];
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <>
      <div className={`fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={toggleSidebar} />
      <aside className={`fixed top-0 left-0 z-30 h-screen w-64 bg-white border-r border-gray-200 transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 flex flex-col`}>
        <div className="h-20 flex items-center px-8 border-b border-gray-100">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center mr-2">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <span className="font-bold text-xl text-dark">Siswa<span className="text-primary">Cerdas</span></span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {getLinks().map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/dashboard' || link.to === '/dashboard/school' || link.to === '/dashboard/admin'}
              className={({ isActive }) => `flex items-center px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-500 hover:bg-gray-50 hover:text-dark'}`}
              onClick={() => { if (window.innerWidth < 768) toggleSidebar(); }}
            >
              <link.icon className="w-5 h-5 mr-3" />
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="flex items-center px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl w-full">
            <LogOut className="w-5 h-5 mr-3" />
            Keluar Akun
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
