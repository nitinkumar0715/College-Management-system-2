"""
Smart College Management System - Main Flask Application
Suitable for BTech 2nd Year Project & Viva Voce Demonstration.

Backend Features:
- Session-based Admin Authentication with werkzeug password hashing
- Modular CRUD routes for Students, Teachers, Courses, Attendance, Results, Notices
- Parameterized SQLite queries protecting against SQL Injection
- Form validation and dynamic percentage/grade computation
- Duplicate attendance prevention using SQLite UNIQUE constraint
"""

import os
from functools import wraps
from flask import (
    Flask, render_template, request, redirect,
    url_for, session, flash, jsonify
)
from werkzeug.security import check_password_hash, generate_password_hash
import sqlite3

from database import (
    get_db_connection, init_db, calculate_grade
)

app = Flask(__name__)
# Secret key for encrypting Flask session cookies
app.secret_key = os.environ.get('SECRET_KEY', 'smart_college_mgmt_secret_key_2026')

# Initialize DB tables and sample data on startup
with app.app_context():
    init_db()

def login_required(f):
    """
    Decorator to ensure user is logged in before accessing admin routes.
    If not authenticated, redirects to the /login page with a flash warning.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'admin_logged_in' not in session:
            flash('Please log in with admin credentials to access this page.', 'warning')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

# ==============================================================================
# AUTHENTICATION ROUTES (LOGIN / LOGOUT)
# ==============================================================================

@app.route('/login', methods=['GET', 'POST'])
def login():
    # If already logged in, redirect to dashboard
    if 'admin_logged_in' in session:
        return redirect(url_for('dashboard'))

    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '').strip()

        if not username or not password:
            flash('Username and Password are required.', 'danger')
            return render_template('login.html')

        conn = get_db_connection()
        admin = conn.execute(
            "SELECT * FROM admin_users WHERE username = ?", (username,)
        ).fetchone()
        conn.close()

        if admin and check_password_hash(admin['password_hash'], password):
            session['admin_logged_in'] = True
            session['admin_id'] = admin['id']
            session['admin_username'] = admin['username']
            session['admin_name'] = admin['full_name']
            flash(f"Welcome back, {admin['full_name']}! Logged in successfully.", 'success')
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid username or password. Default demo is admin / admin123', 'danger')

    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    flash('You have been logged out safely.', 'info')
    return redirect(url_for('login'))

# ==============================================================================
# DASHBOARD ROUTE
# ==============================================================================

@app.route('/')
@app.route('/dashboard')
@login_required
def dashboard():
    conn = get_db_connection()

    # 1. Metric Counts
    total_students = conn.execute("SELECT COUNT(*) FROM students").fetchone()[0]
    total_teachers = conn.execute("SELECT COUNT(*) FROM teachers").fetchone()[0]
    total_courses = conn.execute("SELECT COUNT(*) FROM courses").fetchone()[0]
    total_attendance = conn.execute("SELECT COUNT(*) FROM attendance").fetchone()[0]

    # 2. Recent 5 Student Admissions
    recent_students = conn.execute("""
        SELECT s.*, c.course_name 
        FROM students s
        LEFT JOIN courses c ON s.course = c.course_id
        ORDER BY s.created_at DESC LIMIT 5
    """).fetchall()

    # 3. Recent 4 Notices
    recent_notices = conn.execute("""
        SELECT * FROM notices 
        ORDER BY notice_date DESC, id DESC LIMIT 4
    """).fetchall()

    # 4. Student Distribution by Course for the Chart
    distribution = conn.execute("""
        SELECT c.course_id, c.course_name, COUNT(s.student_id) as student_count
        FROM courses c
        LEFT JOIN students s ON c.course_id = s.course
        GROUP BY c.course_id
        ORDER BY student_count DESC
    """).fetchall()

    # 5. Overall Attendance Percentage
    att_stats = conn.execute("""
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) as present_count
        FROM attendance
    """).fetchone()
    overall_att_pct = 0
    if att_stats['total'] and att_stats['total'] > 0:
        overall_att_pct = round((att_stats['present_count'] / att_stats['total']) * 100, 1)

    conn.close()

    return render_template(
        'dashboard.html',
        total_students=total_students,
        total_teachers=total_teachers,
        total_courses=total_courses,
        total_attendance=total_attendance,
        recent_students=recent_students,
        recent_notices=recent_notices,
        course_distribution=distribution,
        overall_att_pct=overall_att_pct
    )

# ==============================================================================
# STUDENT MANAGEMENT ROUTES (CRUD + SEARCH & FILTER)
# ==============================================================================

@app.route('/students')
@login_required
def students():
    conn = get_db_connection()
    search = request.args.get('search', '').strip()
    course_filter = request.args.get('course', '').strip()

    query = """
        SELECT s.*, c.course_name 
        FROM students s
        LEFT JOIN courses c ON s.course = c.course_id
        WHERE 1=1
    """
    params = []

    if search:
        query += " AND (s.student_id LIKE ? OR s.full_name LIKE ? OR s.email LIKE ?)"
        like_term = f"%{search}%"
        params.extend([like_term, like_term, like_term])

    if course_filter:
        query += " AND s.course = ?"
        params.append(course_filter)

    query += " ORDER BY s.student_id ASC"
    student_list = conn.execute(query, params).fetchall()
    all_courses = conn.execute("SELECT * FROM courses ORDER BY course_name ASC").fetchall()
    conn.close()

    return render_template(
        'students.html',
        students=student_list,
        courses=all_courses,
        search=search,
        selected_course=course_filter
    )

@app.route('/students/add', methods=['POST'])
@login_required
def add_student():
    student_id = request.form.get('student_id', '').strip().upper()
    full_name = request.form.get('full_name', '').strip()
    email = request.form.get('email', '').strip().lower()
    phone_number = request.form.get('phone_number', '').strip()
    course = request.form.get('course', '').strip()
    semester = request.form.get('semester', '').strip()
    admission_date = request.form.get('admission_date', '').strip()

    if not all([student_id, full_name, email, phone_number, course, semester, admission_date]):
        flash('All student fields are required.', 'danger')
        return redirect(url_for('students'))

    conn = get_db_connection()
    try:
        conn.execute("""
            INSERT INTO students (student_id, full_name, email, phone_number, course, semester, admission_date)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (student_id, full_name, email, phone_number, course, semester, admission_date))
        conn.commit()
        flash(f"Student '{full_name}' ({student_id}) enrolled successfully!", 'success')
    except sqlite3.IntegrityError as e:
        flash(f"Error: Student ID or Email already exists ({str(e)}).", 'danger')
    finally:
        conn.close()

    return redirect(url_for('students'))

