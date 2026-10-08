import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Sliders,
  Sparkles,
  ArrowRight,
  Download,
  Info,
  Layers,
  Activity,
  Flame
} from 'lucide-react';
import {
  BiologicalSequence,
  SequenceStats,
  WindowDataPoint,
  RestrictionSite,
  OpenReadingFrame
} from '../types/biology';
import { calculateSlidingWindow, calculateKyteDoolittle } from '../utils/bioinformatics';

interface VisualizationsStudioProps {
  currentSequence: BiologicalSequence;
  stats: SequenceStats;
  restrictionSites: RestrictionSite[];
  orfs: OpenReadingFrame[];
  onProceedToStep: (step: number) => void;
}

export const VisualizationsStudio: React.FC<VisualizationsStudioProps> = ({
  currentSequence,
  stats,
  restrictionSites,
  orfs,
  onProceedToStep
}) => {
  const [windowSize, setWindowSize] = useState<number>(50);
  const [stepSize, setStepSize] = useState<number>(10);
  const [activeVisual, setActiveVisual] = useState<'gc-window' | 'gc-skew' | 'gel' | 'hydropathy'>('gc-window');
  const [hoveredPoint, setHoveredPoint] = useState<WindowDataPoint | null>(null);

  // Compute sliding window data points dynamically
  const windowData = useMemo(() => {
    return calculateSlidingWindow(currentSequence.rawSequence, windowSize, stepSize);
  }, [currentSequence.rawSequence, windowSize, stepSize]);

  // Compute protein hydropathy for longest ORF
  const longestOrf = orfs[0];
  const hydropathyData = useMemo(() => {
    if (!longestOrf || !longestOrf.proteinSequence) return [];
    return calculateKyteDoolittle(longestOrf.proteinSequence, 9);
  }, [longestOrf]);

  // SVG dimensions for charts
  const svgWidth = 800;
  const svgHeight = 280;
  const margin = { top: 20, right: 30, bottom: 40, left: 55 };
  const innerWidth = svgWidth - margin.left - margin.right;
  const innerHeight = svgHeight - margin.top - margin.bottom;

  // Max and Min values for GC Plot
  const maxPos = currentSequence.rawSequence.length || 1;

  return (
    <div className="space-y-6">
      {/* Milestone 4 Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
              <LineChart className="w-3.5 h-3.5" />
              <span>Milestone 4 — High-Resolution Data Visualization</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Visualize Biological Sequence Characteristics
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Visualizing nucleotide trends reveals biologically critical patterns that raw text obscures: isochore GC boundaries, replication origin shifts (GC skew), and protein hydrophobic domains.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 flex-wrap">
            <button
              onClick={() => setActiveVisual('gc-window')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeVisual === 'gc-window'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sliding-Window GC%
            </button>
            <button
              onClick={() => setActiveVisual('gc-skew')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeVisual === 'gc-skew'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              GC Skew (G-C)/(G+C)
            </button>
            <button
              onClick={() => setActiveVisual('gel')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeVisual === 'gel'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Virtual Agarose Gel
            </button>
            <button
              onClick={() => setActiveVisual('hydropathy')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeVisual === 'hydropathy'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Protein Hydropathy
            </button>
          </div>
        </div>

        {/* Chart View 1: Sliding Window GC Content */}
        {activeVisual === 'gc-window' && (
          <div className="mt-6 space-y-4">
            {/* Interactive Parameters Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-semibold text-slate-300">Window Size:</span>
                  <select
                    value={windowSize}
                    onChange={(e) => setWindowSize(Number(e.target.value))}
                    className="bg-slate-900 border border-slate-700 text-white rounded px-2 py-1 font-mono"
                  >
                    <option value={20}>20 bp (High sensitivity)</option>
                    <option value={50}>50 bp (Standard)</option>
                    <option value={100}>100 bp (Macro view)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-300">Step Size:</span>
                  <select
                    value={stepSize}
                    onChange={(e) => setStepSize(Number(e.target.value))}
                    className="bg-slate-900 border border-slate-700 text-white rounded px-2 py-1 font-mono"
                  >
                    <option value={5}>5 bp</option>
                    <option value={10}>10 bp</option>
                    <option value={25}>25 bp</option>
                  </select>
                </div>
              </div>

              <div className="text-slate-400 text-[11px] font-mono">
                {windowData.length} data points calculated across {currentSequence.rawSequence.length} bp
              </div>
            </div>

            {/* Interactive SVG Chart */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-x-auto">
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto select-none">
                <defs>
                  <linearGradient id="gcGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                <g transform={`translate(${margin.left}, ${margin.top})`}>
                  {/* Grid Lines & Y Axis Labels (0% to 100%) */}
                  {[0, 25, 50, 75, 100].map((val) => {
                    const y = innerHeight - (val / 100) * innerHeight;
                    return (
                      <g key={val}>
                        <line
                          x1={0}
                          y1={y}
                          x2={innerWidth}
                          y2={y}
                          stroke="#334155"
                          strokeDasharray={val === 50 ? 'none' : '2,3'}
                          strokeWidth={val === 50 ? 1 : 0.7}
                        />
                        <text
                          x={-8}
                          y={y + 3}
                          fill="#94a3b8"
                          fontSize="10"
                          textAnchor="end"
                          fontFamily="monospace"
                        >
                          {val}%
                        </text>
                      </g>
                    );
                  })}

                  {/* Mean GC Baseline */}
                  {(() => {
                    const meanY = innerHeight - (stats.gcPercent / 100) * innerHeight;
                    return (
                      <g>
                        <line
                          x1={0}
                          y1={meanY}
                          x2={innerWidth}
                          y2={meanY}
                          stroke="#f43f5e"
                          strokeWidth="1.5"
                          strokeDasharray="4,4"
                        />
                        <text
                          x={innerWidth - 5}
                          y={meanY - 5}
                          fill="#f43f5e"
                          fontSize="9"
                          textAnchor="end"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          Mean GC: {stats.gcPercent}%
                        </text>
                      </g>
                    );
                  })()}

                  {/* Area under curve */}
                  {windowData.length > 1 && (
                    <path
                      d={
                        windowData.reduce((acc, pt, i) => {
                          const x = (pt.position / maxPos) * innerWidth;
                          const y = innerHeight - (pt.gcContent / 100) * innerHeight;
                          return `${acc} ${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                        }, '') + ` L ${innerWidth} ${innerHeight} L 0 ${innerHeight} Z`
                      }
                      fill="url(#gcGradient)"
                    />
                  )}

                  {/* Line path */}
                  {windowData.length > 1 && (
                    <path
                      d={windowData.reduce((acc, pt, i) => {
                        const x = (pt.position / maxPos) * innerWidth;
                        const y = innerHeight - (pt.gcContent / 100) * innerHeight;
                        return `${acc} ${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                      }, '')}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.5"
                    />
                  )}

                  {/* Data points on hover */}
                  {windowData.map((pt, i) => {
                    const x = (pt.position / maxPos) * innerWidth;
                    const y = innerHeight - (pt.gcContent / 100) * innerHeight;
                    return (
                      <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r="3.5"
                        fill="#022c22"
                        stroke="#34d399"
                        strokeWidth="1.5"
                        className="hover:r-5 cursor-pointer transition-all"
                        onMouseEnter={() => setHoveredPoint(pt)}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                    );
                  })}

                  {/* X Axis Labels */}
                  {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
                    const x = pct * innerWidth;
                    const posLabel = Math.round(pct * maxPos);
                    return (
                      <g key={pct}>
                        <line x1={x} y1={innerHeight} x2={x} y2={innerHeight + 5} stroke="#64748b" />
                        <text
                          x={x}
                          y={innerHeight + 18}
                          fill="#94a3b8"
                          fontSize="10"
                          textAnchor="middle"
                          fontFamily="monospace"
                        >
                          {posLabel} bp
                        </text>
                      </g>
                    );
                  })}
                </g>
              </svg>

              {/* Tooltip display */}
              <div className="mt-3 flex items-center justify-between text-xs px-2 text-slate-400">
                <div>
                  {hoveredPoint ? (
                    <span className="font-mono text-emerald-400">
                      Midpoint: {hoveredPoint.position} bp | GC Content: {hoveredPoint.gcContent}% | Skew: {hoveredPoint.gcSkew}
                    </span>
                  ) : (
                    <span>Hover over any data point on the curve to inspect local coordinates.</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-[11px]">
                    <span className="w-3 h-0.5 bg-emerald-400 inline-block"></span> Local GC%
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px]">
                    <span className="w-3 h-0.5 bg-rose-400 border-b border-dashed inline-block"></span> Global Mean
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chart View 2: GC Skew Distribution */}
        {activeVisual === 'gc-skew' && (
          <div className="mt-6 space-y-4">
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400">
              <strong className="text-slate-200">GC Skew Formula:</strong>{' '}
              <code className="text-emerald-400 font-mono">(G - C) / (G + C)</code>. Values &gt; 0 indicate Guanine excess (characteristic of leading replication strand in bacteria like E. coli). Values &lt; 0 indicate Cytosine excess (lagging strand).
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto select-none">
                <g transform={`translate(${margin.left}, ${margin.top})`}>
                  {/* Grid Lines for -1.0, -0.5, 0.0, +0.5, +1.0 */}
                  {[-1, -0.5, 0, 0.5, 1].map((val) => {
                    const y = innerHeight / 2 - (val * (innerHeight / 2));
                    return (
                      <g key={val}>
                        <line
                          x1={0}
                          y1={y}
                          x2={innerWidth}
                          y2={y}
                          stroke={val === 0 ? '#475569' : '#1e293b'}
                          strokeWidth={val === 0 ? 1.5 : 0.8}
                        />
                        <text
                          x={-8}
                          y={y + 3}
                          fill="#94a3b8"
                          fontSize="10"
                          textAnchor="end"
                          fontFamily="monospace"
                        >
                          {val > 0 ? `+${val}` : val}
                        </text>
                      </g>
                    );
                  })}

                  {/* Skew bars or path */}
                  {windowData.map((pt, i) => {
                    const x = (pt.position / maxPos) * innerWidth;
                    const zeroY = innerHeight / 2;
                    const y = zeroY - (pt.gcSkew * (innerHeight / 2));
                    const isPositive = pt.gcSkew >= 0;

                    return (
                      <line
                        key={i}
                        x1={x}
                        y1={zeroY}
                        x2={x}
                        y2={y}
                        stroke={isPositive ? '#10b981' : '#f43f5e'}
                        strokeWidth="3"
                        strokeLinecap="round"
                        className="opacity-80 hover:opacity-100"
                      />
                    );
                  })}

                  {/* Zero line highlight */}
                  <line x1={0} y1={innerHeight / 2} x2={innerWidth} y2={innerHeight / 2} stroke="#38bdf8" strokeWidth="1" strokeDasharray="3,3" />
                </g>
              </svg>
              <div className="mt-3 flex items-center justify-between text-xs px-2 text-slate-400">
                <span className="text-emerald-400 font-semibold">+ Positive Skew: G rich</span>
                <span className="text-slate-400 font-mono">Center Baseline = 0.0</span>
                <span className="text-rose-400 font-semibold">- Negative Skew: C rich</span>
              </div>
            </div>
          </div>
        )}

        {/* Chart View 3: Virtual Agarose Gel Electrophoresis */}
        {activeVisual === 'gel' && (
          <div className="mt-6 space-y-4">
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
              <div>
                <strong className="text-emerald-400">Virtual Agarose Gel (1.2% TAE):</strong> Simulates restriction endonuclease digestion fragments. DNA fragments migrate toward positive anode based on logarithmic molecular weight.
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                UV Transilluminator Emulation
              </span>
            </div>

            {/* Simulated Gel Box */}
            <div className="bg-slate-950 border-2 border-slate-800 rounded-xl p-6 flex justify-center">
              <div className="w-full max-w-2xl bg-black rounded-lg p-5 border border-cyan-950/60 shadow-2xl relative">
                {/* Gel Loading Wells Header */}
                <div className="grid grid-cols-6 gap-2 text-center text-[11px] font-mono font-bold text-cyan-400 border-b border-cyan-900/40 pb-3 mb-4">
                  <div>1 kb Ladder</div>
                  <div>Uncut DNA</div>
                  <div>EcoRI</div>
                  <div>BamHI</div>
                  <div>HindIII</div>
                  <div>NotI</div>
                </div>

                {/* Simulated Migration Area */}
                <div className="relative h-80 bg-gradient-to-b from-slate-950 via-slate-900 to-black rounded border border-slate-800/80 p-2 overflow-hidden">
                  {/* Subtle agarose texture grid */}
                  <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

                  {/* 6 Lanes Grid */}
                  <div className="grid grid-cols-6 h-full gap-2 relative z-10">
                    {/* Lane 1: 1 kb Standard Ladder */}
                    <div className="relative h-full flex flex-col items-center">
                      {[10000, 8000, 6000, 5000, 4000, 3000, 2000, 1500, 1000, 750, 500, 250].map((bp) => {
                        // Logarithmic migration distance (smaller moves farther)
                        // Range 10000 to 250
                        const norm = 1 - (Math.log10(bp) - Math.log10(250)) / (Math.log10(10000) - Math.log10(250));
                        const topPct = 8 + norm * 82;
                        return (
                          <div
                            key={bp}
                            style={{ top: `${topPct}%` }}
                            className="absolute w-8 h-1 bg-cyan-300/80 rounded shadow-[0_0_8px_rgba(34,211,238,0.7)] group cursor-pointer"
                          >
                            <span className="hidden group-hover:block absolute left-9 -top-1.5 text-[9px] font-mono text-cyan-200 bg-slate-950 px-1 rounded z-20">
                              {bp} bp
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Lane 2: Uncut DNA Control */}
                    <div className="relative h-full flex flex-col items-center">
                      {(() => {
                        const len = currentSequence.rawSequence.length;
                        const clamped = Math.max(250, Math.min(10000, len));
                        const norm = 1 - (Math.log10(clamped) - Math.log10(250)) / (Math.log10(10000) - Math.log10(250));
                        const topPct = 8 + norm * 82;
                        return (
                          <div
                            style={{ top: `${topPct}%` }}
                            className="absolute w-9 h-1.5 bg-emerald-300 rounded shadow-[0_0_10px_rgba(52,211,153,0.9)] group cursor-pointer"
                          >
                            <span className="hidden group-hover:block absolute left-10 -top-1.5 text-[9px] font-mono text-emerald-200 bg-slate-950 px-1 rounded z-20">
                              {len} bp (Uncut)
                            </span>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Lanes 3-6: EcoRI, BamHI, HindIII, NotI */}
                    {['EcoRI', 'BamHI', 'HindIII', 'NotI'].map((enzName) => {
                      const siteData = restrictionSites.find((s) => s.enzyme === enzName);
                      const fragments = siteData?.fragmentSizes || [currentSequence.rawSequence.length];

                      return (
                        <div key={enzName} className="relative h-full flex flex-col items-center">
                          {fragments.map((frSize, fIdx) => {
                            const clamped = Math.max(250, Math.min(10000, frSize));
                            const norm = 1 - (Math.log10(clamped) - Math.log10(250)) / (Math.log10(10000) - Math.log10(250));
                            const topPct = 8 + norm * 82;

                            return (
                              <div
                                key={fIdx}
                                style={{ top: `${topPct}%` }}
                                className="absolute w-8 h-1 bg-cyan-200/90 rounded shadow-[0_0_8px_rgba(103,232,249,0.8)] group cursor-pointer"
                              >
                                <span className="hidden group-hover:block absolute left-9 -top-1.5 text-[9px] font-mono text-cyan-200 bg-slate-950 px-1 rounded z-20 whitespace-nowrap">
                                  {frSize} bp
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-3 pt-2 border-t border-slate-900">
                  <span>(-) Cathode (Top Wells)</span>
                  <span className="text-cyan-400">Direction of Electrophoresis ↓</span>
                  <span>(+) Anode (Bottom)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chart View 4: Protein Hydropathy */}
        {activeVisual === 'hydropathy' && (
          <div className="mt-6 space-y-4">
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300">
              <strong className="text-emerald-400">Kyte-Doolittle Hydropathy Profile:</strong> Computed for candidate translation of longest ORF ({longestOrf?.lengthCodons || 0} residues). Positive peaks (&gt; 1.6) suggest putative hydrophobic transmembrane segments; negative peaks represent hydrophilic water-soluble exterior loops.
            </div>

            {hydropathyData.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs bg-slate-950 rounded-xl border border-slate-800">
                No translated polypeptide available for this sequence.
              </div>
            ) : (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto select-none">
                  <g transform={`translate(${margin.left}, ${margin.top})`}>
                    {/* Kyte-Doolittle values range from -4.5 to +4.5 */}
                    {[-4, -2, 0, 2, 4].map((score) => {
                      // map -4.5 -> innerHeight, +4.5 -> 0
                      const y = innerHeight / 2 - (score / 4.5) * (innerHeight / 2);
                      return (
                        <g key={score}>
                          <line
                            x1={0}
                            y1={y}
                            x2={innerWidth}
                            y2={y}
                            stroke={score === 0 ? '#475569' : '#1e293b'}
                            strokeWidth={score === 0 ? 1.5 : 0.8}
                          />
                          <text
                            x={-8}
                            y={y + 3}
                            fill="#94a3b8"
                            fontSize="10"
                            textAnchor="end"
                            fontFamily="monospace"
                          >
                            {score > 0 ? `+${score}` : score}
                          </text>
                        </g>
                      );
                    })}

                    {/* Hydropathy line */}
                    {hydropathyData.length > 1 && (
                      <path
                        d={hydropathyData.reduce((acc, pt, i) => {
                          const x = (pt.residueIndex / hydropathyData.length) * innerWidth;
                          const y = innerHeight / 2 - (pt.score / 4.5) * (innerHeight / 2);
                          return `${acc} ${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                        }, '')}
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="2"
                      />
                    )}
                  </g>
                </svg>
                <div className="mt-3 flex items-center justify-between text-xs px-2 text-slate-400">
                  <span className="text-cyan-400 font-semibold">+ Hydrophobic (Transmembrane / Core)</span>
                  <span className="font-mono text-slate-400">Residue Count: {hydropathyData.length} aa</span>
                  <span className="text-emerald-400 font-semibold">- Hydrophilic (Surface exposed)</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Milestone Footer */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <p className="text-xs text-slate-400">
            ✅ <strong className="text-slate-200">Milestone 4 completed:</strong> High-resolution genomic profiles and virtual gel electrophoresis visualized.
          </p>

          <button
            onClick={() => onProceedToStep(5)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition shadow-md shadow-emerald-500/20"
          >
            <span>Proceed to Milestone 5 (Document & CV Builder)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
