export interface BiologicalSequence {
  id: string;
  name: string;
  geneName: string;
  organism: string;
  accession: string;
  type: 'DNA' | 'RNA' | 'PROTEIN';
  description: string;
  biologicalSignificance: string;
  rawSequence: string;
  category: 'human-health' | 'virology' | 'microbiology' | 'biotechnology' | 'extreme-environment';
}

export interface NucleotideCounts {
  A: number;
  T: number;
  G: number;
  C: number;
  N: number;
  total: number;
}

export interface SequenceStats {
  length: number;
  counts: NucleotideCounts;
  gcPercent: number;
  atPercent: number;
  gcAtRatio: number;
  purineCount: number; // A + G
  pyrimidineCount: number; // C + T
  purinePercent: number;
  meltingTempWallace: number; // 2*(A+T) + 4*(G+C)
  meltingTempSantaLucia: number; // Marmur-Doty/nearest-neighbor approximation
  molecularWeightDnaDa: number; // g/mol (approx 660 Da / bp dsDNA, ~330 Da ssDNA)
  cpgObservedToExpected: number; // CpG island score
  cpgCount: number;
}

export interface WindowDataPoint {
  position: number;
  gcContent: number;
  gcSkew: number; // (G - C) / (G + C)
  atSkew: number; // (A - T) / (A + T)
  cumulativeSkew?: number;
}

export interface OpenReadingFrame {
  id: string;
  frame: number; // +1, +2, +3, -1, -2, -3
  start: number; // 1-based start
  end: number;   // 1-based end
  lengthNucleotides: number;
  lengthCodons: number;
  proteinSequence: string;
  molecularWeightKDa: number;
  isLongest?: boolean;
}

export interface RestrictionSite {
  enzyme: string;
  recognitionSeq: string;
  cutPositionOffset: number;
  matches: number[]; // positions 1-based
  fragmentSizes: number[];
}

export interface MotifMatch {
  name: string;
  motif: string;
  description: string;
  positions: number[];
}

export interface KyteDoolittlePoint {
  residueIndex: number;
  aminoAcid: string;
  score: number;
}

export interface CVBulletOption {
  id: string;
  label: string;
  bullets: string[];
  focus: string;
}
