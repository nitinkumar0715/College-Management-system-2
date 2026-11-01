"""
Smart College Management System - Database Handler
Designed for BTech 2nd Year Computer Science Project Demonstration.

Uses Python's built-in sqlite3 module.
Features:
- Schema definition with Primary Keys, Foreign Keys, Unique constraints
- Secure password hashing for admin credentials
- Automatic database & sample data initialization
- Parameterized queries to prevent SQL Injection
"""

import sqlite3
import os
from werkzeug.security import generate_password_hash

DB_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'college.db')

def get_db_connection():
    """
    Creates and returns a connection to the SQLite database.
    Enables foreign key enforcement and sets row_factory to sqlite3.Row
    so rows can be accessed like dictionaries.
    """
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def init_db():
    """
    Creates the required database tables if they do not exist
    and populates them with sample data for demonstration.
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Admin Users Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ''')

    # 2. Courses Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS courses (
        course_id TEXT PRIMARY KEY,
        course_name TEXT NOT NULL,
        department TEXT NOT NULL,
        duration TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ''')

    # 3. Teachers Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS teachers (
        teacher_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        department TEXT NOT NULL,
        subject TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ''')

    # 4. Students Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS students (
        student_id TEXT PRIMARY KEY,
        full_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone_number TEXT NOT NULL,
        course TEXT NOT NULL,
        semester TEXT NOT NULL,
        admission_date TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (course) REFERENCES courses(course_id) ON UPDATE CASCADE ON DELETE RESTRICT
    );
    ''')

    # 5. Attendance Table (with UNIQUE constraint on student_id + attendance_date to prevent duplicate attendance)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id TEXT NOT NULL,
        attendance_date TEXT NOT NULL,
        status TEXT CHECK(status IN ('Present', 'Absent')) NOT NULL,
        remarks TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (student_id, attendance_date),
        FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
    );
    ''')

    # 6. Results Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id TEXT NOT NULL,
        subject TEXT NOT NULL,
        marks_obtained REAL NOT NULL,
        total_marks REAL NOT NULL,
        percentage REAL NOT NULL,
        grade TEXT NOT NULL,
        status TEXT NOT NULL,
        semester TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
    );
    ''')

    # 7. Notices Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS notices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        notice_date TEXT NOT NULL,
        category TEXT DEFAULT 'General',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ''')

    # Seed Default Admin Account if not present
    cursor.execute("SELECT COUNT(*) FROM admin_users WHERE username = ?", ('admin',))
    if cursor.fetchone()[0] == 0:
        default_admin_hash = generate_password_hash('admin123', method='pbkdf2:sha256')
        cursor.execute('''
            INSERT INTO admin_users (username, password_hash, full_name)
            VALUES (?, ?, ?)
        ''', ('admin', default_admin_hash, 'System Administrator'))

    # Seed Courses if empty
    cursor.execute("SELECT COUNT(*) FROM courses;")
    if cursor.fetchone()[0] == 0:
        courses_sample = [
            ('CSE101', 'B.Tech Computer Science & Engineering', 'Computer Science', '4 Years'),
            ('ECE102', 'B.Tech Electronics & Communication', 'Electronics', '4 Years'),
            ('ME103', 'B.Tech Mechanical Engineering', 'Mechanical', '4 Years'),
            ('IT104', 'B.Tech Information Technology', 'Information Technology', '4 Years'),
            ('CE105', 'B.Tech Civil Engineering', 'Civil', '4 Years')
        ]
        cursor.executemany('''
            INSERT INTO courses (course_id, course_name, department, duration)
            VALUES (?, ?, ?, ?)
        ''', courses_sample)

    # Seed Teachers if empty
    cursor.execute("SELECT COUNT(*) FROM teachers;")
    if cursor.fetchone()[0] == 0:
        teachers_sample = [
            ('TCH-101', 'Dr. Ramesh Sharma', 'r.sharma@college.edu', 'Computer Science', 'Data Structures & Algorithms'),
            ('TCH-102', 'Prof. Sunita Verma', 's.verma@college.edu', 'Computer Science', 'Database Management Systems'),
            ('TCH-103', 'Dr. Arvind Kulkarni', 'a.kulkarni@college.edu', 'Electronics', 'Digital Signal Processing'),
            ('TCH-104', 'Prof. Priya Nair', 'p.nair@college.edu', 'Information Technology', 'Computer Networks'),
            ('TCH-105', 'Dr. Rajesh Gupta', 'r.gupta@college.edu', 'Mechanical', 'Thermodynamics')
        ]
        cursor.executemany('''
            INSERT INTO teachers (teacher_id, name, email, department, subject)
            VALUES (?, ?, ?, ?, ?)
        ''', teachers_sample)

    # Seed Students if empty
    cursor.execute("SELECT COUNT(*) FROM students;")
    if cursor.fetchone()[0] == 0:
        students_sample = [
            ('STU-2024-001', 'Aarav Patel', 'aarav.patel@student.college.edu', '9876543210', 'CSE101', 'Semester 3', '2024-08-10'),
            ('STU-2024-002', 'Diya Sen', 'diya.sen@student.college.edu', '9876543211', 'CSE101', 'Semester 3', '2024-08-11'),
            ('STU-2024-003', 'Rohan Mehta', 'rohan.mehta@student.college.edu', '9876543212', 'ECE102', 'Semester 3', '2024-08-12'),
            ('STU-2024-004', 'Ananya Iyer', 'ananya.iyer@student.college.edu', '9876543213', 'IT104', 'Semester 3', '2024-08-13'),
            ('STU-2024-005', 'Kabir Singh', 'kabir.singh@student.college.edu', '9876543214', 'ME103', 'Semester 3', '2024-08-14'),
            ('STU-2024-006', 'Sneha Reddy', 'sneha.reddy@student.college.edu', '9876543215', 'CSE101', 'Semester 3', '2024-08-15'),
            ('STU-2024-007', 'Vikram Joshi', 'vikram.joshi@student.college.edu', '9876543216', 'CE105', 'Semester 3', '2024-08-16')
        ]
        cursor.executemany('''
            INSERT INTO students (student_id, full_name, email, phone_number, course, semester, admission_date)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', students_sample)

    # Seed Attendance if empty
    cursor.execute("SELECT COUNT(*) FROM attendance;")
    if cursor.fetchone()[0] == 0:
        attendance_sample = [
            ('STU-2024-001', '2026-10-25', 'Present', 'Regular class'),
            ('STU-2024-001', '2026-10-26', 'Present', 'Lab session'),
            ('STU-2024-001', '2026-10-27', 'Present', 'Tutorial'),
            ('STU-2024-001', '2026-10-28', 'Absent', 'Medical leave'),
            ('STU-2024-002', '2026-10-27', 'Present', 'Regular class'),
            ('STU-2024-002', '2026-10-28', 'Present', 'Lab session'),
            ('STU-2024-003', '2026-10-27', 'Absent', 'Uninformed'),
            ('STU-2024-003', '2026-10-28', 'Present', 'Regular class'),
            ('STU-2024-004', '2026-10-27', 'Present', 'Regular class'),
            ('STU-2024-004', '2026-10-28', 'Present', 'Lecture'),
            ('STU-2024-005', '2026-10-27', 'Present', 'Workshop'),
            ('STU-2024-005', '2026-10-28', 'Present', 'Workshop')
        ]
        cursor.executemany('''
            INSERT INTO attendance (student_id, attendance_date, status, remarks)
            VALUES (?, ?, ?, ?)
        ''', attendance_sample)

    # Seed Results if empty
    cursor.execute("SELECT COUNT(*) FROM results;")
    if cursor.fetchone()[0] == 0:
        results_sample = [
            ('STU-2024-001', 'Data Structures', 88.0, 100.0, 88.0, 'A+', 'Pass', 'Semester 3'),
            ('STU-2024-001', 'Database Systems', 92.0, 100.0, 92.0, 'O', 'Pass', 'Semester 3'),
            ('STU-2024-001', 'Discrete Mathematics', 76.0, 100.0, 76.0, 'A', 'Pass', 'Semester 3'),
            ('STU-2024-002', 'Data Structures', 82.0, 100.0, 82.0, 'A+', 'Pass', 'Semester 3'),
            ('STU-2024-002', 'Database Systems', 85.0, 100.0, 85.0, 'A+', 'Pass', 'Semester 3'),
            ('STU-2024-003', 'Digital Signal Processing', 68.0, 100.0, 68.0, 'B+', 'Pass', 'Semester 3'),
            ('STU-2024-004', 'Computer Networks', 91.0, 100.0, 91.0, 'O', 'Pass', 'Semester 3'),
            ('STU-2024-005', 'Thermodynamics', 74.0, 100.0, 74.0, 'B+', 'Pass', 'Semester 3')
        ]
        cursor.executemany('''
            INSERT INTO results (student_id, subject, marks_obtained, total_marks, percentage, grade, status, semester)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', results_sample)

    # Seed Notices if empty
    cursor.execute("SELECT COUNT(*) FROM notices;")
    if cursor.fetchone()[0] == 0:
        notices_sample = [
            ('Mid-Term Examination Schedule - Autumn 2026', 'Mid-term exams for 2nd and 3rd year engineering students will commence from November 15, 2026. Hall tickets available on student portal.', '2026-10-24', 'Examination'),
            ('Annual Technical Fest "Innovate 2026"', 'Registration is now open for Hackathons, Robotics battles, and Paper Presentations. Last date to register is November 5, 2026.', '2026-10-22', 'Events'),
            ('Campus Placement Drive - TechCorp Solutions', 'Eligibility: CSE, IT, ECE with CGPA >= 7.0 and zero standing backlogs. Pre-placement talk on November 8, 2026 at Auditorium.', '2026-10-20', 'Placements'),
            ('Submission of B.Tech 2nd Year Mini-Projects', 'All students must submit project code, documentation report, and live demo by November 10, 2026 to respective departmental coordinators.', '2026-10-18', 'Academic')
        ]
        cursor.executemany('''
            INSERT INTO notices (title, description, notice_date, category)
            VALUES (?, ?, ?, ?)
        ''', notices_sample)

    conn.commit()
    conn.close()
    print("Database initialized successfully with sample records.")

def calculate_grade(marks, total):
    """
    Calculates percentage, letter grade, and pass/fail status.
    College Grading Standard:
    >= 90%: O (Outstanding)
    >= 80%: A+ (Excellent)
    >= 70%: A (Very Good)
    >= 60%: B+ (Good)
    >= 50%: B (Above Average)
    >= 40%: C (Pass)
    < 40%:  F (Fail)
    """
    if total <= 0:
        return 0, 'F', 'Fail'
    percentage = round((marks / total) * 100, 2)
    if percentage >= 90:
        grade = 'O'
    elif percentage >= 80:
        grade = 'A+'
    elif percentage >= 70:
        grade = 'A'
    elif percentage >= 60:
        grade = 'B+'
    elif percentage >= 50:
        grade = 'B'
    elif percentage >= 40:
        grade = 'C'
    else:
        grade = 'F'
    status = 'Pass' if percentage >= 40 else 'Fail'
    return percentage, grade, status

if __name__ == '__main__':
    init_db()
