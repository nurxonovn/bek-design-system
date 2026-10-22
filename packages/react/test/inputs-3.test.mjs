import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Chip, DatePicker, SearchBar, SearchField, TimeSlotPicker } from '../dist/index.js';

const r = (C, p, c) => renderToStaticMarkup(h(C, p, c));

test('SearchField: role=search, type=search, filled/m by default, clear only with a value', () => {
  const empty = r(SearchField, { 'aria-label': 'Search' });
  assert.match(
    empty,
    /role="search" class="bek-search-field bek-search-field--filled bek-search-field--m"/,
  );
  assert.match(empty, /type="search"/);
  assert.match(empty, /placeholder="Search"/);
  assert.doesNotMatch(empty, /bek-search-field__clear|bek-search-field__cancel|<kbd/);
  const html = r(SearchField, { defaultValue: 'Pizza', 'aria-label': 'Search' });
  assert.match(html, /value="Pizza"/);
  assert.match(html, /aria-label="Clear"/);
});

test('SearchField: variants and sizes map to Figma classes; on-media uses Glass/Small', () => {
  assert.match(
    r(SearchField, { variant: 'elevated', size: 'l' }),
    /bek-search-field--elevated bek-search-field--l"/,
  );
  const media = r(SearchField, { variant: 'on-media', size: 's' });
  assert.match(media, /bek-search-field--on-media bek-search-field--s"/);
  assert.match(media, /class="bek-search-field__field bek-glass-small"/);
  assert.doesNotMatch(r(SearchField, {}), /bek-glass-small/);
});

test('SearchField: scope, voice, shortcut and filter slots', () => {
  const html = r(SearchField, {
    scope: 'All',
    shortcut: '⌘K',
    onVoice: () => {},
    onFilter: () => {},
    voiceLabel: 'Ovozli qidiruv',
  });
  const scopeId = html.match(/<span id="([^"]+)" class="bek-search-field__scope">All<\/span>/)?.[1];
  assert.ok(scopeId);
  assert.match(html, new RegExp(`aria-describedby="${scopeId}"`));
  assert.match(html, /aria-keyshortcuts="Meta\+K"/);
  assert.match(html, /<kbd class="bek-search-field__shortcut" aria-hidden="true">⌘K<\/kbd>/);
  assert.match(html, /aria-label="Ovozli qidiruv"/);
  assert.match(html, /aria-label="Filters"/);
  assert.match(r(SearchField, { shortcut: 'Ctrl+K' }), /aria-keyshortcuts="Control\+K"/);
});

test('SearchField: loading replaces clear with a spinner; disabled hides clear', () => {
  const loading = r(SearchField, { defaultValue: 'Pizza', loading: true, size: 'l' });
  assert.match(loading, /aria-busy="true"/);
  assert.match(
    loading,
    /role="status" aria-label="Loading" class="bek-spinner bek-spinner--24 bek-search-field__spinner"/,
  );
  assert.doesNotMatch(loading, /bek-search-field__clear/);
  const disabled = r(SearchField, { defaultValue: 'Pizza', disabled: true, onVoice: () => {} });
  assert.match(disabled, /bek-search-field--disabled/);
  assert.match(disabled, /<input[^>]*disabled=""/);
  assert.doesNotMatch(disabled, /bek-search-field__clear/);
});

test('SearchField: dir goes to the search wrapper', () => {
  assert.match(r(SearchField, { dir: 'rtl' }), /^<div role="search" dir="rtl"/);
});

test('SearchBar (deprecated alias): legacy m/l sizes map to SearchField s/m', () => {
  assert.match(
    r(SearchBar, { 'aria-label': 'Search' }),
    /bek-search-field--filled bek-search-field--s"/,
  );
  const html = r(SearchBar, { defaultValue: 'Pizza', size: 'l', 'aria-label': 'Search' });
  assert.match(
    html,
    /role="search" class="bek-search-field bek-search-field--filled bek-search-field--m"/,
  );
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
  assert.match(
    html,
    /<p class="bek-date-picker__summary" aria-live="polite">October 5\s*[–-]\s*8 · 4 days<\/p>/,
  );
  assert.doesNotMatch(
    r(DatePicker, {
      mode: 'range',
      defaultValue: [new Date(2026, 9, 5), new Date(2026, 9, 8)],
      formatRange: null,
    }),
    /bek-date-picker__summary/,
  );
  assert.doesNotMatch(
    r(DatePicker, { mode: 'range', defaultValue: [new Date(2026, 9, 5), null], locale: 'en' }),
    /bek-date-picker__summary/,
  );
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
