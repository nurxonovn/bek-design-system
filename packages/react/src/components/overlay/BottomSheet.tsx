import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { useDialog } from './useDialog.js';
import { ActionButton, CloseButton, useOverlayIds, type OverlayAction } from './parts.js';

export type BottomSheetType = 'default' | 'content' | 'promo';

export interface BottomSheetProps extends Omit<HTMLAttributes<HTMLDialogElement>, 'title'> {
  open: boolean;
  onClose: () => void;
  /** `default` — sarlavha + kontent + tugma · `content` — rasm, matn, CTA · `promo` — to'liq rasm, markazdagi sarlavha. */
  type?: BottomSheetType;
  title: ReactNode;
  /** Body/M text/secondary. */
  description?: ReactNode;
  /** `content`/`promo` uchun rasm. */
  media?: ReactNode;
  /** Ixtiyoriy kontent (default turida — slot). */
  children?: ReactNode;
  /** Asosiy amal — Action XL, to'liq kenglik. */
  primaryAction?: OverlayAction;
  /** Ikkinchi amal ("Not now") — Flat secondary XL. */
  secondaryAction?: OverlayAction;
  /** Tortish dastagi (36×4). */
  showHandle?: boolean;
  /** Yopish tugmasi (promo'dan tashqari). */
  showClose?: boolean;
  closeLabel?: string;
}

/**
 * Figma "7.1 Sheet" + "7.9 Bottom sheet": pastdan chiqadigan panel. surface/raised,
 * yuqori radius 24, dastak 36×4; scrim bg/overlay; footer home indicator'ni hisobga oladi.
 */
export function BottomSheet({
  open,
  onClose,
  type = 'default',
  title,
  description,
  media,
  children,
  primaryAction,
  secondaryAction,
  showHandle = true,
  showClose = true,
  closeLabel = 'Close',
  className,
  ...rest
}: BottomSheetProps) {
  const dialog = useDialog({ open, onClose });
  const ids = useOverlayIds(Boolean(description));
  const promo = type === 'promo';
  return (
    <dialog
      {...rest}
      {...dialog}
      aria-labelledby={ids.titleId}
      aria-describedby={ids.descriptionId}
      className={cx('bek-overlay', 'bek-bottom-sheet', `bek-bottom-sheet--${type}`, className)}
    >
      {promo && media && <div className="bek-bottom-sheet__hero">{media}</div>}
      {showHandle && <span className="bek-bottom-sheet__handle" aria-hidden="true" />}
      <div className="bek-bottom-sheet__body bek-scrollbar">
        {promo ? (
          <h2 id={ids.titleId} className="bek-bottom-sheet__promo-title">
            {title}
          </h2>
        ) : (
          <div className="bek-bottom-sheet__header">
            <h2 id={ids.titleId} className="bek-overlay__title">
              {title}
            </h2>
            {showClose && <CloseButton label={closeLabel} onClick={onClose} round />}
          </div>
        )}
        {!promo && media && <div className="bek-bottom-sheet__media">{media}</div>}
        {description && (
          <p id={ids.descriptionId} className="bek-bottom-sheet__description">
            {description}
          </p>
        )}
        {children}
      </div>
      {(primaryAction || secondaryAction) && (
        <div className="bek-bottom-sheet__footer">
          {primaryAction && <ActionButton action={primaryAction} variant="action" size="xl" />}
          {secondaryAction && (
            <ActionButton
              action={secondaryAction}
              variant="flat-secondary"
              size="xl"
              fallback={onClose}
            />
          )}
        </div>
      )}
    </dialog>
  );
}
