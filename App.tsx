
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import RegisterSchool from './pages/auth/RegisterSchool';
import Sidebar from './components/Sidebar';
import Attendance from './pages/dashboard/Attendance';
import StudentAttendance from './pages/dashboard/StudentAttendance';
import StudentHome from './pages/dashboard/StudentHome';
import CBT from './pages/dashboard/CBT';
import Classes from './pages/dashboard/Classes'; 
import Schedule from './pages/dashboard/Schedule'; 
import SystemArchitecture from './pages/dashboard/SystemArchitecture'; 
import BlogManager from './pages/dashboard/BlogManager';
import BlogPublic from './pages/BlogPublic';
import BlogDetail from './pages/BlogDetail';
import CardGenerator from './pages/CardGenerator'; 

// New School Features
import SchoolDashboard from './pages/dashboard/SchoolDashboard';
import DataMaster from './pages/dashboard/DataMaster';
import TracerStudy from './pages/dashboard/TracerStudy';
import AchievementManager from './pages/dashboard/AchievementManager';
import BroadcastManager from './pages/dashboard/BroadcastManager';
import StudentCardManagement from './pages/dashboard/StudentCardManagement';
import SchoolProfile from './pages/dashboard/SchoolProfile';
import ScheduleManagement from './pages/dashboard/ScheduleManagement';
import SchoolAttendanceView from './pages/dashboard/SchoolAttendanceView';

// Super Admin Features
import SuperAdminDashboard from './pages/dashboard/SuperAdminDashboard';
import SchoolManagement from './pages/dashboard/SchoolManagement';
import CardApprovalCenter from './pages/dashboard/CardApprovalCenter';

import { UserRole } from './types';
import { Bell, Search, Menu, Clock } from 'lucide-react';
import { CARD_PHOTO_MAIN } from './constants';

const RealtimeHeaderClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="hidden lg:flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2 text-primary font-mono font-bold text-sm border border-gray-100">
      <Clock size={16} />
      <span>{time.toLocaleTimeString('id-ID', { hour12: false })}</span>
    </div>
  );
};

const DashboardLayout: React.FC<{ children: React.ReactNode; role: UserRole }> = ({ children, role }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    if (location.pathname.includes('student-attendance')) return 'Presensi Mandiri';
    if (location.pathname.includes('school')) return 'School Dashboard';
    if (location.pathname.includes('master-data')) return 'Master Data Management';
    if (location.pathname.includes('rekap-presensi')) return 'Rekap Presensi Real-time';
    if (location.pathname.includes('tracer-study')) return 'Tracer Study';
    if (location.pathname.includes('achievements')) return 'Student Achievements';
    if (location.pathname.includes('broadcast')) return 'Communication Hub';
    if (location.pathname.includes('profile')) return 'Profil Sekolah';
    if (location.pathname.includes('card-management')) return 'Kartu Siswa';
    if (location.pathname.includes('schedule-manage')) return 'Manajemen Jadwal';
    if (location.pathname.includes('admin')) return 'Admin Dashboard';
    if (location.pathname.includes('schools')) return 'School Management';
    if (location.pathname.includes('approval-center')) return 'Card Approval Center';
    return 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Sidebar role={role} isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="md:ml-64 transition-all duration-300">
        <header className="bg-white h-20 border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-500">
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-dark hidden sm:block">{getPageTitle()}</h2>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
             <RealtimeHeaderClock />
             <div className="hidden md:flex items-center bg-gray-100 rounded-xl px-4 py-2 text-gray-500">
                <Search size={18} />
                <input type="text" placeholder="Search..." className="bg-transparent border-none focus:outline-none ml-2 text-sm w-32" />
             </div>
             <div className="relative">
                <Bell size={20} className="text-gray-500" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
             </div>
             <div className="flex items-center gap-3 border-l pl-6 border-gray-200">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-dark">Platform Admin</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">{role.replace('_', ' ')}</p>
                </div>
                <img src={CARD_PHOTO_MAIN} alt="Profile" className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
             </div>
          </div>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
};

const DemoWrapper = ({ role, component: Component }: { role: UserRole, component: React.FC }) => (
  <DashboardLayout role={role}>
    <Component />
  </DashboardLayout>
);

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register-school" element={<RegisterSchool />} />
        <Route path="/blog" element={<BlogPublic />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/cards" element={<CardGenerator />} />
        
        {/* Student Routes */}
        <Route path="/dashboard" element={<DemoWrapper role={UserRole.STUDENT} component={StudentHome} />} />
        <Route path="/dashboard/student-attendance" element={<DemoWrapper role={UserRole.STUDENT} component={StudentAttendance} />} />
        <Route path="/dashboard/schedule" element={<DemoWrapper role={UserRole.STUDENT} component={Schedule} />} />
        
        {/* School Admin Routes */}
        <Route path="/dashboard/school" element={<DemoWrapper role={UserRole.SCHOOL_ADMIN} component={SchoolDashboard} />} />
        <Route path="/dashboard/profile" element={<DemoWrapper role={UserRole.SCHOOL_ADMIN} component={SchoolProfile} />} />
        <Route path="/dashboard/master-data" element={<DemoWrapper role={UserRole.SCHOOL_ADMIN} component={DataMaster} />} />
        <Route path="/dashboard/rekap-presensi" element={<DemoWrapper role={UserRole.SCHOOL_ADMIN} component={SchoolAttendanceView} />} />
        <Route path="/dashboard/schedule-manage" element={<DemoWrapper role={UserRole.SCHOOL_ADMIN} component={ScheduleManagement} />} />
        <Route path="/dashboard/tracer-study" element={<DemoWrapper role={UserRole.SCHOOL_ADMIN} component={TracerStudy} />} />
        <Route path="/dashboard/achievements" element={<DemoWrapper role={UserRole.SCHOOL_ADMIN} component={AchievementManager} />} />
        <Route path="/dashboard/broadcast" element={<DemoWrapper role={UserRole.SCHOOL_ADMIN} component={BroadcastManager} />} />
        <Route path="/dashboard/blog" element={<DemoWrapper role={UserRole.SCHOOL_ADMIN} component={BlogManager} />} />
        <Route path="/dashboard/card-management" element={<DemoWrapper role={UserRole.SCHOOL_ADMIN} component={StudentCardManagement} />} />

        {/* Super Admin Routes */}
        <Route path="/dashboard/admin" element={<DemoWrapper role={UserRole.SUPER_ADMIN} component={SuperAdminDashboard} />} />
        <Route path="/dashboard/schools" element={<DemoWrapper role={UserRole.SUPER_ADMIN} component={SchoolManagement} />} />
        <Route path="/dashboard/approval-center" element={<DemoWrapper role={UserRole.SUPER_ADMIN} component={CardApprovalCenter} />} />
        <Route path="/dashboard/architecture" element={<DemoWrapper role={UserRole.SUPER_ADMIN} component={SystemArchitecture} />} />

        {/* Teacher Routes */}
        <Route path="/dashboard/attendance" element={<DemoWrapper role={UserRole.TEACHER} component={Attendance} />} />
        <Route path="/dashboard/classes" element={<DemoWrapper role={UserRole.TEACHER} component={Classes} />} />
        
        {/* Shared/Hybrid Routes */}
        <Route path="/dashboard/cbt" element={<DemoWrapper role={UserRole.STUDENT} component={CBT} />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
