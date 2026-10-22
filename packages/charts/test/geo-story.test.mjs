import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup as render } from 'react-dom/server';
import {
  DrawTheLine,
  Pictogram,
  RaceChart,
  RegionMap,
  SurveyChart,
  UZ_REGIONS,
  pictogramFraction,
  surveyStats,
} from '../dist/index.js';

/* ---------- RegionMap ---------- */

const VALUES = {
  'UZ-TK': 82,
  'UZ-TO': 71,
  'UZ-AN': 66,
  'UZ-FA': 64,
  'UZ-NG': 60,
  'UZ-SA': 55,
  'UZ-BU': 52,
  'UZ-NW': 58,
  'UZ-SI': 48,
  'UZ-JI': 45,
  'UZ-XO': 47,
  'UZ-QA': 40,
  'UZ-SU': 38,
  'UZ-QR': 33,
};
const DATA = Object.entries(VALUES).map(([region, value]) => ({ region, value }));
const fmt = (v) => `${v}%`;

test('UZ_REGIONS lists 14 regions with ISO 3166-2:UZ ids and Figma hex codes', () => {
  assert.equal(UZ_REGIONS.length, 14);
  assert.ok(UZ_REGIONS.every((r) => /^UZ-[A-Z]{2}$/.test(r.id)));
  assert.equal(new Set(UZ_REGIONS.map((r) => r.id)).size, 14);
  const tk = UZ_REGIONS.find((r) => r.id === 'UZ-TK');
  assert.deepEqual(
    { name: tk.name, slug: tk.slug, code: tk.code },
    { name: 'Toshkent sh.', slug: 'tashkent-city', code: 'TS' },
  );
});

