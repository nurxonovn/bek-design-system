#!/usr/bin/env node
// Figma ↔ kod muvofiqligi tekshiruvi. Har komponentning `figma.json` spetsifikatsiyasi
// (.claude/skills/figma-component/scripts/figma-extract.js bilan olinadi) kod bilan solishtiriladi.
//
//   node scripts/check-figma.mjs [nom ...] [--strict] [--json]
//   node scripts/check-figma.mjs --hook        # Claude Code PostToolUse: stdin'dagi fayl yo'lidan komponentni topadi
//
// Xato (E) — tuzilma: fayllar, export, README, test, CSS'da qattiq rang. Ogohlantirish (W) — Figma bilan farq:
// token, matn uslubi, variant, px. `--strict` ogohlantirishni ham xatoga aylantiradi (yangi komponent uchun).
// Ataylab qilingan farq figma.json → "accepted": [{ "rule", "match", "reason" }] bilan yopiladi.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const REPO = join(ROOT, '..', '..');
const TOKENS = join(REPO, 'packages/tokens/figma');
const COMPONENTS = join(ROOT, 'src/components');
const STYLES = join(ROOT, 'src/styles');

const args = process.argv.slice(2);
const flag = (f) => args.includes(f);
const names = args.filter((a) => !a.startsWith('--'));

const read = (p) => (existsSync(p) ? readFileSync(p, 'utf8') : '');
const json = (p) => JSON.parse(readFileSync(p, 'utf8'));
const cssVar = (codeSyntax) => codeSyntax?.WEB?.match(/--bek-[a-z0-9-]+/)?.[0] ?? null;

// Figma nomi → CSS o'zgaruvchisi (codeSyntax.WEB dan).
const varMap = new Map();
for (const file of ['color.json', 'dimension.json', 'typography.json']) {
  for (const v of json(join(TOKENS, file)).variables) {
    const css = cssVar(v.codeSyntax);
    if (css) varMap.set(v.name, css);
  }
}
const colorVars = new Set(
  json(join(TOKENS, 'color.json'))
    .variables.map((v) => cssVar(v.codeSyntax))
    .filter(Boolean),
);
const textStyleVar = new Map();
for (const s of json(join(TOKENS, 'styles.json')).textStyles) {
  const sizeVar = s.boundVariables?.fontSize ? varMap.get(s.boundVariables.fontSize) : null;
  if (sizeVar) textStyleVar.set(s.name, sizeVar);
}
const effectRef = (name) => {
  const m = name.match(/^Elevation\/(\w+)/);
  if (m) return `--bek-elevation-${m[1].toLowerCase()}`;
  const g = name.match(/^Glass\/(\w+)/);
  if (g) return `bek-glass-${g[1].toLowerCase()}`;
  return null;
};

// Umumiy uslublar (tone.css, field.css …): komponent ulardagi o'zgaruvchini ishlatsa, pool'ga qo'shiladi.
const shared = readdirSync(STYLES)
  .filter((f) => f.endsWith('.css'))
  .map((f) => {
    const css = read(join(STYLES, f));
    return {
      file: f,
      css,
      defines: [...new Set(css.match(/--bek-[a-z0-9-]+(?=\s*:)/g) || [])],
      classes: [...new Set(css.match(/\.bek-[a-z0-9-]+/g) || [])].map((c) => c.slice(1)),
    };
  });

// Figma matn uslubi (Label/M, Body/M Strong) → tokens/typography.css klassi (.bek-text-label-m, .bek-text-body-m-strong)
const textStyleClass = (name) => 'bek-text-' + name.toLowerCase().replace(/[\s/]+/g, '-');
// Butun tizimga xos holat tokenlari: Figma varianti qamrab olmasa ham kodda bo'lishi tabiiy.
const COMMON_STATE_VARS =
  /^--bek-(border-focus|(text|fill|bg|border)-disabled|text-on-color(-\w+)?)$/;
const semanticKey = (v) =>
  v.match(
    /(success|warning|danger|info|utility|accent|inverse|primary|secondary|tertiary|soft|strong)/,
  )?.[1];
// Komponent to'plami o'ramining foni — komponentning o'zi emas.
const WRAPPER_TOKENS = new Set(['--bek-bg-sheet']);
// Demo/joylashuv prop'lari (Item 1…8, Show tab 4, Text configurations, Items=3) kodda children orqali hal qilinadi.
const isSlotProp = (p) =>
  /\d\s*$/.test(p) ||
  /^↳/.test(p) ||
  /^(Text configurations|Items|Lines|Value|Device|Columns|Rows)$/i.test(p);

