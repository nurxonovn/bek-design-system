'use client';
import { useRef, type CSSProperties } from 'react';
import { cssColor, rgba, type Rgba } from '../../core/color.js';
import { clamp, createRandom, num } from '../../core/random.js';
import {
  cx,
  type BackgroundBaseProps,
  type BackgroundCanvasAttributes,
  type BackgroundIntensity,
} from '../../core/types.js';
import { useBackgroundCanvas, type BackgroundFrame } from '../../core/useBackgroundCanvas.js';

/** Figma `Tone`: Neutral (fill/soft-pressed · accent/soft · fill/strong · accent/default) · Brand (gradient/brand-*). */
export type GrainGradientTone = 'neutral' | 'brand';

export interface GrainGradientProps extends BackgroundCanvasAttributes, BackgroundBaseProps {
  /** Figma `Tone`. Standart `neutral`. */
  tone?: GrainGradientTone;
  /** Figma `Intensity`: dog'lar shaffofligi + donadorlik (Subtle .35 · .18 · Default .6 · .28 · Intense .9 · .40). */
  intensity?: BackgroundIntensity;
  /** Siljish tezligi, ×. Standart 1 (sikl 20–40 s). */
  speed?: number;
  /** Donadorlik (grain) miqdori, 0–1. Standart — `intensity` (.28). */
  grain?: number;
  /** Dog' ranglari: token nomlari (`accent/soft`), `--bek-…` yoki CSS ranglar. Standart — ton bo'yicha 4 ta. */
  blobs?: readonly string[];
}

const PRESETS: Record<BackgroundIntensity, { opacity: number; grain: number }> = {
  subtle: { opacity: 0.35, grain: 0.18 },
  default: { opacity: 0.6, grain: 0.28 },
  intense: { opacity: 0.9, grain: 0.4 },
};

/** Figma 720 × 405 kadridagi to'rt dog' (Blob 1–4): markaz, o'lcham, shaffoflik; blur 110. */
const FRAME_W = 720;
const FRAME_H = 405;
const BLOBS = [
  { x: 150, y: 70, w: 460, h: 380, o: 1, period: 20 },
  { x: 510, y: 120, w: 420, h: 360, o: 1, period: 28 },
  { x: 380, y: 320, w: 520, h: 320, o: 1, period: 34 },
  { x: 640, y: 330, w: 360, h: 300, o: 0.55, period: 40 },
];
const BLUR = 110;
const DRIFT = 0.08;
/** Figma Noise: zichlik .6, o'lcham ~1 px. */
const GRAIN_DENSITY = 0.6;
const GRAIN_TILE = 128;
/** Piksel shaffofligining yuqori chegarasi — Figma Noise kabi mayin (o'rtacha ~4 % qoraytirish). */
const GRAIN_ALPHA = 0.5;
const STATIC_TIME = 0;

type Params = { count: number; speed: number; opacity: number; grain: number };

interface GrainTile {
  key: string;
  pattern: CanvasPattern | null;
}

function grainPattern(
  ctx: CanvasRenderingContext2D,
  color: Rgba,
  cache: { current: GrainTile | null },
) {
  const key = rgba(color);
  if (cache.current?.key === key) return cache.current.pattern;
  const tile = ctx.canvas.ownerDocument.createElement('canvas');
  tile.width = tile.height = GRAIN_TILE;
  const tctx = tile.getContext('2d');
  let pattern: CanvasPattern | null = null;
  if (tctx) {
    const img = tctx.createImageData(GRAIN_TILE, GRAIN_TILE);
    const rnd = createRandom(7);
    for (let i = 0; i < img.data.length; i += 4) {
      if (rnd() > GRAIN_DENSITY) continue;
      img.data[i] = color.r;
      img.data[i + 1] = color.g;
      img.data[i + 2] = color.b;
      img.data[i + 3] = Math.round(255 * color.a * GRAIN_ALPHA * rnd());
    }
    tctx.putImageData(img, 0, 0);
    pattern = ctx.createPattern(tile, 'repeat');
  }
  cache.current = { key, pattern };
  return pattern;
}

