import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ControlGroup, ScrubField, SwitchField } from '../dist/index.js';

test('ControlGroup: fieldset + legend title, default density → M rows', () => {
  const html = renderToStaticMarkup(
    h(
      ControlGroup,
      { title: 'Motion' },
      h(ScrubField, { label: 'Speed', defaultValue: 1.75, step: 0.05, unit: '×' }),
      h(SwitchField, { label: 'Pointer highlight' }),
    ),
  );
  assert.match(
    html,
    /^<fieldset class="bek-control-group bek-control-group--default"><legend class="bek-control-group__title">Motion<\/legend>/,
  );
  assert.match(html, /bek-scrub-field--m/);
  assert.match(html, /bek-control-field--m bek-switch-field/);
});

test('ControlGroup: compact density class; no title → no legend, aria-label/disabled pass through', () => {
  const html = renderToStaticMarkup(
    h(ControlGroup, { density: 'compact', 'aria-label': 'Pointer', disabled: true }, 'row'),
  );
  assert.match(html, /class="bek-control-group bek-control-group--compact"/);
  assert.match(html, /disabled=""/);
  assert.match(html, /aria-label="Pointer"/);
  assert.doesNotMatch(html, /<legend/);
});
