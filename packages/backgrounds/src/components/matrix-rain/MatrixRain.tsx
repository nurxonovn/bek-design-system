'use client';
import { useRef, type CSSProperties } from 'react';
import { cssColor, rgba } from '../../core/color.js';
import { clamp, createRandom, num, smoothstep, type Random } from '../../core/random.js';
import {
  cx,
  type BackgroundBaseProps,
  type BackgroundCanvasAttributes,
  type BackgroundIntensity,
} from '../../core/types.js';
import { useBackgroundCanvas, type BackgroundFrame } from '../../core/useBackgroundCanvas.js';

/** Figma `Tone`: Neutral (text/* + accent), Brand (gradient/brand-* + accent), Classic (effect/matrix/*). */
export type MatrixRainTone = 'neutral' | 'brand' | 'classic';
/** Figma `Charset` varianti yoki istalgan belgilar satri. */
export type MatrixRainCharset = 'mixed' | 'latin' | 'cyrillic' | 'digits' | (string & {});

export interface MatrixRainProps extends BackgroundCanvasAttributes, BackgroundBaseProps {
  /** Figma `Tone`. Standart `neutral`. */
  tone?: MatrixRainTone;
  /** Figma `Intensity`: qatlam shaffofligi va zichlik (Subtle .4 · .22 · Default .7 · .38 · Intense 1 · .55). */
  intensity?: BackgroundIntensity;
  /** Figma `Charset`: `mixed` · `latin` · `cyrillic` · `digits` yoki istalgan satr. Standart `mixed`. */
  charset?: MatrixRainCharset;
  /** Figma `Show pointer` — kursor atrofidagi xira nur (glow). Standart `true`. */
  pointer?: boolean;
  /** Belgi o'lchami, px. Standart — `Code/S` tokeni (12). */
  size?: number;
  /** Qator balandligi, px. Standart — `Code/S` line-height (16). */
  lineSpacing?: number;
  /** Zichlik ko'paytiruvchisi, 0.25–2 ×. Standart 1. */
  density?: number;
  /** Tushish tezligi, ×. Standart 1.75. */
  speed?: number;
  /** Bir qadam (bir qatorga tushish) oralig'i, ms. Standart 134. */
  frameInterval?: number;
  /** Iz davomiyligi, 0–100 %. Standart 94. */
  trail?: number;
  /** Qatlam shaffofligi, 0–100 %. Standart — `intensity` (40 · 70 · 100). */
  opacity?: number;
  /** Bosh belgilar rangi: token nomi (`accent/default`), `--bek-…` yoki CSS rang. Standart — ton bo'yicha. */
  color?: string;
  /** Kursor zonasidagi belgilar rangi. Standart — ton bo'yicha (`accent/default`). */
  highlightColor?: string;
  /** Kursor yaqinidagi belgilar rangini almashtirish. Standart `true`. */
  pointerHighlight?: boolean;
  /** Kursor zonasi radiusi, px. Standart 122. */
  radius?: number;
  /** Yoritish so'nishi (qadamdan qadamga saqlanadigan ulush), 0–100 %. Standart 64. */
  highlightPersistence?: number;
}

const LATIN = 'ABDEFGHIJKLMNOPQRSTUVXYZʻ';
const CYRILLIC = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЪЬЭЮЯЎҚҒҲ';
const DIGITS = '0123456789$%+#<>=*-';
/** Figma Mixed: lotin + o'zbek kirill + raqam va belgilar. */
const CHARSETS: Record<string, string> = {
  mixed: 'ABDEFGHIJKLMNOPQRSTUVXYZАБВГДЕЖЗИЙКЛМНОПРСТУФХЧШЎҚҒҲ0123456789+#*<>$=-',
  latin: LATIN,
  cyrillic: CYRILLIC,
  digits: DIGITS,
};

const PRESETS: Record<BackgroundIntensity, { opacity: number; density: number }> = {
  subtle: { opacity: 0.4, density: 0.22 },
  default: { opacity: 0.7, density: 0.38 },
  intense: { opacity: 1, density: 0.55 },
};

