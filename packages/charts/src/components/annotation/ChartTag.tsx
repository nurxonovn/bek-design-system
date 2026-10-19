import { r2 } from '../../core/geometry.js';
import { estimateTextWidth } from '../chart-axis/PartFrame.js';

/** Teg balandligi: Label/S qatori 16 + 2 × scale/2. */
export const TAG_H = 20;
/** Gorizontal padding — scale/8. */
const PAD_X = 8;

export interface ChartTagProps {
  /** Teg markazi (x) va yuqori cheti (y). */
  x: number;
  y: number;
  text: string;
  /** Klass prefiksi: `bek-annotation` → `bek-annotation__tag`, `__tag-text`. */
  block: string;
  /** Teg plotdan chiqib ketmasligi uchun chegaralar. */
  min?: number;
  max?: number;
}

/** Teg eni (px) — matn taxmini + padding. */
export function tagWidth(text: string): number {
  return estimateTextWidth(text) + PAD_X * 2;
}

/** `fill/inverse` pill + Label/S · `text/inverse` — Annotation va Crosshair qiymat teglari (SVG). */
export function ChartTag({ x, y, text, block, min = -Infinity, max = Infinity }: ChartTagProps) {
  const w = tagWidth(text);
  const left = Math.max(min, Math.min(max - w, x - w / 2));
  return (
    <g className={`${block}__tag`} transform={`translate(${r2(left)} ${r2(y)})`}>
      <rect width={w} height={TAG_H} rx={TAG_H / 2} />
      <text
        className={`${block}__tag-text`}
        x={w / 2}
        y={TAG_H / 2}
        dy="0.35em"
        textAnchor="middle"
      >
        {text}
      </text>
    </g>
  );
}
