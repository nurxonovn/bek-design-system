import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Divider, Icon, Spinner } from '../dist/index.js';

const r = (el) => renderToStaticMarkup(el);

test('Icon: decorative by default, labelled when label is given', () => {
  assert.equal(
    r(h(Icon, null, h('svg'))),
    '<span aria-hidden="true" class="bek-icon bek-icon--16"><svg></svg></span>',
  );
  const html = r(h(Icon, { size: 24, label: 'Search' }, h('svg')));
  assert.match(html, /role="img" aria-label="Search"/);
  assert.match(html, /bek-icon--24/);
});

test('Spinner: status with label; hidden when label is null', () => {
  assert.match(
    r(h(Spinner)),
    /role="status" aria-label="Loading" class="bek-spinner bek-spinner--16"/,
  );
  const hidden = r(h(Spinner, { label: null, size: 24 }));
  assert.match(hidden, /^<span aria-hidden="true" class="bek-spinner bek-spinner--24">/);
  assert.doesNotMatch(hidden, /role=/);
});

test('Divider: separator semantics, vertical orientation, decorative', () => {
  assert.equal(
    r(h(Divider)),
    '<div role="separator" class="bek-divider bek-divider--horizontal"></div>',
  );
  assert.match(
    r(h(Divider, { orientation: 'vertical' })),
    /role="separator" aria-orientation="vertical"/,
  );
  assert.match(r(h(Divider, { decorative: true })), /^<div role="none"/);
});