/** Figma: ustun kengligi 14 px · 12 px belgi uchun. */
const COLUMN_RATIO = 14 / 12;
/** Figma Pointer: 220 px ellips, blur 64. */
const GLOW_RADIUS = 110;
const GLOW_BLUR = 64;
/**
 * Rang rollari tomchi energiyasidan: bosh (Head) ≥ .75, iz (Trail) ≥ .4, qolgani — shovqin (Noise).
 * Figma Default variantida belgilar ulushi taxminan head 14 % · trail 29 % · noise 57 %.
 */
const HEAD_CUTOFF = 0.75;
const TRAIL_CUTOFF = 0.4;
/** Figma variantlarida belgili kataklar ulushi .32 · .48 · .67 ≈ density preset × 1.25. */
const FILL_SCALE = 1.25;
const MAX_FILL = 0.95;
/** Tomchi pastga yetgach, ustun balandligining ~0–0.8 qismicha kutadi. */
const REST = 0.4;
const WARMUP_STEPS = 72;
const MAX_STEPS_PER_FRAME = 8;

const DEFAULTS = {
  density: 1,
  speed: 1.75,
  frameInterval: 134,
  trail: 94,
  radius: 122,
  highlightPersistence: 64,
} as const;

interface Column {
  head: number;
  acc: number;
  rate: number;
}

interface Sim {
  key: string;
  cols: number;
  rows: number;
  fill: number;
  glyphs: string[];
  /** Bo'sh satr — katakda belgi yo'q (Figma'dagi oraliqlar). */
  cells: string[];
  energy: Float32Array;
  light: Float32Array;
  columns: Column[];
  rnd: Random;
  clock: number;
}

const glyphsOf = (charset: string): string[] => {
  const list = Array.from(CHARSETS[charset] ?? charset).filter((c) => c.trim());
  return list.length ? list : Array.from(CHARSETS.mixed);
};

const pick = (sim: Sim): string =>
  sim.rnd() < sim.fill ? (sim.glyphs[Math.floor(sim.rnd() * sim.glyphs.length)] ?? '') : '';

function restart(sim: Sim, col: Column) {
  col.rate = 0.7 + sim.rnd() * 0.6;
  col.head = -Math.floor(sim.rnd() * sim.rows * REST * 2);
  col.acc = 0;
}

function step(sim: Sim, keep: number) {
  const { cols, rows, energy, cells } = sim;
  for (let i = 0; i < energy.length; i++) energy[i] *= keep;
  for (let c = 0; c < cols; c++) {
    const col = sim.columns[c];
    col.acc += col.rate;
    while (col.acc >= 1) {
      col.acc -= 1;
      col.head += 1;
      if (col.head >= rows) {
        restart(sim, col);
        break;
      }
      if (col.head < 0) continue;
      // Tomchi boshi o'tgan katak: yangi belgi (yoki bo'shliq) va to'liq energiya.
      const i = col.head * cols + c;
      energy[i] = 1;
      cells[i] = pick(sim);
    }
  }
  // Shovqin belgilari ham asta almashadi.
  for (let k = 0; k < cols; k++) {
    const i = Math.floor(sim.rnd() * cells.length);
    if (cells[i]) cells[i] = pick(sim) || cells[i];
  }
}

function createSim(
  key: string,
  cols: number,
  rows: number,
  charset: string,
  fill: number,
  keep: number,
): Sim {
  const n = cols * rows;
  const sim: Sim = {
    key,
    cols,
    rows,
    fill,
    glyphs: glyphsOf(charset),
    cells: new Array<string>(n).fill(''),
    energy: new Float32Array(n),
    light: new Float32Array(n),
    columns: [],
    rnd: createRandom(cols * 7919 + rows),
    clock: 0,
  };
  for (let i = 0; i < n; i++) sim.cells[i] = pick(sim);
  for (let c = 0; c < cols; c++) {
    const col: Column = { head: 0, acc: 0, rate: 1 };
    restart(sim, col);
    col.head = Math.floor(sim.rnd() * rows * (1 + REST)) - Math.floor(rows * REST);
    sim.columns.push(col);
  }
  for (let s = 0; s < WARMUP_STEPS; s++) step(sim, keep);
  return sim;
}

