import type { HTMLAttributes } from 'react';
import { cx } from '@bek-ui/react';
import { scaleLinear } from 'd3-scale';
import { formatNumber } from '../../core/format.js';
import { DEFAULT_WIDTH, r2 } from '../../core/geometry.js';
import { ChartSvg, DataTable } from '../../core/svg.js';
import { ChartLegend, type ChartLegendItem } from '../legend-item/LegendItem.js';

export type FeatureImportanceVariant = 'bar' | 'waterfall';

export interface FeatureContribution {
  /** Oddiy tildagi nom: "Debt ratio" (`dti_v2` emas). */
  feature: string;
  /** Ishorali hissa (SHAP): `+0.42` ballni oshiradi, `-0.27` pasaytiradi. */
  value: number;
}

export interface FeatureImportanceProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Kirishlar hissasi — |qiymat| bo'yicha kamayish tartibida chiziladi. */
  contributions: FeatureContribution[];
  /** `bar` — nol atrofida ishorali hissalar; `waterfall` — base rate → har kirish → prediction. */
  variant?: FeatureImportanceVariant;
  /** Waterfall boshlanishi (base rate). Prediction = base + hissalar yig'indisi (aniq tugaydi). */
  base?: number;
  /** Ko'rsatiladigan kirishlar (Figma: top 7); qolgani "Other features" ga yig'iladi. */
  maxFeatures?: number;
  otherLabel?: string;
  raisesLabel?: string;
  lowersLabel?: string;
  baseLabel?: string;
  predictionLabel?: string;
  /** Waterfall legend'idagi yo'l: "Base → prediction". */
  pathLabel?: string;
  width?: number;
  /** Qator balandligi (Bar 24, Waterfall 20). */
  rowHeight?: number;
  /** Son formati; standart 2 xona, uz-UZ (`0,42`). Ishora `+` / `−` avtomatik. */
  formatValue?: (value: number, signed: boolean) => string;
  /** Ekran o'quvchi uchun xulosa: "Income raised the score most (+0,42)". */
  label: string;
}

const LABEL_W = 128; // kirish nomlari ustuni
const LABEL_GAP = 8; // chart/axis/label-gap
const VALUE_W = 44; // qiymat yozuvi uchun joy
const RADIUS = 2; // scale/2

/** Top N kirish, qolgani bitta "Other features" qatoriga. */
export function topContributions(
  contributions: FeatureContribution[],
  max = 7,
  otherLabel = 'Other features',
): FeatureContribution[] {
  const sorted = [...contributions].sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
  if (sorted.length <= max) return sorted;
  const rest = sorted.slice(max).reduce((s, c) => s + c.value, 0);
  return [...sorted.slice(0, max), { feature: otherLabel, value: rest }];
}

/**
 * Figma "4.18 Chart · Feature importance": bitta model qarorini tushuntiradi (SHAP) — qaysi kirishlar
 * ballni oshirdi yoki pasaytirdi. Faqat diverging ranglar (`pos-3` / `neg-3`), kategorik emas.
 */
