/**
 * Generates pure Python and Biopython code scripts for biological sequence analysis.
 */

export function generateStandalonePythonScript(
  sequence: string,
  geneName = 'Target_Gene',
  accession = 'ACC_001'
): string {
  return `"""
Analysis of Biological Sequence Data Using Python
Independent Computational Biology Project
Target Sequence: ${geneName} (NCBI/UniProt Accession: ${accession})
Author: Computational Biology Research Candidate
Date: 2026

Description:
This script performs foundational computational sequence analysis on DNA data:
1. Cleans and validates raw biological sequence strings.
2. Computes nucleotide frequencies, base composition, and GC content.
3. Calculates thermodynamic melting temperature (Wallace / Marmur-Doty).
4. Conducts sliding-window GC skew analysis to identify compositional asymmetry.
5. Scans 6 open reading frames (ORFs) and translates candidate coding sequences.
"""

import sys
import math

# Target FASTA Sequence
TARGET_NAME = "${geneName}"
ACCESSION = "${accession}"
RAW_SEQUENCE = """${sequence.slice(0, 120)}..."""  # Truncated in preview; full sequence below
FULL_SEQUENCE = "${sequence}"

STANDARD_GENETIC_CODE = {
    'ATA':'I', 'ATC':'I', 'ATT':'I', 'ATG':'M',
    'ACA':'T', 'ACC':'T', 'ACG':'T', 'ACT':'T',
    'AAC':'N', 'AAT':'N', 'AAA':'K', 'AAG':'K',
    'AGC':'S', 'AGT':'S', 'AGA':'R', 'AGG':'R',
    'CTA':'L', 'CTC':'L', 'CTG':'L', 'CTT':'L',
    'CCA':'P', 'CCC':'P', 'CCG':'P', 'CCT':'P',
    'CAC':'H', 'CAT':'H', 'CAA':'Q', 'CAG':'Q',
    'CGA':'R', 'CGC':'R', 'CGG':'R', 'CGT':'R',
    'GTA':'V', 'GTC':'V', 'GTG':'V', 'GTT':'V',
    'GCA':'A', 'GCC':'A', 'GCG':'A', 'GCT':'A',
    'GAC':'D', 'GAT':'D', 'GAA':'E', 'GAG':'E',
    'GGA':'G', 'GGC':'G', 'GGG':'G', 'GGT':'G',
    'TCA':'S', 'TCC':'S', 'TCG':'S', 'TCT':'S',
    'TTC':'F', 'TTT':'F', 'TTA':'L', 'TTG':'L',
    'TAC':'Y', 'TAT':'Y', 'TAA':'*', 'TAG':'*',
    'TGC':'C', 'TGT':'C', 'TGA':'*', 'TGG':'W',
}


def clean_sequence(raw_seq: str) -> str:
    """Removes whitespace, digits, and normalizes characters to uppercase DNA."""
    cleaned = "".join([c.upper() for c in raw_seq if c.isalpha()])
    return cleaned.replace('U', 'T')


def compute_nucleotide_composition(seq: str) -> dict:
    """Calculates nucleotide counts, GC percentage, and molecular statistics."""
    total_len = len(seq)
    if total_len == 0:
        return {}

    counts = {
        'A': seq.count('A'),
        'T': seq.count('T'),
        'G': seq.count('G'),
        'C': seq.count('C'),
    }
    counts['N'] = total_len - sum(counts.values())

    gc_count = counts['G'] + counts['C']
    at_count = counts['A'] + counts['T']
    gc_percent = (gc_count / total_len) * 100
    at_percent = (at_count / total_len) * 100
    gc_at_ratio = gc_count / at_count if at_count > 0 else 0

    # Melting temperature estimation
    if total_len < 14:
        tm = 2 * (counts['A'] + counts['T']) + 4 * (counts['G'] + counts['C'])
    else:
        tm = 64.9 + 41 * (gc_count - 16.4) / total_len

    # CpG Dinucleotide Count & Observed/Expected ratio
    cpg_count = seq.count('CG')
    expected_cpg = (counts['C'] * counts['G']) / total_len if total_len > 0 else 1
    cpg_ratio = cpg_count / expected_cpg if expected_cpg > 0 else 0

    return {
        'length': total_len,
        'counts': counts,
        'gc_percent': round(gc_percent, 2),
        'at_percent': round(at_percent, 2),
        'gc_at_ratio': round(gc_at_ratio, 3),
        'melting_temp_c': round(tm, 2),
        'cpg_count': cpg_count,
        'cpg_obs_exp': round(cpg_ratio, 3),
        'mol_weight_da': total_len * 650
    }


def reverse_complement(seq: str) -> str:
    """Generates the 5'->3' reverse complement strand."""
    complement = {'A': 'T', 'T': 'A', 'G': 'C', 'C': 'G', 'N': 'N'}
    return "".join(complement.get(base, 'N') for base in reversed(seq))


def sliding_window_gc(seq: str, window_size: int = 50, step_size: int = 10) -> list:
    """Computes sliding window GC content and GC skew (G - C)/(G + C)."""
    results = []
    for i in range(0, len(seq) - window_size + 1, step_size):
        sub = seq[i : i + window_size]
        g = sub.count('G')
        c = sub.count('C')
        gc_content = ((g + c) / window_size) * 100
        gc_skew = (g - c) / (g + c) if (g + c) > 0 else 0.0
        results.append({
            'midpoint': i + (window_size // 2),
            'gc_content': round(gc_content, 2),
            'gc_skew': round(gc_skew, 3)
        })
    return results


def find_orfs(seq: str, min_codons: int = 25) -> list:
    """Discovers Open Reading Frames across forward and reverse reading frames."""
    orfs = []
    strands = [('Forward', seq, [1, 2, 3]), ('Reverse', reverse_complement(seq), [-1, -2, -3])]

    for strand_name, target_seq, frames in strands:
        for frame in frames:
            offset = abs(frame) - 1
            start_pos = None
            for i in range(offset, len(target_seq) - 2, 3):
                codon = target_seq[i : i + 3]
                if codon == 'ATG' and start_pos is None:
                    start_pos = i
                elif codon in ('TAA', 'TAG', 'TGA') and start_pos is not None:
                    orf_dna = target_seq[start_pos : i + 3]
                    codon_count = len(orf_dna) // 3
                    if codon_count >= min_codons:
                        # Translate to amino acids
                        protein = "".join([STANDARD_GENETIC_CODE.get(orf_dna[j:j+3], 'X') for j in range(0, len(orf_dna), 3)])
                        orfs.append({
                            'strand': strand_name,
                            'frame': frame,
                            'start': start_pos + 1,
                            'end': i + 3,
                            'codons': codon_count,
                            'protein': protein
                        })
                    start_pos = None

    orfs.sort(key=lambda x: x['codons'], reverse=True)
    return orfs


def main():
    print("=" * 65)
    print(f"BIOLOGICAL SEQUENCE ANALYSIS: {TARGET_NAME} [{ACCESSION}]")
    print("=" * 65)

    seq = clean_sequence(FULL_SEQUENCE)
    stats = compute_nucleotide_composition(seq)

    print(f"\\n[1] NUCLEOTIDE COMPOSITION & PHYSICAL METRICS:")
    print(f"  • Sequence Length      : {stats['length']} base pairs")
    print(f"  • Adenine (A)          : {stats['counts']['A']} ({round(stats['counts']['A']/stats['length']*100, 1)}%)")
    print(f"  • Thymine (T)          : {stats['counts']['T']} ({round(stats['counts']['T']/stats['length']*100, 1)}%)")
    print(f"  • Guanine (G)          : {stats['counts']['G']} ({round(stats['counts']['G']/stats['length']*100, 1)}%)")
    print(f"  • Cytosine (C)         : {stats['counts']['C']} ({round(stats['counts']['C']/stats['length']*100, 1)}%)")
    print(f"  • Overall GC Content   : {stats['gc_percent']}%")
    print(f"  • AT / GC Ratio        : {stats['gc_at_ratio']}")
    print(f"  • Estimated Melting Tm : {stats['melting_temp_c']} °C")
    print(f"  • CpG Obs/Exp Ratio    : {stats['cpg_obs_exp']}")
    print(f"  • Approx. MW (dsDNA)   : {stats['mol_weight_da'] / 1000:.2f} kDa")

    windows = sliding_window_gc(seq, window_size=50, step_size=20)
    print(f"\\n[2] SLIDING WINDOW GC ARCHITECTURE (Sample first 5 windows, window=50bp):")
    for w in windows[:5]:
        print(f"  Position {w['midpoint']:4d} bp | GC%: {w['gc_content']:5.1f}% | GC Skew: {w['gc_skew']:+.3f}")

    orfs = find_orfs(seq, min_codons=20)
    print(f"\\n[3] OPEN READING FRAMES (ORFs Detected: {len(orfs)}):")
    if orfs:
        top = orfs[0]
        print(f"  Top Candidate ORF:")
        print(f"  • Strand / Frame       : {top['strand']} (Frame {top['frame']})")
        print(f"  • Nucleotide Span      : {top['start']} - {top['end']} ({top['codons']} codons / {top['codons']*3} bp)")
        print(f"  • Translated Peptide   : {top['protein'][:45]}...")
    else:
        print("  • No ORFs >= 20 codons detected under canonical AUG start.")

    print("\\n" + "=" * 65)
    print("ANALYSIS COMPLETED SUCCESSFULLY.")
    print("=" * 65)


if __name__ == '__main__':
    main()
`;
}

