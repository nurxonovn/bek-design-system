import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { useDialog } from './useDialog.js';
import { ActionButton, CloseButton, useOverlayIds, type OverlayAction } from './parts.js';

interface DialogBaseProps extends Omit<HTMLAttributes<HTMLDialogElement>, 'title'> {
  open: boolean;
  /** Esc, scrim yoki yopish tugmasi. */
  onClose: () => void;
  /** Headline/S. */
  title: ReactNode;
  /** Body/S text/secondary. */
  description?: ReactNode;
  children?: ReactNode;
  /** Asosiy amal: Action (Danger variantida — Danger) tugma. */
  primaryAction?: OverlayAction;
  /** Bekor qilish: Outline tugma; `onClick` bo'lmasa — `onClose`. */
  cancelAction?: OverlayAction;
  /** Tayyor tugmalar o'rniga o'z footer'ingiz. */
  footer?: ReactNode;
  /** Yopish (×) tugmasini yashirish. */
  hideClose?: boolean;
  closeLabel?: string;
}

export interface ModalProps extends DialogBaseProps {
  /** S 480 · M 720 · L 900 px. */
  size?: 's' | 'm' | 'l';
  /** `danger` — qaytarib bo'lmaydigan amal (asosiy tugma Danger). */
  variant?: 'default' | 'danger';
}

function Header({
  title,
  description,
  ids,
  onClose,
  hideClose,
  closeLabel,
}: {
  title: ReactNode;
  description?: ReactNode;
  ids: ReturnType<typeof useOverlayIds>;
  onClose: () => void;
  hideClose: boolean;
  closeLabel: string;
}) {
  return (
    <div className="bek-overlay__header">
      <div className="bek-overlay__heading">
        <h2 id={ids.titleId} className="bek-overlay__title">
          {title}
        </h2>
        {description && (
          <p id={ids.descriptionId} className="bek-overlay__description">
            {description}
          </p>
        )}
      </div>
      {!hideClose && <CloseButton label={closeLabel} onClick={onClose} />}
    </div>
  );
}

function Footer({
  footer,
  primaryAction,
  cancelAction,
  danger,
  onClose,
}: {
  footer?: ReactNode;
  primaryAction?: OverlayAction;
  cancelAction?: OverlayAction;
  danger: boolean;
  onClose: () => void;
}) {
  if (!footer && !primaryAction && !cancelAction) return null;
  return (
    <div className="bek-overlay__footer">
      {footer ?? (
        <>
          {cancelAction && (
            <ActionButton action={cancelAction} variant="outline" size="m" fallback={onClose} />
          )}
          {primaryAction && (
            <ActionButton action={primaryAction} variant={danger ? 'danger' : 'action'} size="m" />
          )}
        </>
      )}
    </div>
  );
}

/**
 * Figma "7.1 Modal": markazda ochiladigan bloklovchi oyna. surface/raised, radius 16,
 * Elevation/4; chegarasiz. Esc va scrim yopadi; fokus ichida ushlanadi.
 */
export function Modal({
  open,
  onClose,
  size = 'm',
  variant = 'default',
  title,
  description,
  children,
  primaryAction,
  cancelAction,
  footer,
  hideClose = false,
  closeLabel = 'Close',
  className,
  ...rest
}: ModalProps) {
  const dialog = useDialog({ open, onClose });
  const ids = useOverlayIds(Boolean(description));
  return (
    <dialog
      {...rest}
      {...dialog}
      aria-labelledby={ids.titleId}
      aria-describedby={ids.descriptionId}
      className={cx('bek-overlay', 'bek-modal', `bek-modal--${size}`, className)}
    >
      <Header {...{ title, description, ids, onClose, hideClose, closeLabel }} />
      {children && <div className="bek-overlay__body bek-scrollbar">{children}</div>}
      <Footer
        footer={footer}
        primaryAction={primaryAction}
        cancelAction={cancelAction}
        danger={variant === 'danger'}
        onClose={onClose}
      />
    </dialog>
  );
}

export interface DrawerProps extends DialogBaseProps {
  /** Qaysi chetdan chiqadi. */
  side?: 'right' | 'left';
  /** S 360 · M 480 · L 640 px. */
  size?: 's' | 'm' | 'l';
  /** Sarlavha ostida chiziq. */
  divider?: boolean;
}

/**
 * Figma "7.2 Drawer": ekran chetidan chiqadigan bloklovchi panel. Pastdan chiqadigan
 * panel uchun — BottomSheet.
 */
export function Drawer({
  open,
  onClose,
  side = 'right',
  size = 'm',
  divider = true,
  title,
  description,
  children,
  primaryAction,
  cancelAction,
  footer,
  hideClose = false,
  closeLabel = 'Close',
  className,
  ...rest
}: DrawerProps) {
  const dialog = useDialog({ open, onClose });
  const ids = useOverlayIds(Boolean(description));
  return (
    <dialog
      {...rest}
      {...dialog}
      aria-labelledby={ids.titleId}
      aria-describedby={ids.descriptionId}
      className={cx(
        'bek-overlay',
        'bek-drawer',
        `bek-drawer--${side}`,
        `bek-drawer--${size}`,
        divider && 'bek-drawer--divider',
        className,
      )}
    >
      <Header {...{ title, description, ids, onClose, hideClose, closeLabel }} />
      <div className="bek-overlay__body bek-scrollbar">{children}</div>
      <Footer
        footer={footer}
        primaryAction={primaryAction}
        cancelAction={cancelAction}
        danger={false}
        onClose={onClose}
      />
    </dialog>
  );
}
