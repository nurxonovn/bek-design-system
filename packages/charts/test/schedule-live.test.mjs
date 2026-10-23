import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup as render } from 'react-dom/server';
import {
  ChartCard,
  Countdown,
  countdownParts,
  DataExplorer,
  Gantt,
  GeneratedChart,
  MindMap,
  NumberTicker,
} from '../dist/index.js';

const TASKS = [
  {
    id: 'research',
    name: 'Research',
    team: 'Design',
    start: '2026-10-01',
    end: '2026-10-22',
    progress: 1,
  },
  {
    id: 'ui',
    name: 'UI kit',
    team: 'Design',
    start: '2026-10-28',
    end: '2026-11-25',
    progress: 0.7,
    dependsOn: ['research'],
  },
  {
    id: 'api',
    name: 'Backend API',
    team: 'Engineering',
    start: '2026-11-01',
    end: '2026-12-31',
    progress: 0.55,
  },
  {
    id: 'qa',
    name: 'QA & launch',
    team: 'QA',
    start: '2027-01-01',
    end: '2027-01-24',
    progress: 0,
    dependsOn: ['api'],
  },
];

test('Gantt default: listbox of focusable bars, months, today chip, milestone, legend, table', () => {
  const html = render(
    h(Gantt, {
      tasks: TASKS,
      today: '2026-12-04',
      milestones: [{ name: 'Launch', date: '2027-01-27' }],
      label: 'Reliz rejasi',
    }),
  );
  assert.match(html, /^<figure class="bek-chart bek-gantt bek-gantt--default"/);
  assert.match(html, /role="listbox" aria-label="Reliz rejasi" aria-orientation="vertical"/);
  assert.equal(html.match(/role="option"/g).length, 4);
  // roving tabindex: faqat birinchi bar Tab bilan
  assert.equal(html.match(/tabindex="0"/g).length, 1);
  assert.equal(html.match(/tabindex="-1"/g).length, 3);
  assert.match(
    html,
    /aria-label="UI kit · Design · 28 Oct – 25 Nov · 70% · overdue · Depends on: Research"/,
  );
  // Oct … Jan oylari (domen oy boshidan keyingi oy boshigacha)
  for (const m of ['Oct', 'Nov', 'Dec', 'Jan'])
    assert.match(html, new RegExp(`bek-gantt__month[^>]*>${m}<`));
  assert.match(html, /Today · 4 Dec/);
  assert.match(html, /class="bek-gantt__milestone"/);
  assert.match(html, /stroke-dasharray="4 3"/);
  // jamoa ranglari — kategorik palitra tartibida; legend + Today · milestone
  assert.match(
    html,
    /--bek-gantt-color:var\(--bek-chart-series-2, var\(--bek-dataviz-categorical-02\)\)/,
  );
  assert.match(html, /bek-legend-item--dashed/);
  assert.match(html, /<th scope="col">Task<\/th><th scope="col">Team<\/th>/);
  assert.match(html, /Today: 4 Dec\. Milestones: Launch — 27 Jan\./);
  // bog'liqliklar — 2 ta chiziq
  assert.equal(html.match(/class="bek-gantt__link"/g).length, 2);
  // Default variantda % yozilmaydi; joylashuv logical (RTL'da o'zi teskari)
  assert.doesNotMatch(html, /bek-gantt__percent/);
  assert.match(html, /inset-inline-start:/);
});

test('Gantt progress: planned + done, % outside bar, overdue outline', () => {
  const html = render(
    h(Gantt, {
      tasks: [
        ...TASKS,
        { name: 'Late', team: 'QA', start: '2026-11-01', end: '2026-11-20', progress: 0.4 },
      ],
      today: '2026-12-04',
      variant: 'progress',
      label: 'x',
      labels: {
        today: 'Bugun',
        months: [
          'Yan',
          'Fev',
          'Mar',
          'Apr',
          'May',
          'Iyn',
          'Iyl',
          'Avg',
          'Sen',
          'Okt',
          'Noy',
          'Dek',
        ],
      },
    }),
  );
  assert.match(html, /bek-gantt--progress/);
  assert.equal(html.match(/class="bek-gantt__planned"/g).length, 5);
  assert.match(html, /class="bek-gantt__done" style="inline-size:70%"/);
  assert.match(html, /bek-gantt__percent[^>]*>70%</);
  assert.match(html, /Bugun · 4 Dek/);
  // UI kit (25 Nov, 70%) va Late (20 Nov, 40%) — tugagan, lekin 100% emas
  assert.equal(html.match(/bek-gantt__bar--overdue/g).length, 2);
  assert.match(html, /Late · QA · 1 Noy – 20 Noy · 40% · overdue/);
});

