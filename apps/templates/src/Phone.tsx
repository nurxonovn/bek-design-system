import type { CSSProperties, ReactNode } from 'react';
import { HomeIndicator, StatusBar } from '@bek-ui/react';
import tokens from '@bek-ui/tokens/tokens.json';

/**
 * Ramka ichida Mobile (390) shkalasi: tokens.css'dagi `@media (min-width: 600/1024px)` keng
 * oynada tipografiya va layout tokenlarini Tablet/Web qiymatlariga ko'taradi — mockup esa doim
 * Mobile. Qiymatlar Figma Variables'dan (`tokens.json` → `typography.mobile`, `dimension.mobile`).
 */
const MOBILE_SCALE = { ...tokens.dimension.mobile, ...tokens.typography.mobile } as CSSProperties;

/**
 * Mobil ekran namunasi uchun ramka: 390 px, Status bar (Figma "10.2 System bars" — faqat mockup)
 * va Home indicator. Haqiqiy qurilmada ularni OS chizadi.
 */
export function Phone({
  children,
  label,
  className,
}: {
  children: ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <section
      className={className ? `tpl-phone ${className}` : 'tpl-phone'}
      style={MOBILE_SCALE}
      aria-label={label}
    >
      <StatusBar />
      <div className="tpl-phone__screen">{children}</div>
      <HomeIndicator />
    </section>
  );
}

/** Rasm o'rni (Figma'dagi image placeholder). */
export function Placeholder({ ratio = '16 / 10', icon }: { ratio?: string; icon: ReactNode }) {
  return (
    <div className="tpl-placeholder" style={{ aspectRatio: ratio }}>
      {icon}
    </div>
  );
}
