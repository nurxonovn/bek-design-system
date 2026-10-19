import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  formatNumber,
  formatPercent,
  seriesColor,
  textCellLevel,
  textOnCell,
  trendColor,
} from '../dist/index.js';

const NB = ' ';

test('formatNumber: uz-UZ groups, comma decimals, true minus', () => {
  assert.equal(formatNumber(12400), `12${NB}400`);
  assert.equal(formatNumber(-3.14, { decimals: 1 }), '−3,1');
  assert.equal(formatNumber(4820000, { compact: true }), `4,8${NB}mln`);
  assert.equal(formatNumber(4000000, { compact: true }), `4${NB}mln`);
  assert.equal(formatNumber(1250000000, { compact: true }), `1,3${NB}mlrd`);
  assert.equal(formatNumber(0, { signed: true }), '0');
  assert.equal(formatNumber(Number.NaN), '—');
});

test('formatPercent: signed and fixed decimals', () => {
  assert.equal(formatPercent(12.4, { signed: true }), '+12,4%');
  assert.equal(formatPercent(-3.1, { signed: true }), '−3,1%');
  assert.equal(formatPercent(12), '12,0%');
});

test('colours come from dataviz tokens only', () => {
  assert.equal(seriesColor(0), 'var(--bek-chart-series-1, var(--bek-dataviz-categorical-01))');
  assert.equal(seriesColor(8), seriesColor(0));
  assert.equal(trendColor('down'), 'var(--bek-dataviz-negative)');
});

test('text cells use only the 4 contrast-safe sequential levels (CMP-07)', () => {
  assert.deepEqual([0.02, 0.1, 0.5, 0.9].map(textCellLevel), [200, 300, 600, 700]);
  assert.equal(textOnCell(300), 'var(--bek-text-primary)');
  assert.equal(textOnCell(700), 'var(--bek-text-inverse)');
});
