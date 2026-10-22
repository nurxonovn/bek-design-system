import type { CSSProperties, HTMLAttributes } from 'react';
import { cx } from '@bek-ui/react';
import { r2 } from '../../core/geometry.js';

export type JourneyLayout = 'default' | 'compact';

/** Emotsiya: −2 (juda yomon) … +2 (zo'r). Rang belgisi: >0 positive, 0 neutral, <0 negative. */
export type JourneyEmotionScore = -2 | -1 | 0 | 1 | 2;

export interface JourneyEmotion {
  score: JourneyEmotionScore;
  /** So'z bilan ("Frustrated", "Delighted") — rang yagona belgi bo'lmasligi uchun majburiy. */
  label: string;
}

export interface JourneyStage {
  /** Bosqich nomi ("Discover"). Raqam avtomatik qo'yiladi. */
  name: string;
  /** Foydalanuvchi nima qiladi — bir jumla. */
  action: string;
  /** Aloqa nuqtalari: kanal, ilova, xizmat ("Telegram", "Payme"). */
  touchpoints?: string[];
  emotion: JourneyEmotion;
  /** Og'riq nuqtasi; yo'q bo'lsa "—". */
  pain?: string;
  /** Imkoniyat (yechim g'oyasi); yo'q bo'lsa "—". */
  opportunity?: string;
}

export interface JourneyMapProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** 3–6 bosqich, vaqt tartibida. */
  stages: JourneyStage[];
  /** `default` — keng canvas (web, workshop, print), `compact` — har bosqich alohida karta (mobil). */
  layout?: JourneyLayout;
  /** Ekran o'quvchi uchun qisqa xulosa ("Talaba yo'li: 4 bosqich, eng og'ir — to'lov"). */
  label: string;
}

const ROWS = ['Actions', 'Touchpoints', 'Emotion', 'Pain points', 'Opportunities'] as const;

export function emotionTone(score: JourneyEmotionScore): 'positive' | 'neutral' | 'negative' {
  if (score > 0) return 'positive';
  if (score < 0) return 'negative';
  return 'neutral';
}

/** Emotsiya chizig'i: ustun markazlari (0–100 %) va ball (yuqori = yaxshi) → SVG nuqtalari. */
export function emotionPoints(stages: JourneyStage[]): { x: number; y: number }[] {
  const n = stages.length;
  return stages.map((s, i) => ({
    x: r2(((i + 0.5) / n) * 100),
    y: r2(50 - s.emotion.score * 20),
  }));
}

function Empty() {
  return <span className="bek-journey__empty">—</span>;
}

function Note({ tone, text }: { tone: 'positive' | 'negative'; text?: string }) {
  if (!text) return <Empty />;
  return (
    <span className="bek-journey__note">
      <span className={cx('bek-journey__dot', `bek-journey__dot--${tone}`)} aria-hidden="true" />
      {text}
    </span>
  );
}

function Chips({ items }: { items?: string[] }) {
  if (!items || items.length === 0) return <Empty />;
  return (
    <span className="bek-journey__chips">
      {items.map((t, i) => (
        <span key={i} className="bek-journey__chip">
          {t}
        </span>
      ))}
    </span>
  );
}

function Mood({ emotion }: { emotion: JourneyEmotion }) {
  return (
    <span className="bek-journey__mood">
      <span
        className={cx('bek-journey__dot', `bek-journey__dot--${emotionTone(emotion.score)}`)}
        aria-hidden="true"
      />
      {emotion.label}
    </span>
  );
}

