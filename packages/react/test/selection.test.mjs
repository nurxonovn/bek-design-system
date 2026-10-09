import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Checkbox, Radio, Switch } from '../dist/index.js';

const r = (C, props, label) => renderToStaticMarkup(h(C, props, label));

test('Checkbox: native input inside a label, size class, mixed when indeterminate', () => {
  const html = r(Checkbox, { name: 'a', defaultChecked: true }, 'Remember me');
  assert.match(html, /^<label class="bek-checkbox bek-checkbox--s">/);
  assert.match(html, /<input type="checkbox" class="bek-checkbox__input" name="a" checked=""/);
  assert.match(html, /<span class="bek-checkbox__label">Remember me<\/span>/);
  assert.match(r(Checkbox, { indeterminate: true, size: 'l' }), /aria-checked="mixed"/);
});

test('Radio: type radio, disabled class', () => {
  const html = r(Radio, { name: 'plan', value: 'pro', disabled: true, size: 'm' }, 'Pro');
  assert.match(html, /bek-radio bek-radio--m bek-radio--disabled/);
  assert.match(html, /type="radio" class="bek-radio__input" disabled="" name="plan" value="pro"/);
});

test('Switch: checkbox with role=switch; label optional', () => {
  const html = r(Switch, { 'aria-label': 'Wi-Fi' });
  assert.match(html, /type="checkbox" role="switch" class="bek-switch__input" aria-label="Wi-Fi"/);
  assert.doesNotMatch(html, /bek-switch__label/);
});
