import type { HTMLAttributes } from 'react';
import { cx } from '@bek/react';
import { seriesColor } from '../../core/color.js';
import { formatNumber } from '../../core/format.js';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH, r2 } from '../../core/geometry.js';
import { ChartSvg, DataTable } from '../../core/svg.js';
import { ChartLegend } from '../legend-item/LegendItem.js';

export type RadarChartVariant = 'single' | 'compare';

export interface RadarSeries {
  /** Profil nomi (legend): "BEK", "Market avg.". */
  name: string;
  /** Har o'q uchun ball — `axes` tartibida, bir xil shkalada (0…`max`). */
  values: number[];
  /** Standart — `seriesColor(i)`. */
  color?: string;
}

export interface RadarChartProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** 5–8 o'lchov nomi: `['Speed', 'Quality', 'Cost', …]`. */
  axes: string[];
  /** Profillar; Compare'da ko'pi bilan 3 ta. */
  series: RadarSeries[];
  /** `single` — bitta profil, `compare` — 2–3 profil + legend. Standart: seriyalar soniga qarab. */
  variant?: RadarChartVariant;
  /** Shkala yuqori chegarasi (hamma o'qlar uchun bir xil). Standart 100. */
  max?: number;
  /** SVG eni; chizma markazdagi kvadratda, cho'zilmaydi. */
  width?: number;
  /** SVG balandligi (`scale/200` — doimiy). */
  height?: number;
  formatValue?: (value: number) => string;
  /** Ekran o'quvchi uchun qisqa xulosa. */
  label: string;
}

/** Halqalar: 33 · 66 · 100% (Figma Anatomy). */
const RINGS = [1 / 3, 2 / 3, 1];
/** O'q yozuvlari uchun joy (yozuv chiziq uchidan `chart/axis/label-gap` = 8 narida). */
const LABEL_ROOM = 28;
const LABEL_GAP = 8;
const POINT_R = 3;
const MAX_COMPARE = 3;

const polar = (cx0: number, cy0: number, r: number, angle: number): [number, number] => [
  cx0 + r * Math.sin(angle),
  cy0 - r * Math.cos(angle),
];

const anchorOf = (angle: number): 'start' | 'middle' | 'end' => {
  const s = Math.sin(angle);
  return Math.abs(s) < 0.2 ? 'middle' : s > 0 ? 'start' : 'end';
};

/**
 * Figma "4.18 Chart · Radar": 5–8 sifat o'lchovi bo'yicha profil, bitta 0–100 shkalada.
 * Geometriya markazdagi kvadratda — kenglik o'zgarsa ham shakl buzilmaydi.
 */
export function RadarChart({
  axes,
  series,
  variant = series.length > 1 ? 'compare' : 'single',
  max = 100,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  formatValue = (v) => formatNumber(v),
  label,
  className,
  ...rest
}: RadarChartProps) {
  const shown = variant === 'single' ? series.slice(0, 1) : series.slice(0, MAX_COMPARE);
  const side = Math.min(width, height);
  const radius = Math.max(0, side / 2 - LABEL_ROOM);
  const cx0 = width / 2;
  const cy0 = height / 2;
  const n = Math.max(axes.length, 1);
  const angleOf = (i: number) => (i / n) * Math.PI * 2;
  const top = max > 0 ? max : 1;
  const colorOf = (s: RadarSeries, i: number) => s.color ?? seriesColor(i);
  const ringPath = (k: number) =>
    axes
      .map((_, i) => polar(cx0, cy0, radius * k, angleOf(i)))
      .map(([x, y], i) => `${i ? 'L' : 'M'}${r2(x)},${r2(y)}`)
      .join('') + 'Z';
  const pointsOf = (s: RadarSeries) =>
    axes.map((_, i) => {
      const v = Math.max(0, Math.min(top, s.values[i] ?? 0));
      return polar(cx0, cy0, (v / top) * radius, angleOf(i));
    });

  return (
    <figure
      {...rest}
      className={cx('bek-chart', 'bek-radar-chart', `bek-radar-chart--${variant}`, className)}
    >
      {variant === 'compare' && shown.length > 1 && (
        <ChartLegend items={shown.map((s, i) => ({ label: s.name, color: colorOf(s, i) }))} />
      )}
      <ChartSvg width={width} height={height} label={label}>
        <g className="bek-radar-chart__grid" aria-hidden="true">
          {RINGS.map((k) => (
            <path key={k} className="bek-radar-chart__ring" d={ringPath(k)} />
          ))}
        </g>
        {axes.map((a, i) => {
          const [x, y] = polar(cx0, cy0, radius, angleOf(i));
          const [lx, ly] = polar(cx0, cy0, radius + LABEL_GAP, angleOf(i));
          const c = Math.cos(angleOf(i));
          return (
            <g key={i} className="bek-radar-chart__axis">
              <line
                className="bek-radar-chart__spoke"
                x1={r2(cx0)}
                y1={r2(cy0)}
                x2={r2(x)}
                y2={r2(y)}
              />
              <text
                className="bek-chart__tick"
                x={r2(lx)}
                y={r2(ly)}
                dy={c > 0.3 ? '0' : c < -0.3 ? '0.71em' : '0.32em'}
                textAnchor={anchorOf(angleOf(i))}
              >
                {a}
              </text>
              <title>{`${a}: ${shown.map((s) => `${s.name} ${formatValue(s.values[i] ?? 0)}`).join(', ')}`}</title>
            </g>
          );
        })}
        {shown.map((s, si) => {
          const pts = pointsOf(s);
          const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${r2(x)},${r2(y)}`).join('') + 'Z';
          return (
            <g
              key={si}
              className="bek-chart__mark bek-radar-chart__series"
              style={{ color: colorOf(s, si) }}
            >
              <path className="bek-radar-chart__area" d={d} />
              <path className="bek-radar-chart__outline" d={d} />
              {pts.map(([x, y], i) => (
                <circle
                  key={i}
                  className="bek-radar-chart__point"
                  cx={r2(x)}
                  cy={r2(y)}
                  r={POINT_R}
                />
              ))}
              <title>{s.name}</title>
            </g>
          );
        })}
      </ChartSvg>
      <DataTable
        caption={label}
        columns={['Dimension', ...shown.map((s) => s.name)]}
        rows={axes.map((a, i) => [a, ...shown.map((s) => formatValue(s.values[i] ?? 0))])}
      />
    </figure>
  );
}
