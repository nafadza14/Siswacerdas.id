
import { createClient } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { UserRole } from '../types';

export const stringifyError = (err: any): string => {
  if (!err) return "Terjadi kesalahan yang tidak diketahui";
  if (typeof err === 'string') return err;
  const message = err.message || err.error_description || err.error || err.msg;
  return typeof message === 'string' ? message : "Kesalahan Koneksi Database";
};

export const dataService = {
  // Attendance Logic
  async submitAttendance(payload: {
    student_id: string;
    school_id: string;
    class_id: string;
    status: string;
    photo: string;
    latitude?: number;
    longitude?: number;
  }) {
    return await supabase.from('attendance_logs').insert([payload]);
  },

  async getAttendanceLogs(schoolId: string, classId?: string) {
    let query = supabase
      .from('attendance_logs')
      .select(`
        *,
        profiles:student_id (full_name, nis, avatar),
        classes:class_id (name)
      `)
      .eq('school_id', schoolId)
      .order('created_at', { ascending: false });
    
    if (classId) {
      query = query.eq('class_id', classId);
    }
    
    return await query;
  },

  // Auth & Profile
  async login(identifier: string, password: string) {
    let email = identifier.trim();
    if (!email.includes('@')) email = `${email.toLowerCase()}@siswacerdas.id`;
    return await supabase.auth.signInWithPassword({ email, password });
  },

  // Fix: Added missing loginWithKtsToken method to handle student ID card login
  async loginWithKtsToken(token: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*, schools(*), classes:class_id(name)')
        .eq('kts_token', token)
        .maybeSingle();

      if (error) return { data: null, error };
      if (!data) return { data: null, error: { message: "Token KTS tidak valid atau tidak terdaftar." } };

      return { data, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  async getCurrentUserProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      if (user.email === 'id.siswacerdas@gmail.com') {
        return { profile: { id: user.id, email: user.email, role: UserRole.SUPER_ADMIN, full_name: 'Super Admin' }, error: null };
      }
      const { data, error } = await supabase
        .from('profiles')
        .select('*, schools(*), classes:class_id(name)')
        .eq('id', user.id)
        .maybeSingle();
      return { profile: data, error };
    } catch (err) { return { profile: null, error: err }; }
  },

  async getProfilesBySchool(schoolId: string, role: UserRole) {
    return await supabase
      .from('profiles')
      .select('*, classes(*)')
      .eq('school_id', schoolId)
      .eq('role', role)
      .order('full_name');
  },

  async getSchools() {
    return await supabase.from('schools').select('*').order('created_at', { ascending: false });
  },

  async registerSchool(formData: any) {
    const { data: school, error: schoolError } = await supabase
      .from('schools')
      .insert([{
        name: formData.name, npsn: formData.npsn, address: formData.address,
        district: formData.district, city: formData.city, province: formData.province,
        postal_code: formData.postalCode, principal: formData.principal,
        email: formData.email, phone: formData.phone, logo: formData.logo,
        latitude: parseFloat(formData.latitude) || 0, longitude: parseFloat(formData.longitude) || 0,
        status: 'PENDING'
      }])
      .select().single();
    if (schoolError) return { error: schoolError };
    return await supabase.auth.signUp({
      email: formData.email, password: formData.password,
      options: { data: { name: formData.principal, role: UserRole.SCHOOL_ADMIN, school_id: school.id } }
    });
  },

  async approveSchool(id: string) {
    return await supabase.from('schools').update({ status: 'ACTIVE' }).eq('id', id);
  },

  async updateSchoolProfile(id: string, updates: any) {
    return await supabase.from('schools').update(updates).eq('id', id);
  },

  async getClassesBySchool(schoolId: string) {
    return await supabase.from('classes').select('*').eq('school_id', schoolId).order('name');
  },

  async addClass(schoolId: string, name: string) {
    return await supabase.from('classes').insert([{ school_id: schoolId, name, grade_level: 10, major: 'Umum' }]);
  },

  async deleteClass(id: string) {
    return await supabase.from('classes').delete().eq('id', id);
  },

  async deleteProfile(id: string) {
    return await supabase.from('profiles').delete().eq('id', id);
  },

  async updateProfile(id: string, updates: any) {
    return await supabase.from('profiles').update(updates).eq('id', id);
  },

  async signUp(params: any) {
    return await supabase.auth.signUp({
      email: params.email, password: params.password,
      options: { 
        data: { 
          name: params.fullName, 
          role: params.role, 
          school_id: params.schoolId, 
          class_id: params.classId, 
          nis: params.nis,
          avatar: params.avatar 
        } 
      }
    });
  },

  // Existing helpers
  async getKtsApplications(schoolId?: string) {
    let query = supabase
      .from('kts_applications')
      .select(`
        *,
        profiles:student_id (id, full_name, nis, avatar, kts_token, classes:class_id(name)),
        schools:school_id (*)
      `);
    if (schoolId) query = query.eq('school_id', schoolId);
    return await query.order('created_at', { ascending: false });
  },

  async applyKtsCollective(schoolId: string, studentIds: string[], templateId: string, batchName: string) {
    const records = studentIds.map(sid => ({
      school_id: schoolId,
      student_id: sid,
      template_id: templateId,
      batch_name: batchName,
      status: 'PENDING'
    }));
    return await supabase.from('kts_applications').insert(records);
  },

  async getAlumni(schoolId: string) {
    return await supabase
      .from('alumni')
      .select('*')
      .eq('school_id', schoolId)
      .order('graduation_year', { ascending: false });
  },

  async addAlumni(data: any) {
    return await supabase.from('alumni').insert([data]);
  },

  async deleteAlumni(id: string) {
    return await supabase.from('alumni').delete().eq('id', id);
  },

  async addAchievement(data: any) {
    return await supabase.from('achievements').insert([data]);
  },

  async getAchievements(schoolId: string) {
    return await supabase
      .from('achievements')
      .select(`
        *,
        profiles:student_id (id, full_name, avatar, nis, classes:class_id (name))
      `)
      .eq('school_id', schoolId)
      .order('achievement_date', { ascending: false });
  },

  async deleteAchievement(id: string) {
    return await supabase.from('achievements').delete().eq('id', id);
  },

  async getMyAchievements(studentId: string) {
    return await supabase
      .from('achievements')
      .select(`
        *,
        schools:school_id (*),
        profiles:student_id (id, full_name, nis, classes:class_id (name))
      `)
      .eq('student_id', studentId)
      .order('achievement_date', { ascending: false });
  },

  async getSchedulesByTeacher(teacherId: string) {
    return await supabase.from('schedules').select('*, classes:class_id(name)').eq('teacher_id', teacherId);
  },

  async getSchedulesByClass(classId: string) {
    return await supabase.from('schedules').select('*, profiles:teacher_id(full_name)').eq('class_id', classId);
  },

  async addSchedule(data: any) {
    return await supabase.from('schedules').insert([data]);
  },

  async updateSchedule(id: string, updates: any) {
    return await supabase.from('schedules').update(updates).eq('id', id);
  },

  async deleteSchedule(id: string) {
    return await supabase.from('schedules').delete().eq('id', id);
  },

  async addBroadcast(data: any) {
    return await supabase.from('broadcasts').insert([data]);
  },

  async deleteBroadcast(id: string) {
    return await supabase.from('broadcasts').delete().eq('id', id);
  },

  async getBroadcasts(schoolId: string, targetRole?: string) {
    let query = supabase.from('broadcasts').select('*').eq('school_id', schoolId);
    if (targetRole) query = query.in('target', ['ALL', targetRole]);
    return await query.order('created_at', { ascending: false });
  }
};