@app.route('/students/edit/<student_id>', methods=['POST'])
@login_required
def edit_student(student_id):
    full_name = request.form.get('full_name', '').strip()
    email = request.form.get('email', '').strip().lower()
    phone_number = request.form.get('phone_number', '').strip()
    course = request.form.get('course', '').strip()
    semester = request.form.get('semester', '').strip()
    admission_date = request.form.get('admission_date', '').strip()

    conn = get_db_connection()
    try:
        conn.execute("""
            UPDATE students 
            SET full_name = ?, email = ?, phone_number = ?, course = ?, semester = ?, admission_date = ?
            WHERE student_id = ?
        """, (full_name, email, phone_number, course, semester, admission_date, student_id))
        conn.commit()
        flash(f"Student '{student_id}' details updated successfully.", 'success')
    except sqlite3.IntegrityError:
        flash("Email address is already in use by another student.", 'danger')
    finally:
        conn.close()

    return redirect(url_for('students'))

@app.route('/students/delete/<student_id>', methods=['POST'])
@login_required
def delete_student(student_id):
    conn = get_db_connection()
    conn.execute("DELETE FROM students WHERE student_id = ?", (student_id,))
    conn.commit()
    conn.close()
    flash(f"Student record '{student_id}' deleted successfully.", 'info')
    return redirect(url_for('students'))

# ==============================================================================
# TEACHER MANAGEMENT ROUTES (CRUD + SEARCH)
# ==============================================================================

