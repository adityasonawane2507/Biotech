import React, { useState } from 'react';
import {
  Calculator,
  Flame,
  Scale,
  Sparkles,
  Layers,
  ArrowRight,
  Copy,
  Check,
  HelpCircle,
  TrendingUp
} from 'lucide-react';
import { BiologicalSequence, SequenceStats } from '../types/biology';

interface CompositionAnalysisProps {
  currentSequence: BiologicalSequence;
  stats: SequenceStats;
  onProceedToStep: (step: number) => void;
}

export const CompositionAnalysis: React.FC<CompositionAnalysisProps> = ({
  currentSequence,
  stats,
  onProceedToStep
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopySummary = () => {
    const summary = `Biological Sequence Composition Summary:
Gene: ${currentSequence.geneName} (${currentSequence.accession})
Organism: ${currentSequence.organism}
Length: ${stats.length} bp
GC Content: ${stats.gcPercent}% | AT Content: ${stats.atPercent}%
Nucleotide Counts: A=${stats.counts.A} (${(stats.counts.A/stats.length*100).toFixed(1)}%), T=${stats.counts.T} (${(stats.counts.T/stats.length*100).toFixed(1)}%), G=${stats.counts.G} (${(stats.counts.G/stats.length*100).toFixed(1)}%), C=${stats.counts.C} (${(stats.counts.C/stats.length*100).toFixed(1)}%)
Melting Temperature (Tm): ${stats.meltingTempSantaLucia} °C
Molecular Weight: ${(stats.molecularWeightDnaDa / 1000).toFixed(2)} kDa
CpG Island Obs/Exp Ratio: ${stats.cpgObservedToExpected}`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isHighGc = stats.gcPercent >= 55;
  const isLowGc = stats.gcPercent <= 42;

  return (
    <div className="space-y-6">
      {/* Milestone 2 Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
              <Calculator className="w-3.5 h-3.5" />
              <span>Milestone 2 — Nucleotide Composition & Thermodynamic Profiling</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Calculate Nucleotide Composition & GC Content
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              GC content (Guanine-Cytosine %) is one of the most critical statistical metrics in genomics. Because G:C pairs form 3 hydrogen bonds while A:T pairs form only 2, GC content directly dictates DNA melting temperature, genomic stability, codon bias, and PCR annealing parameters.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Summary' : 'Copy Stats Table'}</span>
            </button>
          </div>
        </div>

        {/* Primary Metrics Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {/* GC Content Gauge Card */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                GC Content
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isHighGc
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : isLowGc
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}
              >
                {isHighGc ? 'GC-Rich' : isLowGc ? 'AT-Biased' : 'Balanced GC'}
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {stats.gcPercent}%
              </span>
              <span className="text-xs text-slate-400">
                ({stats.counts.G + stats.counts.C} / {stats.length} nt)
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  isHighGc ? 'bg-amber-400' : isLowGc ? 'bg-rose-400' : 'bg-emerald-400'
                }`}
                style={{ width: `${Math.min(100, stats.gcPercent)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              AT Content: <span className="text-slate-200 font-semibold">{stats.atPercent}%</span>
            </p>
          </div>

          {/* Melting Temperature (Tm) Card */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Est. Melting Tm
              </span>
              <Flame className="w-4 h-4 text-rose-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {stats.meltingTempSantaLucia}°C
              </span>
              <span className="text-xs text-slate-400 font-mono">Marmur-Doty</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-3 leading-tight">
              Wallace Rule: <span className="text-slate-200 font-semibold">{stats.meltingTempWallace}°C</span> (primer binding)
            </p>
            <p className="text-[10px] text-slate-400 mt-1">Temperature at which 50% of DNA duplex is denatured.</p>
          </div>

          {/* Molecular Weight Card */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Molecular Weight
              </span>
              <Scale className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {(stats.molecularWeightDnaDa / 1000).toFixed(1)}
              </span>
              <span className="text-xs text-cyan-400 font-bold">kDa</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-3">
              {stats.molecularWeightDnaDa.toLocaleString()} Da (double-stranded)
            </p>
            <p className="text-[10px] text-slate-400 mt-1">Based on ~650 Da per base pair average.</p>
          </div>

          {/* CpG Islands & Epigenetics Card */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                CpG Obs / Exp Ratio
              </span>
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {stats.cpgObservedToExpected}
              </span>
              <span className="text-xs text-purple-300 font-mono">
                ({stats.cpgCount} dinucleotides)
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-3">
              {stats.cpgObservedToExpected > 0.6 ? (
                <span className="text-emerald-400 font-semibold">CpG Island Candidate (&gt; 0.6)</span>
              ) : (
                <span className="text-slate-400">Normal methylation suppression</span>
              )}
            </p>
            <p className="text-[10px] text-slate-400 mt-1">Key epigenetic marker for eukaryotic gene promoters.</p>
          </div>
        </div>

        {/* Nucleotide Frequency Table & Visual Bars */}
        <div className="mt-6 bg-slate-950/70 border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-bold text-white mb-3">Individual Nucleotide Base Counts</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {/* Adenine */}
            <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400">Adenine (A)</span>
                <span className="text-[10px] text-slate-400 font-mono">Purine</span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-xl font-bold text-white">{stats.counts.A}</span>
                <span className="text-xs font-mono text-emerald-300">
                  {((stats.counts.A / stats.length) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2">
                <div
                  className="bg-emerald-400 h-full rounded-full"
                  style={{ width: `${(stats.counts.A / stats.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Thymine */}
            <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400">Thymine (T)</span>
                <span className="text-[10px] text-slate-400 font-mono">Pyrimidine</span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-xl font-bold text-white">{stats.counts.T}</span>
                <span className="text-xs font-mono text-rose-300">
                  {((stats.counts.T / stats.length) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2">
                <div
                  className="bg-rose-400 h-full rounded-full"
                  style={{ width: `${(stats.counts.T / stats.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Guanine */}
            <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400">Guanine (G)</span>
                <span className="text-[10px] text-slate-400 font-mono">Purine</span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-xl font-bold text-white">{stats.counts.G}</span>
                <span className="text-xs font-mono text-amber-300">
                  {((stats.counts.G / stats.length) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2">
                <div
                  className="bg-amber-400 h-full rounded-full"
                  style={{ width: `${(stats.counts.G / stats.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Cytosine */}
            <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400">Cytosine (C)</span>
                <span className="text-[10px] text-slate-400 font-mono">Pyrimidine</span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-xl font-bold text-white">{stats.counts.C}</span>
                <span className="text-xs font-mono text-cyan-300">
                  {((stats.counts.C / stats.length) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2">
                <div
                  className="bg-cyan-400 h-full rounded-full"
                  style={{ width: `${(stats.counts.C / stats.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Purine / Pyrimidine Symmetry */}
          <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-3">
            <div>
              <span className="text-slate-400">Purines (A + G): </span>
              <span className="font-semibold text-white">{stats.purineCount} ({stats.purinePercent}%)</span>
            </div>
            <div>
              <span className="text-slate-400">Pyrimidines (C + T): </span>
              <span className="font-semibold text-white">
                {stats.pyrimidineCount} ({(100 - stats.purinePercent).toFixed(1)}%)
              </span>
            </div>
            <div>
              <span className="text-slate-400">GC / AT Ratio: </span>
              <span className="font-semibold text-emerald-400">{stats.gcAtRatio}</span>
            </div>
          </div>
        </div>

        {/* Biological Discussion & Next Step Button */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <p className="text-xs text-slate-400">
            ✅ <strong className="text-slate-200">Milestone 2 completed:</strong> Nucleotide frequency and thermodynamic parameters calculated successfully.
          </p>

          <button
            onClick={() => onProceedToStep(3)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition shadow-md shadow-emerald-500/20"
          >
            <span>Proceed to Milestone 3 (Motifs & ORFs)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