const px = (value: string, fallback: number) => {
  const n = parseFloat(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

type Params = {
  charset: string;
  pointer: boolean;
  size: number | undefined;
  lineSpacing: number | undefined;
  fill: number;
  stepMs: number;
  keep: number;
  opacity: number;
  pointerHighlight: boolean;
  radius: number;
  persistence: number;
};

/**
 * Matrix rain — tushayotgan belgilar ustunlari, kursorga ergashuvchi nur (Figma 2.6 Backgrounds).
 * Bezak: `aria-hidden`, `pointer-events: none`; ota element `position: relative` bo'lsin.
 */
export function MatrixRain({
  tone = 'neutral',
  intensity = 'default',
  charset = 'mixed',
  pointer = true,
  size,
  lineSpacing,
  density = DEFAULTS.density,
  speed = DEFAULTS.speed,
  frameInterval = DEFAULTS.frameInterval,
  trail = DEFAULTS.trail,
  opacity,
  color,
  highlightColor,
  pointerHighlight = true,
  radius = DEFAULTS.radius,
  highlightPersistence = DEFAULTS.highlightPersistence,
  fps,
  className,
  style,
  ...rest
}: MatrixRainProps) {
  const preset = PRESETS[intensity] ?? PRESETS.default;
  const params: Params = {
    charset,
    pointer,
    size,
    lineSpacing,
    fill: Math.min(
      MAX_FILL,
      clamp(num(density, DEFAULTS.density), 0.25, 2) * preset.density * FILL_SCALE,
    ),
    stepMs:
      Math.max(16, num(frameInterval, DEFAULTS.frameInterval)) /
      clamp(num(speed, DEFAULTS.speed), 0.05, 20),
    keep: clamp(num(trail, DEFAULTS.trail), 0, 100) / 100,
    opacity: clamp(num(opacity, preset.opacity * 100), 0, 100) / 100,
    pointerHighlight,
    radius: Math.max(0, num(radius, DEFAULTS.radius)),
    persistence: clamp(num(highlightPersistence, DEFAULTS.highlightPersistence), 0, 100) / 100,
  };
  const sim = useRef<Sim | null>(null);

  const ref = useBackgroundCanvas({
    fps,
    trackPointer: true,
    redrawKey: JSON.stringify([tone, color, highlightColor, params]),
    render: (f) => renderRain(f, params, sim),
  });

  const vars: Record<string, string> = {};
  if (color) vars['--bek-matrix-rain-head'] = cssColor(color);
  if (highlightColor) vars['--bek-matrix-rain-highlight'] = cssColor(highlightColor);

  return (
    <canvas
      {...rest}
      ref={ref}
      aria-hidden="true"
      data-tone={tone}
      data-intensity={intensity}
      className={cx(
        'bek-background',
        'bek-matrix-rain',
        `bek-matrix-rain--${tone}`,
        `bek-matrix-rain--${intensity}`,
        className,
      )}
      style={{ ...(vars as CSSProperties), ...style }}
    />
  );
}

function renderRain(f: BackgroundFrame, p: Params, ref: { current: Sim | null }) {
  const { ctx, width, height, style } = f;
  const fontSize = Math.max(4, num(p.size, px(style.fontSize, 12)));
  const line = Math.max(4, num(p.lineSpacing, px(style.lineHeight, 16)));
  const colW = Math.max(4, Math.round(fontSize * COLUMN_RATIO));
  const cols = Math.ceil(width / colW);
  const rows = Math.ceil(height / line);
  const key = [cols, rows, p.charset, p.fill.toFixed(3)].join('|');
  if (!ref.current || ref.current.key !== key)
    ref.current = createSim(key, cols, rows, p.charset, p.fill, p.keep);
  const sim = ref.current;

  if (!f.isStatic) {
    sim.clock += f.delta;
    let steps = 0;
    while (sim.clock >= p.stepMs && steps < MAX_STEPS_PER_FRAME) {
      sim.clock -= p.stepMs;
      step(sim, p.keep);
      steps++;
    }
    if (steps === MAX_STEPS_PER_FRAME) sim.clock = 0;
  }

  const base = f.color('--bek-matrix-rain-base');
  const roles = [
    f.color('--bek-matrix-rain-head'),
    f.color('--bek-matrix-rain-trail'),
    f.color('--bek-matrix-rain-noise'),
  ].map((c) => (c ? rgba(c) : ''));
  const hot = f.color('--bek-matrix-rain-highlight');
  const glow = f.color('--bek-matrix-rain-glow');
  const glowOpacity = clamp(
    num(parseFloat(style.getPropertyValue('--bek-matrix-rain-glow-opacity')), 0.12),
    0,
    1,
  );

  ctx.clearRect(0, 0, width, height);
  if (base) {
    ctx.fillStyle = rgba(base);
    ctx.fillRect(0, 0, width, height);
  }

  // Kursor zonasi: yaqin belgilar kursor rangiga o'tadi, keyin `highlightPersistence` bilan so'nadi.
  const pt = !f.isStatic && p.pointerHighlight ? f.pointer : null;
  const decay = f.isStatic ? 0 : f.delta > 0 ? Math.pow(p.persistence, f.delta / p.stepMs) : 1;
  for (let i = 0; i < sim.light.length; i++) sim.light[i] *= decay;
  const r = p.radius;
  if (pt && r > 0) {
    const c0 = Math.max(0, Math.floor((pt.x - r) / colW));
    const c1 = Math.min(cols - 1, Math.floor((pt.x + r) / colW));
    const r0 = Math.max(0, Math.floor((pt.y - r) / line));
    const r1 = Math.min(rows - 1, Math.floor((pt.y + r) / line));
    for (let row = r0; row <= r1; row++)
      for (let c = c0; c <= c1; c++) {
        const d = Math.hypot(c * colW + colW / 2 - pt.x, row * line + line / 2 - pt.y);
        if (d > r) continue;
        const i = row * cols + c;
        sim.light[i] = Math.max(sim.light[i], smoothstep((1 - d / r) * 2));
      }
  }

  ctx.font = `${fontSize}px ${style.fontFamily || 'monospace'}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const hotStyle = hot ? rgba(hot) : '';
  let current = '';
  for (let row = 0; row < rows; row++) {
    const y = row * line + line / 2;
    for (let c = 0; c < cols; c++) {
      const i = row * cols + c;
      const glyph = sim.cells[i];
      if (!glyph) continue;
      const e = sim.energy[i];
      const fill = roles[e >= HEAD_CUTOFF ? 0 : e >= TRAIL_CUTOFF ? 1 : 2];
      const x = c * colW + colW / 2;
      const lit = sim.light[i];
      if (fill && lit < 1) {
        if (fill !== current) ctx.fillStyle = current = fill;
        ctx.globalAlpha = p.opacity * (1 - lit);
        ctx.fillText(glyph, x, y);
      }
      if (hotStyle && lit > 0.02) {
        if (hotStyle !== current) ctx.fillStyle = current = hotStyle;
        ctx.globalAlpha = p.opacity * lit;
        ctx.fillText(glyph, x, y);
      }
    }
  }
  ctx.globalAlpha = 1;

  // Figma `Show pointer`: kursor ustidagi xiralashtirilgan ellips (220 px, blur 64).
  if (p.pointer && !f.isStatic && f.pointer && glow) {
    const { x, y } = f.pointer;
    const R = GLOW_RADIUS + GLOW_BLUR;
    const g = ctx.createRadialGradient(x, y, 0, x, y, R);
    g.addColorStop(0, rgba(glow, glowOpacity));
    g.addColorStop(GLOW_RADIUS / R / 2, rgba(glow, glowOpacity * 0.85));
    g.addColorStop(1, rgba(glow, 0));
    ctx.fillStyle = g;
    ctx.fillRect(x - R, y - R, R * 2, R * 2);
  }
}
