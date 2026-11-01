/**
 * Smart College Management System - Vanilla JavaScript
 * Suitable for BTech 2nd Year Computer Science Project Demonstration.
 * 
 * Handles:
 * 1. Dark Mode Theme Switching with localStorage persistence
 * 2. Modal Open/Close, Backdrop Click, and Escape Key handling
 * 3. Client-Side Instant Table Search & Filtering
 * 4. Password Visibility Toggle (Show/Hide)
 * 5. Dynamic Grade & Percentage Preview in Results modal
 * 6. Form Validation & Auto-Dismissing Toast Notifications
 * 7. Mobile Drawer Navigation
 */

document.addEventListener('DOMContentLoaded', function () {
  // 1. THEME SWITCHER (DARK MODE)
  initTheme();

  // 2. MODAL CONTROLS
  initModals();

  // 3. PASSWORD VISIBILITY TOGGLE
  initPasswordToggle();

  // 4. INSTANT CLIENT-SIDE SEARCH
  initTableSearch();

  // 5. TOAST NOTIFICATION AUTO-DISMISS
  initToasts();

  // 6. RESULT MARKS DYNAMIC CALCULATION PREVIEW
  initResultCalculator();

  // 7. MOBILE SIDEBAR TOGGLE
  initMobileMenu();
});

/**
 * Initializes and manages Dark / Light Mode via localStorage
 */
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const savedTheme = localStorage.getItem('college_cms_theme') || 'light';

  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeButtonText(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('college_cms_theme', newTheme);
      updateThemeButtonText(newTheme);
    });
  }
}

function updateThemeButtonText(theme) {
  const btn = document.getElementById('themeToggleBtn');
  if (btn) {
    btn.innerHTML = theme === 'dark' 
      ? '☀️ <span>Light Mode</span>' 
      : '🌙 <span>Dark Mode</span>';
  }
}

/**
 * Handles Opening and Closing of Pop-up Modals
 */
function initModals() {
  // Open modal buttons
  document.querySelectorAll('[data-open-modal]').forEach(button => {
    button.addEventListener('click', () => {
      const targetModalId = button.getAttribute('data-open-modal');
      const modal = document.getElementById(targetModalId);
      if (modal) {
        modal.classList.add('show');
      }
    });
  });

  // Close modal buttons (close icon or cancel button)
  document.querySelectorAll('[data-close-modal]').forEach(button => {
    button.addEventListener('click', () => {
      const modal = button.closest('.modal-overlay');
      if (modal) {
        modal.classList.remove('show');
      }
    });
  });

  // Close on clicking backdrop outside modal content
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('show');
      }
    });
  });

  // Close modal with 'Escape' key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.show').forEach(m => m.classList.remove('show'));
    }
  });
}

/**
 * Show / Hide password toggle on the login page
 */
function initPasswordToggle() {
  const toggleBtn = document.getElementById('togglePasswordBtn');
  const passwordInput = document.getElementById('passwordInput');

  if (toggleBtn && passwordInput) {
    toggleBtn.addEventListener('click', () => {
      const isPassword = passwordInput.getAttribute('type') === 'password';
      passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
      toggleBtn.textContent = isPassword ? 'Hide' : 'Show';
    });
  }
}

/**
 * Client-side search helper for tables
 */
function initTableSearch() {
  const clientSearchInput = document.getElementById('clientTableSearch');
  if (!clientSearchInput) return;

  clientSearchInput.addEventListener('input', function () {
    const filter = this.value.toLowerCase().trim();
    const table = document.querySelector('.modern-table tbody');
    if (!table) return;

    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
      const text = row.innerText.toLowerCase();
      row.style.display = text.includes(filter) ? '' : 'none';
    });
  });
}

/**
 * Auto-dismiss toast notifications after 4 seconds
 */
function initToasts() {
  const toasts = document.querySelectorAll('.toast');
  toasts.forEach(toast => {
    const closeBtn = toast.querySelector('.toast-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => toast.remove());
    }
    setTimeout(() => {
      if (toast && toast.parentElement) {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s ease';
        setTimeout(() => toast.remove(), 500);
      }
    }, 4500);
  });
}

/**
 * Calculates grade and percentage preview dynamically in the results entry modal
 */
function initResultCalculator() {
  const marksObt = document.getElementById('calcMarksObt');
  const marksTot = document.getElementById('calcMarksTot');
  const pctPreview = document.getElementById('calcPctPreview');
  const gradePreview = document.getElementById('calcGradePreview');

  if (!marksObt || !marksTot) return;

  function calculate() {
    const obtained = parseFloat(marksObt.value) || 0;
    const total = parseFloat(marksTot.value) || 100;

    if (total <= 0) return;
    const pct = ((obtained / total) * 100).toFixed(1);

    let grade = 'F';
    let status = 'Fail';

    if (pct >= 90) grade = 'O (Outstanding)';
    else if (pct >= 80) grade = 'A+ (Excellent)';
    else if (pct >= 70) grade = 'A (Very Good)';
    else if (pct >= 60) grade = 'B+ (Good)';
    else if (pct >= 50) grade = 'B (Above Average)';
    else if (pct >= 40) grade = 'C (Pass)';
    else grade = 'F (Fail)';

    status = pct >= 40 ? 'Pass' : 'Fail';

    if (pctPreview) pctPreview.textContent = `${pct}%`;
    if (gradePreview) gradePreview.textContent = `${grade} · ${status}`;
  }

  marksObt.addEventListener('input', calculate);
  marksTot.addEventListener('input', calculate);
}

/**
 * Mobile sidebar drawer toggle
 */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const sidebar = document.querySelector('.sidebar');
  if (menuBtn && sidebar) {
    menuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }
}
