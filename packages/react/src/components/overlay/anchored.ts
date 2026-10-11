'use client';

import { useEffect, useLayoutEffect, useState, type RefObject } from 'react';

export type Side = 'top' | 'bottom' | 'left' | 'right';
export type Align = 'start' | 'center' | 'end';
export type Placement = Side | `${Side}-${Exclude<Align, 'center'>}`;

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const parse = (placement: Placement): [Side, Align] => {
  const [side, align] = placement.split('-') as [Side, Align | undefined];
  return [side, align ?? 'center'];
};

const OPPOSITE: Record<Side, Side> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };

/** Trigger yoki nuqtaga nisbatan `position: fixed` joylashuv; sig'masa — teskari tomonga. */
export function computePosition(
  anchor: DOMRect,
  floating: { width: number; height: number },
  placement: Placement,
  offset: number,
  viewport = { width: window.innerWidth, height: window.innerHeight },
  margin = 8,
) {
  let [side, align] = parse(placement);
  const fits = (s: Side) =>
    s === 'bottom'
      ? anchor.bottom + offset + floating.height <= viewport.height - margin
      : s === 'top'
        ? anchor.top - offset - floating.height >= margin
        : s === 'right'
          ? anchor.right + offset + floating.width <= viewport.width - margin
          : anchor.left - offset - floating.width >= margin;
  if (!fits(side) && fits(OPPOSITE[side])) side = OPPOSITE[side];

  let top = 0;
  let left = 0;
  if (side === 'top' || side === 'bottom') {
    top = side === 'bottom' ? anchor.bottom + offset : anchor.top - offset - floating.height;
    left =
      align === 'start'
        ? anchor.left
        : align === 'end'
          ? anchor.right - floating.width
          : anchor.left + anchor.width / 2 - floating.width / 2;
  } else {
    left = side === 'right' ? anchor.right + offset : anchor.left - offset - floating.width;
    top =
      align === 'start'
        ? anchor.top
        : align === 'end'
          ? anchor.bottom - floating.height
          : anchor.top + anchor.height / 2 - floating.height / 2;
  }
  const clamp = (v: number, size: number, max: number) =>
    Math.min(Math.max(v, margin), Math.max(margin, max - size - margin));
  return {
    side,
    top: clamp(top, floating.height, viewport.height),
    left: clamp(left, floating.width, viewport.width),
  };
}

/**
 * `open` bo'lganda suzuvchi elementni anchor'ga bog'lab turadi (scroll va resize'da yangilanadi).
 * Anchor — element yoki nuqta (`DOMRect`, masalan kontekst menyu uchun kursor).
 */
export function useAnchoredPosition(
  open: boolean,
  anchor: RefObject<HTMLElement> | DOMRect | null,
  floating: RefObject<HTMLElement>,
  placement: Placement,
  offset = 8,
) {
  const [side, setSide] = useState<Side>(parse(placement)[0]);
  useIsoLayoutEffect(() => {
    if (!open) return;
    const update = () => {
      const el = floating.current;
      const rect = anchor && 'current' in anchor ? anchor.current?.getBoundingClientRect() : anchor;
      if (!el || !rect) return;
      const pos = computePosition(rect, el.getBoundingClientRect(), placement, offset);
      el.style.top = `${pos.top}px`;
      el.style.left = `${pos.left}px`;
      setSide(pos.side);
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open, anchor, placement, offset]);
  return side;
}

/** Tashqariga bosish va Escape bilan yopish. */
export function useDismiss(
  open: boolean,
  onDismiss: (reason: 'outside' | 'escape') => void,
  refs: RefObject<HTMLElement>[],
) {
  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (refs.some((ref) => ref.current?.contains(target))) return;
      onDismiss('outside');
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onDismiss('escape');
      }
    };
    document.addEventListener('pointerdown', onPointer, true);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer, true);
      document.removeEventListener('keydown', onKey);
    };
  });
}

/** Faqat brauzerda (mount'dan keyin) `true` — portal SSR'da chizilmaydi. */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
