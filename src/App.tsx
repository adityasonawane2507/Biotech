import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { MilestoneStepper } from './components/MilestoneStepper';
import { SequenceInputSection } from './components/SequenceInputSection';
import { CompositionAnalysis } from './components/CompositionAnalysis';
import { MotifsAndOrfViewer } from './components/MotifsAndOrfViewer';
import { VisualizationsStudio } from './components/VisualizationsStudio';
import { PythonRunnerConsole } from './components/PythonRunnerConsole';
import { CVProjectBuilder } from './components/CVProjectBuilder';
import { InterviewPrepSuite } from './components/InterviewPrepSuite';
import { ReportExportModal } from './components/ReportExportModal';
import { SAMPLE_SEQUENCES } from './data/sampleSequences';
import { BiologicalSequence } from './types/biology';
import {
  calculateSequenceStats,
  findOpenReadingFrames,
  simulateRestrictionDigests,
  searchRegulatoryMotifs,
  sanitizeSequence
} from './utils/bioinformatics';
import {
  FileText,
  Sparkles,
  Award,
  Terminal,
  Dna,
  ArrowRight,
  FlaskConical,
  GraduationCap
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'laboratory' | 'python' | 'visuals' | 'cv' | 'interview'>('laboratory');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedSeqId, setSelectedSeqId] = useState<string>('hbb-human');
  const [sequences, setSequences] = useState<BiologicalSequence[]>(SAMPLE_SEQUENCES);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Active sequence object
  const currentSequence = useMemo(() => {
    return sequences.find((s) => s.id === selectedSeqId) || sequences[0];
  }, [sequences, selectedSeqId]);

  // Cleaned sequence string
  const cleanSeq = useMemo(() => {
    return sanitizeSequence(currentSequence.rawSequence).cleanSeq;
  }, [currentSequence.rawSequence]);

  // Bioinformatics calculations
  const stats = useMemo(() => {
    return calculateSequenceStats(cleanSeq);
  }, [cleanSeq]);

  const orfs = useMemo(() => {
    return findOpenReadingFrames(cleanSeq, 20);
  }, [cleanSeq]);

  const restrictionSites = useMemo(() => {
    return simulateRestrictionDigests(cleanSeq);
  }, [cleanSeq]);

  const motifs = useMemo(() => {
    return searchRegulatoryMotifs(cleanSeq);
  }, [cleanSeq]);

  // Handler for custom sequence injection
  const handleUpdateCustomSequence = (
    name: string,
    organism: string,
    accession: string,
    raw: string
  ) => {
    const { cleanSeq: cleaned } = sanitizeSequence(raw);
    const customSeqObj: BiologicalSequence = {
      id: `custom-${Date.now()}`,
      name,
      geneName: name.split(' ')[0] || 'customGene',
      organism: organism || 'Unknown Organism',
      accession: accession || 'CUSTOM',
      type: 'DNA',
      category: 'biotechnology',
      description: 'User-provided custom nucleotide sequence dataset.',
      biologicalSignificance: 'Custom biological input evaluated through computational sequence analysis algorithms.',
      rawSequence: cleaned
    };

    setSequences((prev) => [customSeqObj, ...prev]);
    setSelectedSeqId(customSeqObj.id);
  };

  const handleSelectSequence = (id: string) => {
    if (id === 'custom') {
      setCurrentStep(1);
      setActiveTab('laboratory');
      return;
    }
    setSelectedSeqId(id);
  };

  const handleSelectSample = (seq: BiologicalSequence) => {
    setSelectedSeqId(seq.id);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sequences={sequences}
        selectedSeqId={selectedSeqId}
        onSelectSequence={handleSelectSequence}
        onOpenReportModal={() => setIsReportModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* CV Strategic Recommendation Banner */}
        <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-cyan-950/60 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Internship Strategy Recommendation
                </span>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                  2 Strong Projects
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 mt-0.5 font-medium leading-relaxed">
                Combine your <strong className="text-white">Microbiological Study of Bacterial Growth</strong> (wet-lab) with this <strong className="text-emerald-300">Biological Sequence Analysis Using Python</strong> (dry-lab) for a compelling, transition-ready application!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
            <button
              onClick={() => setActiveTab('cv')}
              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
            >
              <Award className="w-3.5 h-3.5" />
              <span>View CV Entry</span>
            </button>
            <button
              onClick={() => setActiveTab('interview')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition border border-slate-700"
            >
              Interview Prep
            </button>
          </div>
        </div>

        {/* Tab 1: Laboratory Mode (Step-by-Step Milestones) */}
        {activeTab === 'laboratory' && (
          <div className="space-y-6">
            <MilestoneStepper currentStep={currentStep} onSelectStep={(step) => setCurrentStep(step)} />

            {currentStep === 1 && (
              <SequenceInputSection
                currentSequence={currentSequence}
                onSelectSample={handleSelectSample}
                onUpdateCustomSequence={handleUpdateCustomSequence}
                onProceedToStep={(step) => setCurrentStep(step)}
              />
            )}

            {currentStep === 2 && (
              <CompositionAnalysis
                currentSequence={currentSequence}
                stats={stats}
                onProceedToStep={(step) => setCurrentStep(step)}
              />
            )}

            {currentStep === 3 && (
              <MotifsAndOrfViewer
                currentSequence={currentSequence}
                orfs={orfs}
                restrictionSites={restrictionSites}
                motifs={motifs}
                onProceedToStep={(step) => setCurrentStep(step)}
              />
            )}

            {currentStep === 4 && (
              <VisualizationsStudio
                currentSequence={currentSequence}
                stats={stats}
                restrictionSites={restrictionSites}
                orfs={orfs}
                onProceedToStep={(step) => setCurrentStep(step)}
              />
            )}

            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
                        <Award className="w-3.5 h-3.5" />
                        <span>Milestone 5 — Project Synthesis & Documentation</span>
                      </div>
                      <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        Methodology, Findings & Internship Portfolio
                      </h1>
                      <p className="text-sm text-slate-400 mt-1 max-w-3xl">
                        Synthesize your computational findings into academic project documentation and polish your CV entry to showcase your transition toward computational biology.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsReportModalOpen(true)}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Open Academic Report</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                        <Terminal className="w-4 h-4" />
                        <span>Interactive Python Code Ready</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Your analysis pipeline is encoded in clean, standard Python 3. You can execute it directly or run it on Google Colab with one click.
                      </p>
                      <button
                        onClick={() => setActiveTab('python')}
                        className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 mt-2"
                      >
                        <span>Open Python Studio</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                      <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                        <FileText className="w-4 h-4" />
                        <span>CV Entry & GitHub Repository</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Generate tailored CV bullet points and a publication-ready GitHub README to give recruiters evidence of your computational initiative.
                      </p>
                      <button
                        onClick={() => setActiveTab('cv')}
                        className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 mt-2"
                      >
                        <span>Open CV Project Builder</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                <CVProjectBuilder currentSequence={currentSequence} stats={stats} />
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Python Code Studio */}
        {activeTab === 'python' && (
          <PythonRunnerConsole currentSequence={currentSequence} stats={stats} />
        )}

        {/* Tab 3: Visualizations Studio */}
        {activeTab === 'visuals' && (
          <VisualizationsStudio
            currentSequence={currentSequence}
            stats={stats}
            restrictionSites={restrictionSites}
            orfs={orfs}
            onProceedToStep={() => setActiveTab('cv')}
          />
        )}

        {/* Tab 4: CV Project Suite */}
        {activeTab === 'cv' && (
          <CVProjectBuilder currentSequence={currentSequence} stats={stats} />
        )}

        {/* Tab 5: Interview Prep Suite */}
        {activeTab === 'interview' && <InterviewPrepSuite />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 mt-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Dna className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-slate-300">BioSeq Lab</span>
            <span>—</span>
            <span>Computational Biology & Python Sequence Analysis Platform</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>NCBI GenBank & UniProt Data Standards</span>
            <span>•</span>
            <span>Marmur-Doty & Wallace Thermodynamic Equations</span>
          </div>
        </div>
      </footer>

      {/* Report Export Modal */}
      <ReportExportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        currentSequence={currentSequence}
        stats={stats}
      />
    </div>
  );
}