const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');
const norm = (s) =>
  String(s)
    .toLowerCase()
    .replace(/[\s·–—/]+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
const camel = (s) =>
  s
    .replace(/^show\s+/i, '')
    .split(/[\s-]+/)
    .map((w, i) => (i ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w.toLowerCase()))
    .join('');
const SKIP_OPTIONS = new Set([
  'default',
  'none',
  'enabled',
  'off',
  'on',
  'true',
  'false',
  'yes',
  'no',
  'ltr',
  'rtl',
]);
const SKIP_PROPS = new Set(['State', 'Direction', 'Scrolled']);
const wordRe = (w) => new RegExp(`(^|[^a-z0-9])${w.replace(/[-]/g, '[-_ ]?')}([^a-z0-9]|$)`, 'i');
// "Cancel button", "Show leading icon" → har bir so'z (≥3 harf) TSX/README'da uchrasa, slot kodda bor deb olinadi.
const wordsCovered = (prop, docs) => {
  const words = prop
    .toLowerCase()
    .replace(/^show\s+/, '')
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 2);
  return words.length > 0 && words.every((w) => new RegExp(`(^|[^a-z])${w}`, 'i').test(docs));
};
const BOOL_OPTIONS = new Set(['on', 'off', 'true', 'false', 'yes', 'no']);

