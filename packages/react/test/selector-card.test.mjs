import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Fieldset, SelectorCard, SelectorGroup } from '../dist/index.js';

const r = (el) => renderToStaticMarkup(el);

test('SelectorCard: radio by default, title labels the native input, description and meta describe it', () => {
  const html = r(
    h(SelectorCard, {
      title: 'Courier',
      description: 'Within 2 hours in Tashkent',
      meta: '15 000 so‘m',
      name: 'delivery',
      value: 'courier',
      defaultChecked: true,
    }),
  );
  assert.match(
    html,
    /^<div class="bek-selector-card bek-selector-card--radio bek-selector-card--none">/,
  );
  assert.doesNotMatch(html, /__media/);
  const titleId = html.match(/bek-selector-card__title" id="([^"]+)">Courier</)[1];
  const descId = html.match(/bek-selector-card__description" id="([^"]+)">Within/)[1];
  const metaId = html.match(/bek-selector-card__meta" id="([^"]+)">15 000/)[1];
  // Nested Radio (3.5), M o'lcham; label karta ustiga cho'ziladi — ichma-ich <label> yo'q.
  assert.match(html, /<label class="bek-radio bek-radio--m bek-selector-card__indicator">/);
  assert.equal(html.match(/<label/g).length, 1);
  assert.match(html, /<input type="radio" class="bek-radio__input" name="delivery"/);
  assert.match(html, new RegExp(`aria-labelledby="${titleId}"`));
  assert.match(html, new RegExp(`aria-describedby="${descId} ${metaId}"`));
  assert.match(html, /checked="" value="courier"/);
  assert.doesNotMatch(html, /aria-invalid/);
});

test('SelectorCard: control variants reuse Checkbox and Switch', () => {
  const cb = r(h(SelectorCard, { control: 'checkbox', title: 'Motion' }));
  assert.match(cb, /bek-selector-card--checkbox/);
  assert.match(cb, /<label class="bek-checkbox bek-checkbox--m bek-selector-card__indicator">/);
  assert.match(cb, /<input type="checkbox" class="bek-checkbox__input"/);
  assert.doesNotMatch(cb, /aria-describedby/);
  const sw = r(h(SelectorCard, { control: 'switch', title: 'Promotions', defaultChecked: true }));
  assert.match(sw, /bek-selector-card--switch/);
  assert.match(sw, /<input type="checkbox" role="switch" class="bek-switch__input"/);
});

test('SelectorCard: media variants — explicit and inferred from icon / image', () => {
  const icon = r(h(SelectorCard, { title: 'Courier', icon: h('svg', { 'data-i': '1' }) }));
  assert.match(icon, /bek-selector-card--icon/);
  assert.match(icon, /<span class="bek-selector-card__media" aria-hidden="true"><svg data-i="1">/);
  const img = h('img', { src: 'plan.png', alt: '' });
  assert.match(r(h(SelectorCard, { title: 'Pro', image: img })), /bek-selector-card--image-start/);
  const top = r(h(SelectorCard, { title: 'Pro', media: 'image-top', image: img }));
  assert.match(top, /bek-selector-card--image-top/);
  assert.match(top, /__media" aria-hidden="true"><img src="plan.png" alt=""\/>/);
  // media="none" — slot berilsa ham chizilmaydi.
  assert.doesNotMatch(r(h(SelectorCard, { title: 'X', media: 'none', icon: h('svg') })), /__media/);
});

test('SelectorCard: disabled and error states, className/style on root, ref props to input', () => {
  const html = r(
    h(SelectorCard, {
      title: 'Post',
      disabled: true,
      error: true,
      className: 'extra',
      style: { maxWidth: 320 },
      'aria-describedby': 'hint',
      required: true,
    }),
  );
  assert.match(
    html,
    /^<div class="bek-selector-card bek-selector-card--radio bek-selector-card--none bek-selector-card--error bek-selector-card--disabled extra" style="max-width:320px">/,
  );
  assert.match(html, /bek-radio--disabled/);
  assert.match(html, /disabled=""/);
  assert.match(html, /aria-describedby="hint"/);
  assert.match(html, /aria-invalid="true"/);
  assert.match(html, /required=""/);
});

test('SelectorGroup: orientation, shared name and error, RTL leaves markup unchanged', () => {
  const group = (props) =>
    h(
      SelectorGroup,
      props,
      h(SelectorCard, { title: 'Courier', value: 'c' }),
      h(SelectorCard, { title: 'Pickup', value: 'p', error: false }),
    );
  const v = r(group({ name: 'delivery', error: true }));
  assert.match(v, /^<div class="bek-selector-group bek-selector-group--vertical">/);
  assert.equal(v.match(/name="delivery"/g).length, 2);
  // Guruh xatosi kartalarga o'tadi; kartaning o'z `error` prop'i ustun.
  assert.equal(v.match(/aria-invalid="true"/g).length, 1);
  assert.equal(v.match(/bek-selector-card--error/g).length, 1);
  const hz = r(group({ orientation: 'horizontal', role: 'radiogroup', 'aria-label': 'Delivery' }));
  assert.match(
    hz,
    /^<div class="bek-selector-group bek-selector-group--horizontal" role="radiogroup" aria-label="Delivery">/,
  );
  assert.doesNotMatch(hz, /name=/);
  const rtl = r(h('div', { dir: 'rtl' }, group({ name: 'x' })));
  assert.match(
    rtl,
    /^<div dir="rtl"><div class="bek-selector-group bek-selector-group--vertical">/,
  );
});

test('SelectorGroup inside Fieldset: legend groups the cards, error message described', () => {
  const html = r(
    h(
      Fieldset,
      { label: 'Delivery method', status: 'error', message: 'Choose a delivery method' },
      h(SelectorGroup, { name: 'd', error: true }, h(SelectorCard, { title: 'Courier' })),
    ),
  );
  assert.match(html, /<legend class="bek-visually-hidden">Delivery method<\/legend>/);
  assert.match(html, /aria-invalid="true"/);
  assert.match(html, /bek-selector-card--error/);
});