test('RegionMap choropleth: 14 focusable regions in ranked order, sequential classes, chips, table', () => {
  const html = render(
    h(RegionMap, { data: DATA, formatValue: fmt, metric: 'Users', label: 'Highest: Toshkent sh.' }),
  );
  assert.match(html, /class="bek-chart bek-region-map bek-region-map--choropleth"/);
  assert.match(html, /role="group" aria-label="Highest: Toshkent sh\."/);
  const labels = [...html.matchAll(/role="button" tabindex="0" aria-label="([^"]+)"/g)].map(
    (m) => m[1],
  );
  assert.equal(labels.length, 14);
  // Tab tartibi — reyting bo'yicha
  assert.equal(labels[0], 'Toshkent sh.: 82%, rank 1 of 14');
  assert.equal(labels[13], 'Qoraqalpog‘iston: 33%, rank 14 of 14');
  assert.match(html, /aria-pressed="false"/);
  // Eng yuqori — sequential 700, eng past — 200; Orol dengizi — water
  assert.match(html, /bek-region-map__region bek-region-map__l700" d="M237\.1/);
  assert.match(html, /bek-region-map__region bek-region-map__l200" d="M60\.1/);
  assert.match(html, /class="bek-region-map__water"/);
  // Standart chip'lar: max va min
  assert.match(html, /bek-region-map__chip[^>]*>Toshkent sh\. · 82%</);
  assert.match(html, /bek-region-map__chip[^>]*>Qoraqalpog‘iston · 33%</);
  // Shkala: 6 qadam, Low/High
  assert.equal(html.match(/class="bek-region-map__step bek-region-map__l/g).length, 6);
  assert.match(html, /<th scope="col">Users<\/th>/);
  assert.match(html, /<th scope="row">Toshkent sh\.<\/th><td>1<\/td><td>82%<\/td>/);
});

test('RegionMap accepts svg-maps slugs, marks missing data with hatch, and dims on selection', () => {
  const html = render(
    h(RegionMap, {
      data: [
        { region: 'tashkent-city', value: 10 },
        { region: 'karakalpakstan', value: null },
      ],
      selected: 'UZ-TK',
      label: 'x',
    }),
  );
  assert.match(html, /bek-region-map--has-selection/);
  assert.match(html, /bek-region-map__region--selected" d="M237\.1/);
  assert.match(html, /aria-label="Qoraqalpog‘iston: No data"/);
  assert.match(html, /fill:url\(#bek-region-map-hatch-/);
  assert.match(html, /<pattern id="bek-region-map-hatch-/);
});

test('RegionMap bubble: neutral land, sqrt-sized circles, legend with metric, top-2 chips', () => {
  const html = render(
    h(RegionMap, { variant: 'bubble', data: DATA, metric: 'population, mln', label: 'x' }),
  );
  assert.match(html, /bek-region-map--bubble/);
  assert.equal(html.match(/class="bek-region-map__bubble"/g).length, 14);
  // Yer neytral — daraja klassi yo'q (dataviz/track)
  assert.doesNotMatch(html, /bek-region-map__region bek-region-map__l/);
  // Eng katta doira — r 16 (Figma 32 px)
  assert.match(html, /r="16"/);
  assert.match(html, /Circle area = population, mln/);
  assert.equal(html.match(/class="bek-region-map__chip"/g).length, 2);
});

test('RegionMap hex: equal tiles with Figma codes, 4 text-safe levels, no chips', () => {
  const html = render(h(RegionMap, { variant: 'hex', data: DATA, label: 'x' }));
  assert.equal(html.match(/class="bek-region-map__tile"/g).length, 14);
  assert.match(html, />TS<\/text>/);
  assert.match(html, />QR<\/text>/);
  assert.equal(html.match(/class="bek-region-map__step bek-region-map__l/g).length, 4);
  assert.doesNotMatch(html, /__l400|__l500/);
  assert.match(html, /class="bek-region-map__region bek-region-map__l700" role="button"/);
  assert.doesNotMatch(html, /bek-region-map__chip/);
});

test('RegionMap loading: track outline, aria-busy, no interactive regions', () => {
  const html = render(h(RegionMap, { data: DATA, loading: true, label: 'x' }));
  assert.match(html, /aria-busy="true"/);
  assert.doesNotMatch(html, /role="button"/);
});

/* ---------- RaceChart ---------- */

const FRAMES = [
  {
    period: 2019,
    values: [
      { name: 'UX/UI', value: 12 },
      { name: 'Frontend', value: 15 },
      { name: 'Data', value: 6 },
    ],
  },
  {
    period: 2024,
    values: [
      { name: 'UX/UI', value: 48 },
      { name: 'Frontend', value: 42 },
      { name: 'Data', value: 37 },
    ],
  },
];

test('RaceChart bar: rows ranked by value, stable colours, period, paused Play and slider', () => {
  const html = render(h(RaceChart, { frames: FRAMES, formatValue: (v) => `${v}k`, label: 'Race' }));
  assert.match(html, /class="bek-chart bek-race-chart bek-race-chart--bar"/);
  // Birinchi kadr: Frontend 1-o'rinda
  assert.match(html, /translateY\(4px\)[^>]*><text class="bek-race-chart__name"[^>]*>Frontend/);
  // Rang — birinchi uchragan tartib: UX/UI 01, Frontend 02
  assert.match(html, /width:\d+(\.\d+)?px;fill:var\(--bek-chart-series-2/);
  assert.match(html, /class="bek-race-chart__period"[^>]*>2019</);
  assert.match(html, /aria-pressed="false"/);
  assert.match(html, /<span class="bek-visually-hidden">Play<\/span>/);
  assert.match(
    html,
    /role="slider" tabindex="0" aria-label="Period" aria-valuemin="0" aria-valuemax="1" aria-valuenow="0" aria-valuetext="2019"/,
  );
  assert.match(html, /role="status">2019: Frontend 15k</);
  assert.match(html, /<th scope="row">2024<\/th><td>48k<\/td><td>42k<\/td><td>37k<\/td>/);
});

test('RaceChart line: lines grow to the current frame, end labels, now line; top limits entities', () => {
  const html = render(
    h(RaceChart, { frames: FRAMES, variant: 'line', defaultFrame: 1, top: 2, label: 'x' }),
  );
  assert.match(html, /bek-race-chart--line/);
  assert.equal(html.match(/class="bek-race-chart__line"/g).length, 2);
  assert.match(html, /class="bek-race-chart__now"/);
  assert.match(html, /bek-race-chart__end-label[^>]*>UX\/UI 48</);
  assert.doesNotMatch(html, /end-label[^>]*>Data/);
  assert.match(html, /aria-valuenow="1"/);
});

/* ---------- DrawTheLine ---------- */

const SERIES = [12, 15, 19, 24, 31, 38, 47, 52].map((y, i) => ({ x: 2019 + i, y }));

test('DrawTheLine draw: known line, guess zone, hint chip, keyboard slider, Skip/Reveal', () => {
  const html = render(
    h(DrawTheLine, { data: SERIES, revealFrom: 2022, formatValue: (v) => `${v}k`, label: 'Guess' }),
  );
  assert.match(html, /bek-draw-the-line--draw/);
  assert.match(html, /class="bek-draw-the-line__zone"/);
  assert.match(html, /class="bek-draw-the-line__known"/);
  assert.doesNotMatch(html, /bek-draw-the-line__actual/);
  assert.match(html, /role="slider" tabindex="0" aria-label="Your guess"/);
  assert.match(html, /bek-draw-the-line__chip[^>]*>Draw your guess →</);
  assert.match(html, />Skip<\/span>/);
  // Reveal — taxmin tugamaguncha o'chiq
  assert.match(html, /<button[^>]*disabled=""[^>]*>[^]*?Reveal/);
  // Ochilishdan oldin jadvalda faqat ma'lum qism (2019–2022)
  assert.equal(html.match(/<th scope="row">/g).length, 4);
});

test('DrawTheLine reveal: actual line, gap chip, table with guess column', () => {
  const html = render(
    h(DrawTheLine, {
      data: SERIES,
      revealFrom: 2022,
      variant: 'reveal',
      defaultGuess: [28, 32, 36, 40],
      formatValue: (v) => `${v}k`,
      label: 'Guess',
    }),
  );
  assert.match(html, /bek-draw-the-line--reveal/);
  assert.match(html, /class="bek-draw-the-line__actual"[^>]*pathLength="1"/);
  assert.match(html, /class="bek-draw-the-line__guess"/);
  assert.match(html, /Actual 52k · you: 40k/);
  assert.doesNotMatch(html, /role="slider"/);
  assert.match(html, /<th scope="row">2026<\/th><td>52k<\/td><td>40k<\/td>/);
});

/* ---------- SurveyChart ---------- */

const QUESTIONS = [
  { label: 'Lessons are clear', counts: [4, 8, 14, 44, 30] },
  { label: 'Price for value', counts: [12, 18, 40, 20, 10] },
];

test('surveyStats: shares, agree/disagree and net (neutral excluded)', () => {
  const s = surveyStats([4, 8, 14, 44, 30]);
  assert.equal(s.total, 100);
  assert.equal(s.disagree, 12);
  assert.equal(s.agree, 74);
  assert.equal(Math.round(s.neutral), 14);
  assert.equal(s.net, 62);
  assert.equal(surveyStats([12, 18, 40, 20, 10]).net, 0);
});

test('SurveyChart likert: diverging segments on 5 diverging tokens, net outside, legend, table', () => {
  const html = render(h(SurveyChart, { questions: QUESTIONS, label: 'Survey' }));
  assert.match(html, /class="bek-chart bek-survey-chart bek-survey-chart--likert"/);
  assert.equal(html.match(/bek-survey-chart__segment"/g).length, 10);
  for (const t of ['neg-3', 'neg-1', '0', 'pos-1', 'pos-3'])
    assert.match(html, new RegExp(`fill:var\\(--bek-dataviz-diverging-${t}\\)`));
  assert.match(html, />Net \+62</);
  assert.match(html, />Net 0</);
  assert.match(html, /class="bek-survey-chart__zero"/);
  assert.match(html, /← Disagree/);
  assert.match(html, /aria-label="Answers"/);
  assert.match(html, /aria-pressed="true"/);
  assert.match(html, /<th scope="row">Lessons are clear<\/th><td>4 \(4%\)<\/td>/);
  assert.doesNotMatch(html, /bek-survey-chart__note/);
});

test('SurveyChart net + sort + low sample: net bars by sign, sorted, note shown', () => {
  const html = render(
    h(SurveyChart, {
      variant: 'net',
      sort: 'net',
      questions: [
        { label: 'Low', counts: [5, 3, 1, 1, 0] },
        { label: 'High', counts: [0, 1, 1, 3, 5] },
      ],
      label: 'x',
    }),
  );
  assert.match(html, /bek-survey-chart--net/);
  assert.equal(html.match(/class="bek-chart__mark bek-survey-chart__net"/g).length, 2);
  assert.match(html, /fill:var\(--bek-dataviz-diverging-neg-3\)/);
  assert.ok(html.indexOf('>High<') < html.indexOf('>Low<'));
  assert.match(html, />\+70</);
  assert.match(html, />−70</);
  assert.match(html, /Net agree \(agree − disagree\)/);
  assert.match(html, /class="bek-survey-chart__note">Low sample \(n &lt; 30\)</);
});

/* ---------- Pictogram ---------- */

test('pictogramFraction: small whole numbers, percent fallback', () => {
  assert.equal(pictogramFraction(0.3), '3 in 10');
  assert.equal(pictogramFraction(0.25), '1 in 4');
  assert.equal(pictogramFraction(0.5), '1 in 2');
  assert.equal(pictogramFraction(0.37), '37 in 100');
  assert.equal(pictogramFraction(0.123), '12%');
});

test('Pictogram default: 20 person icons, 6 on, headline, unit legend, role=img text', () => {
  const html = render(
    h(Pictogram, { value: 0.3, total: 20, unit: 'students', caption: 'finish the first course' }),
  );
  assert.match(html, /class="bek-chart bek-pictogram bek-pictogram--default"/);
  assert.match(html, /role="img" aria-label="3 in 10 students"/);
  assert.equal(html.match(/class="bek-pictogram__icon[ "]/g).length, 20);
  assert.equal(html.match(/bek-pictogram__icon--on/g).length, 6);
  assert.match(html, /bek-pictogram__number">3 in 10</);
  assert.match(html, /1 icon = 5% of students/);
  assert.match(html, /<svg viewBox="0 0 16 24" aria-hidden="true"/);
});

test('Pictogram compare: rows, partial last icon, values, table', () => {
  const html = render(
    h(Pictogram, {
      unit: 'students',
      rows: [
        { label: '2020', value: 0.2 },
        { label: '2026', value: 0.55, n: 120 },
      ],
      animate: true,
    }),
  );
  assert.match(html, /bek-pictogram--compare bek-pictogram--animate/);
  assert.equal(html.match(/class="bek-pictogram__row"/g).length, 2);
  assert.equal(html.match(/bek-pictogram__icon--partial/g).length, 1);
  assert.match(html, /--bek-pictogram-fill:50%/);
  assert.match(html, /title="2026: 55% · n = 120"/);
  assert.match(html, /1 icon = 10% of students/);
  assert.match(html, /<th scope="row">2026<\/th><td>55%<\/td>/);
});
