import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup as render } from 'react-dom/server';
import { BarChart } from '../dist/index.js';

const data = [
  { label: 'Jan', values: [42, 35] },
  { label: 'Feb', values: [51, 40] },
  { label: 'Mar', values: [-8, 12] },
];

test('BarChart vertical: one bar per category, axis, baseline and data table', () => {
  const html = render(h(BarChart, { data, label: 'Orders' }));
  assert.match(html, /<figure class="bek-chart bek-bar-chart bek-bar-chart--vertical">/);
  assert.equal(html.match(/bek-bar-chart__bar"/g).length, 3);
  assert.match(html, /class="bek-chart__baseline"/);
  assert.match(html, /<table class="bek-chart__sr">/);
  assert.doesNotMatch(html, /bek-chart-legend/);
});

test('BarChart grouped shows legend and one bar per series', () => {
  const html = render(
    h(BarChart, {
      data,
      variant: 'grouped',
      series: [{ name: '2026' }, { name: '2025' }],
      label: 'Orders',
    }),
  );
  assert.match(html, /bek-chart-legend/);
  assert.equal(html.match(/bek-bar-chart__bar"/g).length, 6);
  assert.match(html, /fill:var\(--bek-chart-series-2, var\(--bek-dataviz-categorical-02\)\)/);
});

test('BarChart stacked rounds only the top segment, horizontal lists values', () => {
  const stacked = render(
    h(BarChart, { data: [{ label: 'A', values: [1, 2, 3] }], variant: 'stacked', label: 'S' }),
  );
  assert.equal(stacked.match(/Q/g).length, 2);
  const hz = render(
    h(BarChart, {
      data: [{ label: 'Toshkent', values: [4820] }],
      variant: 'horizontal',
      label: 'H',
    }),
  );
  assert.match(hz, /bek-bar-chart__category[^>]*>Toshkent</);
  assert.match(hz, /bek-bar-chart__value[^>]*>4 820</);
});
