import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Select, Textarea } from '../dist/index.js';

const opts = [
  h('option', { key: 'a', value: 'uz' }, 'Uzbekistan'),
  h('option', { key: 'b', value: 'kz' }, 'Kazakhstan'),
];

test('Select: placeholder option, empty state and label link', () => {
  const html = renderToStaticMarkup(
    h(Select, { label: 'Country', placeholder: 'Choose', id: 's' }, opts),
  );
  assert.match(
    html,
    /bek-field bek-field--select bek-field--filled bek-field--m bek-field--labelled bek-field--empty/,
  );
  assert.match(html, /<option value="" disabled="" hidden="" selected="">Choose<\/option>/);
  assert.match(html, /<label class="bek-field__label" for="s">Country<\/label>/);
  assert.match(html, /bek-field__chevron/);
});

test('Select: a chosen value is not empty', () => {
  const html = renderToStaticMarkup(
    h(Select, { label: 'Country', defaultValue: 'kz', onChange() {} }, opts),
  );
  assert.doesNotMatch(html, /bek-field--empty/);
  assert.match(html, /<option value="kz" selected="">/);
});

test('Textarea: counter uses maxLength and current length', () => {
  const html = renderToStaticMarkup(
    h(Textarea, {
      label: 'Bio',
      id: 't',
      defaultValue: 'Salom',
      maxLength: 500,
      showCount: true,
      size: 'l',
    }),
  );
  assert.match(html, /bek-field--textarea bek-field--filled bek-field--l bek-field--labelled/);
  assert.match(html, /maxLength="500"/);
  assert.match(html, /<span class="bek-field__counter">5\/500<\/span>/);
  assert.match(html, /aria-describedby="t-support"/);
});
