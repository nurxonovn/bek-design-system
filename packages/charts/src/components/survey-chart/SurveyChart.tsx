'use client';

import { useState, type HTMLAttributes } from 'react';
import { cx } from '@bek-ui/react';
import { scaleLinear } from 'd3-scale';
import { formatNumber, formatPercent } from '../../core/format.js';
import { DEFAULT_WIDTH, r2, roundedBar } from '../../core/geometry.js';
import { ChartSvg, DataTable } from '../../core/svg.js';
import { ChartLegend } from '../legend-item/LegendItem.js';

export type SurveyChartVariant = 'likert' | 'net';
export type SurveySort = 'none' | 'net' | 'agree';

export interface SurveyQuestion {
  /** Savol matni (qisqa): "Lessons are clear". */
  label: string;
  /** Har javob uchun soni — shkala tartibida (Strongly disagree → Strongly agree). */
  counts: number[];
}

export interface SurveyChartProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  questions: SurveyQuestion[];
  /** 3 / 5 / 7 balli shkala yoki javob nomlari. Bitta chartda shkalalarni aralashtirmang. */
  scale?: 3 | 5 | 7 | string[];
  /** `likert` — to'liq taqsimot (neytral markazda); `net` — agree − disagree. */
  variant?: SurveyChartVariant;
  /** Saralash: savol tartibi, net bo'yicha yoki agree ulushi bo'yicha. */
  sort?: SurveySort;
  /** Javoblar 30 dan kam bo'lsa ko'rsatiladigan izoh. */
  lowSampleLabel?: string;
  /** O'q yozuvlari: chap va o'ng tomon. */
  axisLabels?: [string, string];
  /** Net legendi: musbat va manfiy. */
  netLabels?: [string, string];
  width?: number;
  /** Qisqa xulosa: "5 savol; eng past — Price for value (Net 0)". */
  label: string;
}

const SCALES: Record<3 | 5 | 7, string[]> = {
  3: ['Disagree', 'Neutral', 'Agree'],
  5: ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'],
  7: [
    'Strongly disagree',
    'Disagree',
    'Somewhat disagree',
    'Neutral',
    'Somewhat agree',
    'Agree',
    'Strongly agree',
  ],
};
/** `dataviz/diverging` qadamlari (Figma 5 balli: neg-3 · neg-1 · 0 · pos-1 · pos-3). */
const DIVERGING = {
  'neg-3': 'var(--bek-dataviz-diverging-neg-3)',
  'neg-2': 'var(--bek-dataviz-diverging-neg-2)',
  'neg-1': 'var(--bek-dataviz-diverging-neg-1)',
  '0': 'var(--bek-dataviz-diverging-0)',
  'pos-1': 'var(--bek-dataviz-diverging-pos-1)',
  'pos-2': 'var(--bek-dataviz-diverging-pos-2)',
  'pos-3': 'var(--bek-dataviz-diverging-pos-3)',
} as const;
type DivergingStep = keyof typeof DIVERGING;
/** Shkala uzunligiga qarab palitra. */
const PALETTE: Record<number, DivergingStep[]> = {
  2: ['neg-3', 'pos-3'],
  3: ['neg-3', '0', 'pos-3'],
  4: ['neg-3', 'neg-1', 'pos-1', 'pos-3'],
  5: ['neg-3', 'neg-1', '0', 'pos-1', 'pos-3'],
  6: ['neg-3', 'neg-2', 'neg-1', 'pos-1', 'pos-2', 'pos-3'],
  7: ['neg-3', 'neg-2', 'neg-1', '0', 'pos-1', 'pos-2', 'pos-3'],
};
const diverging = (step: DivergingStep) => DIVERGING[step];

const QUESTION_W = 120; // savol ustuni (Caption/M)
const NET_W = 56; // "Net +62" ustuni
const ROW = 34; // qator qadami
const BAR_H = 20; // segment balandligi
const TOP = 12;
const AXIS_H = 26; // "← Disagree · Agree →" qatori
const RADIUS = 4; // chart/bar/radius (Net)
const LOW_SAMPLE = 30;

