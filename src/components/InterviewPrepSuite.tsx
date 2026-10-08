import React, { useState } from 'react';
import {
  HelpCircle,
  MessageSquare,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  CheckCircle2,
  BookOpen,
  Volume2
} from 'lucide-react';

interface QuestionCard {
  id: string;
  category: 'computational' | 'biological' | 'behavioral';
  question: string;
  difficulty: 'Beginner' | 'Intermediate';
  quickSummary: string;
  modelAnswer: string;
  keyPhrases: string[];
}

const INTERVIEW_QUESTIONS: QuestionCard[] = [
  {
    id: 'q1',
    category: 'behavioral',
    question: '“Tell me about your research background and how you got into computational biology.”',
    difficulty: 'Beginner',
    quickSummary: 'Frame your journey as a deliberate transition from bench microbiology to quantitative sequence analysis.',
    modelAnswer:
      '“My foundation began in the wet laboratory with a microbiological study of bacterial growth, where I cultured E. coli and quantified growth kinetics using spectrophotometry. While I enjoyed bench experimentation, I realized modern biology generates massive sequence datasets that require computational skill. To bridge this gap, I spearheaded an independent project analyzing biological sequence data with Python. I wrote algorithms to calculate nucleotide composition, model GC skew, and detect Open Reading Frames. This combination gives me both wet-lab biological intuition and dry-lab programming capabilities.”',
    keyPhrases: [
      'Bacterial growth kinetics (OD600)',
      'Independent initiative',
      'Bridging wet-lab with dry-lab',
      'Python data structures'
    ]
  },
  {
    id: 'q2',
    category: 'biological',
    question: '“Why is GC content important biologically, and what did your analysis reveal?”',
    difficulty: 'Beginner',
    quickSummary: 'Explain triple hydrogen bonds, thermal stability, and genome adaptation.',
    modelAnswer:
      '“Guanine and Cytosine pair with three hydrogen bonds compared to two in Adenine and Thymine, which directly increases the thermal denaturation melting temperature (Tm) of DNA. In our analysis, we observe that extreme thermophiles (like Thermus thermophilus) have GC contents exceeding 65% to survive elevated temperatures, whereas parasites or viral genomes often exhibit pronounced AT bias. Additionally, local GC fluctuations (isochores) and CpG island densities correlate strongly with eukaryotic promoter regions and epigenetic gene regulation.”',
    keyPhrases: [
      '3 hydrogen bonds vs 2',
      'Thermal denaturation (Tm)',
      'Thermophilic adaptation',
      'CpG islands & promoter architecture'
    ]
  },
  {
    id: 'q3',
    category: 'computational',
    question: '“How did you implement the sliding-window analysis in Python?”',
    difficulty: 'Intermediate',
    quickSummary: 'Explain window size, step size iteration, and time complexity.',
    modelAnswer:
      '“I implemented a sliding-window algorithm taking window_size and step_size as parameters. In pure Python, I sliced sub-strings `seq[i : i + window_size]` with a step increment. For each window, I counted G and C nucleotides to calculate both local GC percentage and strand GC skew using the normalized formula (G - C)/(G + C). This transforms a static 1D sequence string into a continuous spatial signal that reveals local compositional transitions.”',
    keyPhrases: [
      'Sub-string slicing window_size / step_size',
      'Normalized skew formula (G-C)/(G+C)',
      'Continuous spatial signal'
    ]
  },
  {
    id: 'q4',
    category: 'biological',
    question: '“What is the biological meaning of GC skew in bacterial genomes?”',
    difficulty: 'Intermediate',
    quickSummary: 'Explain replication strand asymmetry between leading and lagging strands.',
    modelAnswer:
      '“In bacteria with circular chromosomes, DNA replication is bidirectional starting from the origin of replication (OriC) to the terminus (Ter). The leading strand remains single-stranded for shorter periods than the lagging strand, exposing it to different spontaneous deamination rates (like Cytosine deamination to Uracil). Consequently, the leading strand accumulates an excess of Guanine over Cytosine. When you plot cumulative GC skew, the global minimum points to the replication origin OriC and the maximum points to Ter!”',
    keyPhrases: [
      'OriC and Ter replication forks',
      'Leading vs lagging strand asymmetry',
      'Spontaneous cytosine deamination',
      'Cumulative skew inflection points'
    ]
  },
  {
    id: 'q5',
    category: 'computational',
    question: '“Why did you choose to build your own Python scripts rather than just using web tools like NCBI BLAST?”',
    difficulty: 'Beginner',
    quickSummary: 'Demonstrates deep fundamental understanding over black-box button clicking.',
    modelAnswer:
      '“Online web tools are useful, but using them is passive. By building the scripts in Python from scratch, I gained a deep, hands-on understanding of how biological strings are parsed, how 6-frame translations are computed, and how edge cases (like degenerate IUPAC nucleotides or alternative start codons) affect results. Furthermore, writing custom scripts allows scalable batch processing and custom pipeline automation that cannot be done manually on web servers.”',
    keyPhrases: [
      'De-mystified algorithms',
      'Automated batch workflows',
      'Handling biological edge cases'
    ]
  }
];

