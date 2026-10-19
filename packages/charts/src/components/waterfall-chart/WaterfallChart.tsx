import type { HTMLAttributes } from 'react';
import { cx } from '@bek/react';
import { scaleBand } from 'd3-scale';
import { formatNumber, MINUS } from '../../core/format.js';
import {
  DEFAULT_HEIGHT,
  DEFAULT_TICKS,
  DEFAULT_WIDTH,
  r2,
  roundedBar,
  valueScale,
} from '../../core/geometry.js';
import { AxisBottom, AxisLeft, ChartSvg, DataTable, GridRows } from '../../core/svg.js';
import { ChartLegend } from '../legend-item/LegendItem.js';

export type WaterfallChartVariant = 'default';

export interface WaterfallTotal {
  label: string;
  /** End uchun ixtiyoriy — berilmasa start + o'zgarishlar yig'indisi. */
  value?: number;
}

export interface WaterfallItem {
  label: string;
  /** O'zgarish: musbat — o'sish, manfiy — kamayish. */
  value: number;
}

export interface WaterfallChartProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Figma `Variant` — bitta: `default`. */
  variant?: WaterfallChartVariant;
  /** Boshlang'ich jami (0 dan, `dataviz/neutral`). */
  start: { label: string; value: number };
  /** O'zgarishlar (ko'pi bilan 8; kichiklarini "Other" ga yig'ing). */
  items: WaterfallItem[];
  /** Yakuniy jami (0 dan). */
  end: WaterfallTotal;
  /** Legend yozuvlari; standart — Increase · Decrease · Total. */
  legendLabels?: { increase: string; decrease: string; total: string };
  width?: number;
  /** `chart/height/md`: 200 / 240 / 320. */
  height?: number;
  /** `chart/bar/thickness`: 16 / 24 / 32. */
  barThickness?: number;
  ticks?: number;
  /** Mutlaq qiymat formati; ishora (+ / −) komponent qo'yadi. */
  formatValue?: (value: number) => string;
  /** Ekran o'quvchi uchun qisqa xulosa ("Q1 60, Sales +18, … Q2 65"). */
  label: string;
}

const RADIUS = 4; // chart/bar/radius
const LABEL_GAP = 8; // chart/axis/label-gap
const AXIS_W = 40; // scale/40
const AXIS_H = 20;
const TOP = 20; // qiymat yozuvi uchun joy

type Kind = 'total' | 'increase' | 'decrease';

/**
 * Figma "4.18 Chart · Waterfall": boshlang'ich qiymat musbat va manfiy hissalar orqali yakuniy
 * qiymatga qanday aylanishi. Jamilar 0 dan, o'zgarishlar suzadi; uzuq bog'lovchi — joriy daraja.
 */
export function WaterfallChart({
  variant = 'default',
  start,
  items,
  end,
  legendLabels = { increase: 'Increase', decrease: 'Decrease', total: 'Total' },
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  barThickness = 16,
  ticks = DEFAULT_TICKS,
  formatValue = (v) => formatNumber(v, { compact: true }),
  label,
  className,
  ...rest
}: WaterfallChartProps) {
  const signed = (v: number) => `${v > 0 ? '+' : v < 0 ? MINUS : ''}${formatValue(Math.abs(v))}`;
  let level = start.value;
  const bars: { label: string; kind: Kind; from: number; to: number; value: number }[] = [
    { label: start.label, kind: 'total', from: 0, to: start.value, value: start.value },
  ];
  for (const it of items) {
    bars.push({
      label: it.label,
      kind: it.value >= 0 ? 'increase' : 'decrease',
      from: level,
      to: level + it.value,
      value: it.value,
    });
    level += it.value;
  }
  const endValue = end.value ?? level;
  bars.push({ label: end.label, kind: 'total', from: 0, to: endValue, value: endValue });

  const plotBottom = height - AXIS_H;
  const y = valueScale(
    bars.flatMap((b) => [b.from, b.to]),
    [plotBottom, TOP],
    { ticks },
  );
  const x = scaleBand<number>()
    .domain(bars.map((_, i) => i))
    .range([AXIS_W, width])
    .paddingInner(0.3)
    .paddingOuter(0.15);
  const bw = Math.min(barThickness, x.bandwidth());
  const left = (i: number) => (x(i) ?? 0) + (x.bandwidth() - bw) / 2;

  return (
    <figure
      {...rest}
      className={cx(
        'bek-chart',
        'bek-waterfall-chart',
        `bek-waterfall-chart--${variant}`,
        className,
      )}
    >
      <ChartLegend
        items={[
          { label: legendLabels.increase, color: 'var(--bek-dataviz-positive)', variant: 'square' },
          { label: legendLabels.decrease, color: 'var(--bek-dataviz-negative)', variant: 'square' },
          { label: legendLabels.total, color: 'var(--bek-dataviz-neutral)', variant: 'square' },
        ]}
      />
      <ChartSvg width={width} height={height} label={label}>
        <GridRows scale={y} ticks={ticks} x1={AXIS_W} x2={width} baseline={0} />
        <AxisLeft scale={y} x={AXIS_W} ticks={ticks} format={formatValue} />
        <g className="bek-waterfall-chart__connectors" aria-hidden="true">
          {bars.slice(0, -1).map((b, i) => (
            <line
              key={i}
              className="bek-waterfall-chart__connector"
              x1={r2(left(i) + bw)}
              x2={r2(left(i + 1))}
              y1={r2(y(b.to))}
              y2={r2(y(b.to))}
            />
          ))}
        </g>
        <g className="bek-waterfall-chart__plot">
          {bars.map((b, i) => {
            const hi = y(Math.max(b.from, b.to));
            const lo = y(Math.min(b.from, b.to));
            const bx = left(i);
            const text = b.kind === 'total' ? formatValue(b.value) : signed(b.value);
            return (
              <g
                key={i}
                className={`bek-chart__mark bek-waterfall-chart__step bek-waterfall-chart__step--${b.kind}`}
              >
                {b.kind === 'total' ? (
                  <path
                    className="bek-waterfall-chart__bar"
                    d={roundedBar(bx, hi, bw, Math.max(0, lo - hi), RADIUS, 'top')}
                  />
                ) : (
                  <rect
                    className="bek-waterfall-chart__bar"
                    x={r2(bx)}
                    y={r2(hi)}
                    width={r2(bw)}
                    height={r2(Math.max(1, lo - hi))}
                  />
                )}
                <text
                  className="bek-waterfall-chart__value"
                  x={r2(bx + bw / 2)}
                  y={r2(hi - LABEL_GAP)}
                  textAnchor="middle"
                >
                  {text}
                </text>
                <title>{`${b.label}: ${text}${b.kind === 'total' ? '' : ` → ${formatValue(b.to)}`}`}</title>
              </g>
            );
          })}
        </g>
        <AxisBottom
          y={plotBottom + LABEL_GAP}
          labels={bars.map((b, i) => ({ key: `${i}`, x: left(i) + bw / 2, label: b.label }))}
        />
      </ChartSvg>
      <DataTable
        caption={label}
        columns={['Step', 'Change', 'Running total']}
        rows={bars.map((b) => [
          b.label,
          b.kind === 'total' ? formatValue(b.value) : signed(b.value),
          formatValue(b.to),
        ])}
      />
    </figure>
  );
}
