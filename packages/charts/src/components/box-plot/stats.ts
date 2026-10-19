import { deviation, quantileSorted } from 'd3-array';

/** Besh sonli xulosa (Tukey): min, Q1, mediana, Q3, max + mo'ylov chegaralari va chetlanishlar. */
export interface BoxStats {
  /** Qiymatlar soni (NaN/Infinity tashlab yuboriladi). */
  n: number;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  /** Q1 − 1,5 × IQR dan katta yoki teng eng kichik qiymat (pastki mo'ylov uchi). */
  whiskerLow: number;
  /** Q3 + 1,5 × IQR dan kichik yoki teng eng katta qiymat (yuqori mo'ylov uchi). */
  whiskerHigh: number;
  /** Mo'ylovdan tashqaridagi qiymatlar indekslari (asl `values` massividagi). */
  outliers: number[];
}

/** Tukey mo'ylovi koeffitsienti (Figma Usage: "Whiskers = 1.5 × IQR"). */
export const TUKEY_K = 1.5;

/** Guruh qiymatlaridan box plot xulosasi. Bo'sh massiv — `null`. */
export function boxStats(values: readonly number[]): BoxStats | null {
  const finite = values
    .map((v, i) => ({ v, i }))
    .filter((d) => Number.isFinite(d.v))
    .sort((a, b) => a.v - b.v);
  if (finite.length === 0) return null;
  const sorted = finite.map((d) => d.v);
  const q1 = quantileSorted(sorted, 0.25) ?? sorted[0];
  const median = quantileSorted(sorted, 0.5) ?? sorted[0];
  const q3 = quantileSorted(sorted, 0.75) ?? sorted[0];
  const iqr = q3 - q1;
  const lowFence = q1 - TUKEY_K * iqr;
  const highFence = q3 + TUKEY_K * iqr;
  const inside = sorted.filter((v) => v >= lowFence && v <= highFence);
  return {
    n: sorted.length,
    min: sorted[0],
    q1,
    median,
    q3,
    max: sorted[sorted.length - 1],
    whiskerLow: inside[0] ?? q1,
    whiskerHigh: inside[inside.length - 1] ?? q3,
    outliers: finite.filter((d) => d.v < lowFence || d.v > highFence).map((d) => d.i),
  };
}

/** Silverman qoidasi bo'yicha KDE kengligi; bir xil qiymatlarda ham musbat son qaytaradi. */
export function silvermanBandwidth(values: readonly number[]): number {
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (sorted.length < 2) return 1;
  const sd = deviation(sorted) ?? 0;
  const iqr = (quantileSorted(sorted, 0.75) ?? 0) - (quantileSorted(sorted, 0.25) ?? 0);
  const spread = Math.min(sd, iqr / 1.34) || sd || sorted[sorted.length - 1] - sorted[0];
  const bw = 1.06 * spread * sorted.length ** -0.2;
  return bw > 0 ? bw : Math.abs(sorted[0]) / 10 || 1;
}

/** Gauss yadroli zichlik: `xs` nuqtalarida f(x). Ridgeline va Violin bir xil funksiyani ishlatadi. */
export function kernelDensity(
  values: readonly number[],
  xs: readonly number[],
  bandwidth: number,
): number[] {
  const finite = values.filter(Number.isFinite);
  if (finite.length === 0 || bandwidth <= 0) return xs.map(() => 0);
  const norm = 1 / (finite.length * bandwidth * Math.sqrt(2 * Math.PI));
  return xs.map((x) => {
    let sum = 0;
    for (const v of finite) {
      const u = (x - v) / bandwidth;
      sum += Math.exp(-0.5 * u * u);
    }
    return sum * norm;
  });
}

/** `[lo, hi]` oralig'ida `count` ta teng qadamli nuqta. */
export function samplePoints(lo: number, hi: number, count: number): number[] {
  const n = Math.max(2, Math.round(count));
  return Array.from({ length: n }, (_, i) => lo + ((hi - lo) * i) / (n - 1));
}
