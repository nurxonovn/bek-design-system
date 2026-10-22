'use client';

import { useEffect, useRef, useState } from 'react';

/** `aria-live` darajasi: `polite` (standart), `assertive` (faqat shoshilinch), `off` — e'lon qilinmaydi. */
export type LivePoliteness = 'polite' | 'assertive' | 'off';

/** Figma: "announce at most once per minute". */
export const ANNOUNCE_INTERVAL = 60_000;

/**
 * Jonli hudud matni — o'zgarishlar `interval` da ko'pi bilan bir marta e'lon qilinadi; oxirgi qiymat
 * kechikib bo'lsa ham albatta e'lon qilinadi (trailing). Birinchi chizishda bo'sh — sahifa ochilganda
 * gapirmaydi.
 */
export function useThrottledAnnouncement(text: string, interval: number, enabled: boolean): string {
  const [announced, setAnnounced] = useState('');
  const prev = useRef(text);
  const last = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Strict Mode'dagi qayta ishga tushish va birinchi chizish e'lon qilinmaydi — faqat haqiqiy o'zgarish.
    if (prev.current === text) return undefined;
    prev.current = text;
    if (!enabled) return undefined;
    const wait = last.current + interval - Date.now();
    if (timer.current) clearTimeout(timer.current);
    if (wait <= 0) {
      last.current = Date.now();
      setAnnounced(text);
      return undefined;
    }
    timer.current = setTimeout(() => {
      last.current = Date.now();
      timer.current = null;
      setAnnounced(text);
    }, wait);
    return undefined;
  }, [text, interval, enabled]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  return announced;
}
