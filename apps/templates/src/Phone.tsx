import type { ReactNode } from 'react';

/**
 * Mobil ekran namunasi uchun ramka: 390 px, Status bar (Figma "10.2 System bars" — faqat mockup)
 * va Home indicator. Haqiqiy qurilmada ularni OS chizadi.
 */
export function Phone({ children, label }: { children: ReactNode; label: string }) {
  return (
    <section className="tpl-phone" aria-label={label}>
      <div className="tpl-status-bar" aria-hidden="true">
        <span>9:41</span>
        <span className="tpl-status-bar__island" />
        <span className="tpl-status-bar__icons">▮▮▮ ◔ ▭</span>
      </div>
      <div className="tpl-phone__screen">{children}</div>
      <div className="tpl-home-indicator" aria-hidden="true" />
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
