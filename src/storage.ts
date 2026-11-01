import { Course, Teacher, Student, AttendanceRecord, ResultRecord, Notice } from './types';
import {
  INITIAL_COURSES,
  INITIAL_TEACHERS,
  INITIAL_STUDENTS,
  INITIAL_ATTENDANCE,
  INITIAL_RESULTS,
  INITIAL_NOTICES
} from './initialData';

const STORAGE_KEYS = {
  COURSES: 'college_cms_courses_v1',
  TEACHERS: 'college_cms_teachers_v1',
  STUDENTS: 'college_cms_students_v1',
  ATTENDANCE: 'college_cms_attendance_v1',
  RESULTS: 'college_cms_results_v1',
  NOTICES: 'college_cms_notices_v1',
  AUTH: 'college_cms_auth_v1',
  THEME: 'college_cms_theme_v1'
};

export const StorageService = {
  getCourses(): Course[] {
    const raw = localStorage.getItem(STORAGE_KEYS.COURSES);
    return raw ? JSON.parse(raw) : INITIAL_COURSES;
  },
  saveCourses(courses: Course[]) {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  },

  getTeachers(): Teacher[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TEACHERS);
    return raw ? JSON.parse(raw) : INITIAL_TEACHERS;
  },
  saveTeachers(teachers: Teacher[]) {
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
  },

  getStudents(): Student[] {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return raw ? JSON.parse(raw) : INITIAL_STUDENTS;
  },
  saveStudents(students: Student[]) {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  },

  getAttendance(): AttendanceRecord[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return raw ? JSON.parse(raw) : INITIAL_ATTENDANCE;
  },
  saveAttendance(attendance: AttendanceRecord[]) {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
  },

  getResults(): ResultRecord[] {
    const raw = localStorage.getItem(STORAGE_KEYS.RESULTS);
    return raw ? JSON.parse(raw) : INITIAL_RESULTS;
  },
  saveResults(results: ResultRecord[]) {
    localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(results));
  },

  getNotices(): Notice[] {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTICES);
    return raw ? JSON.parse(raw) : INITIAL_NOTICES;
  },
  saveNotices(notices: Notice[]) {
    localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(notices));
  },

  getAuth(): { loggedIn: boolean; username: string; fullName: string } {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTH);
    return raw ? JSON.parse(raw) : { loggedIn: true, username: 'admin', fullName: 'Administrator' };
  },
  saveAuth(auth: { loggedIn: boolean; username: string; fullName: string }) {
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(auth));
  },

  resetAll(): void {
    localStorage.removeItem(STORAGE_KEYS.COURSES);
    localStorage.removeItem(STORAGE_KEYS.TEACHERS);
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.ATTENDANCE);
    localStorage.removeItem(STORAGE_KEYS.RESULTS);
    localStorage.removeItem(STORAGE_KEYS.NOTICES);
  }
};
