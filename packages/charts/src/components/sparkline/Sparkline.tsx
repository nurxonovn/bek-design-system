import type { SVGAttributes } from 'react';
import { cx } from '@bek/react';
import { line, curveMonotoneX } from 'd3-shape';
import { scaleLinear } from 'd3-scale';
import { extent } from 'd3-array';
import { r2 } from '../../core/geometry.js';
import type { Trend } from '../../core/color.js';

export type SparklineVariant = 'line' | 'bars';

export interface SparklineProps extends Omit<SVGAttributes<SVGSVGElement>, 'values'> {
  /** Oxirgi N qiymat (vaqt bo'yicha). */
  data: number[];
  /** `line` — trend chizig'i (Up · Down · Neutral), `bars` — ustunchalar, oxirgisi ajratilgan. */
  variant?: SparklineVariant;
  /** Rang yo'nalishi; berilmasa birinchi va oxirgi qiymatdan: up · down · neutral. */
  trend?: Trend;
  /** Jadvalda hamma qatorlar bir xil shkala uchun umumiy [min, max]. */
  domain?: [number, number];
  /** Figma `scale/128` × `chart/sparkline/height` (Mobile 32). */
  width?: number;
  height?: number;
  /** Ekran o'quvchi uchun: "Trend up over 7 days". */
  label: string;
}

/** Trend: oxirgi qiymat birinchisidan 0,5% dan ko'p farq qilsa up/down. */
export function sparklineTrend(data: number[]): Trend {
  if (data.length < 2) return 'neutral';
  const first = data[0];
  const last = data[data.length - 1];
  const base = Math.abs(first) || 1;
  const change = ((last - first) / base) * 100;
  return Math.abs(change) < 0.5 ? 'neutral' : change > 0 ? 'up' : 'down';
}

/** Figma "4.18 Chart · Sparkline": o'q, grid va yozuvsiz mikro-chart; oxirgi qiymatda nuqta. */
export function Sparkline({
  data,
  variant = 'line',
  trend,
  domain,
  width = 128,
  height = 32,
  label,
  className,
  ...rest
}: SparklineProps) {
  const t = trend ?? sparklineTrend(data);
  const pad = 3;
  const [lo, hi] = domain ?? (extent(data) as [number, number]);
  const y = scaleLinear()
    .domain([lo ?? 0, hi === lo ? (hi ?? 0) + 1 : (hi ?? 1)])
    .range([height - pad, pad]);
  const classes = cx(
    'bek-sparkline',
    `bek-sparkline--${variant}`,
    `bek-sparkline--${t}`,
    className,
  );

  if (variant === 'bars') {
    const n = data.length || 1;
    const step = width / n;
    const bw = Math.max(1, step * 0.6);
    const base = scaleLinear()
      .domain([Math.min(0, lo ?? 0), hi ?? 1])
      .range([height, pad]);
    return (
      <svg
        {...rest}
        className={classes}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={label}
      >
        {data.map((v, i) => (
          <rect
            key={i}
            className={
              i === n - 1 ? 'bek-sparkline__bar bek-sparkline__bar--last' : 'bek-sparkline__bar'
            }
            x={r2(i * step + (step - bw) / 2)}
            y={r2(base(Math.max(v, 0)))}
            width={r2(bw)}
            height={r2(Math.max(1, height - base(Math.max(v, 0))))}
            rx={1}
          />
        ))}
      </svg>
    );
  }

  const x = scaleLinear()
    .domain([0, Math.max(1, data.length - 1)])
    .range([pad, width - pad]);
  const d = line<number>()
    .x((_, i) => x(i))
    .y((v) => y(v))
    .curve(curveMonotoneX)(data);
  const last = data.length - 1;
  return (
    <svg
      {...rest}
      className={classes}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={label}
    >
      {d && <path className="bek-sparkline__line" d={d} />}
      {last >= 0 && (
        <circle className="bek-sparkline__dot" cx={r2(x(last))} cy={r2(y(data[last]))} r={2.5} />
      )}
    </svg>
  );
}
