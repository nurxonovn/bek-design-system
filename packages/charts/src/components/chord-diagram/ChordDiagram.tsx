import type { HTMLAttributes } from 'react';
import { cx } from '@bek/react';
import { chord, ribbon, type Chord } from 'd3-chord';
import { arc } from 'd3-shape';
import { seriesColor } from '../../core/color.js';
import { formatNumber } from '../../core/format.js';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH, r2 } from '../../core/geometry.js';
import { ChartSvg, DataTable } from '../../core/svg.js';

export type ChordDiagramVariant = 'default' | 'focus';

export interface ChordDiagramProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Kvadrat matritsa: `matrix[i][j]` — i guruhdan j guruhga oqim. 3–10 guruh. */
  matrix: number[][];
  /** Guruh nomlari (`matrix` tartibida). */
  labels: string[];
  /** `default` — hamma guruh rangda, `focus` — bitta guruh rangda, qolgani `dataviz/neutral`. */
  variant?: ChordDiagramVariant;
  /** Focus guruhi (nomi yoki indeksi); berilmasa — eng katta guruh. */
  focus?: string | number;
  width?: number;
  /** Chizma markazdagi kvadratda (`min(width, height)`, `scale/200`), cho'zilmaydi. */
  height?: number;
  formatValue?: (value: number) => string;
  /** Ekran o'quvchi uchun qisqa xulosa (eng katta 3 oqim jadval sarlavhasiga avtomatik qo'shiladi). */
  label: string;
}

const LABEL_ROOM = 18; // tepa/past yozuvlar uchun joy (Caption/S + label-gap)
const ARC_W = 8; // scale/8 — guruh yoyi qalinligi
const LABEL_GAP = 6;
const RIBBON_GAP = 2; // lenta va yoy orasi
const PAD_ANGLE = 0.04;

const anchorOf = (angle: number): 'start' | 'middle' | 'end' => {
  const s = Math.sin(angle);
  return Math.abs(s) < 0.15 ? 'middle' : s > 0 ? 'start' : 'end';
};

/**
 * Figma "4.18 Chart · Chord": guruhlar orasidagi ikki tomonlama oqim. Tashqi yoy — guruhning chiquvchi
 * jami, lenta — juftlik oqimi (har uchidagi eni — shu yo'nalishdagi oqim). Lentalar qatlam shaffofligi
 * (CSS `opacity`) bilan, rangi — kattaroq manba. Geometriya markazdagi kvadratda, cho'zilmaydi.
 */
