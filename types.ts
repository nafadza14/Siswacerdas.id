
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  SCHOOL_ADMIN = 'SCHOOL_ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  PARENT = 'PARENT',
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  email: string;
  phone?: string;
}

export interface ClassGroup {
  id: string;
  name: string;
  gradeLevel: number; // 10, 11, 12
  major: 'IPA' | 'IPS' | 'Umum' | 'Bahasa';
  homeroomTeacher: string;
  studentCount: number;
}

export interface SchoolProfile {
  id: string;
  name: string;
  npsn: string;
  address: string;
  district?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  email: string;
  phone: string;
  logo: string;
  principal: string;
  accreditation: string;
  studentCount: number;
  teacherCount: number;
  classCount: number;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  classes: ClassGroup[];
  documents: {
    skOperasional?: string;
    skAkreditasi?: string;
    logoHighRes?: string;
  };
}

export interface CardApplication {
  id: string;
  schoolId: string;
  schoolName: string;
  requestDate: string;
  studentCount: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  batchName: string;
  classId?: string;
}

export interface Student extends User {
  role: UserRole.STUDENT;
  classId: string;
  nisn: string;
  whatsapp: string;
  parentWhatsapp: string;
  parentPhone: string; // legacy support
  achievements?: Achievement[];
  cardStatus?: 'PENDING' | 'APPROVED' | 'PRINTED';
}

export interface Teacher extends User {
  role: UserRole.TEACHER;
  nip: string;
  subjects: string[];
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  LATE = 'LATE',
  ABSENT = 'ABSENT',
  SICK = 'SICK',
}

export interface Achievement {
  id: string;
  studentId: string;
  title: string;
  date: string;
  category: 'Akademik' | 'Non-Akademik' | 'Sains' | 'Olahraga' | 'Seni';
  rank: string;
}

export interface Alumni {
  id: string;
  name: string;
  graduationYear: number;
  status: 'Kuliah' | 'Kerja' | 'Wirausaha' | 'Lainnya';
  institution: string;
}

export interface BroadcastMessage {
  id: string;
  title: string;
  content: string;
  sentDate: string;
  target: 'ALL' | 'TEACHERS' | 'STUDENTS';
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  imageUrl: string;
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  durationMinutes: number;
  questions: ExamQuestion[];
}

export interface ExamQuestion {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
}
