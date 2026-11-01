#!/usr/bin/env node
// Figma ↔ kod auditi, 2-qadam (kod tomoni).
// `.claude/skills/figma-component/scripts/figma-audit.js` (use_figma) chiqargan qatorlarni bitta faylga yig'ing va:
//   node scripts/figma-audit.mjs audit.txt          — hisobot, farq bo'lsa exit 1
//   node scripts/figma-audit.mjs audit.txt --json   — mashina uchun
// Tekshiradi: (1) Figma'dagi har set kodda bormi (figma.json `id`), (2) kodda bor spec Figma'da hali bormi,
// (3) prop/variant/token/o'lcham/nested xeshlari spec bilan bir xilmi, (4) Variables va uslublar `@bek-ui/tokens` bilan.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const PACKAGES = ['react', 'charts', 'backgrounds'];
const TOKEN_FILES = ['color', 'typography', 'palette', 'typography-primitives', 'dimension'];

// Kodga ataylab kirmaydigan Figma set'lari (docs/figma-discrepancies.md). Faqat kodda spec'i yo'q set'larga qo'llanadi.
const IGNORE = [
  { page: /^2\.1 /, reason: 'Icons — Hugeicons Pro litsenziyasi' },
  { page: /^2\.4 /, reason: '3D objects — renderlar' },
  { page: /^9\.2 /, reason: 'Cursor — Figma prototip yordamchisi' },
  { page: /^10\.1 /, reason: 'Devices — Figma mockup ramkalari' },
  { page: /^1\.6 /, name: /^Reach zone$/, reason: 'hujjat diagrammasi' },
  { name: /^Doc\//, reason: 'Doc kit — 📘 hujjat freymlari' },
  {
    name: /^_(Focus ring|Avatar image|Slot|Measure|Page header)/,
    reason: "yordamchi: fokus — styles/focus.css, slot — children, o'lchov/sarlavha — hujjat",
  },
  { page: /^10\.3 /, reason: 'iOS/Android klaviatura ichki qismlari — kodda Keyboard mockup' },
  {
    page: /^(7\.10|7\.11|10\.2) /,
    name: /iPhone|Android/,
    reason: 'native iOS/Android manba instance — `Platform` varianti ichida',
  },
];

const h = (s) => {
  let x = 5381;
  for (let i = 0; i < s.length; i++) x = ((x * 33) ^ s.charCodeAt(i)) >>> 0;
  return x.toString(36);
};
const propsHash = (props = {}) =>
  h(
    JSON.stringify(
      Object.keys(props)
        .sort()
        .map((k) => [k, Array.isArray(props[k]) ? props[k].slice().sort() : props[k].type]),
    ),
  );

function readSpecs() {
  const specs = new Map();
  for (const pkg of PACKAGES) {
    const base = join(ROOT, 'packages', pkg, 'src/components');
    if (!existsSync(base)) continue;
    for (const dir of readdirSync(base)) {
      const file = join(base, dir, 'figma.json');
      if (!existsSync(file)) continue;
      const spec = JSON.parse(readFileSync(file, 'utf8'));
      for (const c of spec.components || [])
        specs.set(c.id, {
          where: `${pkg}/${dir}`,
          page: c.page || spec.page,
          name: c.name,
          variants: c.variants,
          props: propsHash(c.props),
          tokens: h(JSON.stringify(c.tokens)),
          sizes: h(JSON.stringify(c.sizes)),
          rawColors: h(JSON.stringify(c.rawColors)),
          nested: h(JSON.stringify(c.nested)),
        });
    }
  }
  return specs;
}

function readTokens() {
  const out = new Map();
  for (const f of TOKEN_FILES) {
    const j = JSON.parse(readFileSync(join(ROOT, 'packages/tokens/figma', `${f}.json`), 'utf8'));
    const enc = (v) => (v && typeof v === 'object' ? v.$alias : String(v));
    const lines = j.variables
      .map(
        (v) =>
          `${v.name}=${j.modes.map((m) => enc(v.values[m])).join(';')}|${v.codeSyntax?.WEB || ''}`,
      )
      .sort();
    const name = j.collection.name || j.collection;
    out.set(name, {
      n: j.variables.length,
      names: h(
        j.variables
          .map((v) => v.name)
          .sort()
          .join('|'),
      ),
      full: h(lines.join('\n')),
    });
  }
  const s = JSON.parse(readFileSync(join(ROOT, 'packages/tokens/figma/styles.json'), 'utf8'));
  out.set('#styles', {
    text: s.textStyles.length,
    effect: s.effectStyles.length,
    textNames: h(
      s.textStyles
        .map((t) => t.name)
        .sort()
        .join('|'),
    ),
    effectNames: h(
      s.effectStyles
        .map((t) => t.name)
        .sort()
        .join('|'),
    ),
    textFull: h(
      s.textStyles
        .map((t) => `${t.name}:${t.fontSize}/${t.lineHeight ?? 'auto'}/${t.fontStyle}`)
        .sort()
        .join('\n'),
    ),
  });
  return out;
}

const [file, ...flags] = process.argv.slice(2);
if (!file) {
  console.error('Foydalanish: node scripts/figma-audit.mjs <audit.txt> [--json]');
  process.exit(2);
}
const lines = readFileSync(file, 'utf8')
  .split(/\r?\n/)
  .map((l) => l.trim())
  .filter((l) => /^[CVSE]\|/.test(l));

const specs = readSpecs();
const tokens = readTokens();
const report = { missing: [], ignored: [], drift: [], stale: [], tokens: [], errors: [] };
const seen = new Set();
let figmaSets = 0;

for (const line of lines) {
  const f = line.split('|');
  if (f[0] === 'E') {
    report.errors.push(`${f[1]}: ${f[2]}`);
  } else if (f[0] === 'C') {
    const [, id, page, name, variants, props, tok, sizes, raw, nested] = f;
    figmaSets++;
    seen.add(id);
    const spec = specs.get(id);
    if (!spec) {
      const rule = IGNORE.find(
        (r) => (!r.page || r.page.test(page)) && (!r.name || r.name.test(name)),
      );
      if (rule) report.ignored.push({ id, page, name, reason: rule.reason });
      else report.missing.push({ id, page, name });
      continue;
    }
    const diff = [];
    if (Number(variants) !== spec.variants) diff.push(`variantlar ${spec.variants}→${variants}`);
    if (props !== spec.props) diff.push("prop'lar");
    if (tok !== spec.tokens) diff.push('tokenlar');
    if (sizes !== spec.sizes) diff.push("o'lchamlar");
    if (raw !== spec.rawColors) diff.push('tokensiz ranglar');
    if (nested !== spec.nested) diff.push('ichki komponentlar');
    if (diff.length) report.drift.push({ id, page, name, where: spec.where, diff });
  } else if (f[0] === 'V') {
    const [, name, n, names, full] = f;
    const t = tokens.get(name);
    if (!t) report.tokens.push(`${name}: kolleksiya @bek-ui/tokens da yo'q`);
    else if (names !== t.names) report.tokens.push(`${name}: token nomlari (${t.n}→${n})`);
    else if (full !== t.full) report.tokens.push(`${name}: qiymatlar yoki codeSyntax o'zgargan`);
  } else if (f[0] === 'S') {
    const [, text, effect, , textNames, effectNames, textFull] = f;
    const t = tokens.get('#styles');
    if (textNames !== t.textNames) report.tokens.push(`matn uslublari nomlari (${t.text}→${text})`);
    else if (textFull !== t.textFull) report.tokens.push("matn uslublari qiymatlari o'zgargan");
    if (effectNames !== t.effectNames)
      report.tokens.push(`effekt uslublari nomlari (${t.effect}→${effect})`);
  }
}

// Kodda spec bor, lekin Figma'dan o'chirilgan — faqat audit o'sha sahifani qamragan bo'lsa.
const auditedPages = new Set(lines.filter((l) => l.startsWith('C|')).map((l) => l.split('|')[2]));
for (const [id, s] of specs)
  if (!seen.has(id) && auditedPages.has(s.page))
    report.stale.push({ id, name: s.name, where: s.where, page: s.page });

if (flags.includes('--json')) {
  console.log(JSON.stringify({ figmaSets, codeSpecs: specs.size, ...report }, null, 2));
} else {
  const covered = figmaSets - report.missing.length - report.ignored.length;
  console.log(
    `Figma: ${figmaSets} set · kodda: ${covered} · ataylab yo'q: ${report.ignored.length} · yetishmaydi: ${report.missing.length}`,
  );
  for (const m of report.missing) console.log(`  ✗ kodda yo'q   ${m.page} → ${m.name} (${m.id})`);
  for (const d of report.drift)
    console.log(`  ~ spec eskirgan ${d.where} · ${d.name} (${d.id}): ${d.diff.join(', ')}`);
  for (const s of report.stale)
    console.log(`  ? Figma'da yo'q ${s.where} · ${s.name} (${s.id}, ${s.page})`);
  for (const t of report.tokens) console.log(`  ~ tokenlar     ${t}`);
  for (const e of report.errors) console.log(`  ! xato         ${e}`);
  if (flags.includes('--verbose'))
    for (const i of report.ignored)
      console.log(`  · ataylab      ${i.page} → ${i.name}: ${i.reason}`);
  const clean =
    !report.missing.length &&
    !report.drift.length &&
    !report.stale.length &&
    !report.tokens.length &&
    !report.errors.length;
  console.log(clean ? '✓ Figma va kod bir xil' : '→ /figma-sync yoki /new-component bilan yoping');
}
const dirty =
  report.missing.length ||
  report.drift.length ||
  report.stale.length ||
  report.tokens.length ||
  report.errors.length;
process.exit(dirty ? 1 : 0);
