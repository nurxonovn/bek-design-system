import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { cx } from '@bek/react';
import { textCellLevel } from '../../core/color.js';
import { formatNumber, formatPercent } from '../../core/format.js';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from '../../core/geometry.js';

export type ConfusionMatrixVariant = 'counts' | 'normalized';

export interface ConfusionMatrixProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Sinf nomlari: qatorlar (haqiqiy) va ustunlar (bashorat) shu tartibda. 2–10 sinf. */
  labels: string[];
  /** `matrix[actual][predicted]` — namunalar soni. Diagonal — to'g'ri javoblar. */
  matrix: number[][];
  /** `counts` — xom sonlar, `normalized` — qator ulushi (%). */
  variant?: ConfusionMatrixVariant;
  /** `variant="normalized"` qisqa yozuvi (Figma React namunasi: `normalize`). */
  normalize?: boolean;
  /** Burchak katagi matni (qatorlar — haqiqiy sinf). */
  actualLabel?: ReactNode;
  /** Pastki xulosa; standart: `Accuracy 86,9% · 1 240 samples · columns = predicted`. `false` — yashirish. */
  summary?: ReactNode;
  /** Jadval eni (`scale/480`); tor ekranda gorizontal skroll. */
  width?: number;
  /** Jadval + xulosa balandligi (`scale/200`) — qator balandligi shundan. */
  height?: number;
  /** Jadval sarlavhasi (ekran o'quvchi uchun qisqa xulosa). */
  label: string;
}

export interface ConfusionStats {
  total: number;
  correct: number;
  /** 0…1 */
  accuracy: number;
  /** Har sinf (ustun) uchun: to'g'ri / shu sinf deb bashorat qilinganlar. */
  precision: number[];
  /** Har sinf (qator) uchun: to'g'ri / shu sinfning hammasi. */
  recall: number[];
}

/** Aniqlik, precision va recall — xulosa va tooltip uchun. */
export function confusionStats(matrix: number[][]): ConfusionStats {
  const n = matrix.length;
  const at = (i: number, j: number) => Math.max(0, Number(matrix[i]?.[j]) || 0);
  let total = 0;
  let correct = 0;
  const rowSum = Array.from({ length: n }, () => 0);
  const colSum = Array.from({ length: n }, () => 0);
  for (let i = 0; i < n; i += 1)
    for (let j = 0; j < n; j += 1) {
      const v = at(i, j);
      total += v;
      rowSum[i] += v;
      colSum[j] += v;
      if (i === j) correct += v;
    }
  return {
    total,
    correct,
    accuracy: total ? correct / total : 0,
    precision: colSum.map((s, j) => (s ? at(j, j) / s : 0)),
    recall: rowSum.map((s, i) => (s ? at(i, i) / s : 0)),
  };
}

const HEAD_H = 20; // ustun sarlavhalari qatori
const SUMMARY_H = 24; // xulosa qatori + chart/gap
const ROW_MIN = 24;
const ROW_MAX = 40; // scale/40

/**
 * Figma "4.18 Chart · Confusion matrix": klassifikator baholash — qatorlar haqiqiy sinf, ustunlar
 * bashorat, diagonal — to'g'ri. Rang = qator ulushi, faqat `dataviz/sequential` 200 · 300 · 600 · 700
 * (CMP-07); matn 200/300 da `text/primary`, 600/700 da `text/inverse`. Haqiqiy `<table>` semantikasi.
 */
export function ConfusionMatrix({
  labels,
  matrix,
  variant: variantProp,
  normalize = false,
  actualLabel = 'Actual ↓',
  summary,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  label,
  className,
  style,
  ...rest
}: ConfusionMatrixProps) {
  const variant: ConfusionMatrixVariant = variantProp ?? (normalize ? 'normalized' : 'counts');
  const n = Math.min(labels.length, matrix.length);
  const m = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => Math.max(0, Number(matrix[i]?.[j]) || 0)),
  );
  const stats = confusionStats(m);
  const rowSum = m.map((row) => row.reduce((a, v) => a + v, 0));
  const rowH = Math.max(
    ROW_MIN,
    Math.min(ROW_MAX, (height - HEAD_H - (summary === false ? 0 : SUMMARY_H)) / Math.max(n, 1)),
  );
  const pct = (share: number) => formatPercent(share * 100, { decimals: 1 });
  const summaryNode =
    summary ??
    `Accuracy ${pct(stats.accuracy)} · ${formatNumber(stats.total)} samples · columns = predicted`;
  const vars = { ...style, '--bek-confusion-matrix-row': `${rowH}px` } as CSSProperties;

  return (
    <figure
      {...rest}
      style={vars}
      className={cx(
        'bek-chart',
        'bek-confusion-matrix',
        `bek-confusion-matrix--${variant}`,
        className,
      )}
    >
      {/* Tor ekranda jadval gorizontal skroll qiladi — klaviaturadan ham (tabIndex). */}
      <div
        className="bek-confusion-matrix__scroll bek-focus-ring"
        tabIndex={0}
        role="region"
        aria-label={label}
      >
        <table className="bek-confusion-matrix__table" style={{ inlineSize: width }}>
          <caption className="bek-chart__sr">{label}</caption>
          <thead>
            <tr>
              <th scope="col" className="bek-confusion-matrix__corner">
                {actualLabel}
              </th>
              {labels.slice(0, n).map((l, j) => (
                <th key={j} scope="col" className="bek-confusion-matrix__head">
                  {l}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {m.map((row, i) => (
              <tr key={i}>
                <th scope="row" className="bek-confusion-matrix__row">
                  {labels[i]}
                </th>
                {row.map((v, j) => {
                  const share = rowSum[i] ? v / rowSum[i] : 0;
                  const level = textCellLevel(share);
                  return (
                    <td
                      key={j}
                      className={cx(
                        'bek-confusion-matrix__cell',
                        `bek-confusion-matrix__cell--${level}`,
                        i === j && 'bek-confusion-matrix__cell--diagonal',
                      )}
                      title={`${labels[i]} → ${labels[j]}: ${formatNumber(v)} (${pct(share)} of row) · precision ${labels[j]} ${pct(stats.precision[j])} · recall ${labels[i]} ${pct(stats.recall[i])}`}
                    >
                      {variant === 'normalized' ? pct(share) : formatNumber(v)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {summary !== false && (
        <figcaption className="bek-confusion-matrix__summary">{summaryNode}</figcaption>
      )}
    </figure>
  );
}
