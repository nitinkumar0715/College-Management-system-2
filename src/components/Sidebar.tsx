import React from 'react';
import { ActiveTab } from '../types';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  CalendarCheck,
  Award,
  Bell,
  Code2,
  FileQuestion,
  LogOut,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  onLogout: () => void;
  adminName: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  mobileOpen,
  setMobileOpen,
  onLogout,
  adminName
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: GraduationCap },
    { id: 'teachers', label: 'Teachers', icon: Users },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'results', label: 'Results & Grades', icon: Award },
    { id: 'notices', label: 'Notice Board', icon: Bell },
  ];

  const handleNavClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-slate-900 text-slate-100 flex flex-col z-50 transition-transform duration-300 ease-in-out border-r border-slate-800 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20 text-lg">
            🎓
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight text-white leading-tight">
              Smart College CMS
            </h1>
            <span className="text-[11px] text-blue-400 font-medium">B.Tech 2nd Year Project</span>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Management Portal
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id as ActiveTab)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-5 px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Academic Viva & Source
          </div>

          {/* Project Source Code Explorer Tab */}
          <button
            onClick={() => handleNavClick('code_explorer')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
              activeTab === 'code_explorer'
                ? 'bg-blue-600 text-white shadow-sm font-semibold'
                : 'text-emerald-400 hover:bg-slate-800/60'
            }`}
          >
            <Code2 className="w-4 h-4 text-emerald-400" />
            <div className="flex-1 flex items-center justify-between">
              <span>Flask Code & ZIP</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">
                16 files
              </span>
            </div>
          </button>

          {/* B.Tech Viva Guide & Report Tab */}
          <button
            onClick={() => handleNavClick('viva_guide')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
              activeTab === 'viva_guide'
                ? 'bg-blue-600 text-white shadow-sm font-semibold'
                : 'text-amber-400 hover:bg-slate-800/60'
            }`}
          >
            <FileQuestion className="w-4 h-4 text-amber-400" />
            <div className="flex-1 flex items-center justify-between">
              <span>Viva Voce Q&A</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">
                Prep
              </span>
            </div>
          </button>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-500/30">
                {adminName[0] || 'A'}
              </div>
              <div className="text-xs">
                <div className="font-semibold text-slate-200">{adminName}</div>
                <div className="text-[10px] text-slate-400">System Admin</div>
              </div>
            </div>

            <button
              onClick={onLogout}
              title="Logout"
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
