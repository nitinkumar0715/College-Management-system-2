# Smart College Management System
**Academic Project for B.Tech 2nd Year Computer Science & Engineering**

---

## 📌 Project Overview
The **Smart College Management System** is a full-stack, responsive web application developed using **Python Flask**, **SQLite3**, **HTML5**, **CSS3**, and **Vanilla JavaScript**. It provides an institutional administration portal to manage:
1. **Admin Authentication**: Flask session-based authentication with salted password hashing.
2. **Interactive Dashboard**: Real-time institutional counters, course distribution charts, recent admissions, and campus notices.
3. **Student Management**: Full CRUD operations, course enrollment, semester tracking, and search/filter by name or ID.
4. **Faculty Management**: Manage professors and instructors by department and teaching subject.
5. **Course Management**: Degree program catalog with duration, department, and live enrollment tracking.
6. **Attendance Management**: Daily roll-call logging, student-wise attendance percentage calculation, and automated duplicate prevention for the same student on the same date.
7. **Examination & Result Management**: Subject marks entry, automated percentage & letter grade calculation (O, A+, A, B+, B, C, F), pass/fail determination, and printable student grade marksheets.
8. **Campus Notice Board**: Circular publishing by categories (Academic, Examination, Events, Placements, General).

---

## 🛠️ Technology Stack
| Layer | Technology | Rationale for B.Tech 2nd Year |
|---|---|---|
| **Backend** | Python Flask (3.0+) | Lightweight, clear routing, easy to explain in viva, native WSGI server. |
| **Database** | SQLite3 | Zero-configuration serverless database embedded in Python standard library. |
| **Frontend Structure** | HTML5 | Clean semantic elements (`<header>`, `<nav>`, `<main>`, `<aside>`, `<table>`). |
| **Frontend Styling** | CSS3 (Modern Variables) | Pure responsive CSS with custom properties (`--bg-primary`, etc.) & Dark Mode. |
| **Interactivity** | Vanilla JavaScript (ES6) | No heavy frameworks; clean event listeners, DOM manipulation, modals, and dynamic calculation. |
| **Data Visualization** | Chart.js | Lightweight Canvas-based chart for student distribution by course. |

---

## 🗄️ Database Architecture & Schema

The application uses an SQLite relational database (`college.db`) with 7 interconnected tables enforcing constraints (`PRIMARY KEY`, `FOREIGN KEY`, `UNIQUE`, `CHECK`, and `NOT NULL`):

```
+------------------+         +------------------+
|     COURSES      | 1     * |     STUDENTS     |
+------------------+<--------+------------------+
| course_id (PK)   |         | student_id (PK)  |
| course_name      |         | full_name        |
| department       |         | email (UNIQUE)   |
| duration         |         | phone_number     |
+------------------+         | course (FK)      |
                             | semester         |
                             | admission_date   |
                             +--------+---------+
                                      | 1
                                      |
                   +------------------+------------------+
                   | *                                   | *
         +---------v--------+                  +---------v--------+
         |    ATTENDANCE    |                  |     RESULTS      |
         +------------------+                  +------------------+
         | id (PK Auto)     |                  | id (PK Auto)     |
         | student_id (FK)  |                  | student_id (FK)  |
         | attendance_date  |                  | subject          |
         | status (P/A)     |                  | marks_obtained   |
         | remarks          |                  | total_marks      |
         | UNIQUE(id, date) |                  | percentage       |
         +------------------+                  | grade & status   |
                                               +------------------+
```

### Table Definitions:
1. **`admin_users`**: Stores admin credentials (`username`, `password_hash`, `full_name`).
2. **`courses`**: Course catalog (`course_id` PRIMARY KEY, `course_name`, `department`, `duration`).
3. **`teachers`**: Faculty staff directory (`teacher_id` PRIMARY KEY, `name`, `email`, `department`, `subject`).
4. **`students`**: Student records (`student_id` PRIMARY KEY, `full_name`, `email`, `phone_number`, `course` FOREIGN KEY, `semester`, `admission_date`).
5. **`attendance`**: Daily log with `UNIQUE(student_id, attendance_date)` preventing duplicate marking.
6. **`results`**: Semester subject marks with calculated percentage and letter grades.
7. **`notices`**: Campus circulars with `title`, `description`, `notice_date`, and `category`.

---

## 🚀 How to Run the Project Locally

### Prerequisites:
- Python 3.8 or higher installed on your system (`python --version` or `python3 --version`).

### Step-by-Step Setup:

1. **Open your terminal or command prompt** and navigate into the project directory:
   ```bash
   cd college-management-system
   ```

