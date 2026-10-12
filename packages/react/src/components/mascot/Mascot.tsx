'use client';

import type { HTMLAttributes, ReactNode } from 'react';
import { Mascot as InteractiveMascot } from 'page-mascot';
import { cx } from '../../utils/cx.js';
import { Button } from '../button/Button.js';

export type MascotPose =
  | 'idle'
  | 'look-up-left'
  | 'look-up'
  | 'look-up-right'
  | 'look-left'
  | 'look-right'
  | 'look-down-left'
  | 'look-down'
  | 'look-down-right'
  | 'happy'
  | 'love'
  | 'success'
  | 'celebrate'
  | 'wink'
  | 'surprised'
  | 'shy'
  | 'sleepy'
  | 'dizzy';

/** XS 32 · S 48 · M 64 · L 96 · XL 140 · 2XL 200 (scale/32…200). */
export type MascotSize = 'xs' | 's' | 'm' | 'l' | 'xl' | '2xl';

const SIZE_PX: Record<MascotSize, number> = { xs: 32, s: 48, m: 64, l: 96, xl: 140, '2xl': 200 };

// Figma: har poza 3×3 sprite-sheet'ning bitta katagi (directions — 9 qarash, reactions — 9 his).
const DIRECTIONS: MascotPose[] = [
  'look-up-left',
  'look-up',
  'look-up-right',
  'look-left',
  'idle',
  'look-right',
  'look-down-left',
  'look-down',
  'look-down-right',
];
const REACTIONS: MascotPose[] = [
  'happy',
  'love',
  'success',
  'surprised',
  'wink',
  'shy',
  'sleepy',
  'dizzy',
  'celebrate',
];

// Standart varaqlar — page-mascot (MIT © Kamran Ahmed) panda; paket bilan birga keladi (assets/mascot).
// Bundler (Vite/webpack) `new URL(…, import.meta.url)` ni asset'ga aylantiradi. Bundler'siz Node SSR'da
// natija `file:` bo'ladi — u holda varaqlarni `directions`/`reactions` prop'lari bilan bering (README).
const assetUrl = (file: string) => {
  const href = new URL(`../../../assets/mascot/${file}`, import.meta.url).href;
  return href.startsWith('file:') ? undefined : href;
};
const DEFAULT_SHEETS = {
  directions: assetUrl('panda-directions.webp'),
  reactions: assetUrl('panda-reactions.webp'),
};
const cssUrl = (url: string) => `url("${url.replace(/["\\]/g, '\\$&')}")`;

export interface MascotProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Figma "Pose": idle + 8 qarash + 9 his. Statik holatda faqat idle yoki his ishlatiladi. */
  pose?: MascotPose;
  size?: MascotSize;
  /** 3×3 "directions" varag'i (URL). Standart — paketdagi panda. */
  directions?: string;
  /** 3×3 "reactions" varag'i (URL). */
  reactions?: string;
  /** Figma "interactive (code)": kursorga qaraydi, bosganda reaksiya (page-mascot); `pose` e'tiborga olinmaydi. Faqat landing, onboarding, 404. */
  interactive?: boolean;
  /** Ekran o'quvchi nomi, masalan "BEK panda". Berilmasa — bezak (`aria-hidden`). */
  label?: string;
}

/**
 * Figma "2.3 Mascot": BEK maskoti — panda. Chizma emas, sprite-sheet'dan kesilgan kadr (rasm ranglari
 * o'zgartirilmaydi, fon shaffof). Doim matn bilan: maskot hisni, matn ma'noni tashiydi; ekranda bitta maskot.
 * Dark rejimda fill/tertiary-hover yoki undan yorug' yuzada — eng qorong'i yuzada quloqlari ko'rinmaydi.
 */
export function Mascot({
  pose = 'idle',
  size = 'l',
  directions = DEFAULT_SHEETS.directions,
  reactions = DEFAULT_SHEETS.reactions,
  interactive = false,
  label,
  className,
  style,
  ...rest
}: MascotProps) {
  const px = SIZE_PX[size];
  if (interactive) {
    return (
      <span
        className={cx('bek-mascot', `bek-mascot--${size}`, 'bek-mascot--interactive', className)}
        style={style}
        {...rest}
      >
        <InteractiveMascot
          directions={directions ?? ''}
          reactions={reactions ?? ''}
          size={px}
          label={label ?? 'BEK panda'}
        />
      </span>
    );
  }
  const dirIndex = DIRECTIONS.indexOf(pose);
  const sheet = dirIndex >= 0 ? directions : reactions;
  const index = dirIndex >= 0 ? dirIndex : REACTIONS.indexOf(pose);
  return (
    <span
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cx('bek-mascot', `bek-mascot--${size}`, `bek-mascot--${pose}`, className)}
      style={{
        backgroundImage: sheet ? cssUrl(sheet) : undefined,
        backgroundPosition: `${(index % 3) * 50}% ${Math.floor(index / 3) * 50}%`,
        ...style,
      }}
      {...rest}
    />
  );
}

export interface MascotMessageAction {
  label: ReactNode;
  onClick?: () => void;
}

export interface MascotMessageProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Figma "Layout": stacked — markazda, ustma-ust (empty state, 404); inline — maskot chapda (karta, toast). */
  layout?: 'stacked' | 'inline';
  /** Nested Mascot: his ekran ma'nosiga mos — sleepy (bo'sh), dizzy (xato), success, wink (onboarding), surprised (yangilik), love (sevimlilar). */
  pose?: MascotPose;
  size?: MascotSize;
  title: ReactNode;
  description?: ReactNode;
  /** Figma "Action": Button · Action · M. */
  action?: MascotMessageAction;
}

/** Figma "2.3 Mascot" — Mascot message: maskot + sarlavha + tavsif + ixtiyoriy tugma. Empty state, xato va muvaffaqiyat ekranlari uchun. */
export function MascotMessage({
  layout = 'stacked',
  pose = 'sleepy',
  size = 'l',
  title,
  description,
  action,
  className,
  ...rest
}: MascotMessageProps) {
  return (
    <div className={cx('bek-mascot-message', `bek-mascot-message--${layout}`, className)} {...rest}>
      <Mascot pose={pose} size={size} />
      <div className="bek-mascot-message__text">
        <p className="bek-mascot-message__title">{title}</p>
        {description && <p className="bek-mascot-message__description">{description}</p>}
      </div>
      {action && (
        <Button variant="action" size="m" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
