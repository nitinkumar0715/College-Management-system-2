import React, { useState } from 'react';
import {
  HelpCircle,
  Database,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  CheckCircle,
  Lightbulb
} from 'lucide-react';

interface VivaQuestion {
  question: string;
  topic: string;
  answer: string;
  keyPoint: string;
}

export const VivaGuideView: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const vivaQuestions: VivaQuestion[] = [
    {
      topic: 'Framework & Architecture',
      question: 'Why did you choose Python Flask instead of Django for this B.Tech 2nd year project?',
      answer:
        'Flask is a lightweight WSGI micro-framework that gives explicit control over routing, database connections, and session management. Unlike Django, which hides the ORM and admin dashboard behind pre-built abstractions, building this in Flask allows us to understand and demonstrate the fundamental HTTP request-response lifecycle, manual parameterized SQL queries, and session management firsthand.',
      keyPoint: 'Key Viva Keyword: WSGI micro-framework, explicit routing, transparent MVC control.'
    },
    {
      topic: 'Database & Security',
      question: 'How does your application prevent SQL Injection attacks?',
      answer:
        'We strictly use parameterized queries (prepared statements) with the `?` placeholder provided by Python’s sqlite3 module (e.g. `cursor.execute("SELECT * FROM students WHERE student_id = ?", (student_id,))`). User input is never concatenated or formatted directly into raw SQL strings with f-strings or `.format()`. This ensures that the database engine treats input strictly as literal string values, preventing malicious SQL code execution.',
      keyPoint: 'Key Viva Keyword: Parameterized queries, prepared statements, literal value binding.'
    },
    {
      topic: 'Business Logic & Integrity',
      question: 'How do you prevent duplicate attendance entries for the same student on the same date?',
      answer:
        'We implement a dual-layer defense mechanism:\n1. Database Layer: A composite UNIQUE constraint on `(student_id, attendance_date)` inside the SQLite `attendance` table schema.\n2. Application Layer: In `app.py`, the query is wrapped in a `try...except sqlite3.IntegrityError` block. If a teacher or admin tries to mark attendance twice for a student on the same date, SQLite raises an IntegrityError which Flask catches, displaying a polite error toast without crashing the server.',
      keyPoint: 'Key Viva Keyword: Composite UNIQUE constraint, sqlite3.IntegrityError handling.'
    },
    {
      topic: 'Authentication & Session',
      question: 'How does Flask session-based authentication work, and why is secret_key required?',
      answer:
        'Flask uses cryptographically signed client-side cookies for sessions. When an admin logs in, `session["admin_logged_in"] = True` is saved. The server signs this payload using `app.secret_key` via HMAC-SHA256. If a malicious client tries to tamper with the cookie to forge an admin login, the cryptographic signature check fails and Flask discards the session. Our custom `@login_required` decorator checks this session on every protected page.',
      keyPoint: 'Key Viva Keyword: Cryptographically signed session cookies, HMAC signature verification.'
    },
    {
      topic: 'Password Security',
      question: 'How are admin passwords stored securely in the SQLite database?',
      answer:
        'We never store plain text passwords. We use `werkzeug.security.generate_password_hash()`, which uses PBKDF2 (Password-Based Key Derivation Function 2) with SHA-256 and unique cryptographic salt. When verifying passwords, `check_password_hash()` hashes the candidate input with the stored salt and compares the hashes in constant time to prevent timing attacks.',
      keyPoint: 'Key Viva Keyword: PBKDF2 with SHA-256 salt, constant-time hash comparison.'
    },
    {
      topic: 'Database Schema & Constraints',
      question: 'What is the purpose of `PRAGMA foreign_keys = ON;` in SQLite?',
      answer:
        'By default, SQLite disables foreign key enforcement to maintain backward compatibility with legacy applications. In our `database.py` connection factory (`get_db_connection()`), we execute `PRAGMA foreign_keys = ON;` immediately after connecting. This activates referential integrity: if a student is deleted, cascading deletions clean up associated attendance and exam marks, and prevents enrolling a student into a non-existent course code.',
      keyPoint: 'Key Viva Keyword: Referential integrity, ON DELETE CASCADE, foreign key enforcement.'
    },
    {
      topic: 'Python Programming',
      question: 'What does `conn.row_factory = sqlite3.Row` achieve?',
      answer:
        'By default, Python `sqlite3` returns records as plain tuples (e.g. `("STU-101", "Aarav")`), which forces you to access fields by numeric indices like `row[0]`. Setting `row_factory = sqlite3.Row` wraps each row in a dictionary-like mapping so columns can be accessed by their database column names (e.g. `row["full_name"]`). This makes Jinja2 templates and Python route code far more readable and resilient to schema changes.',
      keyPoint: 'Key Viva Keyword: Dictionary-like row mappings, readable Jinja2 templating.'
    },
    {
      topic: 'Frontend & UI',
      question: 'How does Dark Mode persist across page refreshes without a database call?',
      answer:
        'We use the browser’s `localStorage` API. When the user toggles the theme, JavaScript toggles the CSS custom property attribute `data-theme="dark"` on `document.documentElement` and writes the value to `localStorage.setItem("college_cms_theme", "dark")`. On subsequent page loads, an initialization script reads this value before the DOM paints, instantly re-applying the theme without screen flicker or server latency.',
      keyPoint: 'Key Viva Keyword: localStorage API, CSS variables (custom properties), zero DOM flicker.'
    },
    {
      topic: 'Grading Algorithm',
      question: 'Explain the grading algorithm used in the Result Management module.',
      answer:
        'The formula calculates `percentage = (marks_obtained / total_marks) * 100`. Then, based on standard engineering college regulations, it maps: >=90% to "O" (Outstanding), >=80% to "A+" (Excellent), >=70% to "A" (Very Good), >=60% to "B+" (Good), >=50% to "B" (Above Average), >=40% to "C" (Pass), and <40% to "F" (Fail). Students with >=40% receive Pass status.',
      keyPoint: 'Key Viva Keyword: Normalization, grading thresholds, validation bounds.'
    },
    {
      topic: 'Software Engineering',
      question: 'How is the Model-View-Controller (MVC) design pattern applied in this system?',
      answer:
        '1. Model: `database.py` and `college.db` handle data structures, schema, and queries.\n2. View: The Jinja2 HTML templates in `templates/` and CSS styles in `static/` handle the presentation layer.\n3. Controller: Flask route functions in `app.py` process HTTP requests, validate input, call the Model for data, and render the appropriate View.',
      keyPoint: 'Key Viva Keyword: Separation of concerns, MVC pattern in web applications.'
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 p-5 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-lg">
            🎓
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              B.Tech 2nd Year Project Defense & Viva Voce Guide
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Comprehensive conceptual answers, database architecture, and viva examination points
            </p>
          </div>
        </div>
      </div>

      {/* Database Schema Visualizer */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Database Entity Relationship (ER) Schema
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">SQLite3 · 7 Tables</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {/* Table: courses */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="font-mono font-bold text-blue-600 dark:text-blue-400 mb-1 flex items-center justify-between">
              <span>courses</span>
              <span className="text-[10px] text-slate-400 font-sans">Master</span>
            </div>
            <ul className="space-y-0.5 font-mono text-[11px] text-slate-600 dark:text-slate-300">
              <li><strong className="text-amber-500">PK</strong> course_id (TEXT)</li>
              <li>course_name (TEXT)</li>
              <li>department (TEXT)</li>
              <li>duration (TEXT)</li>
            </ul>
          </div>

          {/* Table: students */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 mb-1 flex items-center justify-between">
              <span>students</span>
              <span className="text-[10px] text-slate-400 font-sans">Core</span>
            </div>
            <ul className="space-y-0.5 font-mono text-[11px] text-slate-600 dark:text-slate-300">
              <li><strong className="text-amber-500">PK</strong> student_id (TEXT)</li>
              <li>full_name (TEXT)</li>
              <li>email (TEXT UNIQUE)</li>
              <li>phone_number (TEXT)</li>
              <li><strong className="text-blue-500">FK</strong> course &rarr; courses</li>
              <li>semester (TEXT)</li>
              <li>admission_date (TEXT)</li>
            </ul>
          </div>

          {/* Table: teachers */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="font-mono font-bold text-purple-600 dark:text-purple-400 mb-1 flex items-center justify-between">
              <span>teachers</span>
              <span className="text-[10px] text-slate-400 font-sans">Faculty</span>
            </div>
            <ul className="space-y-0.5 font-mono text-[11px] text-slate-600 dark:text-slate-300">
              <li><strong className="text-amber-500">PK</strong> teacher_id (TEXT)</li>
              <li>name (TEXT)</li>
              <li>email (TEXT UNIQUE)</li>
              <li>department (TEXT)</li>
              <li>subject (TEXT)</li>
            </ul>
          </div>

          {/* Table: attendance */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="font-mono font-bold text-amber-600 dark:text-amber-400 mb-1 flex items-center justify-between">
              <span>attendance</span>
              <span className="text-[10px] text-red-500 font-sans">UNIQUE(s_id, date)</span>
            </div>
            <ul className="space-y-0.5 font-mono text-[11px] text-slate-600 dark:text-slate-300">
              <li><strong className="text-amber-500">PK</strong> id (INTEGER AUTO)</li>
              <li><strong className="text-blue-500">FK</strong> student_id &rarr; students</li>
              <li>attendance_date (TEXT)</li>
              <li>status (CHECK: P/A)</li>
              <li>remarks (TEXT)</li>
            </ul>
          </div>

          {/* Table: results */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400 mb-1 flex items-center justify-between">
              <span>results</span>
              <span className="text-[10px] text-slate-400 font-sans">Exam Marks</span>
            </div>
            <ul className="space-y-0.5 font-mono text-[11px] text-slate-600 dark:text-slate-300">
              <li><strong className="text-amber-500">PK</strong> id (INTEGER AUTO)</li>
              <li><strong className="text-blue-500">FK</strong> student_id &rarr; students</li>
              <li>subject (TEXT)</li>
              <li>marks_obtained, total_marks</li>
              <li>percentage, grade, status</li>
            </ul>
          </div>

          {/* Table: admin_users & notices */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="font-mono font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
              <span>admin_users & notices</span>
              <span className="text-[10px] text-slate-400 font-sans">System</span>
            </div>
            <ul className="space-y-0.5 font-mono text-[11px] text-slate-600 dark:text-slate-300">
              <li>admin_users: username, password_hash</li>
              <li>notices: id, title, description, category, notice_date</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Top 10 Viva Questions Accordion */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-amber-500" />
          Top 10 Viva Voce Questions & Textbook Answers
        </h3>

        {vivaQuestions.map((q, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                      {q.topic}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {q.question}
                    </h4>
                  </div>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {isOpen && (
                <div className="p-4 pt-1 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {q.answer}
                  </p>
                  <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-[11px] font-medium flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 shrink-0 text-amber-500" />
                    <span>{q.keyPoint}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
