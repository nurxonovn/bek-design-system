import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup as render } from 'react-dom/server';
import {
  BoxPlot,
  HorizonChart,
  RidgelineChart,
  Streamgraph,
  boxStats,
  kernelDensity,
  silvermanBandwidth,
} from '../dist/index.js';

const count = (html, re) => (html.match(re) || []).length;

const cities = [
  {
    group: 'Toshkent',
    values: [120, 150, 160, 190, 210, 250, 340, 900],
    labels: ['#1', '#2', '#3', '#4', '#5', '#6', '#7', 'Order 1042'],
  },
  { group: 'Samarqand', values: [80, 110, 135, 150, 180, 230] },
  { group: 'Buxoro', values: [60, 95, 120, 140, 230] },
];

test('boxStats: Tukey five-number summary with outlier indexes; empty → null', () => {
  const s = boxStats([1, 2, 3, 4, 5, 6, 7, 8, 100]);
  assert.equal(s.n, 9);
  assert.equal(s.median, 5);
  assert.equal(s.q1, 3);
  assert.equal(s.q3, 7);
  assert.equal(s.whiskerHigh, 8);
  assert.equal(s.whiskerLow, 1);
  assert.equal(s.max, 100);
  assert.deepEqual(s.outliers, [8]);
  assert.equal(boxStats([]), null);
  assert.equal(boxStats([Number.NaN]), null);
});

test('kernelDensity integrates to ~1; silvermanBandwidth is positive even for constant data', () => {
  const xs = Array.from({ length: 201 }, (_, i) => -10 + i * 0.1);
  const f = kernelDensity([0, 1, 2], xs, silvermanBandwidth([0, 1, 2]));
  const area = f.reduce((a, v) => a + v * 0.1, 0);
  assert.ok(Math.abs(area - 1) < 0.02, `area ${area}`);
  assert.ok(silvermanBandwidth([5, 5, 5]) > 0);
  assert.deepEqual(kernelDensity([], [0, 1], 1), [0, 0]);
});