export function generateBiopythonScript(
  sequence: string,
  geneName = 'Target_Gene',
  accession = 'ACC_001'
): string {
  return `"""
Biopython-Powered Sequence Analysis Pipeline
Package requirements: pip install biopython matplotlib pandas
Gene: ${geneName} (${accession})
"""

from Bio.Seq import Seq
from Bio.SeqUtils import gc_fraction, molecular_weight
from Bio.Data import CodonTable
import matplotlib.pyplot as plt

# Sequence Initialization
raw_seq = "${sequence}"
my_seq = Seq(raw_seq)

print(f"Analyzing {my_seq[:20]}... Length: {len(my_seq)} bp")

# 1. Compositional Statistics
gc_pct = gc_fraction(my_seq) * 100
mw = molecular_weight(my_seq, seq_type='DNA')

print(f"GC Fraction: {gc_pct:.2f}%")
print(f"Molecular Weight: {mw:.2f} Da ({mw/1000:.2f} kDa)")

# 2. Transcription & Translation
mrna = my_seq.transcribe()
# Standard translation table
protein = my_seq.translate(to_stop=False)
print(f"Direct Translation (Frame 1): {protein[:30]}...")

# 3. Restriction Enzyme Cleavage Sites
from Bio.Restriction import EcoRI, BamHI, HindIII, NotI
enzymes = [EcoRI, BamHI, HindIII, NotI]

for enzyme in enzymes:
    sites = enzyme.search(my_seq)
    print(f"Enzyme {enzyme.__name__}: {len(sites)} recognition sites at {sites}")

# 4. Reverse Complement
rev_comp = my_seq.reverse_complement()
print(f"Reverse Complement (5'->3'): {rev_comp[:30]}...")
`;
}

