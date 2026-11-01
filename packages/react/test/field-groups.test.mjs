import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ChipGroup, RangeField } from '../dist/index.js';
import { nextChipSelection } from '../dist/components/chip-group/ChipGroup.js';

const plans = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'team', label: 'Team', count: 3 },
  { value: 'lifetime', label: 'Lifetime', disabled: true },
];

test('ChipGroup: Fieldset anatomy, chip row of Filter S chips, selected → aria-pressed', () => {
  const html = renderToStaticMarkup(
    h(ChipGroup, { label: 'Plan', options: plans, defaultValue: 'yearly' }),
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

test('ChipGroup: single selection never shows more than one pressed chip', () => {
  const html = renderToStaticMarkup(h(ChipGroup, { label: 'Plan', options: plans, value: 'team' }));
  assert.equal((html.match(/aria-pressed="true"/g) || []).length, 1);
});

test('ChipGroup: group disabled → every chip looks and is disabled', () => {
  const html = renderToStaticMarkup(
    h(ChipGroup, { label: 'Plan', options: plans, disabled: true }),
  );
  assert.equal((html.match(/bek-chip--disabled/g) || []).length, 4);
  assert.match(html, /^<fieldset[^>]*disabled=""/);
});

test('nextChipSelection: single replaces, re-click keeps; multiple adds and removes', () => {
  const one = ['a'];
  assert.deepEqual(nextChipSelection([], 'a', 'single'), ['a']);
  assert.deepEqual(nextChipSelection(one, 'b', 'single'), ['b']);
  assert.equal(nextChipSelection(one, 'a', 'single'), one);
  assert.deepEqual(nextChipSelection(['a'], 'b', 'multiple'), ['a', 'b']);
  assert.deepEqual(nextChipSelection(['a', 'b'], 'a', 'multiple'), ['b']);
});

test('RangeField: shared message is linked to both inputs; caller describedby merged', () => {
  const html = renderToStaticMarkup(
    h(RangeField, {
      label: 'Price',
      status: 'error',
      message: 'From must be lower',
      from: { 'aria-describedby': 'extra', label: undefined },
    }),
  );
  const msgId = html.match(/class="bek-fieldset__message" id="([^"]+)"/)[1];
  const inputs = html.match(/<input[^>]*>/g);
  assert.equal(inputs.length, 2);
  for (const i of inputs) assert.match(i, new RegExp(`aria-describedby="[^"]*${msgId}`));
  assert.match(inputs[0], /aria-describedby="[^"]*extra/);
  assert.match(html, />From</);
});

test('RangeField: group disabled → both fields disabled; supportingText from JS ignored', () => {
  const html = renderToStaticMarkup(
    h(RangeField, { label: 'Age', disabled: true, from: { supportingText: 'second message' } }),
  );
  assert.equal((html.match(/bek-field--disabled/g) || []).length, 2);
  assert.doesNotMatch(html, /second message/);
});
