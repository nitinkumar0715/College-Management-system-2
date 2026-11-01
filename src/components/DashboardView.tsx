import React from 'react';
import { Student, Teacher, Course, AttendanceRecord, Notice, ActiveTab } from '../types';
import {
  GraduationCap,
  Users,
  BookOpen,
  CalendarCheck,
  TrendingUp,
  ArrowRight,
  PlusCircle,
  BellRing,
  Award
} from 'lucide-react';

interface DashboardViewProps {
  students: Student[];
  teachers: Teacher[];
  courses: Course[];
  attendance: AttendanceRecord[];
  notices: Notice[];
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAddStudent: () => void;
  onOpenMarkAttendance: () => void;
  onOpenAddResult: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  students,
  teachers,
  courses,
  attendance,
  notices,
  setActiveTab,
  onOpenAddStudent,
  onOpenMarkAttendance,
  onOpenAddResult
}) => {
  // Compute overall attendance rate
  const totalAttendanceLogs = attendance.length;
  const presentCount = attendance.filter((a) => a.status === 'Present').length;
  const attendanceRate = totalAttendanceLogs > 0
    ? Math.round((presentCount / totalAttendanceLogs) * 1000) / 10
    : 0;

  // Compute student distribution by course
  const courseCounts = courses.map((course) => {
    const count = students.filter((s) => s.course === course.course_id).length;
    return {
      courseId: course.course_id,
      courseName: course.course_name,
      department: course.department,
      count
    };
  });

  const maxStudentCount = Math.max(...courseCounts.map((c) => c.count), 1);

  // Recent 5 admissions
  const recentStudents = [...students].slice(0, 5);

  // Recent 4 notices
  const recentNotices = [...notices].slice(0, 4);

  return (
    <div className="space-y-6">
      {/* 4 Primary Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Students */}
        <div
          onClick={() => setActiveTab('students')}
          className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Students
            </span>
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {students.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Enrolled</span>
          </div>
          <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
            <span>Manage students</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 2: Faculty */}
        <div
          onClick={() => setActiveTab('teachers')}
          className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-400 dark:hover:border-emerald-600 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Faculty Staff
            </span>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {teachers.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Professors</span>
          </div>
          <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <span>Faculty directory</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 3: Courses */}
        <div
          onClick={() => setActiveTab('courses')}
          className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-purple-400 dark:hover:border-purple-600 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Academic Courses
            </span>
            <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {courses.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Programs</span>
          </div>
          <div className="mt-2 text-xs text-purple-600 dark:text-purple-400 font-medium flex items-center gap-1">
            <span>Course curricula</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 4: Attendance */}
        <div
          onClick={() => setActiveTab('attendance')}
          className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-400 dark:hover:border-amber-600 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Attendance Logs
            </span>
            <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {attendance.length}
            </span>
            <span className={`text-xs font-bold ${attendanceRate >= 75 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
              ({attendanceRate}% avg)
            </span>
          </div>
          <div className="mt-2 text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
            <span>Track roll calls</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* Main Grid: Chart & Recent Students on Left, Notices & Actions on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Student Distribution Chart Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Student Distribution by Engineering Course
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Real-time aggregation from SQLite database
                </p>
              </div>
              <span className="text-xs font-mono font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                {courses.length} Courses
              </span>
            </div>

            {/* Custom Interactive SVG/HTML Bar Chart */}
            <div className="space-y-3.5 pt-2">
              {courseCounts.map((c) => {
                const percentage = Math.round((c.count / maxStudentCount) * 100);
                return (
                  <div key={c.courseId} className="group">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-mono text-slate-800 dark:text-slate-200">
                          {c.courseId}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 truncate max-w-[200px] sm:max-w-[340px]">
                          {c.courseName}
                        </span>
                      </div>
                      <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <span className="text-blue-600 dark:text-blue-400 font-bold">{c.count}</span>
                        <span className="text-[11px] text-slate-400">students</span>
                      </div>
                    </div>
                    {/* Bar track */}
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500 group-hover:brightness-110"
                        style={{ width: `${Math.max(percentage, 8)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Admissions Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Recent Student Admissions
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Latest admitted engineering students
                </p>
              </div>
              <button
                onClick={() => setActiveTab('students')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-4">Student ID</th>
                    <th className="py-2.5 px-4">Full Name</th>
                    <th className="py-2.5 px-4">Course</th>
                    <th className="py-2.5 px-4">Semester</th>
                    <th className="py-2.5 px-4 text-right">Admitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {recentStudents.map((s) => (
                    <tr key={s.student_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                        {s.student_id}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                        {s.full_name}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {s.course}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                        {s.semester}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-500 dark:text-slate-400 font-mono">
                        {s.admission_date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Notice Board & Quick Actions */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-bold flex items-center gap-2 mb-1">
              <PlusCircle className="w-4 h-4" />
              Quick Administrative Tasks
            </h3>
            <p className="text-xs text-blue-100 mb-4">
              Shortcut actions for daily college operations
            </p>

            <div className="space-y-2">
              <button
                onClick={onOpenAddStudent}
                className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-semibold backdrop-blur-xs transition-colors"
              >
                <span>➕ Enroll New Student</span>
                <span className="text-[10px] text-blue-200">Form</span>
              </button>
              <button
                onClick={onOpenMarkAttendance}
                className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-semibold backdrop-blur-xs transition-colors"
              >
                <span>🗓️ Mark Today's Attendance</span>
                <span className="text-[10px] text-blue-200">Daily Log</span>
              </button>
              <button
                onClick={onOpenAddResult}
                className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-semibold backdrop-blur-xs transition-colors"
              >
                <span>📝 Enter Semester Marks</span>
                <span className="text-[10px] text-blue-200">Grading</span>
              </button>
            </div>
          </div>

          {/* Recent Campus Notices */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BellRing className="w-4 h-4 text-amber-500" />
                Latest Campus Notices
              </h3>
              <button
                onClick={() => setActiveTab('notices')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                All &rarr;
              </button>
            </div>

            <div className="space-y-3.5">
              {recentNotices.map((n) => (
                <div
                  key={n.id}
                  className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                      {n.category}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {n.notice_date}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                    {n.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {n.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