export function generateMatplotlibScript(
  sequence: string,
  geneName = 'Target_Gene'
): string {
  return `"""
Data Visualization for Biological Sequence Data Using Matplotlib
Generates publication-quality charts for internship project portfolio.
"""

import matplotlib.pyplot as plt
import numpy as np

sequence = "${sequence}"
window_size = 50
step = 10

# Sliding Window Computation
positions = []
gc_values = []
gc_skews = []

for i in range(0, len(sequence) - window_size + 1, step):
    sub = sequence[i : i + window_size]
    g = sub.count('G')
    c = sub.count('C')
    gc = ((g + c) / window_size) * 100
    skew = (g - c) / (g + c) if (g + c) > 0 else 0.0
    positions.append(i + (window_size // 2))
    gc_values.append(gc)
    gc_skews.append(skew)

# Create Subplots
fig, (ax1, ax2, ax3) = plt.subplots(3, 1, figsize=(10, 9), sharex=False)
fig.suptitle('Biological Sequence Architecture: ${geneName}', fontsize=14, fontweight='bold')

# Plot 1: Sliding Window GC Content
mean_gc = (sequence.count('G') + sequence.count('C')) / len(sequence) * 100
ax1.plot(positions, gc_values, color='#0284c7', linewidth=2, label='Local GC% (50bp window)')
ax1.axhline(mean_gc, color='#ef4444', linestyle='--', label=f'Mean GC ({mean_gc:.1f}%)')
ax1.set_ylabel('GC Content (%)')
ax1.set_title('Sliding-Window GC Profile')
ax1.grid(True, alpha=0.3)
ax1.legend(loc='upper right')

# Plot 2: GC Skew Distribution
ax2.plot(positions, gc_skews, color='#10b981', linewidth=1.8, label='GC Skew (G-C)/(G+C)')
ax2.axhline(0, color='black', linestyle=':', alpha=0.6)
ax2.fill_between(positions, gc_skews, 0, where=(np.array(gc_skews) > 0), color='#10b981', alpha=0.2)
ax2.fill_between(positions, gc_skews, 0, where=(np.array(gc_skews) < 0), color='#f43f5e', alpha=0.2)
ax2.set_ylabel('GC Skew')
ax2.set_title('Strand Asymmetry & GC Skew')
ax2.grid(True, alpha=0.3)
ax2.legend(loc='upper right')

# Plot 3: Nucleotide Frequency Bar Chart
bases = ['A', 'T', 'G', 'C']
counts = [sequence.count(b) for b in bases]
colors = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6']
ax3.bar(bases, counts, color=colors, width=0.5, edgecolor='black', alpha=0.85)
for i, v in enumerate(counts):
    ax3.text(i, v + (max(counts)*0.02), f"{v} ({v/len(sequence)*100:.1f}%)", ha='center', fontweight='bold')
ax3.set_ylabel('Base Count')
ax3.set_title('Nucleotide Base Composition')
ax3.grid(axis='y', alpha=0.3)

plt.tight_layout()
plt.savefig('sequence_analysis_plots.png', dpi=300)
print("Plots saved successfully as sequence_analysis_plots.png")
plt.show()
`;
}

