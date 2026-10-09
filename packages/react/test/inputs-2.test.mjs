import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { BaseSelector, RangeSlider, SegmentedControl, Slider, Stepper } from '../dist/index.js';

const r = (C, p) => renderToStaticMarkup(h(C, p));

test('Slider: range input with progress variable', () => {
  const html = r(Slider, { defaultValue: 25, min: 0, max: 200, size: 'l', 'aria-label': 'Volume' });
  assert.match(html, /type="range" min="0" max="200"/);
  assert.match(html, /value="25"/);
  assert.match(html, /class="bek-slider bek-slider--l"/);
  assert.match(html, /--bek-slider-progress:12.5%/);
});

test('RangeSlider: two labelled thumbs and value labels', () => {
  const html = r(RangeSlider, { defaultValue: [20, 80], formatValue: (v) => `${v} so'm` });
  assert.equal(html.match(/type="range"/g).length, 2);
  assert.match(html, /aria-label="Minimum"/);
  assert.match(html, /aria-label="Maximum"/);
  assert.match(html, /20 so&#x27;m/);
  assert.match(html, /--bek-slider-from:20%;--bek-slider-to:80%/);
});

test('Stepper: spinbutton value, minus disabled at min', () => {
  const html = r(Stepper, {
    defaultValue: 0,
    min: 0,
    max: 10,
    unit: 'pcs',
    'aria-label': 'Quantity',
  });
  assert.match(
    html,
    /role="spinbutton" tabindex="0" aria-label="Quantity" aria-valuenow="0" aria-valuemin="0" aria-valuemax="10"/,
  );
  assert.match(html, /tabindex="-1" disabled=""[^>]*>[\s\S]*?Decrease/);
  assert.match(html, /<span class="bek-stepper__unit">pcs<\/span>/);
});

test('SegmentedControl: radiogroup with one checked radio', () => {
  const html = r(SegmentedControl, {
    options: [
      { value: 'd', label: 'Day' },
      { value: 'w', label: 'Week' },
    ],
    defaultValue: 'w',
    'aria-label': 'Period',
  });
  assert.match(
    html,
    /role="radiogroup" aria-label="Period" class="bek-segmented bek-segmented--m bek-segmented--solid"/,
  );
  assert.equal(html.match(/checked=""/g).length, 1);
  assert.match(html, /checked="" value="w"/);
});

test('BaseSelector: arrows disabled at the ends, hidden for a single option', () => {
  const opts = [
    { value: 'a', label: 'Classic' },
    { value: 'b', label: 'Thin' },
  ];
  const html = r(BaseSelector, { options: opts });
  assert.match(html, /aria-label="Previous" disabled=""/);
  assert.doesNotMatch(html, /aria-label="Next" disabled=""/);
  assert.match(html, /Classic/);
  assert.doesNotMatch(r(BaseSelector, { options: [opts[0]] }), /bek-base-selector__arrow/);
});
