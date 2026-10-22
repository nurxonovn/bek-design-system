import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ScrollArea } from '../dist/index.js';

const r = (el) => renderToStaticMarkup(el);

test('ScrollArea: focusable vertical M scroll container by default', () => {
  const html = r(h(ScrollArea, null, 'Content'));
  assert.equal(
    html,
    '<div tabindex="0" class="bek-scrollbar bek-scroll-area bek-scroll-area--vertical bek-focus-ring">Content</div>',
  );
});

test('ScrollArea: S size, horizontal / both, region role when labelled', () => {
  const s = r(h(ScrollArea, { size: 's', orientation: 'horizontal', 'aria-label': 'Orders' }));
  assert.match(
    s,
    /^<div role="region" tabindex="0" aria-label="Orders" class="bek-scrollbar bek-scrollbar--s bek-scroll-area bek-scroll-area--horizontal/,
  );
  const both = r(h(ScrollArea, { orientation: 'both', tabIndex: -1 }));
  assert.match(both, /tabindex="-1"/);
  assert.match(both, /bek-scroll-area--both/);
  assert.doesNotMatch(both, /role=/);
});

test('scrollbar styles follow 4.8: sizes, 32 px thumb minimum, standard props only for Firefox', () => {
  const css = readFileSync(new URL('../dist/styles.css', import.meta.url), 'utf8');
  assert.match(css, /\.bek-scrollbar \{\s*--bek-scrollbar-size: var\(--bek-scale-12\);/);
  assert.match(css, /\.bek-scrollbar--s \{\s*--bek-scrollbar-size: var\(--bek-scale-8\);/);
  assert.match(css, /::-webkit-scrollbar-thumb:vertical \{\s*min-height: var\(--bek-scale-32\);/);
  assert.match(css, /::-webkit-scrollbar-thumb:horizontal \{\s*min-width: var\(--bek-scale-32\);/);
  assert.match(
    css,
    /@supports not selector\(::-webkit-scrollbar\) \{\s*\.bek-scrollbar \{\s*scrollbar-color/,
  );
  assert.match(
    css,
    /::-webkit-scrollbar-thumb:active \{\s*background-color: var\(--bek-fill-scrollbar-active\);/,
  );
});
