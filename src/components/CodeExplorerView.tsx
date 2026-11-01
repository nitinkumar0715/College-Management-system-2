import React, { useState } from 'react';
import { FLASK_PROJECT_FILES, ProjectFile } from '../projectFilesData';
import JSZip from 'jszip';
import {
  Download,
  Copy,
  Check,
  FileCode,
  Folder,
  Terminal,
  FileText,
  FileCheck2,
  ExternalLink
} from 'lucide-react';

export const CodeExplorerView: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<ProjectFile>(FLASK_PROJECT_FILES[1]); // default to app.py
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setDownloading(true);
      const zip = new JSZip();
      const rootFolder = zip.folder('college-management-system');

      FLASK_PROJECT_FILES.forEach((f) => {
        rootFolder?.file(f.path, f.content);
      });

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'college-management-system.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate ZIP:', err);
    } finally {
      setDownloading(false);
    }
  };

  // Group files by category
  const categories = ['Backend', 'Database', 'Templates', 'Static Assets', 'Documentation'] as const;

  return (
    <div className="space-y-6">
      {/* Top Banner with Local Run Quickstart & Download ZIP button */}
      <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-base font-bold text-white">
              B.Tech Project Codebase · Python Flask + SQLite3
            </h3>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            All files below are structured for an academic submission. You can inspect the code, copy snippets for your report, or download the full ZIP to run locally with <code className="bg-slate-800 text-emerald-400 px-1 py-0.5 rounded font-mono">python app.py</code>.
          </p>
        </div>

        <button
          onClick={handleDownloadZip}
          disabled={downloading}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-md transition-colors shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>{downloading ? 'Packing ZIP...' : 'Download Full Project (.ZIP)'}</span>
        </button>
      </div>

      {/* Code Viewer Layout: Sidebar tree on left, Code editor on right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 min-h-[580px]">
        {/* Left: File Tree Explorer */}
        <div className="md:col-span-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Folder className="w-4 h-4 text-blue-500" />
              Project Files
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {FLASK_PROJECT_FILES.length} files
            </span>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[500px]">
            {categories.map((cat) => {
              const filesInCat = FLASK_PROJECT_FILES.filter((f) => f.category === cat);
              if (filesInCat.length === 0) return null;
              return (
                <div key={cat} className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                    {cat}
                  </span>
                  <div className="space-y-0.5">
                    {filesInCat.map((file) => {
                      const isSelected = selectedFile.path === file.path;
                      return (
                        <button
                          key={file.path}
                          onClick={() => setSelectedFile(file)}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors text-left ${
                            isSelected
                              ? 'bg-blue-600 text-white font-semibold'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span className="truncate">{file.path}</span>
                          <span className={`text-[10px] uppercase ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                            {file.language}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Code Display Window */}
        <div className="md:col-span-8 bg-slate-950 rounded-xl border border-slate-800 shadow-md flex flex-col overflow-hidden">
          {/* Editor Header */}
          <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="font-mono text-xs font-bold text-slate-200 ml-2">
                college-management-system/{selectedFile.path}
              </span>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md text-xs font-semibold transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Code Text with Line Numbers */}
          <div className="p-4 overflow-x-auto flex-1 font-mono text-xs text-slate-300 leading-relaxed max-h-[500px]">
            <pre>
              <code>{selectedFile.content}</code>
            </pre>
          </div>

          {/* Editor Footer / Info */}
          <div className="px-4 py-2 bg-slate-900/90 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Encoding: UTF-8</span>
            <span>Lines: {selectedFile.content.split('\n').length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