test('NumberTicker: digits hidden from AT, final value in text, configurable aria-live', () => {
  const html = render(
    h(NumberTicker, {
      value: 12480,
      label: 'Active learners right now',
      delta: 12.4,
      context: 'vs. same time yesterday',
    }),
  );
  assert.match(html, /class="bek-number-ticker bek-number-ticker--ticker"/);
  assert.match(html, /<span class="bek-number-ticker__digits" aria-hidden="true">/);
  assert.match(html, /<span class="bek-chart__sr">12.480<\/span>/);
  assert.match(html, /aria-live="polite" aria-atomic="true"/);
  assert.match(html, /bek-delta--positive/);
  assert.match(html, /vs\. same time yesterday/);
  const quiet = render(h(NumberTicker, { value: 5, live: 'off', format: (v) => `${v} so'm` }));
  assert.doesNotMatch(quiet, /aria-live/);
  assert.match(quiet, /5 so&#x27;m/);
  assert.match(render(h(NumberTicker, { value: 1, live: 'assertive' })), /aria-live="assertive"/);
});

test('Countdown: units on blocks, text equivalent, parts without days roll into hours', () => {
  const now = Date.UTC(2026, 9, 20, 3, 22, 51);
  const to = now + ((2 * 24 + 14) * 3600 + 37 * 60 + 9) * 1000;
  const html = render(h(Countdown, { to, now, label: 'Enrolment closes in' }));
  assert.match(html, /bek-number-ticker--countdown/);
  for (const v of ['02', '14', '37', '09']) assert.match(html, new RegExp(`>${v}</span>`));
  assert.equal(html.match(/bek-number-ticker__separator/g).length, 3);
  assert.match(html, /<span class="bek-chart__sr">2 days 14 hours left<\/span>/);
  assert.deepEqual(countdownParts(26 * 3600 * 1000 + 61_000, ['hours', 'min']), [
    { unit: 'hours', value: 26 },
    { unit: 'min', value: 1 },
  ]);
  const ended = render(h(Countdown, { to: now, now, endMessage: 'Closed' }));
  assert.match(ended, /role="status">Closed</);
});

const ROWS = [
  { name: 'English', series: [29, 29.2, 29.1, 29.3], value: 29300, share: 0.56, delta: 0.4 },
  { name: 'UX/UI', series: [31, 36, 44, 48.2], value: 48200, share: 0.92, delta: 12.4 },
  { name: 'SMM', series: [22, 20, 19, 18.1], value: 18100, share: 0.35, delta: -6.2 },
];

test('DataExplorer: real table, sorted by value desc, sparkline + share + delta', () => {
  const html = render(h(DataExplorer, { rows: ROWS, label: 'Kurslar' }));
  assert.match(
    html,
    /^<table class="bek-data-explorer bek-data-explorer--default"><caption class="bek-chart__sr">Kurslar<\/caption>/,
  );
  assert.match(
    html,
    /aria-sort="descending"><button type="button" class="bek-data-explorer__sort bek-focus-ring">Learners/,
  );
  const order = [...html.matchAll(/<th scope="row" class="bek-data-explorer__name">([^<]+)</g)].map(
    (m) => m[1],
  );
  assert.deepEqual(order, ['UX/UI', 'English', 'SMM']);
  assert.match(html, /aria-label="UX\/UI: up"/);
  assert.match(html, /aria-label="SMM: down"/);
  assert.match(html, /inline-size:92%/);
  assert.match(html, /<span class="bek-chart__sr">92%<\/span>/);
  assert.match(html, /48.200/);
  assert.match(html, /−6,2%/);
});

test('DataExplorer compact drops trend and share; controlled sort by name asc', () => {
  const html = render(
    h(DataExplorer, {
      rows: ROWS,
      variant: 'compact',
      sortBy: 'name',
      sortDirection: 'asc',
      label: 'x',
    }),
  );
  assert.match(html, /bek-data-explorer--compact/);
  assert.doesNotMatch(html, /bek-sparkline/);
  assert.doesNotMatch(html, /bek-data-explorer__bar/);
  const order = [...html.matchAll(/<th scope="row" class="bek-data-explorer__name">([^<]+)</g)].map(
    (m) => m[1],
  );
  assert.deepEqual(order, ['English', 'SMM', 'UX/UI']);
  assert.match(html, /aria-sort="ascending"/);
  const empty = render(h(DataExplorer, { rows: [], empty: 'No courses', label: 'x' }));
  assert.match(empty, /colSpan="5"|colspan="5"/);
});

test('MindMap tree: collapsed branch shows +n, every branch element tagged for hover fade', () => {
  const root = {
    label: 'Q4 goals',
    children: [
      {
        label: 'Product',
        collapsed: true,
        children: [{ label: 'Mobile app' }, { label: 'AI tutor' }],
      },
      { label: 'Growth', children: [{ label: 'Telegram ads' }] },
    ],
  };
  const html = render(h(MindMap, { root, layout: 'tree', label: 'x' }));
  assert.match(html, /bek-mind-map__leaf bek-mind-map__leaf--more[^>]*data-branch="0"/);
  assert.match(html, /bek-mind-map__leaf-label">\+2</);
  assert.doesNotMatch(html, /bek-mind-map__leaf-label">Mobile app</);
  // ekran o'quvchi ro'yxatida yig'ilgan barglar ham bor
  assert.match(html, /<li>Mobile app<\/li>/);
  assert.match(html, /class="bek-mind-map__link"[^>]*data-branch="1"/);
});

test('ChartCard: header actions slot and polite state announcement', () => {
  const html = render(
    h(ChartCard, {
      title: 'Revenue',
      state: 'loading',
      actions: h('button', { type: 'button' }, 'Export'),
    }),
  );
  assert.match(
    html,
    /<div class="bek-chart-card__actions"><button type="button">Export<\/button><\/div>/,
  );
  assert.match(html, /<span class="bek-chart__sr" role="status">Loading chart…<\/span>/);
  const ok = render(h(ChartCard, { title: 'Revenue' }));
  assert.match(ok, /<span class="bek-chart__sr" role="status"><\/span>/);
});

test('GeneratedChart: region named "AI-generated chart: <title>"', () => {
  const html = render(h(GeneratedChart, { title: 'Revenue by month' }));
  const ids = html.match(/aria-labelledby="([^"]+)"/)[1].split(' ');
  assert.equal(ids.length, 2);
  assert.ok(html.includes(`<span id="${ids[0]}" hidden="">AI-generated chart:</span>`));
  assert.match(html, new RegExp(`id="${ids[1]}"[^>]*>Revenue by month<`));
});
