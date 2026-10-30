'use client';
import { useRef } from 'react';
import { rgba } from '../../core/color.js';
import { clamp, num } from '../../core/random.js';
import {
  cx,
  type BackgroundBaseProps,
  type BackgroundCanvasAttributes,
  type BackgroundIntensity,
} from '../../core/types.js';
import { useBackgroundCanvas, type BackgroundFrame } from '../../core/useBackgroundCanvas.js';

/** Figma `Tone`: Neutral (accent/soft · fill/soft-pressed · fill/strong · accent/default) · Brand (gradient/brand-*). */
export type AuroraTone = 'neutral' | 'brand';
/** `top` — Figma joylashuvi (pastki yarmi tinch); `center` — tasmalar markazga suriladi. */
export type AuroraPosition = 'top' | 'center';

export interface AuroraProps extends BackgroundCanvasAttributes, BackgroundBaseProps {
  /** Figma `Tone`. Standart `neutral`. */
  tone?: AuroraTone;
  /** Figma `Intensity`: tasmalar qatlami shaffofligi (Subtle .35 · Default .6 · Intense .9). */
  intensity?: BackgroundIntensity;
  /** Oqim tezligi, ×. Standart 1 (sikl 15–30 s). */
  speed?: number;
  /** Tasmalar soni, 1–5. Standart 3 (Figma). */
  bands?: number;
  /** Joylashuv: `top` · `center`. Standart `top`. */
  position?: AuroraPosition;
}

const OPACITY: Record<BackgroundIntensity, number> = { subtle: 0.35, default: 0.6, intense: 0.9 };
const MAX_BANDS = 5;

/**
 * Figma 720 × 405 kadridagi tasmalar (Band 1–3): burilgan ellips markazi, o'lchami, burchagi (soat yo'nalishida),
 * shaffofligi; blur 64. 4–5-tasmalar — kod kengaytmasi (1–2 geometriyasi pastroqda, teskari burchak).
 */
const FRAME_W = 720;
const FRAME_H = 405;
const BANDS = [
  { x: 350, y: 179, w: 980, h: 150, rot: 10, o: 0.9, period: 15 },
  { x: 381, y: 197, w: 900, h: 120, rot: 6, o: 0.7, period: 22 },
  { x: 331, y: 329, w: 1040, h: 110, rot: 14, o: 0.5, period: 30 },
  { x: 380, y: 250, w: 960, h: 120, rot: -8, o: 0.6, period: 26 },
  { x: 340, y: 120, w: 900, h: 110, rot: -4, o: 0.5, period: 19 },
];
const BLUR = 64;
/** Past o'lchamli oraliq canvas (1/4) — blur arzon, kattalashtirish qo'shimcha yumshatadi. */
const DOWNSCALE = 4;
const CENTER_SHIFT = 0.15;

type Params = { speed: number; opacity: number; bands: number; position: AuroraPosition };

/**
 * Aurora — kanvas tepasida oqadigan yumshoq yorug' tasmalar (Figma 2.6 Backgrounds).
 * Pastki yarmi sarlavha va tugmalar uchun tinch qoladi — auth va landing hero'lar uchun.
 */
export function Aurora({
  tone = 'neutral',
  intensity = 'default',
  speed = 1,
  bands = 3,
  position = 'top',
  fps,
  className,
  ...rest
}: AuroraProps) {
  const params: Params = {
    speed: clamp(num(speed, 1), 0, 20),
    opacity: OPACITY[intensity] ?? OPACITY.default,
    bands: Math.round(clamp(num(bands, 3), 1, MAX_BANDS)),
    position: position === 'center' ? 'center' : 'top',
  };
  const layer = useRef<HTMLCanvasElement | null>(null);

  const ref = useBackgroundCanvas({
    fps,
    redrawKey: JSON.stringify([tone, params]),
    render: (f) => renderAurora(f, params, layer),
  });

  return (
    <canvas
      {...rest}
      ref={ref}
      aria-hidden="true"
      data-tone={tone}
      data-intensity={intensity}
      data-position={params.position}
      className={cx(
        'bek-background',
        'bek-aurora',
        `bek-aurora--${tone}`,
        `bek-aurora--${intensity}`,
        className,
      )}
    />
  );
}

function renderAurora(f: BackgroundFrame, p: Params, layer: { current: HTMLCanvasElement | null }) {
  const { ctx, width, height } = f;
  ctx.clearRect(0, 0, width, height);
  const base = f.color('--bek-aurora-base');
  if (base) {
    ctx.fillStyle = rgba(base);
    ctx.fillRect(0, 0, width, height);
  }

  const lw = Math.max(1, Math.ceil(width / DOWNSCALE));
  const lh = Math.max(1, Math.ceil(height / DOWNSCALE));
  if (!layer.current) layer.current = ctx.canvas.ownerDocument.createElement('canvas');
  const off = layer.current;
  if (off.width !== lw || off.height !== lh) {
    off.width = lw;
    off.height = lh;
  }
  const lctx = off.getContext('2d');
  if (!lctx) return;

  const sx = width / FRAME_W;
  const sy = height / FRAME_H;
  const s = Math.max(sx, sy);
  const t = f.isStatic ? 0 : f.time * p.speed;
  const shiftY = p.position === 'center' ? CENTER_SHIFT * height : 0;

  lctx.setTransform(1, 0, 0, 1, 0, 0);
  lctx.clearRect(0, 0, lw, lh);
  lctx.setTransform(1 / DOWNSCALE, 0, 0, 1 / DOWNSCALE, 0, 0);
  if ('filter' in lctx) lctx.filter = `blur(${((BLUR * s) / DOWNSCALE).toFixed(2)}px)`;

  for (let i = 0; i < p.bands; i++) {
    const geo = BANDS[i];
    const from = f.color(`--bek-aurora-band-${i + 1}-start`);
    const to = f.color(`--bek-aurora-band-${i + 1}-end`);
    if (!from || !to) continue;
    // t = 0 → Figma joylashuvi; keyin har tasma o'z siklida (15–30 s) suriladi va chayqaladi.
    const phase = (t / (geo.period * 1000)) * Math.PI * 2;
    const x = geo.x * sx + Math.sin(phase) * 0.06 * width;
    const y = geo.y * sy + shiftY + Math.sin(phase * 2) * 0.03 * height;
    const rot = ((geo.rot + Math.sin(phase) * 3) * Math.PI) / 180;
    const rx = (geo.w / 2) * s;
    const ry = (geo.h / 2) * s;
    lctx.save();
    lctx.translate(x, y);
    lctx.rotate(rot);
    const g = lctx.createLinearGradient(-rx, 0, rx, 0);
    g.addColorStop(0, rgba(from, geo.o));
    g.addColorStop(1, rgba(to, geo.o));
    lctx.fillStyle = g;
    lctx.beginPath();
    lctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    lctx.fill();
    lctx.restore();
  }
  if ('filter' in lctx) lctx.filter = 'none';

  ctx.globalAlpha = p.opacity;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(off, 0, 0, width, height);
  ctx.globalAlpha = 1;
}
