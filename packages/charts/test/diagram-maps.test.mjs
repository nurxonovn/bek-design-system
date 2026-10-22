import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup as render } from 'react-dom/server';
import {
  emotionPoints,
  emotionTone,
  JourneyMap,
  MindMap,
  Swimlane,
  swimlaneLayout,
  swimlanePorts,
} from '../dist/index.js';

const ROOT = {
  label: 'Q4 goals',
  children: [
    { label: 'Product', children: [{ label: 'Mobile app' }, { label: 'AI tutor' }] },
    { label: 'Growth', children: [{ label: 'Telegram ads' }] },
    { label: 'Operations' },
  ],
};

test('MindMap radial: root terminal, one node per branch, coloured links, nested SR list', () => {
  const html = render(h(MindMap, { root: ROOT, label: 'Q4 goals: 3 shox' }));
  // keng kanvas skroll qiladi — klaviaturadan fokuslanadi
  assert.match(
    html,
    /^<figure tabindex="0" class="bek-diagram bek-mind-map bek-mind-map--radial bek-focus-ring"/,
  );
  assert.match(html, /role="img" aria-label="Q4 goals: 3 shox"/);
  assert.equal(html.match(/bek-diagram-node--terminal/g).length, 1);
  assert.equal(html.match(/bek-diagram-node--process/g).length, 3);
  assert.equal(html.match(/class="bek-mind-map__link"/g).length, 3);
  assert.match(html, /stroke:var\(--bek-chart-series-1, var\(--bek-dataviz-categorical-01\)\)/);
  assert.match(html, /<ul class="bek-chart__sr"><li>Q4 goals<ul><li>Product<ul><li>Mobile app/);
});

test('MindMap tree: leaves rendered with dots, height grows with leaf count', () => {
  const html = render(h(MindMap, { root: ROOT, layout: 'tree', label: 'x', height: 100 }));
  assert.match(html, /bek-mind-map--tree/);
  // tashqaridan berilgan tabIndex ustun
  assert.match(
    render(h(MindMap, { root: ROOT, label: 'x', tabIndex: -1 })),
    /^<figure tabindex="-1"/,
  );
  assert.equal(html.match(/class="bek-mind-map__leaf"/g).length, 3);
  assert.equal(html.match(/class="bek-mind-map__link"/g).length, 6);
  const height = Number(html.match(/height:(\d+)px/)[1]);
  assert.ok(height > 100);
});

const STAGES = [
  {
    name: 'Discover',
    action: 'Sees an ad',
    touchpoints: ['Telegram'],
    emotion: { score: 1, label: 'Positive' },
    opportunity: 'Show price',
  },
  {
    name: 'Sign up',
    action: 'Creates account',
    emotion: { score: 0, label: 'Neutral' },
    pain: 'SMS late',
  },
  {
    name: 'Pay',
    action: 'Pays by card',
    touchpoints: ['App', 'Payme'],
    emotion: { score: -2, label: 'Frustrated' },
  },
];

test('emotionTone / emotionPoints map scores to tone and curve positions', () => {
  assert.equal(emotionTone(2), 'positive');
  assert.equal(emotionTone(0), 'neutral');
  assert.equal(emotionTone(-1), 'negative');
  assert.deepEqual(emotionPoints(STAGES), [
    { x: 16.67, y: 30 },
    { x: 50, y: 50 },
    { x: 83.33, y: 90 },
  ]);
});

test('JourneyMap default: grid with numbered stages, chips, curve, dash for empty cells', () => {
  const html = render(h(JourneyMap, { stages: STAGES, label: "Yo'l" }));
  assert.match(
    html,
    /<figure tabindex="0" class="bek-diagram bek-journey bek-journey--default bek-focus-ring" aria-label="Yo&#x27;l"/,
  );
  assert.match(html, /grid-template-columns:var\(--bek-scale-96\) repeat\(3, minmax\(0, 1fr\)\)/);
  assert.equal(html.match(/class="bek-journey__chip"/g).length, 3);
  assert.match(html, /<polyline class="bek-journey__line" points="16.67,30 50,50 83.33,90"/);
  assert.match(html, /bek-journey__dot--negative[^>]*><\/span>Frustrated/);
  assert.ok(html.match(/bek-journey__empty/g).length >= 3);
});

test('JourneyMap compact: ordered list of stage cards with mood word', () => {
  const html = render(h(JourneyMap, { stages: STAGES, layout: 'compact', label: 'x' }));
  assert.match(html, /bek-journey--compact/);
  assert.match(html, /<ol class="bek-journey__cards">/);
  assert.equal(html.match(/class="bek-journey__stage-card"/g).length, 3);
  assert.match(html, /3 · Pay/);
});

