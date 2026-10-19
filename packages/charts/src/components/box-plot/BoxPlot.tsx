import type { HTMLAttributes } from 'react';
import { cx } from '@bek/react';
import { max as d3max } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { area, curveBasis } from 'd3-shape';
import { seriesColor } from '../../core/color.js';
import { formatNumber } from '../../core/format.js';
import {
  DEFAULT_HEIGHT,
  DEFAULT_TICKS,
  DEFAULT_WIDTH,
  r2,
  valueScale,
} from '../../core/geometry.js';
import { AxisBottom, ChartSvg, DataTable } from '../../core/svg.js';
import {
  boxStats,
  kernelDensity,
  samplePoints,
  silvermanBandwidth,
  type BoxStats,
} from './stats.js';

/** Figma `Variant`: Box · Violin · Box + points (`box-points`). */
export type BoxPlotVariant = 'box' | 'violin' | 'box-points';

export interface BoxPlotDatum {
  /** Guruh (qator): "Toshkent", "SME". */
  group: string;
  /** Guruhning xom qiymatlari — xulosa (Q1, mediana, Q3) komponent ichida hisoblanadi. */
  values: number[];
  /** Har qiymat yozuvi (chetlanish tooltip'i uchun): `labels[i]` ↔ `values[i]`. */
  labels?: string[];
}

export interface BoxPlotProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** 3–12 guruh; guruhlar qator bo'lib chiziladi (mobil'da yozuvlar o'qiladi). */
  data: BoxPlotDatum[];
  /** `box` (standart), `violin` — zichlik shakli + IQR, `box-points` — har qiymat quti ortida (n < 50). */
  variant?: BoxPlotVariant;
  /** Guruhlarni mediana bo'yicha kamayish tartibida saralash (tartib ma'noli bo'lmasa — Figma Usage). */
  sort?: boolean;
  /** Qiymat o'qi chegaralari; standart — ma'lumotdan, 0 bilan, chiroyli yaxlitlangan. */
  domain?: [number, number];
  width?: number;
  height?: number;
  /** Qiymat o'qi bo'linmalari (`chart/axis/tick-count`). */
  ticks?: number;
  formatValue?: (value: number) => string;
  /** Ekran o'quvchi uchun qisqa xulosa. */
  label: string;
}

const GROUP_W = 80; // scale/80 — guruh nomlari ustuni
const AXIS_H = 20; // X yozuvlari qatori
const LABEL_GAP = 8; // chart/axis/label-gap
const TOP = 4;
const BOX_MAX = 20; // quti balandligi chegarasi
const OUTLIER_R = 3;
const POINT_R = 2;

interface Row {
  d: BoxPlotDatum;
  stats: BoxStats | null;
}

/** Deterministik "jitter" (oltin kesim) — har renderda bir xil, server va klientda mos. */
const jitter = (i: number) => (((i + 1) * 0.618034) % 1) - 0.5;

function summary(d: BoxPlotDatum, s: BoxStats | null, f: (v: number) => string): string {
  if (!s) return `${d.group}: n = 0`;
  if (s.n === 1) return `${d.group}: n = 1, ${f(s.median)}`;
  return `${d.group}: n = ${formatNumber(s.n)}, min ${f(s.min)}, Q1 ${f(s.q1)}, median ${f(s.median)}, Q3 ${f(s.q3)}, max ${f(s.max)}`;
}

/**
 * Figma "4.18 Chart · Box plot": har guruh uchun besh sonli xulosa (min, Q1, mediana, Q3, max),
 * mo'ylov = 1,5 × IQR (Tukey), chetlanishlar — ichi bo'sh nuqta.
 */
