import type { CanvasHTMLAttributes } from 'react';

/** Figma `Intensity` varianti — tayyor kuch darajasi (har qiymatni prop bilan alohida o'zgartirish mumkin). */
export type BackgroundIntensity = 'subtle' | 'default' | 'intense';

/** Canvas atributlari: o'lcham (width/height) komponentning o'zida, `children` yo'q. */
export type BackgroundCanvasAttributes = Omit<
  CanvasHTMLAttributes<HTMLCanvasElement>,
  'children' | 'width' | 'height' | 'color'
>;

export interface BackgroundBaseProps {
  /** Kadr tezligi chegarasi (BGR-04: standart 30 fps). */
  fps?: number;
}

/** `cx` — falsy qiymatlarni tashlab klasslarni birlashtiradi. */
export const cx = (...parts: (string | false | null | undefined)[]): string =>
  parts.filter(Boolean).join(' ');
