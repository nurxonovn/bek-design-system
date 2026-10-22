import type { HTMLAttributes } from 'react';
import { cx } from '@bek-ui/react';
import { formatNumber } from '../../core/format.js';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH, r2 } from '../../core/geometry.js';
import { ChartSvg, DataTable } from '../../core/svg.js';

export type GaugeChartVariant = 'default' | 'zones';
export type GaugeZoneTone = 'negative' | 'warning' | 'positive' | 'neutral';

export interface GaugeZone {
  /** Zona yuqori chegarasi (oxirgisi odatda `max`). */
  to: number;
  /** Zona nomi: "Poor", "Fair", "Good" — tooltip va `aria-valuetext` da. */
  label: string;
  /** Rang; standart — tartib bo'yicha negative · warning · positive. */
  tone?: GaugeZoneTone;
}

export interface GaugeChartProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  value: number;
  min?: number;
  max?: number;
  /** `default` — `dataviz/track` ustida qiymat yoyi, `zones` — zonalar + strelka. */
  variant?: GaugeChartVariant;
  /** Zones varianti uchun chegaralar (o'sish tartibida). */
  zones?: GaugeZone[];
  /** Qiymat ostidagi izoh: "Credit score". */
  caption?: string;
  /** Yoy diametri — `scale/200` (doimiy, shakl cho'zilmaydi). */
  size?: number;
  width?: number;
  height?: number;
  formatValue?: (value: number) => string;
  label: string;
}

const THICKNESS_RATIO = 0.11; // yoy qalinligi diametrga nisbatan (200 → 22)
const BOUNDS_H = 20; // min/max yozuvlari qatori
const DEFAULT_TONES: GaugeZoneTone[] = ['negative', 'warning', 'positive'];
const ZONE_GAP = 0.015; // zonalar orasidagi bo'shliq (radian)

/** Yarim aylana yoyi: `a0`, `a1` — 0 (chap) … π (o'ng). */
function arcPath(cx0: number, cy0: number, r: number, a0: number, a1: number): string {
  const p = (a: number) => [r2(cx0 - r * Math.cos(a)), r2(cy0 - r * Math.sin(a))];
  const [x0, y0] = p(a0);
  const [x1, y1] = p(a1);
  return `M${x0},${y0}A${r2(r)},${r2(r)} 0 0 1 ${x1},${y1}`;
}

/**
 * Figma "4.18 Chart · Gauge": chegaralangan shkaladagi bitta qiymat, oraliqning o'zi muhim bo'lganda
 * (kredit reytingi, risk darajasi). Qiymat va ikkala chegara doim yoziladi.
 */
