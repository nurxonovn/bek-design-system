import { useState, type HTMLAttributes } from 'react';
import { cx } from '../../utils/cx.js';
import { UserGlyph } from '../../icons/index.js';

/** Diametr: s 32 · m 40 · l 48 · xl 64 px. */
export type AvatarSize = 's' | 'm' | 'l' | 'xl';
export type AvatarStatus = 'online' | 'away' | 'busy';

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** Rasm manzili. Yuklanmasa — bosh harflar yoki ikonka ko'rsatiladi. */
  src?: string;
  /** Ism — bosh harflar va ekran o'quvchi nomi shundan olinadi. */
  name?: string;
  size?: AvatarSize;
  /** Pastki o'ng burchakdagi holat nuqtasi. */
  status?: AvatarStatus;
}

const initialsOf = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

/** Figma "4.1 Avatar": Image · Initials · Icon, holat nuqtasi Online · Away · Busy. */
export function Avatar({ src, name, size = 'm', status, className, ...rest }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed;
  const initials = name ? initialsOf(name) : '';

  return (
    <span
      role={name ? 'img' : undefined}
      aria-label={name}
      aria-hidden={name ? undefined : true}
      {...rest}
      className={cx('bek-avatar', `bek-avatar--${size}`, className)}
    >
      {showImage ? (
        <img className="bek-avatar__image" src={src} alt="" onError={() => setFailed(true)} />
      ) : initials ? (
        <span className="bek-avatar__initials" aria-hidden="true">
          {initials}
        </span>
      ) : (
        <UserGlyph className="bek-avatar__icon" />
      )}
      {status && <span className={cx('bek-avatar__status', `bek-avatar__status--${status}`)} />}
    </span>
  );
}
