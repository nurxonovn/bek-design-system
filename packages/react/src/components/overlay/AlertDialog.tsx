'use client';

import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { StatusGlyph } from '../../icons/index.js';
import { useDialog } from './useDialog.js';
import { ActionButton, useOverlayIds, type OverlayAction } from './parts.js';

export type AlertDialogVariant = 'info' | 'success' | 'warning' | 'danger';

export interface AlertDialogProps extends Omit<HTMLAttributes<HTMLDialogElement>, 'title'> {
  open: boolean;
  /** Faqat tugmalar orqali chaqiriladi (Esc va scrim yopmaydi). */
  onClose: () => void;
  variant?: AlertDialogVariant;
  /** `inline` — tugmalar yonma-yon · `stacked` — to'liq kenglikda, ustma-ust (mobil). */
  layout?: 'inline' | 'stacked';
  /** Title/L — savol shaklida: "Delete this order?". */
  title: ReactNode;
  description?: ReactNode;
  /** Tasdiqlash — Action (danger — Danger) tugma. */
  confirmAction: OverlayAction;
  /** Bekor qilish — Normal tugma; `onClick` bo'lmasa — `onClose`. */
  cancelAction?: OverlayAction;
  /** 48 px holat belgisi; `null` — yashirin. */
  icon?: ReactNode;
}

/**
 * Figma "7.6 Alert dialog": javob talab qiladigan to'xtatuvchi dialog. Yopish tugmasi yo'q,
 * Esc va scrim bilan yopilmaydi — faqat tugma orqali. `role="alertdialog"`.
 */
export function AlertDialog({
  open,
  onClose,
  variant = 'info',
  layout = 'inline',
  title,
  description,
  confirmAction,
  cancelAction,
  icon,
  className,
  ...rest
}: AlertDialogProps) {
  const dialog = useDialog({ open, onClose, dismissible: false });
  const ids = useOverlayIds(Boolean(description));
  const stacked = layout === 'stacked';
  const size = stacked ? 'l' : 'm';
  const confirm = (
    <ActionButton
      action={confirmAction}
      variant={variant === 'danger' ? 'danger' : 'action'}
      size={size}
    />
  );
  const cancel = cancelAction && (
    <ActionButton action={cancelAction} variant="normal" size={size} fallback={onClose} />
  );
  const badge = icon === undefined ? <StatusGlyph tone={variant} variant="stroke" /> : icon;
  return (
    <dialog
      {...rest}
      {...dialog}
      role="alertdialog"
      aria-labelledby={ids.titleId}
      aria-describedby={ids.descriptionId}
      className={cx(
        'bek-overlay',
        'bek-alert-dialog',
        `bek-alert-dialog--${variant}`,
        `bek-alert-dialog--${layout}`,
        className,
      )}
    >
      {badge && (
        <span className="bek-alert-dialog__badge" aria-hidden="true">
          {badge}
        </span>
      )}
      <div className="bek-alert-dialog__text">
        <h2 id={ids.titleId} className="bek-alert-dialog__title">
          {title}
        </h2>
        {description && (
          <p id={ids.descriptionId} className="bek-overlay__description">
            {description}
          </p>
        )}
      </div>
      <div className="bek-alert-dialog__actions">
        {stacked ? (
          <>
            {confirm}
            {cancel}
          </>
        ) : (
          <>
            {cancel}
            {confirm}
          </>
        )}
      </div>
    </dialog>
  );
}
