import type { HTMLAttributes } from 'react';
import { cx } from '@bek-ui/react';
import { textCellLevel } from '../../core/color.js';
import { formatNumber, formatPercent } from '../../core/format.js';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH, r2 } from '../../core/geometry.js';
import { ChartSvg, DataTable } from '../../core/svg.js';

export type CohortHeatmapVariant = 'percent' | 'absolute';

export interface Cohort {
  /** Kogorta nomi: "Jan 2026". */
  label: string;
  /** Boshlang'ich hajm (M0 dagi foydalanuvchilar). */
  size: number;
  /** Har davr uchun saqlanish, % (M0 = 100). Yangi kogortada qisqaroq bo'ladi — uchburchak. */
  values: number[];
}

export interface CohortHeatmapProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  cohorts: Cohort[];
  /** `percent` — M0 ulushi, `absolute` — sonlar (`size × %`). */
  variant?: CohortHeatmapVariant;
  /** Ustun nomlari; standart `M0`, `M1`, … */
  periods?: string[];
  /** Sarlavha matnlari (uz: "Kogorta", "Foydalanuvchi"). */
  cohortLabel?: string;
  sizeLabel?: string;
  /** Katakchalar maydoni eni (tor ekranda gorizontal skroll, kogorta ustuni joyida qoladi). */
  width?: number;
  /** Maksimal balandlik; qator balandligi kogortalar soniga qarab. */
  height?: number;
  label: string;
}

const LABEL_W = 72; // kogorta nomi
const SIZE_W = 48; // scale/48 — Users
const HEADER_H = 20;
const GAP = 4; // scale/4 — katak oralig'i va radiusi
const MIN_CELL = 40; // scale/40 — tor ekranda katak eni
const ROW_MAX = 28;
const ROW_MIN = 20;

/**
 * Figma "4.18 Chart · Cohort heatmap": kogorta bo'yicha saqlanish — qatorlar kogortalar, ustunlar
 * boshlanishdan keyingi oylar. Kataklar faqat `dataviz/sequential` 200 · 300 · 600 · 700 da (CMP-07),
 * matn 200/300 da `text/primary`, 600/700 da `text/inverse` — ikkala rejimda ≥ 4.5:1.
 */
export function CohortHeatmap({
  cohorts,
  variant = 'percent',
  periods,
  cohortLabel = 'Cohort',
  sizeLabel = 'Users',
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  label,
  className,
  ...rest
}: CohortHeatmapProps) {
  const cols = Math.max(0, ...cohorts.map((c) => c.values.length));
  const heads = periods ?? Array.from({ length: cols }, (_, i) => `M${i}`);
  const rowH = Math.max(
    ROW_MIN,
    Math.min(ROW_MAX, (height - HEADER_H) / Math.max(cohorts.length, 1)),
  );
  const svgH = HEADER_H + cohorts.length * rowH;
  const step = Math.max(MIN_CELL, (width - LABEL_W - SIZE_W) / Math.max(cols, 1));
  const cellsW = step * cols;
  const all = cohorts.flatMap((c) => c.values);
  const lo = all.length ? Math.min(...all) : 0;
  const hi = all.length ? Math.max(...all) : 1;
  // Rang ulushi — eng past saqlanishdan (0) eng yuqorisigacha (1); Absolute'da ham shu ulush.
  const share = (v: number) => (hi > lo ? (v - lo) / (hi - lo) : 1);
  const valueText = (c: Cohort, v: number) =>
    variant === 'absolute'
      ? formatNumber(Math.round((c.size * v) / 100))
      : formatPercent(v, { decimals: 0 });

  return (
    <figure
      {...rest}
      className={cx('bek-chart', 'bek-cohort-heatmap', `bek-cohort-heatmap--${variant}`, className)}
    >
      <div className="bek-cohort-heatmap__body">
        <svg
          className="bek-chart__svg bek-cohort-heatmap__labels"
          width={LABEL_W + SIZE_W}
          height={svgH}
          viewBox={`0 0 ${LABEL_W + SIZE_W} ${svgH}`}
          aria-hidden="true"
        >
          <text className="bek-cohort-heatmap__head" x={0} y={HEADER_H / 2} dy="0.32em">
            {cohortLabel}
          </text>
          <text className="bek-cohort-heatmap__head" x={LABEL_W} y={HEADER_H / 2} dy="0.32em">
            {sizeLabel}
          </text>
          {cohorts.map((c, ri) => {
            const cy = HEADER_H + ri * rowH + rowH / 2;
            return (
              <g key={ri}>
                <text className="bek-cohort-heatmap__cohort" x={0} y={r2(cy)} dy="0.32em">
                  {c.label}
                </text>
                <text className="bek-cohort-heatmap__size" x={LABEL_W} y={r2(cy)} dy="0.32em">
                  {formatNumber(c.size)}
                </text>
              </g>
            );
          })}
        </svg>
        {/* Skroll maydoni klaviaturadan ham suriladi (tabIndex). */}
        <div className="bek-cohort-heatmap__scroll bek-focus-ring" tabIndex={0}>
          <ChartSvg width={cellsW} height={svgH} label={label}>
            {heads.map((h, ci) => (
              <text
                key={ci}
                className="bek-cohort-heatmap__head"
                x={r2(ci * step + (step - GAP) / 2)}
                y={HEADER_H / 2}
                dy="0.32em"
                textAnchor="middle"
                aria-hidden="true"
              >
                {h}
              </text>
            ))}
            {cohorts.map((c, ri) => (
              <g key={ri} className="bek-cohort-heatmap__row">
                {c.values.map((v, ci) => {
                  const level = textCellLevel(share(v));
                  const x = ci * step;
                  const y = HEADER_H + ri * rowH;
                  return (
                    <g
                      key={ci}
                      className={cx(
                        'bek-chart__mark bek-cohort-heatmap__cell',
                        `bek-cohort-heatmap__cell--${level}`,
                      )}
                    >
                      <rect
                        x={r2(x)}
                        y={r2(y)}
                        width={r2(step - GAP)}
                        height={r2(rowH - GAP)}
                        rx={GAP}
                      />
                      <text
                        x={r2(x + (step - GAP) / 2)}
                        y={r2(y + (rowH - GAP) / 2)}
                        dy="0.32em"
                        textAnchor="middle"
                      >
                        {valueText(c, v)}
                      </text>
                      <title>
                        {`${c.label} · ${heads[ci] ?? `M${ci}`}: ${formatPercent(v, { decimals: 0 })} (${formatNumber(Math.round((c.size * v) / 100))})`}
                      </title>
                    </g>
                  );
                })}
              </g>
            ))}
          </ChartSvg>
        </div>
      </div>
      <DataTable
        caption={label}
        columns={[cohortLabel, sizeLabel, ...heads]}
        rows={cohorts.map((c) => [
          c.label,
          formatNumber(c.size),
          ...heads.map((_, i) => (c.values[i] == null ? '—' : valueText(c, c.values[i]))),
        ])}
      />
    </figure>
  );
}
