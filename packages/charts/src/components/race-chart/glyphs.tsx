// Race boshqaruvi ikonkalari — Figma "BEK - Icons" (Stroke, 16 px); rang `currentColor`.
import type { SVGAttributes } from 'react';

type GlyphProps = SVGAttributes<SVGSVGElement>;

const base = { viewBox: '0 0 16 16', 'aria-hidden': true, focusable: false } as const;

/** play — Figma Race · Play (Button · Icon only). */
export function PlayGlyph(props: GlyphProps) {
  return (
    <svg {...base} {...props}>
      <path
        transform="translate(3.5 2.69)"
        fill="currentColor"
        d="M1.254 1.027C1.143.958 1 1.038 1 1.169v8.28c0 .13.143.21.254.142l6.728-4.14a.166.166 0 0 0 0-.284L1.254 1.027ZM0 1.169C0 .256 1.001-.303 1.778.175l6.728 4.14c.74.456.74 1.532 0 1.987L1.778 10.443C1.001 10.921 0 10.362 0 9.449V1.169Z"
      />
    </svg>
  );
}

/** pause — ikki tik chiziq. */
export function PauseGlyph(props: GlyphProps) {
  return (
    <svg {...base} {...props}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={1}
        d="M5.5 3.5v9M10.5 3.5v9"
      />
    </svg>
  );
}

/** replay — oxirgi kadrdan keyin qaytadan. */
export function ReplayGlyph(props: GlyphProps) {
  return (
    <svg {...base} {...props}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1}
        d="M3.5 8a4.5 4.5 0 1 0 1.32-3.18M3.5 2.5v2.5H6"
      />
    </svg>
  );
}
