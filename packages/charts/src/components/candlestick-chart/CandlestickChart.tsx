import type { HTMLAttributes } from 'react';
import { cx } from '@bek/react';
import { max as d3max } from 'd3-array';
import { scaleBand, scaleLinear } from 'd3-scale';
import { formatNumber } from '../../core/format.js';
import {
  DEFAULT_HEIGHT,
  DEFAULT_TICKS,
  DEFAULT_WIDTH,
  r2,
  valueScale,
} from '../../core/geometry.js';
import { AxisBottom, AxisLeft, ChartSvg, DataTable, GridRows } from '../../core/svg.js';
import { ChartLegend } from '../legend-item/LegendItem.js';

export type CandlestickChartVariant = 'default' | 'volume';

export interface Candle {
  /** Davr: sana yoki vaqt yorlig'i ("12 Oct", "2026-10-12"). */
  t: string;
  o: number;
  h: number;
  l: number;
  c: number;
  /** Savdo hajmi (Volume varianti). */
  v?: number;
}

export interface CandlestickChartProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  data: Candle[];
  /** `default` — shamlar, `volume` — plot ostida hajm ustunlari (40%). */
  variant?: CandlestickChartVariant;
  width?: number;
  /** Narx plotining balandligi (`chart/height/md`: 200 / 240 / 320); Volume qatori qo'shiladi. */
  height?: number;
  ticks?: number;
  formatValue?: (value: number) => string;
  formatVolume?: (value: number) => string;
  /** X o'qi yozuvi: `t` → "12 Oct". */
  formatLabel?: (t: string, index: number) => string;
  /** Legend matnlari (uz: "O'sish", "Pasayish"). */
  upLabel?: string;
  downLabel?: string;
  label: string;
}

const AXIS_W = 32; // scale/32 — Y ustuni
const AXIS_H = 20;
const LABEL_GAP = 8; // chart/axis/label-gap
const VOLUME_H = 40; // scale/40
const MAX_BODY = 12;

/**
 * Figma "4.18 Chart · Candlestick": davr bo'yicha narx — tana = ochilish → yopilish,
 * pilik = yuqori → past. O'sish `dataviz/positive`, pasayish `dataviz/negative` (seriya ranglari emas).
 */
export function CandlestickChart({
  data,
  variant = 'default',
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  ticks = DEFAULT_TICKS,
  formatValue = (v) => formatNumber(v, { compact: true }),
  formatVolume = (v) => formatNumber(v, { compact: true }),
  formatLabel = (t) => t,
  upLabel = 'Up',
  downLabel = 'Down',
  label,
  className,
  ...rest
}: CandlestickChartProps) {
  const showVolume = variant === 'volume';
  const plotBottom = height - AXIS_H;
  const volTop = plotBottom + LABEL_GAP;
  const svgH = height + (showVolume ? VOLUME_H + LABEL_GAP : 0);
  const axisY = showVolume ? volTop + VOLUME_H + LABEL_GAP : plotBottom + LABEL_GAP;
  const y = valueScale(
    data.flatMap((d) => [d.h, d.l]),
    [plotBottom - LABEL_GAP, 4],
    { zero: false, ticks },
  );
  const x = scaleBand<number>()
    .domain(data.map((_, i) => i))
    .range([AXIS_W + LABEL_GAP, width])
    .paddingInner(0.4)
    .paddingOuter(0.2);
  const step = x.step();
  const bw = Math.max(1, Math.min(MAX_BODY, x.bandwidth()));
  const vMax = d3max(data, (d) => d.v ?? 0) || 1;
  const vy = scaleLinear().domain([0, vMax]).range([0, VOLUME_H]);
  // X yozuvlari: taxminan har 56 px da bittasi; birinchi doim ko'rinadi.
  const every = Math.max(1, Math.ceil(56 / Math.max(step, 1)));

  return (
    <figure
      {...rest}
      className={cx(
        'bek-chart',
        'bek-candlestick-chart',
        `bek-candlestick-chart--${variant}`,
        className,
      )}
    >
      <ChartLegend
        items={[
          { label: upLabel, color: 'var(--bek-dataviz-positive)', variant: 'square' },
          { label: downLabel, color: 'var(--bek-dataviz-negative)', variant: 'square' },
        ]}
      />
      <ChartSvg width={width} height={svgH} label={label}>
        <GridRows scale={y} ticks={ticks} x1={AXIS_W} x2={width} />
        <AxisLeft scale={y} x={AXIS_W} ticks={ticks} format={formatValue} />
        <g className="bek-candlestick-chart__plot">
          {data.map((d, i) => {
            const up = d.c >= d.o;
            const cxp = (x(i) ?? 0) + x.bandwidth() / 2;
            const top = y(Math.max(d.o, d.c));
            const bottom = y(Math.min(d.o, d.c));
            return (
              <g
                key={i}
                className={cx(
                  'bek-chart__mark bek-candlestick-chart__candle',
                  up ? 'bek-candlestick-chart__candle--up' : 'bek-candlestick-chart__candle--down',
                )}
              >
                <rect
                  className="bek-candlestick-chart__hit"
                  x={r2(cxp - step / 2)}
                  y={0}
                  width={r2(step)}
                  height={r2(showVolume ? volTop + VOLUME_H : plotBottom)}
                />
                <line
                  className="bek-candlestick-chart__wick"
                  x1={r2(cxp)}
                  x2={r2(cxp)}
                  y1={r2(y(d.h))}
                  y2={r2(y(d.l))}
                />
                <rect
                  className="bek-candlestick-chart__body"
                  x={r2(cxp - bw / 2)}
                  y={r2(top)}
                  width={r2(bw)}
                  height={r2(Math.max(1, bottom - top))}
                  rx={1}
                />
                {showVolume && d.v != null && (
                  <rect
                    className="bek-candlestick-chart__volume"
                    x={r2(cxp - bw / 2)}
                    y={r2(volTop + VOLUME_H - vy(d.v))}
                    width={r2(bw)}
                    height={r2(vy(d.v))}
                  />
                )}
                <title>
                  {`${formatLabel(d.t, i)}: open ${formatValue(d.o)}, close ${formatValue(d.c)}, high ${formatValue(d.h)}, low ${formatValue(d.l)}${d.v != null ? `, volume ${formatVolume(d.v)}` : ''}`}
                </title>
              </g>
            );
          })}
        </g>
        <AxisBottom
          y={axisY}
          labels={data
            .map((d, i) => ({
              key: `${i}`,
              x: (x(i) ?? 0) + x.bandwidth() / 2,
              label: formatLabel(d.t, i),
            }))
            .filter((_, i) => i % every === 0)}
        />
      </ChartSvg>
      <DataTable
        caption={label}
        columns={['Date', 'Open', 'High', 'Low', 'Close', ...(showVolume ? ['Volume'] : [])]}
        rows={data.map((d, i) => [
          formatLabel(d.t, i),
          formatValue(d.o),
          formatValue(d.h),
          formatValue(d.l),
          formatValue(d.c),
          ...(showVolume ? [d.v != null ? formatVolume(d.v) : '—'] : []),
        ])}
      />
    </figure>
  );
}
