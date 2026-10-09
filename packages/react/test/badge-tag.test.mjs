import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Badge, Tag } from '../dist/index.js';

const render = (C, props, text = 'Label') => renderToStaticMarkup(h(C, props, text));

test('Badge defaults: filled · neutral · m, label only', () => {
  const html = render(Badge, {});
  assert.equal(
    html,
    '<span class="bek-badge bek-badge--filled bek-badge--m bek-tone--neutral"><span class="bek-badge__label">Label</span></span>',
  );
});

test('Badge dot and icon come before the label and are hidden from AT', () => {
  const html = render(Badge, {
    dot: true,
    icon: h('svg'),
    color: 'danger',
    variant: 'subtle',
    size: 'l',
  });
  assert.match(html, /bek-badge--subtle bek-badge--l bek-tone--danger/);
  assert.ok(html.indexOf('bek-badge__dot') < html.indexOf('bek-badge__icon'));
  assert.ok(html.indexOf('bek-badge__icon') < html.indexOf('bek-badge__label'));
  assert.equal(html.match(/aria-hidden="true"/g).length, 2);
});

test('Tag defaults: subtle · neutral · s; utility colour exists', () => {
  assert.match(
    render(Tag, {}, 'Tag'),
    /class="bek-tag bek-tag--subtle bek-tag--s bek-tone--neutral"/,
  );
  assert.match(
    render(Tag, { color: 'utility', variant: 'outline' }, 'Beta'),
    /bek-tag--outline bek-tag--s bek-tone--utility/,
  );
});

test('extra props and className pass through', () => {
  const html = render(Badge, { className: 'x', title: 'Count', id: 'b1' }, '3');
  assert.match(html, /id="b1"/);
  assert.match(html, /title="Count"/);
  assert.match(html, /bek-tone--neutral x"/);
});