export interface SurveyStats {
  total: number;
  /** Har javob ulushi, % (0…100). */
  shares: number[];
  agree: number;
  disagree: number;
  neutral: number;
  /** agree − disagree, butun foiz. */
  net: number;
}

/** Savol statistikasi: ulushlar, agree / disagree / neutral va net (neytral hisobga kirmaydi). */
export function surveyStats(counts: number[]): SurveyStats {
  const total = counts.reduce((a, b) => a + Math.max(0, b), 0);
  const shares = counts.map((c) => (total ? (Math.max(0, c) / total) * 100 : 0));
  const n = counts.length;
  const mid = (n - 1) / 2;
  let agree = 0;
  let disagree = 0;
  let neutral = 0;
  shares.forEach((s, i) => {
    if (i < mid) disagree += s;
    else if (i > mid) agree += s;
    else neutral += s;
  });
  return { total, shares, agree, disagree, neutral, net: Math.round(agree - disagree) };
}

/**
 * Figma "4.18 Chart · Survey": Likert javoblari — neytral markazli diverging stacked bar (disagree
 * chapga, agree o'ngga); Net — har savol uchun agree − disagree. Rang ustida matn yo'q (CMP-07).
 */
export function SurveyChart({
  questions,
  scale = 5,
  variant = 'likert',
  sort = 'none',
  lowSampleLabel = 'Low sample (n < 30)',
  axisLabels = ['← Disagree', 'Agree →'],
  netLabels = ['Net agree (agree − disagree)', 'Net disagree'],
  width = DEFAULT_WIDTH,
  label,
  className,
  ...rest
}: SurveyChartProps) {
  const [isolated, setIsolated] = useState<number | null>(null);
  const answers = Array.isArray(scale) ? scale : SCALES[scale];
  const colors = PALETTE[answers.length] ?? answers.map((_, i) => PALETTE[7][i % 7]);
  const rows = questions.map((q) => ({ ...q, stats: surveyStats(q.counts) }));
  if (sort === 'net') rows.sort((a, b) => b.stats.net - a.stats.net);
  else if (sort === 'agree') rows.sort((a, b) => b.stats.agree - a.stats.agree);
  const lowSample = rows.some((r) => r.stats.total < LOW_SAMPLE);

  const plotH = rows.length * ROW;
  const height = TOP + plotH + AXIS_H;
  const x0 = QUESTION_W;
  const x1 = width - NET_W;
  const likert = variant === 'likert';
  const left = (s: SurveyStats) => s.disagree + s.neutral / 2;
  const right = (s: SurveyStats) => s.agree + s.neutral / 2;
  const maxNet = Math.max(1, ...rows.map((r) => Math.abs(r.stats.net)));
  const x = likert
    ? scaleLinear()
        .domain([
          -Math.max(1, ...rows.map((r) => left(r.stats))),
          Math.max(1, ...rows.map((r) => right(r.stats))),
        ])
        .range([x0, x1])
    : scaleLinear().domain([-maxNet, maxNet]).range([x0, x1]);
  const zero = x(0);
  const netText = (net: number) => formatNumber(net, { signed: true });

  return (
    <figure
      {...rest}
      className={cx(
        'bek-chart',
        'bek-survey-chart',
        `bek-survey-chart--${variant}`,
        isolated != null && 'bek-survey-chart--isolated',
        className,
      )}
    >
      <ChartSvg width={width} height={height} label={label}>
        <line
          className="bek-survey-chart__zero"
          x1={r2(zero)}
          x2={r2(zero)}
          y1={TOP - 8}
          y2={TOP + plotH - 6}
        />
        {rows.map((r, qi) => {
          const y = TOP + qi * ROW;
          const cy = r2(y + BAR_H / 2);
          let cursor = -left(r.stats);
          return (
            <g key={qi} className="bek-survey-chart__row">
              <text className="bek-survey-chart__question" x={0} y={cy} dy="0.32em">
                {r.label}
              </text>
              {likert ? (
                r.stats.shares.map((s, ai) => {
                  const from = x(cursor);
                  cursor += s;
                  const w = Math.max(0, x(cursor) - from - (s > 0 ? 1 : 0));
                  return (
                    <rect
                      key={ai}
                      className={cx(
                        'bek-chart__mark bek-survey-chart__segment',
                        isolated === ai && 'bek-survey-chart__segment--active',
                      )}
                      x={r2(from)}
                      y={y}
                      width={r2(w)}
                      height={BAR_H}
                      style={{ fill: diverging(colors[ai]) }}
                    >
                      <title>
                        {`${r.label} — ${answers[ai]}: ${formatNumber(r.counts[ai] ?? 0)} (${formatPercent(s, { decimals: 0 })})`}
                      </title>
                    </rect>
                  );
                })
              ) : (
                <path
                  className="bek-chart__mark bek-survey-chart__net"
                  d={
                    r.stats.net >= 0
                      ? roundedBar(zero, y, x(r.stats.net) - zero, BAR_H, RADIUS, 'right')
                      : roundedBar(x(r.stats.net), y, zero - x(r.stats.net), BAR_H, RADIUS, 'left')
                  }
                  style={{ fill: diverging(r.stats.net >= 0 ? 'pos-3' : 'neg-3') }}
                >
                  <title>{`${r.label}: Net ${netText(r.stats.net)}`}</title>
                </path>
              )}
              {likert ? (
                <text
                  className="bek-survey-chart__value"
                  x={width}
                  y={cy}
                  dy="0.32em"
                  textAnchor="end"
                >
                  {`Net ${netText(r.stats.net)}`}
                </text>
              ) : (
                <text
                  className="bek-survey-chart__value"
                  x={r2(r.stats.net >= 0 ? x(r.stats.net) + 6 : x(r.stats.net) - 6)}
                  y={cy}
                  dy="0.32em"
                  textAnchor={r.stats.net >= 0 ? 'start' : 'end'}
                >
                  {netText(r.stats.net)}
                </text>
              )}
            </g>
          );
        })}
        <g className="bek-chart__axis" aria-hidden="true">
          <text
            className="bek-chart__tick"
            x={r2(zero - 8)}
            y={TOP + plotH + 4}
            dy="0.71em"
            textAnchor="end"
          >
            {axisLabels[0]}
          </text>
          <text className="bek-chart__tick" x={r2(zero + 8)} y={TOP + plotH + 4} dy="0.71em">
            {axisLabels[1]}
          </text>
        </g>
      </ChartSvg>
      {likert ? (
        <ChartLegend
          aria-label="Answers"
          items={answers.map((a, i) => ({
            label: a,
            color: diverging(colors[i]),
            variant: 'square',
            hidden: isolated != null && isolated !== i,
          }))}
          onToggle={(i) => setIsolated((cur) => (cur === i ? null : i))}
        />
      ) : (
        <ChartLegend
          items={[
            { label: netLabels[0], color: diverging('pos-3'), variant: 'square' },
            { label: netLabels[1], color: diverging('neg-3'), variant: 'square' },
          ]}
        />
      )}
      {lowSample && <p className="bek-survey-chart__note">{lowSampleLabel}</p>}
      <DataTable
        caption={label}
        columns={['Question', ...answers, 'n', 'Net']}
        rows={rows.map((r) => [
          r.label,
          ...answers.map(
            (_, i) =>
              `${formatNumber(r.counts[i] ?? 0)} (${formatPercent(r.stats.shares[i] ?? 0, { decimals: 0 })})`,
          ),
          formatNumber(r.stats.total),
          netText(r.stats.net),
        ])}
      />
    </figure>
  );
}
