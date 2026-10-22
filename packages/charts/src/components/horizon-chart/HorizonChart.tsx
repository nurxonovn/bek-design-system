import type { HTMLAttributes } from 'react';
import { cx } from '@bek-ui/react';
import { max as d3max } from 'd3-array';
import { scalePoint } from 'd3-scale';
import { area, curveMonotoneX } from 'd3-shape';
import { formatNumber } from '../../core/format.js';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH, r2 } from '../../core/geometry.js';
import { AxisBottom, ChartSvg, DataTable } from '../../core/svg.js';
import { ChartLegend } from '../legend-item/LegendItem.js';

/** Figma `Variant`: Positive (ketma-ket 3 band) · Diverging (asosdan yuqori / past — ikki rang). */
export type HorizonChartVariant = 'positive' | 'diverging';

export interface HorizonDatum {
  /** Qator (hudud, servis). */
  series: string;
  /** Vaqt nuqtasi yozuvi ("06:00"); tartib — `data` dagi birinchi uchrash tartibi. */
  date: string;
  /** `null` — ma'lumot yo'q: trek ko'rinib turadi. Diverging'da manfiy — asosdan past. */
  value: number | null;
}

export interface HorizonChartProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Uzun format: qator × sana qiymati. 4–20 qator. */
  data: HorizonDatum[];
  /** `positive` (standart) yoki `diverging` — manfiy qiymatlar ikkinchi rangda. */
  variant?: HorizonChartVariant;
  /** Bandlar soni (1–3; Figma: 3). Har band bir xil balandlikda, ustma-ust buklanadi. */
  bands?: number;
  /** Bitta band qiymati — hamma qatorga bir xil; standart `max(|qiymat|) / bands`. */
  bandSize?: number;
  /** Qatorlar tartibi; standart — `data` dagi birinchi uchrash tartibi (cho'qqi vaqti yoki jami bo'yicha saralang). */
  series?: string[];
  /** Legend yozuvlari. Standart: Positive — band oralig'i ("0–40"), Diverging — "Above baseline", "Below baseline". */
  bandLabels?: string[];
  width?: number;
  /** Chizma balandligi (`scale/200`); legend tashqarida. Qator ≥ 24 px bo'lishi uchun qatorlar sonini kamaytiring. */
  height?: number;
  formatValue?: (value: number) => string;
  /** Ekran o'quvchi uchun qisqa xulosa. */
  label: string;
}

const ROW_W = 80; // scale/80 — qator nomlari ustuni
const AXIS_H = 20;
const LABEL_GAP = 8; // chart/axis/label-gap
const EDGE = 16; // oxirgi sana yozuvi kesilmasligi uchun
const ROW_GAP = 4; // qatorlar orasidagi bo'shliq
const MIN_LABEL_STEP = 48;

/** Band ranglari (och → to'q): Positive — sequential, Diverging — asosdan yuqori / past. */
const POSITIVE_FILLS = [
  'var(--bek-dataviz-sequential-300)',
  'var(--bek-dataviz-sequential-500)',
  'var(--bek-dataviz-sequential-700)',
];
const ABOVE_FILLS = [
  'var(--bek-dataviz-diverging-pos-2)',
  'var(--bek-dataviz-diverging-pos-3)',
  'var(--bek-dataviz-diverging-pos-4)',
];
const BELOW_FILLS = [
  'var(--bek-dataviz-diverging-neg-2)',
  'var(--bek-dataviz-diverging-neg-3)',
  'var(--bek-dataviz-diverging-neg-4)',
];

/** `bands` ta band uchun daraja indekslari (3 → hammasi; 2 → och va to'q; 1 → o'rta). */
const levelIndexes = (bands: number): number[] =>
  bands >= 3 ? [0, 1, 2] : bands === 2 ? [0, 2] : [1];

/**
 * Figma "4.18 Chart · Horizon": zich vaqt qatorlari — har qator qiymatini 3 ta teng balandlikdagi
 * rang bandiga buklaydi; ko'p seriya kam joyga sig'adi. Diverging — manfiy qiymat ikkinchi rangda.
 */
