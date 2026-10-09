import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Button } from '../dist/index.js';

const r = (props, text = 'Save') => renderToStaticMarkup(h(Button, props, text));

test('defaults: normal · m, type=button, focus ring', () => {
  assert.equal(
    r({}),
    '<button type="button" class="bek-button bek-focus-ring bek-button--normal bek-button--m"><span class="bek-button__label">Save</span></button>',
  );
});

test('start and end icons around the label', () => {
  const html = r({
    variant: 'action',
    size: 'xl',
    startIcon: h('svg', { id: 's' }),
    endIcon: h('svg', { id: 'e' }),
  });
  assert.match(html, /bek-button--action bek-button--xl/);
  assert.ok(html.indexOf('id="s"') < html.indexOf('Save'));
  assert.ok(html.indexOf('Save') < html.indexOf('id="e"'));
});

test('loading: spinner replaces start icon, busy and aria-disabled, keeps colours', () => {
  const html = r({ loading: true, startIcon: h('svg', { id: 's' }), size: '2xl' });
  assert.doesNotMatch(html, /id="s"/);
  assert.match(html, /aria-busy="true" aria-disabled="true"/);
  assert.match(html, /bek-spinner bek-spinner--24/);
  assert.doesNotMatch(html, / disabled=""/);
});

test('pressed toggles aria-pressed; iconOnly keeps an accessible name', () => {
  assert.match(r({ pressed: true }), /aria-pressed="true"/);
  assert.match(r({ pressed: false }), /aria-pressed="false"/);
  const html = r({ iconOnly: true, startIcon: h('svg'), endIcon: h('svg', { id: 'e' }) }, 'Close');
  assert.match(html, /bek-button--icon-only/);
  assert.match(html, /<span class="bek-visually-hidden">Close<\/span>/);
  assert.doesNotMatch(html, /id="e"/);
});

test('native props pass through (disabled, type, aria-label)', () => {
  const html = r({ disabled: true, type: 'submit', 'aria-label': 'Send' });
  assert.match(html, /type="submit"/);
  assert.match(html, /disabled=""/);
  assert.match(html, /aria-label="Send"/);
});
