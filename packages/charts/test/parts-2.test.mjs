import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup as render } from 'react-dom/server';
import { scaleLinear } from 'd3-scale';
import {
  ANNOTATION_MAX_CHARS,
  ChartAnnotation,
  ChartAxis,
  ChartBrush,
  ChartCrosshair,
  ChartGridLine,
  ChartInsight,
  ChartPoint,
  ChartPredictionZone,
  clampBrushRange,
  GROUP,
  crosshairNearest,
  thinAxisLabels,
} from '../dist/index.js';

const count = (html, re) => (html.match(re) || []).length;

test('ChartInsight: inline note with sr prefix and aria-hidden sparkles', () => {
  const html = render(h(ChartInsight, { text: 'Sales dropped 34% on Tuesday' }));
  assert.match(html, /^<div role="note" class="bek-ai-insight bek-ai-insight--inline">/);
  assert.match(html, /<svg class="bek-ai-insight__icon"[^>]*aria-hidden="true"/);
  assert.match(html, /<span class="bek-visually-hidden">AI insight: <\/span>Sales dropped/);
});

test('ChartInsight: callout title + Body/S text, loading shows Skeleton and aria-busy', () => {
  const html = render(h(ChartInsight, { variant: 'callout', text: 'Revenue grew 34%' }));
  assert.match(html, /bek-ai-insight--callout/);
  assert.match(html, /<p class="bek-ai-insight__title">AI insight<\/p>/);
  assert.doesNotMatch(html, /bek-visually-hidden/);
  const busy = render(h(ChartInsight, { variant: 'callout', text: 'x', loading: true }));
  assert.match(busy, /aria-busy="true"/);
  assert.match(busy, /bek-skeleton/);
  assert.doesNotMatch(busy, /bek-ai-insight__text/);
});

test('ChartPoint: variants, halo only on active/anomaly, custom colour, standalone img', () => {
  const dot = render(h(ChartPoint, { x: 10, y: 20 }));
  assert.match(
    dot,
    /^<g class="bek-data-point bek-data-point--default" transform="translate\(10 20\)">/,
  );
  assert.equal(count(dot, /<circle/g), 1);
  const active = render(h(ChartPoint, { variant: 'active', color: 'var(--bek-chart-series-2)' }));
  assert.equal(count(active, /bek-data-point__halo/g), 1);
  assert.match(active, /--bek-chart-point-color:var\(--bek-chart-series-2\)/);
  const anomaly = render(
    h(ChartPoint, { variant: 'anomaly', standalone: true, title: '18 Oct: +52% vs expected' }),
  );
  assert.match(anomaly, /<figure class="bek-chart bek-data-point-preview">/);
  assert.match(anomaly, /role="img" aria-label="18 Oct: \+52% vs expected"/);
  assert.match(anomaly, /bek-data-point--anomaly/);
  assert.match(anomaly, /<title>18 Oct: \+52% vs expected<\/title>/);
});

test('ChartAxis: Y ticks right-aligned with uz-UZ compact format', () => {
  const y = scaleLinear().domain([0, 4800000]).range([180, 4]).nice(4);
  const html = render(h(ChartAxis, { scale: y, x: 40, ticks: 4 }));
  assert.match(html, /^<g class="bek-chart-axis bek-chart-axis--y">/);
  assert.match(html, /aria-hidden="true"/);
  assert.match(html, /x="32"[^>]*text-anchor="end"/);
  assert.match(html, new RegExp(`>2${GROUP}mln<`));
  assert.match(render(h(ChartAxis, { scale: y, x: 40, format: (v) => `${v / 1e6}` })), />5</);
  assert.equal(count(html, /bek-chart__tick/g), y.ticks(4).length);
});

test('ChartAxis: X keeps first and last label, skips crowded ones; standalone figure', () => {
  const labels = Array.from({ length: 12 }, (_, i) => ({ x: 20 + i * 20, label: `M${i}x` }));
  const kept = thinAxisLabels(labels);
  assert.equal(kept[0].label, 'M0x');
  assert.equal(kept.at(-1).label, 'M11x');
  assert.ok(kept.length < labels.length);
  const html = render(h(ChartAxis, { variant: 'x', y: 8, labels, standalone: true }));
  assert.match(html, /<figure class="bek-chart bek-chart-axis-preview">/);
  assert.match(html, /role="img" aria-label="X axis"/);
  assert.equal(count(html, /bek-chart__tick/g), kept.length);
  assert.match(html, /text-anchor="middle">M11x</);
});

