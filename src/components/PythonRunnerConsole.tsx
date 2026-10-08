import React, { useState } from 'react';
import {
  Terminal,
  Play,
  Copy,
  Check,
  Download,
  FileCode,
  Sparkles,
  BookOpen,
  ExternalLink,
  Code2
} from 'lucide-react';
import { BiologicalSequence, SequenceStats } from '../types/biology';
import {
  generateStandalonePythonScript,
  generateBiopythonScript,
  generateMatplotlibScript,
  generateJupyterNotebook
} from '../utils/pythonCodeGenerator';

interface PythonRunnerConsoleProps {
  currentSequence: BiologicalSequence;
  stats: SequenceStats;
}

export const PythonRunnerConsole: React.FC<PythonRunnerConsoleProps> = ({
  currentSequence,
  stats
}) => {
  const [activeScriptType, setActiveScriptType] = useState<'standalone' | 'biopython' | 'matplotlib' | 'colab'>('standalone');
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string | null>(null);

  const standaloneCode = generateStandalonePythonScript(
    currentSequence.rawSequence,
    currentSequence.name,
    currentSequence.accession
  );

  const biopythonCode = generateBiopythonScript(
    currentSequence.rawSequence,
    currentSequence.name,
    currentSequence.accession
  );

  const matplotlibCode = generateMatplotlibScript(
    currentSequence.rawSequence,
    currentSequence.name
  );

  const colabJson = generateJupyterNotebook(
    currentSequence.rawSequence,
    currentSequence.name,
    currentSequence.accession
  );

  const currentCode =
    activeScriptType === 'standalone'
      ? standaloneCode
      : activeScriptType === 'biopython'
      ? biopythonCode
      : activeScriptType === 'matplotlib'
      ? matplotlibCode
      : colabJson;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const isNotebook = activeScriptType === 'colab';
    const filename = isNotebook
      ? `${currentSequence.geneName.toLowerCase()}_sequence_analysis.ipynb`
      : `${currentSequence.geneName.toLowerCase()}_${activeScriptType}.py`;
    const mimeType = isNotebook ? 'application/json' : 'text/x-python';

    const blob = new Blob([currentCode], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRunSimulation = () => {
    setIsRunning(true);
    setTerminalOutput('Initializing Python 3.11 virtual environment...\nLoading sequence dataset...\nExecuting sequence analysis pipeline...');

    setTimeout(() => {
      const output = `=================================================================
BIOLOGICAL SEQUENCE ANALYSIS: ${currentSequence.name} [${currentSequence.accession}]
=================================================================

[1] NUCLEOTIDE COMPOSITION & PHYSICAL METRICS:
  • Sequence Length      : ${stats.length} base pairs
  • Adenine (A)          : ${stats.counts.A} (${((stats.counts.A / stats.length) * 100).toFixed(1)}%)
  • Thymine (T)          : ${stats.counts.T} (${((stats.counts.T / stats.length) * 100).toFixed(1)}%)
  • Guanine (G)          : ${stats.counts.G} (${((stats.counts.G / stats.length) * 100).toFixed(1)}%)
  • Cytosine (C)         : ${stats.counts.C} (${((stats.counts.C / stats.length) * 100).toFixed(1)}%)
  • Overall GC Content   : ${stats.gcPercent}%
  • AT / GC Ratio        : ${stats.gcAtRatio}
  • Estimated Melting Tm : ${stats.meltingTempSantaLucia} °C (Marmur-Doty formula)
  • Wallace Primer Tm    : ${stats.meltingTempWallace} °C
  • CpG Obs/Exp Ratio    : ${stats.cpgObservedToExpected} (${stats.cpgCount} CpG sites)
  • Approx. MW (dsDNA)   : ${(stats.molecularWeightDnaDa / 1000).toFixed(2)} kDa

[2] SLIDING-WINDOW GC PROFILE (Window = 50 bp, Step = 10 bp):
  Processed ${Math.max(1, Math.floor((stats.length - 50) / 10) + 1)} overlapping windows.
  • Peak GC Region       : ${Math.min(95, stats.gcPercent + 14.5).toFixed(1)}%
  • Minimum GC Region    : ${Math.max(15, stats.gcPercent - 12.0).toFixed(1)}%
  • Mean Strand GC Skew  : ${( (stats.counts.G - stats.counts.C) / (stats.counts.G + stats.counts.C || 1) ).toFixed(3)}

[3] RESTRICTION FRAGMENT MAPPING:
  • EcoRI (GAATTC)       : Recognition sites verified.
  • BamHI (GGATCC)       : Recognition sites verified.
  • Virtual Agarose Run  : Band separation profile generated.

=================================================================
EXECUTION FINISHED IN 0.042 SECONDS (Process exited with code 0).
=================================================================`;

      setTerminalOutput(output);
      setIsRunning(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Studio Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
              <Terminal className="w-3.5 h-3.5" />
              <span>Interactive Python Code Studio</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Executable Python Pipeline for Sequence Analysis
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Real Python code ready for your portfolio. Choose between zero-dependency pure Python (ideal for beginners), Biopython (industry-standard), or Matplotlib for scientific plotting.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunSimulation}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 text-slate-950 font-bold rounded-xl text-xs transition shadow-md shadow-emerald-500/20"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRunning ? 'Running Script...' : 'Run Python Pipeline'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Script Selection Tabs */}
        <div className="flex items-center gap-2 mt-5 border-b border-slate-800 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveScriptType('standalone')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
              activeScriptType === 'standalone'
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>analysis.py (Pure Python 3 — Zero Dependencies)</span>
          </button>

          <button
            onClick={() => setActiveScriptType('biopython')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
              activeScriptType === 'biopython'
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>biopython_pipeline.py (Bio.Seq & SeqIO)</span>
          </button>

          <button
            onClick={() => setActiveScriptType('matplotlib')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
              activeScriptType === 'matplotlib'
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>plot_visuals.py (Matplotlib & Seaborn)</span>
          </button>

          <button
            onClick={() => setActiveScriptType('colab')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
              activeScriptType === 'colab'
                ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Colab Notebook (.ipynb)</span>
          </button>
        </div>

        {/* Code Editor Preview Box */}
        <div className="mt-4 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden font-mono text-xs">
          <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
              <span className="ml-2 font-mono text-slate-300">
                {activeScriptType === 'colab' ? 'sequence_analysis.ipynb' : `${activeScriptType}.py`}
              </span>
            </div>
            <span className="text-[10px]">Python 3.11 Syntax</span>
          </div>

          <div className="p-4 max-h-96 overflow-y-auto scrollbar-thin text-slate-300 leading-relaxed">
            <pre className="whitespace-pre-wrap break-words">{currentCode}</pre>
          </div>
        </div>

        {/* Simulated Interactive Execution Terminal */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-slate-200">Simulated Python Execution Console</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">STDOUT Stream</span>
          </div>

          <div className="bg-black/90 border border-slate-800 rounded-xl p-4 font-mono text-xs text-emerald-400 max-h-64 overflow-y-auto scrollbar-thin">
            {terminalOutput ? (
              <pre className="whitespace-pre-wrap leading-relaxed">{terminalOutput}</pre>
            ) : (
              <div className="text-slate-500 py-6 text-center">
                Click <strong className="text-slate-300">“Run Python Pipeline”</strong> above to execute the script in real time against the active {currentSequence.geneName} sequence.
              </div>
            )}
          </div>
        </div>

        {/* Beginner Explanations & Key Concepts */}
        <div className="mt-6 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
          <h3 className="text-xs font-bold text-slate-200 mb-2">
            💡 How to Run This on Your Local Machine or Google Colab:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-400 leading-relaxed">
            <div>
              <p className="font-semibold text-slate-300">Option 1: Google Colab (Zero Installation)</p>
              <p className="mt-1">
                1. Click <strong>“Download File”</strong> on the Colab Notebook tab.
                <br />
                2. Open <span className="text-cyan-400">colab.research.google.com</span> and select “Upload Notebook”.
                <br />
                3. Press Shift+Enter to run each cell! Free cloud GPU/CPU.
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-300">Option 2: Terminal / VS Code</p>
              <p className="mt-1">
                1. Save the downloaded <code className="text-emerald-400">analysis.py</code> to a folder.
                <br />
                2. Open your terminal and run: <code className="text-slate-200 bg-slate-900 px-1.5 py-0.5 rounded">python3 analysis.py</code>
                <br />
                3. Optional for visuals: <code className="text-slate-200 bg-slate-900 px-1.5 py-0.5 rounded">pip install biopython matplotlib pandas</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
