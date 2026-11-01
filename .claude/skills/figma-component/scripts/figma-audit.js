// Figma ↔ kod auditi, 1-qadam (Figma tomoni). use_figma (read-only) ichida ishga tushiring.
// Natija — qatorlar; ularni faylga yig'ib, repo ildizida `node scripts/figma-audit.mjs <fayl>` bilan solishtiring.
//
// INPUT.pages:
//   'list'        — faqat sahifalar ro'yxati (`P|<id>|<nom>`) — keyingi chaqiruvlarni bo'lish uchun.
//   ['10:74', …]  — shu sahifalardagi komponent set'lari va alohida komponentlar (`C|…`).
//                   Bitta chaqiruvga ≈40 set'gacha (4.18 Chart — o'zi alohida chaqiruv).
// INPUT.variables: true — Variables kolleksiyalari (`V|…`) va matn/effekt uslublari (`S|…`).
//
// Qatorlar:
//   C|id|sahifa|nom|variantlar|props#|tokens#|sizes#|rawColors#|nested#
//   V|kolleksiya|soni|nomlar#|qiymatlar#
//   S|matn|effekt|paint|matnNomlari#|effektNomlari#|matnQiymatlari#
// `#` — djb2 xeshi; figma-extract.js bilan bir xil yig'ish (collect), figma.json maydonlari bilan solishtiriladi.
const INPUT = { pages: 'list', variables: false };

const h = (s) => {
  let x = 5381;
  for (let i = 0; i < s.length; i++) x = ((x * 33) ^ s.charCodeAt(i)) >>> 0;
  return x.toString(36);
};
const clean = (s) => s.replace(/\s+/g, ' ').trim().replace(/\|/g, '/');

const varName = async (id) => {
  try {
    const v = await figma.variables.getVariableByIdAsync(id);
    return v ? v.name : null;
  } catch {
    return null;
  }
};
const styleName = async (id) => {
  if (typeof id !== 'string' || !id) return null;
  try {
    const s = await figma.getStyleByIdAsync(id);
    return s ? s.name : null;
  } catch {
    return null;
  }
};
const SIZE_KEYS = [
  'width',
  'height',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'itemSpacing',
  'cornerRadius',
  'topLeftRadius',
  'strokeWeight',
  'minWidth',
  'minHeight',
];
async function instanceOrigin(n) {
  try {
    const mc = await n.getMainComponentAsync();
    if (!mc) return null;
    let p = mc;
    while (p && p.type !== 'PAGE') p = p.parent;
    const set = mc.parent && mc.parent.type === 'COMPONENT_SET' ? mc.parent.name : mc.name;
    return { page: p ? clean(p.name) : '', name: set };
  } catch {
    return null;
  }
}
// figma-extract.js → collect() bilan aynan bir xil: o'zgartirsangiz, ikkalasini birga o'zgartiring.
async function collect(root, pageName) {
  const color = new Set(),
    text = new Set(),
    effect = new Set(),
    dimension = new Set(),
    sizes = new Set(),
    raw = new Set(),
    nested = new Set();
  let count = 0;
  const walk = async (n) => {
    if (count++ > 4000) return;
    if (n.type === 'INSTANCE' && n !== root) {
      const o = await instanceOrigin(n);
      if (o && o.page !== pageName && !/^[_.]/.test(o.name)) {
        nested.add(o.name);
        return;
      }
    }
    const fillSets = [n.fills, n.strokes];
    if (n.type === 'TEXT' && !Array.isArray(n.fills))
      for (const seg of n.getStyledTextSegments(['fills'])) fillSets.push(seg.fills);
    for (const paints of fillSets) {
      if (!Array.isArray(paints)) continue;
      for (const p of paints) {
        if (p.visible === false) continue;
        for (const s of p.gradientStops || []) {
          const sb = s.boundVariables && s.boundVariables.color;
          const nm = sb ? await varName(sb.id) : null;
          if (nm) color.add(nm);
        }
        const b = p.boundVariables && p.boundVariables.color;
        if (b) {
          const nm = await varName(b.id);
          if (nm) color.add(nm);
        } else if (p.type === 'SOLID')
          raw.add(
            '#' +
              [p.color.r, p.color.g, p.color.b]
                .map((x) =>
                  Math.round(x * 255)
                    .toString(16)
                    .padStart(2, '0'),
                )
                .join(''),
          );
      }
    }
    if (n.type === 'TEXT') {
      const ts = await styleName(n.textStyleId);
      if (ts) text.add(ts);
    }
    const es = await styleName(n.effectStyleId);
    if (es) effect.add(es);
    const bv = n.boundVariables || {};
    for (const key of SIZE_KEYS) {
      const b = bv[key];
      if (b && !Array.isArray(b)) {
        const nm = await varName(b.id);
        if (nm) dimension.add(nm);
      }
      const v = n[key];
      if (
        typeof v === 'number' &&
        Number.isFinite(v) &&
        v > 0 &&
        v < 2000 &&
        key !== 'width' &&
        key !== 'height'
      )
        sizes.add(Math.round(v * 2) / 2);
    }
    if (n.type !== 'INSTANCE' && 'children' in n) for (const c of n.children) await walk(c);
    else if (n.type === 'INSTANCE')
      for (const c of n.children || [])
        if (c.type === 'TEXT' || c.type === 'VECTOR' || c.type === 'BOOLEAN_OPERATION')
          await walk(c);
  };
  await walk(root);
  const sort = (s) => [...s].sort();
  return {
    tokens: {
      color: sort(color),
      text: sort(text),
      effect: sort(effect),
      dimension: sort(dimension),
    },
    sizes: [...sizes].sort((a, b) => a - b),
    rawColors: sort(raw),
    nested: sort(nested),
  };
}