export function ChordDiagram({
  matrix,
  labels,
  variant = 'default',
  focus,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  formatValue = (v) => formatNumber(v, { compact: true }),
  label,
  className,
  ...rest
}: ChordDiagramProps) {
  const n = Math.min(labels.length, matrix.length);
  const m = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => Math.max(0, Number(matrix[i]?.[j]) || 0)),
  );
  const layout = chord()
    .padAngle(PAD_ANGLE)
    .sortSubgroups((a, b) => b - a)(m);
  const outTotal = m.map((row) => row.reduce((a, v) => a + v, 0));
  const inTotal = m.map((_, j) => m.reduce((a, row) => a + row[j], 0));

  const side = Math.min(width, height);
  const outer = Math.max(0, side / 2 - LABEL_ROOM);
  const inner = Math.max(0, outer - ARC_W);
  const cx0 = width / 2;
  const cy0 = height / 2;
  const arcPath = arc<{ startAngle: number; endAngle: number }>()
    .innerRadius(inner)
    .outerRadius(outer);
  const ribbonPath = ribbon<Chord, Chord['source']>().radius(Math.max(0, inner - RIBBON_GAP));

  const biggest = outTotal.indexOf(Math.max(...outTotal, 0));
  const focusIndex =
    variant === 'focus'
      ? typeof focus === 'number'
        ? focus
        : focus != null && labels.indexOf(focus) >= 0
          ? labels.indexOf(focus)
          : biggest
      : -1;
  const on = (i: number) => focusIndex < 0 || i === focusIndex;
  // Focus: tanlangan guruh `dataviz/categorical/01`, qolgani `dataviz/neutral`.
  const arcColor = (i: number) =>
    focusIndex < 0 ? seriesColor(i) : on(i) ? seriesColor(0) : 'var(--bek-dataviz-neutral)';
  const touchesFocus = (c: Chord) => c.source.index === focusIndex || c.target.index === focusIndex;
  const ribbonColor = (c: Chord) =>
    focusIndex < 0
      ? seriesColor(c.source.index)
      : touchesFocus(c)
        ? seriesColor(0)
        : 'var(--bek-dataviz-neutral)';

  const flows = m
    .flatMap((row, i) => row.map((v, j) => ({ i, j, v })))
    .filter((f) => f.i !== f.j && f.v > 0)
    .sort((a, b) => b.v - a.v);
  const top3 = flows
    .slice(0, 3)
    .map((f) => `${labels[f.i]} → ${labels[f.j]} ${formatValue(f.v)}`)
    .join(', ');
  const focusNote = focusIndex >= 0 ? ` Focus: ${labels[focusIndex]}.` : '';

  return (
    <figure
      {...rest}
      className={cx('bek-chart', 'bek-chord-diagram', `bek-chord-diagram--${variant}`, className)}
    >
      <ChartSvg width={width} height={height} label={label}>
        <g className="bek-chord-diagram__canvas" transform={`translate(${r2(cx0)},${r2(cy0)})`}>
          <g className="bek-chord-diagram__ribbons">
            {layout.map((c) => (
              <path
                key={`${c.source.index}-${c.target.index}`}
                className={cx(
                  'bek-chart__mark bek-chord-diagram__ribbon',
                  `bek-chord-diagram__ribbon--${c.source.index}`,
                  `bek-chord-diagram__ribbon--${c.target.index}`,
                  focusIndex >= 0 && !touchesFocus(c) && 'bek-chord-diagram__ribbon--muted',
                )}
                d={(ribbonPath(c) as unknown as string | null) ?? undefined}
                style={{ fill: ribbonColor(c) }}
              >
                <title>{`${labels[c.source.index]} → ${labels[c.target.index]}: ${formatValue(m[c.source.index][c.target.index])} · ${labels[c.target.index]} → ${labels[c.source.index]}: ${formatValue(m[c.target.index][c.source.index])}`}</title>
              </path>
            ))}
          </g>
          {layout.groups.map((g) => {
            const mid = (g.startAngle + g.endAngle) / 2;
            const lr = outer + LABEL_GAP;
            const cos = Math.cos(mid);
            return (
              <g
                key={g.index}
                className={cx(
                  'bek-chart__mark bek-chord-diagram__group',
                  `bek-chord-diagram__arc--${g.index}`,
                  g.index === focusIndex && 'bek-chord-diagram__group--focus',
                )}
              >
                <path
                  className="bek-chord-diagram__arc"
                  d={arcPath(g) ?? undefined}
                  style={{ fill: arcColor(g.index) }}
                />
                <text
                  className="bek-chord-diagram__label"
                  x={r2(Math.sin(mid) * lr)}
                  y={r2(-cos * lr)}
                  dy={cos > 0.5 ? '0' : cos < -0.5 ? '0.71em' : '0.32em'}
                  textAnchor={anchorOf(mid)}
                  aria-hidden="true"
                >
                  {labels[g.index]}
                </text>
                <title>{`${labels[g.index]}: out ${formatValue(outTotal[g.index])} · in ${formatValue(inTotal[g.index])}`}</title>
              </g>
            );
          })}
        </g>
      </ChartSvg>
      <DataTable
        caption={`${label}.${top3 ? ` Top flows: ${top3}.` : ''}${focusNote}`}
        columns={['From \\ To', ...labels.slice(0, n)]}
        rows={m.map((row, i) => [labels[i], ...row.map((v) => formatValue(v))])}
      />
    </figure>
  );
}
