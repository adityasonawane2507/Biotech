import React from 'react';
import { CheckCircle2, Database, Calculator, Binary, LineChart, Award } from 'lucide-react';

interface MilestoneStepperProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
}

export const MILESTONES = [
  {
    step: 1,
    title: 'Obtain Sequence',
    subtitle: 'Public Accession & FASTA',
    icon: Database,
    desc: 'Retrieve DNA/RNA from NCBI GenBank, UniProt, or custom FASTA.'
  },
  {
    step: 2,
    title: 'Composition & GC',
    subtitle: 'Nucleotide & Physical Stats',
    icon: Calculator,
    desc: 'Calculate A/T/G/C proportions, GC%, AT/GC skew, and melting Tm.'
  },
  {
    step: 3,
    title: 'Patterns & Motifs',
    subtitle: 'ORFs & Cleavage Sites',
    icon: Binary,
    desc: 'Identify 6-frame Open Reading Frames, start/stop codons & restriction sites.'
  },
  {
    step: 4,
    title: 'Visualize Data',
    subtitle: 'Sliding Windows & Skew',
    icon: LineChart,
    desc: 'Plot GC landscape, cumulative skew curves, and virtual gel runs.'
  },
  {
    step: 5,
    title: 'Document & CV',
    subtitle: 'Report & Internship Entry',
    icon: Award,
    desc: 'Synthesize methodology, package Python code, and polish CV profile.'
  }
];

export const MilestoneStepper: React.FC<MilestoneStepperProps> = ({
  currentStep,
  onSelectStep
}) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 mb-6 backdrop-blur">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Project Milestone Roadmap
          </span>
          <h2 className="text-sm sm:text-base font-bold text-white">
            “Analysis of Biological Sequence Data Using Python”
          </h2>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Step <span className="text-emerald-400 font-bold">{currentStep}</span> of 5
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
        {MILESTONES.map((m) => {
          const Icon = m.icon;
          const isActive = currentStep === m.step;
          const isDone = currentStep > m.step;

          return (
            <button
              key={m.step}
              onClick={() => onSelectStep(m.step)}
              className={`text-left p-3 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                isActive
                  ? 'bg-slate-800/90 border-emerald-500 shadow-md shadow-emerald-500/10'
                  : isDone
                  ? 'bg-slate-900/80 border-emerald-900/60 hover:border-slate-700'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : isDone
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Icon className="w-3.5 h-3.5" />}
                </div>
                <span className="text-[10px] font-mono text-slate-400">0{m.step}</span>
              </div>
              <div>
                <p className={`text-xs font-bold leading-tight ${isActive ? 'text-white' : 'text-slate-200'}`}>
                  {m.title}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5 truncate">{m.subtitle}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
