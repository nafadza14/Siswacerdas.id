
import { UserRole, SchoolProfile, ClassGroup, Student, CardApplication, Alumni, Achievement, BlogPost } from './types';

export const CARD_PHOTO_MAIN = "https://i.pinimg.com/736x/c2/ec/95/c2ec953ef952d591b2b8ae0d98f59e96.jpg";
export const PREVIEW_LOGO = "https://i.pinimg.com/736x/e4/fc/df/e4fcdfa9937a726e285649eb54615769.jpg";

// Data Master Kosong (Akan diisi dari Database)
export const MOCK_SCHOOL_DATA: SchoolProfile | null = null;
export const MOCK_CLASSES: ClassGroup[] = [];
export const MOCK_STUDENTS: Student[] = [];
export const MOCK_SCHOOLS: SchoolProfile[] = [];
export const MOCK_CARD_APPLICATIONS: CardApplication[] = [];
export const MOCK_ALUMNI: Alumni[] = [];
export const MOCK_ACHIEVEMENTS: Achievement[] = [];
export const MOCK_ANNOUNCEMENTS: any[] = [];
export const MOCK_BLOG_POSTS: BlogPost[] = [];

export const MOCK_EXAM = {
  id: 'empty',
  title: 'Tidak Ada Ujian Aktif',
  subject: '-',
  durationMinutes: 0,
  questions: []
};
