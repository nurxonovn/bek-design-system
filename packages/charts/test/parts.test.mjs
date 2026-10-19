import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup as render } from 'react-dom/server';
import {
  ChartLegend,
  ChartTooltip,
  Delta,
  deltaVariant,
  LegendItem,
  Sparkline,
  sparklineTrend,
} from '../dist/index.js';

test('LegendItem: static span by default, aria-pressed toggle with onToggle', () => {
  assert.match(
    render(h(LegendItem, { variant: 'square' }, 'Cards')),
    /^<span class="bek-legend-item bek-legend-item--square"/,
  );
  const btn = render(h(LegendItem, { hidden: true, onToggle: () => {} }, 'Loans'));
  assert.match(btn, /<button[^>]*aria-pressed="false"/);
  assert.match(btn, /bek-legend-item--hidden/);
});

test('ChartLegend renders a labelled list with custom colours', () => {
  const html = render(
    h(ChartLegend, {
      items: [
        { label: 'A', color: 'var(--bek-dataviz-categorical-02)' },
        { label: 'B', variant: 'dashed' },
      ],
    }),
  );
  assert.match(html, /<ul class="bek-chart-legend" aria-label="Legend">/);
  assert.match(html, /--bek-legend-color:var\(--bek-dataviz-categorical-02\)/);
  assert.match(html, /bek-legend-item--dashed/);
});

test('Delta: variant from sign, betterWhen and threshold', () => {
  assert.equal(deltaVariant(12.4), 'positive');
  assert.equal(deltaVariant(8, 'down'), 'negative');
  assert.equal(deltaVariant(0.2), 'neutral');
  const html = render(h(Delta, { value: -3.1 }));
  assert.match(html, /bek-delta--negative/);
  assert.match(html, />−3,1%</);
  assert.match(html, /aria-hidden="true"/);
});

test('ChartTooltip: role tooltip, single vs multi, max 6 rows', () => {
  assert.match(
    render(h(ChartTooltip, { title: 'Jan', rows: [{ label: 'A', value: '1' }] })),
    /role="tooltip" class="bek-chart-tooltip bek-chart-tooltip--single"/,
  );
  const rows = Array.from({ length: 8 }, (_, i) => ({ label: `S${i}`, value: String(i) }));
  const html = render(h(ChartTooltip, { rows }));
  assert.match(html, /bek-chart-tooltip--multi/);
  assert.equal(html.match(/bek-chart-tooltip__row"/g).length, 6);
});

test('Sparkline: trend colour class, end dot, bars variant', () => {
  assert.equal(sparklineTrend([10, 12, 15]), 'up');
  assert.equal(sparklineTrend([10, 10.01]), 'neutral');
  const line = render(h(Sparkline, { data: [5, 4, 3], label: 'Down' }));
  assert.match(line, /bek-sparkline--line bek-sparkline--down/);
  assert.match(line, /role="img" aria-label="Down"/);
  assert.match(line, /<circle class="bek-sparkline__dot"/);
  const bars = render(h(Sparkline, { data: [1, 2, 3], variant: 'bars', label: 'Bars' }));
  assert.equal(bars.match(/bek-sparkline__bar--last/g).length, 1);
});