export function generateJupyterNotebook(
  sequence: string,
  geneName = 'Target_Gene',
  accession = 'ACC_001'
): string {
  const standaloneCode = generateStandalonePythonScript(sequence, geneName, accession);
  const plotCode = generateMatplotlibScript(sequence, geneName);

  const notebook = {
    cells: [
      {
        cell_type: 'markdown',
        metadata: {},
        source: [
          `# Analysis of Biological Sequence Data Using Python\n`,
          `**Project Focus:** Computational Sequence Analysis & Genome Statistics\n`,
          `**Target Gene:** ${geneName} (Accession: \`${accession}\`)\n`,
          `\n`,
          `This notebook accompanies an independent computational biology project designed to transition laboratory microbiology skills into computational genomics.`
        ]
      },
      {
        cell_type: 'code',
        execution_count: 1,
        metadata: {},
        outputs: [],
        source: standaloneCode.split('\n').map((l) => l + '\n')
      },
      {
        cell_type: 'markdown',
        metadata: {},
        source: [
          `## Sequence Visualization with Matplotlib\n`,
          `Generate publication-grade figures showing GC isochore distribution, strand skew, and nucleotide frequencies.`
        ]
      },
      {
        cell_type: 'code',
        execution_count: 2,
        metadata: {},
        outputs: [],
        source: plotCode.split('\n').map((l) => l + '\n')
      }
    ],
    metadata: {
      language_info: {
        name: 'python',
        version: '3.11'
      }
    },
    nbformat: 4,
    nbformat_minor: 2
  };

  return JSON.stringify(notebook, null, 2);
}
