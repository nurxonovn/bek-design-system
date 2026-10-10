import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  AppBar,
  BottomNavigation,
  BottomNavItem,
  Breadcrumb,
  CartPill,
  CheckoutBar,
  LoadMore,
  Pagination,
  TopNavigation,
  paginationRange,
} from '../dist/index.js';

const r = (el) => renderToStaticMarkup(el);
const items = [
  { label: 'Home', href: '/' },
  { label: 'Catalog', href: '/c' },
  { label: 'Phones', href: '/c/p' },
  { label: 'iPhone' },
];

test('Breadcrumb: full, collapsed and back layouts', () => {
  const full = r(h(Breadcrumb, { items }));
  assert.match(
    full,
    /^<nav aria-label="Breadcrumb" class="bek-breadcrumb bek-breadcrumb--s bek-breadcrumb--full"><ol/,
  );
  assert.equal(full.match(/<li/g).length, 4);
  assert.equal(full.match(/bek-breadcrumb__separator/g).length, 3);
  assert.match(full, /aria-current="page">iPhone<\/span>/);
  const col = r(h(Breadcrumb, { items, layout: 'collapsed' }));
  assert.equal(col.match(/<li/g).length, 2);
  assert.match(col, /aria-label="Show hidden pages"/);
  assert.doesNotMatch(col, /Catalog/);
  const back = r(h(Breadcrumb, { items, layout: 'back' }));
  assert.match(back, /href="\/c\/p"/);
  assert.doesNotMatch(back, /<ol/);
});

test('paginationRange keeps a constant length with ellipses', () => {
  assert.deepEqual(paginationRange(1, 5), [1, 2, 3, 4, 5]);
  assert.deepEqual(paginationRange(1, 52), [1, 2, 3, 4, 5, '…', 52]);
  assert.deepEqual(paginationRange(26, 52), [1, '…', 25, 26, 27, '…', 52]);
  assert.deepEqual(paginationRange(52, 52), [1, '…', 48, 49, 50, 51, 52]);
});

test('Pagination: current page, disabled arrows, compact position', () => {
  const html = r(h(Pagination, { page: 1, pageCount: 10, onPageChange() {}, summary: '1–24' }));
  assert.match(html, /aria-label="Page 1" aria-current="page"/);
  assert.match(html, /disabled=""[^>]*>.*?Previous page/);
  assert.match(html, /bek-pagination__summary">1–24/);
  const compact = r(
    h(Pagination, { page: 3, pageCount: 52, onPageChange() {}, variant: 'compact' }),
  );
  assert.match(compact, /bek-pagination__position" aria-live="polite">3 \/ 52/);
  assert.doesNotMatch(compact, /aria-current/);
  assert.doesNotMatch(r(h(LoadMore, { loaded: 5, total: 5, onLoadMore() {} })), /<button/);
});

test('AppBar and TopNavigation', () => {
  const bar = r(h(AppBar, { title: 'Orders', onBack() {}, scrolled: true }));
  assert.match(
    bar,
    /class="bek-app-bar bek-app-bar--s bek-app-bar--title bek-app-bar--scrolled bek-glass-regular"/,
  );
  assert.match(bar, /<h1 class="bek-app-bar__title">Orders<\/h1>/);
  const search = r(h(AppBar, { variant: 'search', title: 'Catalog' }, h('input')));
  assert.match(search, /bek-app-bar--search/);
  assert.match(search, /<h1 class="bek-visually-hidden">Catalog<\/h1><input\/>/);
  const top = r(h(TopNavigation, { type: 'large-title', title: 'Profile', leading: 'close' }));
  assert.match(top, /bek-top-nav__large-title">Profile/);
  assert.match(top, /Close/);
  assert.doesNotMatch(r(h(TopNavigation, { leading: 'none', title: 'x' })), /<button/);
});

test('BottomNavigation items, badges and checkout bar', () => {
  const nav = r(
    h(
      BottomNavigation,
      { variant: 'floating' },
      h(BottomNavItem, { icon: h('svg'), selected: true, href: '/' }, 'Home'),
      h(BottomNavItem, { icon: h('svg'), badge: 120 }, 'Cart'),
      h(BottomNavItem, { icon: h('svg'), badge: 'dot', hideLabel: true }, 'Search'),
    ),
  );
  assert.match(nav, /aria-label="Main" class="bek-bottom-nav bek-bottom-nav--floating"/);
  assert.match(nav, /aria-current="page"/);
  assert.match(nav, />99\+</);
  assert.match(nav, /bek-bottom-nav-item__dot/);
  assert.match(nav, /bek-visually-hidden">Search/);
  const co = r(
    h(CheckoutBar, {
      type: 'checkout',
      total: '159 000',
      action: { label: 'Pay' },
      legal: 'Terms',
    }),
  );
  assert.match(co, /bek-checkout-bar__amount">159 000/);
  assert.match(co, /bek-button--action bek-button--xl/);
  assert.match(
    r(h(CartPill, { icon: h('svg'), label: 'Cart', total: '1' })),
    /^<button type="button" class="bek-cart-pill bek-focus-ring"/,
  );
});
