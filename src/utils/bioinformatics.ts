import {
  KyteDoolittlePoint,
  MotifMatch,
  NucleotideCounts,
  OpenReadingFrame,
  RestrictionSite,
  SequenceStats,
  WindowDataPoint
} from '../types/biology';

export const STANDARD_GENETIC_CODE: Record<string, string> = {
  ATA: 'I', ATC: 'I', ATT: 'I', ATG: 'M',
  ACA: 'T', ACC: 'T', ACG: 'T', ACT: 'T',
  AAC: 'N', AAT: 'N', AAA: 'K', AAG: 'K',
  AGC: 'S', AGT: 'S', AGA: 'R', AGG: 'R',
  CTA: 'L', CTC: 'L', CTG: 'L', CTT: 'L',
  CCA: 'P', CCC: 'P', CCG: 'P', CCT: 'P',
  CAC: 'H', CAT: 'H', CAA: 'Q', CAG: 'Q',
  CGA: 'R', CGC: 'R', CGG: 'R', CGT: 'R',
  GTA: 'V', GTC: 'V', GTG: 'V', GTT: 'V',
  GCA: 'A', GCC: 'A', GCG: 'A', GCT: 'A',
  GAC: 'D', GAT: 'D', GAA: 'E', GAG: 'E',
  GGA: 'G', GGC: 'G', GGG: 'G', GGT: 'G',
  TCA: 'S', TCC: 'S', TCG: 'S', TCT: 'S',
  TTC: 'F', TTT: 'F', TTA: 'L', TTG: 'L',
  TAC: 'Y', TAT: 'Y', TAA: '*', TAG: '*',
  TGC: 'C', TGT: 'C', TGA: '*', TGG: 'W'
};

export const AMINO_ACID_NAMES: Record<string, { name: string; hydropathy: number }> = {
  A: { name: 'Alanine', hydropathy: 1.8 },
  R: { name: 'Arginine', hydropathy: -4.5 },
  N: { name: 'Asparagine', hydropathy: -3.5 },
  D: { name: 'Aspartate', hydropathy: -3.5 },
  C: { name: 'Cysteine', hydropathy: 2.5 },
  E: { name: 'Glutamate', hydropathy: -3.5 },
  Q: { name: 'Glutamine', hydropathy: -3.5 },
  G: { name: 'Glycine', hydropathy: -0.4 },
  H: { name: 'Histidine', hydropathy: -3.2 },
  I: { name: 'Isoleucine', hydropathy: 4.5 },
  L: { name: 'Leucine', hydropathy: 3.8 },
  K: { name: 'Lysine', hydropathy: -3.9 },
  M: { name: 'Methionine', hydropathy: 1.9 },
  F: { name: 'Phenylalanine', hydropathy: 2.8 },
  P: { name: 'Proline', hydropathy: -1.6 },
  S: { name: 'Serine', hydropathy: -0.8 },
  T: { name: 'Threonine', hydropathy: -0.7 },
  W: { name: 'Tryptophan', hydropathy: -0.9 },
  Y: { name: 'Tyrosine', hydropathy: -1.3 },
  V: { name: 'Valine', hydropathy: 4.2 },
  '*': { name: 'Stop Codon', hydropathy: 0 }
};

export const KNOWN_RESTRICTION_ENZYMES = [
  { enzyme: 'EcoRI', site: 'GAATTC', cutOffset: 1, organism: 'E. coli RY13' },
  { enzyme: 'BamHI', site: 'GGATCC', cutOffset: 1, organism: 'B. amyloliquefaciens' },
  { enzyme: 'HindIII', site: 'AAGCTT', cutOffset: 1, organism: 'H. influenzae Rd' },
  { enzyme: 'NotI', site: 'GCGGCCGC', cutOffset: 2, organism: 'N. otitidiscaviarum' },
  { enzyme: 'XhoI', site: 'CTCGAG', cutOffset: 1, organism: 'X. holcicola' },
  { enzyme: 'TaqI', site: 'TCGA', cutOffset: 1, organism: 'T. aquaticus' }
];

