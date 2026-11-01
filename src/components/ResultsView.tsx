import React, { useState } from 'react';
import { ResultRecord, Student, Course } from '../types';
import { calculateGrade } from '../initialData';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  FileText,
  Printer,
  AlertCircle,
  Award,
  CheckCircle2
} from 'lucide-react';

interface ResultsViewProps {
  results: ResultRecord[];
  students: Student[];
  courses: Course[];
  onAddResult: (result: Omit<ResultRecord, 'id' | 'percentage' | 'grade' | 'status'>) => void;
  onEditResult: (result: ResultRecord) => void;
  onDeleteResult: (id: number) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  selectedMarksheetStudentId: string | null;
  setSelectedMarksheetStudentId: (id: string | null) => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  results,
  students,
  courses,
  onAddResult,
  onEditResult,
  onDeleteResult,
  isAddModalOpen,
  setIsAddModalOpen,
  selectedMarksheetStudentId,
  setSelectedMarksheetStudentId
}) => {
  const [search, setSearch] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');
  const [editingResult, setEditingResult] = useState<ResultRecord | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Add Form State
  const [formData, setFormData] = useState<{
    student_id: string;
    subject: string;
    marks_obtained: string;
    total_marks: string;
    semester: string;
  }>({
    student_id: students[0]?.student_id || '',
    subject: 'Data Structures & Algorithms',
    marks_obtained: '85',
    total_marks: '100',
    semester: 'Semester 3'
  });

  const [formError, setFormError] = useState('');

  // Live preview calculation for the add form
  const obtNum = parseFloat(formData.marks_obtained) || 0;
  const totNum = parseFloat(formData.total_marks) || 100;
  const previewCalc = calculateGrade(obtNum, totNum);

  // Filtered results
  const filteredResults = results.filter((r) => {
    const student = students.find((s) => s.student_id === r.student_id);
    const studentName = student ? student.full_name.toLowerCase() : '';
    const matchesSearch =
      r.student_id.toLowerCase().includes(search.toLowerCase()) ||
      studentName.includes(search.toLowerCase()) ||
      r.subject.toLowerCase().includes(search.toLowerCase());
    const matchesSemester = semesterFilter ? r.semester === semesterFilter : true;
    return matchesSearch && matchesSemester;
  });

  const handleOpenAdd = () => {
    setFormData({
      student_id: students[0]?.student_id || '',
      subject: '',
      marks_obtained: '',
      total_marks: '100',
      semester: 'Semester 3'
    });
    setFormError('');
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.student_id || !formData.subject.trim()) {
      setFormError('Student and Subject name are required.');
      return;
    }

    const marksObt = parseFloat(formData.marks_obtained);
    const marksTot = parseFloat(formData.total_marks);

    if (isNaN(marksObt) || isNaN(marksTot)) {
      setFormError('Marks must be numeric values.');
      return;
    }

    if (marksObt < 0 || marksTot <= 0) {
      setFormError('Marks cannot be negative, and total marks must be greater than 0.');
      return;
    }

    if (marksObt > marksTot) {
      setFormError(`Marks obtained (${marksObt}) cannot exceed total marks (${marksTot}).`);
      return;
    }

    onAddResult({
      student_id: formData.student_id,
      subject: formData.subject.trim(),
      marks_obtained: marksObt,
      total_marks: marksTot,
      semester: formData.semester
    });

    setIsAddModalOpen(false);
  };

  const handleOpenEdit = (record: ResultRecord) => {
    setEditingResult({ ...record });
    setFormError('');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResult) return;
    if (!editingResult.subject.trim()) {
      setFormError('Subject name is required.');
      return;
    }

    if (editingResult.marks_obtained < 0 || editingResult.total_marks <= 0) {
      setFormError('Marks must be non-negative and total must be > 0.');
      return;
    }

    if (editingResult.marks_obtained > editingResult.total_marks) {
      setFormError('Marks obtained cannot exceed total marks.');
      return;
    }

    const { percentage, grade, status } = calculateGrade(
      editingResult.marks_obtained,
      editingResult.total_marks
    );

    onEditResult({
      ...editingResult,
      percentage,
      grade,
      status
    });
    setEditingResult(null);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmId !== null) {
      onDeleteResult(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  // If a student marksheet is selected, render the printable transcript view
  if (selectedMarksheetStudentId) {
    const student = students.find((s) => s.student_id === selectedMarksheetStudentId);
    const course = student ? courses.find((c) => c.course_id === student.course) : null;
    const studentResults = results.filter((r) => r.student_id === selectedMarksheetStudentId);

    const totalObtained = studentResults.reduce((acc, curr) => acc + curr.marks_obtained, 0);
    const totalMax = studentResults.reduce((acc, curr) => acc + curr.total_marks, 0);
    const overallPct = totalMax > 0 ? Math.round((totalObtained / totalMax) * 1000) / 10 : 0;
    const overallGrade = calculateGrade(totalObtained, totalMax > 0 ? totalMax : 1);

    return (
      <div className="space-y-5 max-w-4xl mx-auto">
        {/* Navigation & Print Actions */}
        <div className="flex items-center justify-between no-print">
          <button
            onClick={() => setSelectedMarksheetStudentId(null)}
            className="px-3.5 py-1.5 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors"
          >
            &larr; Back to Results Directory
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save Marksheet (PDF)</span>
          </button>
        </div>

        {/* Official College Marksheet Document */}
        <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-xl p-8 shadow-sm space-y-6">
          {/* Header & Logo */}
          <div className="text-center border-b-2 border-slate-800 dark:border-slate-200 pb-5">
            <div className="text-3xl mb-1">🎓</div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              Smart Institute of Engineering & Technology
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Affiliated to State Technical University · Approved by AICTE · NBA Accredited
            </p>
            <div className="inline-block mt-3 px-4 py-1 text-xs font-bold uppercase tracking-wider border border-slate-800 dark:border-slate-200 rounded">
              Official Semester Examination Marksheet
            </div>
          </div>

          {/* Student Profile Info */}
          {student ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-xs border border-slate-200 dark:border-slate-800">
              <div className="space-y-1.5">
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Student Name:</span>{' '}
                  <strong className="text-slate-900 dark:text-white font-bold">{student.full_name}</strong>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Roll / Student ID:</span>{' '}
                  <code className="font-mono font-bold text-blue-600 dark:text-blue-400">{student.student_id}</code>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Admission Date:</span>{' '}
                  <span className="font-mono">{student.admission_date}</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Enrolled Program:</span>{' '}
                  <strong className="text-slate-900 dark:text-white">{course ? course.course_name : student.course}</strong>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Department:</span>{' '}
                  <span>{course ? course.department : 'Engineering'}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Academic Status:</span>{' '}
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Regular B.Tech Student</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-red-500">Student profile record not found.</p>
          )}

          {/* Subject Grades Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider border-y border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-2.5 px-3">Subject Name</th>
                  <th className="py-2.5 px-3">Semester</th>
                  <th className="py-2.5 px-3">Marks Obtained</th>
                  <th className="py-2.5 px-3">Max Marks</th>
                  <th className="py-2.5 px-3">Percentage</th>
                  <th className="py-2.5 px-3">Grade</th>
                  <th className="py-2.5 px-3 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                {studentResults.length > 0 ? (
                  studentResults.map((r) => (
                    <tr key={r.id}>
                      <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                        {r.subject}
                      </td>
                      <td className="py-3 px-3 text-slate-500 dark:text-slate-400">
                        {r.semester}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                        {r.marks_obtained}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-500 dark:text-slate-400">
                        {r.total_marks}
                      </td>
                      <td className="py-3 px-3 font-mono font-semibold">
                        {r.percentage}%
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                        {r.grade}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${r.status === 'Pass' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-red-100 text-red-800'}`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No examination marks registered for this student yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Grand Total & Final Verdict Box */}
          {studentResults.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-800 text-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Grand Total</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white">
                  {totalObtained} / {totalMax}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Overall Percentage</span>
                <span className="text-base font-extrabold text-blue-600 dark:text-blue-400">
                  {overallPct}%
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Cumulative Grade</span>
                <span className="text-base font-extrabold text-purple-600 dark:text-purple-400">
                  {overallGrade.grade}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Final Status</span>
                <span className={`text-base font-extrabold ${overallGrade.status === 'Pass' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {overallGrade.status.toUpperCase()}
                </span>
              </div>
            </div>
          )}

          {/* Signatures */}
          <div className="pt-10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800">
            <div className="text-center w-36 border-t border-slate-300 dark:border-slate-600 pt-1">
              Class Coordinator
            </div>
            <div className="text-center w-36 border-t border-slate-300 dark:border-slate-600 pt-1">
              Head of Department
            </div>
            <div className="text-center w-40 border-t border-slate-300 dark:border-slate-600 pt-1">
              Controller of Examinations
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student roll no, name, or subject..."
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

          <select
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
            className="px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Semesters</option>
            {['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Enter Student Marks</span>
        </button>
      </div>

      {/* Results Table Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 sm:px-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              Examination Results & Grades
            </span>
            <span className="text-xs font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">
              {filteredResults.length} records
            </span>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            Grading: O (&ge;90%), A+ (&ge;80%), A (&ge;70%), B+ (&ge;60%), B (&ge;50%), C (&ge;40%), F (&lt;40%)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Student ID</th>
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Semester</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Marks Obtained / Max</th>
                <th className="py-3 px-4">Percentage</th>
                <th className="py-3 px-4">Grade</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredResults.length > 0 ? (
                filteredResults.map((r) => {
                  const student = students.find((s) => s.student_id === r.student_id);
                  return (
                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                        {r.student_id}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                        {student ? student.full_name : 'Unknown Student'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                        {r.semester}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                        {r.subject}
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        <strong>{r.marks_obtained}</strong> / {r.total_marks}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                        {r.percentage}%
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">
                          {r.grade}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {r.status === 'Pass' ? (
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                            ✓ Pass
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300">
                            ✗ Fail
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedMarksheetStudentId(r.student_id)}
                            title="Generate Marksheet"
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(r)}
                            title="Edit Result"
                            className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(r.id)}
                            title="Delete Result"
                            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No examination records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* POPUP MODAL 1: ADD RESULT */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 max-w-lg w-full shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Enter Subject Examination Marks
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="p-5 space-y-4 text-xs">
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
                    Subject Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Operating Systems"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Semester *
                  </label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    {['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'].map((sem) => (
                      <option key={sem} value={sem}>{sem}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Marks Obtained *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    required
                    placeholder="e.g. 84"
                    value={formData.marks_obtained}
                    onChange={(e) => setFormData({ ...formData, marks_obtained: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Maximum Total Marks *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    required
                    value={formData.total_marks}
                    onChange={(e) => setFormData({ ...formData, total_marks: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Dynamic Live Grade Preview */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Calculated Percentage</span>
                  <span className="text-base font-extrabold text-blue-600 dark:text-blue-400 font-mono">
                    {previewCalc.percentage}%
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Grade & Status</span>
                  <span className={`text-sm font-bold ${previewCalc.status === 'Pass' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                    Grade {previewCalc.grade} · {previewCalc.status}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
                >
                  Save Marks & Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POPUP MODAL 2: EDIT RESULT */}
      {editingResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 max-w-lg w-full shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Edit Examination Marks Record
              </h3>
              <button
                onClick={() => setEditingResult(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={editingResult.subject}
                  onChange={(e) => setEditingResult({ ...editingResult, subject: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Marks Obtained *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    required
                    value={editingResult.marks_obtained}
                    onChange={(e) => setEditingResult({ ...editingResult, marks_obtained: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Total Marks *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    required
                    value={editingResult.total_marks}
                    onChange={(e) => setEditingResult({ ...editingResult, total_marks: parseFloat(e.target.value) || 100 })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingResult(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
                >
                  Update Marks
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POPUP MODAL 3: DELETE CONFIRMATION */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 max-w-sm w-full p-5 shadow-xl text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center mx-auto text-xl font-bold">
              🗑️
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Delete Result Record?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Are you sure you want to delete this examination mark entry?
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
