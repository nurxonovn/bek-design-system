import { max, min } from 'd3-array';
import { scaleLinear } from 'd3-scale';

/** Chizma o'lchami: SVG koordinatalari shu raqamlarda (responsiv eni `ChartContainer` beradi). */
export interface ChartSize {
  width: number;
  height: number;
}

/** Ichki chegaralar: o'q yozuvlari uchun joy. */
export interface ChartMargin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/** Figma 4.18: plot balandligi `chart/height/md` (Mobile 200), eni `scale/480`. */
export const DEFAULT_WIDTH = 480;
export const DEFAULT_HEIGHT = 200;
/** `chart/axis/tick-count` — Mobile qiymati; Tablet 5, Web 6. */
export const DEFAULT_TICKS = 4;

/** Y o'qi uchun chiroyli shkala: 0 dan (bar) yoki ma'lumot chegarasidan (line). */
export function valueScale(
  values: number[],
  range: [number, number],
  options: { zero?: boolean; ticks?: number } = {},
) {
  const { zero = true, ticks = DEFAULT_TICKS } = options;
  const lo = min(values) ?? 0;
  const hi = max(values) ?? 1;
  const domain: [number, number] = zero ? [Math.min(0, lo), Math.max(0, hi)] : [lo, hi];
  if (domain[0] === domain[1]) domain[1] = domain[0] + 1;
  return scaleLinear().domain(domain).range(range).nice(ticks);
}

/**
 * Faqat qiymat uchi yumaloq to'rtburchak (Figma: `chart/bar/radius` faqat qiymat tomonida).
 * `edge` — yumaloq tomon. Juda kichik ustunda radius o'lchamga qisqaradi.
 */
export function roundedBar(
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  edge: 'top' | 'right' | 'bottom' | 'left',
): string {
  const rr = Math.max(
    0,
    Math.min(
      r,
      edge === 'top' || edge === 'bottom' ? w / 2 : h / 2,
      edge === 'top' || edge === 'bottom' ? h : w,
    ),
  );
  const x2 = x + w;
  const y2 = y + h;
  switch (edge) {
    case 'top':
      return `M${x},${y2}V${y + rr}Q${x},${y} ${x + rr},${y}H${x2 - rr}Q${x2},${y} ${x2},${y + rr}V${y2}Z`;
    case 'bottom':
      return `M${x},${y}V${y2 - rr}Q${x},${y2} ${x + rr},${y2}H${x2 - rr}Q${x2},${y2} ${x2},${y2 - rr}V${y}Z`;
    case 'right':
      return `M${x},${y}H${x2 - rr}Q${x2},${y} ${x2},${y + rr}V${y2 - rr}Q${x2},${y2} ${x2 - rr},${y2}H${x}Z`;
    default:
      return `M${x2},${y}H${x + rr}Q${x},${y} ${x},${y + rr}V${y2 - rr}Q${x},${y2} ${x + rr},${y2}H${x2}Z`;
  }
}

/** Qatorni SVG atributi uchun 2 xonagacha yaxlitlash (yengil va barqaror markup). */
export const r2 = (n: number): number => Math.round(n * 100) / 100;
