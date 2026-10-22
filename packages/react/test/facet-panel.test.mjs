import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { FacetPanel } from '../dist/index.js';

const facets = [
  {
    id: 'type',
    label: 'Type',
    options: [
      { value: 'symbol-text', label: 'Symbol & Text', count: 661 },
      { value: 'wordmark', label: 'Wordmark', count: 428 },
      { value: 'app icon', label: 'App icon', count: 1, disabled: true },
    ],
  },
  {
    id: 'industry',
    label: 'Industry',
    options: [{ value: 'finance', label: 'Finance', count: 312 }],
  },
];
const r = (props) => renderToStaticMarkup(h(FacetPanel, { facets, ...props }));

test('FacetPanel: web default — section named by h2, Clear all (Flat M), Show results (Action L)', () => {
  const html = r({ summary: '2 filters · 1,089 results' });
  const titleId = html.match(
    /^<section aria-labelledby="([^"]+)" class="bek-facet-panel bek-facet-panel--web">/,
  )[1];
  assert.match(html, new RegExp(`<h2 id="${titleId}" class="bek-facet-panel__title">Filters</h2>`));
  assert.match(html, /bek-button--flat bek-button--m"><span class="bek-button__label">Clear all</);
  assert.match(html, /__summary">2 filters · 1,089 results</);
  assert.match(
    html,
    /bek-button--action bek-button--l bek-facet-panel__submit"><span class="bek-button__label">Show results</,
  );
  assert.doesNotMatch(html, /__handle/);
});

test('FacetPanel: web — vertical tablist, first facet selected, other panels hidden', () => {
  const html = r({ defaultValue: { type: ['symbol-text', 'wordmark'] } });
  assert.match(html, /role="tablist" aria-orientation="vertical"/);
  const tabs = [
    ...html.matchAll(
      /role="tab" id="([^"]+)" aria-selected="(true|false)" aria-controls="([^"]+)" tabindex="(0|-1)"/g,
    ),
  ];
  assert.equal(tabs.length, 2);
  assert.deepEqual(
    tabs.map((m) => [m[2], m[4]]),
    [
      ['true', '0'],
      ['false', '-1'],
    ],
  );
  assert.match(
    html,
    new RegExp(`role="tabpanel" id="${tabs[0][3]}" aria-labelledby="${tabs[0][1]}" class`),
  );
  assert.match(
    html,
    new RegExp(`role="tabpanel" id="${tabs[1][3]}" aria-labelledby="${tabs[1][1]}" hidden=""`),
  );
  // tanlanganlar soni (text/accent) + ekran o'quvchi matni
  assert.match(
    html,
    /__facet-count"><span aria-hidden="true">2<\/span><span class="bek-visually-hidden">2 selected<\/span>/,
  );
  // id'lar bo'shliqsiz (value "app icon")
  assert.doesNotMatch(html, /id="[^"]* [^"]*"/);
});

test('FacetPanel: fieldset + legend groups, Checkbox M with count via aria-describedby', () => {
  const html = r({ value: { type: ['wordmark'] }, activeFacet: 'type' });
  assert.match(
    html,
    /<fieldset class="bek-facet-panel__group"><legend class="bek-facet-panel__group-label">Type<\/legend>/,
  );
  assert.match(html, /<label class="bek-checkbox bek-checkbox--m">/);
  const countId = html.match(
    /aria-describedby="([^"]+)"\/><span class="bek-checkbox__box"[\s\S]*?Symbol &amp; Text/,
  )[1];
  assert.match(html, new RegExp(`<span id="${countId}" class="bek-facet-panel__count">661</span>`));
  assert.match(html, /aria-describedby="[^"]+" checked=""\/>[\s\S]*?Wordmark/);
  assert.match(html, /bek-checkbox--m bek-checkbox--disabled/);
});

test('FacetPanel: mobile — handle, all groups stacked, no tablist/summary, full-width Action XL', () => {
  const html = r({ device: 'mobile', summary: 'hidden', resultsLabel: 'Show 1,089 results' });
  assert.match(
    html,
    /bek-facet-panel bek-facet-panel--mobile"><span class="bek-facet-panel__handle" aria-hidden="true"><\/span>/,
  );
  assert.doesNotMatch(html, /role="tab/);
  assert.equal(html.match(/<fieldset/g).length, 2);
  assert.doesNotMatch(html, /__summary/);
  assert.match(
    html,
    /bek-button--action bek-button--xl bek-facet-panel__submit"><span class="bek-button__label">Show 1,089 results</,
  );
});

test('FacetPanel: custom title, labels and className', () => {
  const html = r({
    title: 'Filtrlar',
    clearAllLabel: 'Tozalash',
    resultsLabel: "Ko'rsatish",
    className: 'x',
    id: 'fp',
  });
  assert.match(
    html,
    /^<section aria-labelledby="[^"]+" id="fp" class="bek-facet-panel bek-facet-panel--web x">/,
  );
  assert.match(html, />Filtrlar<\/h2>/);
  assert.match(html, />Tozalash</);
  assert.match(html, />Ko&#x27;rsatish</);
});
