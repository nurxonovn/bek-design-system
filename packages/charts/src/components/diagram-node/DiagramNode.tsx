import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '@bek/react';

export type DiagramNodeVariant =
  | 'process'
  | 'terminal'
  | 'note'
  | 'subprocess'
  | 'decision'
  | 'data';

/** Tugun eni — `scale/160` (Figma: 8 pt grid). */
export const DIAGRAM_NODE_WIDTH = 160;
/** Tugun balandligi — `scale/56`; Decision (romb) — `scale/80`. */
export const DIAGRAM_NODE_HEIGHT = 56;
export const DIAGRAM_DECISION_HEIGHT = 80;
/** Tugunlar orasidagi eng kichik masofa — `scale/32`. */
export const DIAGRAM_NODE_GAP = 32;

/**
 * Variant bo'yicha tugun o'lchami (px) — Mind map, Swimlane va boshqa diagrammalar joylashuvni
 * shu raqamlardan hisoblaydi va `DiagramConnector` uchlarini tugun chetiga ulaydi.
 */
export function diagramNodeSize(variant: DiagramNodeVariant = 'process'): {
  width: number;
  height: number;
} {
  return {
    width: DIAGRAM_NODE_WIDTH,
    height: variant === 'decision' ? DIAGRAM_DECISION_HEIGHT : DIAGRAM_NODE_HEIGHT,
  };
}

export interface DiagramNodeProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Qadam turi (shakl): `process` — qadam, `terminal` — boshlanish/tugash, `note` — izoh,
   * `subprocess` — boshqa oqimga havola, `decision` — ha/yo'q, `data` — hujjat yoki kiritish.
   */
  variant?: DiagramNodeVariant;
  /** Qadam nomi (Figma `Label`), markazda, ko'pi bilan 2 qator. */
  label: ReactNode;
  /** Walkthrough'dagi joriy qadam: `border/accent` 2 px chiziq (Figma "Highlighted"). */
  highlighted?: boolean;
}

// Romb va parallelogram — HTML quti bilan chizib bo'lmaydi: fon SVG shakl (cho'ziladi, chiziq qalinligi o'zgarmaydi).
const SHAPES: Partial<Record<DiagramNodeVariant, string>> = {
  decision: '50,0 100,50 50,100 0,50',
  data: '10,0 100,0 90,100 0,100',
};

/**
 * Figma "4.19 Diagram · Node": oqim diagrammasi tuguni (HTML). Katta diagrammalarda absolyut
 * joylashtiriladi (`style={{ position: 'absolute', left, top }}`), strelkalar `DiagramConnector` bilan.
 */
export function DiagramNode({
  variant = 'process',
  label,
  highlighted = false,
  className,
  ...rest
}: DiagramNodeProps) {
  const shape = SHAPES[variant];
  return (
    <div
      {...rest}
      className={cx(
        'bek-diagram',
        'bek-diagram-node',
        `bek-diagram-node--${variant}`,
        highlighted && 'bek-diagram-node--highlighted',
        'bek-focus-ring',
        className,
      )}
    >
      {shape && (
        <svg
          className="bek-diagram-node__shape"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <polygon points={shape} vectorEffect="non-scaling-stroke" />
        </svg>
      )}
      <span className="bek-diagram-node__label">{label}</span>
    </div>
  );
}
