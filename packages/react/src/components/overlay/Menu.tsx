'use client';

import {
  cloneElement,
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../utils/cx.js';
import { ChevronRightGlyph } from '../../icons/index.js';
import { useAnchoredPosition, useDismiss, useMounted, type Placement } from './anchored.js';
import { focusTrigger, useOpenState } from './Popover.js';

export type MenuSize = 's' | 'm';

interface MenuContextValue {
  size: MenuSize;
  close: () => void;
}

const MenuContext = createContext<MenuContextValue>({ size: 'm', close: () => {} });

const useIso = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const ITEM = '[role="menuitem"],[role="menuitemcheckbox"]';

function menuItems(menu: HTMLElement) {
  return Array.from(menu.querySelectorAll<HTMLElement>(ITEM)).filter(
    (el) => el.closest('[role="menu"]') === menu && el.getAttribute('aria-disabled') !== 'true',
  );
}

function focusItem(menu: HTMLElement | null, which: 'first' | 'last') {
  if (!menu) return;
  const items = menuItems(menu);
  (which === 'first' ? items[0] : items[items.length - 1])?.focus();
}

interface MenuSurfaceProps extends HTMLAttributes<HTMLDivElement> {
  submenu?: boolean;
  /** Submenu'da ← bosilganda. */
  onRequestClose?: () => void;
}

/** role="menu" — ↑ ↓ Home End bilan harakat. */
const MenuSurface = forwardRef<HTMLDivElement, MenuSurfaceProps>(function MenuSurface(
  { submenu, onRequestClose, className, onKeyDown, ...rest },
  ref,
) {
  const { size } = useContext(MenuContext);
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    const menu = event.currentTarget;
    const items = menuItems(menu);
    const index = items.indexOf(document.activeElement as HTMLElement);
    const move = (i: number) => {
      event.preventDefault();
      event.stopPropagation();
      items[(i + items.length) % items.length]?.focus();
    };
    if (event.key === 'ArrowDown') move(index + 1);
    else if (event.key === 'ArrowUp') move(index < 0 ? -1 : index - 1);
    else if (event.key === 'Home') move(0);
    else if (event.key === 'End') move(-1);
    else if (event.key === 'ArrowLeft' && submenu && onRequestClose) {
      event.preventDefault();
      event.stopPropagation();
      onRequestClose();
    }
  };
  return (
    <div
      ref={ref}
      role="menu"
      tabIndex={-1}
      {...rest}
      onKeyDown={handleKeyDown}
      className={cx('bek-menu', `bek-menu--${size}`, submenu && 'bek-menu--submenu', className)}
    />
  );
});

export interface MenuItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** 16 px ikonka boshida. */
  icon?: ReactNode;
  /** Tezkor tugma matni: "⌘K". */
  hotkey?: ReactNode;
  /** Xavfli amal — text/danger, hover status/danger/soft. */
  danger?: boolean;
  disabled?: boolean;
  /** Berilsa — `menuitemcheckbox` (`aria-checked`), tanlangan fon fill/strong. */
  selected?: boolean;
  /** Tanlanganda (menyu yopiladi). */
  onSelect?: () => void;
  /** Ichki menyu (Context submenu): MenuItem'lar. */
  submenu?: ReactNode;
  children: ReactNode;
}

