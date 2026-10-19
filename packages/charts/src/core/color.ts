// Figma `dataviz/*` tokenlari → CSS qiymati. Komponentlar rangni faqat shu yerdan oladi (hex yo'q).

/** 8 ta kategorik rang (`dataviz/categorical/01…08`), tartib bilan; 9-seriya yana 01 dan. */
export const CATEGORICAL_COUNT = 8;

/**
 * i-seriya rangi: `seriesColor(0)` → `var(--bek-chart-series-1, var(--bek-dataviz-categorical-01))`.
 * `--bek-chart-series-N` `.bek-chart` ildizida `dataviz/categorical/0N` ga teng (styles/chart.css) — bitta
 * chart palitrasini o'zgartirish uchun shu o'zgaruvchini qayta belgilang.
 */
export function seriesColor(index: number): string {
  const n = (((index % CATEGORICAL_COUNT) + CATEGORICAL_COUNT) % CATEGORICAL_COUNT) + 1;
  return `var(--bek-chart-series-${n}, var(--bek-dataviz-categorical-0${n}))`;
}

export type SequentialLevel = 100 | 200 | 300 | 400 | 500 | 600 | 700;

/** Ketma-ket shkala: `sequentialColor(300)` → `var(--bek-dataviz-sequential-300)`. */
export function sequentialColor(level: SequentialLevel): string {
  return `var(--bek-dataviz-sequential-${level})`;
}

/**
 * Matnli katak uchun daraja (Figma CMP-07): faqat 200 · 300 · 600 · 700 ikkala rejimda ≥ 4.5:1.
 * `t` — 0…1 oralig'idagi ulush.
 */
export function textCellLevel(t: number): 200 | 300 | 600 | 700 {
  if (t >= 0.7) return 700;
  if (t >= 0.4) return 600;
  if (t >= 0.08) return 300;
  return 200;
}

/** Katak darajasiga mos matn tokeni: 200/300 → text/primary, 600/700 → text/inverse. */
export function textOnCell(level: 200 | 300 | 600 | 700): string {
  return level >= 600 ? 'var(--bek-text-inverse)' : 'var(--bek-text-primary)';
}

export type Trend = 'up' | 'down' | 'neutral';

/** Yo'nalish rangi: up → dataviz/positive, down → negative, neutral → neutral. */
export function trendColor(trend: Trend): string {
  return trend === 'up'
    ? 'var(--bek-dataviz-positive)'
    : trend === 'down'
      ? 'var(--bek-dataviz-negative)'
      : 'var(--bek-dataviz-neutral)';
}
