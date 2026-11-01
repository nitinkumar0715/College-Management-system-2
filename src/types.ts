/**
 * Data Types and Models for Smart College Management System
 */

export interface Course {
  course_id: string;
  course_name: string;
  department: string;
  duration: string;
  created_at?: string;
}

export interface Teacher {
  teacher_id: string;
  name: string;
  email: string;
  department: string;
  subject: string;
  created_at?: string;
}

export interface Student {
  student_id: string;
  full_name: string;
  email: string;
  phone_number: string;
  course: string;
  semester: string;
  admission_date: string;
  created_at?: string;
}

export interface AttendanceRecord {
  id: number;
  student_id: string;
  attendance_date: string;
  status: 'Present' | 'Absent';
  remarks?: string;
  created_at?: string;
}

export interface ResultRecord {
  id: number;
  student_id: string;
  subject: string;
  marks_obtained: number;
  total_marks: number;
  percentage: number;
  grade: string;
  status: 'Pass' | 'Fail';
  semester: string;
  created_at?: string;
}

export interface Notice {
  id: number;
  title: string;
  description: string;
  notice_date: string;
  category: 'Academic' | 'Examination' | 'Events' | 'Placements' | 'General';
  created_at?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'danger' | 'warning' | 'info';
  message: string;
}

export type ActiveTab = 
  | 'dashboard' 
  | 'students' 
  | 'teachers' 
  | 'courses' 
  | 'attendance' 
  | 'results' 
  | 'notices'
  | 'code_explorer'
  | 'viva_guide';
