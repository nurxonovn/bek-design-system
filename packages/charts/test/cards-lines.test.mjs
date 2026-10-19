import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup as render } from 'react-dom/server';
import { ChartCard, ChartContainer, DonutChart, KpiCard, LineChart } from '../dist/index.js';

test('LineChart: one path per series, gap for null, dashed plan, legend for multi', () => {
  const html = render(
    h(LineChart, {
      labels: ['Jan', 'Feb', 'Mar', 'Apr'],
      series: [
        { name: 'Revenue', values: [1, 2, null, 4] },
        { name: 'Plan', values: [1, 2, 3, 4], dashed: true },
      ],
      label: 'Revenue vs plan',
    }),
  );
  assert.equal(html.match(/class="bek-line-chart__line/g).length, 2);
  assert.match(html, /bek-line-chart__line--dashed/);
  assert.match(html, /stroke:var\(--bek-dataviz-target\)/);
  assert.equal(html.match(/M/g).length >= 3, true);
  assert.match(html, /bek-chart-legend/);
  assert.match(html, /tabindex="0" role="group"/);
  assert.doesNotMatch(html, /role="tooltip"/);
});

test('LineChart area fills the first series with accent/soft', () => {
  const html = render(
    h(LineChart, {
      labels: ['a', 'b'],
      series: [{ name: 'S', values: [1, 2] }],
      area: true,
      label: 'a',
    }),
  );
  assert.match(html, /bek-line-chart--area/);
  assert.match(html, /class="bek-line-chart__area"/);
  assert.doesNotMatch(html, /bek-chart-legend/);
});

test('DonutChart sorts segments, shows total and value legend; progress shows percent', () => {
  const html = render(
    h(DonutChart, {
      data: [
        { label: 'Small', value: 1 },
        { label: 'Big', value: 3 },
      ],
      centerLabel: 'Total',
      label: 'Mix',
    }),
  );
  assert.ok(html.indexOf('>Big<') < html.indexOf('>Small<'));
  assert.match(html, /bek-donut-chart__total">4</);
  assert.match(html, />75%</);
  const pr = render(h(DonutChart, { variant: 'progress', progress: 0.72, label: 'Goal' }));
  assert.match(pr, /bek-donut-chart--progress/);
  assert.match(pr, /bek-donut-chart__total">72%</);
  assert.doesNotMatch(pr, /bek-donut-chart__legend/);
});

test('ChartCard: header, KPI, slot and the four states', () => {
  const def = render(
    h(
      ChartCard,
      {
        title: 'Revenue',
        subtitle: '6M',
        kpi: { value: '4 820 mln', delta: 12.4, comparison: 'vs prev' },
        footer: 'Source: Core',
      },
      h('div', { id: 'chart' }),
    ),
  );
  assert.match(def, /<section class="bek-chart-card bek-chart-card--default" aria-labelledby=/);
  assert.match(def, /bek-delta--positive/);
  assert.match(def, /id="chart"/);
  assert.match(def, /Source: Core/);
  assert.match(render(h(ChartCard, { title: 'R', state: 'loading' })), /aria-busy="true"/);
  assert.match(
    render(h(ChartCard, { title: 'R', state: 'empty', onChangePeriod: () => {} })),
    /Change period/,
  );
  const err = render(
    h(ChartCard, {
      title: 'R',
      state: 'error',
      onRetry: () => {},
      errorSource: 'Error 503',
      footer: 'Source',
    }),
  );
  assert.match(err, /role="alert"/);
  assert.match(err, /Try again/);
  assert.match(err, /Error 503/);
});

test('KpiCard variants: sparkline, compact, progressbar, link', () => {
  const def = render(
    h(KpiCard, {
      label: 'Active users',
      value: '12 480',
      delta: 12.4,
      trend: [1, 2, 3],
      comparison: 'vs last week',
      href: '/u',
    }),
  );
  assert.match(
    def,
    /^<a href="\/u" class="bek-kpi-card bek-kpi-card--default bek-kpi-card--link bek-focus-ring">/,
  );
  assert.match(def, /bek-sparkline/);
  assert.doesNotMatch(
    render(h(KpiCard, { variant: 'compact', label: 'T', value: '1', comparison: 'x' })),
    /bek-kpi-card__comparison/,
  );
  const pr = render(
    h(KpiCard, {
      variant: 'progress',
      label: 'Goal',
      goal: { progress: 0.72, label: '3,6 of 5 mln' },
    }),
  );
  assert.match(pr, /role="progressbar"[^>]*aria-valuenow="72"/);
  assert.match(pr, />72%</);
});

test('ChartContainer renders its child with the initial width', () => {
  const html = render(h(ChartContainer, { initialWidth: 320 }, (w) => h('span', null, String(w))));
  assert.match(html, /<div class="bek-chart-container"><span>320<\/span><\/div>/);
});
