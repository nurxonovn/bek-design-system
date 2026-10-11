import type { HTMLAttributes } from 'react';
import { cx } from '../../utils/cx.js';
import { BatteryGlyph, SignalGlyph, WifiGlyph } from '../../icons/system.js';

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
        <SignalGlyph className="bek-status-bar__glyph" />
        <WifiGlyph className="bek-status-bar__glyph" />
        <BatteryGlyph className="bek-status-bar__glyph bek-status-bar__glyph--battery" />
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
