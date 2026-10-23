// Urug'li tasodifiy sonlar (mulberry32): statik kadr (prefers-reduced-motion) har safar bir xil chiqadi.
export type Random = () => number;

export function createRandom(seed = 1): Random {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const clamp = (v: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, v));

/** Raqamli prop: son bo'lmasa yoki cheksiz bo'lsa — standart qiymat. */
export const num = (v: number | undefined, fallback: number): number =>
  typeof v === 'number' && Number.isFinite(v) ? v : fallback;

export const smoothstep = (t: number): number => {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
};
