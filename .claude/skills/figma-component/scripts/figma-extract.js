// Figma → figma.json spetsifikatsiya. use_figma (read-only) ichida ishga tushiring.
// INPUT.sets — component set / component ID'lari (bir sahifa yoki bir komponent uchun).
// INPUT.doc — 📘 doc frame'dan "Design tokens / Props / Rules / Do-Don't" matnini olish.
// Natija ≤ 20 KB: 4–5 sahifadan ko'pini bitta chaqiruvga qo'shmang.
const INPUT = { sets: ['150:1296', '183:1275'], doc: true };

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
const TOKEN_RE =
  /\b(?:fill|text|border|accent|status|surface|bg|static|scale|radius|control|layout|type|shadow|glass|size|motion|z|family|weight)\/[A-Za-z0-9/-]+|\bElevation\/[A-Za-z0-9]+|\bGlass\/[A-Za-z]+/g;

// Boshqa sahifadagi komponent instance'i (Card ichidagi Button, Badge …) — o'z tokenlari bilan hisoblanmaydi,
// faqat `nested` ro'yxatiga yoziladi. Shu sahifadagi va yordamchi (_Icon, .Carousel/Dot) instance'lar hisoblanadi.
async function instanceOrigin(n) {
  try {
    const mc = await n.getMainComponentAsync();
    if (!mc) return null;
    let p = mc;
    while (p && p.type !== 'PAGE') p = p.parent;
    const set = mc.parent && mc.parent.type === 'COMPONENT_SET' ? mc.parent.name : mc.name;
    return { page: p ? p.name.replace(/\s+/g, ' ').trim() : '', name: set };
  } catch {
    return null;
  }
}
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
    for (const key of ['fills', 'strokes']) {
      const paints = n[key];
      if (!Array.isArray(paints)) continue;
      for (const p of paints) {
        if (p.visible === false) continue;
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

const out = { components: [], doc: {} };
for (const id of INPUT.sets) {
  const node = await figma.getNodeByIdAsync(id);
  if (!node) {
    out.components.push({ id, error: 'not found' });
    continue;
  }
  let page = node;
  while (page && page.type !== 'PAGE') page = page.parent;
  await figma.setCurrentPageAsync(page);
  const pageName = page.name.replace(/\s+/g, ' ').trim();
  const props = {};
  for (const [k, v] of Object.entries(node.componentPropertyDefinitions || {}))
    props[k.split('#')[0]] =
      v.type === 'VARIANT' ? v.variantOptions : { type: v.type, default: v.defaultValue };
  const first = node.type === 'COMPONENT_SET' ? node.children[0] : node;
  out.components.push({
    name: node.name,
    id,
    page: pageName,
    pageId: page.id,
    props,
    variants: node.type === 'COMPONENT_SET' ? node.children.length : 1,
    size: { w: Math.round(first.width), h: Math.round(first.height) },
    ...(await collect(node, pageName)),
    description: (node.description || '').slice(0, 400),
  });
  if (INPUT.doc && !out.doc[pageName]) {
    const texts = [];
    for (const f of page.children.filter((f) => /^📘/.test(f.name)))
      for (const t of f.findAll((n) => n.type === 'TEXT'))
        texts.push(t.characters.replace(/\s+/g, ' ').trim());
    const full = texts.join('\n');
    const start = Math.max(full.indexOf('\nDesign tokens'), 0);
    const end = full.indexOf('\nRelated', start);
    out.doc[pageName] = {
      tokens: [...new Set(full.match(TOKEN_RE) || [])].sort(),
      text: full.slice(start, end > 0 ? end : undefined).slice(0, 3200),
    };
  }
}
return JSON.stringify(out);