// Prop'lar xeshi: nom bo'yicha tartiblangan [nom, VARIANT → tartiblangan qiymatlar | tur].
const propsHash = (node) => {
  const props = {};
  for (const [k, v] of Object.entries(node.componentPropertyDefinitions || {}))
    props[k.split('#')[0]] = v.type === 'VARIANT' ? v.variantOptions : { type: v.type };
  return h(
    JSON.stringify(
      Object.keys(props)
        .sort()
        .map((k) => [k, Array.isArray(props[k]) ? props[k].slice().sort() : props[k].type]),
    ),
  );
};

const out = [];
if (INPUT.pages === 'list') {
  for (const p of figma.root.children) out.push(`P|${p.id}|${clean(p.name)}`);
} else {
  for (const id of INPUT.pages) {
    const page = await figma.getNodeByIdAsync(id);
    if (!page || page.type !== 'PAGE') {
      out.push(`E|${id}|sahifa topilmadi`);
      continue;
    }
    await page.loadAsync();
    const pageName = clean(page.name);
    const nodes = page
      .findAllWithCriteria({ types: ['COMPONENT_SET', 'COMPONENT'] })
      .filter((n) => !(n.type === 'COMPONENT' && n.parent && n.parent.type === 'COMPONENT_SET'));
    for (const node of nodes) {
      const r = await collect(node, pageName);
      out.push(
        [
          'C',
          node.id,
          pageName,
          clean(node.name),
          node.type === 'COMPONENT_SET' ? node.children.length : 1,
          propsHash(node),
          h(JSON.stringify(r.tokens)),
          h(JSON.stringify(r.sizes)),
          h(JSON.stringify(r.rawColors)),
          h(JSON.stringify(r.nested)),
        ].join('|'),
      );
    }
  }
}

if (INPUT.variables) {
  const hx = (n) =>
    Math.round(n * 255)
      .toString(16)
      .padStart(2, '0');
  const cols = await figma.variables.getLocalVariableCollectionsAsync();
  const colName = Object.fromEntries(cols.map((c) => [c.id, c.name]));
  const all = await figma.variables.getLocalVariablesAsync();
  const byId = Object.fromEntries(all.map((v) => [v.id, v]));
  // packages/tokens/figma/*.json bilan bir xil kodlash: alias → "Kolleksiya/nom", rang → #rrggbb(aa).
  const enc = (val) => {
    if (val && typeof val === 'object' && val.type === 'VARIABLE_ALIAS') {
      const t = byId[val.id];
      return t ? `${colName[t.variableCollectionId]}/${t.name}` : `EXT:${val.id}`;
    }
    if (val && typeof val === 'object' && 'r' in val)
      return (
        '#' +
        hx(val.r) +
        hx(val.g) +
        hx(val.b) +
        (val.a !== undefined && val.a < 1 ? hx(val.a) : '')
      );
    return String(val);
  };
  for (const c of cols) {
    const vars = c.variableIds.map((id) => byId[id]).filter(Boolean);
    const lines = vars
      .map(
        (v) =>
          v.name +
          '=' +
          c.modes.map((m) => enc(v.valuesByMode[m.modeId])).join(';') +
          '|' +
          ((v.codeSyntax && v.codeSyntax.WEB) || ''),
      )
      .sort();
    out.push(
      `V|${c.name}|${vars.length}|${h(
        vars
          .map((v) => v.name)
          .sort()
          .join('|'),
      )}|${h(lines.join('\n'))}`,
    );
  }
  const ts = await figma.getLocalTextStylesAsync();
  const es = await figma.getLocalEffectStylesAsync();
  const ps = await figma.getLocalPaintStylesAsync();
  out.push(
    [
      'S',
      ts.length,
      es.length,
      ps.length,
      h(
        ts
          .map((s) => s.name)
          .sort()
          .join('|'),
      ),
      h(
        es
          .map((s) => s.name)
          .sort()
          .join('|'),
      ),
      h(
        ts
          .map((s) => `${s.name}:${s.fontSize}/${s.lineHeight.value ?? 'auto'}/${s.fontName.style}`)
          .sort()
          .join('\n'),
      ),
    ].join('|'),
  );
}

return out.join('\n');