const LANES = ['Client', 'App', 'Backoffice'];
const STEPS = [
  { id: 'a', lane: 'Client', column: 0, shape: 'terminal', label: 'Apply' },
  { id: 'b', lane: 'App', column: 1, label: 'Validate' },
  { id: 'c', lane: 2, column: 1, shape: 'decision', label: 'Approve?' },
  { id: 'd', lane: 'App', column: 2, label: 'Offer' },
];
const EDGES = [
  { from: 'a', to: 'b' },
  { from: 'b', to: 'c' },
  { from: 'c', to: 'd', label: 'Yes' },
];

test('swimlaneLayout: lanes × columns grid, min width respected, decision is taller', () => {
  const g = swimlaneLayout(LANES, STEPS);
  assert.equal(g.width, 900);
  assert.equal(g.height, 8 * 2 + 3 * 96);
  assert.deepEqual(g.dividers, [104, 200]);
  const c = g.steps.find((s) => s.id === 'c');
  assert.equal(c.halfH, 40);
  assert.equal(c.y, 8 + 2.5 * 96);
  const v = swimlaneLayout(LANES, STEPS, 'vertical');
  assert.equal(v.width, 720);
  assert.equal(v.height, 40 + 16 + 3 * 96);
});

test('swimlanePorts: next column uses side edges, same column uses top/bottom edges', () => {
  const g = swimlaneLayout(LANES, STEPS);
  const [a, b, c] = g.steps;
  const ab = swimlanePorts(a, b, 'horizontal');
  assert.equal(ab.from.x, a.x + 80);
  assert.equal(ab.to.x, b.x - 80);
  const bc = swimlanePorts(b, c, 'horizontal');
  assert.equal(bc.from.y, b.y + 28);
  assert.equal(bc.to.y, c.y - 40);
});

test('Swimlane: nodes, connectors with Yes pill, dividers, SR list; unknown ids throw', () => {
  const html = render(h(Swimlane, { lanes: LANES, steps: STEPS, edges: EDGES, label: 'Kredit' }));
  assert.match(
    html,
    /^<figure tabindex="0" class="bek-diagram bek-swimlane bek-swimlane--horizontal bek-focus-ring"/,
  );
  assert.match(html, /bek-swimlane--horizontal/);
  assert.equal(html.match(/class="bek-swimlane__lane-name"/g).length, 3);
  assert.equal(html.match(/class="bek-swimlane__divider"/g).length, 2);
  assert.equal(html.match(/bek-diagram-connector /g).length, 3);
  assert.match(html, /bek-diagram-connector--labeled/);
  assert.match(html, />Yes<\/text>/);
  assert.match(html, /<li>Client: Apply<\/li>/);
  assert.match(html, /<li>Approve\? → Offer \(Yes\)<\/li>/);
  assert.throws(
    () =>
      render(
        h(Swimlane, { lanes: LANES, steps: STEPS, edges: [{ from: 'a', to: 'z' }], label: 'x' }),
      ),
    /noma'lum qadam/,
  );
  assert.throws(
    () => swimlaneLayout(LANES, [{ id: 'x', lane: 'Nope', column: 0, label: 'x' }]),
    /noma'lum yo'lak/,
  );
});

test('review fixes: SR text for journey grid, timeline state word, unique circle keys', async () => {
  const { CirclePacking, TimelineItem } = await import('../dist/index.js');
  const j = render(h(JourneyMap, { stages: STAGES, label: 'x' }));
  assert.match(j, /class="bek-journey__grid"[^>]*aria-hidden="true"/);
  assert.match(
    j,
    /<li>3\. Pay: Pays by card\. Touchpoints: App, Payme\. Emotion: Frustrated<\/li>/,
  );
  assert.match(
    render(h(TimelineItem, { title: 'Check', state: 'done' })),
    /bek-chart__sr"> — Completed/,
  );
  assert.match(
    render(h(TimelineItem, { title: 'Check', state: 'upcoming', stateLabel: 'Kutilmoqda' })),
    /Kutilmoqda/,
  );
  const data = {
    name: 'All',
    children: [
      {
        name: 'A',
        children: [
          { name: 'Other', value: 3 },
          { name: 'X', value: 5 },
        ],
      },
      { name: 'B', children: [{ name: 'Other', value: 4 }] },
    ],
  };
  const errs = [];
  const orig = console.error;
  console.error = (...a) => errs.push(a.join(' '));
  try {
    render(h(CirclePacking, { data, label: 'x' }));
  } finally {
    console.error = orig;
  }
  assert.equal(errs.filter((e) => /same key/.test(e)).length, 0);
});