function checkComponent(name) {
  const dir = join(COMPONENTS, name);
  const findings = [];
  const E = (rule, message, subject = '') => findings.push({ level: 'E', rule, message, subject });
  const W = (rule, message, subject = '') => findings.push({ level: 'W', rule, message, subject });

  if (!existsSync(dir))
    return [{ level: 'E', rule: 'missing', message: `src/components/${name} yo'q` }];
  const files = readdirSync(dir);
  const tsx = files
    .filter((f) => f.endsWith('.tsx'))
    .map((f) => read(join(dir, f)))
    .join('\n');
  const cssRaw = files
    .filter((f) => f.endsWith('.css'))
    .map((f) => read(join(dir, f)))
    .join('\n');
  const css = stripComments(cssRaw);
  const readme = read(join(dir, 'README.md'));

  // Umumiy pool: komponent CSS + TSX + ishlatilgan umumiy uslublar (field.css, tone.css, focus.css …)
  const used = new Set(css.match(/--bek-[a-z0-9-]+/g) || []);
  const sharedUsed = shared.filter(
    (s) =>
      s.defines.some((d) => used.has(d)) ||
      s.classes.some(
        (c) => tsx.includes(`'${c}`) || tsx.includes(`"${c}`) || tsx.includes(` ${c}`),
      ),
  );
  let pool = css + '\n' + tsx;
  for (const s of sharedUsed) pool += '\n' + s.css;

  // 1. Tuzilma
  for (const [label, ok] of [
    ['.tsx', tsx.length > 0],
    ['.css', cssRaw.length > 0 || sharedUsed.length > 0],
    ['index.ts', files.includes('index.ts')],
    ['README.md', readme.length > 0],
    ['figma.json', files.includes('figma.json')],
  ])
    if (!ok) E('files', `${label} fayli yo'q`, label);

  const indexSrc = read(join(ROOT, 'src/index.ts'));
  if (!indexSrc.includes(`./components/${name}/index.js`))
    E('export', `src/index.ts da export yo'q`);
  if (!read(join(ROOT, 'README.md')).includes(`src/components/${name}/README.md`))
    E('readme-table', `packages/react/README.md jadvalida yo'q`);

  const exportsNames = [...read(join(dir, 'index.ts')).matchAll(/export\s*\{([^}]+)\}/g)]
    .flatMap((m) => m[1].split(','))
    .map((s) =>
      s
        .trim()
        .split(/\s+as\s+/)
        .pop(),
    )
    .filter((s) => s && !/^type\s/.test(s));
  const testDir = join(ROOT, 'test');
  const tests = existsSync(testDir)
    ? readdirSync(testDir)
        .map((f) => read(join(testDir, f)))
        .join('\n')
    : '';
  if (exportsNames.length && !exportsNames.some((n) => new RegExp(`\\b${n}\\b`).test(tests)))
    E('test', `test/*.test.mjs ichida ${exportsNames[0]} ishlatilmagan`);

  // 2. CSS gigiyenasi
  for (const m of new Set(css.match(/#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?)\([^)]*\)/gi) || []))
    E('css-hex', `qattiq rang: ${m} — token ishlating`, m);

  // 3. Figma spetsifikatsiyasi
  let spec = null;
  if (files.includes('figma.json')) {
    try {
      spec = json(join(dir, 'figma.json'));
    } catch (e) {
      E('spec', `figma.json o'qilmadi: ${e.message}`);
    }
  }
  if (spec && (!Array.isArray(spec.components) || !spec.components.length)) {
    E('spec', 'figma.json: "components" bo\'sh');
    spec = null;
  }
  if (!spec) return findings;

  const accepted = Array.isArray(spec.accepted) ? spec.accepted : [];
  for (const a of accepted)
    if (!a.rule || !String(a.reason || '').trim())
      E('accepted', `accepted yozuvida rule/reason yo'q: ${JSON.stringify(a)}`);

  const pages = [...new Set(spec.components.map((c) => c.page).filter(Boolean))];
  const figmaLine = readme.match(/Figma:\s*\*\*([^*]+)\*\*/);
  const pageNumbers = pages.map((p) => p.match(/^\d+(?:\.\d+)?/)?.[0]).filter(Boolean);
  if (!figmaLine) E('readme-figma', "README.md da `Figma: **…**` qatori yo'q");
  else if (
    pageNumbers.length &&
    !pageNumbers.some((n) => figmaLine[1].includes(n)) &&
    !figmaLine[1].match(/^\d+ /)?.[0]?.startsWith(pageNumbers[0].split('.')[0] + ' ')
  )
    W(
      'readme-figma',
      `README Figma sahifasi "${figmaLine[1].trim()}" spec bilan mos emas (${pages.join(', ')})`,
    );

  const specColorVars = new Set();
  const specText = new Set();
  const specEffects = new Set();
  const sizes = new Set();
  for (const c of spec.components) {
    for (const t of c.tokens?.color || []) {
      const v = varMap.get(t);
      if (v) specColorVars.add(v);
      else W('token-unmapped', `${c.name}: "${t}" tokenida codeSyntax yo'q (Figma Variables)`, t);
    }
    for (const t of c.tokens?.text || []) specText.add(t);
    for (const t of c.tokens?.effect || []) specEffects.add(t);
    for (const n of c.sizes || []) sizes.add(n);
    for (const raw of c.rawColors || [])
      W('figma-raw-color', `${c.name}: Figma'da tokensiz rang ${raw}`, raw);
  }
  for (const v of specColorVars)
    if (!WRAPPER_TOKENS.has(v) && !pool.includes(v))
      W('token-missing', `Figma ${v} ishlatadi, CSS'da yo'q`, v);
  const specKeys = new Set([...specColorVars].map(semanticKey).filter(Boolean));
  for (const v of used) {
    if (!colorVars.has(v) || specColorVars.has(v) || COMMON_STATE_VARS.test(v)) continue;
    const base = v.replace(/-(hover|pressed|active)$/, '');
    if (specColorVars.has(base)) continue; // Figma'da asosiy holat bor, kod hover/pressed'ni qo'shgan
    const key = semanticKey(v);
    if (key && specKeys.has(key)) continue; // bir xil semantik oila (status/success → text/success)
    W('token-extra', `CSS ${v} ishlatadi, Figma spec'da yo'q`, v);
  }
  for (const t of specText) {
    const v = textStyleVar.get(t);
    const family = v?.replace(/-size$/, '-');
    if (v && !pool.includes(family) && !pool.includes(textStyleClass(t)))
      W(
        'text-style-missing',
        `Figma matn uslubi ${t} → ${v} yoki .${textStyleClass(t)} kodda yo'q`,
        t,
      );
  }
  for (const t of specEffects) {
    const ref = effectRef(t);
    if (ref && !pool.includes(ref))
      W('effect-missing', `Figma effekti ${t} → ${ref} kodda yo'q`, t);
  }

  // px: scale tokeni bor son → token; Figma'da yo'q son → ogohlantirish. @media shartlari va 0/0.5/1 px hisobga olinmaydi.
  const cssNoMedia = css.replace(/@media[^{]+/g, '');
  for (const m of new Set(cssNoMedia.match(/-?\d*\.?\d+px/g) || [])) {
    const n = Math.abs(parseFloat(m));
    if (n === 0 || n === 0.5 || n === 1) continue;
    if (varMap.has(`scale/${n}`)) W('px-token', `${m} → var(${varMap.get(`scale/${n}`)})`, m);
    else if (!sizes.has(n)) W('px-figma', `${m} Figma o'lchamlarida yo'q`, m);
  }

  // Variantlar va prop'lar
  for (const c of spec.components) {
    for (const [prop, def] of Object.entries(c.props || {})) {
      if (SKIP_PROPS.has(prop) || isSlotProp(prop)) continue;
      const docs = tsx + '\n' + readme;
      if (Array.isArray(def)) {
        const opts = def.map(norm);
        if (opts.every((o) => BOOL_OPTIONS.has(o))) {
          const p = camel(prop);
          if (!tsx.includes(p) && !wordRe(p).test(docs) && !wordsCovered(prop, docs))
            W(
              'prop-missing',
              `${c.name}: "${prop}" (On/Off) → \`${p}\` prop'i TSX'da yo'q`,
              `${prop}`,
            );
          continue;
        }
        for (const [i, o] of opts.entries()) {
          if (SKIP_OPTIONS.has(o) || /^\d/.test(o)) continue;
          const bare = o.replace(/\d+/g, '') || o; // S16 → s
          const inTsx =
            tsx.includes(`'${o}'`) ||
            tsx.includes(`"${o}"`) ||
            tsx.includes(`\`${o}\``) ||
            wordRe(o).test(tsx);
          const inCss =
            pool.includes(`--${o}`) ||
            pool.includes(`__${o}`) ||
            pool.includes(`--${bare}`) ||
            wordRe(o).test(css);
          if (!inTsx && !inCss)
            W(
              'variant-missing',
              `${c.name}: ${prop}=${def[i]} kodda yo'q ('${o}')`,
              `${prop}=${def[i]}`,
            );
        }
      } else if (def && def.type === 'BOOLEAN') {
        const p = camel(prop);
        const alt = camel('show ' + prop);
        if (
          !tsx.includes(p) &&
          !tsx.includes(alt) &&
          !tsx.includes(`hide${p[0].toUpperCase()}${p.slice(1)}`) &&
          !wordRe(p).test(docs) &&
          !wordsCovered(prop, docs)
        )
          W('prop-missing', `${c.name}: boolean "${prop}" → \`${p}\` prop'i TSX'da yo'q`, prop);
      }
    }
  }

  // accepted → filtr
  const isAccepted = (f) =>
    accepted.some(
      (a) =>
        a.rule === f.rule &&
        String(a.reason || '').trim() &&
        (!a.match || a.match === f.subject || f.message.includes(a.match)),
    );
  return findings.filter((f) => !isAccepted(f));
}

function format(name, findings) {
  const e = findings.filter((f) => f.level === 'E').length;
  const w = findings.length - e;
  const head = findings.length ? `${name} — ${e} xato, ${w} ogohlantirish` : `${name} ✓`;
  return [head, ...findings.map((f) => `  [${f.level}] ${f.rule}: ${f.message}`)].join('\n');
}

function run(list, { strict = false } = {}) {
  const results = list.map((name) => ({ name, findings: checkComponent(name) }));
  const errors = results.reduce((n, r) => n + r.findings.filter((f) => f.level === 'E').length, 0);
  const warnings = results.reduce(
    (n, r) => n + r.findings.filter((f) => f.level === 'W').length,
    0,
  );
  return { results, errors, warnings, failed: errors > 0 || (strict && warnings > 0) };
}

if (flag('--hook')) {
  let input = '';
  try {
    input = readFileSync(0, 'utf8');
  } catch {}
  const file = (() => {
    try {
      const j = JSON.parse(input);
      return j.tool_input?.file_path || j.tool_response?.filePath || '';
    } catch {
      return '';
    }
  })();
  const rel = file ? relative(COMPONENTS, file) : '';
  const name = rel && !rel.startsWith('..') ? rel.split(sep)[0] : '';
  if (name && existsSync(join(COMPONENTS, name))) {
    const { results } = run([name]);
    const findings = results[0].findings;
    if (findings.length) {
      const text = `figma-component tekshiruvi (${format(name, findings)}). Xatolarni tuzating; Figma bilan ataylab farq bo'lsa figma.json → accepted[] ga sabab bilan yozing. Hammasi: pnpm --filter @bek/react check:figma ${name} --strict`;
      process.stdout.write(
        JSON.stringify({
          hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: text },
        }),
      );
    }
  }
  process.exit(0);
}

const list = names.length
  ? names
  : readdirSync(COMPONENTS).filter((d) => existsSync(join(COMPONENTS, d, 'index.ts')));
const { results, errors, warnings, failed } = run(list, { strict: flag('--strict') });
if (flag('--json')) console.log(JSON.stringify(results, null, 2));
else {
  for (const r of results) console.log(format(r.name, r.findings));
  console.log(
    `\n${list.length} komponent · ${errors} xato · ${warnings} ogohlantirish${flag('--strict') ? ' (strict)' : ''}`,
  );
}
process.exit(failed ? 1 : 0);
