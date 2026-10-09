import {
  createContext,
  useContext,
  useId,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx.js';
import { Badge } from '../badge/Badge.js';

export type TabsType = 'underline' | 'pill' | 'segmented';
export type TabsSize = 's' | 'm' | 'l';
export type TabsWidth = 'hug' | 'fill';

interface TabsContextValue {
  baseId: string;
  value: string | undefined;
  select: (value: string) => void;
  type: TabsType;
  size: TabsSize;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs(component: string) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error(`<${component}> <Tabs> ichida bo'lishi kerak`);
  return ctx;
}

const safe = (value: string) => value.replace(/[^\w-]/g, '_');

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  /** Boshqariladigan qiymat. */
  value?: string;
  /** Boshqarilmaydigan boshlang'ich qiymat. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** `underline` — sahifa bo'limlari; `pill` — filtr qatori; `segmented` — ixcham almashtirgich. */
  type?: TabsType;
  /** Balandlik: s 32 · m 40 · l 48 px. */
  size?: TabsSize;
  children: ReactNode;
}

/** Figma "6.1 Tabs": bir sahifadagi bo'limlar orasida almashish (WAI-ARIA tabs). */
export function Tabs({
  value,
  defaultValue,
  onValueChange,
  type = 'underline',
  size = 'm',
  className,
  children,
  ...rest
}: TabsProps) {
  const baseId = useId();
  const [inner, setInner] = useState(defaultValue);
  const current = value ?? inner;
  const select = (next: string) => {
    if (value === undefined) setInner(next);
    onValueChange?.(next);
  };
  return (
    <TabsContext.Provider value={{ baseId, value: current, select, type, size }}>
      <div {...rest} className={cx('bek-tabs', className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export interface TabListProps extends HTMLAttributes<HTMLDivElement> {
  /** `hug` — matn bo'yicha; `fill` — butun kenglik bo'ylab teng. */
  width?: TabsWidth;
  children: ReactNode;
}

/** Tab'lar qatori. ← → / Home / End bilan harakat, fokus bilan birga tanlanadi. */
export function TabList({ width = 'hug', className, onKeyDown, children, ...rest }: TabListProps) {
  const { type, size } = useTabs('TabList');
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    const tabs = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)'),
    );
    const index = tabs.indexOf(document.activeElement as HTMLButtonElement);
    if (index === -1) return;
    const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
    const step = { ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1 }[event.key];
    let next: HTMLButtonElement | undefined;
    if (step) next = tabs[(index + step + tabs.length) % tabs.length];
    else if (event.key === 'Home') next = tabs[0];
    else if (event.key === 'End') next = tabs[tabs.length - 1];
    if (!next) return;
    event.preventDefault();
    next.focus();
    next.click();
  };
  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      {...rest}
      onKeyDown={handleKeyDown}
      className={cx(
        'bek-tab-list',
        `bek-tab-list--${type}`,
        `bek-tab-list--${size}`,
        `bek-tab-list--${width}`,
        className,
      )}
    >
      {children}
    </div>
  );
}

export interface TabProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  value: string;
  /** Matndan oldingi ikonka (s 16 · m 20 · l 24 px). */
  icon?: ReactNode;
  /** Hisoblagich — Badge Subtle · Accent · S. */
  badge?: ReactNode;
  children: ReactNode;
}

/** Figma "Tab item": bitta tab. Indikator element ichida. */
export function Tab({ value, icon, badge, className, onClick, children, ...rest }: TabProps) {
  const ctx = useTabs('Tab');
  const selected = ctx.value === value;
  return (
    <button
      type="button"
      role="tab"
      id={`${ctx.baseId}-tab-${safe(value)}`}
      aria-selected={selected}
      aria-controls={`${ctx.baseId}-panel-${safe(value)}`}
      tabIndex={selected ? 0 : -1}
      {...rest}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) ctx.select(value);
      }}
      className={cx('bek-tab', 'bek-focus-ring', className)}
    >
      {icon && (
        <span className="bek-tab__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="bek-tab__label">{children}</span>
      {badge !== undefined && (
        <Badge variant="subtle" color="accent" size="s">
          {badge}
        </Badge>
      )}
    </button>
  );
}

export interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  /** Tanlanmagan panelni DOM'da saqlash (holatni yo'qotmaslik uchun). */
  keepMounted?: boolean;
}

/** Tab mazmuni. Tanlanmaganda yashiriladi. */
export function TabPanel({
  value,
  keepMounted = false,
  className,
  children,
  ...rest
}: TabPanelProps) {
  const ctx = useTabs('TabPanel');
  const selected = ctx.value === value;
  if (!selected && !keepMounted) return null;
  return (
    <div
      role="tabpanel"
      id={`${ctx.baseId}-panel-${safe(value)}`}
      aria-labelledby={`${ctx.baseId}-tab-${safe(value)}`}
      tabIndex={0}
      hidden={!selected}
      {...rest}
      className={cx('bek-tab-panel', 'bek-focus-ring', className)}
    >
      {children}
    </div>
  );
}