test('BoxPlot box: figure classes, one box/median/2 whiskers per group, hollow outlier with label', () => {
  const html = render(h(BoxPlot, { data: cities, label: 'Order value by city' }));
  assert.match(html, /<figure class="bek-chart bek-box-plot bek-box-plot--box">/);
  assert.match(html, /<svg class="bek-chart__svg"[^>]*role="img" aria-label="Order value by city"/);
  assert.equal(count(html, /bek-box-plot__box"/g), 3);
  assert.equal(count(html, /class="bek-box-plot__median"/g), 3);
  assert.equal(count(html, /class="bek-box-plot__whisker"/g), 6);
  assert.equal(count(html, /class="bek-box-plot__cap"/g), 6);
  assert.equal(count(html, /class="bek-box-plot__outlier"/g), 2); // Toshkent 900, Buxoro 230
  assert.match(html, /<title>Order 1042 · Toshkent: 900<\/title>/);
  assert.match(
    html,
    /<title>Samarqand: n = 6, min 80, Q1 [^<]+, median 143, Q3 [^<]+, max 230<\/title>/,
  );
  assert.match(html, /<th scope="col">Median<\/th>/);
  assert.match(html, /<th scope="row">Buxoro<\/th><td>5<\/td><td>60<\/td>/);
  assert.equal(count(html, /class="bek-box-plot__label"/g), 3);
});

test('BoxPlot violin and box-points variants; sort by median; n = 1 and n = 0 groups', () => {
  const violin = render(h(BoxPlot, { data: cities, variant: 'violin', label: 'v' }));
  assert.match(violin, /bek-box-plot--violin/);
  assert.equal(count(violin, /bek-box-plot__violin"/g), 3);
  assert.equal(count(violin, /class="bek-box-plot__iqr"/g), 3);
  assert.equal(count(violin, /bek-box-plot__box"/g), 0);

  const points = render(h(BoxPlot, { data: cities, variant: 'box-points', label: 'p' }));
  assert.match(points, /bek-box-plot--box-points/);
  assert.equal(count(points, /class="bek-box-plot__point"/g), 8 + 6 + 5);

  const sorted = render(h(BoxPlot, { data: [...cities].reverse(), sort: true, label: 's' }));
  const labels = [...sorted.matchAll(/bek-box-plot__label"[^>]*>([^<]+)</g)].map((m) => m[1]);
  assert.deepEqual(labels, ['Toshkent', 'Samarqand', 'Buxoro']);

  const sparse = render(
    h(BoxPlot, {
      data: [
        { group: 'One', values: [42] },
        { group: 'None', values: [] },
      ],
      label: 'sparse',
    }),
  );
  assert.equal(count(sparse, /bek-box-plot__box"/g), 0);
  assert.match(sparse, />n = 1</);
  assert.match(sparse, />n = 0</);
  assert.match(sparse, /<th scope="row">None<\/th><td>0<\/td><td>—<\/td>/);
});

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((group, i) => ({
  group,
  values: Array.from({ length: 30 }, (_, k) => 35 - i * 3 + ((k * 7) % 13) - 6),
}));

test('RidgelineChart default: knockout + area + line per ridge, shared axis, n/median/P90 table', () => {
  const html = render(h(RidgelineChart, { data: months, domain: [0, 60], label: 'Delivery time' }));
  assert.match(html, /<figure class="bek-chart bek-ridgeline-chart bek-ridgeline-chart--default">/);
  assert.match(html, /role="img" aria-label="Delivery time"/);
  assert.equal(count(html, /class="bek-ridgeline-chart__knockout"/g), 6);
  assert.equal(count(html, /bek-ridgeline-chart__area"/g), 6);
  assert.equal(count(html, /class="bek-ridgeline-chart__line"/g), 6);
  assert.equal(count(html, /bek-ridgeline-chart__ridge--muted/g), 0);
  const ticks = [...html.matchAll(/class="bek-chart__tick"[^>]*>([^<]+)</g)].map((m) => m[1]);
  assert.deepEqual(ticks, ['0', '20', '40', '60']);
  assert.match(html, /<th scope="col">P90<\/th>/);
  assert.match(html, /<title>Jan: n = 30, median [^<]+, P90 [^<]+<\/title>/);
});

test('RidgelineChart highlight: one ridge in colour + bold label, rest neutral; sparse → dashed', () => {
  const html = render(
    h(RidgelineChart, {
      data: [...months, { group: 'Jul', values: [10, 12, 14] }],
      highlight: 'Jun',
      label: 'h',
    }),
  );
  assert.match(html, /bek-ridgeline-chart--highlight/);
  assert.equal(count(html, /bek-ridgeline-chart__ridge--highlight/g), 1);
  assert.equal(count(html, /bek-ridgeline-chart__ridge--muted/g), 6);
  assert.match(html, /color:var\(--bek-dataviz-neutral\)/);
  assert.match(html, /bek-ridgeline-chart__ridge--sparse/);
  assert.match(html, /low sample/);
});

const channels = ['Mobile app', 'Web', 'Telegram bot'];
const streamData = ['Jan', 'Feb', 'Mar', 'Apr'].flatMap((date, i) =>
  channels.map((series, s) => ({ date, series, value: 100 + i * 20 * (s + 1) })),
);

test('Streamgraph default: one layer per series, square legend, date × series table', () => {
  const html = render(h(Streamgraph, { data: streamData, label: 'Traffic by channel' }));
  assert.match(html, /<figure class="bek-chart bek-streamgraph bek-streamgraph--default">/);
  assert.equal(count(html, /bek-streamgraph__layer"/g), 3);
  assert.match(html, /fill:var\(--bek-chart-series-1, var\(--bek-dataviz-categorical-01\)\)/);
  assert.equal(count(html, /bek-legend-item--square/g), 3);
  assert.doesNotMatch(html, /%<\/text>/);
  assert.match(
    html,
    /<th scope="row">Apr<\/th><td>160<\/td><td>220<\/td><td>280<\/td><td>660<\/td>/,
  );
  assert.match(html, /<title>Mobile app: 520 · [\d,]+%<\/title>/);
});

test('Streamgraph expanded: 0/50/100% ticks, shares in table; hidden series removed from stream', () => {
  const html = render(
    h(Streamgraph, {
      data: streamData,
      variant: 'expanded',
      hiddenSeries: ['Web'],
      label: 'Share',
    }),
  );
  assert.match(html, /bek-streamgraph--expanded/);
  const ticks = [...html.matchAll(/class="bek-chart__tick"[^>]*>([^<]+%)</g)].map((m) => m[1]);
  assert.deepEqual(ticks, ['0%', '50%', '100%']);
  assert.equal(count(html, /bek-streamgraph__layer"/g), 2);
  assert.match(html, /bek-legend-item--hidden/);
  assert.match(html, /<td>100 \(50,0%\)<\/td>/);
});

const regions = ['Toshkent', 'Samarqand', 'Buxoro', 'Farg‘ona'];
const hours = Array.from({ length: 25 }, (_, i) => `${String(i).padStart(2, '0')}:00`);
const horizonData = regions.flatMap((series, r) =>
  hours.map((date, i) => ({
    series,
    date,
    value: r === 2 && i === 3 ? null : Math.round(60 * Math.sin((i + r * 4) / 4)),
  })),
);

test('HorizonChart positive: track + 3 bands per row, sequential fills, range legend', () => {
  const html = render(h(HorizonChart, { data: horizonData, label: 'Load per region' }));
  assert.match(html, /<figure class="bek-chart bek-horizon-chart bek-horizon-chart--positive">/);
  assert.equal(count(html, /class="bek-horizon-chart__track"/g), 4);
  assert.equal(count(html, /bek-horizon-chart__band"/g), 12);
  assert.match(html, /fill:var\(--bek-dataviz-sequential-700\)/);
  assert.equal(count(html, /bek-legend-item--square/g), 3);
  assert.match(html, /bek-legend-item__label">0–20</);
  const ticks = [...html.matchAll(/class="bek-chart__tick"[^>]*>([^<]+)</g)].map((m) => m[1]);
  assert.equal(ticks[0], '00:00');
  assert.equal(ticks.at(-1), '24:00');
  assert.match(html, /<td>—<\/td>/);
  assert.match(html, /no data/);
});

test('HorizonChart diverging: positive and negative band sets, true minus, custom labels', () => {
  const html = render(
    h(HorizonChart, {
      data: horizonData,
      variant: 'diverging',
      bandLabels: ['Above plan', 'Below plan'],
      label: 'vs plan',
    }),
  );
  assert.match(html, /bek-horizon-chart--diverging/);
  assert.equal(count(html, /bek-horizon-chart__band--negative/g), 12);
  assert.match(html, /fill:var\(--bek-dataviz-diverging-pos-4\)/);
  assert.match(html, /fill:var\(--bek-dataviz-diverging-neg-2\)/);
  assert.equal(count(html, /bek-legend-item--square/g), 2);
  assert.match(html, /bek-legend-item__label">Below plan</);
  assert.match(html, /<td>−\d+<\/td>/);
});

test('HorizonChart bands={2} draws two bands per row', () => {
  const html = render(h(HorizonChart, { data: horizonData, bands: 2, label: 'b' }));
  assert.equal(count(html, /bek-horizon-chart__band"/g), 8);
  assert.doesNotMatch(html, /sequential-500/);
});
