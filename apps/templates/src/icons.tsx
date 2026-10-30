// Namuna ikonkalari (BEK Icons — Stroke uslubiga yaqin, 24 × 24). Ilovada BEK Icons kutubxonasidan oling.
import type { SVGProps } from 'react';

const paths = {
  home: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  book: 'M3 5.5C5.5 4.5 9 4.5 12 6.5c3-2 6.5-2 9-1v13c-2.5-1-6-1-9 1-3-2-6.5-2-9-1zM12 6.5v13',
  clipboard: 'M9 4h6v3H9zM7 5.5H5.5V21h13V5.5H17M8.5 12h7M8.5 16h5',
  calendar: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  star: 'm12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z',
  settings:
    'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 3 14H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.2-2.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 10 3V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.7 1.7 0 0 0 21 10h.1a2 2 0 1 1 0 4H21a1.7 1.7 0 0 0-1.6 1z',
  mail: 'M3 5h18v14H3zM3 6l9 7 9-7',
  bell: 'M6 16V10a6 6 0 1 1 12 0v6l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
  image: 'M3 4h18v16H3zM8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM21 15l-5-5L5 20',
  check: 'm4.5 12.5 5 5 10-11',
  edit: 'M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4',
  heart: 'M12 20s-8-4.7-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.3 12 20 12 20z',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4',
  bag: 'M5 8h14l-1 13H6zM9 8V6a3 3 0 0 1 6 0v2',
  plus: 'M12 5v14M5 12h14',
  mic: 'M9 5a3 3 0 0 1 6 0v6a3 3 0 0 1-6 0zM5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21',
  sparkles:
    'M5 19 15 9M13.5 4.5l1 2 2 1-2 1-1 2-1-2-2-1 2-1zM19 11l.7 1.3L21 13l-1.3.7L19 15l-.7-1.3L17 13l1.3-.7z',
  folder: 'M3 6h6l2 2h10v11H3z',
  menu: 'M4 6h16M4 12h16M4 18h16',
  more: 'M6 12h.01M12 12h.01M18 12h.01',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v5M12 7.5h.01',
  file: 'M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6',
  arrowUp: 'M12 19V5M6 11l6-6 6 6',
  eye: 'M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  code: 'm8 7-5 5 5 5M16 7l5 5-5 5',
  moon: 'M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z',
  wallet: 'M19 7.5V5H6.5a2.5 2.5 0 0 0 0 5H20v10H6a2 2 0 0 1-2-2V7.5M16.5 15h.01',
  creditCard: 'M3 5.5h18v13H3zM3 9.5h18M7 14.5h3',
  creditCardAdd: 'M21 12V5.5H3v13h10M3 9.5h18M7 14.5h3M18 15v6M15 18h6',
  piggyBank:
    'M19 12c0-3.6-3.1-6.5-7-6.5-1.3 0-2.5.3-3.5.8L6 5v3.4A6 6 0 0 0 4.7 11H3v3.5h1.9A7 7 0 0 0 7 17v3h3v-1.5h3V20h3v-3c1.8-1.2 3-3 3-5zM15.5 10.5h.01',
  bank: 'M3 9.5 12 4l9 5.5zM5.5 10v7.5M10 10v7.5M14 10v7.5M18.5 10v7.5M3 20h18',
  pieChart: 'M12 3a9 9 0 1 0 9 9h-9zM15 3.5V9h5.5A7 7 0 0 0 15 3.5z',
  truck:
    'M2.5 6h11v9.5h-11zM13.5 9.5h4l3 3.5v2.5h-7M7 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM17 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z',
  chevronRight: 'm9 6 6 6-6 6',
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: IconName }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d={paths[name]} />
    </svg>
  );
}