@app.route('/teachers')
@login_required
def teachers():
    conn = get_db_connection()
    search = request.args.get('search', '').strip()

    if search:
        query = """
            SELECT * FROM teachers 
            WHERE teacher_id LIKE ? OR name LIKE ? OR department LIKE ? OR subject LIKE ?
            ORDER BY teacher_id ASC
        """
        param = f"%{search}%"
        teacher_list = conn.execute(query, (param, param, param, param)).fetchall()
    else:
        teacher_list = conn.execute("SELECT * FROM teachers ORDER BY teacher_id ASC").fetchall()

    conn.close()
    return render_template('teachers.html', teachers=teacher_list, search=search)

@app.route('/teachers/add', methods=['POST'])
@login_required
def add_teacher():
    teacher_id = request.form.get('teacher_id', '').strip().upper()
    name = request.form.get('name', '').strip()
    email = request.form.get('email', '').strip().lower()
    department = request.form.get('department', '').strip()
    subject = request.form.get('subject', '').strip()

    if not all([teacher_id, name, email, department, subject]):
        flash('All teacher fields are mandatory.', 'danger')
        return redirect(url_for('teachers'))

    conn = get_db_connection()
    try:
        conn.execute("""
            INSERT INTO teachers (teacher_id, name, email, department, subject)
            VALUES (?, ?, ?, ?, ?)
        """, (teacher_id, name, email, department, subject))
        conn.commit()
        flash(f"Teacher '{name}' added successfully!", 'success')
    except sqlite3.IntegrityError:
        flash(f"Error: Teacher ID or Email already exists.", 'danger')
    finally:
        conn.close()

    return redirect(url_for('teachers'))

@app.route('/teachers/edit/<teacher_id>', methods=['POST'])
@login_required
def edit_teacher(teacher_id):
    name = request.form.get('name', '').strip()
    email = request.form.get('email', '').strip().lower()
    department = request.form.get('department', '').strip()
    subject = request.form.get('subject', '').strip()

    conn = get_db_connection()
    try:
        conn.execute("""
            UPDATE teachers 
            SET name = ?, email = ?, department = ?, subject = ?
            WHERE teacher_id = ?
        """, (name, email, department, subject, teacher_id))
        conn.commit()
        flash(f"Teacher '{teacher_id}' details updated successfully.", 'success')
    except sqlite3.IntegrityError:
        flash('Email is already registered with another teacher.', 'danger')
    finally:
        conn.close()

    return redirect(url_for('teachers'))

@app.route('/teachers/delete/<teacher_id>', methods=['POST'])
@login_required
def delete_teacher(teacher_id):
    conn = get_db_connection()
    conn.execute("DELETE FROM teachers WHERE teacher_id = ?", (teacher_id,))
    conn.commit()
    conn.close()
    flash(f"Teacher record '{teacher_id}' deleted successfully.", 'info')
    return redirect(url_for('teachers'))

# ==============================================================================
# COURSE MANAGEMENT ROUTES (CRUD)
# ==============================================================================

@app.route('/courses')
@login_required
def courses():
    conn = get_db_connection()
    search = request.args.get('search', '').strip()

    query = """
        SELECT c.*, COUNT(s.student_id) as enrolled_count
        FROM courses c
        LEFT JOIN students s ON c.course_id = s.course
        WHERE 1=1
    """
    params = []

    if search:
        query += " AND (c.course_id LIKE ? OR c.course_name LIKE ? OR c.department LIKE ?)"
        term = f"%{search}%"
        params.extend([term, term, term])

    query += " GROUP BY c.course_id ORDER BY c.course_id ASC"
    course_list = conn.execute(query, params).fetchall()
    conn.close()

    return render_template('courses.html', courses=course_list, search=search)

@app.route('/courses/add', methods=['POST'])
@login_required
def add_course():
    course_id = request.form.get('course_id', '').strip().upper()
    course_name = request.form.get('course_name', '').strip()
    department = request.form.get('department', '').strip()
    duration = request.form.get('duration', '').strip()

    if not all([course_id, course_name, department, duration]):
        flash('All course fields must be filled.', 'danger')
        return redirect(url_for('courses'))

    conn = get_db_connection()
    try:
        conn.execute("""
            INSERT INTO courses (course_id, course_name, department, duration)
            VALUES (?, ?, ?, ?)
        """, (course_id, course_name, department, duration))
        conn.commit()
        flash(f"Course '{course_name}' ({course_id}) created successfully!", 'success')
    except sqlite3.IntegrityError:
        flash(f"Error: Course Code '{course_id}' already exists.", 'danger')
    finally:
        conn.close()

    return redirect(url_for('courses'))

