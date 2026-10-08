import React, { useState } from 'react';
import {
  Binary,
  Scissors,
  Bookmark,
  CheckCircle2,
  ArrowRight,
  Code2,
  FileCode2,
  HelpCircle
} from 'lucide-react';
import { BiologicalSequence, OpenReadingFrame, RestrictionSite, MotifMatch } from '../types/biology';

interface MotifsAndOrfViewerProps {
  currentSequence: BiologicalSequence;
  orfs: OpenReadingFrame[];
  restrictionSites: RestrictionSite[];
  motifs: MotifMatch[];
  onProceedToStep: (step: number) => void;
}

export const MotifsAndOrfViewer: React.FC<MotifsAndOrfViewerProps> = ({
  currentSequence,
  orfs,
  restrictionSites,
  motifs,
  onProceedToStep
}) => {
  const [activeTab, setActiveTab] = useState<'orfs' | 'restriction' | 'motifs'>('orfs');
  const [selectedOrf, setSelectedOrf] = useState<OpenReadingFrame | null>(orfs[0] || null);

  return (
    <div className="space-y-6">
      {/* Milestone 3 Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
              <Binary className="w-3.5 h-3.5" />
              <span>Milestone 3 — Pattern Recognition & Functional Elements</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Identify Sequence Patterns, ORFs & Cleavage Sites
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Biological sequence analysis leverages computational pattern matching to locate protein-coding Open Reading Frames (ORFs), restriction enzyme recognition palindromes, and regulatory consensus sequences.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('orfs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'orfs' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              ORFs ({orfs.length})
            </button>
            <button
              onClick={() => setActiveTab('restriction')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'restriction' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Restriction Digestion
            </button>
            <button
              onClick={() => setActiveTab('motifs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'motifs' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Motifs ({motifs.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Open Reading Frames (ORFs) */}
        {activeTab === 'orfs' && (
          <div className="mt-6 space-y-6">
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-200">
                  6-Frame ORF Architecture (Forward +1/+2/+3, Reverse -1/-2/-3)
                </span>
                <span className="text-[11px] text-slate-400">
                  Threshold: ≥ 20 codons (~60 bp)
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Identifies canonical initiation codon <code className="text-emerald-400 font-bold">ATG (Met)</code> to termination codons <code className="text-rose-400 font-bold">TAA / TAG / TGA</code>.
              </p>

              {/* 6-frame graphical track representation */}
              <div className="space-y-2 bg-slate-900 p-4 rounded-lg border border-slate-800">
                {[1, 2, 3, -1, -2, -3].map((frame) => {
                  const frameOrfs = orfs.filter((o) => o.frame === frame);
                  return (
                    <div key={frame} className="flex items-center gap-3 text-xs">
                      <span className="w-12 font-mono text-[11px] text-slate-400">
                        {frame > 0 ? `+${frame}` : `${frame}`}
                      </span>
                      <div className="relative flex-1 h-5 bg-slate-950 rounded border border-slate-800/80 overflow-hidden">
                        {frameOrfs.map((orf) => {
                          const leftPct = (Math.min(orf.start, orf.end) / currentSequence.rawSequence.length) * 100;
                          const widthPct = (orf.lengthNucleotides / currentSequence.rawSequence.length) * 100;
                          const isSelected = selectedOrf?.id === orf.id;

                          return (
                            <button
                              key={orf.id}
                              onClick={() => setSelectedOrf(orf)}
                              style={{ left: `${leftPct}%`, width: `${Math.max(2, widthPct)}%` }}
                              title={`Frame ${orf.frame}: ${orf.start}-${orf.end} (${orf.lengthCodons} aa)`}
                              className={`absolute top-0 bottom-0 rounded transition ${
                                isSelected
                                  ? 'bg-emerald-400 ring-2 ring-emerald-300'
                                  : orf.isLongest
                                  ? 'bg-cyan-500 hover:bg-cyan-400'
                                  : 'bg-emerald-600/70 hover:bg-emerald-500'
                              }`}
                            />
                          );
                        })}
                      </div>
                      <span className="w-8 text-right font-mono text-[10px] text-slate-400">
                        {frameOrfs.length}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected ORF details and peptide translation */}
            {selectedOrf ? (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white text-sm">
                      Selected Candidate Coding Region
                    </span>
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                      Frame {selectedOrf.frame > 0 ? `+${selectedOrf.frame}` : selectedOrf.frame}
                    </span>
                    {selectedOrf.isLongest && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 uppercase">
                        Longest ORF
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-mono text-slate-300">
                    Span: <span className="text-emerald-400 font-bold">{selectedOrf.start}</span> to{' '}
                    <span className="text-emerald-400 font-bold">{selectedOrf.end}</span> bp ({selectedOrf.lengthNucleotides} nt)
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-slate-900 rounded-lg">
                    <span className="text-slate-400 text-[11px]">Amino Acid Length</span>
                    <p className="text-base font-bold text-white mt-1">{selectedOrf.lengthCodons} residues</p>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-lg">
                    <span className="text-slate-400 text-[11px]">Polypeptide Mass</span>
                    <p className="text-base font-bold text-cyan-400 mt-1">{selectedOrf.molecularWeightKDa} kDa</p>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-lg">
                    <span className="text-slate-400 text-[11px]">Strand Orientation</span>
                    <p className="text-base font-bold text-white mt-1">
                      {selectedOrf.frame > 0 ? "5' -> 3' Sense" : "3' <- 5' Antisense"}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-lg">
                    <span className="text-slate-400 text-[11px]">Codon Density</span>
                    <p className="text-base font-bold text-white mt-1">
                      {((selectedOrf.lengthNucleotides / currentSequence.rawSequence.length) * 100).toFixed(1)}% of locus
                    </p>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Translated Amino Acid Polypeptide Sequence (1-Letter Code):
                  </span>
                  <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-lg font-mono text-xs text-emerald-300 break-all leading-relaxed max-h-36 overflow-y-auto">
                    {selectedOrf.proteinSequence}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">No qualifying Open Reading Frames found.</p>
            )}
          </div>
        )}

        {/* Tab 2: Restriction Enzyme Cleavage Sites */}
        {activeTab === 'restriction' && (
          <div className="mt-6 space-y-4">
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
              <span className="text-xs font-bold text-slate-200">
                Molecular Cloning Restriction Cleavage Profiles
              </span>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Restriction endonucleases recognize specific palindromic motifs. In wet-lab microbiology, they are used to verify plasmids or gene insertions via agarose gel electrophoresis.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono">
                    <th className="py-2.5 px-3">Enzyme</th>
                    <th className="py-2.5 px-3">Palindromic Recognition Site</th>
                    <th className="py-2.5 px-3">Cut Count</th>
                    <th className="py-2.5 px-3">Cut Positions (1-based bp)</th>
                    <th className="py-2.5 px-3">Fragment Sizes (bp)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {restrictionSites.map((site) => (
                    <tr key={site.enzyme} className="hover:bg-slate-800/40">
                      <td className="py-3 px-3 font-bold text-emerald-400">{site.enzyme}</td>
                      <td className="py-3 px-3 text-cyan-300 tracking-wider">{site.recognitionSeq}</td>
                      <td className="py-3 px-3">
                        {site.matches.length > 0 ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                            {site.matches.length} cuts
                          </span>
                        ) : (
                          <span className="text-slate-400">0 (No cut)</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {site.matches.length > 0 ? site.matches.join(', ') : '—'}
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {site.fragmentSizes.join(', ')} bp
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Regulatory Motifs */}
        {activeTab === 'motifs' && (
          <div className="mt-6 space-y-4">
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
              <span className="text-xs font-bold text-slate-200">
                Discovered Biological Consensus Motifs
              </span>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Known promoter and transcriptional regulation motifs searched against this sequence.
              </p>
            </div>

            {motifs.length === 0 ? (
              <div className="p-8 text-center bg-slate-950 rounded-xl border border-slate-800 text-slate-400 text-xs">
                No standard canonical promoter motifs detected in this coding sequence window.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {motifs.map((motif, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400">{motif.name}</span>
                      <span className="text-[11px] font-mono text-cyan-300 px-2 py-0.5 bg-slate-900 rounded">
                        {motif.motif}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{motif.description}</p>
                    <div className="text-[11px] text-slate-300 font-mono pt-2 border-t border-slate-800/70">
                      Positions: {motif.positions.join(', ')} bp ({motif.positions.length} occurrences)
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Milestone Footer */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <p className="text-xs text-slate-400">
            ✅ <strong className="text-slate-200">Milestone 3 completed:</strong> ORFs mapped across all 6 frames and restriction enzyme cut profiles documented.
          </p>

          <button
            onClick={() => onProceedToStep(4)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition shadow-md shadow-emerald-500/20"
          >
            <span>Proceed to Milestone 4 (Visualizations)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
