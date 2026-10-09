import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { Loader } from './Loader.js';

export type PullToRefreshState = 'pull' | 'release' | 'refreshing';

export interface PullToRefreshProps extends HTMLAttributes<HTMLDivElement> {
  /** `pull` — tortilyapti · `release` — 64 px chegaraga yetdi · `refreshing` — yangilanmoqda. */
  state?: PullToRefreshState;
  /** `pull` holatida tortish masofasi 0–1 (yoy shu bilan o'sadi). */
  progress?: number;
  /** Holat matnlari. */
  labels?: Partial<Record<PullToRefreshState, ReactNode>>;
}

const DEFAULT_LABELS: Record<PullToRefreshState, ReactNode> = {
  pull: 'Pull to refresh',
  release: 'Release to refresh',
  refreshing: 'Refreshing…',
};

/**
 * Figma "5.7 Loading → Pull to refresh": ro'yxat ustidagi indikator (64 px). Ishora
 * (gesture) mantiqini ilova boshqaradi; Release'da haptik signal beriladi.
 */
export function PullToRefresh({
  state = 'pull',
  progress = 0,
  labels,
  className,
  ...rest
}: PullToRefreshProps) {
  const text = { ...DEFAULT_LABELS, ...labels }[state];
  return (
    <div
      role="status"
      {...rest}
      className={cx('bek-pull-to-refresh', `bek-pull-to-refresh--${state}`, className)}
    >
      <Loader
        size={24}
        label={null}
        value={state === 'refreshing' ? undefined : state === 'release' ? 1 : progress}
        className="bek-pull-to-refresh__loader"
      />
      <span className="bek-pull-to-refresh__label">{text}</span>
    </div>
  );
}
