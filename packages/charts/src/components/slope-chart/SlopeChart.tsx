import type { HTMLAttributes } from 'react';
import { cx } from '@bek-ui/react';
import { formatNumber } from '../../core/format.js';
import { DEFAULT_WIDTH, r2, valueScale } from '../../core/geometry.js';
import { ChartSvg, DataTable } from '../../core/svg.js';

export type SlopeChartVariant = 'default' | 'highlight';

export interface SlopeDatum {
  label: string;
  /** Birinchi davr qiymati. */
  from: number;
  /** Ikkinchi davr qiymati. */
  to: number;
}

export interface SlopeChartProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** 3–10 element. */
  data: SlopeDatum[];
  /** Davr nomlari (o'q sarlavhalari): `['2025', '2026']`. */
  periods?: [string, string];
  /**
   * `default` — rang yo'nalish bo'yicha (o'sish `dataviz/positive`, pasayish `dataviz/negative`);
   * `highlight` — bitta element seriya rangida, qolganlari 45%. `highlight` berilsa standart — `highlight`.
   */
  variant?: SlopeChartVariant;
  /** Ajratiladigan element `label`i (Highlight). Berilmasa — birinchi element. */
  highlight?: string;
  width?: number;
  /** Chizma balandligi — `scale/200`, qurilmadan qat'i nazar o'zgarmaydi. */
  height?: number;
  formatValue?: (value: number) => string;
  /** Ekran o'quvchi uchun qisqa xulosa. */
  label: string;
}

const SPAN = 200; // scale/200 — ikki o'q orasi (shakl buzilmaydi)
const LABEL_GAP = 8; // chart/axis/label-gap
const HEADER = 24; // davr yozuvlari qatori
const PAD = 8;
const MIN_GAP = 16; // yozuvlar orasidagi eng kichik masofa (Caption/M qatori)
const POINT_R = 4; // chart/point/size (8) / 2

/** Yozuvlarni ustma-ust tushmasligi uchun surish (Figma: "nudge labels, never overlap"). */
function nudge(ys: number[], lo: number, hi: number): number[] {
  const order = ys.map((y, i) => ({ y, i })).sort((a, b) => a.y - b.y);
  const out = order.map((o) => Math.max(lo, o.y));
  for (let k = 1; k < out.length; k += 1) out[k] = Math.max(out[k], out[k - 1] + MIN_GAP);
  for (let k = out.length - 1; k >= 0; k -= 1) {
    const cap = k === out.length - 1 ? hi : out[k + 1] - MIN_GAP;
    out[k] = Math.max(lo, Math.min(out[k], cap));
  }
  const res = new Array<number>(ys.length);
  order.forEach((o, k) => {
    res[o.i] = out[k];
  });
  return res;
}

/** Figma "4.18 Chart · Slope": ikki nuqta orasidagi o'zgarish; uchlaridagi yozuvlar o'q o'rnini bosadi. */
export function SlopeChart({
  data,
  periods = ['Before', 'After'],
  highlight,
  variant = highlight != null ? 'highlight' : 'default',
  width = DEFAULT_WIDTH,
  height = 200,
  formatValue = (v) => formatNumber(v, { compact: true }),
  label,
  className,
  ...rest
}: SlopeChartProps) {
  const x1 = r2(Math.max(0, (width - SPAN) / 2));
  const x2 = r2(x1 + SPAN);
  const top = HEADER + PAD;
  const bottom = height - PAD;
  const y = valueScale(
    data.flatMap((d) => [d.from, d.to]),
    [bottom, top],
    { zero: false },
  );
  const leftY = nudge(
    data.map((d) => y(d.from)),
    top,
    bottom,
  );
  const rightY = nudge(
    data.map((d) => y(d.to)),
    top,
    bottom,
  );
  const active = variant === 'highlight' ? (highlight ?? data[0]?.label) : undefined;
  const direction = (d: SlopeDatum) => (d.to > d.from ? 'up' : d.to < d.from ? 'down' : 'flat');
  // Ajratilgan element oxirida chiziladi — xiralashganlar ustida turadi.
  const order = data
    .map((_, i) => i)
    .sort((a, b) => Number(data[a].label === active) - Number(data[b].label === active));
  const word = { up: 'up', down: 'down', flat: 'no change' } as const;

  return (
    <figure
      {...rest}
      className={cx('bek-chart', 'bek-slope-chart', `bek-slope-chart--${variant}`, className)}
    >
      <ChartSvg width={width} height={height} label={label}>
        <g className="bek-slope-chart__axes" aria-hidden="true">
          {[x1, x2].map((ax, i) => (
            <g key={i}>
              <text
                className="bek-slope-chart__period"
                x={ax}
                y={PAD}
                dy="0.71em"
                textAnchor="middle"
              >
                {periods[i]}
              </text>
              <line className="bek-slope-chart__axis" x1={ax} x2={ax} y1={HEADER} y2={height} />
            </g>
          ))}
        </g>
        <g className="bek-slope-chart__plot">
          {order.map((i) => {
            const d = data[i];
            const dir = direction(d);
            const isActive = active === d.label;
            const muted = active != null && !isActive;
            const ya = r2(y(d.from));
            const yb = r2(y(d.to));
            return (
              <g
                key={d.label}
                className={cx(
                  'bek-slope-chart__item',
                  `bek-slope-chart__item--${dir}`,
                  isActive && 'bek-slope-chart__item--active',
                  muted && 'bek-slope-chart__item--muted',
                )}
              >
                <title>{`${d.label} ${formatValue(d.from)} → ${formatValue(d.to)}, ${word[dir]}`}</title>
                <line
                  className="bek-chart__mark bek-slope-chart__line"
                  x1={x1}
                  y1={ya}
                  x2={x2}
                  y2={yb}
                />
                <circle className="bek-slope-chart__point" cx={x1} cy={ya} r={POINT_R} />
                <circle className="bek-slope-chart__point" cx={x2} cy={yb} r={POINT_R} />
                <text
                  className="bek-slope-chart__start"
                  x={x1 - LABEL_GAP}
                  y={r2(leftY[i])}
                  dy="0.32em"
                  textAnchor="end"
                >
                  <tspan className="bek-slope-chart__name">{d.label}</tspan>
                  <tspan className="bek-slope-chart__value" dx="6">
                    {formatValue(d.from)}
                  </tspan>
                </text>
                <text
                  className="bek-slope-chart__value"
                  x={x2 + LABEL_GAP}
                  y={r2(rightY[i])}
                  dy="0.32em"
                >
                  {formatValue(d.to)}
                </text>
              </g>
            );
          })}
        </g>
      </ChartSvg>
      <DataTable
        caption={label}
        columns={['Item', periods[0], periods[1], 'Change']}
        rows={data.map((d) => [
          d.label,
          formatValue(d.from),
          formatValue(d.to),
          formatNumber(d.to - d.from, { signed: true }),
        ])}
      />
    </figure>
  );
}