2. **Create a Python Virtual Environment** (recommended):
   ```bash
   # On Windows:
   python -m venv venv
   venv\Scripts\activate

   # On macOS / Linux:
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Initialize Database & Seed Sample Records**:
   ```bash
   python database.py
   ```
   *(Note: `app.py` also calls `init_db()` automatically on first startup).*

5. **Run the Flask Development Server**:
   ```bash
   python app.py
   ```

6. **Open your Web Browser**:
   Visit: **`http://localhost:5000`**

---

## 🔑 Login Credentials

| Role | Username | Password |
|---|---|---|
| **Administrator** | `admin` | `admin123` |

### How to Change the Admin Password:
Run Python interactive shell or create a quick one-liner script:
```python
from werkzeug.security import generate_password_hash
import sqlite3

new_password = "myNewStrongPassword"
new_hash = generate_password_hash(new_password, method='pbkdf2:sha256')

conn = sqlite3.connect('college.db')
conn.execute("UPDATE admin_users SET password_hash = ? WHERE username = 'admin'", (new_hash,))
conn.commit()
conn.close()
print("Password changed successfully!")
```

---

## 🎓 B.Tech Viva Voce Examination Prep (Q & A)

Here are the top 10 questions frequently asked by project evaluators and external examiners:

### Q1: Why did you choose Flask over Django for this project?
**Answer**: "Flask is a micro-framework that gives explicit control over routing, database connections, and session management. Unlike Django, which abstracts away the ORM and admin interface, building this in Flask helped us understand the fundamental HTTP request-response cycle, parameterized SQL queries, and session management firsthand."

### Q2: How does the application protect against SQL Injection?
**Answer**: "We strictly use parameterized queries (prepared statements) with the `?` placeholder in SQLite (e.g. `cursor.execute('SELECT * FROM students WHERE student_id = ?', (id,))`). User input is never concatenated into raw SQL strings, ensuring the database treats user input strictly as literal values rather than executable SQL commands."

### Q3: How do you prevent duplicate attendance entries on the same date?
**Answer**: "We implemented a dual-layer defense:
1. **Database Layer**: A composite unique constraint in SQLite: `UNIQUE(student_id, attendance_date)`.
2. **Application Layer**: A `try...except sqlite3.IntegrityError` block in the Flask route that intercepts any duplicate entry and returns a friendly toast message without crashing the server."

### Q4: How is user authentication maintained across pages?
**Answer**: "We use Flask's cryptographically signed client-side session cookie (`flask.session`). When the user logs in successfully, `session['admin_logged_in'] = True` is stored. A custom Python decorator `@login_required` wraps each sensitive route to verify this session key before allowing access."

### Q5: How are passwords stored securely?
**Answer**: "We use `werkzeug.security.generate_password_hash()` utilizing PBKDF2 with SHA-256 and cryptographic salts. Plaintext passwords are never saved in the database. During login, `check_password_hash()` safely verifies the candidate password against the stored hash."

### Q6: What does `conn.row_factory = sqlite3.Row` do?
**Answer**: "By default, Python's `sqlite3` returns query results as tuples, requiring numeric indexing (e.g., `row[0]`). Setting `row_factory = sqlite3.Row` wraps each row in a dictionary-like object, allowing column access by name (e.g. `row['full_name']`), which makes the HTML Jinja2 templates much cleaner and less error-prone."

### Q7: Explain the grading system logic.
**Answer**: "The `calculate_grade()` function computes `(marks_obtained / total_marks) * 100`. It assigns letter grades: O (>=90%), A+ (>=80%), A (>=70%), B+ (>=60%), B (>=50%), C (>=40%), and F (<40%). A student must score at least 40% to be marked as 'Pass'."

### Q8: How does the client-side search work without reloading the page?
**Answer**: "In `script.js`, an input event listener on the search field grabs the user's keystrokes, converts the input to lowercase, iterates over all table rows (`tr`), and hides rows (`row.style.display = 'none'`) whose `innerText` does not contain the search string."

### Q9: How does Dark Mode persist when navigating between pages?
**Answer**: "When the user clicks the theme toggle button, JavaScript sets a data attribute `data-theme='dark'` on the `<html>` root and saves `'dark'` in browser `localStorage`. Upon every page load, `initTheme()` immediately reads `localStorage.getItem('college_cms_theme')` and reapplies the attribute before rendering completes."

### Q10: What is the purpose of Foreign Keys and `PRAGMA foreign_keys = ON;` in SQLite?
**Answer**: "In SQLite, foreign key enforcement is disabled by default for backwards compatibility. Executing `PRAGMA foreign_keys = ON;` on every connection enables referential integrity, ensuring we cannot enroll a student in a non-existent course or leave orphaned attendance/result records when a student is deleted."
