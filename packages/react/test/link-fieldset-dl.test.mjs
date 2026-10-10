import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { DescriptionList, DescriptionListItem, Fieldset, Link } from '../dist/index.js';

const r = (el) => renderToStaticMarkup(el);

test('Link: variants, sizes, icons, disabled drops href', () => {
  const a = r(
    h(Link, { href: '/all', variant: 'accent', size: 'm', endIcon: h('svg') }, 'Show all'),
  );
  assert.match(a, /^<a class="bek-link bek-focus-ring bek-link--accent bek-link--m" href="\/all">/);
  assert.match(a, /bek-link__icon bek-link__icon--end" aria-hidden="true"><svg><\/svg>/);
  assert.match(a, /bek-link__label">Show all/);
  const inherit = r(h(Link, { href: '/x' }, 'terms'));
  assert.match(inherit, /bek-link--inherit bek-link--s/);
  assert.doesNotMatch(inherit, /__icon/);
  const dis = r(h(Link, { href: '/x', variant: 'subtle', disabled: true }, 'Off'));
  assert.doesNotMatch(dis, /href=/);
  assert.match(dis, /aria-disabled="true"/);
  assert.match(dis, /bek-link--disabled/);
  assert.match(
    r(h(Link, { href: '/x', variant: 'neutral', startIcon: h('svg') }, 'T')),
    /__icon--start/,
  );
});

test('Fieldset: legend, hint, optional, message status and layout', () => {
  const v = r(
    h(
      Fieldset,
      { label: 'Delivery', message: 'Courier arrives within 2 hours' },
      h('div', null, 'ctl'),
    ),
  );
  assert.match(
    v,
    /^<fieldset class="bek-fieldset bek-fieldset--vertical bek-fieldset--helper" aria-describedby="bek-fieldset-msg-[^"]+"/,
  );
  assert.match(v, /<legend class="bek-visually-hidden">Delivery<\/legend>/);
  assert.match(v, /bek-fieldset__label">Delivery/);
  assert.match(v, /bek-fieldset__control"><div>ctl<\/div>/);
  assert.match(v, /bek-fieldset__message" id="bek-fieldset-msg-[^"]+"><span>Courier/);
  assert.doesNotMatch(v, /aria-invalid/);
  const e = r(
    h(
      Fieldset,
      {
        label: 'Budget',
        hint: 'Per month',
        optional: true,
        layout: 'horizontal',
        status: 'error',
        message: 'Minimum is 500 000',
      },
      'ctl',
    ),
  );
  assert.match(
    e,
    /bek-fieldset--horizontal bek-fieldset--error" aria-describedby="[^"]+" aria-invalid="true"/,
  );
  assert.match(e, /<legend class="bek-visually-hidden">Budget \(Optional\)\. Per month<\/legend>/);
  assert.match(e, /bek-fieldset__hint" title="Per month"><svg/);
  assert.match(e, /bek-fieldset__optional">Optional/);
  assert.match(e, /bek-fieldset__message" id="[^"]+"><svg/);
  const s = r(
    h(Fieldset, { label: 'Promo', optional: 'Ixtiyoriy', status: 'success', message: 'ok' }, 'c'),
  );
  assert.match(s, /bek-fieldset--success/);
  assert.match(s, /__optional">Ixtiyoriy/);
  assert.doesNotMatch(
    r(h(Fieldset, { label: 'L', status: 'error' }, 'c')),
    /bek-fieldset--error|__message/,
  );
});

test('DescriptionList: dl semantics, layouts, leader, hint, total and action', () => {
  const html = r(
    h(
      DescriptionList,
      {
        title: 'Your order',
        action: h('a', { href: '/all' }, 'Show all'),
        total: { term: 'Total', value: '149 000' },
        size: 'm',
      },
      h(DescriptionListItem, { term: 'Delivery', hint: 'Free over 200 000', leader: true }, 'Free'),
      h(DescriptionListItem, { term: 'VAT' }, '12 %'),
    ),
  );
  assert.match(html, /^<div class="bek-dl bek-dl--justified bek-dl--m">/);
  assert.match(
    html,
    /bek-dl__header"><h3 class="bek-dl__title">Your order<\/h3><div class="bek-dl__action"><a href="\/all">/,
  );
  assert.match(html, /<dl class="bek-dl__list">/);
  assert.match(
    html,
    /bek-dl__item bek-dl__item--leader"><dt class="bek-dl__term">Delivery<span class="bek-dl__hint" title="Free over 200 000"><svg/,
  );
  assert.match(html, /bek-visually-hidden">Free over 200 000/);
  assert.match(
    html,
    /<span class="bek-dl__leader" aria-hidden="true"><\/span><dd class="bek-dl__value">Free<\/dd>/,
  );
  assert.match(
    html,
    /bek-dl__item bek-dl__total"><dt class="bek-dl__term">Total<\/dt><dd class="bek-dl__value">149 000/,
  );
  assert.equal(html.match(/<dd /g).length, 3);
  const inline = r(
    h(
      DescriptionList,
      { layout: 'inline' },
      h(DescriptionListItem, { term: 'Status' }, 'On the way'),
    ),
  );
  assert.match(inline, /bek-dl--inline bek-dl--s/);
  assert.doesNotMatch(inline, /__header|__total|__leader/);
  assert.match(
    r(
      h(
        DescriptionList,
        { layout: 'columns', size: 'l' },
        h(DescriptionListItem, { term: 'W' }, '1'),
      ),
    ),
    /bek-dl--columns bek-dl--l/,
  );
});
