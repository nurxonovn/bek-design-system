import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { BekLogo } from '../dist/index.js';

const render = (props) => renderToStaticMarkup(createElement(BekLogo, props));

test('default: horizontal · s · gradient, masterbrand', () => {
  const html = render({});
  assert.match(html, /class="bek-logo bek-logo--horizontal bek-logo--s bek-logo--gradient"/);
  assert.match(html, /aria-label="BEK"/);
  assert.match(html, /<span class="bek-logo__wordmark">BEK<\/span>/);
  assert.doesNotMatch(html, /bek-logo__product/);
});

test('product name is shown and labelled', () => {
  const html = render({ product: 'Academy', size: 'm' });
  assert.match(html, /aria-label="BEK Academy"/);
  assert.match(html, /<span class="bek-logo__product">Academy<\/span>/);
  assert.match(html, /bek-logo--m/);
});

test('gradient mark references its own linearGradient', () => {
  const html = render({ variant: 'mark' });
  const id = /<linearGradient id="([^"]+)"/.exec(html)?.[1];
  assert.ok(id);
  assert.match(html, new RegExp(`fill="url\\(#${id}\\)"`));
  assert.doesNotMatch(html, /bek-logo__name/);
});

test('solid / mono / reversed use currentColor, no gradient', () => {
  for (const color of ['solid', 'mono', 'reversed']) {
    const html = render({ color, product: 'E-Store' });
    assert.match(html, new RegExp(`bek-logo--${color}`));
    assert.match(html, /fill="currentColor"/);
    assert.doesNotMatch(html, /linearGradient/);
  }
});

test('blank product falls back to masterbrand; aria-label can be overridden', () => {
  assert.match(render({ product: '  ' }), /aria-label="BEK"/);
  assert.match(
    render({ product: 'Icons', 'aria-label': 'BEK Icons — home' }),
    /aria-label="BEK Icons — home"/,
  );
});
