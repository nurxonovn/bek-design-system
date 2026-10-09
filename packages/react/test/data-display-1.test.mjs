import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Avatar, Card, ListItem, ProgressBar } from '../dist/index.js';

const r = (C, p, c) => renderToStaticMarkup(h(C, p, c));

test('Avatar: initials from name, labelled, status dot; icon when nameless', () => {
  const html = r(Avatar, { name: 'Nurbek Nurxonov', size: 'xl', status: 'online' });
  assert.match(html, /role="img" aria-label="Nurbek Nurxonov" class="bek-avatar bek-avatar--xl"/);
  assert.match(html, />NN</);
  assert.match(html, /bek-avatar__status--online/);
  assert.match(r(Avatar, {}), /aria-hidden="true"[\s\S]*<svg/);
  assert.match(
    r(Avatar, { src: '/a.png', name: 'A' }),
    /<img class="bek-avatar__image" src="\/a.png" alt=""/,
  );
});

test('ProgressBar: progressbar semantics, percent width and value text', () => {
  const html = r(ProgressBar, {
    value: 30,
    max: 60,
    label: 'Upload',
    showValue: true,
    status: 'success',
    size: 'l',
  });
  assert.match(
    html,
    /role="progressbar" aria-valuemin="0" aria-valuemax="60" aria-valuenow="30" aria-label="Upload"/,
  );
  assert.match(html, /width:50%/);
  assert.match(html, />50%</);
  assert.match(html, /bek-progress--l bek-progress--success/);
});

test('ListItem: link when href, button role when onClick, static otherwise', () => {
  assert.match(
    r(ListItem, { title: 'Settings', href: '/s', chevron: true }),
    /^<a href="\/s" class="bek-list-item bek-list-item--m bek-list-item--interactive"/,
  );
  assert.match(
    r(ListItem, { title: 'Wi-Fi', onClick() {}, selected: true }),
    /role="button" tabindex="0" aria-pressed="true"/,
  );
  const plain = r(ListItem, { title: 'Name', description: 'Nurbek', size: 's' });
  assert.match(plain, /^<div class="bek-list-item bek-list-item--s">/);
  assert.match(plain, /bek-list-item__description">Nurbek/);
});

test('Card: slots render in order; href makes the whole card a link', () => {
  const html = r(
    Card,
    { title: 'Payment', description: 'Due today', footer: h('button', null, 'Pay') },
    'Body text',
  );
  assert.match(html, /class="bek-card bek-card--elevated bek-card--m"/);
  assert.ok(html.indexOf('Payment') < html.indexOf('Body text'));
  assert.ok(html.indexOf('Body text') < html.indexOf('>Pay<'));
  assert.match(
    r(Card, { href: '/p', variant: 'filled', size: 's', title: 'X' }),
    /^<a href="\/p" class="bek-card bek-card--filled bek-card--s bek-card--interactive"/,
  );
});
