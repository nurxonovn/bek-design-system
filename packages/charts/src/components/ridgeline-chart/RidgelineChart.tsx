import type { HTMLAttributes } from 'react';
import { cx } from '@bek-ui/react';
import { max as d3max, median, quantile } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { area, curveBasis, line } from 'd3-shape';
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
import { kernelDensity, samplePoints, silvermanBandwidth } from '../box-plot/stats.js';

/** Figma `Variant`: Default (hamma rangli) · Highlight (bitta guruh rangli, qolgani neutral). */
export type RidgelineChartVariant = 'default' | 'highlight';

export interface RidgelineDatum {
  /** Tartibli guruh (oy, kogorta, versiya). */
  group: string;
  /** Guruhning xom qiymatlari — zichlik komponent ichida hisoblanadi. */
  values: number[];
}

export interface RidgelineChartProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** 4–12 tartibli guruh (vaqt yoki rang bo'yicha; alifbo tartibida emas). */
  data: RidgelineDatum[];
  /** `highlight` berilsa standart `highlight`, aks holda `default`. */
  variant?: RidgelineChartVariant;
  /** Ajratiladigan guruh nomi ("Jun") — qolganlari `dataviz/neutral`. */
  highlight?: string;
  /** Qatorlar ustma-ust tushishi, cho'qqi balandligining ulushi (0…0,5; Figma: ≤ 50%). */
  overlap?: number;
  /** KDE kengligi — hamma qatorga bitta; standart Silverman (umumiy qiymatlardan). */
  bandwidth?: number;
  /** Qiymat o'qi chegaralari; standart — ma'lumotdan, chiroyli yaxlitlangan. */
  domain?: [number, number];
  width?: number;
  height?: number;
  ticks?: number;
  formatValue?: (value: number) => string;
  /** Ekran o'quvchi uchun qisqa xulosa. */
  label: string;
}

const GROUP_W = 48; // guruh nomlari ustuni (Figma sizes: 48)
const AXIS_H = 20;
const LABEL_GAP = 8; // chart/axis/label-gap
const TOP = 4;
const SPARSE_N = 20; // n < 20 → shtrix chiziq ("low sample")

interface RidgeStats {
  n: number;
  median?: number;
  p90?: number;
}

function ridgeStats(values: number[]): RidgeStats {
  const finite = values.filter(Number.isFinite).sort((a, b) => a - b);
  return { n: finite.length, median: median(finite), p90: quantile(finite, 0.9) };
}

/**
 * Figma "4.18 Chart · Ridgeline": tartibli guruhlar bo'yicha bir oz ustma-ust tushgan zichlik
 * egri chiziqlari — taqsimot vaqt bo'yicha qanday siljiganini ko'rsatadi.
 */
export function RidgelineChart({
  data,
  highlight,
  variant = highlight ? 'highlight' : 'default',
  overlap = 0.5,
  bandwidth,
  domain,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  ticks = DEFAULT_TICKS,
  formatValue = (v) => formatNumber(v, { compact: true }),
  label,
  className,
  ...rest
}: RidgelineChartProps) {
  const all = data.flatMap((d) => d.values.filter(Number.isFinite));
  const range: [number, number] = [GROUP_W, width - LABEL_GAP];
  const x = domain
    ? scaleLinear().domain(domain).range(range)
    : valueScale(all.length ? all : [0, 1], range, { ticks });
  const plotBottom = height - AXIS_H;
  const o = Math.min(0.5, Math.max(0, overlap));
  const n = Math.max(data.length, 1);
  // Qadam s, cho'qqi H = s / (1 − o): birinchi qator tepasida H joy, oxirgisi plotBottom da.
  const step = (plotBottom - TOP) / (n - 1 + 1 / (1 - o));
  const ridgeH = step / (1 - o);
  const xs = samplePoints(x.domain()[0], x.domain()[1], Math.max(24, (width - GROUP_W) / 4));
  const bw = bandwidth ?? silvermanBandwidth(all);
  const densities = data.map((d) => kernelDensity(d.values, xs, bw));
  const peak = d3max(densities.flat()) || 1;
  const tickValues = x.ticks(ticks);
  const isHighlight = variant === 'highlight';

  return (
    <figure
      {...rest}
      className={cx(
        'bek-chart',
        'bek-ridgeline-chart',
        `bek-ridgeline-chart--${variant}`,
        className,
      )}
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
          className="bek-ridgeline-chart__axis"
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
        <g className="bek-ridgeline-chart__plot">
          {data.map((d, i) => {
            const baseline = plotBottom - (n - 1 - i) * step;
            const y = (v: number) => baseline - (v / peak) * ridgeH;
            const areaPath =
              area<number>()
                .x((_, k) => x(xs[k]))
                .y0(baseline)
                .y1(y)
                .curve(curveBasis)(densities[i]) ?? '';
            const linePath =
              line<number>()
                .x((_, k) => x(xs[k]))
                .y(y)
                .curve(curveBasis)(densities[i]) ?? '';
            const s = ridgeStats(d.values);
            const active = !isHighlight || d.group === highlight;
            const tip =
              s.n === 0
                ? `${d.group}: n = 0`
                : `${d.group}: n = ${formatNumber(s.n)}, median ${formatValue(s.median ?? 0)}, P90 ${formatValue(s.p90 ?? 0)}${s.n < SPARSE_N ? ' · low sample' : ''}`;
            return (
              <g
                key={`${d.group}-${i}`}
                className={cx(
                  'bek-ridgeline-chart__ridge',
                  !active && 'bek-ridgeline-chart__ridge--muted',
                  active && isHighlight && 'bek-ridgeline-chart__ridge--highlight',
                  s.n < SPARSE_N && 'bek-ridgeline-chart__ridge--sparse',
                )}
                style={{ color: active ? seriesColor(0) : 'var(--bek-dataviz-neutral)' }}
              >
                <title>{tip}</title>
                <path className="bek-ridgeline-chart__knockout" d={areaPath} />
                <path className="bek-chart__mark bek-ridgeline-chart__area" d={areaPath} />
                <path className="bek-ridgeline-chart__line" d={linePath} />
                <text className="bek-ridgeline-chart__label" x={0} y={r2(baseline)} dy="-0.2em">
                  {d.group}
                </text>
              </g>
            );
          })}
        </g>
      </ChartSvg>
      <DataTable
        caption={label}
        columns={['Group', 'n', 'Median', 'P90']}
        rows={data.map((d) => {
          const s = ridgeStats(d.values);
          const f = (v: number | undefined) => (v == null ? '—' : formatValue(v));
          return [d.group, formatNumber(s.n), f(s.median), f(s.p90)];
        })}
      />
    </figure>
  );
}