function EmotionCurve({ stages }: { stages: JourneyStage[] }) {
  const pts = emotionPoints(stages);
  return (
    <div className="bek-journey__curve" style={{ gridColumn: `2 / span ${stages.length}` }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <line className="bek-journey__baseline" x1="0" x2="100" y1="50" y2="50" />
        <polyline
          className="bek-journey__line"
          points={pts.map((p) => `${p.x},${p.y}`).join(' ')}
        />
      </svg>
      {stages.map((s, i) => (
        <span
          key={i}
          className="bek-journey__point"
          style={{ left: `${pts[i].x}%`, top: `${pts[i].y}%` } as CSSProperties}
        >
          <Mood emotion={s.emotion} />
        </span>
      ))}
    </div>
  );
}

function DefaultLayout({ stages }: { stages: JourneyStage[] }) {
  const cols = {
    gridTemplateColumns: `var(--bek-scale-96) repeat(${stages.length}, minmax(0, 1fr))`,
  };
  return (
    <div className="bek-journey__grid" style={cols} aria-hidden="true">
      <span className="bek-journey__row-name">Stage</span>
      {stages.map((s, i) => (
        <span key={i} className="bek-journey__stage">
          <span className="bek-journey__num">{i + 1}</span>
          {s.name}
        </span>
      ))}
      <span className="bek-journey__row-name">{ROWS[0]}</span>
      {stages.map((s, i) => (
        <span key={i} className="bek-journey__cell bek-journey__card">
          {s.action}
        </span>
      ))}
      <span className="bek-journey__row-name">{ROWS[1]}</span>
      {stages.map((s, i) => (
        <span key={i} className="bek-journey__cell">
          <Chips items={s.touchpoints} />
        </span>
      ))}
      <span className="bek-journey__row-name">{ROWS[2]}</span>
      <EmotionCurve stages={stages} />
      <span className="bek-journey__row-name">{ROWS[3]}</span>
      {stages.map((s, i) => (
        <span key={i} className="bek-journey__cell">
          <Note tone="negative" text={s.pain} />
        </span>
      ))}
      <span className="bek-journey__row-name">{ROWS[4]}</span>
      {stages.map((s, i) => (
        <span key={i} className="bek-journey__cell">
          <Note tone="positive" text={s.opportunity} />
        </span>
      ))}
    </div>
  );
}

function CompactLayout({ stages }: { stages: JourneyStage[] }) {
  return (
    <ol className="bek-journey__cards">
      {stages.map((s, i) => (
        <li key={i} className="bek-journey__stage-card">
          <span className="bek-journey__card-head">
            <span className="bek-journey__stage">
              {i + 1} · {s.name}
            </span>
            <Mood emotion={s.emotion} />
          </span>
          <span className="bek-journey__action">{s.action}</span>
          <Chips items={s.touchpoints} />
          {s.pain && <Note tone="negative" text={s.pain} />}
          {s.opportunity && <Note tone="positive" text={s.opportunity} />}
        </li>
      ))}
    </ol>
  );
}

/**
 * Figma "4.19 Diagram · User journey map": bosqichlar bo'yicha harakatlar, aloqa nuqtalari,
 * emotsiya chizig'i, og'riq va imkoniyatlar. Emotsiya — nuqta rangi + so'z (CMP-07: rang yagona belgi emas).
 */
export function JourneyMap({
  stages,
  layout = 'default',
  label,
  className,
  ...rest
}: JourneyMapProps) {
  return (
    <figure
      {...rest}
      className={cx('bek-diagram', 'bek-journey', `bek-journey--${layout}`, className)}
      aria-label={label}
    >
      {layout === 'compact' ? (
        <CompactLayout stages={stages} />
      ) : (
        <>
          <DefaultLayout stages={stages} />
          <ol className="bek-chart__sr">
            {stages.map((s, i) => (
              <li key={i}>
                {[
                  `${i + 1}. ${s.name}: ${s.action}`,
                  s.touchpoints?.length ? `${ROWS[1]}: ${s.touchpoints.join(', ')}` : '',
                  `${ROWS[2]}: ${s.emotion.label}`,
                  s.pain ? `${ROWS[3]}: ${s.pain}` : '',
                  s.opportunity ? `${ROWS[4]}: ${s.opportunity}` : '',
                ]
                  .filter(Boolean)
                  .join('. ')}
              </li>
            ))}
          </ol>
        </>
      )}
    </figure>
  );
}
