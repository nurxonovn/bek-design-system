import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { CheckboxField } from '../dist/index.js';

const r = (props) => renderToStaticMarkup(h(CheckboxField, props));

test('CheckboxField: control at start by default, size m, named by aria-labelledby', () => {
  const html = r({ label: 'Remember this device', name: 'remember' });
  assert.match(
    html,
    /^<div class="bek-control-field bek-control-field--m bek-checkbox-field bek-checkbox-field--control-start"><label class="bek-checkbox bek-checkbox--m">/,
  );
  const labelId = html.match(/<span class="bek-control-field__label" id="([^"]+)">/)[1];
  assert.match(html, new RegExp(`aria-labelledby="${labelId}"`));
  assert.match(html, /type="checkbox" class="bek-checkbox__input"[^>]*name="remember"/);
  assert.doesNotMatch(html, /bek-checkbox__label/);
});

test('CheckboxField: controlPosition=end puts the Checkbox after the text', () => {
  const html = r({ label: 'Show hidden layers', controlPosition: 'end', size: 's' });
  assert.match(html, /bek-control-field--s bek-checkbox-field bek-checkbox-field--control-end/);
  assert.ok(html.indexOf('bek-control-field__text') < html.indexOf('bek-checkbox__input'));
  assert.match(html, /bek-checkbox bek-checkbox--s/);
});

test('CheckboxField: description → aria-describedby; indeterminate → aria-checked=mixed; disabled', () => {
  const html = r({
    label: 'Email me updates',
    description: 'Product news, once a month',
    indeterminate: true,
    disabled: true,
  });
  const descId = html.match(/<span class="bek-control-field__description" id="([^"]+)">/)[1];
  assert.match(html, new RegExp(`aria-describedby="${descId}"`));
  assert.match(html, /aria-checked="mixed"/);
  assert.match(html, /bek-control-field--disabled/);
});
