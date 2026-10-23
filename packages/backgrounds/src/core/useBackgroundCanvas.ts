'use client';
// Barcha fonlar uchun umumiy canvas sikli (Figma 2.6 BGR-01 … BGR-04):
// - konteynerni to'ldiradi (ResizeObserver), devicePixelRatio ≤ 2;
// - standart 30 fps, ekrandan tashqarida (IntersectionObserver) va yashirin tabda (`document.hidden`) to'xtaydi;
// - `prefers-reduced-motion: reduce` → animatsiyasiz bitta statik kadr, kursor effektlarisiz (o'zgarish tinglanadi);
// - kursor `window` da kuzatiladi — canvas o'zi `pointer-events: none` qoladi;
// - SSR: render paytida window/document ishlatilmaydi, hammasi effektda.
import { useEffect, useRef, type RefObject } from 'react';
import { parseColor, type Rgba } from './color.js';
import { clamp, num } from './random.js';

/** BGR-04: piksel zichligi chegarasi. */
export const MAX_DPR = 2;
/** BGR-04: standart kadr tezligi. */
export const DEFAULT_FPS = 30;
const MAX_DELTA = 250;
const MAX_CLICKS = 8;

export interface BackgroundPointer {
  /** Canvas ichidagi koordinata, CSS px. */
  x: number;
  y: number;
  /** `mouse` · `pen` · `touch` */
  type: string;
  /** Oxirgi harakatdan beri o'tgan vaqt, ms (sensorli ekranda iz so'nishi uchun). */
  idle: number;
}

export interface BackgroundClick {
  x: number;
  y: number;
}

export interface BackgroundFrame {
  ctx: CanvasRenderingContext2D;
  /** CSS px */
  width: number;
  height: number;
  dpr: number;
  /** Animatsiya soati, ms (pauzada to'xtaydi). */
  time: number;
  /** Oldingi kadrdan beri, ms; statik kadrda 0. */
  delta: number;
  /** `prefers-reduced-motion: reduce` — yagona statik kadr, kursor effektlari yo'q. */
  isStatic: boolean;
  pointer: BackgroundPointer | null;
  clicks: BackgroundClick[];
  /** Canvas'ning computed style'i (shrift, custom property'lar). */
  style: CSSStyleDeclaration;
  /** CSS custom property (`--bek-…`) qiymatini rang sifatida o'qiydi. */
  color: (property: string) => Rgba | null;
}

export interface BackgroundCanvasOptions {
  render: (frame: BackgroundFrame) => void;
  fps?: number;
  /** Kursorni `window` da kuzatish (Matrix rain, Dot field). */
  trackPointer?: boolean;
  /** O'zgarganda statik kadr qayta chiziladi (prop'lar, ton). */
  redrawKey?: string;
}

interface Api {
  invalidate: () => void;
}