@app.route('/courses/edit/<course_id>', methods=['POST'])
@login_required
def edit_course(course_id):
    course_name = request.form.get('course_name', '').strip()
    department = request.form.get('department', '').strip()
    duration = request.form.get('duration', '').strip()

    conn = get_db_connection()
    conn.execute("""
        UPDATE courses 
        SET course_name = ?, department = ?, duration = ?
        WHERE course_id = ?
    """, (course_name, department, duration, course_id))
    conn.commit()
    conn.close()
    flash(f"Course '{course_id}' updated successfully.", 'success')
    return redirect(url_for('courses'))

@app.route('/courses/delete/<course_id>', methods=['POST'])
@login_required
def delete_course(course_id):
    conn = get_db_connection()
    # Check if students are enrolled
    enrolled = conn.execute("SELECT COUNT(*) FROM students WHERE course = ?", (course_id,)).fetchone()[0]
    if enrolled > 0:
        flash(f"Cannot delete course '{course_id}' because {enrolled} student(s) are currently enrolled. Reassign them first.", 'warning')
        conn.close()
        return redirect(url_for('courses'))

    conn.execute("DELETE FROM courses WHERE course_id = ?", (course_id,))
    conn.commit()
    conn.close()
    flash(f"Course '{course_id}' deleted successfully.", 'info')
    return redirect(url_for('courses'))

# ==============================================================================
# ATTENDANCE MANAGEMENT ROUTES (PREVENT DUPLICATES & CALCULATE %)
# ==============================================================================

@app.route('/attendance')
@login_required
def attendance():
    conn = get_db_connection()
    search = request.args.get('search', '').strip()
    date_filter = request.args.get('date', '').strip()

    query = """
        SELECT a.*, s.full_name, s.course, c.course_name
        FROM attendance a
        JOIN students s ON a.student_id = s.student_id
        LEFT JOIN courses c ON s.course = c.course_id
        WHERE 1=1
    """
    params = []

    if search:
        query += " AND (a.student_id LIKE ? OR s.full_name LIKE ?)"
        term = f"%{search}%"
        params.extend([term, term])

    if date_filter:
        query += " AND a.attendance_date = ?"
        params.append(date_filter)

    query += " ORDER BY a.attendance_date DESC, a.id DESC"
    records = conn.execute(query, params).fetchall()

    # Student Attendance Percentage Summary table
    student_stats = conn.execute("""
        SELECT 
            s.student_id,
            s.full_name,
            s.course,
            COUNT(a.id) as total_days,
            SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) as present_days
        FROM students s
        LEFT JOIN attendance a ON s.student_id = a.student_id
        GROUP BY s.student_id
        ORDER BY s.student_id ASC
    """).fetchall()

    students_list = conn.execute("SELECT student_id, full_name, course FROM students ORDER BY full_name ASC").fetchall()
    conn.close()

    return render_template(
        'attendance.html',
        records=records,
        student_stats=student_stats,
        students=students_list,
        search=search,
        selected_date=date_filter
    )

@app.route('/attendance/mark', methods=['POST'])
@login_required
def mark_attendance():
    student_id = request.form.get('student_id', '').strip()
    attendance_date = request.form.get('attendance_date', '').strip()
    status = request.form.get('status', 'Present').strip()
    remarks = request.form.get('remarks', '').strip()

    if not student_id or not attendance_date or status not in ['Present', 'Absent']:
        flash('Student ID, valid date, and status are required.', 'danger')
        return redirect(url_for('attendance'))

    conn = get_db_connection()
    try:
        conn.execute("""
            INSERT INTO attendance (student_id, attendance_date, status, remarks)
            VALUES (?, ?, ?, ?)
        """, (student_id, attendance_date, status, remarks))
        conn.commit()
        flash(f"Attendance marked as '{status}' for student {student_id} on {attendance_date}.", 'success')
    except sqlite3.IntegrityError:
        flash(f"Duplicate entry blocked: Attendance for student '{student_id}' on '{attendance_date}' is already recorded!", 'danger')
    finally:
        conn.close()

    return redirect(url_for('attendance'))

