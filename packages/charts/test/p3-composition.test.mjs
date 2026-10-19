import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup as render } from 'react-dom/server';
import {
  ChordDiagram,
  CirclePacking,
  ConfusionMatrix,
  MarimekkoChart,
  confusionStats,
} from '../dist/index.js';

const count = (html, re) => (html.match(re) || []).length;

const mekko = [
  { column: 'Samarqand', category: 'Cards', value: 30 },
  { column: 'Samarqand', category: 'Loans', value: 20 },
  { column: 'Toshkent', category: 'Cards', value: 90 },
  { column: 'Toshkent', category: 'Loans', value: 60 },
  { column: 'Buxoro', category: 'Cards', value: 4 },
  { column: 'Buxoro', category: 'Loans', value: 1 },
];

test('MarimekkoChart default: one cell per pair, columns sorted by width, square legend, no chips', () => {
  const html = render(h(MarimekkoChart, { data: mekko, label: 'Mix' }));
  assert.match(html, /<figure class="bek-chart bek-marimekko-chart bek-marimekko-chart--default">/);
  assert.match(html, /role="img" aria-label="Mix"/);
  assert.equal(count(html, /class="bek-chart__mark bek-marimekko-chart__cell"/g), 6);
  assert.equal(count(html, /bek-legend-item--square/g), 2);
  assert.doesNotMatch(html, /bek-marimekko-chart__chip/);
  // 0 / 50 / 100% ticks
  assert.match(html, />0%</);
  assert.match(html, />50%</);
  assert.match(html, />100%</);
  // Largest column first (left)
  const order = [...html.matchAll(/bek-marimekko-chart__column"[^>]*>([^<]+)/g)].map((m) => m[1]);
  assert.deepEqual(order, ['Toshkent', 'Samarqand', 'Buxoro']);
  assert.match(html, /<title>Toshkent · Cards: 90 \(60% of column, 44% of total\)<\/title>/);
  assert.match(html, /<th scope="row">Toshkent<\/th><td>Cards<\/td><td>90<\/td><td>60%<\/td>/);
});

test('MarimekkoChart labeled: surface chips only on big cells, column share line', () => {
  const html = render(h(MarimekkoChart, { data: mekko, variant: 'labeled', label: 'L' }));
  assert.match(html, /bek-marimekko-chart--labeled/);
  // Buxoro column (5/205 of 478 px) is narrower than 40 px — no chips there.
  assert.equal(count(html, /class="bek-marimekko-chart__chip"/g), 4);
  assert.match(html, /bek-marimekko-chart__labels" aria-hidden="true"/);
  assert.match(html, /class="bek-marimekko-chart__share"[^>]*>73%</);
});

const pack = {
  name: 'Usage',
  children: [
    {
      name: 'Payments',
      children: [
        { name: 'P2P', value: 42 },
        { name: 'QR', value: 26 },
        { name: 'X', value: 1 },
      ],
    },
    { name: 'Savings', children: [{ name: 'Deposits', value: 24 }] },
  ],
};

test('CirclePacking flat: leaves coloured by group, legend, chips only when they fit', () => {
  const html = render(h(CirclePacking, { data: pack, label: 'P' }));
  assert.match(html, /<figure class="bek-chart bek-circle-packing bek-circle-packing--flat">/);
  assert.equal(count(html, /class="bek-chart__mark bek-circle-packing__item"/g), 4);
  assert.match(html, /bek-chart-legend/);
  assert.match(html, /class="bek-circle-packing__chip"[^>]*>P2P</);
  // Tiny X circle gets no label but keeps its tooltip.
  assert.doesNotMatch(html, /__chip"[^>]*>X</);
  assert.match(html, /<title>Payments · X: 1 \(1%\)<\/title>/);
  assert.match(html, /role="img" aria-label="P"/);
  assert.match(html, /<th scope="row">Payments<\/th><td>P2P<\/td><td>42<\/td><td>61%<\/td>/);
});

test('CirclePacking nested: parent circles, child text on sequential/300, parent chips, centred square', () => {
  const html = render(
    h(CirclePacking, { data: pack, variant: 'nested', width: 480, height: 200, label: 'N' }),
  );
  assert.match(html, /bek-circle-packing--nested/);
  assert.equal(count(html, /bek-circle-packing__circle--parent/g), 2);
  assert.equal(count(html, /bek-circle-packing__circle--child/g), 4);
  assert.equal(count(html, /bek-circle-packing__chip--parent/g), 2);
  assert.match(html, /class="bek-circle-packing__text"[^>]*>P2P</);
  assert.doesNotMatch(html, /bek-chart-legend/);
  // All circles stay inside the centred 184 × 184 square (x 148…332).
  for (const m of html.matchAll(/cx="([\d.]+)" cy="[\d.]+" r="([\d.]+)"/g))
    assert.ok(Number(m[1]) - Number(m[2]) >= 147.9 && Number(m[1]) + Number(m[2]) <= 332.1);
});

const labels = ['A', 'B', 'C'];
const matrix = [
  [0, 10, 5],
  [3, 0, 2],
  [1, 4, 0],
];

test('ChordDiagram default: arc per group, ribbon per pair, top flows in caption', () => {
  const html = render(h(ChordDiagram, { labels, matrix, label: 'Flows' }));
  assert.match(html, /<figure class="bek-chart bek-chord-diagram bek-chord-diagram--default">/);
  assert.equal(count(html, /class="bek-chord-diagram__arc"/g), 3);
  assert.equal(count(html, /bek-chord-diagram__ribbon bek-chord-diagram__ribbon--/g), 3);
  assert.match(html, /transform="translate\(240,100\)"/);
  assert.match(html, /<title>A → B: 10 · B → A: 3<\/title>/);
  assert.match(html, /<title>A: out 15 · in 4<\/title>/);
  assert.match(html, /<caption>Flows\. Top flows: A → B 10, A → C 5, C → B 4\.<\/caption>/);
  assert.doesNotMatch(html, /dataviz-neutral/);
  assert.doesNotMatch(html, /fill-opacity|rgba/);
});

test('ChordDiagram focus: one group coloured, others neutral, announced in text', () => {
  const html = render(
    h(ChordDiagram, { labels, matrix, variant: 'focus', focus: 'B', label: 'F' }),
  );
  assert.match(html, /bek-chord-diagram--focus/);
  assert.equal(count(html, /bek-chord-diagram__group--focus/g), 1);
  // Ribbon A–C does not touch B → muted.
  assert.equal(count(html, /bek-chord-diagram__ribbon--muted/g), 1);
  assert.equal(count(html, /fill:var\(--bek-dataviz-neutral\)/g), 3);
  assert.match(html, /Focus: B\.<\/caption>/);
});

const cm = [
  [412, 18, 9, 11],
  [22, 286, 6, 14],
  [7, 9, 198, 16],
  [21, 17, 12, 182],
];
const cls = ['Payments', 'Cards', 'Loans', 'Other'];

test('ConfusionMatrix counts: real table, CMP-07 levels, summary', () => {
  const html = render(h(ConfusionMatrix, { labels: cls, matrix: cm, label: 'Router' }));
  assert.match(
    html,
    /<figure [^>]*class="bek-chart bek-confusion-matrix bek-confusion-matrix--counts"/,
  );
  assert.match(html, /<caption class="bek-chart__sr">Router<\/caption>/);
  assert.equal(count(html, /<th scope="col"/g), 5);
  assert.equal(count(html, /<th scope="row"/g), 4);
  assert.equal(count(html, /<td /g), 16);
  assert.equal(count(html, /bek-confusion-matrix__cell--diagonal/g), 4);
  assert.match(
    html,
    /bek-confusion-matrix__cell--700 bek-confusion-matrix__cell--diagonal"[^>]*>412</,
  );
  assert.match(html, /bek-confusion-matrix__cell--300"[^>]*>21</);
  assert.match(html, /bek-confusion-matrix__cell--200"[^>]*>18</);
  assert.doesNotMatch(html, /cell--(100|400|500)/);
  assert.match(
    html,
    /<figcaption class="bek-confusion-matrix__summary">Accuracy 86,9% · 1\s240 samples · columns = predicted<\/figcaption>/,
  );
  assert.match(
    html,
    /title="Payments → Cards: 18 \(4,0% of row\) · precision Cards 86,7% · recall Payments 91,6%"/,
  );
  assert.doesNotMatch(html, /role="img"/);
});

test('ConfusionMatrix normalized via variant or normalize, summary can be hidden', () => {
  const a = render(
    h(ConfusionMatrix, { labels: cls, matrix: cm, variant: 'normalized', label: 'N' }),
  );
  const b = render(
    h(ConfusionMatrix, { labels: cls, matrix: cm, normalize: true, summary: false, label: 'N' }),
  );
  for (const html of [a, b]) {
    assert.match(html, /bek-confusion-matrix--normalized/);
    assert.match(html, />91,6%</);
    assert.match(html, />78,4%</);
  }
  assert.doesNotMatch(b, /<figcaption/);
});

test('confusionStats: accuracy, precision, recall', () => {
  const s = confusionStats(cm);
  assert.equal(s.total, 1240);
  assert.equal(s.correct, 1078);
  assert.ok(Math.abs(s.accuracy - 0.8694) < 1e-3);
  assert.ok(Math.abs(s.recall[0] - 412 / 450) < 1e-9);
  assert.ok(Math.abs(s.precision[1] - 286 / 330) < 1e-9);
  assert.deepEqual(confusionStats([]), {
    total: 0,
    correct: 0,
    accuracy: 0,
    precision: [],
    recall: [],
  });
});
