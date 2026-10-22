import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '@bek-ui/react';
import { scaleLinear } from 'd3-scale';
import { formatNumber } from '../../core/format.js';
import { DEFAULT_WIDTH, r2 } from '../../core/geometry.js';
import { ChartSvg, DataTable } from '../../core/svg.js';
import { ChartLegend } from '../legend-item/LegendItem.js';

export interface ComparedModel {
  name: string;
  /** Standart — `dataviz/categorical/01…04` tartibda. */
  color?: string;
}

export interface ModelMetric {
  /** Metrika: "Accuracy", "Cost efficiency". */
  label: string;
  /** Har model uchun 0–100 normallashgan ball (yuqori = yaxshi). Narx va kechikishni oldin teskari qiling. */
  scores: number[];
  /** Asl qiymatlar tooltip va jadval uchun: `['82%', '91%', '88%']`, `['120 ms', …]`. */
  raw?: string[];
}

export interface ModelComparisonProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** 2–4 model (vendor, prompt). Satr yoki `{ name, color }`. */
  models: (string | ComparedModel)[];
  /** 3–8 metrika — har biri bitta qator. */
  metrics: ModelMetric[];
  /** Shkala izohi; teskari qilingan metrikalarni shu yerda ayting. */
  caption?: ReactNode;
  /** Figma `variant`: faqat `default`. */
  variant?: 'default';
  width?: number;
  /** Qator balandligi. */
  rowHeight?: number;
  /** Ekran o'quvchi uchun xulosa: "BEK-base leads on 4 of 5 metrics". */
  label: string;
}

const PALETTE = [
  'var(--bek-chart-series-1, var(--bek-dataviz-categorical-01))',
  'var(--bek-chart-series-2, var(--bek-dataviz-categorical-02))',
  'var(--bek-chart-series-3, var(--bek-dataviz-categorical-03))',
  'var(--bek-chart-series-4, var(--bek-dataviz-categorical-04))',
];
const MAX_MODELS = 4;
const LABEL_W = 140; // metrika nomi ustuni
const END_PAD = 16;
const DOT_R = 4; // chart/point/size 8

/**
 * Figma "4.18 Chart · Model comparison": 2–4 AI model (vendor, prompt) muhim metrikalar bo'yicha,
 * bitta 0–100 shkalada. Har metrika — qator, har model — nuqta, eng yaxshi qiymat yozilgan.
 */
export function ModelComparison({
  models,
  metrics,
  caption = 'Score 0–100 · higher is better',
  variant = 'default',
  width = DEFAULT_WIDTH,
  rowHeight = 38,
  label,
  className,
  ...rest
}: ModelComparisonProps) {
  const list = models
    .slice(0, MAX_MODELS)
    .map((m, i) =>
      typeof m === 'string'
        ? { name: m, color: PALETTE[i] }
        : { name: m.name, color: m.color ?? PALETTE[i] },
    );
  const x = scaleLinear()
    .domain([0, 100])
    .range([LABEL_W, width - END_PAD])
    .clamp(true);
  const h = metrics.length * rowHeight;
  const trackY = (i: number) => i * rowHeight + rowHeight - 12;
  const shown = (m: ModelMetric, j: number) => m.raw?.[j] ?? formatNumber(m.scores[j] ?? 0);

  return (
    <figure
      {...rest}
      className={cx(
        'bek-chart',
        'bek-model-comparison',
        `bek-model-comparison--${variant}`,
        className,
      )}
    >
      <ChartLegend
        aria-label="Models"
        items={list.map((m) => ({ label: m.name, color: m.color, variant: 'dot' }))}
      />
      <ChartSvg width={width} height={h} label={label}>
        {metrics.map((m, i) => {
          const scores = list.map((_, j) => m.scores[j] ?? 0);
          const best = scores.indexOf(Math.max(...scores));
          const ty = r2(trackY(i));
          // Eng yaxshisi oxirida chiziladi — ustida turadi.
          const order = list
            .map((_, j) => j)
            .sort((a, b) => (a === best ? 1 : b === best ? -1 : 0));
          return (
            <g key={m.label} className="bek-model-comparison__row">
              <title>{`${m.label} — ${list.map((md, j) => `${md.name} ${shown(m, j)}`).join(', ')}`}</title>
              <text className="bek-model-comparison__metric" x={0} y={ty} dy="0.32em">
                {m.label}
              </text>
              <line className="bek-model-comparison__track" x1={x(0)} x2={x(100)} y1={ty} y2={ty} />
              {order.map((j) => (
                <circle
                  key={j}
                  className="bek-model-comparison__dot"
                  cx={r2(x(scores[j]))}
                  cy={ty}
                  r={DOT_R}
                  style={{ fill: list[j].color }}
                >
                  <title>{`${list[j].name}: ${shown(m, j)}`}</title>
                </circle>
              ))}
              <text
                className="bek-model-comparison__best"
                x={r2(x(scores[best]))}
                y={r2(ty - DOT_R - 6)}
                textAnchor="middle"
              >
                {formatNumber(scores[best])}
              </text>
            </g>
          );
        })}
      </ChartSvg>
      {caption != null && (
        <figcaption
          className="bek-model-comparison__caption"
          style={{ paddingInlineStart: LABEL_W }}
        >
          {caption}
        </figcaption>
      )}
      <DataTable
        caption={label}
        columns={['Metric', ...list.map((m) => m.name)]}
        rows={metrics.map((m) => [m.label, ...list.map((_, j) => shown(m, j))])}
      />
    </figure>
  );
}
