import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx.js';

export interface NavProfileProps extends Omit<HTMLAttributes<HTMLDivElement>, 'role'> {
  /** Avatar (nested Avatar komponenti, 32–40 px). */
  avatar?: ReactNode;
  /** Figma `↳ Name` — Label/M text/primary. */
  name: ReactNode;
  /** Figma `↳ Role` — Caption/M text/tertiary. */
  role?: ReactNode;
  /** O'ngdagi amal (Log out tugmasi, chevron). */
  action?: ReactNode;
}

/**
 * Figma "Header · Web → Profile" va "Nav drawer → Footer": avatar + ism (Label/M) + rol (Caption/M).
 * Header'da `end` slotiga, drawer'da `footer` ga qo'yiladi.
 */
export function NavProfile({ avatar, name, role, action, className, ...rest }: NavProfileProps) {
  return (
    <div {...rest} className={cx('bek-nav-profile', className)}>
      {avatar && (
        <span className="bek-nav-profile__avatar" aria-hidden="true">
          {avatar}
        </span>
      )}
      <span className="bek-nav-profile__text">
        <span className="bek-nav-profile__name">{name}</span>
        {role && <span className="bek-nav-profile__role">{role}</span>}
      </span>
      {action}
    </div>
  );
}
