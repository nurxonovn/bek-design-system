'use client';
import { useRef } from 'react';
import { rgba } from '../../core/color.js';
import { clamp, num, smoothstep } from '../../core/random.js';
import {
  cx,
  type BackgroundBaseProps,
  type BackgroundCanvasAttributes,
  type BackgroundIntensity,
} from '../../core/types.js';
import { useBackgroundCanvas, type BackgroundFrame } from '../../core/useBackgroundCanvas.js';

/** Figma `Tone`: Neutral (text/disabled + accent/default) · Brand (gradient/brand-*). */
export type DotFieldTone = 'neutral' | 'brand';

export interface DotFieldProps extends BackgroundCanvasAttributes, BackgroundBaseProps {
  /** Figma `Tone`. Standart `neutral`. */
  tone?: DotFieldTone;
  /** Figma `Intensity`: qatlam shaffofligi + nuqta o'lchami (Subtle .45 · 1.5 · Default .7 · 2 · Intense 1 · 2.5). */
  intensity?: BackgroundIntensity;
  /** Figma `Show pointer` — kursor ostidagi xira nur. Standart `true`. */
  pointer?: boolean;
  /** To'r qadami, px. Standart 20 (tavsiya 16–24). */
  gap?: number;
  /** Nuqta diametri, px. Standart — `intensity` (1.5 · 2 · 2.5). */
  dotSize?: number;
  /** Animatsiya tezligi (to'lqin va halqa), ×. Standart 1. */
  speed?: number;
  /** Kursor zonasidagi nuqtalar kattalashadi va «issiq» rangga o'tadi. Standart `true`. */
  pointerHighlight?: boolean;
  /** Kursor zonasi radiusi, px. Standart 150. */
  radius?: number;
  /** Bosilganda tashqariga yuguruvchi yorqin halqa. Standart `true`. */
  rippleOnClick?: boolean;
}

const PRESETS: Record<BackgroundIntensity, { opacity: number; dot: number }> = {
  subtle: { opacity: 0.45, dot: 1.5 },
  default: { opacity: 0.7, dot: 2 },
  intense: { opacity: 1, dot: 2.5 },
};

/** Figma: zona ichida nuqta +4 px gacha kattalashadi. */
const GROW = 4;
/** Figma Pointer: 260 px ellips, blur 72. */
const GLOW_RADIUS = 130;
const GLOW_BLUR = 72;
const RIPPLE_SPEED = 0.6; // px/ms
const RIPPLE_WIDTH = 48;
const TOUCH_FADE = 1200; // ms — sensorli ekranda zona oxirgi teginishda qoladi va so'nadi
const WAVE_PERIOD = 6000;

interface Ripple {
  x: number;
  y: number;
  age: number;
}

type Params = {
  pointer: boolean;
  gap: number;
  dot: number;
  speed: number;
  opacity: number;
  pointerHighlight: boolean;
  radius: number;
  ripple: boolean;
};

/**
 * Dot field — kursor atrofida kattalashib yorishadigan nuqtalar to'ri; bosilganda halqa (Figma 2.6 Backgrounds).
 * 2.5 Pattern · Dots ning animatsiyali juftligi. Bezak: `aria-hidden`, `pointer-events: none`.
 */
export function DotField({
  tone = 'neutral',
  intensity = 'default',
  pointer = true,
  gap = 20,
  dotSize,
  speed = 1,
  pointerHighlight = true,
  radius = 150,
  rippleOnClick = true,
  fps,
  className,
  ...rest
}: DotFieldProps) {
  const preset = PRESETS[intensity] ?? PRESETS.default;
  const params: Params = {
    pointer,
    gap: Math.max(4, num(gap, 20)),
    dot: Math.max(0.5, num(dotSize, preset.dot)),
    speed: clamp(num(speed, 1), 0, 20),
    opacity: preset.opacity,
    pointerHighlight,
    radius: Math.max(0, num(radius, 150)),
    ripple: rippleOnClick,
  };
  const ripples = useRef<Ripple[]>([]);

  const ref = useBackgroundCanvas({
    fps,
    trackPointer: true,
    redrawKey: JSON.stringify([tone, params]),
    render: (f) => renderDots(f, params, ripples.current),
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
        'bek-dot-field',
        `bek-dot-field--${tone}`,
        `bek-dot-field--${intensity}`,
        className,
      )}
    />
  );
}

