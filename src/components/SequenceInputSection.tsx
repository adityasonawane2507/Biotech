import React, { useState } from 'react';
import {
  Database,
  Copy,
  Check,
  RotateCw,
  FileCode,
  Sparkles,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import { BiologicalSequence } from '../types/biology';
import { SAMPLE_SEQUENCES } from '../data/sampleSequences';

interface SequenceInputSectionProps {
  currentSequence: BiologicalSequence;
  onSelectSample: (seq: BiologicalSequence) => void;
  onUpdateCustomSequence: (name: string, organism: string, accession: string, raw: string) => void;
  onProceedToStep: (step: number) => void;
}

export const SequenceInputSection: React.FC<SequenceInputSectionProps> = ({
  currentSequence,
  onSelectSample,
  onUpdateCustomSequence,
  onProceedToStep
}) => {
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customName, setCustomName] = useState('My Target Sequence');
  const [customOrganism, setCustomOrganism] = useState('Escherichia coli');
  const [customAccession, setCustomAccession] = useState('CUSTOM_001');
  const [customInput, setCustomInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'dna' | 'rna' | 'revcomp'>('dna');

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSequence.rawSequence);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyCustom = () => {
    if (!customInput.trim()) return;
    onUpdateCustomSequence(customName, customOrganism, customAccession, customInput);
  };

  return (
    <div className="space-y-6">
      {/* Milestone 1 Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
              <Database className="w-3.5 h-3.5" />
              <span>Milestone 1 — Public Biological Sequence Acquisition</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Obtain & Inspect Public Sequence Data
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              In computational biology, every project begins with obtaining validated biological sequence data from public repositories (such as NCBI GenBank, RefSeq, or UniProt) in standard FASTA format.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCustomMode(!isCustomMode)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border transition flex items-center gap-2 bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
            >
              <FileCode className="w-4 h-4 text-cyan-400" />
              <span>{isCustomMode ? 'Use Curated Samples' : 'Paste Custom FASTA'}</span>
            </button>
          </div>
        </div>

        {/* Sample Sequence Selector Cards */}
        {!isCustomMode && (
          <div className="mt-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>Select Public Biological Sequence (NCBI RefSeq & GenBank Models)</span>
              <span className="text-[11px] text-emerald-400 font-normal">Click any gene to load</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {SAMPLE_SEQUENCES.map((seq) => {
                const isSelected = currentSequence.id === seq.id;
                return (
                  <button
                    key={seq.id}
                    onClick={() => onSelectSample(seq)}
                    className={`text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-slate-800/90 border-emerald-500 shadow-md shadow-emerald-500/10'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white">{seq.geneName}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {seq.accession}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium mt-1 truncate">{seq.name}</p>
                    <p className="text-[11px] text-slate-400 italic mt-0.5">{seq.organism}</p>
                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-800/70 text-[10px] text-slate-400">
                      <span>{seq.rawSequence.length} bp</span>
                      <span className="text-emerald-400 font-medium capitalize">{seq.category.replace('-', ' ')}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Custom Input Panel */}
        {isCustomMode && (
          <div className="mt-5 bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Gene / Target Name</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  placeholder="e.g., tp53, recA"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Organism</label>
                <input
                  type="text"
                  value={customOrganism}
                  onChange={(e) => setCustomOrganism(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  placeholder="e.g., Homo sapiens"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Accession Number</label>
                <input
                  type="text"
                  value={customAccession}
                  onChange={(e) => setCustomAccession(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  placeholder="e.g., NM_000518"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Paste FASTA or Raw Nucleotide Sequence (A, T, G, C)
              </label>
              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder=">NM_000518.5 Homo sapiens beta globin\nATGGTGCACCTGACTCCTGAGGAGAAGTCTGCCGTTACTGCCCTGTGG..."
                rows={4}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleApplyCustom}
                disabled={!customInput.trim()}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold rounded-lg text-xs transition"
              >
                Load Custom Sequence
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Active Sequence Inspector & Biological Context Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-white">{currentSequence.name}</h2>
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
                NCBI: {currentSequence.accession}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Organism: <span className="text-slate-200 italic">{currentSequence.organism}</span> • Gene:{' '}
              <span className="text-emerald-400 font-semibold">{currentSequence.geneName}</span>
            </p>
            <p className="text-xs text-slate-300 mt-2.5 max-w-3xl leading-relaxed">
              {currentSequence.description}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied FASTA' : 'Copy Sequence'}</span>
            </button>

            <button
              onClick={() => onProceedToStep(2)}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition shadow-md shadow-emerald-500/20"
            >
              <span>Proceed to Milestone 2 (GC Content)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Biological Significance Highlight */}
        <div className="mt-4 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-200">Biological & Computational Context:</span>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
              {currentSequence.biologicalSignificance}
            </p>
          </div>
        </div>

        {/* Sequence Viewer with interactive nucleotide view switcher */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-300">Sequence Explorer</span>
              <span className="text-[11px] text-slate-400 font-mono">({currentSequence.rawSequence.length} bp)</span>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-medium bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setViewMode('dna')}
                className={`px-2.5 py-1 rounded ${
                  viewMode === 'dna' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                5'→3' Sense DNA
              </button>
              <button
                onClick={() => setViewMode('rna')}
                className={`px-2.5 py-1 rounded ${
                  viewMode === 'rna' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                mRNA Transcript
              </button>
              <button
                onClick={() => setViewMode('revcomp')}
                className={`px-2.5 py-1 rounded ${
                  viewMode === 'revcomp' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Reverse Complement
              </button>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs overflow-x-auto max-h-56 scrollbar-thin">
            <div className="text-slate-400 mb-2 text-[10px]">
              &gt;{currentSequence.accession} {currentSequence.name} [{currentSequence.organism}] (length = {currentSequence.rawSequence.length} nt)
            </div>
            <div className="leading-relaxed tracking-wider break-all text-slate-200">
              {(() => {
                const seq =
                  viewMode === 'rna'
                    ? currentSequence.rawSequence.replace(/T/g, 'U')
                    : viewMode === 'revcomp'
                    ? currentSequence.rawSequence
                        .split('')
                        .reverse()
                        .map((b) => ({ A: 'T', T: 'A', G: 'C', C: 'G' }[b] || b))
                        .join('')
                    : currentSequence.rawSequence;

                return seq.split('').map((char, index) => {
                  let colorClass = 'text-slate-200';
                  if (char === 'A') colorClass = 'text-emerald-400 font-semibold';
                  if (char === 'T' || char === 'U') colorClass = 'text-rose-400 font-semibold';
                  if (char === 'G') colorClass = 'text-amber-400 font-semibold';
                  if (char === 'C') colorClass = 'text-cyan-400 font-semibold';

                  return (
                    <span key={index} className={colorClass} title={`Position: ${index + 1} (${char})`}>
                      {char}
                    </span>
                  );
                });
              })()}
            </div>
          </div>

          {/* Color Key */}
          <div className="flex items-center gap-4 mt-2.5 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span> Adenine (A)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block"></span> Thymine (T) / Uracil (U)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span> Guanine (G)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block"></span> Cytosine (C)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
