import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Chip, DatePicker, SearchBar, TimeSlotPicker } from '../dist/index.js';

const r = (C, p, c) => renderToStaticMarkup(h(C, p, c));

test('SearchBar: role=search, type=search, clear only with a value', () => {
  assert.doesNotMatch(r(SearchBar, { 'aria-label': 'Search' }), /bek-search__clear/);
  const html = r(SearchBar, { defaultValue: 'Pizza', size: 'l', 'aria-label': 'Search' });
  assert.match(html, /role="search" class="bek-search bek-search--l"/);
  assert.match(html, /type="search"/);
  assert.match(html, /aria-label="Clear"/);
});

test('Chip: filter is a pressed toggle, input has a labelled remove button', () => {
  assert.match(
    r(Chip, { selected: true, count: 12 }, 'Vegan'),
    /<button type="button" aria-pressed="true" class="bek-chip bek-chip--s bek-chip--filter bek-focus-ring">/,
  );
  const html = r(Chip, { variant: 'input', size: 'm' }, 'Tashkent');
  assert.match(html, /^<span class="bek-chip bek-chip--m bek-chip--input">/);
  assert.match(html, /aria-label="Remove Tashkent"/);
});

test('DatePicker: Monday-first grid with 6 weeks; min date disables earlier days', () => {
  const html = r(DatePicker, {
    defaultValue: new Date(2026, 9, 12),
    minDate: new Date(2026, 9, 10),
    locale: 'en',
  });
  assert.match(html, /October 2026/);
  assert.equal(html.match(/role="row"/g).length, 7);
  assert.match(html, /role="columnheader"[^>]*>Mon</);
  assert.match(
    html,
    /data-date="2026-10-12" tabindex="0"[^>]*aria-label="Monday, October 12, 2026"/,
  );
  assert.match(html, /data-date="2026-10-9" tabindex="-1" disabled=""/);
  assert.match(html, /is-selected/);
});

test('DatePicker range: band between start and end', () => {
  const html = r(DatePicker, {
    mode: 'range',
    defaultValue: [new Date(2026, 9, 5), new Date(2026, 9, 8)],
    locale: 'en',
  });
  assert.equal(html.match(/is-in-range/g).length, 2);
  assert.match(html, /is-range-start/);
  assert.match(html, /is-range-end/);
});

test('TimeSlotPicker: radio cards, express note, disabled slot', () => {
  const html = r(TimeSlotPicker, {
    title: 'Delivery time',
    days: [
      { value: 't', label: 'Today' },
      { value: 'm', label: 'Tomorrow' },
    ],
    slots: [
      { value: 'x', time: '25–35 min', note: '+5 000', express: true },
      { value: 'a', time: '12:00–12:30', note: 'Free' },
      { value: 'b', time: '12:30–13:00', disabled: true },
    ],
    defaultValue: 'a',
  });
  assert.equal(html.match(/type="radio"/g).length, 5);
  assert.match(html, /bek-time-slot bek-time-slot--express/);
  assert.match(html, /bek-time-slot bek-time-slot--disabled/);
  assert.match(html, /checked="" value="a"/);
});
