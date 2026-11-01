import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ChipGroup, RangeField } from '../dist/index.js';

const plans = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'team', label: 'Team', count: 3 },
  { value: 'lifetime', label: 'Lifetime', disabled: true },
];

test('ChipGroup: Fieldset anatomy, chip row of Filter S chips, selected → aria-pressed', () => {
  const html = renderToStaticMarkup(
    h(ChipGroup, { label: 'Plan', options: plans, defaultValue: ['yearly'] }),
  );
  assert.match(html, /^<fieldset class="bek-fieldset bek-fieldset--vertical bek-chip-group"/);
  assert.match(html, /<legend class="bek-visually-hidden">Plan<\/legend>/);
  assert.match(html, /<div class="bek-chip-group__chips">/);
  assert.equal((html.match(/bek-chip--s bek-chip--filter/g) || []).length, 4);
  assert.equal((html.match(/aria-pressed="true"/g) || []).length, 1);
  assert.match(html, /aria-pressed="true"[^>]*>(?:<[^>]+>)*Yearly/);
  assert.match(html, /bek-chip__count">3</);
  assert.match(html, /disabled=""/);
  assert.doesNotMatch(html, /bek-fieldset__message/);
});

test('ChipGroup: multiple selection, error message, optional, hint, chipSize m, rtl', () => {
  const html = renderToStaticMarkup(
    h(ChipGroup, {
      label: 'Category',
      options: plans,
      selection: 'multiple',
      value: ['monthly', 'team'],
      status: 'error',
      message: 'Choose a plan to continue',
      optional: true,
      hint: 'Pick any',
      chipSize: 'm',
      dir: 'rtl',
    }),
  );
  assert.equal((html.match(/aria-pressed="true"/g) || []).length, 2);
  assert.match(html, /bek-fieldset--error/);
  assert.match(html, /aria-invalid="true"/);
  assert.match(html, /bek-fieldset__optional">Optional</);
  assert.match(html, /bek-fieldset__hint" title="Pick any"/);
  assert.match(html, /bek-chip--m/);
  assert.match(html, /dir="rtl"/);
  assert.match(html, /Choose a plan to continue/);
});

test('RangeField: two Text field L Filled under one label, default From/To labels', () => {
  const html = renderToStaticMarkup(
    h(RangeField, {
      label: 'Price, soʻm',
      message: 'Leave “To” empty for no upper limit',
      from: { name: 'from', inputMode: 'numeric' },
      to: { name: 'to', label: 'Up to' },
    }),
  );
  assert.match(
    html,
    /^<fieldset class="bek-fieldset bek-fieldset--vertical bek-fieldset--helper bek-range-field"/,
  );
  assert.match(html, /<div class="bek-range-field__row">/);
  assert.equal((html.match(/bek-field--l[ "]/g) || []).length, 2);
  assert.equal((html.match(/bek-field--filled/g) || []).length, 2);
  assert.match(html, />From</);
  assert.match(html, />Up to</);
  assert.match(html, /name="from"/);
  assert.match(html, /inputMode="numeric"|inputmode="numeric"/);
  assert.doesNotMatch(html, /aria-invalid/);
});

test('RangeField: error turns both fields to Error, one shared message', () => {
  const html = renderToStaticMarkup(
    h(RangeField, {
      label: 'Price, soʻm',
      status: 'error',
      message: '“From” must be lower than “To”',
      from: { defaultValue: '5 000 000' },
      to: { defaultValue: '1 000 000' },
    }),
  );
  assert.match(html, /bek-fieldset--error/);
  // fieldset + ikkala input
  assert.equal((html.match(/aria-invalid="true"/g) || []).length, 3);
  assert.equal((html.match(/must be lower/g) || []).length, 1);
});

test('RangeField: error status without message does not mark fields invalid', () => {
  const html = renderToStaticMarkup(h(RangeField, { label: 'Age', status: 'error' }));
  assert.doesNotMatch(html, /aria-invalid/);
});
