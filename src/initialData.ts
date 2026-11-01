import { Course, Teacher, Student, AttendanceRecord, ResultRecord, Notice } from './types';

export const INITIAL_COURSES: Course[] = [
  { course_id: 'CSE101', course_name: 'B.Tech Computer Science & Engineering', department: 'Computer Science', duration: '4 Years' },
  { course_id: 'ECE102', course_name: 'B.Tech Electronics & Communication', department: 'Electronics', duration: '4 Years' },
  { course_id: 'ME103', course_name: 'B.Tech Mechanical Engineering', department: 'Mechanical', duration: '4 Years' },
  { course_id: 'IT104', course_name: 'B.Tech Information Technology', department: 'Information Technology', duration: '4 Years' },
  { course_id: 'CE105', course_name: 'B.Tech Civil Engineering', department: 'Civil', duration: '4 Years' }
];

export const INITIAL_TEACHERS: Teacher[] = [
  { teacher_id: 'TCH-101', name: 'Dr. Ramesh Sharma', email: 'r.sharma@college.edu', department: 'Computer Science', subject: 'Data Structures & Algorithms' },
  { teacher_id: 'TCH-102', name: 'Prof. Sunita Verma', email: 's.verma@college.edu', department: 'Computer Science', subject: 'Database Management Systems' },
  { teacher_id: 'TCH-103', name: 'Dr. Arvind Kulkarni', email: 'a.kulkarni@college.edu', department: 'Electronics', subject: 'Digital Signal Processing' },
  { teacher_id: 'TCH-104', name: 'Prof. Priya Nair', email: 'p.nair@college.edu', department: 'Information Technology', subject: 'Computer Networks' },
  { teacher_id: 'TCH-105', name: 'Dr. Rajesh Gupta', email: 'r.gupta@college.edu', department: 'Mechanical', subject: 'Thermodynamics' }
];

export const INITIAL_STUDENTS: Student[] = [
  { student_id: 'STU-2024-001', full_name: 'Aarav Patel', email: 'aarav.patel@student.college.edu', phone_number: '9876543210', course: 'CSE101', semester: 'Semester 3', admission_date: '2024-08-10' },
  { student_id: 'STU-2024-002', full_name: 'Diya Sen', email: 'diya.sen@student.college.edu', phone_number: '9876543211', course: 'CSE101', semester: 'Semester 3', admission_date: '2024-08-11' },
  { student_id: 'STU-2024-003', full_name: 'Rohan Mehta', email: 'rohan.mehta@student.college.edu', phone_number: '9876543212', course: 'ECE102', semester: 'Semester 3', admission_date: '2024-08-12' },
  { student_id: 'STU-2024-004', full_name: 'Ananya Iyer', email: 'ananya.iyer@student.college.edu', phone_number: '9876543213', course: 'IT104', semester: 'Semester 3', admission_date: '2024-08-13' },
  { student_id: 'STU-2024-005', full_name: 'Kabir Singh', email: 'kabir.singh@student.college.edu', phone_number: '9876543214', course: 'ME103', semester: 'Semester 3', admission_date: '2024-08-14' },
  { student_id: 'STU-2024-006', full_name: 'Sneha Reddy', email: 'sneha.reddy@student.college.edu', phone_number: '9876543215', course: 'CSE101', semester: 'Semester 3', admission_date: '2024-08-15' },
  { student_id: 'STU-2024-007', full_name: 'Vikram Joshi', email: 'vikram.joshi@student.college.edu', phone_number: '9876543216', course: 'CE105', semester: 'Semester 3', admission_date: '2024-08-16' }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  { id: 1, student_id: 'STU-2024-001', attendance_date: '2026-10-25', status: 'Present', remarks: 'Regular theory session' },
  { id: 2, student_id: 'STU-2024-001', attendance_date: '2026-10-26', status: 'Present', remarks: 'Data Structures Lab' },
  { id: 3, student_id: 'STU-2024-001', attendance_date: '2026-10-27', status: 'Present', remarks: 'Tutorial' },
  { id: 4, student_id: 'STU-2024-001', attendance_date: '2026-10-28', status: 'Absent', remarks: 'Medical leave' },
  { id: 5, student_id: 'STU-2024-002', attendance_date: '2026-10-27', status: 'Present', remarks: 'Regular session' },
  { id: 6, student_id: 'STU-2024-002', attendance_date: '2026-10-28', status: 'Present', remarks: 'Lab session' },
  { id: 7, student_id: 'STU-2024-003', attendance_date: '2026-10-27', status: 'Absent', remarks: 'Uninformed' },
  { id: 8, student_id: 'STU-2024-003', attendance_date: '2026-10-28', status: 'Present', remarks: 'Regular session' },
  { id: 9, student_id: 'STU-2024-004', attendance_date: '2026-10-27', status: 'Present', remarks: 'Lecture' },
  { id: 10, student_id: 'STU-2024-004', attendance_date: '2026-10-28', status: 'Present', remarks: 'Lecture' },
  { id: 11, student_id: 'STU-2024-005', attendance_date: '2026-10-27', status: 'Present', remarks: 'Workshop' },
  { id: 12, student_id: 'STU-2024-005', attendance_date: '2026-10-28', status: 'Present', remarks: 'Workshop' }
];

