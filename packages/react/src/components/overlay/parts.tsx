import { useId, type ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { CloseGlyph } from '../../icons/index.js';
import { Button, type ButtonVariant } from '../button/Button.js';

export interface OverlayAction {
  label: ReactNode;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

/** Sarlavha va izoh uchun id'lar — `aria-labelledby` / `aria-describedby`. */
export function useOverlayIds(hasDescription: boolean) {
  const id = useId();
  return {
    titleId: `${id}-title`,
    descriptionId: hasDescription ? `${id}-description` : undefined,
  };
}

export function CloseButton({
  label,
  onClick,
  round = false,
  small = false,
}: {
  label: string;
  onClick: () => void;
  round?: boolean;
  /** 20 px tugma, 16 px ikonka (Popover). */
  small?: boolean;
}) {
  return (
    <button
      type="button"
      className={cx(
        'bek-overlay-close',
        round && 'bek-overlay-close--round',
        small && 'bek-overlay-close--small',
        'bek-focus-ring',
      )}
      aria-label={label}
      onClick={onClick}
    >
      <CloseGlyph />
    </button>
  );
}

export function ActionButton({
  action,
  variant,
  size,
  fallback,
  className,
}: {
  action: OverlayAction;
  variant: ButtonVariant;
  size: 'm' | 'l' | 'xl';
  fallback?: () => void;
  className?: string;
}) {
  return (
    <Button
      variant={variant}
      size={size}
      loading={action.loading}
      disabled={action.disabled}
      onClick={action.onClick ?? fallback}
      className={className}
    >
      {action.label}
    </Button>
  );
}
