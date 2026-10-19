import type { HTMLAttributes, ReactNode } from 'react';
import { Badge, cx, Spinner, type BadgeColor } from '@bek/react';

export type AgentNodeStatus = 'idle' | 'running' | 'success' | 'error';

const STATUS: Record<AgentNodeStatus, { color: BadgeColor; label: string }> = {
  idle: { color: 'neutral', label: 'Idle' },
  running: { color: 'accent', label: 'Running' },
  success: { color: 'success', label: 'Done' },
  error: { color: 'danger', label: 'Failed' },
};

export interface AgentNodeProps extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'children'> {
  /** Qadam nima qiladi: "Summarize with AI" (Figma `Title`). */
  title: ReactNode;
  /** Qadam turi: "LLM step", "HTTP", "Filter" (Figma `Type`). */
  type?: ReactNode;
  /** Ikonka plitkasi ichidagi glyph (Figma `_Icon` swap). Standart — AI uchqunlari. */
  icon?: ReactNode;
  /** Ishga tushirish holati — ma'lumot (hover emas): `idle` · `running` · `success` · `error`. */
  status?: AgentNodeStatus;
  /** Holat badge matni. Standart: Idle · Running · Done · Failed. */
  statusLabel?: string;
  /** Meta qatori: progress ("Processing 12 of 40 items"), davomiylik yoki xato sababi + keyingi qadam. */
  meta?: ReactNode;
  /** Kirish/chiqish portlari (vertikal markazda, `DiagramConnector` ulanadi). Standart: true. */
  ports?: boolean;
  /** Bosilganda qadam sozlamalari ochiladi — butun tugun havola bo'ladi. */
  href?: string;
}

function SparkleGlyph() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path
        d="M6 1.5 7.1 4.9 10.5 6 7.1 7.1 6 10.5 4.9 7.1 1.5 6 4.9 4.9ZM11.5 9 12.1 10.9 14 11.5 12.1 12.1 11.5 14 10.9 12.1 9 11.5 10.9 10.9Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Figma "4.19 Diagram · Agent node": avtomatlashtirish / AI-agent oqimining bitta qadami va uning
 * jonli holati. Running — `border/accent` halqa va spinner, Error — `border/danger` halqa va sabab.
 */
export function AgentNode({
  title,
  type,
  icon,
  status = 'idle',
  statusLabel,
  meta,
  ports = true,
  href,
  className,
  ...rest
}: AgentNodeProps) {
  const s = STATUS[status];
  const body = (
    <>
      <span className="bek-agent-node__head">
        <span className="bek-agent-node__icon" aria-hidden="true">
          {icon ?? <SparkleGlyph />}
        </span>
        <span className="bek-agent-node__text">
          <span className="bek-agent-node__title">{title}</span>
          {type != null && <span className="bek-agent-node__type">{type}</span>}
        </span>
        <span className="bek-agent-node__status" role="status">
          <Badge
            variant="subtle"
            size="s"
            color={s.color}
            dot={status !== 'running'}
            icon={status === 'running' ? <Spinner label={null} /> : undefined}
          >
            {statusLabel ?? s.label}
          </Badge>
        </span>
      </span>
      {meta != null && <span className="bek-agent-node__meta">{meta}</span>}
      {ports && (
        <>
          <span className="bek-agent-node__port bek-agent-node__port--in" aria-hidden="true" />
          <span className="bek-agent-node__port bek-agent-node__port--out" aria-hidden="true" />
        </>
      )}
    </>
  );
  const classes = cx(
    'bek-diagram',
    'bek-agent-node',
    `bek-agent-node--${status}`,
    href && 'bek-agent-node--link',
    className,
  );
  if (href)
    return (
      <a {...rest} href={href} className={cx(classes, 'bek-focus-ring')}>
        {body}
      </a>
    );
  return (
    <div {...rest} className={classes}>
      {body}
    </div>
  );
}
