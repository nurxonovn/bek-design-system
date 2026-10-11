import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  AppShell,
  HomeIndicator,
  Keyboard,
  Mascot,
  MascotMessage,
  Pattern,
  StatusBar,
} from '../dist/index.js';

const r = (el) => renderToStaticMarkup(el);

test('Pattern: type × tone classes, decorative', () => {
  assert.match(
    r(h(Pattern)),
    /^<div aria-hidden="true" class="bek-pattern bek-pattern--dots bek-pattern--subtle"><\/div>$/,
  );
  assert.match(
    r(h(Pattern, { type: 'logo-petals', tone: 'accent' })),
    /bek-pattern--logo-petals bek-pattern--accent/,
  );
});

test('StatusBar / HomeIndicator: platform, content colour and native sizes', () => {
  const ios = r(h(StatusBar));
  assert.match(
    ios,
    /^<div aria-hidden="true" class="bek-status-bar bek-status-bar--ios bek-system-bar--dark">/,
  );
  assert.match(ios, /bek-status-bar__time">9:41/);
  assert.match(ios, /bek-status-bar__island/);
  const android = r(h(StatusBar, { platform: 'android', content: 'light', time: '10:00' }));
  assert.match(android, /bek-status-bar--android bek-system-bar--light/);
  assert.match(android, /__time">10:00/);
  assert.doesNotMatch(android, /__island/);
  assert.match(
    r(h(HomeIndicator)),
    /^<div aria-hidden="true" class="bek-home-indicator bek-home-indicator--ios bek-system-bar--dark"><span class="bek-home-indicator__bar"><\/span><\/div>$/,
  );
  assert.match(
    r(h(HomeIndicator, { platform: 'android', content: 'light' })),
    /bek-home-indicator--android bek-system-bar--light/,
  );
});

test('Keyboard: alphabet rows, suggestions, numeric pad', () => {
  const ios = r(h(Keyboard));
  assert.match(
    ios,
    /^<div aria-hidden="true" class="bek-keyboard bek-keyboard--ios bek-keyboard--alphabet">/,
  );
  assert.match(ios, /bek-keyboard__suggestion">“Design”/);
  assert.equal(ios.match(/bek-keyboard__key"/g).length, 26);
  assert.match(ios, /bek-keyboard__key--space">space/);
  assert.match(ios, /bek-keyboard__key--return">return/);
  assert.match(ios, /bek-keyboard__safe-area/);
  const android = r(h(Keyboard, { platform: 'android', returnLabel: 'Done' }));
  assert.doesNotMatch(android, /__suggestions/);
  assert.match(android, /__key--return">↵/);
  const pad = r(h(Keyboard, { type: 'numeric' }));
  assert.match(pad, /bek-keyboard--numeric/);
  assert.equal(pad.match(/bek-keyboard__key--digit/g).length, 12);
  assert.match(pad, /<small>PQRS<\/small>/);
});

test('AppShell: drawer slot renders after bottom navigation', () => {
  const html = r(
    h(
      AppShell,
      {
        header: h('header', null, 'H'),
        bottomNav: h('nav', null, 'B'),
        drawer: h('aside', null, 'D'),
      },
      'content',
    ),
  );
  assert.ok(html.indexOf('<nav>B</nav>') < html.indexOf('<aside>D</aside>'));
  assert.match(html, /bek-app-shell__content">content/);
});

test('Mascot: sprite cell per pose, size classes, label vs decorative', () => {
  const sheets = { directions: '/m/panda-directions.webp', reactions: '/m/panda-reactions.webp' };
  const idle = r(h(Mascot, sheets));
  assert.match(idle, /^<span aria-hidden="true" class="bek-mascot bek-mascot--l bek-mascot--idle"/);
  assert.match(idle, /panda-directions\.webp/);
  assert.match(idle, /background-position:50% 50%/);
  // bundler'siz Node'da standart varaq file: bo'ladi → rasm yo'q, lekin markup buzilmaydi
  assert.doesNotMatch(r(h(Mascot)), /file:/);
  const dizzy = r(h(Mascot, { ...sheets, pose: 'dizzy', size: 'xs', label: 'BEK panda' }));
  assert.match(
    dizzy,
    /role="img" aria-label="BEK panda" class="bek-mascot bek-mascot--xs bek-mascot--dizzy"/,
  );
  assert.match(dizzy, /panda-reactions\.webp/);
  assert.match(dizzy, /background-position:50% 100%/);
  assert.match(
    r(h(Mascot, { pose: 'look-up-left', directions: '/d.webp' })),
    /url\(&quot;\/d\.webp&quot;\).*background-position:0% 0%/,
  );
});

test('MascotMessage: layout, nested mascot, action button', () => {
  const html = r(
    h(MascotMessage, {
      title: 'No courses yet',
      description: 'Add your first course.',
      action: { label: 'Add course' },
    }),
  );
  assert.match(html, /^<div class="bek-mascot-message bek-mascot-message--stacked">/);
  assert.match(html, /bek-mascot--l bek-mascot--sleepy/);
  assert.doesNotMatch(html, /file:/);
  assert.match(html, /bek-mascot-message__title">No courses yet/);
  assert.match(html, /bek-mascot-message__description">Add your first course\./);
  assert.match(html, /bek-button--action[^>]*>.*Add course/);
  const inline = r(h(MascotMessage, { layout: 'inline', pose: 'love', size: 'm', title: 'T' }));
  assert.match(inline, /bek-mascot-message--inline/);
  assert.match(inline, /bek-mascot--m bek-mascot--love/);
  assert.doesNotMatch(inline, /__description|bek-button/);
});