export function BoxPlot({
  data,
  variant = 'box',
  sort = false,
  domain,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  ticks = DEFAULT_TICKS,
  formatValue = (v) => formatNumber(v, { compact: true }),
  label,
  className,
  ...rest
}: BoxPlotProps) {
  const base: Row[] = data.map((d) => ({ d, stats: boxStats(d.values) }));
  const rows = sort
    ? [...base].sort((a, b) => (b.stats?.median ?? -Infinity) - (a.stats?.median ?? -Infinity))
    : base;
  const all = data.flatMap((d) => d.values.filter(Number.isFinite));
  const range: [number, number] = [GROUP_W, width - LABEL_GAP];
  const x = domain
    ? scaleLinear().domain(domain).range(range)
    : valueScale(all.length ? all : [0, 1], range, { ticks });
  const plotBottom = height - AXIS_H;
  const rowH = (plotBottom - TOP) / Math.max(rows.length, 1);
  const boxH = Math.min(rowH * 0.6, BOX_MAX);
  const tickValues = x.ticks(ticks);
  const color = seriesColor(0);

  // Violin: hamma guruhga bitta kenglik va bitta balandlik shkalasi — shakllar solishtiriladi.
  const xs = samplePoints(x.domain()[0], x.domain()[1], Math.max(24, (width - GROUP_W) / 4));
  const bw = silvermanBandwidth(all);
  const densities =
    variant === 'violin'
      ? rows.map((r) => (r.stats && r.stats.n > 1 ? kernelDensity(r.d.values, xs, bw) : null))
      : [];
  const peak = d3max(densities.flatMap((dd) => dd ?? [])) || 1;

  return (
    <figure
      {...rest}
      className={cx('bek-chart', 'bek-box-plot', `bek-box-plot--${variant}`, className)}
    >
      <ChartSvg width={width} height={height} label={label}>
        <g className="bek-chart__grid" aria-hidden="true">
          {tickValues.map((t) => (
            <line
              key={t}
              className="bek-chart__gridline"
              x1={r2(x(t))}
              x2={r2(x(t))}
              y1={TOP}
              y2={r2(plotBottom)}
            />
          ))}
        </g>
        <line
          className="bek-box-plot__axis"
          x1={GROUP_W}
          x2={width}
          y1={r2(plotBottom)}
          y2={r2(plotBottom)}
          aria-hidden="true"
        />
        <AxisBottom
          y={plotBottom + LABEL_GAP}
          labels={tickValues.map((t) => ({ key: `${t}`, x: x(t), label: formatValue(t) }))}
        />
        <g className="bek-box-plot__plot" style={{ color }}>
          {rows.map(({ d, stats: s }, ri) => {
            const cy = TOP + rowH * ri + rowH / 2;
            const top = cy - boxH / 2;
            const density = densities[ri];
            return (
              <g key={`${d.group}-${ri}`} className="bek-box-plot__group">
                <title>{summary(d, s, formatValue)}</title>
                <text className="bek-box-plot__label" x={0} y={r2(cy)} dy="0.32em">
                  {d.group}
                </text>
                {!s && (
                  <text className="bek-box-plot__note" x={GROUP_W} y={r2(cy)} dy="0.32em">
                    n = 0
                  </text>
                )}
                {s && s.n === 1 && (
                  <>
                    <line
                      className="bek-box-plot__median"
                      x1={r2(x(s.median))}
                      x2={r2(x(s.median))}
                      y1={r2(top)}
                      y2={r2(top + boxH)}
                    />
                    <text
                      className="bek-box-plot__note"
                      x={r2(x(s.median) + LABEL_GAP)}
                      y={r2(cy)}
                      dy="0.32em"
                    >
                      n = 1
                    </text>
                  </>
                )}
                {s && s.n > 1 && variant === 'box-points' && (
                  <g className="bek-box-plot__points" aria-hidden="true">
                    {d.values.map((v, vi) =>
                      Number.isFinite(v) ? (
                        <circle
                          key={vi}
                          className="bek-box-plot__point"
                          cx={r2(x(v))}
                          cy={r2(cy + jitter(vi) * boxH * 0.9)}
                          r={POINT_R}
                        />
                      ) : null,
                    )}
                  </g>
                )}
                {s && s.n > 1 && variant === 'violin' && density && (
                  <>
                    <path
                      className="bek-chart__mark bek-box-plot__violin"
                      d={
                        area<number>()
                          .x((_, i) => x(xs[i]))
                          .y0((v) => cy - (v / peak) * (rowH * 0.45))
                          .y1((v) => cy + (v / peak) * (rowH * 0.45))
                          .curve(curveBasis)(density) ?? ''
                      }
                    />
                    <line
                      className="bek-box-plot__iqr"
                      x1={r2(x(s.q1))}
                      x2={r2(x(s.q3))}
                      y1={r2(cy)}
                      y2={r2(cy)}
                    />
                    <line
                      className="bek-box-plot__iqr-median"
                      x1={r2(x(s.median))}
                      x2={r2(x(s.median))}
                      y1={r2(cy - 2)}
                      y2={r2(cy + 2)}
                    />
                  </>
                )}
                {s && s.n > 1 && variant !== 'violin' && (
                  <>
                    <line
                      className="bek-box-plot__whisker"
                      x1={r2(x(s.whiskerLow))}
                      x2={r2(x(s.q1))}
                      y1={r2(cy)}
                      y2={r2(cy)}
                    />
                    <line
                      className="bek-box-plot__whisker"
                      x1={r2(x(s.q3))}
                      x2={r2(x(s.whiskerHigh))}
                      y1={r2(cy)}
                      y2={r2(cy)}
                    />
                    {[s.whiskerLow, s.whiskerHigh].map((w, wi) => (
                      <line
                        key={wi}
                        className="bek-box-plot__cap"
                        x1={r2(x(w))}
                        x2={r2(x(w))}
                        y1={r2(cy - boxH / 4)}
                        y2={r2(cy + boxH / 4)}
                      />
                    ))}
                    <rect
                      className="bek-chart__mark bek-box-plot__box"
                      x={r2(x(s.q1))}
                      y={r2(top)}
                      width={r2(Math.max(0, x(s.q3) - x(s.q1)))}
                      height={r2(boxH)}
                    />
                    <rect
                      className="bek-box-plot__outline"
                      x={r2(x(s.q1))}
                      y={r2(top)}
                      width={r2(Math.max(0, x(s.q3) - x(s.q1)))}
                      height={r2(boxH)}
                    />
                    <line
                      className="bek-box-plot__median"
                      x1={r2(x(s.median))}
                      x2={r2(x(s.median))}
                      y1={r2(top)}
                      y2={r2(top + boxH)}
                    />
                  </>
                )}
                {s &&
                  s.n > 1 &&
                  s.outliers.map((oi) => (
                    <circle
                      key={`o${oi}`}
                      className="bek-box-plot__outlier"
                      cx={r2(x(d.values[oi]))}
                      cy={r2(cy)}
                      r={OUTLIER_R}
                    >
                      <title>{`${d.labels?.[oi] ? `${d.labels[oi]} · ` : ''}${d.group}: ${formatValue(d.values[oi])}`}</title>
                    </circle>
                  ))}
              </g>
            );
          })}
        </g>
      </ChartSvg>
      <DataTable
        caption={label}
        columns={['Group', 'n', 'Min', 'Q1', 'Median', 'Q3', 'Max']}
        rows={rows.map(({ d, stats: s }) =>
          s
            ? [
                d.group,
                formatNumber(s.n),
                formatValue(s.min),
                formatValue(s.q1),
                formatValue(s.median),
                formatValue(s.q3),
                formatValue(s.max),
              ]
            : [d.group, '0', '—', '—', '—', '—', '—'],
        )}
      />
    </figure>
  );
}
