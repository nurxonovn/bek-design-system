'use client';

import { useState, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { useDialog } from './useDialog.js';
import { CloseButton, useOverlayIds } from './parts.js';

export interface ActionSheetAction {
  label: ReactNode;
  icon?: ReactNode;
  onSelect?: () => void;
  /** Qaytarib bo'lmaydigan amal — text/danger. */
  destructive?: boolean;
  disabled?: boolean;
}

export interface ActionSheetProps extends Omit<HTMLAttributes<HTMLDialogElement>, 'title'> {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  message?: ReactNode;
  actions: ActionSheetAction[];
  /** `android` — Material 3 bottom sheet (ikonka + matn qatorlari) · `ios` — iOS karta, pill tugmalar. */
  platform?: 'android' | 'ios';
}

/**
 * Figma "7.10 Action sheet": joriy element uchun qisqa amallar ro'yxati, pastdan chiqadi.
 * Amal tanlanganda yopiladi; scrim bg/overlay.
 */
export function ActionSheet({
  open,
  onClose,
  title,
  message,
  actions,
  platform = 'android',
  className,
  ...rest
}: ActionSheetProps) {
  const dialog = useDialog({ open, onClose });
  const ids = useOverlayIds(Boolean(message));
  return (
    <dialog
      {...rest}
      {...dialog}
      aria-labelledby={title ? ids.titleId : undefined}
      aria-describedby={ids.descriptionId}
      className={cx('bek-overlay', 'bek-action-sheet', `bek-action-sheet--${platform}`, className)}
    >
      {platform === 'android' && <span className="bek-bottom-sheet__handle" aria-hidden="true" />}
      {(title || message) && (
        <div className="bek-action-sheet__header">
          {title && (
            <h2 id={ids.titleId} className="bek-action-sheet__title">
              {title}
            </h2>
          )}
          {message && (
            <p id={ids.descriptionId} className="bek-action-sheet__message">
              {message}
            </p>
          )}
        </div>
      )}
      <div className="bek-action-sheet__actions" role="group">
        {actions.map((action, i) => (
          <button
            key={i}
            type="button"
            disabled={action.disabled}
            className={cx(
              'bek-action-sheet__action',
              'bek-focus-ring',
              action.destructive && 'bek-action-sheet__action--destructive',
            )}
            onClick={() => {
              action.onSelect?.();
              onClose();
            }}
          >
            {platform === 'android' && action.icon && (
              <span className="bek-action-sheet__icon" aria-hidden="true">
                {action.icon}
              </span>
            )}
            {action.label}
          </button>
        ))}
      </div>
    </dialog>
  );
}

export interface ShareTarget {
  label: ReactNode;
  /** Kontakt — avatar/initsiallar; ilova — 24 px ikonka. */
  icon: ReactNode;
  onSelect?: () => void;
  /** Avatar doirasi rangi (kontaktlar): accent/soft (standart) yoki status/{tone}/soft. */
  tone?: 'accent' | 'info' | 'success' | 'warning' | 'utility';
  /** Avatar fon rangi (kontaktlar uchun), masalan `var(--bek-accent-soft)`; `tone` dan ustun. */
  tint?: string;
}

export interface ShareSheetProps
  extends Omit<HTMLAttributes<HTMLDialogElement>, 'title' | 'onCopy'> {
  open: boolean;
  onClose: () => void;
  /** Ulashilayotgan element nomi (Title/S). */
  title: ReactNode;
  /** Havola — ko'rinish va nusxa olish uchun. */
  link: string;
  /** 48 px eskiz. */
  thumbnail?: ReactNode;
  /** Odamlar qatori (gorizontal scroll). */
  contacts?: ShareTarget[];
  /** Ilova/amal nishonlari: Copy, Save, More. */
  targets?: ShareTarget[];
  /** Havola maydonini ko'rsatish. */
  showLinkField?: boolean;
  /** Nusxa olish; standart — `navigator.clipboard.writeText(link)`. */
  onCopy?: (link: string) => void;
  copyLabel?: string;
  copiedLabel?: string;
  closeLabel?: string;
}

/**
 * Figma "7.11 Share sheet": ko'rinish, odamlar, ilovalar va havola maydoni. Mobil'da imkon bo'lsa
 * tizim oynasini (`navigator.share`) afzal ko'ring; bu — web/ichki ulashish uchun.
 */
export function ShareSheet({
  open,
  onClose,
  title,
  link,
  thumbnail,
  contacts,
  targets,
  showLinkField = true,
  onCopy,
  copyLabel = 'Copy',
  copiedLabel = 'Copied',
  closeLabel = 'Close',
  className,
  ...rest
}: ShareSheetProps) {
  const dialog = useDialog({ open, onClose });
  const ids = useOverlayIds(false);
  const [copied, setCopied] = useState(false);
  const copy = () => {
    if (onCopy) onCopy(link);
    else void navigator.clipboard?.writeText(link);
    setCopied(true);
  };
  const row = (items: ShareTarget[], kind: 'contact' | 'app') => (
    <div className={`bek-share-sheet__row bek-share-sheet__row--${kind}`}>
      {items.map((item, i) => (
        <button
          key={i}
          type="button"
          className="bek-share-sheet__target bek-focus-ring"
          onClick={item.onSelect}
        >
          <span
            className={cx(
              'bek-share-sheet__circle',
              item.tone && item.tone !== 'accent' && `bek-share-sheet__circle--${item.tone}`,
            )}
            style={item.tint ? { background: item.tint } : undefined}
            aria-hidden="true"
          >
            {item.icon}
          </span>
          <span className="bek-share-sheet__name">{item.label}</span>
        </button>
      ))}
    </div>
  );
  return (
    <dialog
      {...rest}
      {...dialog}
      aria-labelledby={ids.titleId}
      className={cx('bek-overlay', 'bek-share-sheet', className)}
      onClose={() => setCopied(false)}
    >
      <span className="bek-bottom-sheet__handle" aria-hidden="true" />
      <div className="bek-share-sheet__preview">
        {thumbnail && (
          <span className="bek-share-sheet__thumb" aria-hidden="true">
            {thumbnail}
          </span>
        )}
        <div className="bek-share-sheet__text">
          <h2 id={ids.titleId} className="bek-share-sheet__title">
            {title}
          </h2>
          <span className="bek-share-sheet__link">{link.replace(/^https?:\/\//, '')}</span>
        </div>
        <CloseButton label={closeLabel} onClick={onClose} round />
      </div>
      {contacts && contacts.length > 0 && row(contacts, 'contact')}
      {targets && targets.length > 0 && row(targets, 'app')}
      {showLinkField && (
        <div className="bek-share-sheet__field">
          <span className="bek-share-sheet__url">{link}</span>
          <button type="button" className="bek-share-sheet__copy bek-focus-ring" onClick={copy}>
            <span aria-live="polite">{copied ? copiedLabel : copyLabel}</span>
          </button>
        </div>
      )}
    </dialog>
  );
}