@app.route('/attendance/delete/<int:id>', methods=['POST'])
@login_required
def delete_attendance(id):
    conn = get_db_connection()
    conn.execute("DELETE FROM attendance WHERE id = ?", (id,))
    conn.commit()
    conn.close()
    flash('Attendance log entry removed successfully.', 'info')
    return redirect(url_for('attendance'))

# ==============================================================================
# RESULT MANAGEMENT ROUTES (MARKS, GRADES, GPA, MARKSHEET)
# ==============================================================================

@app.route('/results')
@login_required
def results():
    conn = get_db_connection()
    search = request.args.get('search', '').strip()
    semester = request.args.get('semester', '').strip()

    query = """
        SELECT r.*, s.full_name, s.course, c.course_name
        FROM results r
        JOIN students s ON r.student_id = s.student_id
        LEFT JOIN courses c ON s.course = c.course_id
        WHERE 1=1
    """
    params = []

    if search:
        query += " AND (r.student_id LIKE ? OR s.full_name LIKE ? OR r.subject LIKE ?)"
        term = f"%{search}%"
        params.extend([term, term, term])

    if semester:
        query += " AND r.semester = ?"
        params.append(semester)

    query += " ORDER BY r.id DESC"
    result_list = conn.execute(query, params).fetchall()

    students_list = conn.execute("SELECT student_id, full_name, semester FROM students ORDER BY full_name ASC").fetchall()
    conn.close()

    return render_template(
        'results.html',
        results=result_list,
        students=students_list,
        search=search,
        selected_semester=semester
    )

