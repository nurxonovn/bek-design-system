import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { FloatingActions, InfoWrap } from '../dist/index.js';

const r = (el) => renderToStaticMarkup(el);

test('FloatingActions: single layout — one Action XL, fixed, home indicator on', () => {
  const html = r(h(FloatingActions, { primary: { label: 'Continue' } }));
  assert.match(
    html,
    /^<div class="bek-floating-actions bek-floating-actions--single bek-floating-actions--fixed bek-floating-actions--home-indicator">/,
  );
  assert.equal(html.match(/<button/g).length, 1);
  assert.match(html, /bek-button--action bek-button--xl bek-floating-actions__button/);
  assert.doesNotMatch(html, /__info|__legal|__total/);
});

test('FloatingActions: horizontal and vertical render Primary then Secondary (Normal)', () => {
  for (const layout of ['horizontal', 'vertical']) {
    const html = r(
      h(FloatingActions, { layout, primary: { label: 'Call' }, secondary: { label: 'Write' } }),
    );
    assert.match(html, new RegExp(`bek-floating-actions--${layout}`));
    assert.match(
      html,
      /bek-button--action[^>]*>.*Call.*bek-button--normal bek-button--xl[^>]*>.*Write/,
    );
  }
  const single = r(
    h(FloatingActions, { primary: { label: 'Go' }, secondary: { label: 'Ignored' } }),
  );
  assert.doesNotMatch(single, /Ignored/);
});

test('FloatingActions: summary with total, info, legal; static without home indicator', () => {
  const html = r(
    h(FloatingActions, {
      layout: 'summary',
      total: '159 000 soʻm',
      info: h(InfoWrap, null, 'Free delivery'),
      legal: 'By continuing you agree to the Terms',
      homeIndicator: false,
      position: 'static',
      primary: { label: 'Pay', loading: true },
    }),
  );
  assert.match(html, /bek-floating-actions--summary bek-floating-actions--static"/);
  assert.doesNotMatch(html, /--home-indicator/);
  assert.match(
    html,
    /__total-label">Total<\/span><span class="bek-floating-actions__amount">159 000 soʻm/,
  );
  assert.match(html, /bek-floating-actions__info"><div class="bek-info-wrap/);
  assert.match(html, /<p class="bek-floating-actions__legal">By continuing/);
  assert.match(html, /aria-busy="true"/);
});
