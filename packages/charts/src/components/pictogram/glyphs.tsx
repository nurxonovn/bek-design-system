// Pictogram ikonkasi — Figma "Person" (16 × 24): bosh doira 8, tana 16 × 14 (yuqorisi radius/full,
// pasti chart/bar/radius). Rang `currentColor`.
import type { SVGAttributes } from 'react';

export function PersonGlyph(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 24" aria-hidden="true" focusable="false" {...props}>
      <circle cx={8} cy={4} r={4} fill="currentColor" />
      <path d="M0 18a8 8 0 0 1 16 0v2a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4Z" fill="currentColor" />
    </svg>
  );
}