@app.route('/results/add', methods=['POST'])
@login_required
def add_result():
    student_id = request.form.get('student_id', '').strip()
    subject = request.form.get('subject', '').strip()
    semester = request.form.get('semester', '').strip()

    try:
        marks_obtained = float(request.form.get('marks_obtained', 0))
        total_marks = float(request.form.get('total_marks', 100))
    except ValueError:
        flash('Marks must be numeric values.', 'danger')
        return redirect(url_for('results'))

    if marks_obtained < 0 or total_marks <= 0 or marks_obtained > total_marks:
        flash(f'Invalid marks: Obtained marks ({marks_obtained}) cannot be negative or exceed total marks ({total_marks}).', 'danger')
        return redirect(url_for('results'))

    # Calculate percentage and grade
    percentage, grade, status = calculate_grade(marks_obtained, total_marks)

    conn = get_db_connection()
    conn.execute("""
        INSERT INTO results (student_id, subject, marks_obtained, total_marks, percentage, grade, status, semester)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (student_id, subject, marks_obtained, total_marks, percentage, grade, status, semester))
    conn.commit()
    conn.close()

    flash(f"Result saved: {subject} for {student_id} - {percentage}% (Grade: {grade}, Status: {status})", 'success')
    return redirect(url_for('results'))

@app.route('/results/edit/<int:id>', methods=['POST'])
@login_required
def edit_result(id):
    subject = request.form.get('subject', '').strip()
    semester = request.form.get('semester', '').strip()

    try:
        marks_obtained = float(request.form.get('marks_obtained', 0))
        total_marks = float(request.form.get('total_marks', 100))
    except ValueError:
        flash('Marks must be numeric.', 'danger')
        return redirect(url_for('results'))

    if marks_obtained < 0 or marks_obtained > total_marks:
        flash('Obtained marks cannot exceed total marks.', 'danger')
        return redirect(url_for('results'))

    percentage, grade, status = calculate_grade(marks_obtained, total_marks)

    conn = get_db_connection()
    conn.execute("""
        UPDATE results 
        SET subject = ?, marks_obtained = ?, total_marks = ?, percentage = ?, grade = ?, status = ?, semester = ?
        WHERE id = ?
    """, (subject, marks_obtained, total_marks, percentage, grade, status, semester, id))
    conn.commit()
    conn.close()

    flash('Result record updated successfully.', 'success')
    return redirect(url_for('results'))

@app.route('/results/delete/<int:id>', methods=['POST'])
@login_required
def delete_result(id):
    conn = get_db_connection()
    conn.execute("DELETE FROM results WHERE id = ?", (id,))
    conn.commit()
    conn.close()
    flash('Result entry deleted successfully.', 'info')
    return redirect(url_for('results'))

@app.route('/results/marksheet/<student_id>')
@login_required
def marksheet(student_id):
    conn = get_db_connection()
    student = conn.execute("""
        SELECT s.*, c.course_name, c.department 
        FROM students s
        LEFT JOIN courses c ON s.course = c.course_id
        WHERE s.student_id = ?
    """, (student_id,)).fetchone()

    if not student:
        conn.close()
        flash('Student record not found.', 'danger')
        return redirect(url_for('results'))

    student_results = conn.execute("""
        SELECT * FROM results WHERE student_id = ? ORDER BY semester ASC, subject ASC
    """, (student_id,)).fetchall()

    # Overall calculation
    total_obtained = sum([r['marks_obtained'] for r in student_results])
    total_max = sum([r['total_marks'] for r in student_results])
    overall_pct = round((total_obtained / total_max) * 100, 2) if total_max > 0 else 0
    _, overall_grade, overall_status = calculate_grade(total_obtained, total_max if total_max > 0 else 1)

    conn.close()

    return render_template(
        'marksheet.html',
        student=student,
        results=student_results,
        total_obtained=total_obtained,
        total_max=total_max,
        overall_pct=overall_pct,
        overall_grade=overall_grade,
        overall_status=overall_status
    )

# ==============================================================================
# NOTICE BOARD ROUTES
# ==============================================================================

@app.route('/notices')
@login_required
def notices():
    conn = get_db_connection()
    search = request.args.get('search', '').strip()
    category = request.args.get('category', '').strip()

    query = "SELECT * FROM notices WHERE 1=1"
    params = []

    if search:
        query += " AND (title LIKE ? OR description LIKE ?)"
        term = f"%{search}%"
        params.extend([term, term])

    if category:
        query += " AND category = ?"
        params.append(category)

    query += " ORDER BY notice_date DESC, id DESC"
    notice_list = conn.execute(query, params).fetchall()
    conn.close()

    return render_template(
        'notices.html',
        notices=notice_list,
        search=search,
        selected_category=category
    )

@app.route('/notices/add', methods=['POST'])
@login_required
def add_notice():
    title = request.form.get('title', '').strip()
    description = request.form.get('description', '').strip()
    notice_date = request.form.get('notice_date', '').strip()
    category = request.form.get('category', 'General').strip()

    if not all([title, description, notice_date]):
        flash('Title, description, and date are required for notices.', 'danger')
        return redirect(url_for('notices'))

    conn = get_db_connection()
    conn.execute("""
        INSERT INTO notices (title, description, notice_date, category)
        VALUES (?, ?, ?, ?)
    """, (title, description, notice_date, category))
    conn.commit()
    conn.close()

    flash(f"Notice '{title}' published to college notice board!", 'success')
    return redirect(url_for('notices'))

@app.route('/notices/delete/<int:id>', methods=['POST'])
@login_required
def delete_notice(id):
    conn = get_db_connection()
    conn.execute("DELETE FROM notices WHERE id = ?", (id,))
    conn.commit()
    conn.close()
    flash('Notice removed successfully.', 'info')
    return redirect(url_for('notices'))

# ==============================================================================
# API ENDPOINT (FOR DASHBOARD ASYNC CHARTS & STATS)
# ==============================================================================

@app.route('/api/stats')
@login_required
def api_stats():
    conn = get_db_connection()
    distribution = conn.execute("""
        SELECT c.course_id, c.course_name, COUNT(s.student_id) as count
        FROM courses c
        LEFT JOIN students s ON c.course_id = s.course
        GROUP BY c.course_id
    """).fetchall()

    data = [
        {"course_id": r['course_id'], "course_name": r['course_name'], "count": r['count']}
        for r in distribution
    ]
    conn.close()
    return jsonify(data)

if __name__ == '__main__':
    # Run Flask development server on host 0.0.0.0 and port 5000 (standard for local flask)
    # Debug=True helps 2nd year students see auto-reload and tracebacks easily
    app.run(host='0.0.0.0', port=5000, debug=True)
