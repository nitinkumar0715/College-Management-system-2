import React, { useState } from 'react';
import { AttendanceRecord, Student } from '../types';
import {
  Search,
  Plus,
  Trash2,
  CalendarCheck,
  X,
  AlertCircle,
  CheckCircle2,
  Calendar,
  AlertTriangle
} from 'lucide-react';

interface AttendanceViewProps {
  attendance: AttendanceRecord[];
  students: Student[];
  onMarkAttendance: (record: Omit<AttendanceRecord, 'id'>) => { success: boolean; message: string };
  onDeleteAttendance: (id: number) => void;
  isMarkModalOpen: boolean;
  setIsMarkModalOpen: (open: boolean) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  attendance,
  students,
  onMarkAttendance,
  onDeleteAttendance,
  isMarkModalOpen,
  setIsMarkModalOpen
}) => {
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    student_id: string;
    attendance_date: string;
    status: 'Present' | 'Absent';
    remarks: string;
  }>({
    student_id: students[0]?.student_id || '',
    attendance_date: new Date().toISOString().split('T')[0],
    status: 'Present',
    remarks: 'Regular theory session'
  });

  const [formError, setFormError] = useState('');

  // Attendance Records Filtered
  const filteredRecords = attendance.filter((r) => {
    const student = students.find((s) => s.student_id === r.student_id);
    const studentName = student ? student.full_name.toLowerCase() : '';
    const matchesSearch =
      r.student_id.toLowerCase().includes(search.toLowerCase()) ||
      studentName.includes(search.toLowerCase());
    const matchesDate = dateFilter ? r.attendance_date === dateFilter : true;
    return matchesSearch && matchesDate;
  });

  // Calculate Student Attendance Percentage breakdown
  const studentStats = students.map((s) => {
    const studentRecords = attendance.filter((a) => a.student_id === s.student_id);
    const totalDays = studentRecords.length;
    const presentDays = studentRecords.filter((a) => a.status === 'Present').length;
    const percentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 1000) / 10 : 0;
    return {
      studentId: s.student_id,
      fullName: s.full_name,
      course: s.course,
      totalDays,
      presentDays,
      percentage
    };
  });

  const handleOpenMark = () => {
    setFormData({
      student_id: students[0]?.student_id || '',
      attendance_date: new Date().toISOString().split('T')[0],
      status: 'Present',
      remarks: 'Regular theory session'
    });
    setFormError('');
    setIsMarkModalOpen(true);
  };

  const handleSaveAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.student_id || !formData.attendance_date) {
      setFormError('Please select both a student and an attendance date.');
      return;
    }

    const result = onMarkAttendance({
      student_id: formData.student_id,
      attendance_date: formData.attendance_date,
      status: formData.status,
      remarks: formData.remarks
    });

    if (!result.success) {
      setFormError(result.message);
      return;
    }

    setIsMarkModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmId !== null) {
      onDeleteAttendance(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student ID or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="relative">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              title="Filter by date"
            />
            {dateFilter && (
              <button
                onClick={() => setDateFilter('')}
                className="ml-1 text-xs text-blue-600 dark:text-blue-400 font-semibold"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <button
          onClick={handleOpenMark}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-xs transition-colors"
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Mark Attendance</span>
        </button>
      </div>

      {/* Card 1: Student Attendance Percentage Breakdown */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 sm:px-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Student Attendance Percentage & Eligibility
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              College Norm: Minimum 75% attendance required to appear for semester end examinations
            </p>
          </div>
          <span className="text-xs font-mono font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
            Live Calculation
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Roll Number</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Attended / Total</th>
                <th className="py-3 px-4">Percentage</th>
                <th className="py-3 px-4 text-right">Exam Eligibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {studentStats.map((st) => (
                <tr key={st.studentId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                    {st.studentId}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                    {st.fullName}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {st.course}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                    <strong className="text-slate-800 dark:text-slate-200">{st.presentDays}</strong> of {st.totalDays} sessions
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold font-mono text-xs ${st.percentage >= 75 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                        {st.percentage}%
                      </span>
                      <div className="w-20 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            st.percentage >= 75
                              ? 'bg-emerald-500'
                              : st.percentage >= 60
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${st.percentage}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {st.percentage >= 75 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                        <CheckCircle2 className="w-3 h-3" />
                        Eligible
                      </span>
                    ) : st.totalDays === 0 ? (
                      <span className="text-[11px] text-slate-400">No logs</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300">
                        <AlertTriangle className="w-3 h-3" />
                        Shortage (&lt;75%)
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Card 2: Daily Attendance Logs Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 sm:px-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              Daily Attendance Records
            </span>
            <span className="text-xs font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">
              {filteredRecords.length} records
            </span>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            Unique Constraint: <code>student_id + attendance_date</code>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Student ID</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Remarks</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((r) => {
                  const student = students.find((s) => s.student_id === r.student_id);
                  return (
                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-700 dark:text-slate-300">
                        {r.attendance_date}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                        {r.student_id}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                        {student ? student.full_name : 'Unknown Student'}
                      </td>
                      <td className="py-3.5 px-4">
                        {r.status === 'Present' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                            ✓ Present
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300">
                            ✗ Absent
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 italic">
                        {r.remarks || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setDeleteConfirmId(r.id)}
                          title="Delete Attendance Log"
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No attendance logs found matching query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* POPUP MODAL: MARK ATTENDANCE */}
      {isMarkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 max-w-lg w-full shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Record Student Daily Attendance
              </h3>
              <button
                onClick={() => setIsMarkModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAttendance} className="p-5 space-y-4 text-xs">
              {formError && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Select Student *
                </label>
                <select
                  required
                  value={formData.student_id}
                  onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  {students.map((s) => (
                    <option key={s.student_id} value={s.student_id}>
                      {s.student_id} - {s.full_name} ({s.course})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Attendance Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.attendance_date}
                    onChange={(e) => setFormData({ ...formData, attendance_date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Present' | 'Absent' })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    <option value="Present">Present (Attended)</option>
                    <option value="Absent">Absent (Not Present)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Remarks / Topic Covered
                </label>
                <input
                  type="text"
                  placeholder="e.g. Regular theory lecture, lab assignment, medical leave"
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-[11px]">
                🛡️ <strong>SQLite Constraint:</strong> The system enforces a unique composite constraint on <code>(student_id, attendance_date)</code> to prevent duplicate entries on the same day.
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsMarkModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
                >
                  Save Attendance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POPUP MODAL: DELETE CONFIRMATION */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 max-w-sm w-full p-5 shadow-xl text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center mx-auto text-xl font-bold">
              🗑️
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Delete Attendance Entry?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Are you sure you want to remove this attendance log entry?
            </p>
            <div className="pt-3 flex items-center justify-center gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-xs"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
