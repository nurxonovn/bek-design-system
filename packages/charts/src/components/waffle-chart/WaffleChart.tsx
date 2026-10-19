import type { HTMLAttributes } from 'react';
import { cx } from '@bek/react';
import { seriesColor } from '../../core/color.js';
import { formatPercent } from '../../core/format.js';
import { DataTable } from '../../core/svg.js';
import { LegendItem } from '../legend-item/LegendItem.js';

export type WaffleChartVariant = 'default';

export interface WafflePart {
  label: string;
  /** Ulush 0…1 (0.38 = 38%). */
  share: number;
  /** Standart — `seriesColor(i)`. */
  color?: string;
}

export interface WaffleChartProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Figma `Variant` — bitta: `default`. */
  variant?: WaffleChartVariant;
  /** Ko'pi bilan 4 kategoriya; qolgan ulush `dataviz/track` da. */
  data: WafflePart[];
  /** Qoldiq nomi legendda (Figma: "Other"). Bo'sh satr — legendda ko'rsatilmaydi. */
  remainderLabel?: string;
  /** Katak o'lchami (`scale/16`). 10 × 10 to'r kvadrat qoladi — cho'zilmaydi. */
  cellSize?: number;
  /** Ekran o'quvchi uchun qisqa xulosa ("38 percent Cards, 22 percent Transfers, 40 percent other"). */
  label: string;
}

const CELLS = 100;
const COLS = 10;
const GAP = 4; // scale/4

/** Butun foizlarga yaxlitlash, yig'indi 100 dan oshmaydi (eng katta qoldiq usuli). */
function toCells(shares: number[]): number[] {
  const raw = shares.map((s) => Math.max(0, s) * CELLS);
  const target = Math.min(CELLS, Math.round(raw.reduce((a, b) => a + b, 0)));
  const base = raw.map(Math.floor);
  let left = target - base.reduce((a, b) => a + b, 0);
  const order = raw.map((r, i) => ({ i, rest: r - Math.floor(r) })).sort((a, b) => b.rest - a.rest);
  const out = [...base];
  for (const o of order) {
    if (left <= 0) break;
    out[o.i] += 1;
    left -= 1;
  }
  return out;
}

/**
 * Figma "4.18 Chart · Waffle": 100 katak — bitta katak 1%. Yaqin ulushlarni pie'dan aniqroq ko'rsatadi.
 * To'ldirish tartibi — pastki chapdan o'ngga, qatorma-qator; qoldiq `dataviz/track`.
 */
export function WaffleChart({
  variant = 'default',
  data,
  remainderLabel = 'Other',
  cellSize = 16,
  label,
  className,
  ...rest
}: WaffleChartProps) {
  const counts = toCells(data.map((d) => d.share));
  const filled = counts.reduce((a, b) => a + b, 0);
  const remainder = CELLS - filled;
  const colorOf = (i: number) => data[i].color ?? seriesColor(i);
  const step = cellSize + GAP;
  const size = COLS * step - GAP;
  const pos = (n: number) => ({
    x: (n % COLS) * step,
    y: (COLS - 1 - Math.floor(n / COLS)) * step,
  });
  let cursor = 0;
  const parts = counts.map((count, i) => {
    const from = cursor;
    cursor += count;
    return { i, cells: Array.from({ length: count }, (_, k) => pos(from + k)) };
  });
  const remainderCells = Array.from({ length: remainder }, (_, k) => pos(filled + k));
  const rows = [
    ...data.map((d, i) => ({ label: d.label, pct: counts[i], color: colorOf(i) })),
    ...(remainder > 0 && remainderLabel
      ? [{ label: remainderLabel, pct: remainder, color: 'var(--bek-dataviz-track)' }]
      : []),
  ];

  return (
    <figure
      {...rest}
      className={cx('bek-chart', 'bek-waffle-chart', `bek-waffle-chart--${variant}`, className)}
    >
      <div className="bek-waffle-chart__body">
        <svg
          className="bek-chart__svg bek-waffle-chart__grid"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          role="img"
          aria-label={label}
        >
          {parts.map((p) => (
            <g
              key={p.i}
              className="bek-chart__mark bek-waffle-chart__part"
              style={{ fill: colorOf(p.i) }}
            >
              {p.cells.map((c, k) => (
                <rect
                  key={k}
                  className="bek-waffle-chart__cell"
                  x={c.x}
                  y={c.y}
                  width={cellSize}
                  height={cellSize}
                />
              ))}
              <title>{`${data[p.i].label}: ${formatPercent(counts[p.i], { decimals: 0 })}`}</title>
            </g>
          ))}
          {remainderCells.length > 0 && (
            <g className="bek-waffle-chart__part bek-waffle-chart__part--remainder">
              {remainderCells.map((c, k) => (
                <rect
                  key={k}
                  className="bek-waffle-chart__cell"
                  x={c.x}
                  y={c.y}
                  width={cellSize}
                  height={cellSize}
                />
              ))}
            </g>
          )}
        </svg>
        <ul className="bek-waffle-chart__legend">
          {rows.map((r) => (
            <li key={r.label} className="bek-waffle-chart__item">
              <LegendItem variant="square" color={r.color}>
                {r.label}
              </LegendItem>
              <span className="bek-waffle-chart__value">
                {formatPercent(r.pct, { decimals: 0 })}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <DataTable
        caption={label}
        columns={['Category', 'Share']}
        rows={rows.map((r) => [r.label, formatPercent(r.pct, { decimals: 0 })])}
      />
    </figure>
  );
}
