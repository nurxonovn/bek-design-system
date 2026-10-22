import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  Aurora,
  DEFAULT_FPS,
  DotField,
  GrainGradient,
  MAX_DPR,
  MatrixRain,
  useBackgroundCanvas,
} from '../dist/index.js';
import { cssColor, parseColor, rgba } from '../dist/core/color.js';
import { createRandom } from '../dist/core/random.js';

const render = (el) => renderToStaticMarkup(el);
const attr = (html, name) => html.match(new RegExp(`${name}="([^"]*)"`))?.[1];

test('every background is a decorative <canvas> (BGR-01) and renders on the server', () => {
  for (const C of [MatrixRain, DotField, GrainGradient, Aurora]) {
    const html = render(h(C));
    assert.match(html, /^<canvas [^>]*><\/canvas>$/);
    assert.equal(attr(html, 'aria-hidden'), 'true');
    assert.match(attr(html, 'class'), /\bbek-background\b/);
    assert.equal(attr(html, 'data-intensity'), 'default');
    assert.equal(attr(html, 'data-tone'), 'neutral');
    assert.doesNotMatch(html, / width=| height=/);
  }
});

test('aria-hidden cannot be overridden; className, id and style pass through', () => {
  const html = render(
    h(DotField, { 'aria-hidden': false, className: 'hero-bg', id: 'bg', style: { zIndex: 0 } }),
  );
  assert.equal(attr(html, 'aria-hidden'), 'true');
  assert.match(attr(html, 'class'), /\bhero-bg\b/);
  assert.equal(attr(html, 'id'), 'bg');
  assert.match(attr(html, 'style'), /z-index:0/);
});

test('MatrixRain: tone · intensity → classes and data attributes', () => {
  const html = render(h(MatrixRain, { tone: 'classic', intensity: 'intense', charset: 'digits' }));
  const cls = attr(html, 'class');
  assert.match(cls, /\bbek-matrix-rain\b/);
  assert.match(cls, /\bbek-matrix-rain--classic\b/);
  assert.match(cls, /\bbek-matrix-rain--intense\b/);
  assert.equal(attr(html, 'data-tone'), 'classic');
  assert.equal(attr(html, 'data-intensity'), 'intense');
  assert.match(render(h(MatrixRain, { tone: 'brand' })), /bek-matrix-rain--brand/);
});

test('MatrixRain: color / highlightColor → token custom properties', () => {
  const style = attr(
    render(h(MatrixRain, { color: 'accent/default', highlightColor: '--bek-text-primary' })),
    'style',
  );
  assert.match(style, /--bek-matrix-rain-head:var\(--bek-accent-default\)/);
  assert.match(style, /--bek-matrix-rain-highlight:var\(--bek-text-primary\)/);
  assert.equal(attr(render(h(MatrixRain)), 'style'), undefined);
});

test('DotField: tone · intensity → classes', () => {
  const cls = attr(render(h(DotField, { tone: 'brand', intensity: 'subtle' })), 'class');
  assert.match(cls, /\bbek-dot-field--brand\b/);
  assert.match(cls, /\bbek-dot-field--subtle\b/);
});

test('GrainGradient: blobs → --bek-grain-gradient-blob-N variables', () => {
  const html = render(
    h(GrainGradient, { tone: 'brand', intensity: 'intense', blobs: ['accent/soft', '#ff0000'] }),
  );
  assert.match(attr(html, 'class'), /\bbek-grain-gradient--brand\b/);
  assert.match(attr(html, 'class'), /\bbek-grain-gradient--intense\b/);
  const style = attr(html, 'style');
  assert.match(style, /--bek-grain-gradient-blob-1:var\(--bek-accent-soft\)/);
  assert.match(style, /--bek-grain-gradient-blob-2:#ff0000/);
});

test('Aurora: tone · intensity · position → classes and data-position', () => {
  const html = render(h(Aurora, { tone: 'brand', intensity: 'subtle', position: 'center' }));
  assert.match(attr(html, 'class'), /\bbek-aurora--brand\b/);
  assert.match(attr(html, 'class'), /\bbek-aurora--subtle\b/);
  assert.equal(attr(html, 'data-position'), 'center');
  assert.equal(attr(render(h(Aurora)), 'data-position'), 'top');
  assert.equal(attr(render(h(Aurora, { position: 'bottom' })), 'data-position'), 'top');
});

test('BGR-04 limits: 30 fps default, devicePixelRatio ≤ 2', () => {
  assert.equal(DEFAULT_FPS, 30);
  assert.equal(MAX_DPR, 2);
  assert.equal(typeof useBackgroundCanvas, 'function');
});

test('cssColor: Figma token name → CSS variable', () => {
  assert.equal(cssColor('accent/default'), 'var(--bek-accent-default)');
  assert.equal(cssColor('effect/matrix/head'), 'var(--bek-effect-matrix-head)');
  assert.equal(cssColor('--bek-bg-base'), 'var(--bek-bg-base)');
  assert.equal(cssColor('#3e63dd'), '#3e63dd');
});

test('parseColor / rgba: token hex values (with alpha) → rgba()', () => {
  assert.deepEqual(parseColor('#3e63dd'), { r: 62, g: 99, b: 221, a: 1 });
  assert.equal(rgba(parseColor(' #0a0a0a2a ')), 'rgba(10,10,10,0.1647)');
  assert.equal(rgba(parseColor('rgb(255 0 0 / 50%)'), 0.5), 'rgba(255,0,0,0.25)');
  assert.equal(parseColor(''), null);
});

test('seeded random is deterministic (stable reduced-motion frame)', () => {
  const a = createRandom(3);
  const b = createRandom(3);
  const xs = [a(), a(), a()];
  assert.deepEqual(xs, [b(), b(), b()]);
  assert.ok(xs.every((x) => x >= 0 && x < 1));
});
