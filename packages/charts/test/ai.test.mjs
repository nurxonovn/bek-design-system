import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup as render } from 'react-dom/server';
import {
  AnomalyChart,
  ClusterMap,
  ConfidenceMeter,
  confidenceLevel,
  FeatureImportance,
  ForecastChart,
  GeneratedChart,
  ModelComparison,
  topContributions,
  UsageMeter,
  usageVariant,
} from '../dist/index.js';

const count = (html, re) => (html.match(re) || []).length;

const forecastProps = {
  labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
  actual: [60, 67],
  forecast: [
    { value: 71, range: { 80: [66, 76], 95: [63, 80] } },
    { value: 76, range: { 80: [68, 84], 95: [64, 90] } },
    { value: 82, range: { 80: [71, 93], 95: [64, 100] } },
  ],
  label: 'Forecast for November 82, likely between 71 and 93 (80%)',
};

test('ForecastChart: actual line, dashed AI forecast, 80/95 bands, Today tag and zone', () => {
  const html = render(h(ForecastChart, forecastProps));
  assert.match(html, /<figure class="bek-chart bek-forecast-chart bek-forecast-chart--default"/);
  assert.match(html, /role="img" aria-label="Forecast for November 82/);
  assert.equal(count(html, /class="bek-forecast-chart__band /g), 2);
  assert.ok(html.indexOf('band--95') < html.indexOf('band--80'), 'widest band first');
  assert.equal(count(html, /class="bek-forecast-chart__line"/g), 1);
  assert.equal(count(html, /class="bek-forecast-chart__actual"/g), 1);
  assert.match(html, />Today</);
  assert.match(html, /bek-forecast-chart__zone/);
  assert.equal(count(html, /class="bek-forecast-chart__hit"/g), 3);
  assert.match(html, /<title>Nov: 82 \(95%: 64–100 · 80%: 71–93\)<\/title>/);
  assert.match(html, /--bek-dataviz-ai-accent/);
  assert.match(html, /<table class="bek-chart__sr">/);
  assert.match(html, /<td>71–93<\/td>/);
  assert.doesNotMatch(html, /bek-forecast-chart__target/);
});

test('ForecastChart: target variant, 50% band, recalculating spinner', () => {
  const html = render(
    h(ForecastChart, {
      ...forecastProps,
      bands: [50, 80, 95],
      forecast: forecastProps.forecast.map((p) => ({
        ...p,
        range: { ...p.range, 50: [p.value - 2, p.value + 2] },
      })),
      target: 85,
      recalculating: true,
    }),
  );
  assert.match(html, /bek-forecast-chart--target/);
  assert.match(html, /bek-forecast-chart--recalculating/);
  assert.match(html, /class="bek-forecast-chart__target"/);
  assert.match(html, /<title>Target: 85<\/title>/);
  assert.equal(count(html, /class="bek-forecast-chart__band /g), 3);
  assert.match(html, /role="status" aria-label="Recalculating forecast"/);
  assert.match(html, />50% range</);
});

test('AnomalyChart: max 3 flagged points with reason, band and AI insight', () => {
  const values = [48, 50, 47, 52, 78, 49, 24, 55];
  const html = render(
    h(AnomalyChart, {
      labels: values.map((_, i) => `${i + 1} Jul`),
      values,
      anomalies: [
        { index: 4, reason: 'Promo', expected: 52 },
        { index: 6, reason: 'Outage', expected: 50 },
        { index: 1 },
        { index: 2 },
      ],
      expected: { lower: values.map(() => 40), upper: values.map(() => 60) },
      seriesLabel: 'Revenue',
      insight: '2 anomalies: spike on 5 Jul (+50%)',
      label: 'Two anomalies',
    }),
  );
  assert.match(html, /bek-anomaly-chart bek-anomaly-chart--band/);
  assert.equal(count(html, /class="bek-anomaly-chart__anomaly"/g), 3);
  assert.equal(count(html, /class="bek-anomaly-chart__band"/g), 1);
  assert.match(html, /<title>5 Jul: 78 · expected 52 · \+50% · Promo<\/title>/);
  assert.match(html, /<title>7 Jul: 24 · expected 50 · −52% · Outage<\/title>/);
  assert.match(html, /class="bek-ai-line bek-anomaly-chart__insight"/);
  assert.match(html, /AI insight: /);
  assert.match(html, />Expected range</);
  const plain = render(
    h(AnomalyChart, { labels: ['a', 'b'], values: [1, 2], anomalies: [], label: 'x' }),
  );
  assert.match(plain, /bek-anomaly-chart--default/);
  assert.doesNotMatch(plain, /bek-ai-line/);
});

test('ConfidenceMeter: segments per level, meter role and text value', () => {
  assert.equal(confidenceLevel(0.92), 'high');
  assert.equal(confidenceLevel(0.64), 'medium');
  assert.equal(confidenceLevel(0.31), 'low');
  assert.equal(confidenceLevel(0.6, { high: 0.9, medium: 0.7 }), 'low');
  const hi = render(h(ConfidenceMeter, { value: 0.92, reason: 'Based on 2,4 mln rows' }));
  assert.match(hi, /bek-confidence-meter--high/);
  assert.equal(count(hi, /bek-confidence-meter__segment--on/g), 5);
  assert.match(hi, />High · 92%</);
  assert.match(hi, /role="meter"/);
  assert.match(hi, /aria-valuenow="92"/);
  assert.match(hi, /aria-valuetext="High, 92 percent"/);
  assert.match(hi, /<figcaption class="bek-confidence-meter__reason">Based on 2,4 mln rows/);
  const md = render(h(ConfidenceMeter, { value: 0.64 }));
  assert.equal(count(md, /bek-confidence-meter__segment--on/g), 3);
  const lo = render(h(ConfidenceMeter, { value: 0.9, variant: 'low' }));
  assert.match(lo, /bek-confidence-meter--low/);
  assert.equal(count(lo, /bek-confidence-meter__segment--on/g), 1);
  assert.equal(count(lo, /class="bek-confidence-meter__segment[ "]/g), 5);
});

test('UsageMeter: uz-UZ numbers, forecast at 35%, state by forecast', () => {
  assert.equal(usageVariant(450000, 1e6, 650000), 'normal');
  assert.equal(usageVariant(500000, 1e6, 960000), 'warning');
  assert.equal(usageVariant(820000, 1e6), 'warning');
  assert.equal(usageVariant(1e6, 1e6), 'limit');
  const n = render(
    h(UsageMeter, {
      label: 'AI tokens',
      used: 450000,
      limit: 1000000,
      forecast: 650000,
      resetAt: 'Resets 1 Nov',
    }),
  );
  assert.match(n, /bek-usage-meter--normal/);
  assert.match(n, />450\u00a0000 \/ 1\u00a0mln</);
  assert.match(n, /role="meter"/);
  assert.match(n, /aria-valuemax="1000000"/);
  assert.match(
    n,
    /class="bek-usage-meter__forecast" style="inset-inline-start:45%;inline-size:20%"/,
  );
  assert.match(n, />Forecast 65% by reset</);
  assert.match(n, />Resets 1 Nov</);
  const w = render(
    h(UsageMeter, { label: 'AI tokens', used: 820000, limit: 1000000, forecast: 960000 }),
  );
  assert.match(w, /bek-usage-meter--warning/);
  assert.match(w, />Forecast 96% — close to limit</);
  const l = render(h(UsageMeter, { label: 'AI tokens', used: 1000000, limit: 1000000 }));
  assert.match(l, /bek-usage-meter--limit/);
  assert.match(l, />1\u00a0mln \/ 1\u00a0mln</);
  assert.match(l, />Limit reached</);
  assert.doesNotMatch(l, /bek-usage-meter__forecast/);
});

test('GeneratedChart: AI header, title, source, slot, insight, actions; generating and error', () => {
  const def = render(
    h(
      GeneratedChart,
      {
        title: 'Revenue by month, 2026',
        timestamp: 'Just now',
        source: 'Source: payments.csv · 1 240 rows',
        insight: 'Revenue grew 34%',
        onShowTable: () => {},
        onShowCode: () => {},
        onSave: () => {},
      },
      h('div', { id: 'slot' }),
    ),
  );
  assert.match(
    def,
    /<section class="bek-generated-chart bek-generated-chart--default" aria-labelledby=/,
  );
  assert.match(def, />Generated by BEK AI</);
  assert.match(
    def,
    /<h3 id="[^"]+" class="bek-generated-chart__title">Revenue by month, 2026<\/h3>/,
  );
  assert.match(def, /Source: payments.csv · 1 240 rows/);
  assert.match(def, /id="slot"/);
  assert.match(def, /class="bek-ai-line"/);
  assert.equal(count(def, /<button/g), 3);
  assert.match(def, />Table</);
  assert.match(def, />Code</);
  assert.match(def, />Save</);

  const gen = render(
    h(GeneratedChart, {
      state: 'generating',
      title: 'Revenue',
      step: 'Step 2 of 3',
      progressNote: 'Reading 1 240 rows',
      headingLevel: 2,
    }),
  );
  assert.match(gen, /bek-generated-chart--generating/);
  assert.match(gen, /aria-busy="true"/);
  assert.match(gen, />Generating chart…</);
  assert.match(gen, />Step 2 of 3</);
  assert.match(gen, /bek-skeleton/);
  assert.match(gen, /<p class="bek-generated-chart__note" role="status">Reading 1 240 rows/);
  assert.match(gen, /<h2 id="[^"]+" class="bek-chart__sr">Revenue<\/h2>/);
  assert.doesNotMatch(gen, /<button/);

  const err = render(h(GeneratedChart, { state: 'error', title: 'R', onRetry: () => {} }));
  assert.match(err, /role="alert"/);
  assert.match(err, />Try again</);
  assert.doesNotMatch(err, /bek-ai-line/);
});

const contributions = [
  { feature: 'Region', value: -0.03 },
  { feature: 'Income', value: 0.42 },
  { feature: 'Debt ratio', value: -0.27 },
  { feature: 'Payment history', value: 0.31 },
];

test('FeatureImportance: bar sorts by |value|, diverging classes, signed true minus', () => {
  const html = render(h(FeatureImportance, { contributions, label: 'Income raised most' }));
  assert.match(html, /bek-feature-importance bek-feature-importance--bar/);
  assert.equal(count(html, /bek-feature-importance__row--raises/g), 2);
  assert.equal(count(html, /bek-feature-importance__row--lowers/g), 2);
  assert.ok(html.indexOf('>Income<') < html.indexOf('>Payment history<'));
  assert.ok(html.indexOf('>Debt ratio<') < html.indexOf('>Region<'));
  assert.match(html, />\+0,42</);
  assert.match(html, />−0,27</);
  assert.match(html, /class="bek-feature-importance__zero"/);
  assert.match(html, />Raises score</);
  assert.match(html, /--bek-dataviz-diverging-pos-3/);
});

test('FeatureImportance: waterfall ends exactly at base + contributions; top-N groups the rest', () => {
  const html = render(
    h(FeatureImportance, { variant: 'waterfall', base: 0.35, contributions, label: 'w' }),
  );
  assert.match(html, /bek-feature-importance--waterfall/);
  assert.match(html, />Base rate</);
  assert.match(html, />0,35</);
  assert.match(html, />Prediction</);
  assert.match(html, />0,78</); // 0,35 + 0,42 + 0,31 − 0,27 − 0,03
  assert.equal(count(html, /bek-feature-importance__row--total/g), 2);
  assert.equal(count(html, /class="bek-feature-importance__connector"/g), 5);
  assert.match(html, />Base → prediction</);
  const top = topContributions(contributions, 2);
  assert.deepEqual(
    top.map((c) => c.feature),
    ['Income', 'Payment history', 'Other features'],
  );
  assert.ok(Math.abs(top[2].value - -0.3) < 1e-9);
});

const points = [
  { x: 0, y: 0, cluster: 'a', label: 'Client 1' },
  { x: 1, y: 0.5, cluster: 'a' },
  { x: 4, y: 3, cluster: 'b', label: 'Client 9' },
  { x: 5, y: 4, cluster: 'b' },
];
const clusters = [
  { id: 'a', label: 'Savers' },
  { id: 'b', label: 'Travelers', size: 1240 },
];

test('ClusterMap: points, hulls, legend toggles; labeled pills; no tick values', () => {
  const html = render(
    h(ClusterMap, { points, clusters, caption: 'UMAP of 12 features', label: 'Two segments' }),
  );
  assert.match(html, /bek-cluster-map bek-cluster-map--default/);
  assert.equal(count(html, /class="bek-cluster-map__point"/g), 4);
  assert.equal(count(html, /class="bek-cluster-map__hull"/g), 2);
  assert.match(html, /aria-label="Clusters"/);
  assert.equal(count(html, /aria-pressed="true"/g), 2);
  assert.match(html, /<title>Client 1 · Savers<\/title>/);
  assert.match(html, /<figcaption class="bek-cluster-map__caption">UMAP of 12 features/);
  assert.match(html, /<td>1\u00a0240<\/td>/);
  assert.doesNotMatch(html, /bek-chart__tick/);
  assert.match(html, /--bek-dataviz-categorical-01/);
  const lab = render(h(ClusterMap, { points, clusters, variant: 'labeled', label: 'x' }));
  assert.match(lab, /bek-cluster-map--labeled/);
  assert.equal(count(lab, /class="bek-cluster-map__tag"/g), 2);
  assert.doesNotMatch(lab, /bek-chart-legend/);
  const foc = render(h(ClusterMap, { points, clusters, focused: 'b', label: 'x' }));
  assert.match(foc, /bek-cluster-map--focused/);
  assert.match(foc, /bek-cluster-map__cluster bek-cluster-map__cluster--active/);
});

test('ClusterMap keeps shapes true: one scale for x and y, drawing centred', () => {
  const html = render(
    h(ClusterMap, {
      points: [
        { x: 0, y: 0, cluster: 'a' },
        { x: 1, y: 1, cluster: 'a' },
      ],
      clusters: [{ id: 'a', label: 'A' }],
      width: 480,
      height: 200,
      label: 'x',
    }),
  );
  const cx = [...html.matchAll(/cx="([\d.]+)" cy="([\d.]+)" r="3"/g)].map((m) => [+m[1], +m[2]]);
  assert.equal(cx.length, 2);
  assert.equal(Math.abs(cx[1][0] - cx[0][0]), Math.abs(cx[1][1] - cx[0][1]));
  assert.equal((cx[0][0] + cx[1][0]) / 2, 240);
});

test('ModelComparison: one row per metric, one dot per model, best value printed', () => {
  const html = render(
    h(ModelComparison, {
      models: [
        'BEK-small',
        'BEK-base',
        { name: 'Vendor X', color: 'var(--bek-dataviz-categorical-05)' },
      ],
      metrics: [
        { label: 'Accuracy', scores: [82, 91, 88], raw: ['82%', '91%', '88%'] },
        { label: 'Speed', scores: [95, 72, 60] },
      ],
      label: 'BEK-base leads on accuracy',
    }),
  );
  assert.match(html, /bek-model-comparison bek-model-comparison--default/);
  assert.equal(count(html, /class="bek-model-comparison__row"/g), 2);
  assert.equal(count(html, /class="bek-model-comparison__dot"/g), 6);
  assert.equal(count(html, /class="bek-model-comparison__best"/g), 2);
  assert.match(html, /class="bek-model-comparison__best"[^>]*>91</);
  assert.match(html, /class="bek-model-comparison__best"[^>]*>95</);
  assert.match(html, /<title>Accuracy — BEK-small 82%, BEK-base 91%, Vendor X 88%<\/title>/);
  assert.match(html, /aria-label="Models"/);
  assert.match(html, />Score 0–100 · higher is better</);
  assert.match(html, /fill:var\(--bek-dataviz-categorical-05\)/);
  assert.match(html, /<th scope="col">Vendor X<\/th>/);
});
