import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

// React Server Components (Next.js App Router): a component that calls hooks or passes its own
// function to a DOM event prop must start with the 'use client' directive, otherwise it fails
// when rendered from a Server Component ("Event handlers cannot be passed to Client Component props").
const dist = new URL('../dist/components/', import.meta.url).pathname;
const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (name.endsWith('.js') && name !== 'index.js') files.push(p);
  }
})(dist);

const needsClient = (src) => {
  if (/\buse[A-Z][A-Za-z]*\(/.test(src)) return true;
  for (const m of src.matchAll(/\bon[A-Z][A-Za-z]*: ([^,}\n]+)/g)) {
    const v = m[1].trim();
    if (/=>|^function/.test(v)) return true;
    if (/^[a-z][A-Za-z0-9]*$/.test(v) && new RegExp(`(const|function)\\s+${v}\\b`).test(src))
      return true;
  }
  return false;
};

test("interactive components declare 'use client'", () => {
  const missing = files
    .filter((f) => needsClient(readFileSync(f, 'utf8')))
    .filter((f) => !/^["']use client["'];/.test(readFileSync(f, 'utf8')))
    .map((f) => f.slice(dist.length));
  assert.deepEqual(missing, []);
});

test('Button keeps the directive after build', () => {
  const src = readFileSync(join(dist, 'button/Button.js'), 'utf8');
  assert.match(src, /^["']use client["'];/);
});