export function FeatureImportance({
  contributions,
  variant = 'bar',
  base = 0,
  maxFeatures = 7,
  otherLabel = 'Other features',
  raisesLabel = variant === 'waterfall' ? 'Raises' : 'Raises score',
  lowersLabel = variant === 'waterfall' ? 'Lowers' : 'Lowers score',
  baseLabel = 'Base rate',
  predictionLabel = 'Prediction',
  pathLabel = 'Base → prediction',
  width = DEFAULT_WIDTH,
  rowHeight = variant === 'waterfall' ? 20 : 24,
  formatValue = (v, signed) => formatNumber(v, { decimals: 2, signed }),
  label,
  className,
  ...rest
}: FeatureImportanceProps) {
  const rows = topContributions(contributions, maxFeatures, otherLabel);
  const waterfall = variant === 'waterfall';
  const prediction = base + rows.reduce((s, r) => s + r.value, 0);

  // Waterfall: har qator [boshi, oxiri]; Bar: [0, qiymat].
  let acc = base;
  const spans = rows.map((r) => {
    const from = waterfall ? acc : 0;
    acc += r.value;
    return { ...r, from, to: waterfall ? acc : r.value };
  });
  const ends = waterfall
    ? [0, base, prediction, ...spans.flatMap((s) => [s.from, s.to])]
    : [0, ...rows.map((r) => r.value)];
  const lo = Math.min(...ends);
  const hi = Math.max(...ends);
  const hasNeg = !waterfall && lo < 0;
  const x = scaleLinear()
    .domain([lo, hi === lo ? lo + 1 : hi])
    .range([LABEL_W + LABEL_GAP + (hasNeg ? VALUE_W + LABEL_GAP : 0), width - VALUE_W]);

  const total = rows.length + (waterfall ? 2 : 0);
  const h = total * rowHeight;
  const bar = Math.round(rowHeight * 0.6);
  const rowY = (i: number) => i * rowHeight;
  const barY = (i: number) => rowY(i) + (rowHeight - bar) / 2;
  const mid = (i: number) => r2(rowY(i) + rowHeight / 2);
  const offset = waterfall ? 1 : 0;

  const legend: ChartLegendItem[] = [
    { label: raisesLabel, variant: 'square', color: 'var(--bek-dataviz-diverging-pos-3)' },
    { label: lowersLabel, variant: 'square', color: 'var(--bek-dataviz-diverging-neg-3)' },
    ...(waterfall
      ? [{ label: pathLabel, variant: 'line' as const, color: 'var(--bek-dataviz-neutral)' }]
      : []),
  ];

  const totalRow = (i: number, name: string, value: number) => {
    const x0 = x(Math.min(0, value));
    const x1 = x(Math.max(0, value));
    return (
      <g key={name} className="bek-feature-importance__row bek-feature-importance__row--total">
        <text
          className="bek-feature-importance__label"
          x={LABEL_W}
          y={mid(i)}
          dy="0.32em"
          textAnchor="end"
        >
          {name}
        </text>
        <rect
          className="bek-feature-importance__bar bek-feature-importance__bar--total"
          x={r2(x0)}
          y={r2(barY(i))}
          width={r2(Math.max(1, x1 - x0))}
          height={bar}
          rx={RADIUS}
        />
        <text
          className="bek-feature-importance__value"
          x={r2(x1 + LABEL_GAP)}
          y={mid(i)}
          dy="0.32em"
        >
          {formatValue(value, false)}
        </text>
        <title>{`${name}: ${formatValue(value, false)}`}</title>
      </g>
    );
  };

  return (
    <figure
      {...rest}
      className={cx(
        'bek-chart',
        'bek-feature-importance',
        `bek-feature-importance--${variant}`,
        className,
      )}
    >
      <ChartLegend items={legend} />
      <ChartSvg width={width} height={h} label={label}>
        {!waterfall && (
          <line
            className="bek-feature-importance__zero"
            x1={r2(x(0))}
            x2={r2(x(0))}
            y1={0}
            y2={h}
          />
        )}
        {waterfall && totalRow(0, baseLabel, base)}
        {spans.map((s, k) => {
          const i = k + offset;
          const x0 = x(Math.min(s.from, s.to));
          const x1 = x(Math.max(s.from, s.to));
          const pos = s.value >= 0;
          const valueX = waterfall || pos ? x1 + LABEL_GAP : x0 - LABEL_GAP;
          return (
            <g
              key={`${s.feature}-${k}`}
              className={cx(
                'bek-feature-importance__row',
                pos ? 'bek-feature-importance__row--raises' : 'bek-feature-importance__row--lowers',
              )}
            >
              <text
                className="bek-feature-importance__label"
                x={LABEL_W}
                y={mid(i)}
                dy="0.32em"
                textAnchor="end"
              >
                {s.feature}
              </text>
              <rect
                className="bek-chart__mark bek-feature-importance__bar"
                x={r2(x0)}
                y={r2(barY(i))}
                width={r2(Math.max(1, x1 - x0))}
                height={bar}
                rx={RADIUS}
              />
              <text
                className="bek-feature-importance__value"
                x={r2(valueX)}
                y={mid(i)}
                dy="0.32em"
                textAnchor={waterfall || pos ? 'start' : 'end'}
              >
                {formatValue(s.value, true)}
              </text>
              {waterfall && (
                <line
                  className="bek-feature-importance__connector"
                  x1={r2(x(s.from))}
                  x2={r2(x(s.from))}
                  y1={r2(barY(i - 1) + bar)}
                  y2={r2(barY(i))}
                />
              )}
              <title>{`${s.feature}: ${formatValue(s.value, true)}`}</title>
            </g>
          );
        })}
        {waterfall && (
          <>
            <line
              className="bek-feature-importance__connector"
              x1={r2(x(prediction))}
              x2={r2(x(prediction))}
              y1={r2(barY(total - 2) + bar)}
              y2={r2(barY(total - 1))}
            />
            {totalRow(total - 1, predictionLabel, prediction)}
          </>
        )}
      </ChartSvg>
      <DataTable
        caption={label}
        columns={['Feature', 'Contribution']}
        rows={[
          ...(waterfall ? [[baseLabel, formatValue(base, false)]] : []),
          ...rows.map((r) => [r.feature, formatValue(r.value, true)]),
          ...(waterfall ? [[predictionLabel, formatValue(prediction, false)]] : []),
        ]}
      />
    </figure>
  );
}