export function GaugeChart({
  value,
  min = 0,
  max = 100,
  variant = 'default',
  zones = [],
  caption,
  size = 200,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  formatValue = (v) => formatNumber(v),
  label,
  className,
  ...rest
}: GaugeChartProps) {
  const span = max - min || 1;
  const t = Math.max(0, Math.min(1, (value - min) / span));
  const diameter = Math.max(0, Math.min(size, width, (height - BOUNDS_H) * 2));
  const thickness = diameter * THICKNESS_RATIO;
  const r = (diameter - thickness) / 2;
  const cx0 = width / 2;
  const cy0 = (height - (diameter / 2 + BOUNDS_H)) / 2 + diameter / 2;
  const angle = (v: number) => Math.max(0, Math.min(1, (v - min) / span)) * Math.PI;
  const track = arcPath(cx0, cy0, r, 0, Math.PI);
  const sorted = [...zones].sort((a, b) => a.to - b.to);
  const zoneOf = sorted.find((z) => value <= z.to) ?? sorted[sorted.length - 1];
  const valueText = `${formatValue(value)}${zoneOf ? ` — ${zoneOf.label}` : ''}`;
  const needleA = angle(value);
  // Strelka markazdan emas, matndan keyin boshlanadi: matn qutisi (~ r·0,6) va yoy ichki chetigacha.
  const needleFrom = r * 0.62;
  const needleTo = r - thickness / 2 - 4;
  const isZones = variant === 'zones' && sorted.length > 0;
  const valueY = cy0 - BOUNDS_H / 2;

  return (
    <figure
      {...rest}
      className={cx('bek-chart', 'bek-gauge-chart', `bek-gauge-chart--${variant}`, className)}
    >
      <div
        className="bek-gauge-chart__meter"
        role="meter"
        aria-label={caption ?? label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={valueText}
      >
        <ChartSvg width={width} height={height} label={label}>
          {isZones ? (
            <g className="bek-gauge-chart__zones">
              {sorted.map((z, i) => {
                const from = i === 0 ? min : sorted[i - 1].to;
                const a0 = angle(from) + (i === 0 ? 0 : ZONE_GAP);
                const a1 = angle(z.to) - (i === sorted.length - 1 ? 0 : ZONE_GAP);
                const tone = z.tone ?? DEFAULT_TONES[i] ?? 'neutral';
                return (
                  <path
                    key={i}
                    className={cx('bek-gauge-chart__zone', `bek-gauge-chart__zone--${tone}`)}
                    d={arcPath(cx0, cy0, r, a0, Math.max(a0, a1))}
                    strokeWidth={r2(thickness)}
                  >
                    <title>{`${z.label}: ${formatValue(from)}–${formatValue(z.to)}`}</title>
                  </path>
                );
              })}
              <g className="bek-gauge-chart__needle" aria-hidden="true">
                <line
                  x1={r2(cx0 - needleFrom * Math.cos(needleA))}
                  y1={r2(cy0 - needleFrom * Math.sin(needleA))}
                  x2={r2(cx0 - needleTo * Math.cos(needleA))}
                  y2={r2(cy0 - needleTo * Math.sin(needleA))}
                />
                <circle
                  cx={r2(cx0 - needleFrom * Math.cos(needleA))}
                  cy={r2(cy0 - needleFrom * Math.sin(needleA))}
                  r={3}
                />
              </g>
            </g>
          ) : (
            <g aria-hidden="true">
              <path className="bek-gauge-chart__track" d={track} strokeWidth={r2(thickness)} />
              {t > 0 && (
                <path
                  className="bek-gauge-chart__value"
                  d={track}
                  pathLength={100}
                  strokeWidth={r2(thickness)}
                  strokeDasharray={`${r2(t * 100)} 100`}
                />
              )}
            </g>
          )}
          <text
            className="bek-gauge-chart__number"
            x={r2(cx0)}
            y={r2(valueY)}
            textAnchor="middle"
            aria-hidden="true"
          >
            {formatValue(value)}
          </text>
          {caption != null && (
            <text
              className="bek-gauge-chart__caption"
              x={r2(cx0)}
              y={r2(valueY + 6)}
              dy="0.71em"
              textAnchor="middle"
              aria-hidden="true"
            >
              {caption}
            </text>
          )}
          <g aria-hidden="true">
            <text
              className="bek-chart__tick"
              x={r2(cx0 - r)}
              y={r2(cy0 + 6)}
              dy="0.71em"
              textAnchor="middle"
            >
              {formatValue(min)}
            </text>
            <text
              className="bek-chart__tick"
              x={r2(cx0 + r)}
              y={r2(cy0 + 6)}
              dy="0.71em"
              textAnchor="middle"
            >
              {formatValue(max)}
            </text>
          </g>
        </ChartSvg>
      </div>
      <DataTable
        caption={label}
        columns={['Measure', 'Value']}
        rows={[
          [caption ?? 'Value', valueText],
          ['Min', formatValue(min)],
          ['Max', formatValue(max)],
          ...sorted.map((z, i) => [
            z.label,
            `${formatValue(i === 0 ? min : sorted[i - 1].to)}–${formatValue(z.to)}`,
          ]),
        ]}
      />
    </figure>
  );
}
