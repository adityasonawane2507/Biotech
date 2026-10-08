import React, { useState } from 'react';
import {
  X,
  Printer,
  Download,
  Copy,
  Check,
  FileText,
  Award,
  Sparkles
} from 'lucide-react';
import { BiologicalSequence, SequenceStats } from '../types/biology';

interface ReportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSequence: BiologicalSequence;
  stats: SequenceStats;
}

export const ReportExportModal: React.FC<ReportExportModalProps> = ({
  isOpen,
  onClose,
  currentSequence,
  stats
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const reportMarkdown = `# INDEPENDENT COMPUTATIONAL BIOLOGY PROJECT REPORT
## Title: Analysis of Biological Sequence Data Using Python
**Date:** ${currentDate}
**Author:** Computational Biology / Biotechnology Candidate
**Target Locus:** ${currentSequence.name} (${currentSequence.geneName})
**NCBI Accession:** ${currentSequence.accession} | **Organism:** ${currentSequence.organism}

---

### 1. ABSTRACT
This project documents the development and execution of an independent Python computational biology pipeline for analyzing biological sequence data. Using validated public genetic data from NCBI GenBank, this investigation quantified nucleotide frequency distributions, computed thermodynamic melting profiles, mapped spatial GC skew asymmetries, and surveyed candidate protein-coding Open Reading Frames (ORFs).

### 2. METHODOLOGY
1. **Sequence Sanitization:** Raw FASTA records were parsed, stripped of non-canonical characters, and standardized to standard 5'->3' orientation.
2. **Nucleotide Frequencies:** Absolute and relative counts of Adenine, Thymine, Guanine, and Cytosine were computed. GC percentage was calculated as (G + C) / total_length * 100.
3. **Thermodynamics & Physical Metrics:** Duplex denaturation melting temperature was estimated using the Marmur-Doty empirical model: Tm = 64.9 + 41 * (G + C - 16.4) / Length. Molecular weight was estimated based on double-stranded average base-pair mass (650 Da/bp).
4. **Spatial GC Skew Analysis:** Overlapping sliding windows (window size = 50 bp, step = 10 bp) were mapped to evaluate strand asymmetry: Skew = (G - C) / (G + C).
5. **ORF Identification:** Forward (+1, +2, +3) and reverse (-1, -2, -3) reading frames were screened for canonical ATG initiation codons through TAA/TAG/TGA termination signals.

### 3. RESULTS & EMPIRICAL FINDINGS
- **Total Sequence Length:** ${stats.length} base pairs
- **Nucleotide Breakdown:**
  - Adenine (A): ${stats.counts.A} (${((stats.counts.A / stats.length) * 100).toFixed(1)}%)
  - Thymine (T): ${stats.counts.T} (${((stats.counts.T / stats.length) * 100).toFixed(1)}%)
  - Guanine (G): ${stats.counts.G} (${((stats.counts.G / stats.length) * 100).toFixed(1)}%)
  - Cytosine (C): ${stats.counts.C} (${((stats.counts.C / stats.length) * 100).toFixed(1)}%)
- **GC Content:** ${stats.gcPercent}%
- **AT Content:** ${stats.atPercent}%
- **GC / AT Ratio:** ${stats.gcAtRatio}
- **Estimated Melting Temperature (Tm):** ${stats.meltingTempSantaLucia} °C
- **CpG Observed / Expected Ratio:** ${stats.cpgObservedToExpected} (${stats.cpgCount} CpG dinucleotides)
- **Molecular Weight (dsDNA):** ${(stats.molecularWeightDnaDa / 1000).toFixed(2)} kDa

### 4. BIOLOGICAL DISCUSSION
${currentSequence.biologicalSignificance}
The measured GC content of ${stats.gcPercent}% reflects locus-specific evolutionary constraints and thermodynamic stability.

### 5. CONCLUSION & CV APPLICATION
This project establishes practical proficiency in computational approaches to biological sequence analysis, complementing foundational laboratory microbiology skills with modern programmatic data analysis.
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(reportMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([reportMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sequence_analysis_report_${currentSequence.geneName.toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Academic Project Documentation & Findings</h2>
              <p className="text-xs text-slate-400">Methodology & Empirical Results Report</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition"
              title="Print to PDF"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition"
              title="Download Markdown"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition"
              title="Copy Report"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300 leading-relaxed font-sans bg-slate-950">
          <div className="border-b border-slate-800 pb-4">
            <div className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 font-bold mb-1">
              Independent Computational Biology Project
            </div>
            <h1 className="text-xl font-extrabold text-white">
              Analysis of Biological Sequence Data Using Python
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-slate-400 text-xs mt-2 font-mono">
              <span>Target: {currentSequence.name} ({currentSequence.geneName})</span>
              <span>•</span>
              <span>Organism: {currentSequence.organism}</span>
              <span>•</span>
              <span>Accession: {currentSequence.accession}</span>
              <span>•</span>
              <span>Date: {currentDate}</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 text-emerald-400">
              1. Abstract & Objectives
            </h3>
            <p>
              This investigation presents an independent computational biology project designed to establish foundational programming and statistical skills in biological sequence analysis. By leveraging Python 3, public NCBI sequence datasets were evaluated to determine nucleotide frequencies, thermodynamic melting characteristics, and spatial sequence architecture.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 text-emerald-400">
              2. Computational Methodology
            </h3>
            <div className="space-y-2">
              <p>
                <strong>Sequence Acquisition & Parsing:</strong> Raw records were retrieved from NCBI GenBank. FASTA records were validated and stripped of formatting artifacts.
              </p>
              <p>
                <strong>Statistical Formulation:</strong> Absolute base frequencies were aggregated into GC percentage: <code className="bg-slate-900 px-1 py-0.5 rounded text-emerald-300 font-mono">GC% = ((G + C) / L) * 100</code>. Melting temperature was modeled using the Marmur-Doty equation: <code className="bg-slate-900 px-1 py-0.5 rounded text-emerald-300 font-mono">Tm = 64.9 + 41 * (G + C - 16.4) / L</code>.
              </p>
              <p>
                <strong>Spatial Skew Profiling:</strong> Overlapping windows evaluated localized strand asymmetry using normalized GC skew: <code className="bg-slate-900 px-1 py-0.5 rounded text-emerald-300 font-mono">Skew = (G - C) / (G + C)</code>.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 text-emerald-400">
              3. Summary of Empirical Results
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px]">Sequence Length</span>
                <p className="text-base font-bold text-white">{stats.length} bp</p>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px]">GC Content</span>
                <p className="text-base font-bold text-emerald-400">{stats.gcPercent}%</p>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px]">Melting Tm</span>
                <p className="text-base font-bold text-cyan-400">{stats.meltingTempSantaLucia} °C</p>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px]">CpG Obs/Exp</span>
                <p className="text-base font-bold text-white">{stats.cpgObservedToExpected}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 text-emerald-400">
              4. Biological Context & Interpretation
            </h3>
            <p className="leading-relaxed">
              {currentSequence.biologicalSignificance} The observed base composition provides crucial clues into thermal stability and functional transcription. Extreme thermophiles maintain high GC content to prevent premature thermal strand dissociation, while viral and parasitic genomes frequently exhibit AT bias.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 text-emerald-400">
              5. CV Project Entry
            </h3>
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5 font-mono text-[11px] text-slate-300">
              <div className="font-bold text-white">
                Independent Computational Biology Project — Biological Sequence Analysis (2026)
              </div>
              <div>• Used basic Python programming to analyze biological sequence data and visualize sequence characteristics.</div>
              <div>• Developed introductory experience in computational approaches to biological data analysis.</div>
              <div>• Calculated nucleotide composition, GC content, and identified simple sequence patterns.</div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-xs text-slate-400">Ready for submission or academic portfolio inclusion</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
