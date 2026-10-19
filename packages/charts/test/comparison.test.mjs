import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup as render } from 'react-dom/server';
import {
  BulletChart,
  BumpChart,
  DumbbellChart,
  LollipopChart,
  RadialBarChart,
  SlopeChart,
} from '../dist/index.js';

const count = (html, re) => (html.match(re) || []).length;

test('LollipopChart: sorted descending, one stem + head per row, ranked data table', () => {
  const html = render(
    h(LollipopChart, {
      data: [
        { label: 'QA', value: 52 },
        { label: 'Design', value: 88 },
        { label: 'Frontend', value: 12400 },
      ],
      label: 'Skills',
    }),
  );
  assert.match(html, /<figure class="bek-chart bek-lollipop-chart bek-lollipop-chart--default">/);
  assert.match(html, /<svg class="bek-chart__svg"[^>]*role="img" aria-label="Skills"/);
  assert.equal(count(html, /class="bek-lollipop-chart__stem"/g), 3);
  assert.equal(count(html, /bek-lollipop-chart__head"/g), 3);
  const labels = [...html.matchAll(/bek-lollipop-chart__label"[^>]*>([^<]+)</g)].map((m) => m[1]);
  assert.deepEqual(labels, ['Frontend', 'Design', 'QA']);
  assert.match(html, /bek-lollipop-chart__value"[^>]*>12\s400</);
  assert.match(html, /<th scope="row">1\. Frontend<\/th>/);
});

test('LollipopChart keeps natural order with sort={false}', () => {
  const html = render(
    h(LollipopChart, {
      data: [
        { label: 'Jan', value: 1 },
        { label: 'Feb', value: 9 },
      ],
      sort: false,
      label: 'Months',
    }),
  );
  assert.match(html, /<th scope="row">1\. Jan<\/th>/);
});

test('DumbbellChart: legend from/to, two points per row, signed delta with true minus', () => {
  const html = render(
    h(DumbbellChart, {
      fromLabel: 'Plan',
      toLabel: 'Actual',
      data: [
        { label: 'Q1', from: 40, to: 56 },
        { label: 'Q2', from: 47, to: 44 },
      ],
      label: 'Plan vs actual',
    }),
  );
  assert.match(html, /bek-chart bek-dumbbell-chart bek-dumbbell-chart--default/);
  assert.match(html, /bek-chart-legend[\s\S]*Plan[\s\S]*Actual/);
  assert.equal(count(html, /bek-dumbbell-chart__point--from/g), 2);
  assert.equal(count(html, /bek-dumbbell-chart__point--to/g), 2);
  assert.match(html, /bek-dumbbell-chart__delta"[^>]*>\+16</);
  assert.match(html, /bek-dumbbell-chart__delta"[^>]*>−3</);
  assert.match(html, /<th scope="col">Difference<\/th>/);
});

test('BulletChart single KPI: three ranges dark→light, value bar, taller target tick', () => {
  const html = render(
    h(BulletChart, { name: 'Revenue', value: 72, target: 80, ranges: [50, 75, 100], label: 'KPI' }),
  );
  assert.match(html, /bek-chart bek-bullet-chart bek-bullet-chart--default/);
  assert.equal(count(html, /bek-bullet-chart__range bek-bullet-chart__range--/g), 3);
  const levels = [...html.matchAll(/bek-bullet-chart__range--(\d+)/g)].map((m) => m[1]);
  assert.deepEqual(levels, ['100', '200', '300']);
  assert.equal(count(html, /bek-bullet-chart__bar"/g), 1);
  assert.match(html, /class="bek-bullet-chart__target"/);
  assert.doesNotMatch(html, /--reached/);
  assert.match(html, /<td>90%<\/td>/);
});

test('BulletChart stacked data marks reached rows', () => {
  const html = render(
    h(BulletChart, {
      data: [
        { name: 'Revenue', value: 72, target: 80, ranges: [50, 75, 100] },
        { name: 'NPS', value: 84, target: 75 },
      ],
      max: 100,
      label: 'KPIs',
    }),
  );
  assert.equal(count(html, /class="bek-bullet-chart__row/g), 2);
  assert.equal(count(html, /bek-bullet-chart__row--reached/g), 1);
});

test('RadialBarChart default: ≤4 rings with tracks and a valued legend; square geometry', () => {
  const data = ['A', 'B', 'C', 'D', 'E'].map((label, i) => ({ label, value: 0.9 - i * 0.2 }));
  const html = render(h(RadialBarChart, { data, size: 200, label: 'Goals' }));
  assert.match(html, /bek-chart bek-radial-bar-chart bek-radial-bar-chart--default/);
  assert.match(html, /width="200" height="200" viewBox="-100 -100 200 200" role="img"/);
  assert.equal(count(html, /class="bek-radial-bar-chart__track"/g), 4);
  assert.equal(count(html, /bek-radial-bar-chart__value"/g), 4);
  assert.equal(count(html, /<li class="bek-radial-bar-chart__item"/g), 4);
  assert.match(html, /bek-radial-bar-chart__amount">90%</);
  assert.doesNotMatch(html, /bek-radial-bar-chart__center/);
});

test('RadialBarChart progress: centre value (mean) and caption', () => {
  const html = render(
    h(RadialBarChart, {
      variant: 'progress',
      centerLabel: 'weekly goal',
      data: [
        { label: 'Move', value: 0.7 },
        { label: 'Learn', value: 0.8 },
      ],
      label: 'Weekly',
    }),
  );
  assert.match(html, /bek-radial-bar-chart--progress/);
  assert.match(html, /bek-radial-bar-chart__total">75%</);
  assert.match(html, /bek-radial-bar-chart__caption">weekly goal</);
});

test('BumpChart: rank axis #1…#n, one line per series, points skip null ranks, highlight mutes', () => {
  const html = render(
    h(BumpChart, {
      periods: ['Q1', 'Q2', 'Q3'],
      series: [
        { label: 'Tashkent', ranks: [1, 1, 2] },
        { label: 'Samarkand', ranks: [2, null, 1] },
      ],
      highlight: 'Tashkent',
      label: 'Ranking',
    }),
  );
  assert.match(html, /bek-chart bek-bump-chart bek-bump-chart--default bek-bump-chart--highlight/);
  assert.match(html, /bek-chart__tick"[^>]*>#1</);
  assert.match(html, /bek-chart__tick"[^>]*>#2</);
  assert.equal(count(html, /bek-bump-chart__line"/g), 2);
  assert.equal(count(html, /class="bek-bump-chart__point"/g), 5);
  assert.equal(count(html, /bek-bump-chart__series--muted/g), 1);
  assert.match(html, /bek-legend-item--line/);
  assert.match(html, /<td>—<\/td>/);
});

test('SlopeChart default colours by direction; highlight variant mutes the rest', () => {
  const data = [
    { label: 'Cards', from: 42, to: 61 },
    { label: 'Transfers', from: 55, to: 48 },
    { label: 'Flat', from: 30, to: 30 },
  ];
  const html = render(h(SlopeChart, { data, periods: ['2025', '2026'], label: 'Slope' }));
  assert.match(html, /bek-chart bek-slope-chart bek-slope-chart--default/);
  assert.match(html, /bek-slope-chart__item--up/);
  assert.match(html, /bek-slope-chart__item--down/);
  assert.match(html, /bek-slope-chart__item--flat/);
  assert.equal(count(html, /class="bek-slope-chart__axis"/g), 2);
  assert.match(html, /bek-slope-chart__period"[^>]*>2025</);
  assert.match(html, /<td>−7<\/td>/);
  const hl = render(h(SlopeChart, { data, highlight: 'Transfers', label: 'Slope' }));
  assert.match(hl, /bek-slope-chart--highlight/);
  assert.equal(count(hl, /bek-slope-chart__item--muted/g), 2);
  assert.match(hl, /bek-slope-chart__item--down bek-slope-chart__item--active/);
});

test('SlopeChart nudges colliding labels apart', () => {
  const html = render(
    h(SlopeChart, {
      data: [
        { label: 'A', from: 10, to: 50 },
        { label: 'B', from: 10.1, to: 50.1 },
      ],
      label: 'Close',
    }),
  );
  const ys = [...html.matchAll(/class="bek-slope-chart__start"[^>]*y="([\d.]+)"/g)].map((m) =>
    Number(m[1]),
  );
  assert.equal(ys.length, 2);
  assert.ok(Math.abs(ys[0] - ys[1]) >= 16);
});
