import type { HTMLAttributes } from 'react';
import { cx } from '@bek/react';
import { formatNumber, formatPercent } from '../../core/format.js';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH, r2, roundedBar } from '../../core/geometry.js';
import { ChartSvg, DataTable } from '../../core/svg.js';

export type FunnelChartVariant = 'stepped' | 'horizontal';

export interface FunnelStep {
  /** Bosqich nomi (jarayon tartibida — qiymat bo'yicha saralanmaydi). */
  label: string;
  value: number;
}

export interface FunnelChartProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** 3–7 bosqich, bir xil birlikda. */
  steps: FunnelStep[];
  /** `stepped` — ustunlar + oqim maydoni, bosqichdan bosqichga %; `horizontal` — markazlashgan chiziqlar, birinchi bosqichdan ulush. */
  variant?: FunnelChartVariant;
  /** Eng katta tushishni ajratish (Figma: "Biggest drop"). */
  highlightDrop?: boolean;
  width?: number;
  /** Stepped: ustunlar balandligi (`chart/height/md`: 200 / 240 / 320). */
  height?: number;
  /** Horizontal: chiziq qalinligi (`chart/bar/thickness`: 16 / 24 / 32). */
  barThickness?: number;
  formatValue?: (value: number) => string;
  /** Ekran o'quvchi uchun qisqa xulosa. */
  label: string;
}

const RADIUS = 4; // chart/bar/radius
const LABEL_GAP = 8; // chart/axis/label-gap
const LABELS_H = 44; // nom (Caption/M) + son (Label/S)
const ROW = 28; // Horizontal qator balandligi
const NAME_W = 80; // scale/80
const VALUE_W = 96;
const COL_GAP = 12; // scale/12
const FLOW_RATIO = 0.8;

const pct = (part: number, whole: number) => (whole > 0 ? (part / whole) * 100 : 0);

/**
 * Figma "4.18 Chart · Funnel": tartiblangan bosqichlar orqali konversiya (onboarding, checkout, ariza).
 */
export function FunnelChart({
  steps,
  variant = 'stepped',
  highlightDrop = true,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  barThickness = 16,
  formatValue = (v) => formatNumber(v),
  label,
  className,
  ...rest
}: FunnelChartProps) {
  const top = Math.max(0, ...steps.map((s) => s.value));
  const firstValue = steps[0]?.value ?? 0;
  const conv = steps.map((s, i) => (i === 0 ? 100 : pct(s.value, steps[i - 1].value)));
  // Eng katta tushish: bosqichdan bosqichga eng past konversiya.
  const drop =
    steps.length > 1 ? conv.slice(1).reduce((b, c, i) => (c < conv[b] ? i + 1 : b), 1) : -1;
  const whole = (v: number) => formatPercent(v, { decimals: 0 });
  const tip = (s: FunnelStep, i: number) =>
    i === 0
      ? `${s.label}: ${formatValue(s.value)}`
      : `${s.label}: ${formatValue(s.value)} · ${whole(conv[i])} of previous · ${whole(pct(s.value, firstValue))} of first`;
  const table = (
    <DataTable
      caption={label}
      columns={['Step', 'Count', 'From previous', 'From first']}
      rows={steps.map((s, i) => [
        s.label,
        formatValue(s.value),
        whole(conv[i]),
        whole(pct(s.value, firstValue)),
      ])}
    />
  );

  if (variant === 'horizontal') {
    const h = Math.max(1, steps.length) * ROW;
    const trackX = NAME_W + COL_GAP;
    const trackW = Math.max(0, width - NAME_W - VALUE_W - COL_GAP * 2);
    const bw = Math.min(barThickness, ROW - 4);
    return (
      <figure
        {...rest}
        className={cx('bek-chart', 'bek-funnel-chart', 'bek-funnel-chart--horizontal', className)}
      >
        <ChartSvg width={width} height={h} label={label}>
          {steps.map((s, i) => {
            const w = top ? (trackW * Math.max(0, s.value)) / top : 0;
            const cy = i * ROW + ROW / 2;
            return (
              <g key={i} className="bek-chart__mark bek-funnel-chart__step">
                <text className="bek-funnel-chart__name" x={0} y={r2(cy)} dy="0.32em">
                  {s.label}
                </text>
                <rect
                  className="bek-funnel-chart__bar"
                  x={r2(trackX + (trackW - w) / 2)}
                  y={r2(cy - bw / 2)}
                  width={r2(w)}
                  height={bw}
                />
                <text
                  className="bek-funnel-chart__count"
                  x={width}
                  y={r2(cy)}
                  dy="0.32em"
                  textAnchor="end"
                >
                  {formatValue(s.value)}
                  <tspan className="bek-funnel-chart__share" dx={4}>
                    {whole(pct(s.value, firstValue))}
                  </tspan>
                </text>
                <title>{tip(s, i)}</title>
              </g>
            );
          })}
        </ChartSvg>
        {table}
      </figure>
    );
  }

  const n = Math.max(1, steps.length);
  // Ustun : oqim oralig'i = 1 : 0.8 — oxirgi ustun o'ng chetga tegadi.
  const barW = width / (n + FLOW_RATIO * (n - 1));
  const col = barW * (1 + FLOW_RATIO);
  const plotBottom = height;
  const yOf = (v: number) => plotBottom - (top ? ((plotBottom - 4) * Math.max(0, v)) / top : 0);
  return (
    <figure
      {...rest}
      className={cx('bek-chart', 'bek-funnel-chart', 'bek-funnel-chart--stepped', className)}
    >
      <ChartSvg width={width} height={height + LABELS_H} label={label}>
        <g className="bek-funnel-chart__flows" aria-hidden="true">
          {steps.slice(1).map((s, k) => {
            const i = k + 1;
            const x0 = (i - 1) * col + barW;
            const x1 = i * col;
            return (
              <g key={i}>
                <path
                  className="bek-funnel-chart__flow"
                  d={`M${r2(x0)},${r2(yOf(steps[i - 1].value))}L${r2(x1)},${r2(yOf(s.value))}V${plotBottom}H${r2(x0)}Z`}
                />
                <text
                  className={cx(
                    'bek-funnel-chart__conversion',
                    highlightDrop && i === drop && 'bek-funnel-chart__conversion--drop',
                  )}
                  x={r2((x0 + x1) / 2)}
                  y={plotBottom - LABEL_GAP}
                  textAnchor="middle"
                >
                  {whole(conv[i])}
                </text>
              </g>
            );
          })}
        </g>
        {steps.map((s, i) => {
          const x = i * col;
          const y = yOf(s.value);
          return (
            <g key={i} className="bek-chart__mark bek-funnel-chart__step">
              <path
                className="bek-funnel-chart__bar"
                d={roundedBar(
                  r2(x),
                  r2(y),
                  r2(barW),
                  r2(Math.max(0, plotBottom - y)),
                  RADIUS,
                  'top',
                )}
              />
              <text
                className="bek-funnel-chart__label"
                x={r2(x)}
                y={plotBottom + LABEL_GAP}
                dy="0.71em"
              >
                {s.label}
              </text>
              <text
                className="bek-funnel-chart__count"
                x={r2(x)}
                y={plotBottom + LABEL_GAP + 18}
                dy="0.71em"
              >
                {formatValue(s.value)}
              </text>
              <title>{tip(s, i)}</title>
            </g>
          );
        })}
      </ChartSvg>
      {table}
    </figure>
  );
}