test('ChartGridLine: solid / baseline reuse chart classes, target is dashed with label', () => {
  assert.match(
    render(h(ChartGridLine, { y: 50 })),
    /<line class="bek-chart__gridline"[^>]*y1="50"/,
  );
  assert.match(
    render(h(ChartGridLine, { variant: 'baseline', y: 180, x1: 40 })),
    /bek-grid-line--baseline" aria-hidden="true"><line class="bek-chart__baseline" x1="40"/,
  );
  const target = render(h(ChartGridLine, { variant: 'target', y: 40, valueLabel: 'Plan 85' }));
  assert.match(target, /bek-grid-line__target/);
  assert.match(target, /bek-grid-line__label" x="480" y="36" text-anchor="end">Plan 85</);
});

test('ChartAnnotation: marker rule, point uses ChartPoint, range band; tag clipped to 24 chars', () => {
  const marker = render(h(ChartAnnotation, { x: 60, text: 'Price change', note: 'Tariff +8%' }));
  assert.match(marker, /bek-annotation bek-annotation--marker/);
  assert.match(marker, /<title>Price change: Tariff \+8%<\/title>/);
  assert.match(marker, /<line class="bek-annotation__rule" x1="60" x2="60" y1="24" y2="200">/);
  const long = 'A very long annotation text that overflows';
  const point = render(h(ChartAnnotation, { variant: 'point', x: 100, y: 100, text: long }));
  assert.match(point, /bek-data-point bek-data-point--active/);
  assert.match(point, /bek-annotation__stem/);
  const shown = point.match(/bek-annotation__tag-text[^>]*>([^<]+)</)[1];
  assert.equal(shown.length, ANNOTATION_MAX_CHARS);
  assert.ok(shown.endsWith('…'));
  const range = render(
    h(ChartAnnotation, { variant: 'range', x: 140, x2: 60, text: 'Holidays', standalone: true }),
  );
  assert.match(range, /<rect class="bek-annotation__band" x="60" y="0" width="80" height="200">/);
  assert.match(range, /role="img" aria-label="Annotation: Holidays"/);
});

test('ChartCrosshair: snaps to nearest, vertical vs both, tags clamped inside plot', () => {
  assert.equal(crosshairNearest([0, 40, 80, 120], 67), 2);
  assert.equal(crosshairNearest([], 10), -1);
  const v = render(h(ChartCrosshair, { x: 140, y: 80, xLabel: '12 Oct', right: 240 }));
  assert.match(v, /bek-crosshair bek-crosshair--vertical" aria-hidden="true"/);
  assert.equal(count(v, /bek-crosshair__rule/g), 1);
  assert.equal(count(v, /bek-crosshair__tag"/g), 1);
  assert.match(v, /bek-data-point--active/);
  const both = render(
    h(ChartCrosshair, { variant: 'both', x: 2, y: 80, xLabel: '1 Oct', yLabel: '4 820' }),
  );
  assert.equal(count(both, /bek-crosshair__rule/g), 2);
  assert.equal(count(both, /bek-crosshair__tag"/g), 2);
  assert.match(both, /bek-crosshair__tag" transform="translate\(0 180\)"/);
  assert.match(both, />4 820</);
});

test('ChartPredictionZone: zone from last observed point, dashed AI edge, Forecast label', () => {
  const html = render(h(ChartPredictionZone, { from: 320, note: 'bek-forecast-v2' }));
  assert.match(html, /^<g class="bek-prediction-zone">/);
  assert.match(
    html,
    /<rect class="bek-prediction-zone__zone" x="320" y="0" width="160" height="200">/,
  );
  assert.match(html, /<line class="bek-prediction-zone__edge" x1="320"/);
  assert.match(html, /bek-prediction-zone__icon[^>]*aria-hidden="true"/);
  assert.match(html, /text-anchor="end">Forecast</);
  assert.match(html, /<title>Forecast: bek-forecast-v2<\/title>/);
  const pv = render(h(ChartPredictionZone, { from: 0, to: 160, standalone: true }));
  assert.match(pv, /role="img" aria-label="Forecast"/);
});

test('clampBrushRange keeps the window inside the series and at least minSpan wide', () => {
  assert.deepEqual(clampBrushRange(-3, 2, 10), { startIndex: 0, endIndex: 5 });
  assert.deepEqual(clampBrushRange(8, 14, 10), { startIndex: 4, endIndex: 10 });
  assert.deepEqual(clampBrushRange(6, 5, 10, 2, 'start'), { startIndex: 3, endIndex: 5 });
  assert.deepEqual(clampBrushRange(2, 2, 10, 3, 'end'), { startIndex: 2, endIndex: 5 });
});

test('ChartBrush: group with two sliders, valuetext, aria-hidden overview outside role=img', () => {
  const html = render(
    h(ChartBrush, {
      data: [1, 3, 2, 5, 4, 6, 5, 8],
      defaultStartIndex: 2,
      defaultEndIndex: 5,
      formatIndex: (i) => `D${i}`,
      label: 'Visible period',
    }),
  );
  assert.match(
    html,
    /^<div role="group" aria-label="Visible period" class="bek-chart bek-range-brush"/,
  );
  assert.equal(count(html, /role="slider"/g), 2);
  assert.match(html, /aria-valuenow="2" aria-valuetext="From D2"/);
  assert.match(html, /aria-valuenow="5" aria-valuetext="To D5"/);
  assert.match(html, /<svg class="bek-range-brush__overview"[^>]*aria-hidden="true"/);
  assert.doesNotMatch(html, /role="img"/);
  assert.match(html, /bek-focus-ring/);
  const controlled = render(h(ChartBrush, { data: [1, 2, 3, 4], startIndex: 1, endIndex: 3 }));
  assert.match(
    controlled,
    /aria-label="Start" aria-valuemin="0" aria-valuemax="2" aria-valuenow="1"/,
  );
});