function renderDots(f: BackgroundFrame, p: Params, ripples: Ripple[]) {
  const { ctx, width, height } = f;
  const base = f.color('--bek-dot-field-base');
  const dot = f.color('--bek-dot-field-dot');
  const hot = f.color('--bek-dot-field-hot');
  const glow = f.color('--bek-dot-field-glow');
  const glowOpacity = clamp(
    num(parseFloat(f.style.getPropertyValue('--bek-dot-field-glow-opacity')), 0.14),
    0,
    1,
  );

  ctx.clearRect(0, 0, width, height);
  if (base) {
    ctx.fillStyle = rgba(base);
    ctx.fillRect(0, 0, width, height);
  }

  // Ripple halqalari: yangi bosishlar (canvas ichida) qo'shiladi, eskilari diagonaldan oshganda o'chadi.
  const diag = Math.hypot(width, height);
  if (f.isStatic || !p.ripple) ripples.length = 0;
  else {
    for (const c of f.clicks)
      if (c.x >= 0 && c.y >= 0 && c.x <= width && c.y <= height)
        ripples.push({ x: c.x, y: c.y, age: 0 });
    for (const r of ripples) r.age += f.delta * p.speed;
    for (let i = ripples.length - 1; i >= 0; i--)
      if (ripples[i].age * RIPPLE_SPEED > diag) ripples.splice(i, 1);
  }

  let pt = !f.isStatic && p.pointerHighlight ? f.pointer : null;
  let strength = 1;
  if (pt && pt.type === 'touch') {
    strength = 1 - pt.idle / TOUCH_FADE;
    if (strength <= 0) pt = null;
  }

  // Figma qatlam tartibi: Pointer nur — nuqtalar ostida.
  if (p.pointer && pt && glow) {
    const R = GLOW_RADIUS + GLOW_BLUR;
    const g = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, R);
    g.addColorStop(0, rgba(glow, glowOpacity * strength));
    g.addColorStop(GLOW_RADIUS / R / 2, rgba(glow, glowOpacity * strength * 0.85));
    g.addColorStop(1, rgba(glow, 0));
    ctx.fillStyle = g;
    ctx.fillRect(pt.x - R, pt.y - R, R * 2, R * 2);
  }

  const gap = p.gap;
  const cols = Math.ceil(width / gap);
  const rows = Math.ceil(height / gap);
  const phase = f.isStatic ? 0 : (f.time * p.speed * Math.PI * 2) / WAVE_PERIOD;

  ctx.globalAlpha = p.opacity;
  const hotDots: [number, number, number, number][] = [];
  if (dot) {
    ctx.fillStyle = rgba(dot);
    ctx.beginPath();
  }
  for (let row = 0; row < rows; row++) {
    const y = row * gap + gap / 2;
    for (let c = 0; c < cols; c++) {
      const x = c * gap + gap / 2;
      let heat = 0;
      if (pt && p.radius > 0) {
        const d = Math.hypot(x - pt.x, y - pt.y);
        if (d < p.radius) heat = smoothstep(1 - d / p.radius) * strength;
      }
      for (const r of ripples) {
        const ring = r.age * RIPPLE_SPEED;
        const off = Math.abs(Math.hypot(x - r.x, y - r.y) - ring);
        if (off < RIPPLE_WIDTH) heat = Math.max(heat, (1 - off / RIPPLE_WIDTH) * (1 - ring / diag));
      }
      // Tinch to'lqin: nuqtalar sekin «nafas oladi» (statik kadrda yo'q).
      const wave = phase ? 0.12 * Math.sin(phase + (c + row) * 0.35) : 0;
      const radius = (p.dot * (1 + wave) + GROW * heat) / 2;
      if (heat > 0.02) hotDots.push([x, y, radius, heat]);
      if (dot && heat < 1) {
        ctx.moveTo(x + radius, y);
        ctx.arc(x, y, radius, 0, Math.PI * 2);
      }
    }
  }
  if (dot) ctx.fill();
  if (hot)
    for (const [x, y, r, heat] of hotDots) {
      ctx.globalAlpha = p.opacity * heat;
      ctx.fillStyle = rgba(hot);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  ctx.globalAlpha = 1;
}
