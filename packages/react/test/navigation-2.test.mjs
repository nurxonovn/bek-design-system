import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  AppBar,
  BottomNavGroup,
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
  assert.match(bar, /class="bek-app-bar bek-app-bar--s bek-app-bar--title bek-app-bar--scrolled"/);
  assert.doesNotMatch(bar, /bek-glass/);
  assert.match(bar, /bek-button--flat bek-button--xl/);
  assert.match(bar, /<h1 class="bek-app-bar__title">Orders<\/h1>/);
  const search = r(h(AppBar, { variant: 'search', title: 'Catalog' }, h('input')));
  assert.match(search, /bek-app-bar--search/);
  assert.match(search, /<h1 class="bek-visually-hidden">Catalog<\/h1><input\/>/);
  // Figma: Search field instance — SearchField Filled, o'lchami bar bilan (S → s, M → m)
  const field = r(h(AppBar, { variant: 'search', search: { 'aria-label': 'Search' } }));
  assert.match(field, /bek-search-field bek-search-field--filled bek-search-field--s/);
  const brand = r(h(AppBar, { variant: 'brand', size: 'm', search: { 'aria-label': 'Search' } }));
  assert.match(brand, /bek-app-bar--m bek-app-bar--brand/);
  assert.match(brand, /bek-search-field--filled bek-search-field--m/);
  assert.doesNotMatch(r(h(AppBar, { title: 'x', search: {} })), /bek-search-field/);
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
  // Eski API: variant e'tiborsiz, to'g'ridan-to'g'ri itemlar bitta kapsulaga o'raladi
  assert.match(
    nav,
    /aria-label="Main" class="bek-bottom-nav bek-bottom-nav--mobile"><div class="bek-bottom-nav-group bek-bottom-nav-group--fill">/,
  );
  assert.doesNotMatch(nav, /bek-bottom-nav--floating/);
  assert.match(nav, /aria-current="page"/);
  assert.match(nav, />99\+</);
  assert.match(nav, /bek-bottom-nav-item__dot/);
  assert.match(nav, /bek-bottom-nav-item--icon-only/);
  assert.match(nav, /bek-visually-hidden">Search/);
  // Figma 6.7: Dual + Solo kapsulalar, device=tablet
  const capsules = r(
    h(
      BottomNavigation,
      { device: 'tablet' },
      h(
        BottomNavGroup,
        { variant: 'dual' },
        h(BottomNavItem, { icon: h('svg'), selected: true, href: '/' }, 'Home'),
        h(BottomNavItem, { icon: h('svg'), href: '/c' }, 'Courses'),
      ),
      h(
        BottomNavGroup,
        { variant: 'solo' },
        h(BottomNavItem, { icon: h('svg'), variant: 'icon-only' }, 'Stats'),
      ),
    ),
  );
  assert.match(
    capsules,
    /class="bek-bottom-nav bek-bottom-nav--tablet"><div class="bek-bottom-nav-group bek-bottom-nav-group--dual">/,
  );
  assert.match(capsules, /bek-bottom-nav-group--solo/);
  assert.doesNotMatch(capsules, /bek-bottom-nav-group--fill/);
  assert.equal(capsules.match(/bek-bottom-nav-item--label/g).length, 2);
  assert.match(capsules, /bek-bottom-nav-item__label">Home/);
  assert.match(capsules, /bek-visually-hidden">Stats/);
  const co = r(
    h(CheckoutBar, {
      type: 'checkout',
      total: '159 000',
      action: { label: 'Pay' },
      legal: 'Terms',
    }),
  );
  assert.match(co, /bek-floating-actions--summary bek-floating-actions--sticky/);
  assert.match(co, /bek-checkout-bar bek-checkout-bar--checkout/);
  assert.match(co, /bek-floating-actions__amount">159 000/);
  assert.match(co, /bek-floating-actions__legal">Terms/);
  assert.match(co, /bek-button--action bek-button--xl/);
  assert.match(
    r(h(CartPill, { icon: h('svg'), label: 'Cart', total: '1' })),
    /^<button type="button" class="bek-cart-pill bek-focus-ring"/,
  );
});
