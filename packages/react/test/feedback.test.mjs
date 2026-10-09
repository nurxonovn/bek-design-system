import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  Alert,
  Button,
  EmptyState,
  InfoWrap,
  Loader,
  NotificationBar,
  PullToRefresh,
  Skeleton,
  Toast,
  ToastViewport,
  Tooltip,
  TooltipCallout,
} from '../dist/index.js';

const r = (el) => renderToStaticMarkup(el);

test('Toast: role follows tone, close and action buttons', () => {
  const ok = r(h(Toast, { tone: 'success', title: 'Saved' }));
  assert.match(ok, /^<div role="status" class="bek-toast bek-toast--solid bek-toast--success">/);
  assert.match(ok, /<svg viewBox="0 0 20 20"/);
  const err = r(
    h(Toast, {
      tone: 'danger',
      variant: 'subtle',
      title: 'Failed',
      description: 'Try again',
      action: { label: 'Retry' },
      onClose: () => {},
      icon: null,
    }),
  );
  assert.match(err, /role="alert"/);
  assert.doesNotMatch(err, /bek-toast__icon/);
  assert.match(err, /bek-toast__description">Try again/);
  assert.match(err, /aria-label="Close"/);
  assert.match(r(h(Toast, { title: 'x' })), /bek-toast__icon bek-toast__icon--lg/);
  assert.match(
    r(h(ToastViewport, { placement: 'top-end' })),
    /class="bek-toast-viewport bek-toast-viewport--top-end"/,
  );
});

test('Alert: classes, stroke icon and button variants per variant/tone', () => {
  const subtle = r(
    h(
      Alert,
      {
        tone: 'danger',
        title: 'Payment failed',
        primaryAction: { label: 'Retry' },
        secondaryAction: { label: 'Later' },
      },
      'Declined',
    ),
  );
  assert.match(subtle, /class="bek-alert bek-alert--subtle bek-alert--danger bek-alert--inline"/);
  assert.match(subtle, /bek-button--danger/);
  assert.match(subtle, /bek-button--flat /);
  assert.ok(subtle.indexOf('Later') < subtle.indexOf('Retry'));
  const solid = r(
    h(Alert, { variant: 'solid', tone: 'info', layout: 'stacked', primaryAction: { label: 'Go' } }),
  );
  assert.match(solid, /role="status"/);
  assert.match(solid, /bek-alert--stacked/);
  assert.match(solid, /bek-button--normal-contrast/);
  assert.match(
    r(h(Alert, { tone: 'success', primaryAction: { label: 'Go' } })),
    /bek-button--action/,
  );
});

test('NotificationBar is always dark and InfoWrap renders title + info button', () => {
  const bar = r(h(NotificationBar, { tone: 'danger', action: { label: 'Undo' } }, 'Moved'));
  assert.match(bar, /role="status" data-theme="dark"/);
  assert.match(bar, /bek-notification-bar--danger/);
  const info = r(h(InfoWrap, { emphasis: true, title: 'Free', onInfo: () => {} }, 'From 200k'));
  assert.match(info, /bek-info-wrap bek-info-wrap--emphasis/);
  assert.match(info, /bek-info-wrap__title">Free/);
  assert.match(info, /aria-label="More info"/);
  assert.doesNotMatch(r(h(InfoWrap, null, 'x')), /<button/);
});

test('Tooltip: hidden by default and linked to the trigger via aria-describedby', () => {
  const html = r(
    h(
      Tooltip,
      { content: 'Share', placement: 'bottom', variant: 'light' },
      h(Button, { 'aria-describedby': 'hint' }, 'S'),
    ),
  );
  const id = html.match(/role="tooltip" hidden="" id="([^"]+)"|id="([^"]+)" role="tooltip"/);
  assert.ok(id, html);
  const tid = id[1] ?? id[2];
  assert.match(html, new RegExp(`aria-describedby="hint ${tid}"`));
  assert.match(html, /bek-tooltip--light bek-tooltip--bottom bek-tooltip--arrow/);
  assert.match(html, /hidden=""/);
});

test('TooltipCallout: dark theme, tip class and action', () => {
  const html = r(
    h(TooltipCallout, { tip: 'top-right', size: 's', action: { label: 'Got it' } }, 'Hint'),
  );
  assert.match(html, /data-theme="dark"/);
  assert.match(html, /bek-tooltip-callout--s bek-tooltip-callout--top-right/);
  assert.match(html, />Got it<\/button>/);
});

test('EmptyState: button sizes follow the variant size', () => {
  const s = r(h(EmptyState, { size: 's', title: 'Empty', primaryAction: { label: 'Add' } }));
  assert.match(s, /bek-button--action bek-button--m/);
  const l = r(
    h(EmptyState, {
      size: 'l',
      title: 'Empty',
      description: 'Nothing',
      primaryAction: { label: 'Add' },
      secondaryAction: { label: 'More' },
    }),
  );
  assert.match(l, /bek-button--action bek-button--l/);
  assert.match(l, /bek-button--outline bek-button--l/);
  assert.doesNotMatch(r(h(EmptyState, { title: 'x' })), /__actions|__media/);
});

test('Loader: indeterminate status vs determinate progressbar', () => {
  const spin = r(h(Loader));
  assert.match(spin, /role="status" aria-label="Loading"/);
  assert.match(spin, /bek-loader--24 bek-loader--default bek-loader--spin/);
  const det = r(h(Loader, { value: 0.5, size: 40, tone: 'on-color' }));
  assert.match(det, /role="progressbar"/);
  assert.match(det, /aria-valuenow="50"/);
  assert.doesNotMatch(det, /--spin/);
  assert.match(r(h(Loader, { label: null })), /aria-hidden="true"/);
});

test('PullToRefresh: labels per state; only refreshing spins', () => {
  assert.match(r(h(PullToRefresh)), /Pull to refresh/);
  const ref = r(h(PullToRefresh, { state: 'refreshing' }));
  assert.match(ref, /Refreshing…/);
  assert.match(ref, /bek-loader--spin/);
  assert.match(
    r(h(PullToRefresh, { state: 'release', labels: { release: 'Qo‘yib yuboring' } })),
    /Qo‘yib yuboring/,
  );
});

test('Skeleton: hidden from AT, bones per shape', () => {
  const text = r(h(Skeleton, { lines: 2 }));
  assert.match(text, /^<div aria-hidden="true" class="bek-skeleton bek-skeleton--text">/);
  assert.equal(text.match(/bek-skeleton__bone/g).length, 2);
  assert.equal(r(h(Skeleton, { shape: 'card' })).match(/bek-skeleton__bone/g).length, 5);
  assert.match(
    r(h(Skeleton, { shape: 'list-row' })),
    /bek-skeleton__avatar.*bek-skeleton__trailing/,
  );
});
