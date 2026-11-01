/**
 * Smart College Management System - Main React Application
 * Designed for B.Tech 2nd Year Project & Evaluation.
 */

import React, { useState, useEffect } from 'react';
import {
  ActiveTab,
  Student,
  Teacher,
  Course,
  AttendanceRecord,
  ResultRecord,
  Notice,
  ToastMessage
} from './types';
import { StorageService } from './storage';
import { calculateGrade } from './initialData';

// UI Components
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { DashboardView } from './components/DashboardView';
import { StudentsView } from './components/StudentsView';
import { TeachersView } from './components/TeachersView';
import { CoursesView } from './components/CoursesView';
import { AttendanceView } from './components/AttendanceView';
import { ResultsView } from './components/ResultsView';
import { NoticesView } from './components/NoticesView';
import { CodeExplorerView } from './components/CodeExplorerView';
import { VivaGuideView } from './components/VivaGuideView';
import { LoginView } from './components/LoginView';

export default function App() {
  // Authentication State
  const [auth, setAuth] = useState(() => StorageService.getAuth());

  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  // Theme State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('college_cms_theme_mode');
    return saved ? saved === 'dark' : false;
  });

  // Database / Entity States
  const [students, setStudents] = useState<Student[]>(() => StorageService.getStudents());
  const [teachers, setTeachers] = useState<Teacher[]>(() => StorageService.getTeachers());
  const [courses, setCourses] = useState<Course[]>(() => StorageService.getCourses());
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => StorageService.getAttendance());
  const [results, setResults] = useState<ResultRecord[]>(() => StorageService.getResults());
  const [notices, setNotices] = useState<Notice[]>(() => StorageService.getNotices());

  // Global Toast Messages
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modal Shortcut Triggers
  const [isMarkAttendanceOpen, setIsMarkAttendanceOpen] = useState(false);
  const [isAddResultOpen, setIsAddResultOpen] = useState(false);
  const [selectedMarksheetStudentId, setSelectedMarksheetStudentId] = useState<string | null>(null);

  // Synchronize Dark Mode Class with <html> element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('college_cms_theme_mode', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('college_cms_theme_mode', 'light');
    }
  }, [darkMode]);

  // Persist State to LocalStorage on changes
  useEffect(() => {
    StorageService.saveStudents(students);
  }, [students]);

  useEffect(() => {
    StorageService.saveTeachers(teachers);
  }, [teachers]);

  useEffect(() => {
    StorageService.saveCourses(courses);
  }, [courses]);

  useEffect(() => {
    StorageService.saveAttendance(attendance);
  }, [attendance]);

  useEffect(() => {
    StorageService.saveResults(results);
  }, [results]);

  useEffect(() => {
    StorageService.saveNotices(notices);
  }, [notices]);

  useEffect(() => {
    StorageService.saveAuth(auth);
  }, [auth]);

  // Toast Helper
  const showToast = (type: ToastMessage['type'], message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  // Reset to Initial Seed Data
  const handleResetData = () => {
    StorageService.resetAll();
    setStudents(StorageService.getStudents());
    setTeachers(StorageService.getTeachers());
    setCourses(StorageService.getCourses());
    setAttendance(StorageService.getAttendance());
    setResults(StorageService.getResults());
    setNotices(StorageService.getNotices());
    showToast('info', 'Database reset to original sample seed records.');
  };

  // Auth Handlers
  const handleLoginSuccess = (username: string, fullName: string) => {
    setAuth({ loggedIn: true, username, fullName });
    showToast('success', `Welcome, ${fullName}! Logged in successfully.`);
  };

  const handleLogout = () => {
    setAuth({ loggedIn: false, username: '', fullName: '' });
    showToast('info', 'You have been logged out.');
  };

  // Student CRUD
  const handleAddStudent = (newStudent: Student) => {
    setStudents((prev) => [newStudent, ...prev]);
    showToast('success', `Student '${newStudent.full_name}' (${newStudent.student_id}) enrolled successfully.`);
  };

  const handleEditStudent = (updatedStudent: Student) => {
    setStudents((prev) =>
      prev.map((s) => (s.student_id === updatedStudent.student_id ? updatedStudent : s))
    );
    showToast('success', `Student '${updatedStudent.student_id}' details updated.`);
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents((prev) => prev.filter((s) => s.student_id !== studentId));
    // Cascade delete attendance and results
    setAttendance((prev) => prev.filter((a) => a.student_id !== studentId));
    setResults((prev) => prev.filter((r) => r.student_id !== studentId));
    showToast('info', `Student '${studentId}' and associated records deleted.`);
  };

  // Teacher CRUD
  const handleAddTeacher = (newTeacher: Teacher) => {
    setTeachers((prev) => [...prev, newTeacher]);
    showToast('success', `Faculty member '${newTeacher.name}' added successfully.`);
  };

  const handleEditTeacher = (updatedTeacher: Teacher) => {
    setTeachers((prev) =>
      prev.map((t) => (t.teacher_id === updatedTeacher.teacher_id ? updatedTeacher : t))
    );
    showToast('success', `Teacher '${updatedTeacher.teacher_id}' details updated.`);
  };

  const handleDeleteTeacher = (teacherId: string) => {
    setTeachers((prev) => prev.filter((t) => t.teacher_id !== teacherId));
    showToast('info', `Faculty record '${teacherId}' removed.`);
  };

  // Course CRUD
  const handleAddCourse = (newCourse: Course) => {
    setCourses((prev) => [...prev, newCourse]);
    showToast('success', `Degree Program '${newCourse.course_name}' created.`);
  };

  const handleEditCourse = (updatedCourse: Course) => {
    setCourses((prev) =>
      prev.map((c) => (c.course_id === updatedCourse.course_id ? updatedCourse : c))
    );
    showToast('success', `Course '${updatedCourse.course_id}' updated.`);
  };

  const handleDeleteCourse = (courseId: string) => {
    setCourses((prev) => prev.filter((c) => c.course_id !== courseId));
    showToast('info', `Course program '${courseId}' deleted.`);
  };

  // Attendance Handlers (with duplicate check!)
  const handleMarkAttendance = (newRecord: Omit<AttendanceRecord, 'id'>) => {
    // Check if attendance already recorded for this student on this date
    const exists = attendance.some(
      (a) => a.student_id === newRecord.student_id && a.attendance_date === newRecord.attendance_date
    );

    if (exists) {
      return {
        success: false,
        message: `Duplicate entry blocked: Attendance for '${newRecord.student_id}' on '${newRecord.attendance_date}' is already recorded in database.`
      };
    }

    const nextId = attendance.length > 0 ? Math.max(...attendance.map((a) => a.id)) + 1 : 1;
    const recordWithId: AttendanceRecord = { id: nextId, ...newRecord };
    setAttendance((prev) => [recordWithId, ...prev]);
    showToast('success', `Attendance marked as '${newRecord.status}' for ${newRecord.student_id}.`);
    return { success: true, message: 'Saved successfully' };
  };

  const handleDeleteAttendance = (id: number) => {
    setAttendance((prev) => prev.filter((a) => a.id !== id));
    showToast('info', 'Attendance log entry removed.');
  };

  // Result Handlers
  const handleAddResult = (newRecord: Omit<ResultRecord, 'id' | 'percentage' | 'grade' | 'status'>) => {
    const { percentage, grade, status } = calculateGrade(
      newRecord.marks_obtained,
      newRecord.total_marks
    );

    const nextId = results.length > 0 ? Math.max(...results.map((r) => r.id)) + 1 : 1;
    const fullRecord: ResultRecord = {
      id: nextId,
      ...newRecord,
      percentage,
      grade,
      status
    };

    setResults((prev) => [fullRecord, ...prev]);
    showToast('success', `Result recorded: ${newRecord.subject} for ${newRecord.student_id} (${percentage}%, Grade ${grade}).`);
  };

  const handleEditResult = (updatedResult: ResultRecord) => {
    setResults((prev) => prev.map((r) => (r.id === updatedResult.id ? updatedResult : r)));
    showToast('success', 'Examination result record updated.');
  };

  const handleDeleteResult = (id: number) => {
    setResults((prev) => prev.filter((r) => r.id !== id));
    showToast('info', 'Result record deleted.');
  };

  // Notice Handlers
  const handleAddNotice = (newNotice: Omit<Notice, 'id'>) => {
    const nextId = notices.length > 0 ? Math.max(...notices.map((n) => n.id)) + 1 : 1;
    setNotices((prev) => [{ id: nextId, ...newNotice }, ...prev]);
    showToast('success', `Campus notice '${newNotice.title}' published.`);
  };

  const handleDeleteNotice = (id: number) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
    showToast('info', 'Notice deleted from bulletin board.');
  };

  // Direct Marksheet navigation
  const handleViewMarksheet = (studentId: string) => {
    setSelectedMarksheetStudentId(studentId);
    setActiveTab('results');
  };

  // If not logged in, show Login view
  if (!auth.loggedIn) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col transition-colors">
      {/* Toast Notification Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl border shadow-lg text-xs font-semibold flex items-center justify-between gap-3 animate-in slide-in-from-top-2 duration-200 ${
              toast.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                : toast.type === 'danger'
                ? 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
                : toast.type === 'warning'
                ? 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200'
                : 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
            }`}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="text-current opacity-70 hover:opacity-100 text-sm font-bold"
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      {/* Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'results') {
            setSelectedMarksheetStudentId(null);
          }
        }}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onLogout={handleLogout}
        adminName={auth.fullName}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex-1 flex flex-col min-h-screen">
        <Topbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onMobileToggle={() => setMobileOpen(!mobileOpen)}
          onResetData={handleResetData}
          adminName={auth.fullName}
        />

        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          {activeTab === 'dashboard' && (
            <DashboardView
              students={students}
              teachers={teachers}
              courses={courses}
              attendance={attendance}
              notices={notices}
              setActiveTab={setActiveTab}
              onOpenAddStudent={() => setActiveTab('students')}
              onOpenMarkAttendance={() => {
                setActiveTab('attendance');
                setIsMarkAttendanceOpen(true);
              }}
              onOpenAddResult={() => {
                setActiveTab('results');
                setIsAddResultOpen(true);
              }}
            />
          )}

          {activeTab === 'students' && (
            <StudentsView
              students={students}
              courses={courses}
              onAddStudent={handleAddStudent}
              onEditStudent={handleEditStudent}
              onDeleteStudent={handleDeleteStudent}
              onViewMarksheet={handleViewMarksheet}
            />
          )}

          {activeTab === 'teachers' && (
            <TeachersView
              teachers={teachers}
              onAddTeacher={handleAddTeacher}
              onEditTeacher={handleEditTeacher}
              onDeleteTeacher={handleDeleteTeacher}
            />
          )}

          {activeTab === 'courses' && (
            <CoursesView
              courses={courses}
              students={students}
              onAddCourse={handleAddCourse}
              onEditCourse={handleEditCourse}
              onDeleteCourse={handleDeleteCourse}
            />
          )}

          {activeTab === 'attendance' && (
            <AttendanceView
              attendance={attendance}
              students={students}
              onMarkAttendance={handleMarkAttendance}
              onDeleteAttendance={handleDeleteAttendance}
              isMarkModalOpen={isMarkAttendanceOpen}
              setIsMarkModalOpen={setIsMarkAttendanceOpen}
            />
          )}

          {activeTab === 'results' && (
            <ResultsView
              results={results}
              students={students}
              courses={courses}
              onAddResult={handleAddResult}
              onEditResult={handleEditResult}
              onDeleteResult={handleDeleteResult}
              isAddModalOpen={isAddResultOpen}
              setIsAddModalOpen={setIsAddResultOpen}
              selectedMarksheetStudentId={selectedMarksheetStudentId}
              setSelectedMarksheetStudentId={setSelectedMarksheetStudentId}
            />
          )}

          {activeTab === 'notices' && (
            <NoticesView
              notices={notices}
              onAddNotice={handleAddNotice}
              onDeleteNotice={handleDeleteNotice}
            />
          )}

          {activeTab === 'code_explorer' && <CodeExplorerView />}

          {activeTab === 'viva_guide' && <VivaGuideView />}
        </main>
      </div>
    </div>
  );
}
