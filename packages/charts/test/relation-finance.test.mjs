import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup as render } from 'react-dom/server';
import {
  BeeswarmChart,
  CandlestickChart,
  CohortHeatmap,
  GaugeChart,
  NetworkGraph,
  RadarChart,
  ScatterChart,
  beeswarmLayout,
  scatterCorrelation,
} from '../dist/index.js';

const count = (html, re) => (html.match(re) || []).length;
const svgAttr = (html, name) =>
  Number(html.match(/<svg([^>]*)role="img"/)?.[1].match(new RegExp(`${name}="([\\d.]+)"`))?.[1]);

const axes = ['Speed', 'Quality', 'Cost', 'Support', 'Security', 'UX'];

test('RadarChart single: 3 rings, one spoke per axis, one profile, no legend', () => {
  const html = render(
    h(RadarChart, {
      axes,
      series: [{ name: 'BEK', values: [90, 70, 50, 80, 85, 75] }],
      label: 'P',
    }),
  );
  assert.match(html, /<figure class="bek-chart bek-radar-chart bek-radar-chart--single">/);
  assert.equal(count(html, /class="bek-radar-chart__ring"/g), 3);
  assert.equal(count(html, /class="bek-radar-chart__spoke"/g), 6);
  assert.equal(count(html, /bek-radar-chart__series"/g), 1);
  assert.equal(count(html, /class="bek-radar-chart__point"/g), 6);
  assert.match(html, /role="img" aria-label="P"/);
  assert.doesNotMatch(html, /bek-chart-legend/);
  assert.match(html, /<th scope="row">Speed<\/th><td>90<\/td>/);
});

test('RadarChart compare: legend, max 3 series, square geometry is centred', () => {
  const series = [1, 2, 3, 4].map((n) => ({ name: `S${n}`, values: axes.map(() => 20 * n) }));
  const html = render(h(RadarChart, { axes, series, width: 600, height: 200, label: 'C' }));
  assert.match(html, /bek-radar-chart--compare/);
  assert.match(html, /bek-chart-legend/);
  assert.equal(count(html, /bek-radar-chart__series"/g), 3);
  // Top spoke ends straight above the centre (300, 100): radius = 200/2 − 28 = 72.
  assert.match(html, /x1="300" y1="100" x2="300" y2="28"/);
  assert.match(html, /<title>Speed: S1 20, S2 40, S3 60<\/title>/);
});

test('ScatterChart default / bubble / trend-line', () => {
  const data = [
    { x: 10, y: 12, size: 4, group: 'Retail' },
    { x: 40, y: 35, size: 16, group: 'SME' },
    { x: 80, y: 70, size: 9, group: 'Retail' },
    { x: 95, y: 92, size: 1, group: 'SME' },
  ];
  const def = render(h(ScatterChart, { data: data.map(({ x, y }) => ({ x, y })), label: 'S' }));
  assert.match(def, /bek-scatter-chart--default/);
  assert.equal(count(def, /bek-scatter-chart__point"/g), 4);
  assert.match(def, /r="4"/);
  assert.doesNotMatch(def, /bek-chart-legend/);

  const bubble = render(h(ScatterChart, { data, variant: 'bubble', label: 'B' }));
  assert.match(bubble, /bek-scatter-chart--bubble/);
  assert.match(bubble, /bek-chart-legend/);
  assert.match(bubble, /r="16"/);
  assert.match(bubble, /<th scope="col">Size<\/th>/);

  const trend = render(
    h(ScatterChart, { data, variant: 'trend-line', seriesName: 'Clients', label: 'T' }),
  );
  assert.match(trend, /bek-scatter-chart--trend-line/);
  assert.equal(count(trend, /class="bek-scatter-chart__trend"/g), 1);
  assert.equal(count(trend, /class="bek-scatter-chart__band"/g), 1);
  assert.match(trend, /bek-legend-item--dashed/);
  assert.match(trend, /<caption>T \(r = 0,99\)<\/caption>/);
});

test('scatterCorrelation: perfect, inverse and undefined', () => {
  assert.equal(
    scatterCorrelation([
      { x: 1, y: 2 },
      { x: 2, y: 4 },
      { x: 3, y: 6 },
    ]),
    1,
  );
  assert.equal(
    scatterCorrelation([
      { x: 1, y: 3 },
      { x: 2, y: 2 },
      { x: 3, y: 1 },
    ]),
    -1,
  );
  assert.ok(Number.isNaN(scatterCorrelation([{ x: 1, y: 1 }])));
});

test('BeeswarmChart: one row per group, dot per value, summary table', () => {
  const data = [
    ...[10, 50, 50, 50, 52, 90].map((value) => ({ group: 'Retail', value })),
    ...[30, 31].map((value) => ({ group: 'SME', value, label: 'Client' })),
  ];
  const html = render(h(BeeswarmChart, { data, domain: [0, 100], label: 'Swarm' }));
  assert.match(html, /<figure class="bek-chart bek-beeswarm-chart bek-beeswarm-chart--default">/);
  assert.equal(count(html, /class="bek-beeswarm-chart__group"/g), 2);
  assert.equal(count(html, /bek-beeswarm-chart__dot"/g), 8);
  assert.match(html, /fill:var\(--bek-chart-series-2, var\(--bek-dataviz-categorical-02\)\)/);
  assert.match(html, /<th scope="row">Retail<\/th><td>6<\/td><td>50<\/td><td>10<\/td><td>90<\/td>/);
  assert.match(html, /<title>Client · SME: 30<\/title>/);
});

test('beeswarmLayout never overlaps dots within the band', () => {
  const items = Array.from({ length: 30 }, (_, i) => ({
    x: 100 + (i % 5),
    d: { group: 'g', value: i },
  }));
  const placed = beeswarmLayout(items, 3.5, 200);
  for (let i = 0; i < placed.length; i++)
    for (let j = i + 1; j < placed.length; j++) {
      const dist = Math.hypot(placed[i].x - placed[j].x, placed[i].y - placed[j].y);
      assert.ok(dist >= 7 - 1e-6, `dots ${i} and ${j} overlap`);
    }
  assert.ok(placed.every((p) => Math.abs(p.y) <= 200));
  assert.ok(beeswarmLayout(items, 3.5, 10).every((p) => Math.abs(p.y) <= 10));
});

const nodes = [
  { id: 'bank', label: 'BEK Bank', group: 'Core' },
  { id: 'pay', label: 'Payments', group: 'Payments' },
  { id: 'cards', label: 'Cards', group: 'Payments' },
  { id: 'loans', label: 'Loans', group: 'Lending' },
  { id: 'mortgage', label: 'Mortgage', group: 'Lending' },
  { id: 'auto', label: 'Auto', group: 'Lending' },
];
const links = [
  { source: 'bank', target: 'pay' },
  { source: 'bank', target: 'cards' },
  { source: 'bank', target: 'loans' },
  { source: 'loans', target: 'mortgage' },
  { source: 'loans', target: 'auto' },
  { source: 'pay', target: 'ghost' },
];

test('NetworkGraph default: deterministic layout, links, legend, adjacency table', () => {
  const a = render(h(NetworkGraph, { nodes, links, label: 'Net' }));
  const b = render(h(NetworkGraph, { nodes, links, label: 'Net' }));
  assert.equal(a, b);
  assert.match(a, /bek-network-graph--default/);
  assert.equal(count(a, /class="bek-network-graph__link"/g), 5);
  assert.equal(count(a, /bek-network-graph__node"/g), 6);
  assert.equal(count(a, /bek-legend-item /g), 3);
  assert.match(a, /<th scope="row">BEK Bank<\/th><td>Core<\/td><td>Payments, Cards, Loans<\/td>/);
  // All nodes stay inside the plot.
  for (const m of a.matchAll(/<circle cx="([\d.-]+)" cy="([\d.-]+)"/g)) {
    assert.ok(+m[1] >= 0 && +m[1] <= 480 && +m[2] >= 0 && +m[2] <= 200);
  }
});

test('NetworkGraph focus dims non-neighbours and uses preset x/y without stretching', () => {
  const preset = nodes.map((n, i) => ({ ...n, x: i, y: i % 2 }));
  const html = render(
    h(NetworkGraph, { nodes: preset, links, variant: 'focus', focus: 'loans', label: 'F' }),
  );
  assert.match(html, /bek-network-graph--focus/);
  assert.equal(count(html, /bek-network-graph__node--dim/g), 2);
  assert.equal(count(html, /bek-network-graph__link--active/g), 3);
  assert.match(html, /bek-network-graph__node--focus/);
  const xs = [...html.matchAll(/<circle cx="([\d.-]+)" cy="([\d.-]+)"/g)].map((m) => [
    +m[1],
    +m[2],
  ]);
  // Uniform scale: Δx between neighbours equals Δy between rows (1 unit each).
  assert.ok(Math.abs(xs[1][0] - xs[0][0] - (xs[1][1] - xs[0][1])) < 0.02);
});

const candles = [
  { t: '1 Oct', o: 61, h: 63, l: 56, c: 58, v: 12400 },
  { t: '2 Oct', o: 58, h: 62, l: 57, c: 61, v: 9800 },
  { t: '3 Oct', o: 61, h: 64, l: 60, c: 61, v: 7000 },
];

test('CandlestickChart default: up/down colours, wick + body per candle, OHLC table', () => {
  const html = render(h(CandlestickChart, { data: candles, label: 'Rate' }));
  assert.match(html, /bek-candlestick-chart--default/);
  assert.equal(count(html, /bek-candlestick-chart__candle--down/g), 1);
  assert.equal(count(html, /bek-candlestick-chart__candle--up/g), 2);
  assert.equal(count(html, /class="bek-candlestick-chart__wick"/g), 3);
  assert.equal(count(html, /class="bek-candlestick-chart__body"/g), 3);
  assert.equal(count(html, /class="bek-candlestick-chart__volume"/g), 0);
  assert.match(html, /--bek-legend-color:var\(--bek-dataviz-positive\)/);
  assert.match(
    html,
    /<title>1 Oct: open 61, close 58, high 63, low 56, volume 12\u00a0400<\/title>/,
  );
  assert.equal(svgAttr(html, 'height'), 200);
});

test('CandlestickChart volume adds bars under the plot', () => {
  const html = render(h(CandlestickChart, { data: candles, variant: 'volume', label: 'V' }));
  assert.match(html, /bek-candlestick-chart--volume/);
  assert.equal(count(html, /class="bek-candlestick-chart__volume"/g), 3);
  assert.equal(svgAttr(html, 'height'), 248);
  assert.match(html, /<th scope="col">Volume<\/th>/);
});

test('NetworkGraph labels never overlap; crowded labels are hidden but stay in the table', () => {
  const crowded = Array.from({ length: 12 }, (_, i) => ({
    id: `n${i}`,
    label: `Long node name ${i}`,
    group: 'G',
    x: i % 4,
    y: Math.floor(i / 4),
  }));
  const html = render(
    h(NetworkGraph, { nodes: crowded, links: [], labelMinRadius: 0, width: 240, label: 'Crowd' }),
  );
  const boxes = [
    ...html.matchAll(
      /__label" x="([\d.-]+)" y="([\d.-]+)" dy="0.32em" text-anchor="(\w+)">([^<]+)</g,
    ),
  ].map(([, x, y, a, t]) => {
    const w = t.length * 6.4;
    const x0 = a === 'start' ? +x : a === 'end' ? +x - w : +x - w / 2;
    return { x0, x1: x0 + w, y0: +y - 7, y1: +y + 7 };
  });
  assert.ok(boxes.length > 0 && boxes.length < 12);
  for (let i = 0; i < boxes.length; i++)
    for (let j = i + 1; j < boxes.length; j++) {
      const [a, b] = [boxes[i], boxes[j]];
      assert.ok(!(a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1), `labels ${i}/${j}`);
    }
  assert.equal(count(html, /<th scope="row">Long node name/g), 12);
});

const cohorts = [
  { label: 'Jan 2026', size: 1240, values: [100, 62, 48, 41, 37, 34] },
  { label: 'Feb 2026', size: 1180, values: [100, 58, 45, 38, 35] },
  { label: 'Jun 2026', size: 1630, values: [100] },
];

test('CohortHeatmap percent: triangle of cells on CMP-07 levels only', () => {
  const html = render(h(CohortHeatmap, { cohorts, label: 'Retention' }));
  assert.match(html, /bek-cohort-heatmap--percent/);
  assert.equal(count(html, /bek-cohort-heatmap__cell /g), 12);
  const levels = [...html.matchAll(/bek-cohort-heatmap__cell--(\d+)/g)].map((m) => +m[1]);
  assert.ok(levels.every((l) => [200, 300, 600, 700].includes(l)));
  assert.match(html, /cell--700"><rect[^>]*><\/rect><text[^>]*>100%<\/text>/);
  assert.match(html, /cell--200"><rect[^>]*><\/rect><text[^>]*>34%<\/text>/);
  assert.match(html, /<title>Jan 2026 · M2: 48% \(595\)<\/title>/);
  assert.match(html, /<th scope="col">M5<\/th>/);
  assert.match(html, /tabindex="0"/);
});

test('CohortHeatmap absolute shows counts with uz-UZ grouping', () => {
  const html = render(h(CohortHeatmap, { cohorts, variant: 'absolute', label: 'Retention' }));
  assert.match(html, /bek-cohort-heatmap--absolute/);
  assert.match(html, /<text[^>]*>1\u00a0240<\/text>/);
  assert.match(html, /<text[^>]*>769<\/text>/);
});

test('GaugeChart default: meter role, value arc on track, bounds', () => {
  const html = render(
    h(GaugeChart, { value: 620, min: 300, max: 850, caption: 'Credit score', label: 'Score' }),
  );
  assert.match(html, /bek-gauge-chart--default/);
  assert.match(
    html,
    /role="meter" aria-label="Credit score" aria-valuemin="300" aria-valuemax="850" aria-valuenow="620" aria-valuetext="620"/,
  );
  assert.match(html, /class="bek-gauge-chart__track"/);
  assert.match(html, /stroke-dasharray="58.18 100"/);
  assert.match(html, />300<\/text>/);
  assert.match(html, />850<\/text>/);
  assert.match(html, /role="img" aria-label="Score"/);
});

test('GaugeChart zones: three tones, needle, zone in valuetext', () => {
  const html = render(
    h(GaugeChart, {
      variant: 'zones',
      value: 620,
      min: 300,
      max: 850,
      zones: [
        { to: 520, label: 'Poor' },
        { to: 685, label: 'Fair' },
        { to: 850, label: 'Good' },
      ],
      label: 'Score',
    }),
  );
  assert.match(html, /bek-gauge-chart--zones/);
  assert.match(html, /bek-gauge-chart__zone--negative/);
  assert.match(html, /bek-gauge-chart__zone--warning/);
  assert.match(html, /bek-gauge-chart__zone--positive/);
  assert.match(html, /class="bek-gauge-chart__needle"/);
  assert.match(html, /aria-valuetext="620 — Fair"/);
  assert.match(html, /<title>Fair: 520–685<\/title>/);
});
