import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ControlGroup, ScrubField } from '../dist/index.js';

const r = (props) => renderToStaticMarkup(h(ScrubField, props));

test('ScrubField: native input with role=spinbutton and aria-value* (default size m)', () => {
  const html = r({ label: 'Speed', defaultValue: 1.75, min: 0.25, max: 4, step: 0.05, unit: '×' });
  assert.match(html, /^<div class="bek-scrub-field bek-scrub-field--m">/);
  assert.match(html, /<input [^>]*type="text"[^>]*inputMode="decimal"[^>]*role="spinbutton"/);
  assert.match(html, /aria-valuenow="1.75"/);
  assert.match(html, /aria-valuemin="0.25"/);
  assert.match(html, /aria-valuemax="4"/);
  assert.match(html, /aria-valuetext="1.75 ×"/);
  assert.match(html, /value="1.75"/);
  assert.match(html, /<span class="bek-scrub-field__unit" aria-hidden="true">×<\/span>/);
});

test('ScrubField: label is linked to the input via for/id', () => {
  const html = r({ label: 'Opacity', defaultValue: 64 });
  const id = html.match(/<input [^>]*id="([^"]+)"/)[1];
  assert.match(
    html,
    new RegExp(`<label class="bek-scrub-field__label" for="${id}">Opacity</label>`),
  );
});

test('ScrubField: track width = (value − min) / (max − min), hidden from AT; showTrack=false removes it', () => {
  const html = r({ label: 'Trail', value: 25, min: 0, max: 200 });
  assert.match(html, /class="bek-scrub-field__track" style="inline-size:12.5%" aria-hidden="true"/);
  assert.match(html, /bek-scrub-field__handle/);
  assert.doesNotMatch(r({ label: 'Trail', value: 25, showTrack: false }), /bek-scrub-field__track/);
});

test('ScrubField: value is clamped into the track and formatted by step / precision', () => {
  assert.match(r({ label: 'A', value: 150 }), /inline-size:100%/);
  assert.match(r({ label: 'A', value: 3, step: 0.5 }), /value="3.0"/);
  assert.match(r({ label: 'A', value: 3, precision: 2 }), /value="3.00"/);
  assert.match(r({ label: 'A' }), /value="0"/); // defaultValue → min
});

test('ScrubField: sizes xs · s · m · l, disabled, no unit', () => {
  for (const size of ['xs', 's', 'm', 'l'])
    assert.match(r({ label: 'A', size }), new RegExp(`bek-scrub-field--${size}"`));
  const html = r({ label: 'A', disabled: true, name: 'speed' });
  assert.match(html, /bek-scrub-field--disabled/);
  assert.match(html, /<input [^>]*name="speed"[^>]*disabled=""/);
  assert.doesNotMatch(html, /bek-scrub-field__unit/);
});

test('ScrubField: inside a compact ControlGroup defaults to xs; explicit size wins', () => {
  const html = renderToStaticMarkup(
    h(
      ControlGroup,
      { title: 'Motion', density: 'compact' },
      h(ScrubField, { label: 'Speed' }),
      h(ScrubField, { label: 'Trail', size: 'l' }),
    ),
  );
  assert.match(html, /bek-scrub-field bek-scrub-field--xs/);
  assert.match(html, /bek-scrub-field bek-scrub-field--l/);
});

test('ScrubField: forwards root attributes (className, data-*)', () => {
  const html = r({ label: 'A', className: 'x', 'data-testid': 'scrub' });
  assert.match(html, /class="bek-scrub-field bek-scrub-field--m x" data-testid="scrub"/);
});
