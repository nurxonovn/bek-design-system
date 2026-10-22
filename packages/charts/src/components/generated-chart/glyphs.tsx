import type { SVGAttributes } from 'react';

// AI guruhi uchun mahalliy glyph'lar (Figma `_Icon` · Sparkles, Table, Code, Bookmark). Bezak — aria-hidden;
// rangi `currentColor` dan. @bek-ui/react ikonka to'plamida hali yo'q, shuning uchun shu papkada.

type GlyphProps = SVGAttributes<SVGSVGElement>;

const base = {
  viewBox: '0 0 16 16',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.25,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
} as const;

/** Sparkles — AI chiqishi belgisi (model natijasini ma'lumotdan ajratadi). */
export function SparklesGlyph(props: GlyphProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 3.5 7.2 6.8 10.5 8 7.2 9.2 6 12.5 4.8 9.2 1.5 8l3.3-1.2z" />
      <path d="M12 1.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6zM12 10.5l.5 1 1 .5-1 .5-.5 1-.5-1-1-.5 1-.5z" />
    </svg>
  );
}

export function TableGlyph(props: GlyphProps) {
  return (
    <svg {...base} {...props}>
      <rect x="2" y="2.5" width="12" height="11" rx="1.5" />
      <path d="M2 6.5h12M2 10h12M6 6.5v7" />
    </svg>
  );
}

export function CodeGlyph(props: GlyphProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5.5 4.5 2 8l3.5 3.5M10.5 4.5 14 8l-3.5 3.5" />
    </svg>
  );
}

export function BookmarkGlyph(props: GlyphProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 2.5h8v11l-4-2.75-4 2.75z" />
    </svg>
  );
}
