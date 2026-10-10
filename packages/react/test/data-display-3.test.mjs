import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  Accordion,
  AccordionItem,
  Carousel,
  CodeInput,
  OrderWidget,
  Pinpad,
  ProductCard,
} from '../dist/index.js';

const r = (el) => renderToStaticMarkup(el);

test('Accordion: details/summary, open state and disabled', () => {
  const html = r(
    h(
      Accordion,
      null,
      h(
        AccordionItem,
        { title: 'Delivery', open: true, variant: 'card', size: 's' },
        'Free over 100 000',
      ),
      h(AccordionItem, { title: 'Returns', disabled: true }, 'x'),
    ),
  );
  assert.match(
    html,
    /<details class="bek-accordion-item bek-accordion-item--card bek-accordion-item--s" open="">/,
  );
  assert.match(html, /<summary class="bek-accordion-item__header">/);
  assert.match(html, /aria-disabled="true"/);
  assert.match(
    r(h(AccordionItem, { title: 'No line', divider: false }, 'x')),
    /bek-accordion-item--plain bek-accordion-item--m bek-accordion-item--no-divider/,
  );
});

test('CodeInput: dots reflect value length, numeric one-time-code input', () => {
  const html = r(
    h(CodeInput, {
      value: '12',
      length: 6,
      state: 'error',
      helperText: 'Incorrect code',
      'aria-label': 'PIN',
    }),
  );
  assert.equal(html.match(/bek-code-input__dot[ "]/g).length, 6);
  assert.equal(html.match(/is-filled/g).length, 2);
  assert.match(html, /inputMode="numeric" autoComplete="one-time-code"/);
  assert.match(html, /aria-invalid="true"/);
  assert.match(html, /role="status">Incorrect code/);
});

test('Pinpad: 10 digits, clear and biometric keys', () => {
  const html = r(h(Pinpad, { onDigit() {}, onClear() {}, bottomLeft: 'face' }));
  assert.equal(html.match(/bek-pinpad__key--digit/g).length, 10);
  assert.match(html, /aria-label="Face ID"/);
  assert.match(html, /aria-label="Delete"/);
});

test('Carousel: region with labelled slides, arrows and dots', () => {
  const html = r(
    h(
      Carousel,
      { 'aria-label': 'Promos' },
      h('img', { alt: 'a' }),
      h('img', { alt: 'b' }),
      h('img', { alt: 'c' }),
    ),
  );
  assert.match(html, /<section aria-roledescription="carousel" aria-label="Promos"/);
  assert.equal(html.match(/aria-roledescription="slide"/g).length, 3);
  assert.match(html, /aria-label="2 \/ 3"/);
  assert.equal(html.match(/bek-carousel__dot/g).length, 3 + 1);
  assert.match(html, /Previous slide/);
  assert.match(html, /class="bek-carousel bek-carousel--inside bek-carousel--dots"/);
});

test('Carousel: fraction, progress and thumbnail indicators', () => {
  const slides = [h('img', { alt: 'a' }), h('img', { alt: 'b' })];
  const fraction = r(
    h(Carousel, { 'aria-label': 'x', controls: 'dots', indicator: 'fraction' }, ...slides),
  );
  assert.match(fraction, /bek-carousel__fraction" aria-live="polite">1 \/ 2</);
  assert.doesNotMatch(fraction, /bek-carousel__arrow/);
  const progress = r(h(Carousel, { 'aria-label': 'x', indicator: 'progress' }, ...slides));
  assert.match(progress, /role="progressbar"[^>]*aria-valuemax="2"[^>]*aria-valuenow="1"/);
  assert.match(progress, /bek-carousel__progress-bar" style="width:50%"/);
  const thumbs = r(
    h(
      Carousel,
      {
        'aria-label': 'x',
        indicator: 'thumbnails',
        orientation: 'vertical',
        thumbSize: 'm',
        thumbnails: [h('img', { alt: '' }), h('img', { alt: '' })],
      },
      ...slides,
    ),
  );
  assert.match(thumbs, /bek-carousel--thumbnails bek-carousel--vertical/);
  assert.match(thumbs, /bek-carousel__thumbs bek-carousel__thumbs--vertical/);
  assert.equal(thumbs.match(/bek-carousel__thumb bek-carousel__thumb--m/g).length, 2);
  assert.match(
    thumbs,
    /aria-label="1 \/ 2" aria-current="true" class="bek-carousel__thumb bek-carousel__thumb--m is-active"/,
  );
  assert.match(
    r(h(Carousel, { 'aria-label': 'x', controls: 'none', indicator: 'fraction' }, ...slides)),
    /^<section[^>]*><div class="bek-carousel__frame">[\s\S]*<\/div><\/section>$/,
  );
});

test('ProductCard: add button, stepper in cart, disabled when unavailable', () => {
  assert.match(
    r(h(ProductCard, { title: 'Pizza', onAdd() {} })),
    /bek-button--outline-action[^>]*><span class="bek-button__label">Add/,
  );
  assert.match(
    r(h(ProductCard, { title: 'Pizza', quantity: 2 })),
    /role="spinbutton"[^>]*aria-valuenow="2"/,
  );
  const off = r(h(ProductCard, { title: 'Pizza', unavailable: true, layout: 'horizontal' }));
  assert.match(off, /bek-product-card--horizontal bek-product-card--unavailable/);
  assert.match(off, /disabled=""/);
});

test('OrderWidget: expanded progress marks reached stages', () => {
  const html = r(
    h(OrderWidget, { status: 'preparing', size: 'expanded', title: 'Preparing', href: '/o/1' }),
  );
  assert.match(
    html,
    /^<a href="\/o\/1" class="bek-order-widget bek-order-widget--expanded bek-order-widget--preparing"/,
  );
  assert.equal(html.match(/bek-order-widget__step is-done/g).length, 2);
  assert.match(html, /aria-valuenow="2"/);
});
