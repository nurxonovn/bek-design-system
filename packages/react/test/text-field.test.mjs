import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { TextField } from '../dist/index.js';

const r = (props) => renderToStaticMarkup(h(TextField, props));

test('label is linked to the input; blank placeholder enables the resting label', () => {
  const html = r({ label: 'Email', id: 'em' });
  assert.match(html, /class="bek-field bek-field--filled bek-field--m bek-field--labelled"/);
  assert.match(html, /<input id="em" class="bek-field__input" placeholder=" "/);
  assert.match(html, /<label class="bek-field__label" for="em">Email<\/label>/);
  assert.ok(
    html.indexOf('<input') < html.indexOf('<label'),
    'label follows input for the CSS sibling rule',
  );
});

test('real placeholder keeps the label floating', () => {
  const html = r({ label: 'Email', placeholder: 'name@mail.uz', id: 'x' });
  assert.match(html, /bek-field--floating/);
  assert.match(html, /placeholder="name@mail.uz"/);
});

test('error + supporting text: aria-invalid and aria-describedby', () => {
  const html = r({ label: 'Card', id: 'c', error: true, supportingText: 'Invalid number' });
  assert.match(html, /bek-field--error/);
  assert.match(html, /aria-invalid="true" aria-describedby="c-support"/);
  assert.match(html, /<div id="c-support" class="bek-field__supporting">Invalid number<\/div>/);
});

test('loading replaces the trailing icon with a spinner; skeleton marks busy', () => {
  const html = r({ loading: true, trailingIcon: h('svg', { id: 't' }), size: 'xl' });
  assert.doesNotMatch(html, /id="t"/);
  assert.match(html, /bek-spinner--20/);
  assert.match(r({ skeleton: true }), /bek-field--skeleton" aria-busy="true"/);
});

test('size, variant, disabled and className go to the wrapper', () => {
  const html = r({ size: 's', variant: 'outlined', disabled: true, className: 'w' });
  assert.match(html, /bek-field--outlined bek-field--s bek-field--disabled w"/);
  assert.match(html, / disabled=""/);
});
