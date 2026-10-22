import type { HTMLAttributes } from 'react';
import { cx } from '@bek-ui/react';
import { scaleLinear } from 'd3-scale';
import { seriesColor, type SequentialLevel } from '../../core/color.js';
import { formatNumber, formatPercent } from '../../core/format.js';
import { DEFAULT_WIDTH, r2 } from '../../core/geometry.js';
import { ChartSvg, DataTable } from '../../core/svg.js';

export type BulletChartVariant = 'default';

export interface BulletDatum {
  /** KPI nomi: "Revenue", "NPS". */
  name: string;
  value: number;
  /** Maqsad — `dataviz/target` belgisi. */
  target: number;
  /** Sifat oraliqlari chegaralari (ko'pi bilan 3: yomon · o'rta · yaxshi), masalan `[50, 75, 100]`. */
  ranges?: number[];
}

export interface BulletChartProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Bir nechta KPI ustma-ust (har biri o'z qatorida). Berilmasa — `name`/`value`/`target`/`ranges`. */
  data?: BulletDatum[];
  /** Bitta KPI nomi (`data` berilmaganda). */
  name?: string;
  value?: number;
  target?: number;
  ranges?: number[];
  /** Figma'da yagona `default` varianti; maqsadga yetilganda qator `--reached`. */
  variant?: BulletChartVariant;
  /** Umumiy shkala maksimumi — KPI'larni bir shkalada solishtirish uchun. Standart: har qator o'zi. */
  max?: number;
  /** SVG eni (Figma `scale/480`); balandlik qatorlar sonidan. */
  width?: number;
  formatValue?: (value: number, datum: BulletDatum) => string;
  /** Ekran o'quvchi uchun qisqa xulosa. */
  label: string;
}

const LABEL_W = 80; // scale/80
const GAP = 12; // scale/12
const VALUE_W = 40; // qiymat ustuni
const ROW = 24; // scale/24 — trek balandligi
const ROW_GAP = 16; // scale/16
const BAR = 8; // qiymat ustuni qalinligi (trekning uchdan biri)
const TICK = 16; // maqsad belgisi — ustundan baland
const LEVELS: SequentialLevel[] = [300, 200, 100]; // yomon → yaxshi: to'qdan ochga

/** Figma "4.18 Chart · Bullet": bitta KPI maqsadga nisbatan, sifat oraliqlari bilan (gauge o'rniga). */
export function BulletChart({
  data,
  name = '',
  value = 0,
  target = 0,
  ranges = [],
  variant = 'default',
  max,
  width = DEFAULT_WIDTH,
  formatValue = (v) => formatNumber(v, { compact: true }),
  label,
  className,
  ...rest
}: BulletChartProps) {
  const rows = data ?? [{ name, value, target, ranges }];
  const height = Math.max(1, rows.length) * (ROW + ROW_GAP) - ROW_GAP;
  const x0 = LABEL_W + GAP;
  const x1 = width - VALUE_W - GAP;
  const shared = max ?? null;

  return (
    <figure
      {...rest}
      className={cx('bek-chart', 'bek-bullet-chart', `bek-bullet-chart--${variant}`, className)}
    >
      <ChartSvg width={width} height={height} label={label}>
        {rows.map((d, i) => {
          const rs = [...(d.ranges ?? [])].sort((a, b) => a - b).slice(0, 3);
          const hi = shared ?? Math.max(d.value, d.target, ...rs, 1);
          const x = scaleLinear().domain([0, hi]).range([x0, x1]).clamp(true);
          const top = i * (ROW + ROW_GAP);
          const cy = top + ROW / 2;
          const reached = d.value >= d.target;
          const pct = d.target ? (d.value / d.target) * 100 : 0;
          return (
            <g
              key={i}
              className={cx('bek-bullet-chart__row', reached && 'bek-bullet-chart__row--reached')}
            >
              <title>{`${d.name}: ${formatValue(d.value, d)} · target ${formatValue(d.target, d)} · ${formatPercent(pct, { decimals: 0 })}`}</title>
              <text className="bek-bullet-chart__label" x={0} y={r2(cy)} dy="0.32em">
                {d.name}
              </text>
              {[...rs].reverse().map((r, ri) => (
                <rect
                  key={ri}
                  className={`bek-bullet-chart__range bek-bullet-chart__range--${LEVELS[rs.length - 1 - ri]}`}
                  x={x0}
                  y={top}
                  width={r2(Math.max(0, x(r) - x0))}
                  height={ROW}
                />
              ))}
              <rect
                className="bek-chart__mark bek-bullet-chart__bar"
                x={x0}
                y={r2(cy - BAR / 2)}
                width={r2(Math.max(0, x(d.value) - x0))}
                height={BAR}
                style={{ fill: seriesColor(0) }}
              />
              <line
                className="bek-bullet-chart__target"
                x1={r2(x(d.target))}
                x2={r2(x(d.target))}
                y1={r2(cy - TICK / 2)}
                y2={r2(cy + TICK / 2)}
              />
              <text
                className="bek-bullet-chart__value"
                x={width}
                y={r2(cy)}
                dy="0.32em"
                textAnchor="end"
              >
                {formatValue(d.value, d)}
              </text>
            </g>
          );
        })}
      </ChartSvg>
      <DataTable
        caption={label}
        columns={['KPI', 'Value', 'Target', 'Of target']}
        rows={rows.map((d) => [
          d.name,
          formatValue(d.value, d),
          formatValue(d.target, d),
          formatPercent(d.target ? (d.value / d.target) * 100 : 0, { decimals: 0 }),
        ])}
      />
    </figure>
  );
}
