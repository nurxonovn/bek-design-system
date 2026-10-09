import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { CloseGlyph, StatusGlyph, type StatusTone } from '../../icons/index.js';

export type ToastVariant = 'solid' | 'subtle';
export type ToastTone = StatusTone;

export interface ToastAction {
  label: ReactNode;
  onClick?: () => void;
}

export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** `solid` — to'q fon, kuchli signal; `subtle` — yumshoq fon. */
  variant?: ToastVariant;
  /** Ma'no: neutral · info · success · warning · danger. */
  tone?: ToastTone;
  /** Qisqa sarlavha — natija ("Saved", "Payment failed"). */
  title: ReactNode;
  /** Ixtiyoriy izoh — bir-ikki qator. */
  description?: ReactNode;
  /** Bitta amal: "Undo", "Retry". */
  action?: ToastAction;
  /** Berilsa — yopish tugmasi chiqadi. */
  onClose?: () => void;
  /** Yopish tugmasi nomi (ekran o'quvchi uchun). */
  closeLabel?: string;
  /** Standart holat ikonkasi o'rniga; `null` — ikonkasiz. */
  icon?: ReactNode;
}

/** Figma "5.1 Toast": qisqa vaqtli xabar. Elevation/3, z/toast. Taymerni ilova boshqaradi. */
export function Toast({
  variant = 'solid',
  tone = 'neutral',
  title,
  description,
  action,
  onClose,
  closeLabel = 'Close',
  icon,
  className,
  role,
  ...rest
}: ToastProps) {
  const glyph = icon === undefined ? <StatusGlyph tone={tone} /> : icon;
  return (
    <div
      role={role ?? (tone === 'danger' || tone === 'warning' ? 'alert' : 'status')}
      {...rest}
      className={cx('bek-toast', `bek-toast--${variant}`, `bek-toast--${tone}`, className)}
    >
      {glyph && (
        <span
          className={cx('bek-toast__icon', tone === 'neutral' && 'bek-toast__icon--lg')}
          aria-hidden="true"
        >
          {glyph}
        </span>
      )}
      <div className="bek-toast__body">
        <p className="bek-toast__title">{title}</p>
        {description && <p className="bek-toast__description">{description}</p>}
      </div>
      {action && (
        <button type="button" className="bek-toast__action bek-focus-ring" onClick={action.onClick}>
          {action.label}
        </button>
      )}
      {onClose && (
        <button
          type="button"
          className="bek-toast__close bek-focus-ring"
          aria-label={closeLabel}
          onClick={onClose}
        >
          <CloseGlyph />
        </button>
      )}
    </div>
  );
}

export interface ToastViewportProps extends HTMLAttributes<HTMLDivElement> {
  /** Joylashuv: mobil — pastda markazda; keng ekranda — burchakda. */
  placement?: 'bottom' | 'top' | 'bottom-end' | 'top-end';
}

/** Toast'lar uchun qatlam: `position: fixed`, z/toast, oralig'i 8 px. */
export function ToastViewport({ placement = 'bottom', className, ...rest }: ToastViewportProps) {
  return (
    <div
      {...rest}
      className={cx('bek-toast-viewport', `bek-toast-viewport--${placement}`, className)}
    />
  );
}
