// Tizim paneli glyph'lari (Figma "10.2 System bars"): signal, Wi-Fi, batareya — mockup uchun. Rang `currentColor`.
import type { SVGProps } from 'react';

type GlyphProps = SVGProps<SVGSVGElement>;

const base = { 'aria-hidden': true, focusable: false } as const;

export function SignalGlyph(props: GlyphProps) {
  return (
    <svg viewBox="0 0 20 12" {...base} {...props}>
      <rect x="0" y="8" width="3" height="4" rx="1" fill="currentColor" />
      <rect x="5" y="5.5" width="3" height="6.5" rx="1" fill="currentColor" />
      <rect x="10" y="3" width="3" height="9" rx="1" fill="currentColor" />
      <rect x="15" y="0" width="3" height="12" rx="1" fill="currentColor" />
    </svg>
  );
}

export function WifiGlyph(props: GlyphProps) {
  return (
    <svg viewBox="0 0 16 12" {...base} {...props}>
      <path
        d="M8 11.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm-3.2-4.3a4.5 4.5 0 0 1 6.4 0l-1.1 1.1a3 3 0 0 0-4.2 0Zm-2.8-2.8a8.5 8.5 0 0 1 12 0l-1.1 1.1a7 7 0 0 0-9.8 0ZM0 2.5a12.5 12.5 0 0 1 16 0l-1.1 1.1a11 11 0 0 0-13.8 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function BatteryGlyph(props: GlyphProps) {
  return (
    <svg viewBox="0 0 28 13" {...base} {...props}>
      <rect
        x="0.5"
        y="0.5"
        width="24"
        height="12"
        rx="3.5"
        fill="none"
        stroke="currentColor"
        opacity="0.4"
      />
      <rect x="2" y="2" width="21" height="9" rx="2" fill="currentColor" />
      <path d="M26 4.5v4a2 2 0 0 0 0-4Z" fill="currentColor" opacity="0.4" />
    </svg>
  );
}
