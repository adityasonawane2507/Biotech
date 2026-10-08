import React from 'react';
import {
  Dna,
  Terminal,
  BarChart3,
  FileText,
  HelpCircle,
  Download,
  Share2,
  Sparkles
} from 'lucide-react';
import { BiologicalSequence } from '../types/biology';

interface NavbarProps {
  activeTab: 'laboratory' | 'python' | 'visuals' | 'cv' | 'interview';
  setActiveTab: (tab: 'laboratory' | 'python' | 'visuals' | 'cv' | 'interview') => void;
  sequences: BiologicalSequence[];
  selectedSeqId: string;
  onSelectSequence: (id: string) => void;
  onOpenReportModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  sequences,
  selectedSeqId,
  onSelectSequence,
  onOpenReportModal
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Project Tag */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20">
              <Dna className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white tracking-tight">BioSeq Lab</span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Python BioProject
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Sequence Analysis & Internship CV Suite
              </p>
            </div>
          </div>

          {/* Quick Gene Switcher */}
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Active Gene:</span>
            <select
              value={selectedSeqId}
              onChange={(e) => onSelectSequence(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs font-mono text-emerald-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 hover:border-slate-600 transition"
            >
              {sequences.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.geneName} — {s.organism} ({s.accession})
                </option>
              ))}
              <option value="custom">⚡ Custom Sequence / FASTA</option>
            </select>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab('laboratory')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'laboratory'
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Dna className="w-4 h-4" />
              <span>Lab Workbench</span>
            </button>

            <button
              onClick={() => setActiveTab('python')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'python'
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>Python Studio</span>
            </button>

            <button
              onClick={() => setActiveTab('visuals')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'visuals'
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Visuals</span>
            </button>

            <button
              onClick={() => setActiveTab('cv')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'cv'
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>CV Project Entry</span>
            </button>

            <button
              onClick={() => setActiveTab('interview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'interview'
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Interview Prep</span>
            </button>
          </nav>

          {/* Action button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenReportModal}
              className="hidden sm:inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export Report</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
