import type { HTMLAttributes, ReactNode } from 'react';
import { Avatar, Badge, cx } from '@bek/react';
import { formatNumber } from '../../core/format.js';

export interface OrgCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role'> {
  /** Ism — bir qatorda qisqaradi, to'liq ism `title` tooltip'ida; Avatar bosh harflari ham shundan. */
  name: string;
  /** Lavozim: "Head of Retail" (Caption/M · text/secondary). Figma `Role`. */
  role?: ReactNode;
  /** Bo'lim: "Retail banking" (Caption/S · text/tertiary). Figma `Team`. */
  team?: ReactNode;
  /** Avatar rasmi manzili; bo'lmasa — bosh harflar (4.1 Avatar, Size M). */
  avatar?: string;
  /** Bo'ysunuvchilar soni — Collapsed'da `+N` Badge. */
  reports?: number;
  /** Shox yig'ilgan (Figma `Variant=Collapsed`): yashirin bo'ysunuvchilar Badge'da sanaladi. */
  collapsed?: boolean;
  /** Tanlangan — `border/accent` halqa (tafsilotlar paneli ochiq). */
  selected?: boolean;
  /**
   * Shoxni ochish/yig'ish. Berilsa `+N` tugmaga aylanadi (`aria-expanded`). Server Component'dan
   * funksiya uzatib bo'lmaydi — bu prop'ni client fayl ichida bering.
   */
  onToggle?: () => void;
  /** Daraxt ichida (`role="tree"`) `treeitem` beriladi; standart — rol yo'q. */
  nodeRole?: 'treeitem';
}

/**
 * Figma "4.19 Diagram · Org card": tashkiliy tuzilma va tasdiqlash zanjirlari uchun shaxs tuguni.
 * Ota yuqorida, bolalar pastda; ulanish `DiagramConnector` (`variant="elbow" direction="vertical"`).
 */
export function OrgCard({
  name,
  role,
  team,
  avatar,
  reports,
  collapsed = false,
  selected = false,
  onToggle,
  nodeRole,
  className,
  ...rest
}: OrgCardProps) {
  const hasReports = reports != null && reports > 0;
  const count = hasReports ? `+${formatNumber(reports)}` : null;
  const badge = count && (
    <Badge variant="subtle" size="s" dot>
      {count}
    </Badge>
  );
  return (
    <div
      {...rest}
      role={nodeRole}
      aria-expanded={nodeRole && hasReports ? !collapsed : undefined}
      aria-selected={nodeRole ? selected : undefined}
      className={cx(
        'bek-diagram',
        'bek-org-card',
        collapsed ? 'bek-org-card--collapsed' : 'bek-org-card--default',
        selected && 'bek-org-card--selected',
        className,
      )}
    >
      <Avatar className="bek-org-card__avatar" name={name} src={avatar} size="m" />
      <span className="bek-org-card__text">
        <span className="bek-org-card__name" title={name}>
          {name}
        </span>
        {role != null && <span className="bek-org-card__role">{role}</span>}
        {team != null && <span className="bek-org-card__team">{team}</span>}
      </span>
      {onToggle && hasReports ? (
        <button
          type="button"
          className="bek-org-card__toggle bek-focus-ring"
          aria-expanded={!collapsed}
          aria-label={`${collapsed ? 'Show' : 'Hide'} ${reports} reports`}
          onClick={onToggle}
        >
          {collapsed ? (
            badge
          ) : (
            <Badge variant="outline" size="s">
              {formatNumber(reports)}
            </Badge>
          )}
        </button>
      ) : (
        collapsed && badge
      )}
    </div>
  );
}
