import type { HTMLAttributes } from 'react';
import { cx } from '../../utils/cx.js';

export type SystemBarPlatform = 'ios' | 'android';
/** Figma "Content": dark — yorug' fon ustida (static/dark); light — qorong'i fon va rasm ustida (static/white). */
export type SystemBarContent = 'dark' | 'light';

export interface StatusBarProps extends HTMLAttributes<HTMLDivElement> {
  platform?: SystemBarPlatform;
  content?: SystemBarContent;
  /** Soat matni — Figma "Time". */
  time?: string;
}

/**
 * Figma "10.2 System bars" — Status bar: faqat mockup va shablonlar uchun; haqiqiy qurilmada OS chizadi.
 * iOS 62 (Dynamic Island) · Android 52 (kamera kesimi). Rang mavzuga emas, orqadagi fonga ergashadi.
 */
export function StatusBar({
  platform = 'ios',
  content = 'dark',
  time,
  className,
  ...rest
}: StatusBarProps) {
  const clock = time ?? (platform === 'ios' ? '9:41' : '9:30');
  return (
    <div
      aria-hidden="true"
      className={cx(
        'bek-status-bar',
        `bek-status-bar--${platform}`,
        `bek-system-bar--${content}`,
        className,
      )}
      {...rest}
    >
      <span className="bek-status-bar__time">{clock}</span>
      {platform === 'ios' && <span className="bek-status-bar__island" />}
      <span className="bek-status-bar__indicators">
        <svg viewBox="0 0 20 12" className="bek-status-bar__glyph">
          <rect x="0" y="8" width="3" height="4" rx="1" fill="currentColor" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" fill="currentColor" />
          <rect x="10" y="3" width="3" height="9" rx="1" fill="currentColor" />
          <rect x="15" y="0" width="3" height="12" rx="1" fill="currentColor" />
        </svg>
        <svg viewBox="0 0 16 12" className="bek-status-bar__glyph">
          <path
            d="M8 11.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm-3.2-4.3a4.5 4.5 0 0 1 6.4 0l-1.1 1.1a3 3 0 0 0-4.2 0Zm-2.8-2.8a8.5 8.5 0 0 1 12 0l-1.1 1.1a7 7 0 0 0-9.8 0ZM0 2.5a12.5 12.5 0 0 1 16 0l-1.1 1.1a11 11 0 0 0-13.8 0Z"
            fill="currentColor"
          />
        </svg>
        <svg viewBox="0 0 28 13" className="bek-status-bar__glyph bek-status-bar__glyph--battery">
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
      </span>
    </div>
  );
}

export interface HomeIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  platform?: SystemBarPlatform;
  content?: SystemBarContent;
}

/**
 * Figma "10.2 System bars" — Home indicator: iOS 34 xavfsiz maydon (144 × 5 chiziq) · Android 24 imo-ishora
 * maydoni (108 × 4). Interaktiv kontent xavfsiz maydondan tashqarida turadi.
 */
export function HomeIndicator({
  platform = 'ios',
  content = 'dark',
  className,
  ...rest
}: HomeIndicatorProps) {
  return (
    <div
      aria-hidden="true"
      className={cx(
        'bek-home-indicator',
        `bek-home-indicator--${platform}`,
        `bek-system-bar--${content}`,
        className,
      )}
      {...rest}
    >
      <span className="bek-home-indicator__bar" />
    </div>
  );
}
