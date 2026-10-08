import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  Star,
  Award,
  Sparkles,
  Download,
  Github,
  CheckCircle2,
  ChevronRight,
  FlaskConical,
  Binary,
  Layers
} from 'lucide-react';
import { BiologicalSequence, SequenceStats } from '../types/biology';

interface CVProjectBuilderProps {
  currentSequence: BiologicalSequence;
  stats: SequenceStats;
}

export const CVProjectBuilder: React.FC<CVProjectBuilderProps> = ({
  currentSequence,
  stats
}) => {
  const [bulletStyle, setBulletStyle] = useState<'recommended' | 'impact' | 'academic' | 'comprehensive'>('recommended');
  const [copiedCv, setCopiedCv] = useState(false);
  const [copiedReadme, setCopiedReadme] = useState(false);
  const [activeTab, setActiveTab] = useState<'cv' | 'github' | 'strategy'>('cv');

  // Strategic 2-Project CV Text
  const wetLabProject = {
    title: 'Microbiological Study of Bacterial Growth',
    role: 'Laboratory Research Project',
    organization: 'Department of Biotechnology / Microbiology',
    date: 'Academic Term Project',
    bullets: [
      'Investigated bacterial growth kinetics (Escherichia coli) under controlled culture conditions, recording optical density (OD600) via UV-Vis spectrophotometry.',
      'Constructed empirical growth curves, calculating bacterial specific growth rates (μ) and generation doubling times across lag, exponential, and stationary phases.',
      'Maintained strict aseptic laboratory techniques, autoclave sterilization, and serial dilution plating for viable colony count enumeration.'
    ]
  };

  const getCompBioBullets = () => {
    switch (bulletStyle) {
      case 'recommended':
        return [
          'Engineered an independent Python computational biology workflow to analyze public DNA/RNA sequence data (NCBI GenBank) without external library dependencies.',
          'Computed base compositions, thermodynamic melting temperatures (Tm), and sliding-window GC content skew to detect strand replication asymmetries.',
          'Automated 6-frame Open Reading Frame (ORF) scanning and restriction endonuclease cleavage site mapping, generating visual genomic profiles using Matplotlib.',
          'Demonstrated a self-driven transition from bench microbiology to quantitative computational genomics and data analysis.'
        ];
      case 'impact':
        return [
          'Developed end-to-end Python pipeline processing multi-kilobase biological sequences, reducing manual sequence inspection time by 100%.',
          'Calculated nucleotide distributions, GC% isochores, and CpG observed/expected ratios with mathematical accuracy to model genomic thermal stability.',
          'Implemented custom sliding-window algorithms and visualized sequence metrics through publication-ready multi-panel plots.',
          'Bridged wet-lab microbiology insights with dry-lab algorithmic sequence pattern detection.'
        ];
      case 'academic':
        return [
          'Conducted in silico sequence analysis on diverse genetic loci (including viral and bacterial genomes) using Python 3 data structures.',
          'Formulated algorithms for Wallace and Marmur-Doty thermodynamic melting temperature estimations and sequence reverse complementation.',
          'Mapped functional coding regions across all 6 reading frames using canonical start/stop codon matrices and modeled restriction fragment lengths.',
          'Documented methodology, algorithmic constraints, and biological interpretations in an open-source research notebook.'
        ];
      case 'comprehensive':
      default:
        return [
          'Used basic Python programming to analyze biological sequence data and visualize sequence characteristics.',
          'Developed introductory experience in computational approaches to biological data analysis.',
          'Calculated nucleotide composition, GC content, and identified simple sequence patterns (ORFs and restriction sites).',
          'Visualized results using Python plotting libraries and documented methodology for reproducible research.'
        ];
    }
  };

  const compBioBullets = getCompBioBullets();

  // Full CV Markdown text
  const fullCvText = `ACADEMIC & RESEARCH PROJECTS

Microbiological Study of Bacterial Growth
${wetLabProject.organization} | ${wetLabProject.date}
• ${wetLabProject.bullets[0]}
• ${wetLabProject.bullets[1]}
• ${wetLabProject.bullets[2]}

Independent Computational Biology Project — Biological Sequence Analysis
Python Sequence Analysis & Genomic Profiling | 2026
• ${compBioBullets.join('\n• ')}
Technical Skills Utilized: Python, Biological Sequence Analysis, Biopython, Matplotlib, Data Visualization, NCBI GenBank, Genomic Statistics.`;

  // GitHub README generator text
  const gitHubReadmeText = `# Analysis of Biological Sequence Data Using Python

![Python Version](https://img.shields.io/badge/python-3.8+-blue.svg)
![Topic](https://img.shields.io/badge/bioinformatics-sequence--analysis-emerald.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

An independent computational biology project analyzing public biological sequence data using Python. Designed to demonstrate the transition from wet-lab microbiology to quantitative computational biology and bioinformatics.

## 🔬 Project Overview
This repository contains a modular Python pipeline that:
1. **Acquires and validates** publicly available sequence data (e.g., *HBB*, SARS-CoV-2 *S*, *E. coli* *lacZ*) from NCBI GenBank.
2. **Computes nucleotide statistics**: Base counts (A, T, G, C), GC content %, AT/GC ratio, and thermodynamic melting temperature ($T_m$).
3. **Discovers sequence patterns**: Identifies Open Reading Frames (ORFs) across 6 reading frames and maps restriction enzyme cleavage sites (EcoRI, BamHI, HindIII).
4. **Visualizes sequence architecture**: Generates sliding-window GC% distributions, GC skew profiles, and simulated agarose gel electrophoresis.
5. **Documents findings**: Provides structured reports and Jupyter notebooks for reproducible research.

## 📊 Sample Results (Target: ${currentSequence.name})
- **Accession:** ${currentSequence.accession} (${currentSequence.organism})
- **Sequence Length:** ${stats.length} bp
- **GC Content:** ${stats.gcPercent}% (${stats.counts.G + stats.counts.C} / ${stats.length} nt)
- **Melting Temperature:** ${stats.meltingTempSantaLucia} °C
- **CpG Obs/Exp Ratio:** ${stats.cpgObservedToExpected}

## 🚀 Quickstart
\`\`\`bash
# Clone the repository
git clone https://github.com/your-username/bio-sequence-analysis-python.git
cd bio-sequence-analysis-python

# Run standalone analysis (pure Python 3, zero dependencies)
python analysis.py

# Optional: Run visualization suite
pip install biopython matplotlib pandas
python plot_visuals.py
\`\`\`

## 📚 Project Structure
\`\`\`text
├── analysis.py            # Standalone zero-dependency Python script
├── plot_visuals.py        # Matplotlib visualization suite
├── sequence_analysis.ipynb # Interactive Google Colab notebook
├── sample_data/           # FASTA sequence files
└── README.md              # Project documentation
\`\`\`

## 👤 Author
Computational Biology / Biotechnology Student Candidate
`;

  const handleCopyCv = () => {
    navigator.clipboard.writeText(fullCvText);
    setCopiedCv(true);
    setTimeout(() => setCopiedCv(false), 2000);
  };

  const handleCopyReadme = () => {
    navigator.clipboard.writeText(gitHubReadmeText);
    setCopiedReadme(true);
    setTimeout(() => setCopiedReadme(false), 2000);
  };

  const handleDownloadReadme = () => {
    const blob = new Blob([gitHubReadmeText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* CV Suite Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>Internship Application & CV Suite</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Polished 2-Project CV Entry & Portfolio
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Don’t overcrowd your resume with 4–5 unrelated college assignments. Reviewers love two complementary, high-depth projects: one showing rigorous laboratory fundamentals and one showing self-driven computational capability.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('cv')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'cv' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Resume Project Preview
            </button>
            <button
              onClick={() => setActiveTab('github')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'github' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
              }`}
            >
              GitHub README
            </button>
            <button
              onClick={() => setActiveTab('strategy')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'strategy' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Why This Works
            </button>
          </div>
        </div>

        {/* Tab 1: Live CV Project Section */}
        {activeTab === 'cv' && (
          <div className="mt-6 space-y-6">
            {/* Style Selector */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <span className="font-semibold text-slate-300">Choose Bullet Point Tone:</span>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setBulletStyle('recommended')}
                  className={`px-2.5 py-1 rounded text-xs transition ${
                    bulletStyle === 'recommended'
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  ⭐ Recommended (Strong Transition)
                </button>
                <button
                  onClick={() => setBulletStyle('impact')}
                  className={`px-2.5 py-1 rounded text-xs transition ${
                    bulletStyle === 'impact'
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  Metrics & Impact
                </button>
                <button
                  onClick={() => setBulletStyle('academic')}
                  className={`px-2.5 py-1 rounded text-xs transition ${
                    bulletStyle === 'academic'
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  Academic / Research
                </button>
                <button
                  onClick={() => setBulletStyle('comprehensive')}
                  className={`px-2.5 py-1 rounded text-xs transition ${
                    bulletStyle === 'comprehensive'
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  Original Prompt Phrasing
                </button>
              </div>

              <button
                onClick={handleCopyCv}
                className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-semibold border border-slate-700 transition"
              >
                {copiedCv ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCv ? 'Copied CV Section' : 'Copy Formatted Text'}</span>
              </button>
            </div>

            {/* Document Mockup View */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 sm:p-8 font-sans shadow-xl text-slate-200">
              <div className="border-b-2 border-slate-700 pb-2 mb-6">
                <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-white">
                  Academic & Technical Projects
                </h2>
              </div>

              {/* Project 1: Wet Lab Microbiology */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-emerald-400" />
                    <span>{wetLabProject.title}</span>
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">{wetLabProject.date}</span>
                </div>
                <p className="text-xs text-slate-400 italic mt-0.5">{wetLabProject.organization}</p>
                <ul className="mt-2.5 space-y-1.5 text-xs text-slate-300 leading-relaxed list-disc list-outside pl-4">
                  {wetLabProject.bullets.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
                <div className="mt-2 text-[11px] text-slate-400 font-mono">
                  <span className="font-semibold text-slate-300">Laboratory Competencies:</span> Aseptic Culture, Spectrophotometry (OD600), Growth Kinetics, Serial Dilution Plating.
                </div>
              </div>

              <hr className="border-slate-800 my-5" />

              {/* Project 2: Computational Sequence Analysis */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                    <Binary className="w-4 h-4 text-cyan-400" />
                    <span>Independent Computational Biology Project — Biological Sequence Analysis</span>
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">2026</span>
                </div>
                <p className="text-xs text-slate-400 italic mt-0.5">
                  Python Programming & Computational Sequence Profiling
                </p>
                <ul className="mt-2.5 space-y-1.5 text-xs text-slate-300 leading-relaxed list-disc list-outside pl-4">
                  {compBioBullets.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
                <div className="mt-2 text-[11px] text-slate-400 font-mono">
                  <span className="font-semibold text-slate-300">Computational Competencies:</span> Python 3, Biological Sequence Analysis, Biopython, Matplotlib, NCBI GenBank, GC Skew Profiling.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: GitHub README Generator */}
        {activeTab === 'github' && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Github className="w-4 h-4 text-white" />
                <span>Publish this to GitHub to give reviewers a clickable repository link!</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadReadme}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download README.md</span>
                </button>
                <button
                  onClick={handleCopyReadme}
                  className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded text-xs font-bold transition flex items-center gap-1.5"
                >
                  {copiedReadme ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedReadme ? 'Copied' : 'Copy Markdown'}</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 max-h-96 overflow-y-auto scrollbar-thin">
              <pre className="whitespace-pre-wrap">{gitHubReadmeText}</pre>
            </div>
          </div>
        )}

        {/* Tab 3: Strategic Rationale */}
        {activeTab === 'strategy' && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Why 2 Curated Projects Beat 5 Random Ones</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Hiring managers and principal investigators evaluate dozens of student applications. A resume filled with five minor classroom projects looks scattered.
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                By presenting exactly <strong>two focused, complementary projects</strong>:
              </p>
              <ul className="text-xs text-slate-400 space-y-2 list-disc list-outside pl-4">
                <li>
                  <strong className="text-white">Project 1 proves wet-lab competence:</strong> You know aseptic handling, microbial culturing, spectrophotometry, and physical experimentation.
                </li>
                <li>
                  <strong className="text-white">Project 2 proves self-directed transition:</strong> You didn't just wait for a coding course—you took initiative to write Python code analyzing biological sequence data.
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>Tailored for Bioinformatics Internships</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Most biology students only have wet-lab experience and lack programming confidence. Most pure computer science students lack biological intuition and don't understand codons or microbial kinetics.
              </p>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs text-emerald-300">
                ⭐ <strong>Your Sweet Spot:</strong> You possess both biological intuition AND the programming initiative required for modern computational biology.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