/**
 * Grain gradient — sekin siljiydigan yumshoq rang dog'lari, ustida mayda donadorlik (Figma 2.6 Backgrounds).
 * Kursor effekti yo'q — uzun o'qish sahifalari va muqovalar uchun eng tinch fon.
 */
export function GrainGradient({
  tone = 'neutral',
  intensity = 'default',
  speed = 1,
  grain,
  blobs,
  fps,
  className,
  style,
  ...rest
}: GrainGradientProps) {
  const preset = PRESETS[intensity] ?? PRESETS.default;
  const params: Params = {
    count: blobs?.length ? blobs.length : BLOBS.length,
    speed: clamp(num(speed, 1), 0, 20),
    opacity: preset.opacity,
    grain: clamp(num(grain, preset.grain), 0, 1),
  };
  const tile = useRef<GrainTile | null>(null);

  const ref = useBackgroundCanvas({
    fps,
    redrawKey: JSON.stringify([tone, blobs, params]),
    render: (f) => renderGrain(f, params, tile),
  });

  const vars: Record<string, string> = {};
  blobs?.forEach((b, i) => {
    vars[`--bek-grain-gradient-blob-${i + 1}`] = cssColor(b);
  });

  return (
    <canvas
      {...rest}
      ref={ref}
      aria-hidden="true"
      data-tone={tone}
      data-intensity={intensity}
      className={cx(
        'bek-background',
        'bek-grain-gradient',
        `bek-grain-gradient--${tone}`,
        `bek-grain-gradient--${intensity}`,
        className,
      )}
      style={{ ...(vars as CSSProperties), ...style }}
    />
  );
}

function renderGrain(f: BackgroundFrame, p: Params, tile: { current: GrainTile | null }) {
  const { ctx, width, height } = f;
  const sx = width / FRAME_W;
  const sy = height / FRAME_H;
  const s = Math.max(sx, sy);
  const t = (f.isStatic ? STATIC_TIME : f.time) * p.speed;

  ctx.clearRect(0, 0, width, height);
  const base = f.color('--bek-grain-gradient-base');
  if (base) {
    ctx.fillStyle = rgba(base);
    ctx.fillRect(0, 0, width, height);
  }

  for (let i = 0; i < p.count; i++) {
    const c = f.color(`--bek-grain-gradient-blob-${i + 1}`);
    if (!c) continue;
    const geo = BLOBS[i % BLOBS.length];
    const shift = Math.floor(i / BLOBS.length);
    // t = 0 → Figma joylashuvi (statik kadr); keyin har dog' o'z siklida (20–40 s) aylanadi.
    const phase = (t / (geo.period * 1000)) * Math.PI * 2;
    const x = (geo.x + shift * 90) * sx + Math.sin(phase) * DRIFT * width;
    const y = (geo.y + shift * 60) * sy + Math.sin(phase * 2) * DRIFT * 0.6 * height;
    const blur = BLUR * s;
    const rx = (geo.w / 2) * s + blur;
    const ry = (geo.h / 2) * s + blur;
    const inner = Math.max(0, ((geo.w / 2) * s - blur) / rx);
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(rx, ry);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
    const a = p.opacity * geo.o;
    g.addColorStop(0, rgba(c, a));
    g.addColorStop(inner, rgba(c, a * 0.9));
    g.addColorStop(Math.min(1, inner + (1 - inner) * 0.5), rgba(c, a * 0.35));
    g.addColorStop(1, rgba(c, 0));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Donadorlik — qurilma pikselida (o'lcham ~1.2 px), plitka takrorlanadi.
  const grainColor = f.color('--bek-grain-gradient-grain');
  if (p.grain > 0 && grainColor) {
    const pattern = grainPattern(ctx, grainColor, tile);
    if (pattern) {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = p.grain;
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.restore();
    }
  }
}