export function useBackgroundCanvas(
  options: BackgroundCanvasOptions,
): RefObject<HTMLCanvasElement> {
  const ref = useRef<HTMLCanvasElement>(null);
  const opts = useRef(options);
  const api = useRef<Api | null>(null);

  useEffect(() => {
    opts.current = options;
  });

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const doc = canvas.ownerDocument;
    const win = doc.defaultView;
    if (!win) return;

    const style = win.getComputedStyle(canvas);
    const color = (property: string) => parseColor(style.getPropertyValue(property));
    const motion = win.matchMedia?.('(prefers-reduced-motion: reduce)');
    const scheme = win.matchMedia?.('(prefers-color-scheme: dark)');
    const trackPointer = opts.current.trackPointer === true;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let visible = true;
    let reduced = motion?.matches === true;
    let raf = 0;
    let pending = 0;
    let last = 0;
    let time = 0;
    let pointer: { x: number; y: number; type: string; at: number } | null = null;
    let clicks: BackgroundClick[] = [];

    const draw = (delta: number, isStatic: boolean) => {
      if (!width || !height) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      let local: BackgroundPointer | null = null;
      let localClicks: BackgroundClick[] = [];
      if (!isStatic && (pointer || clicks.length)) {
        const r = canvas.getBoundingClientRect();
        if (pointer)
          local = {
            x: pointer.x - r.left,
            y: pointer.y - r.top,
            type: pointer.type,
            idle: win.performance.now() - pointer.at,
          };
        localClicks = clicks.map((c) => ({ x: c.x - r.left, y: c.y - r.top }));
      }
      clicks = [];
      opts.current.render({
        ctx,
        width,
        height,
        dpr,
        time,
        delta,
        isStatic,
        pointer: local,
        clicks: localClicks,
        style,
        color,
      });
    };

    const running = () => !reduced && visible && !doc.hidden && width > 0 && height > 0;

    const tick = (now: number) => {
      raf = win.requestAnimationFrame(tick);
      const interval = 1000 / clamp(num(opts.current.fps, DEFAULT_FPS), 1, 120);
      if (last && now - last < interval - 2) return;
      const delta = last ? Math.min(now - last, MAX_DELTA) : interval;
      last = now;
      time += delta;
      draw(delta, false);
    };

    const sync = () => {
      if (running()) {
        if (!raf) {
          last = 0;
          raf = win.requestAnimationFrame(tick);
        }
        return;
      }
      if (raf) win.cancelAnimationFrame(raf);
      raf = 0;
      if (reduced) draw(0, true);
    };

    // Statik rejimda mavzu/prop o'zgarsa — keyingi kadrda bir marta qayta chizish.
    const invalidate = () => {
      if (!reduced || pending) return;
      pending = win.requestAnimationFrame(() => {
        pending = 0;
        if (reduced) draw(0, true);
      });
    };
    api.current = { invalidate };

    const resize = (w: number, h: number) => {
      dpr = Math.min(win.devicePixelRatio || 1, MAX_DPR);
      width = Math.max(0, w);
      height = Math.max(0, h);
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      // O'lcham o'zgarishi canvas'ni tozalaydi — darhol qayta chizamiz (bo'sh kadr ko'rinmasin).
      if (running()) draw(0, false);
      sync();
    };

    const cleanups: (() => void)[] = [];
    const listen = (
      target: EventTarget,
      type: string,
      fn: EventListener,
      opt: AddEventListenerOptions = { passive: true },
    ) => {
      target.addEventListener(type, fn, opt);
      cleanups.push(() => target.removeEventListener(type, fn, opt));
    };

    if (typeof win.ResizeObserver === 'function') {
      const ro = new win.ResizeObserver((entries) => {
        const box = entries[entries.length - 1]?.contentRect;
        if (box) resize(box.width, box.height);
      });
      ro.observe(canvas);
      cleanups.push(() => ro.disconnect());
    } else {
      const measure = () => {
        const r = canvas.getBoundingClientRect();
        resize(r.width, r.height);
      };
      listen(win, 'resize', measure);
      measure();
    }

    if (typeof win.IntersectionObserver === 'function') {
      const io = new win.IntersectionObserver((entries) => {
        const e = entries[entries.length - 1];
        if (!e) return;
        visible = e.isIntersecting;
        sync();
      });
      io.observe(canvas);
      cleanups.push(() => io.disconnect());
    }

    listen(doc, 'visibilitychange', () => sync());

    if (motion) {
      const onMotion = () => {
        reduced = motion.matches;
        sync();
      };
      if (typeof motion.addEventListener === 'function') {
        motion.addEventListener('change', onMotion);
        cleanups.push(() => motion.removeEventListener('change', onMotion));
      } else {
        motion.addListener(onMotion);
        cleanups.push(() => motion.removeListener(onMotion));
      }
    }

    // Light/Dark: animatsiyada ranglar har kadrda o'qiladi; statik kadr esa mavzu o'zgarganda qayta chiziladi.
    if (scheme && typeof scheme.addEventListener === 'function') {
      scheme.addEventListener('change', invalidate);
      cleanups.push(() => scheme.removeEventListener('change', invalidate));
    }
    if (typeof win.MutationObserver === 'function') {
      const mo = new win.MutationObserver(invalidate);
      mo.observe(doc.documentElement, {
        attributes: true,
        subtree: true,
        attributeFilter: ['data-theme', 'class'],
      });
      cleanups.push(() => mo.disconnect());
    }

    if (trackPointer) {
      listen(win, 'pointermove', (e) => {
        const p = e as PointerEvent;
        pointer = { x: p.clientX, y: p.clientY, type: p.pointerType, at: win.performance.now() };
      });
      listen(win, 'pointerdown', (e) => {
        const p = e as PointerEvent;
        pointer = { x: p.clientX, y: p.clientY, type: p.pointerType, at: win.performance.now() };
        if (clicks.length < MAX_CLICKS) clicks.push({ x: p.clientX, y: p.clientY });
      });
      const leave = (e: Event) => {
        if ((e as PointerEvent).pointerType !== 'touch') pointer = null;
      };
      listen(doc.documentElement, 'pointerleave', leave);
      listen(win, 'blur', () => {
        pointer = null;
      });
    }

    sync();

    return () => {
      if (raf) win.cancelAnimationFrame(raf);
      if (pending) win.cancelAnimationFrame(pending);
      raf = 0;
      pending = 0;
      api.current = null;
      for (const fn of cleanups) fn();
    };
  }, []);

  useEffect(() => {
    api.current?.invalidate();
  }, [options.redrawKey]);

  return ref;
}
