import React from 'react';
import { ActiveTab } from '../types';
import {
  Menu,
  Moon,
  Sun,
  RotateCcw,
  Code,
  GraduationCap,
  Sparkles
} from 'lucide-react';

interface TopbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  onMobileToggle: () => void;
  onResetData: () => void;
  adminName: string;
}

export const Topbar: React.FC<TopbarProps> = ({
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  onMobileToggle,
  onResetData,
  adminName
}) => {
  const getTabTitle = (tab: ActiveTab) => {
    switch (tab) {
      case 'dashboard': return 'Institutional Dashboard & Analytics';
      case 'students': return 'Student Information & Enrollment';
      case 'teachers': return 'Faculty & Teacher Directory';
      case 'courses': return 'Degree Courses & Curricula';
      case 'attendance': return 'Student Daily Attendance Logs';
      case 'results': return 'Examination Marks & Grading System';
      case 'notices': return 'Campus Announcements & Circulars';
      case 'code_explorer': return 'Flask + SQLite Source Code Explorer';
      case 'viva_guide': return 'B.Tech Viva Voce & Project Defense Guide';
      default: return 'College Management System';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileToggle}
          className="p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 tracking-tight leading-tight">
            {getTabTitle(activeTab)}
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
            Smart College CMS · SQLite3 Relational Engine
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick View Switcher on Desktop */}
        <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              activeTab !== 'code_explorer' && activeTab !== 'viva_guide'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Live CMS
          </button>
          <button
            onClick={() => setActiveTab('code_explorer')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
              activeTab === 'code_explorer'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Flask Code</span>
          </button>
          <button
            onClick={() => setActiveTab('viva_guide')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
              activeTab === 'viva_guide'
                ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Viva Guide</span>
          </button>
        </div>

        {/* Reset Database Button */}
        <button
          onClick={onResetData}
          title="Reset database to initial sample records"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Seed Data</span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>
      </div>
    </header>
  );
};