export const REGULATORY_MOTIFS = [
  { name: 'TATA Box (Promoter)', motif: 'TATAAA', description: 'Core promoter element located ~25-30 bp upstream of transcription start site' },
  { name: 'Shine-Dalgarno (Bacterial RBS)', motif: 'AGGAGG', description: 'Bacterial ribosome binding site ~8 bp upstream of start codon' },
  { name: 'Kozak Consensus core', motif: 'GCCACCATG', description: 'Eukaryotic translation initiation consensus sequence' },
  { name: 'Poly-A Signal', motif: 'AATAAA', description: 'Eukaryotic mRNA polyadenylation cleavage signal' },
  { name: 'E-Box Motif', motif: 'CACGTG', description: 'Basic helix-loop-helix (bHLH) transcription factor binding site' }
];

/**
 * Strips FASTA headers, line breaks, numbers, spaces, and converts to uppercase.
 */
export function sanitizeSequence(input: string): { cleanSeq: string; fastaHeader?: string } {
  const lines = input.trim().split('\n');
  let fastaHeader: string | undefined = undefined;
  const seqLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('>')) {
      if (!fastaHeader) {
        fastaHeader = trimmed.substring(1).trim();
      }
    } else {
      seqLines.push(trimmed);
    }
  }

  const raw = seqLines.join('').toUpperCase().replace(/[^A-Z]/g, '');
  // Normalize RNA U -> T for DNA analysis
  const cleanSeq = raw.replace(/U/g, 'T');

  return { cleanSeq, fastaHeader };
}

/**
 * Calculates nucleotide composition and key physical properties.
 */
export function calculateSequenceStats(seq: string): SequenceStats {
  const length = seq.length;
  if (length === 0) {
    return {
      length: 0,
      counts: { A: 0, T: 0, G: 0, C: 0, N: 0, total: 0 },
      gcPercent: 0,
      atPercent: 0,
      gcAtRatio: 0,
      purineCount: 0,
      pyrimidineCount: 0,
      purinePercent: 0,
      meltingTempWallace: 0,
      meltingTempSantaLucia: 0,
      molecularWeightDnaDa: 0,
      cpgObservedToExpected: 0,
      cpgCount: 0
    };
  }

  let a = 0;
  let t = 0;
  let g = 0;
  let c = 0;
  let n = 0;

  for (let i = 0; i < length; i++) {
    const char = seq[i];
    if (char === 'A') a++;
    else if (char === 'T') t++;
    else if (char === 'G') g++;
    else if (char === 'C') c++;
    else n++;
  }

  const gcCount = g + c;
  const atCount = a + t;
  const gcPercent = (gcCount / length) * 100;
  const atPercent = (atCount / length) * 100;
  const gcAtRatio = atCount > 0 ? gcCount / atCount : 0;

  const purineCount = a + g;
  const pyrimidineCount = c + t;
  const purinePercent = (purineCount / length) * 100;

  // Wallace Rule for short sequences (< 14 bp): Tm = 2*(A+T) + 4*(G+C)
  const meltingTempWallace = 2 * atCount + 4 * gcCount;

  // Marmur-Doty formula for longer DNA: Tm = 64.9 + 41 * (yG + zC - 16.4) / length
  let meltingTempSantaLucia = 64.9 + (41 * (gcCount - 16.4)) / length;
  if (length < 14) {
    meltingTempSantaLucia = meltingTempWallace;
  }

  // Molecular weight of double-stranded DNA (~650 Da per base pair)
  const molecularWeightDnaDa = length * 650;

  // CpG Dinucleotide calculation
  let cpgCount = 0;
  for (let i = 0; i < length - 1; i++) {
    if (seq[i] === 'C' && seq[i + 1] === 'G') {
      cpgCount++;
    }
  }

  const expectedCpG = (c * g) / length;
  const cpgObservedToExpected = expectedCpG > 0 ? cpgCount / expectedCpG : 0;

  return {
    length,
    counts: { A: a, T: t, G: g, C: c, N: n, total: length },
    gcPercent: Number(gcPercent.toFixed(2)),
    atPercent: Number(atPercent.toFixed(2)),
    gcAtRatio: Number(gcAtRatio.toFixed(3)),
    purineCount,
    pyrimidineCount,
    purinePercent: Number(purinePercent.toFixed(2)),
    meltingTempWallace: Number(meltingTempWallace.toFixed(1)),
    meltingTempSantaLucia: Number(meltingTempSantaLucia.toFixed(1)),
    molecularWeightDnaDa: Math.round(molecularWeightDnaDa),
    cpgObservedToExpected: Number(cpgObservedToExpected.toFixed(3)),
    cpgCount
  };
}