/** Figma "Menu item": Dropdown va Context menu elementi. S 32 · M 40. */
export function MenuItem({
  icon,
  hotkey,
  danger = false,
  disabled = false,
  selected,
  onSelect,
  submenu,
  className,
  children,
  ...rest
}: MenuItemProps) {
  const ctx = useContext(MenuContext);
  const [subOpen, setSubOpen] = useState(false);
  const [flip, setFlip] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const focusSub = useRef(false);
  useIso(() => {
    if (!subOpen || !subRef.current) return;
    const rect = subRef.current.getBoundingClientRect();
    if (!flip && rect.right > window.innerWidth - 8) setFlip(true);
    if (focusSub.current) {
      focusSub.current = false;
      focusItem(subRef.current, 'first');
    }
  }, [subOpen]);

  const activate = () => {
    if (disabled) return;
    if (submenu) {
      focusSub.current = true;
      setSubOpen(true);
      return;
    }
    onSelect?.();
    ctx.close();
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'Enter' || event.key === ' ' || (submenu && event.key === 'ArrowRight')) {
      event.preventDefault();
      event.stopPropagation();
      activate();
    }
  };

  return (
    <div
      {...rest}
      ref={itemRef}
      role={selected === undefined ? 'menuitem' : 'menuitemcheckbox'}
      aria-checked={selected}
      aria-disabled={disabled || undefined}
      aria-haspopup={submenu ? 'menu' : undefined}
      aria-expanded={submenu ? subOpen : undefined}
      tabIndex={-1}
      className={cx(
        'bek-menu-item',
        danger && 'bek-menu-item--danger',
        selected && 'bek-menu-item--selected',
        className,
      )}
      onClick={(event: MouseEvent<HTMLDivElement>) => {
        if (subRef.current?.contains(event.target as Node)) return;
        activate();
      }}
      onKeyDown={onKeyDown}
      onPointerEnter={(event: PointerEvent<HTMLDivElement>) => {
        if (event.pointerType === 'mouse' && !disabled) {
          itemRef.current?.focus({ preventScroll: true });
          if (submenu) setSubOpen(true);
        }
      }}
      onPointerLeave={(event: PointerEvent<HTMLDivElement>) => {
        if (event.pointerType === 'mouse' && submenu) setSubOpen(false);
      }}
    >
      {icon && (
        <span className="bek-menu-item__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="bek-menu-item__label">{children}</span>
      {hotkey && <kbd className="bek-menu-item__hotkey">{hotkey}</kbd>}
      {submenu && (
        <span className="bek-menu-item__arrow" aria-hidden="true">
          <ChevronRightGlyph />
        </span>
      )}
      {submenu && subOpen && (
        <MenuSurface
          ref={subRef}
          submenu
          className={cx('bek-menu--nested', flip && 'bek-menu--nested-flip')}
          onRequestClose={() => {
            setSubOpen(false);
            itemRef.current?.focus();
          }}
        >
          {submenu}
        </MenuSurface>
      )}
    </div>
  );
}

/** Figma "Menu group label": guruh sarlavhasi (Label/S, text/tertiary). */
export function MenuGroupLabel({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div role="presentation" {...rest} className={cx('bek-menu-label', className)} />;
}

/** Figma "Menu separator": boshqa mazmunli guruhni ajratadi. */
export function MenuSeparator({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div role="separator" {...rest} className={cx('bek-menu-separator', className)} />;
}

type TriggerProps = {
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
  'aria-expanded'?: boolean;
  'aria-controls'?: string;
  'aria-haspopup'?: 'menu';
};

export interface DropdownMenuProps {
  /** Ochuvchi element (Button). ↓/↑ ham ochadi. */
  trigger: ReactElement<TriggerProps>;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: Placement;
  /** Elementlar balandligi: s 32 · m 40. */
  size?: MenuSize;
  /** MenuItem, MenuGroupLabel, MenuSeparator. */
  children: ReactNode;
  'aria-label'?: string;
  className?: string;
}

/**
 * Figma "7.4 Dropdown menu": trigger bosilganda ochiladigan elementlar ro'yxati. Kenglik 240,
 * surface/raised, radius 8, Elevation/2, padding 4.
 */
export function DropdownMenu({
  trigger,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  placement = 'bottom-start',
  size = 'm',
  children,
  'aria-label': ariaLabel,
  className,
}: DropdownMenuProps) {
  const id = useId();
  const [open, setOpen] = useOpenState(openProp, defaultOpen, onOpenChange);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const initialFocus = useRef<'first' | 'last'>('first');
  const mounted = useMounted();
  useAnchoredPosition(open, anchorRef, menuRef, placement, 4);
  const close = (returnFocus = true) => {
    setOpen(false);
    if (returnFocus) focusTrigger(anchorRef.current);
  };
  useDismiss(open, (reason) => close(reason === 'escape'), [anchorRef, menuRef]);
  useEffect(() => {
    if (open) focusItem(menuRef.current, initialFocus.current);
  }, [open]);

  const anchor = (
    <span ref={anchorRef} className="bek-anchor">
      {cloneElement(trigger, {
        'aria-haspopup': 'menu',
        'aria-expanded': open,
        'aria-controls': open ? id : undefined,
        onClick: (event: MouseEvent<HTMLElement>) => {
          trigger.props.onClick?.(event);
          initialFocus.current = 'first';
          setOpen(!open);
        },
        onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
          trigger.props.onKeyDown?.(event);
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            initialFocus.current = event.key === 'ArrowDown' ? 'first' : 'last';
            setOpen(true);
          }
        },
      })}
    </span>
  );
  return (
    <MenuContext.Provider value={{ size, close: () => close() }}>
      {anchor}
      {open &&
        mounted &&
        createPortal(
          <MenuSurface
            ref={menuRef}
            id={id}
            aria-label={ariaLabel}
            className={cx('bek-menu--floating', className)}
            onKeyDown={(event) => {
              if (event.key === 'Tab') close(false);
            }}
          >
            {children}
          </MenuSurface>,
          document.body,
        )}
    </MenuContext.Provider>
  );
}

export interface ContextMenuProps {
  /** Menyu mazmuni: MenuItem'lar. */
  menu: ReactNode;
  size?: MenuSize;
  /** O'ng tugma (yoki mobil'da uzoq bosish) bilan menyu ochiladigan hudud. */
  children: ReactNode;
  'aria-label'?: string;
  className?: string;
}

/**
 * Figma "7.5 Context menu": o'ng tugma (mobil — uzoq bosish, 500 ms) bilan kursor nuqtasidan
 * ochiladi. Dropdown menu bilan bir xil sirt va MenuItem.
 */
export function ContextMenu({
  menu,
  size = 'm',
  children,
  'aria-label': ariaLabel,
  className,
}: ContextMenuProps) {
  const [point, setPoint] = useState<DOMRect | null>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const mounted = useMounted();
  const open = point !== null;
  useAnchoredPosition(open, point, menuRef, 'bottom-start', 0);
  useDismiss(open, () => setPoint(null), [menuRef]);
  useEffect(() => {
    if (open) focusItem(menuRef.current, 'first');
  }, [open]);
  const openAt = (x: number, y: number) => setPoint(new DOMRect(x, y, 0, 0));
  const cancelPress = () => clearTimeout(timer.current);

  return (
    <MenuContext.Provider value={{ size, close: () => setPoint(null) }}>
      <div
        ref={areaRef}
        className={cx('bek-context-area', className)}
        onContextMenu={(event) => {
          event.preventDefault();
          openAt(event.clientX, event.clientY);
        }}
        onPointerDown={(event) => {
          if (event.pointerType !== 'touch') return;
          const { clientX, clientY } = event;
          timer.current = setTimeout(() => openAt(clientX, clientY), 500);
        }}
        onPointerUp={cancelPress}
        onPointerMove={cancelPress}
        onPointerCancel={cancelPress}
      >
        {children}
      </div>
      {open &&
        mounted &&
        createPortal(
          <MenuSurface
            ref={menuRef}
            aria-label={ariaLabel}
            className="bek-menu--floating"
            onKeyDown={(event) => {
              if (event.key === 'Tab') setPoint(null);
            }}
          >
            {menu}
          </MenuSurface>,
          document.body,
        )}
    </MenuContext.Provider>
  );
}