export const InterviewPrepSuite: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string>('q1');
  const [filter, setFilter] = useState<'all' | 'behavioral' | 'biological' | 'computational'>('all');

  const filteredQuestions = INTERVIEW_QUESTIONS.filter(
    (q) => filter === 'all' || q.category === filter
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Interview Defense & Technical Mastery</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Defend Your Project With 100% Genuine Confidence
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              When an interviewer sees “Biological Sequence Analysis Using Python” on your CV, they will test your real understanding. Review these high-scoring model answers and technical talking points.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                filter === 'all' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Questions
            </button>
            <button
              onClick={() => setFilter('behavioral')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                filter === 'behavioral' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              The Pitch (Behavioral)
            </button>
            <button
              onClick={() => setFilter('biological')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                filter === 'biological' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Biological Concepts
            </button>
            <button
              onClick={() => setFilter('computational')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                filter === 'computational' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Python / Algorithms
            </button>
          </div>
        </div>

        {/* 60-Second Elevator Pitch Box */}
        <div className="mt-6 p-5 rounded-xl bg-slate-950 border border-emerald-500/30 relative overflow-hidden">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-2">
            <Sparkles className="w-4 h-4" />
            <span>The 60-Second Elevator Pitch (Memorize This Core Arc)</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
            “I have hands-on experience in both traditional wet-lab microbiology and modern computational sequence analysis. In the lab, I’ve cultured bacteria and modeled growth kinetics using spectrophotometry. Concurrently, I built an independent Python pipeline to analyze genomic sequences from NCBI, calculating thermodynamic GC profiles, sliding-window skews, and Open Reading Frames. I’m applying for this internship because I want to apply both my biological intuition and quantitative Python skills to real-world research.”
          </p>
        </div>

        {/* Questions Accordion List */}
        <div className="mt-6 space-y-3">
          {filteredQuestions.map((q) => {
            const isExpanded = expandedId === q.id;

            return (
              <div
                key={q.id}
                className="bg-slate-950/80 border border-slate-800 rounded-xl overflow-hidden transition"
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? '' : q.id)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-900/60 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {q.category}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {q.difficulty}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white">{q.question}</h3>
                    <p className="text-xs text-slate-400">{q.quickSummary}</p>
                  </div>

                  <div className="shrink-0 p-1.5 rounded-lg bg-slate-800 text-slate-300">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 space-y-4 text-xs">
                    <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                      <span className="font-bold text-emerald-400 text-xs block mb-1.5 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Recommended Model Answer:</span>
                      </span>
                      <p className="text-slate-200 leading-relaxed text-xs sm:text-sm">
                        {q.modelAnswer}
                      </p>
                    </div>

                    <div>
                      <span className="font-semibold text-slate-300 text-xs block mb-2">
                        🔑 High-Scoring Key Terminology to Mention:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {q.keyPhrases.map((phrase, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-md bg-slate-900 text-cyan-300 border border-slate-700 font-mono text-[11px]"
                          >
                            ✓ {phrase}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