/**
 * Computes reverse complement of DNA sequence.
 */
export function getReverseComplement(seq: string): string {
  const complementMap: Record<string, string> = {
    A: 'T',
    T: 'A',
    G: 'C',
    C: 'G',
    N: 'N'
  };

  const rev: string[] = [];
  for (let i = seq.length - 1; i >= 0; i--) {
    const base = seq[i];
    rev.push(complementMap[base] || 'N');
  }
  return rev.join('');
}

/**
 * Sliding window analysis for GC content and GC Skew: (G - C) / (G + C)
 */
export function calculateSlidingWindow(
  seq: string,
  windowSize = 50,
  stepSize = 10
): WindowDataPoint[] {
  const points: WindowDataPoint[] = [];
  const len = seq.length;
  if (len < windowSize) {
    const stats = calculateSequenceStats(seq);
    const skew = stats.counts.G + stats.counts.C > 0 
      ? (stats.counts.G - stats.counts.C) / (stats.counts.G + stats.counts.C) 
      : 0;
    return [{
      position: Math.floor(len / 2),
      gcContent: stats.gcPercent,
      gcSkew: Number(skew.toFixed(3)),
      atSkew: 0,
      cumulativeSkew: Number(skew.toFixed(3))
    }];
  }

  let cumulativeSkew = 0;

  for (let i = 0; i <= len - windowSize; i += stepSize) {
    let g = 0;
    let c = 0;
    let a = 0;
    let t = 0;

    for (let j = i; j < i + windowSize; j++) {
      const base = seq[j];
      if (base === 'G') g++;
      else if (base === 'C') c++;
      else if (base === 'A') a++;
      else if (base === 'T') t++;
    }

    const gcPercent = ((g + c) / windowSize) * 100;
    const gcSkew = (g + c) > 0 ? (g - c) / (g + c) : 0;
    const atSkew = (a + t) > 0 ? (a - t) / (a + t) : 0;
    cumulativeSkew += gcSkew;

    points.push({
      position: i + Math.floor(windowSize / 2),
      gcContent: Number(gcPercent.toFixed(2)),
      gcSkew: Number(gcSkew.toFixed(3)),
      atSkew: Number(atSkew.toFixed(3)),
      cumulativeSkew: Number(cumulativeSkew.toFixed(3))
    });
  }

  return points;
}

/**
 * Translates DNA codons to amino acid sequence.
 */
export function translateDna(dna: string): string {
  const aa: string[] = [];
  for (let i = 0; i < dna.length - 2; i += 3) {
    const codon = dna.substring(i, i + 3);
    const aminoAcid = STANDARD_GENETIC_CODE[codon] || 'X';
    aa.push(aminoAcid);
  }
  return aa.join('');
}

/**
 * Finds Open Reading Frames (ORFs) across all 6 reading frames.
 */
