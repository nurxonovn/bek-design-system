import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ControlGroup, SwitchField } from '../dist/index.js';

const r = (props) => renderToStaticMarkup(h(SwitchField, props));

test('SwitchField: row with label + Switch (role=switch) named by aria-labelledby; default size m', () => {
  const html = r({ label: 'Pointer highlight', defaultChecked: true, name: 'glow' });
  assert.match(html, /^<div class="bek-control-field bek-control-field--m bek-switch-field">/);
  const labelId = html.match(
    /<span class="bek-control-field__label" id="([^"]+)">Pointer highlight/,
  )[1];
  assert.match(html, /bek-switch bek-switch--m/);
  assert.match(html, /type="checkbox" role="switch" class="bek-switch__input"/);
  assert.match(html, new RegExp(`aria-labelledby="${labelId}"`));
  assert.match(html, /name="glow" checked=""/);
  assert.doesNotMatch(html, /aria-describedby/);
  assert.doesNotMatch(html, /bek-switch__label/); // Switch'ning o'z labeli yashirin
});

test('SwitchField: description is linked via aria-describedby', () => {
  const html = r({ label: 'Reduce motion', description: 'Stops background animations' });
  const descId = html.match(/<span class="bek-control-field__description" id="([^"]+)">/)[1];
  assert.match(html, new RegExp(`aria-describedby="${descId}"`));
});

test('SwitchField: size s → Switch s; disabled; className on the row', () => {
  const html = r({ label: 'Show grid', size: 's', disabled: true, className: 'x' });
  assert.match(html, /bek-control-field--s bek-switch-field bek-control-field--disabled x/);
  assert.match(html, /bek-switch bek-switch--s bek-switch--disabled/);
  assert.match(html, /disabled=""/);
});

test('SwitchField: compact ControlGroup → size s', () => {
  const html = renderToStaticMarkup(
    h(ControlGroup, { density: 'compact', 'aria-label': 'Motion' }, h(SwitchField, { label: 'A' })),
  );
  assert.match(html, /bek-control-field--s bek-switch-field/);
});
