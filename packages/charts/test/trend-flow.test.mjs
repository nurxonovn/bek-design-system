import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup as render } from 'react-dom/server';
import {
  CalendarHeatmap,
  FunnelChart,
  LiveChart,
  SankeyChart,
  TreemapChart,
  WaffleChart,
  WaterfallChart,
} from '../dist/index.js';

const count = (html, re) => (html.match(re) ?? []).length;
const svgOf = (html) => html.slice(html.indexOf('<svg'), html.lastIndexOf('</svg>'));

// LiveChart --------------------------------------------------------------------------------------

const stream = Array.from({ length: 13 }, (_, i) => ({ t: 1_000_000 + i * 5000, v: 40 + i * 2 }));
const at = (t) => `${Math.round((t - 1_000_000) / 1000)}s`;

test('LiveChart: live badge, freshness, line + area, pulsing head and data table', () => {
  const html = render(
    h(LiveChart, { stream, formatTime: at, updated: 'Updated every 5 s', label: 'TPS' }),
  );
  assert.match(
    html,
    /<figure class="bek-chart bek-live-chart bek-live-chart--default bek-live-chart--live">/,
  );
  assert.match(
    html,
    /bek-live-chart__badge[^>]*><span class="bek-live-chart__dot" aria-hidden="true"><\/span>LIVE</,
  );
  assert.match(html, /bek-live-chart__updated">Updated every 5 s</);
  assert.equal(count(html, /class="bek-live-chart__line"/g), 1);
  assert.equal(count(html, /class="bek-live-chart__area"/g), 1);
  assert.equal(count(html, /class="bek-live-chart__pulse"/g), 1);
  assert.match(html, /<svg[^>]*role="img"[^>]*aria-label="TPS"/);
  assert.equal(count(html, /<tr>/g), 1 + stream.length);
  assert.match(html, /<span class="bek-chart__sr" role="status"><\/span>/);
});

test('LiveChart: window keeps only recent points, axis labels span the window', () => {
  const html = render(h(LiveChart, { stream, window: 20_000, formatTime: at, label: 'TPS' }));
  // 40–60 s → 5 nuqta jadvalda
  assert.equal(count(html, /<tr>/g), 1 + 5);
  assert.match(html, />40s</);
  assert.match(html, />60s</);
  assert.doesNotMatch(html, />35s</);
});

test('LiveChart: paused / stale statuses, custom label and announcement', () => {
  const paused = render(h(LiveChart, { stream, status: 'paused', label: 'P' }));
  assert.match(paused, /bek-live-chart--paused/);
  assert.match(paused, />PAUSED</);
  const stale = render(
    h(LiveChart, {
      stream,
      status: 'stale',
      statusLabel: 'KECHIKMOQDA',
      announce: 'Crossed 60',
      domain: [0, 100],
      label: 'S',
    }),
  );
  assert.match(stale, /bek-live-chart--stale/);
  assert.match(stale, />KECHIKMOQDA</);
  assert.match(stale, /role="status">Crossed 60</);
  assert.match(stale, /class="bek-chart__tick"[^>]*>100</);
});

test('LiveChart: empty stream renders without marks', () => {
  const html = render(h(LiveChart, { stream: [], label: 'Empty' }));
  assert.doesNotMatch(html, /bek-live-chart__line/);
  assert.doesNotMatch(html, /bek-live-chart__pulse/);
});

// CalendarHeatmap --------------------------------------------------------------------------------

const days = [
  { date: '2026-01-05', value: 0 },
  { date: '2026-01-06', value: 3 },
  { date: '2026-01-07', value: 10 },
  { date: '2026-01-08', value: 20 },
  { date: '2026-01-09', value: 40 },
];

test('CalendarHeatmap year: 365 cells, binned sequential levels, scale legend', () => {
  const html = render(
    h(CalendarHeatmap, { data: days, bins: [0, 5, 15, 30], unit: 'payments', label: 'Payments' }),
  );
  assert.match(html, /<figure class="bek-chart bek-calendar-heatmap bek-calendar-heatmap--year">/);
  assert.equal(count(html, /class="bek-calendar-heatmap__cell /g), 365);
  assert.match(html, /bek-calendar-heatmap__day--200[^>]*><title>6 Jan, 3 payments</);
  assert.match(html, /bek-calendar-heatmap__day--300[^>]*><title>7 Jan, 10 payments</);
  assert.match(html, /bek-calendar-heatmap__day--500[^>]*><title>8 Jan, 20 payments</);
  assert.match(html, /bek-calendar-heatmap__day--700[^>]*><title>9 Jan, 40 payments</);
  assert.match(html, /bek-calendar-heatmap__day--track[^>]*><title>5 Jan, 0 payments</);
  assert.match(html, /bek-calendar-heatmap__scale" aria-hidden="true"><span>Less<\/span>/);
  assert.equal(count(html, /bek-calendar-heatmap__swatch /g), 5);
  // Hafta kunlari alohida (aylanmaydigan) ustunda, Mon/Wed/Fri
  assert.match(html, /bek-calendar-heatmap__weekdays" width="32"[^>]*aria-hidden="true"/);
  assert.match(html, />Mon<.*>Wed<.*>Fri</);
  assert.equal(count(html, /<tr>/g), 1 + days.length);
});

test('CalendarHeatmap year: weeks start on Monday (1 Jan 2026 is Thursday → row 4)', () => {
  const html = render(h(CalendarHeatmap, { data: days, width: 668, label: 'Y' }));
  // step 12 → Thursday row y = 20 + 3 × 12 = 56
  assert.match(html, /<rect class="bek-calendar-heatmap__cell [^"]*" x="0" y="56"/);
});

test('CalendarHeatmap month: day numbers on CMP-07 levels only (200 · 300 · 600 · 700)', () => {
  const html = render(
    h(CalendarHeatmap, { variant: 'month', data: days, bins: [0, 5, 15, 30], label: 'January' }),
  );
  assert.match(html, /bek-calendar-heatmap--month/);
  assert.equal(count(html, /class="bek-calendar-heatmap__date"/g), 31);
  assert.doesNotMatch(svgOf(html), /day--500/);
  assert.match(html, /day--600/);
  assert.match(html, /day--700/);
  // 1-yanvar payshanba → 4-ustun; sarlavha qatorida Mon…Sun
  assert.equal(count(svgOf(html), /class="bek-chart__tick"/g), 7);
  assert.match(html, /bek-calendar-heatmap__swatch--600/);
});

// TreemapChart -----------------------------------------------------------------------------------

const budget = {
  name: 'Budget',
  children: [
    { name: 'Food', value: 38 },
    {
      name: 'Transport',
      children: [
        { name: 'Taxi', value: 14 },
        { name: 'Metro', value: 8 },
      ],
    },
    { name: 'Utilities', value: 16 },
    { name: 'Fun', value: 12 },
    { name: 'Tiny', value: 0.5 },
  ],
};

test('TreemapChart: one cell per leaf, labels only in chips on big cells', () => {
  const html = render(h(TreemapChart, { data: budget, label: 'Budget' }));
  assert.match(html, /<figure class="bek-chart bek-treemap-chart bek-treemap-chart--default">/);
  assert.equal(count(html, /bek-treemap-chart__cell"/g), 6);
  assert.match(html, /bek-treemap-chart__labels" aria-hidden="true"/);
  assert.match(
    html,
    /bek-treemap-chart__chip[^>]*><span class="bek-treemap-chart__name">Food<\/span><span class="bek-treemap-chart__share">43%</,
  );
  // Kichik katak — yozuvsiz, faqat <title>
  assert.doesNotMatch(html, /__name">Tiny</);
  assert.match(html, /<title>Tiny: 1%/);
  // Matn rangli katak ustida emas: svg ichida <text> yo'q
  assert.doesNotMatch(svgOf(html), /<text/);
  // Guruh rangi: Transport bolalari bir xil rang
  assert.equal(
    count(html, /fill:var\(--bek-chart-series-2, var\(--bek-dataviz-categorical-02\)\)/g),
    2,
  );
});

test('TreemapChart: limit groups the rest into Other on dataviz/neutral', () => {
  const html = render(h(TreemapChart, { data: budget, limit: 3, label: 'B' }));
  assert.match(html, /fill:var\(--bek-dataviz-neutral\)/);
  assert.match(html, /<th scope="row">Other<\/th>/);
  assert.doesNotMatch(html, /<th scope="row">Fun<\/th>/);
});

// WaffleChart ------------------------------------------------------------------------------------

test('WaffleChart: always 100 cells, rounded shares, remainder on track, square legend', () => {
  const html = render(
    h(WaffleChart, {
      data: [
        { label: 'Mobile app', share: 0.456 },
        { label: 'Web', share: 0.284 },
        { label: 'Branch', share: 0.16 },
      ],
      label: '46 percent Mobile app',
    }),
  );
  assert.match(html, /<figure class="bek-chart bek-waffle-chart bek-waffle-chart--default">/);
  assert.equal(count(html, /class="bek-waffle-chart__cell"/g), 100);
  assert.match(
    html,
    /<svg[^>]*width="196" height="196"[^>]*role="img"[^>]*aria-label="46 percent Mobile app"/,
  );
  assert.match(html, /<title>Mobile app: 46%<\/title>/);
  assert.match(html, /<title>Web: 28%<\/title>/);
  assert.match(html, /bek-waffle-chart__part--remainder/);
  assert.equal(count(html, /bek-legend-item--square/g), 4);
  assert.match(
    html,
    /bek-legend-item__label">Other<\/span><\/span><span class="bek-waffle-chart__value">10%/,
  );
});

test('WaffleChart: fill starts bottom-left; shares summing to 1 leave no remainder', () => {
  const html = render(
    h(WaffleChart, {
      data: [
        { label: 'A', share: 1 / 3 },
        { label: 'B', share: 1 / 3 },
        { label: 'C', share: 1 / 3 },
      ],
      label: 'Thirds',
    }),
  );
  assert.equal(count(html, /class="bek-waffle-chart__cell"/g), 100);
  assert.doesNotMatch(html, /__part--remainder/);
  assert.match(
    html,
    /<g class="bek-chart__mark bek-waffle-chart__part"[^>]*><rect class="bek-waffle-chart__cell" x="0" y="180"/,
  );
});

// FunnelChart ------------------------------------------------------------------------------------

const steps = [
  { label: 'Visited', value: 12400 },
  { label: 'Signed up', value: 5210 },
  { label: 'Verified', value: 3880 },
  { label: 'Applied', value: 1940 },
  { label: 'Approved', value: 1120 },
];

test('FunnelChart stepped: bars, flow areas, step-to-step conversion and biggest drop', () => {
  const html = render(h(FunnelChart, { steps, label: 'Signup funnel' }));
  assert.match(html, /<figure class="bek-chart bek-funnel-chart bek-funnel-chart--stepped">/);
  assert.equal(count(html, /class="bek-funnel-chart__bar"/g), 5);
  assert.equal(count(html, /class="bek-funnel-chart__flow"/g), 4);
  assert.match(html, />42%</);
  assert.match(html, />74%</);
  assert.match(html, /bek-funnel-chart__conversion bek-funnel-chart__conversion--drop"[^>]*>42%</);
  assert.match(html, /bek-funnel-chart__count"[^>]*>12\u00a0400</);
  assert.match(html, /<title>Signed up: 5\u00a0210 · 42% of previous · 42% of first<\/title>/);
});

test('FunnelChart horizontal: centred bars with count and share of the first step', () => {
  const html = render(
    h(FunnelChart, { steps, variant: 'horizontal', highlightDrop: false, label: 'Funnel' }),
  );
  assert.match(html, /bek-funnel-chart--horizontal/);
  assert.equal(count(html, /<rect class="bek-funnel-chart__bar"/g), 5);
  assert.match(html, /bek-funnel-chart__name"[^>]*>Approved</);
  assert.match(html, />1\u00a0120<tspan class="bek-funnel-chart__share" dx="4">9%</);
  assert.doesNotMatch(html, /--drop/);
  assert.equal(count(html, /<tr>/g), 6);
});

// WaterfallChart ---------------------------------------------------------------------------------

test('WaterfallChart: totals from zero, signed floats, connectors and legend', () => {
  const html = render(
    h(WaterfallChart, {
      start: { label: 'Q1', value: 60 },
      items: [
        { label: 'Sales', value: 18 },
        { label: 'Services', value: 9 },
        { label: 'Refunds', value: -14 },
        { label: 'Fees', value: -8 },
      ],
      end: { label: 'Q2' },
      label: 'Q1 60 → Q2 65',
    }),
  );
  assert.match(html, /<figure class="bek-chart bek-waterfall-chart bek-waterfall-chart--default">/);
  assert.equal(count(html, /bek-waterfall-chart__step--total/g), 2);
  assert.equal(count(html, /bek-waterfall-chart__step--increase/g), 2);
  assert.equal(count(html, /bek-waterfall-chart__step--decrease/g), 2);
  assert.equal(count(html, /class="bek-waterfall-chart__connector"/g), 5);
  assert.match(html, /bek-waterfall-chart__value"[^>]*>\+18</);
  assert.match(html, /bek-waterfall-chart__value"[^>]*>−14</);
  assert.match(html, /bek-waterfall-chart__value"[^>]*>65</);
  assert.match(html, /<title>Refunds: −14 → 73<\/title>/);
  assert.equal(count(html, /bek-legend-item--square/g), 3);
  assert.match(html, /bek-legend-item__label">Increase</);
});

test('WaterfallChart: explicit end value and custom legend labels', () => {
  const html = render(
    h(WaterfallChart, {
      start: { label: 'Start', value: 10 },
      items: [{ label: 'Loss', value: -4 }],
      end: { label: 'End', value: 7 },
      legendLabels: { increase: "O'sish", decrease: 'Kamayish', total: 'Jami' },
      label: 'W',
    }),
  );
  assert.match(html, />Kamayish</);
  assert.match(html, /<th scope="row">End<\/th><td>7<\/td><td>7<\/td>/);
});

// SankeyChart ------------------------------------------------------------------------------------

const nodes = [
  { id: 'salary', label: 'Salary' },
  { id: 'freelance', label: 'Freelance' },
  { id: 'spent', label: 'Spent' },
  { id: 'saved', label: 'Saved' },
  { id: 'rent', label: 'Rent' },
  { id: 'food', label: 'Food' },
  { id: 'deposit', label: 'Deposit' },
];
const links = [
  { source: 'salary', target: 'spent', value: 45 },
  { source: 'salary', target: 'saved', value: 15 },
  { source: 'freelance', target: 'spent', value: 25 },
  { source: 'freelance', target: 'saved', value: 15 },
  { source: 'spent', target: 'rent', value: 40 },
  { source: 'spent', target: 'food', value: 30 },
  { source: 'saved', target: 'deposit', value: 30 },
];

test('SankeyChart: nodes, links in source colour, shares and table view', () => {
  const html = render(h(SankeyChart, { nodes, links, label: 'Income flow' }));
  assert.match(html, /<figure class="bek-chart bek-sankey-chart bek-sankey-chart--default">/);
  assert.equal(count(html, /class="bek-sankey-chart__bar"/g), 7);
  assert.equal(count(html, /class="bek-sankey-chart__link"/g), 7);
  // Link rangi = manba rangi (salary → seriya 1)
  assert.match(
    html,
    /class="bek-sankey-chart__link"[^>]*style="stroke:var\(--bek-chart-series-1, var\(--bek-dataviz-categorical-01\)\)/,
  );
  // 3-ustun yagona manbadan rang meros oladi: Rent = Spent rangi
  const spent = html.match(/style="fill:([^;"]+)[^"]*"><title>Spent:/)[1];
  const rent = html.match(/style="fill:([^;"]+)[^"]*"><title>Rent:/)[1];
  assert.equal(rent, spent);
  assert.match(html, />Spent<tspan class="bek-sankey-chart__share" dx="4">70%</);
  // Oxirgi ustun yozuvi tugundan chapda
  assert.match(html, /text-anchor="end"[^>]*>Rent</);
  assert.match(html, /<th scope="row">Salary<\/th><td>Spent<\/td><td>45<\/td>/);
});

test('SankeyChart: links to unknown nodes are ignored', () => {
  const html = render(
    h(SankeyChart, {
      nodes: nodes.slice(0, 3),
      links: [...links.slice(0, 1), { source: 'salary', target: 'ghost', value: 5 }],
      label: 'S',
    }),
  );
  assert.equal(count(html, /class="bek-sankey-chart__link"/g), 1);
});
