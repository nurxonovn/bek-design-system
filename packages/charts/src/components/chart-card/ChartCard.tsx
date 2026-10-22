import { useId, type HTMLAttributes, type ReactNode } from 'react';
import { cx, EmptyState, SegmentedControl, Skeleton, type SegmentedOption } from '@bek-ui/react';
import { Delta } from '../delta/Delta.js';

export type ChartCardState = 'default' | 'loading' | 'empty' | 'error';

export interface ChartCardKpi {
  /** Formatlangan asosiy qiymat: `4 820 mln`. */
  value: ReactNode;
  /** O'zgarish, foizda — `Delta` chiqadi. */
  delta?: number;
  betterWhen?: 'up' | 'down';
  /** Taqqoslash izohi: "vs previous 6 months". */
  comparison?: ReactNode;
}

export interface ChartCardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Ma'lumot holati: `default` · `loading` (chart shaklida skeleton) · `empty` · `error`. */
  state?: ChartCardState;
  /** Davr tanlagich (3.10 Segmented control): 1M · 6M · 1Y. */
  periods?: SegmentedOption[];
  period?: string;
  onPeriodChange?: (value: string) => void;
  /** KPI qatori: qiymat + Delta + taqqoslash. */
  kpi?: ChartCardKpi;
  /** Footer: manba va yangilangan vaqt — "Source: Core banking · Updated 18 Oct, 09:40". */
  footer?: ReactNode;
  /** Empty holat matni va "Change period" amali. */
  emptyTitle?: ReactNode;
  emptyDescription?: ReactNode;
  onChangePeriod?: () => void;
  /** Error holat matni, "Try again" amali va footer'dagi xato manbasi. */
  errorTitle?: ReactNode;
  errorDescription?: ReactNode;
  onRetry?: () => void;
  errorSource?: ReactNode;
  /** Sarlavha darajasi — sahifa tuzilmasiga mos (standart h3). */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** Chart slot — istalgan `@bek-ui/charts` chart (odatda `ChartContainer` ichida). */
  children?: ReactNode;
}

/**
 * Figma "4.18 Chart · Card": sarlavha, davr tanlagich, KPI qatori, chart sloti va manba.
 * Holatlar: Loading (skeleton, header interaktiv qoladi), Empty (5.3 Empty state), Error (Try again).
 */
export function ChartCard({
  title,
  subtitle,
  state = 'default',
  periods,
  period,
  onPeriodChange,
  kpi,
  footer,
  emptyTitle = 'No data for this period',
  emptyDescription = 'Try a longer period or another account.',
  onChangePeriod,
  errorTitle = "Couldn't load the chart",
  errorDescription = 'Check the connection and try again.',
  onRetry,
  errorSource,
  headingLevel = 3,
  children,
  className,
  ...rest
}: ChartCardProps) {
  const Heading = `h${headingLevel}` as const;
  const titleId = useId();
  const busy = state === 'loading';
  return (
    <section
      {...rest}
      className={cx('bek-chart-card', `bek-chart-card--${state}`, className)}
      aria-labelledby={titleId}
      aria-busy={busy || undefined}
    >
      <header className="bek-chart-card__header">
        <div className="bek-chart-card__heading">
          <Heading id={titleId} className="bek-chart-card__title">
            {title}
          </Heading>
          {subtitle != null && <p className="bek-chart-card__subtitle">{subtitle}</p>}
        </div>
        {periods && periods.length > 1 && (
          <SegmentedControl
            options={periods}
            value={period}
            onChange={onPeriodChange}
            aria-label="Period"
          />
        )}
      </header>

      {state === 'default' && kpi && (
        <div className="bek-chart-card__kpi">
          <span className="bek-chart-card__value">{kpi.value}</span>
          {kpi.delta != null && <Delta value={kpi.delta} betterWhen={kpi.betterWhen} />}
          {kpi.comparison != null && (
            <span className="bek-chart-card__comparison">{kpi.comparison}</span>
          )}
        </div>
      )}

      <div className="bek-chart-card__slot">
        {state === 'default' && children}
        {state === 'loading' && <Skeleton shape="rect" className="bek-chart-card__skeleton" />}
        {state === 'empty' && (
          <EmptyState
            size="s"
            title={emptyTitle}
            description={emptyDescription}
            primaryAction={
              onChangePeriod ? { label: 'Change period', onClick: onChangePeriod } : undefined
            }
          />
        )}
        {state === 'error' && (
          <EmptyState
            size="s"
            role="alert"
            title={errorTitle}
            description={errorDescription}
            primaryAction={onRetry ? { label: 'Try again', onClick: onRetry } : undefined}
          />
        )}
      </div>

      {(footer != null || (state === 'error' && errorSource != null)) && (
        <footer className="bek-chart-card__footer">
          {state === 'error' && errorSource != null ? errorSource : footer}
        </footer>
      )}
    </section>
  );
}