export function HorizonChart({
  data,
  variant = 'positive',
  bands: bandsProp = 3,
  bandSize,
  series: seriesOrder,
  bandLabels,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  formatValue = (v) => formatNumber(v, { compact: true }),
  label,
  className,
  ...rest
}: HorizonChartProps) {
  const bands = Math.min(3, Math.max(1, Math.round(bandsProp)));
  const diverging = variant === 'diverging';
  const dates = [...new Set(data.map((d) => d.date))];
  const names = seriesOrder ?? [...new Set(data.map((d) => d.series))];
  const valueOf = new Map(data.map((d) => [`${d.series}\u0000${d.date}`, d.value]));
  const get = (name: string, date: string): number | null => {
    const v = valueOf.get(`${name}\u0000${date}`);
    return v != null && Number.isFinite(v) ? v : null;
  };
  const magnitude = (v: number) => (diverging ? Math.abs(v) : Math.max(0, v));
  const peak = d3max(data, (d) => (d.value != null ? magnitude(d.value) : 0)) || 1;
  const band = bandSize && bandSize > 0 ? bandSize : peak / bands;
  const levels = levelIndexes(bands);
  const posColor = (k: number) => (diverging ? ABOVE_FILLS : POSITIVE_FILLS)[levels[k]];
  const negColor = (k: number) => BELOW_FILLS[levels[k]];

  const plotBottom = height - AXIS_H;
  const n = Math.max(names.length, 1);
  const rowH = Math.max(1, (plotBottom - ROW_GAP * (n - 1)) / n);
  const x = scalePoint<number>()
    .domain(dates.map((_, i) => i))
    .range([ROW_W, width - EDGE]);
  const every = Math.max(
    1,
    Math.ceil((dates.length * MIN_LABEL_STEP) / Math.max(1, width - EDGE - ROW_W)),
  );

  const bandPath = (name: string, k: number, sign: 1 | -1, bottom: number) =>
    area<number>()
      .defined((i) => get(name, dates[i]) != null)
      .x((i) => x(i) ?? 0)
      .y0(bottom)
      .y1((i) => {
        const v = (get(name, dates[i]) ?? 0) * sign;
        const part = Math.min(band, Math.max(0, v - k * band));
        return bottom - (part / band) * rowH;
      })
      .curve(curveMonotoneX)(dates.map((_, i) => i)) ?? '';

  const legend = diverging
    ? [
        { label: bandLabels?.[0] ?? 'Above baseline', color: posColor(Math.min(1, bands - 1)) },
        { label: bandLabels?.[1] ?? 'Below baseline', color: negColor(Math.min(1, bands - 1)) },
      ]
    : levels.map((_, k) => ({
        label: bandLabels?.[k] ?? `${formatValue(k * band)}–${formatValue((k + 1) * band)}`,
        color: posColor(k),
      }));

  const rowSummary = (name: string) => {
    const vals = dates
      .map((date) => ({ date, v: get(name, date) }))
      .filter((d): d is { date: string; v: number } => d.v != null);
    if (vals.length === 0) return `${name}: no data`;
    const top = vals.reduce((a, b) => (b.v > a.v ? b : a));
    const low = vals.reduce((a, b) => (b.v < a.v ? b : a));
    const missing = dates.length - vals.length;
    return `${name}: max ${formatValue(top.v)} (${top.date}), min ${formatValue(low.v)} (${low.date})${missing ? ` · ${formatNumber(missing)} no data` : ''}`;
  };

  return (
    <figure
      {...rest}
      className={cx('bek-chart', 'bek-horizon-chart', `bek-horizon-chart--${variant}`, className)}
    >
      <ChartSvg width={width} height={height} label={label}>
        <g className="bek-horizon-chart__plot">
          {names.map((name, ri) => {
            const top = ri * (rowH + ROW_GAP);
            const bottom = top + rowH;
            const kinds: { sign: 1 | -1; color: (k: number) => string }[] = diverging
              ? [
                  { sign: 1, color: posColor },
                  { sign: -1, color: negColor },
                ]
              : [{ sign: 1, color: posColor }];
            return (
              <g key={name} className="bek-horizon-chart__row">
                <title>{rowSummary(name)}</title>
                <text className="bek-horizon-chart__label" x={0} y={r2(top + rowH / 2)} dy="0.32em">
                  {name}
                </text>
                <rect
                  className="bek-horizon-chart__track"
                  x={ROW_W}
                  y={r2(top)}
                  width={r2(Math.max(0, width - EDGE - ROW_W))}
                  height={r2(rowH)}
                />
                {kinds.flatMap(({ sign, color }) =>
                  levels.map((_, k) => (
                    <path
                      key={`${sign}-${k}`}
                      className={cx(
                        'bek-chart__mark',
                        'bek-horizon-chart__band',
                        sign < 0 && 'bek-horizon-chart__band--negative',
                      )}
                      style={{ fill: color(k) }}
                      d={bandPath(name, k, sign, bottom)}
                    />
                  )),
                )}
              </g>
            );
          })}
        </g>
        <line
          className="bek-horizon-chart__axis"
          x1={ROW_W}
          x2={r2(width - EDGE)}
          y1={r2(plotBottom)}
          y2={r2(plotBottom)}
          aria-hidden="true"
        />
        <AxisBottom
          y={plotBottom + LABEL_GAP}
          labels={dates
            .map((d, i) => ({ key: `${i}`, x: x(i) ?? 0, label: d }))
            .filter(
              (_, i) => i % every === 0 || (i === dates.length - 1 && i % every >= every / 2),
            )}
        />
      </ChartSvg>
      <ChartLegend items={legend.map((l) => ({ ...l, variant: 'square' }))} />
      <DataTable
        caption={label}
        columns={['Date', ...names]}
        rows={dates.map((date) => [
          date,
          ...names.map((name) => {
            const v = get(name, date);
            return v == null ? '—' : formatValue(v);
          }),
        ])}
      />
    </figure>
  );
}