export function findOpenReadingFrames(seq: string, minLengthCodons = 20): OpenReadingFrame[] {
  const orfs: OpenReadingFrame[] = [];
  const revComp = getReverseComplement(seq);
  const totalLen = seq.length;

  const scanFrame = (targetSeq: string, frameNumber: number, isReverse: boolean) => {
    const offset = Math.abs(frameNumber) - 1;
    let currentStartCodonIdx = -1;

    for (let i = offset; i < targetSeq.length - 2; i += 3) {
      const codon = targetSeq.substring(i, i + 3);

      if (codon === 'ATG' && currentStartCodonIdx === -1) {
        currentStartCodonIdx = i;
      } else if ((codon === 'TAA' || codon === 'TAG' || codon === 'TGA') && currentStartCodonIdx !== -1) {
        const dnaSegment = targetSeq.substring(currentStartCodonIdx, i + 3);
        const codonCount = dnaSegment.length / 3;

        if (codonCount >= minLengthCodons) {
          const protein = translateDna(dnaSegment);
          // calculate approximate kDa (average aa molecular weight is 110 Da)
          const molecularWeightKDa = Number(((protein.length * 110) / 1000).toFixed(2));

          let start1Based: number;
          let end1Based: number;

          if (!isReverse) {
            start1Based = currentStartCodonIdx + 1;
            end1Based = i + 3;
          } else {
            // map reverse coordinates back to forward 5' -> 3'
            start1Based = totalLen - (i + 2);
            end1Based = totalLen - currentStartCodonIdx;
          }

          orfs.push({
            id: `orf-${frameNumber}-${start1Based}-${end1Based}`,
            frame: frameNumber,
            start: start1Based,
            end: end1Based,
            lengthNucleotides: dnaSegment.length,
            lengthCodons: codonCount,
            proteinSequence: protein,
            molecularWeightKDa
          });
        }
        currentStartCodonIdx = -1; // reset after stop codon
      }
    }
  };

  // Frames +1, +2, +3
  scanFrame(seq, 1, false);
  scanFrame(seq, 2, false);
  scanFrame(seq, 3, false);

  // Frames -1, -2, -3
  scanFrame(revComp, -1, true);
  scanFrame(revComp, -2, true);
  scanFrame(revComp, -3, true);

  // Sort by length descending
  orfs.sort((a, b) => b.lengthCodons - a.lengthCodons);
  if (orfs.length > 0) {
    orfs[0].isLongest = true;
  }

  return orfs;
}

/**
 * Simulates restriction enzyme digests on the sequence.
 */
export function simulateRestrictionDigests(seq: string): RestrictionSite[] {
  const results: RestrictionSite[] = [];
  const len = seq.length;

  for (const enzyme of KNOWN_RESTRICTION_ENZYMES) {
    const matches: number[] = [];
    let pos = 0;
    while ((pos = seq.indexOf(enzyme.site, pos)) !== -1) {
      matches.push(pos + 1); // 1-based index
      pos += 1;
    }

    // Calculate fragment sizes if cut
    const fragmentSizes: number[] = [];
    if (matches.length === 0) {
      fragmentSizes.push(len);
    } else {
      let lastCut = 0;
      for (const match of matches) {
        const cut = match + enzyme.cutOffset - 1;
        fragmentSizes.push(cut - lastCut);
        lastCut = cut;
      }
      fragmentSizes.push(len - lastCut);
    }

    results.push({
      enzyme: enzyme.enzyme,
      recognitionSeq: enzyme.site,
      cutPositionOffset: enzyme.cutOffset,
      matches,
      fragmentSizes: fragmentSizes.filter((s) => s > 0).sort((a, b) => b - a)
    });
  }

  return results;
}

/**
 * Scans for known regulatory motifs.
 */
export function searchRegulatoryMotifs(seq: string): MotifMatch[] {
  const matches: MotifMatch[] = [];

  for (const reg of REGULATORY_MOTIFS) {
    const positions: number[] = [];
    let pos = 0;
    while ((pos = seq.indexOf(reg.motif, pos)) !== -1) {
      positions.push(pos + 1);
      pos += 1;
    }

    if (positions.length > 0) {
      matches.push({
        name: reg.name,
        motif: reg.motif,
        description: reg.description,
        positions
      });
    }
  }

  return matches;
}

/**
 * Calculates Kyte-Doolittle hydropathy profile for a protein sequence.
 */
export function calculateKyteDoolittle(protein: string, windowSize = 9): KyteDoolittlePoint[] {
  const points: KyteDoolittlePoint[] = [];
  const halfWindow = Math.floor(windowSize / 2);

  if (protein.length < windowSize) {
    return protein.split('').map((aa, idx) => ({
      residueIndex: idx + 1,
      aminoAcid: aa,
      score: AMINO_ACID_NAMES[aa]?.hydropathy || 0
    }));
  }

  for (let i = halfWindow; i < protein.length - halfWindow; i++) {
    let sum = 0;
    for (let j = i - halfWindow; j <= i + halfWindow; j++) {
      const aa = protein[j];
      sum += AMINO_ACID_NAMES[aa]?.hydropathy || 0;
    }
    points.push({
      residueIndex: i + 1,
      aminoAcid: protein[i],
      score: Number((sum / windowSize).toFixed(2))
    });
  }

  return points;
}
