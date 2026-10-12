import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Steps, StepsItem } from '../dist/index.js';

const r = (el) => renderToStaticMarkup(el);
const items = (html) => html.match(/<li[^>]*>/g) ?? [];

test('Steps: ordered list, vertical by default, Count = children', () => {
  const html = r(
    h(
      Steps,
      { 'aria-label': 'Order status' },
      h(StepsItem, { status: 'complete', title: 'Placed' }),
      h(StepsItem, { status: 'current', title: 'Packed' }),
      null,
      h(StepsItem, { status: 'upcoming', title: 'Delivered' }),
    ),
  );
  assert.match(html, /^<ol class="bek-steps bek-steps--vertical" aria-label="Order status">/);
  const li = items(html);
  assert.equal(li.length, 3);
  assert.match(li[0], /bek-steps__item--vertical bek-steps__item--complete bek-steps__item--dot/);
  assert.match(li[1], /bek-steps__item--current/);
  assert.match(li[2], /bek-steps__item--upcoming/);
});

test('Steps: first/last lines off automatically, overridable', () => {
  const html = r(
    h(
      Steps,
      null,
      h(StepsItem, { title: 'A' }),
      h(StepsItem, { title: 'B' }),
      h(StepsItem, { title: 'C', lineAfter: true }),
    ),
  );
  const li = items(html);
  assert.match(li[0], /--no-line-before/);
  assert.doesNotMatch(li[0], /--no-line-after/);
  assert.doesNotMatch(li[1], /--no-line/);
  assert.doesNotMatch(li[2], /--no-line/);
  const single = r(h(Steps, null, h(StepsItem, { title: 'Only' })));
  assert.match(single, /--no-line-before bek-steps__item--no-line-after/);
  const standalone = r(h(StepsItem, { title: 'Alone' }));
  assert.doesNotMatch(standalone, /--no-line/);
});

test('Steps: aria-current, visually hidden status text, decorative rail', () => {
  const html = r(
    h(
      Steps,
      { statusLabels: { complete: 'Bajarildi' } },
      h(StepsItem, { status: 'complete', title: 'Paid' }),
      h(StepsItem, { status: 'current', title: 'Packed' }),
      h(StepsItem, { status: 'error', title: 'Payment', statusLabel: 'Xato' }),
      h(StepsItem, { status: 'upcoming', title: 'Done' }),
    ),
  );
  const li = items(html);
  assert.doesNotMatch(li[0], /aria-current/);
  assert.match(li[1], /aria-current="step"/);
  assert.equal((html.match(/aria-current/g) ?? []).length, 1);
  assert.match(html, /<span class="bek-visually-hidden">Bajarildi: <\/span>Paid/);
  assert.match(html, /<span class="bek-visually-hidden">Current: <\/span>Packed/);
  assert.match(html, /<span class="bek-visually-hidden">Xato: <\/span>Payment/);
  assert.match(html, /<span class="bek-visually-hidden">Not started: <\/span>Done/);
  assert.match(html, /<span class="bek-steps__rail" aria-hidden="true">/);
});

test('Steps: markers — dot, number (auto index / override), icon by status', () => {
  const dot = r(h(StepsItem, { title: 'x' }));
  assert.match(dot, /bek-steps__marker"><span class="bek-steps__dot"><\/span>/);

  const num = r(
    h(
      Steps,
      { marker: 'number' },
      h(StepsItem, { title: 'Cart' }),
      h(StepsItem, { title: 'Delivery', number: 'B' }),
      h(StepsItem, { title: 'Pay', marker: 'dot' }),
    ),
  );
  assert.match(num, /bek-steps__item--number[^>]*>.*?bek-steps__circle">1<\/span>/);
  assert.match(num, /bek-steps__circle">B<\/span>/);
  assert.match(items(num)[2], /bek-steps__item--dot/);

  const icon = r(
    h(
      Steps,
      { marker: 'icon' },
      h(StepsItem, { status: 'complete', title: 'a' }),
      h(StepsItem, { status: 'error', title: 'b' }),
      h(StepsItem, { status: 'upcoming', title: 'c', icon: h('svg', { id: 'own' }) }),
    ),
  );
  assert.equal((icon.match(/bek-steps__circle"><svg/g) ?? []).length, 3);
  assert.match(icon, /<svg id="own"><\/svg>/);
});

test('Steps: vertical slots — description, action, meta; horizontal — caption only', () => {
  const v = r(
    h(StepsItem, {
      status: 'current',
      title: 'Packed',
      description: 'Courier at 15:00',
      action: h('button', { type: 'button' }, 'Track'),
      meta: 'Today',
      caption: 'ignored',
    }),
  );
  assert.match(v, /bek-steps__description">Courier at 15:00<\/div>/);
  assert.match(v, /bek-steps__action"><button type="button">Track<\/button><\/div>/);
  assert.match(v, /<\/div><div class="bek-steps__meta">Today<\/div><\/li>$/);
  assert.doesNotMatch(v, /caption/);

  const hz = r(
    h(
      Steps,
      { orientation: 'horizontal' },
      h(StepsItem, { title: 'Placed', caption: '10 Oct', description: 'no', meta: 'no' }),
      h(StepsItem, { title: 'Paid' }),
    ),
  );
  assert.match(hz, /^<ol class="bek-steps bek-steps--horizontal">/);
  assert.match(items(hz)[0], /bek-steps__item--horizontal/);
  assert.match(hz, /bek-steps__caption">10 Oct<\/div>/);
  assert.doesNotMatch(hz, /__description|__meta|__action/);
});

test('Steps: passes HTML attributes, className and keeps RTL to CSS', () => {
  const html = r(
    h(
      Steps,
      { className: 'x', dir: 'rtl', id: 'track' },
      h(StepsItem, { title: 'A', className: 'y', 'data-k': '1' }),
    ),
  );
  assert.match(html, /^<ol class="bek-steps bek-steps--vertical x" dir="rtl" id="track">/);
  assert.match(html, /class="bek-steps__item [^"]* y" data-k="1">/);
});