export const INITIAL_RESULTS: ResultRecord[] = [
  { id: 1, student_id: 'STU-2024-001', subject: 'Data Structures & Algorithms', marks_obtained: 88, total_marks: 100, percentage: 88, grade: 'A+', status: 'Pass', semester: 'Semester 3' },
  { id: 2, student_id: 'STU-2024-001', subject: 'Database Management Systems', marks_obtained: 92, total_marks: 100, percentage: 92, grade: 'O', status: 'Pass', semester: 'Semester 3' },
  { id: 3, student_id: 'STU-2024-001', subject: 'Discrete Mathematics', marks_obtained: 76, total_marks: 100, percentage: 76, grade: 'A', status: 'Pass', semester: 'Semester 3' },
  { id: 4, student_id: 'STU-2024-002', subject: 'Data Structures & Algorithms', marks_obtained: 82, total_marks: 100, percentage: 82, grade: 'A+', status: 'Pass', semester: 'Semester 3' },
  { id: 5, student_id: 'STU-2024-002', subject: 'Database Management Systems', marks_obtained: 85, total_marks: 100, percentage: 85, grade: 'A+', status: 'Pass', semester: 'Semester 3' },
  { id: 6, student_id: 'STU-2024-003', subject: 'Digital Signal Processing', marks_obtained: 68, total_marks: 100, percentage: 68, grade: 'B+', status: 'Pass', semester: 'Semester 3' },
  { id: 7, student_id: 'STU-2024-004', subject: 'Computer Networks', marks_obtained: 91, total_marks: 100, percentage: 91, grade: 'O', status: 'Pass', semester: 'Semester 3' },
  { id: 8, student_id: 'STU-2024-005', subject: 'Thermodynamics', marks_obtained: 74, total_marks: 100, percentage: 74, grade: 'B+', status: 'Pass', semester: 'Semester 3' }
];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 1,
    title: 'Mid-Term Examination Schedule - Autumn 2026',
    description: 'Mid-term examinations for B.Tech 2nd and 3rd year engineering students will commence from November 15, 2026. Hall tickets can be verified at the examination cell.',
    notice_date: '2026-10-24',
    category: 'Examination'
  },
  {
    id: 2,
    title: 'Annual Technical Fest "Innovate 2026"',
    description: 'Registration is officially open for National Level Hackathons, Robotics battles, and Technical Paper Presentations. Last date to register is November 5, 2026.',
    notice_date: '2026-10-22',
    category: 'Events'
  },
  {
    id: 3,
    title: 'Campus Placement Drive - TechCorp Solutions',
    description: 'Eligibility criteria: B.Tech CSE, IT, and ECE students with CGPA >= 7.0 and zero standing backlogs. Mandatory pre-placement talk on November 8, 2026 at the Main Auditorium.',
    notice_date: '2026-10-20',
    category: 'Placements'
  },
  {
    id: 4,
    title: 'Submission of B.Tech 2nd Year Mini-Projects',
    description: 'All 2nd-year B.Tech students must submit their complete code repository, documentation report, and live working demo to their respective departmental project guides by November 10, 2026.',
    notice_date: '2026-10-18',
    category: 'Academic'
  }
];

export function calculateGrade(marks: number, total: number): { percentage: number; grade: string; status: 'Pass' | 'Fail' } {
  if (total <= 0) return { percentage: 0, grade: 'F', status: 'Fail' };
  const percentage = Math.round((marks / total) * 1000) / 10;
  let grade = 'F';
  if (percentage >= 90) grade = 'O';
  else if (percentage >= 80) grade = 'A+';
  else if (percentage >= 70) grade = 'A';
  else if (percentage >= 60) grade = 'B+';
  else if (percentage >= 50) grade = 'B';
  else if (percentage >= 40) grade = 'C';
  else grade = 'F';

  return {
    percentage,
    grade,
    status: percentage >= 40 ? 'Pass' : 'Fail'
  };
}
