// Rang yordamchilari: CSS custom property (token) qiymati → RGBA → canvas uchun `rgba()` satri.
// Token qiymatlari getComputedStyle bilan o'qiladi, shuning uchun Light/Dark (`data-theme`) avtomatik ishlaydi.

export interface Rgba {
  r: number;
  g: number;
  b: number;
  /** 0–1 */
  a: number;
}

const cache = new Map<string, Rgba | null>();
let probe: CanvasRenderingContext2D | null | undefined;

const hex = (s: string): Rgba | null => {
  const m = s.match(/^#([0-9a-f]{3,8})$/i);
  if (!m) return null;
  let h = m[1];
  if (h.length === 3 || h.length === 4)
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  if (h.length !== 6 && h.length !== 8) return null;
  const n = (i: number) => parseInt(h.slice(i, i + 2), 16);
  return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) / 255 : 1 };
};

const rgbFn = (s: string): Rgba | null => {
  const m = s.match(/^rgba?\(([^)]+)\)$/i);
  if (!m) return null;
  const parts = m[1].split(/[\s,/]+/).filter(Boolean);
  if (parts.length < 3) return null;
  const ch = (p: string) => (p.endsWith('%') ? (parseFloat(p) * 255) / 100 : parseFloat(p));
  const alpha =
    parts[3] === undefined
      ? 1
      : parts[3].endsWith('%')
        ? parseFloat(parts[3]) / 100
        : parseFloat(parts[3]);
  const out = { r: ch(parts[0]), g: ch(parts[1]), b: ch(parts[2]), a: alpha };
  return Object.values(out).every(Number.isFinite) ? out : null;
};

/** Brauzer o'zi tushunadigan har qanday CSS rang (oklch, color-mix …) — 1×1 canvas orqali. */
const viaCanvas = (s: string): Rgba | null => {
  if (probe === undefined) {
    const c = typeof document === 'undefined' ? null : document.createElement('canvas');
    if (c) c.width = c.height = 1;
    probe = c?.getContext('2d', { willReadFrequently: true }) ?? null;
  }
  if (!probe) return null;
  const sentinel = '#010203';
  probe.fillStyle = sentinel;
  probe.fillStyle = s;
  if (String(probe.fillStyle).toLowerCase() === sentinel) return null;
  probe.clearRect(0, 0, 1, 1);
  probe.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = probe.getImageData(0, 0, 1, 1).data;
  return { r, g, b, a: a / 255 };
};

/** CSS rang satrini RGBA ga aylantiradi (natija keshlanadi). Noma'lum/bo'sh → null. */
export function parseColor(value: string): Rgba | null {
  const s = value.trim();
  if (!s) return null;
  if (cache.has(s)) return cache.get(s) ?? null;
  const out = hex(s) ?? rgbFn(s) ?? viaCanvas(s);
  if (cache.size > 256) cache.clear();
  cache.set(s, out);
  return out;
}

/** RGBA + qo'shimcha shaffoflik → `rgba()` satri. */
export function rgba(c: Rgba, alpha = 1): string {
  const a = Math.max(0, Math.min(1, c.a * alpha));
  return `rgba(${Math.round(c.r)},${Math.round(c.g)},${Math.round(c.b)},${+a.toFixed(4)})`;
}

/**
 * Prop'dagi rang → CSS qiymati. Figma token nomi (`accent/default`) → `var(--bek-accent-default)`,
 * `--bek-…` → `var(--bek-…)`, boshqasi (CSS rang) o'zgarishsiz.
 */
export function cssColor(value: string): string {
  const v = value.trim();
  if (/^--[a-z0-9-]+$/i.test(v)) return `var(${v})`;
  if (/^[a-z]+(?:\/[a-z0-9-]+)+$/i.test(v))
    return `var(--bek-${v.toLowerCase().replace(/\//g, '-')})`;
  return v;
}
