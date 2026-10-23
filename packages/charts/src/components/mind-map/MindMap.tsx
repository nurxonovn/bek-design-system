import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { cx } from '@bek-ui/react';
import { seriesColor } from '../../core/color.js';
import { r2 } from '../../core/geometry.js';
import { DIAGRAM_NODE_HEIGHT, DIAGRAM_NODE_WIDTH, DiagramNode } from '../diagram-node/index.js';
import type { DiagramPoint } from '../diagram-connector/index.js';

export type MindMapLayout = 'radial' | 'tree';

/** Xarita tuguni: markaziy g'oya → shoxlar → barglar (`children`). */
export interface MindMapNode {
  /** Qisqa nom (≤ 3 so'z — xarita hujjat emas, xulosa). */
  label: string;
  children?: MindMapNode[];
  /** Yig'ilgan shox (Figma State "Collapsed"): Tree'da barglar o'rniga "+n". Ekran o'quvchi ro'yxatida barglar qoladi. */
  collapsed?: boolean;
}

export interface MindMapProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Markaziy g'oya (Terminal) va uning shoxlari (Process, 3–8 ta). */
  root: MindMapNode;
  /** `radial` — shoxlar markaz atrofida ellipsda, `tree` — chapdan o'ngga: ildiz → shox → barg. */
  layout?: MindMapLayout;
  /** Ekran o'quvchi uchun qisqa xulosa ("BEK Academy launch: 6 yo'nalish"). */
  label: string;
  /** Canvas eni (`scale/720`). Geometriya hisoblanadi, cho'zilmaydi. */
  width?: number;
  /** Canvas balandligi (Radial; Tree barglar soniga qarab o'sadi). Standart 400. */
  height?: number;
}

/** Canvas ichki chekkasi (`scale/24`). */
const PAD = 24;
const HALF_W = DIAGRAM_NODE_WIDTH / 2;
const HALF_H = DIAGRAM_NODE_HEIGHT / 2;
/** Tree: ustunlar orasidagi bog'lanish uzunligi — ildiz, shox va barg nuqtasi ustunlari. */
const TREE_LINK = 104;
/** Tree: barg qatori qadami va shox bloklari orasi (`DIAGRAM_NODE_GAP`). */
const LEAF_PITCH = 48;
const BRANCH_GAP = 32;
/** Nuqta diametri (`chart/point-size` = 8) — barg qatori nuqta markazidan boshlanadi. */
const DOT = 8;

interface Placed {
  key: string;
  label: string;
  x: number;
  y: number;
  color: string;
  /** Shox nuqtasi (Radial) — tugunning ildizga qaragan cheti. */
  dot?: DiagramPoint;
  branch: number;
}

interface Link {
  key: string;
  d: string;
  color: string;
  branch: number;
}

interface Leaf {
  key: string;
  label: string;
  x: number;
  y: number;
  color: string;
  branch: number;
  /** Yig'ilgan shox belgisi ("+n"). */
  more?: boolean;
}

interface Layout {
  width: number;
  height: number;
  root: DiagramPoint;
  branches: Placed[];
  links: Link[];
  leaves: Leaf[];
}

/** Gorizontal urinmali kubik egri (Tree). */
function cubicH(a: DiagramPoint, b: DiagramPoint): string {
  const mx = (a.x + b.x) / 2;
  return `M${r2(a.x)},${r2(a.y)}C${r2(mx)},${r2(a.y)} ${r2(mx)},${r2(b.y)} ${r2(b.x)},${r2(b.y)}`;
}

/** Vertikal urinmali kubik egri (Radial: yuqori/pastki shoxlar). */
function cubicV(a: DiagramPoint, b: DiagramPoint): string {
  const my = (a.y + b.y) / 2;
  return `M${r2(a.x)},${r2(a.y)}C${r2(a.x)},${r2(my)} ${r2(b.x)},${r2(my)} ${r2(b.x)},${r2(b.y)}`;
}

/**
 * Radial: ildiz markazda, shoxlar ellipsda (o'ngdan soat yo'nalishida). Ellips radiuslari canvas
 * o'lchamidan: 720 × 400 → 248 × 144 (Figma bilan bir xil).
 */
function radialLayout(root: MindMapNode, width: number, height: number): Layout {
  const c = { x: width / 2, y: height / 2 };
  const rx = width / 2 - PAD - HALF_W - 8;
  const ry = height / 2 - DIAGRAM_NODE_HEIGHT;
  const kids = root.children ?? [];
  const branches: Placed[] = [];
  const links: Link[] = [];
  kids.forEach((kid, i) => {
    const angle = (i / kids.length) * Math.PI * 2;
    const x = c.x + rx * Math.cos(angle);
    const y = c.y + ry * Math.sin(angle);
    const color = seriesColor(i);
    const dx = x - c.x;
    // Nuqta — tugunning ildizga qaragan cheti; tik joylashganda yuqori/pastki chet.
    const dot =
      Math.abs(dx) < 1
        ? { x, y: y < c.y ? y + HALF_H : y - HALF_H }
        : { x: dx > 0 ? x - HALF_W : x + HALF_W, y };
    const side = Math.abs(dot.y - c.y) < 1;
    links.push({ key: `l${i}`, d: side ? cubicH(c, dot) : cubicV(c, dot), color, branch: i });
    branches.push({ key: `b${i}`, label: kid.label, x, y, color, dot, branch: i });
  });
  return { width, height, root: c, branches, links, leaves: [] };
}

/** Tree: ildiz chapda, shoxlar ustuni, barglar nuqta + matn bilan. Balandlik barglar soniga qarab. */
function treeLayout(root: MindMapNode, width: number, height: number): Layout {
  const kids = root.children ?? [];
  const shown = (k: MindMapNode) =>
    k.collapsed && k.children?.length ? 1 : (k.children?.length ?? 0);
  const blocks = kids.map((k) => Math.max(DIAGRAM_NODE_HEIGHT, shown(k) * LEAF_PITCH));
  const content = blocks.reduce((s, b) => s + b, 0) + Math.max(0, kids.length - 1) * BRANCH_GAP;
  const h = Math.max(height, content + PAD * 2);
  const rootPt = { x: PAD + HALF_W, y: h / 2 };
  const branchX = PAD + DIAGRAM_NODE_WIDTH + TREE_LINK + HALF_W;
  const dotX = branchX + HALF_W + TREE_LINK;
  const branches: Placed[] = [];
  const links: Link[] = [];
  const leaves: Leaf[] = [];
  let top = (h - content) / 2;
  kids.forEach((kid, i) => {
    const y = top + blocks[i] / 2;
    const color = seriesColor(i);
    branches.push({ key: `b${i}`, label: kid.label, x: branchX, y, color, branch: i });
    links.push({
      key: `l${i}`,
      d: cubicH({ x: rootPt.x + HALF_W, y: rootPt.y }, { x: branchX - HALF_W, y }),
      color,
      branch: i,
    });
    const all = kid.children ?? [];
    const leafKids: { label: string; more?: boolean }[] =
      kid.collapsed && all.length ? [{ label: `+${all.length}`, more: true }] : all;
    leafKids.forEach((leaf, j) => {
      const ly = y + (j - (leafKids.length - 1) / 2) * LEAF_PITCH;
      links.push({
        key: `l${i}-${j}`,
        d: cubicH({ x: branchX + HALF_W, y }, { x: dotX, y: ly }),
        color,
        branch: i,
      });
      leaves.push({
        key: `f${i}-${j}`,
        label: leaf.label,
        x: dotX,
        y: ly,
        color,
        branch: i,
        more: leaf.more,
      });
    });
    top += blocks[i] + BRANCH_GAP;
  });
  return { width, height: h, root: rootPt, branches, links, leaves };
}

function NestedList({ node }: { node: MindMapNode }): ReactNode {
  return (
    <li>
      {node.label}
      {node.children && node.children.length > 0 && (
        <ul>
          {node.children.map((c, i) => (
            <NestedList key={i} node={c} />
          ))}
        </ul>
      )}
    </li>
  );
}

const at = (x: number, y: number): CSSProperties => ({ left: r2(x), top: r2(y) });

/**
 * Figma "4.19 Diagram · Mind map": markaziy g'oya va shoxlar. `DiagramNode` (Terminal — ildiz,
 * Process — shox) HTML qatlamida, kubik bog'lanishlar ostidagi SVG'da; har shox bitta kategorik rangda.
 */
export function MindMap({
  root,
  layout = 'radial',
  label,
  width = 720,
  height = 400,
  className,
  ...rest
}: MindMapProps) {
  const g = layout === 'tree' ? treeLayout(root, width, height) : radialLayout(root, width, height);
  return (
    <figure
      // Keng kanvas gorizontal skroll qiladi — klaviaturadan ham (WCAG 2.1.1, axe scrollable-region-focusable).
      tabIndex={0}
      {...rest}
      className={cx(
        'bek-diagram',
        'bek-mind-map',
        `bek-mind-map--${layout}`,
        'bek-focus-ring',
        className,
      )}
    >
      <div
        className="bek-mind-map__canvas"
        role="img"
        aria-label={label}
        style={{ width: g.width, height: g.height }}
      >
        <svg
          className="bek-mind-map__links"
          width={g.width}
          height={g.height}
          viewBox={`0 0 ${g.width} ${g.height}`}
          aria-hidden="true"
          focusable="false"
        >
          {g.links.map((l) => (
            <path
              key={l.key}
              className="bek-mind-map__link"
              d={l.d}
              style={{ stroke: l.color }}
              data-branch={l.branch}
            />
          ))}
        </svg>
        <DiagramNode
          className="bek-mind-map__node bek-mind-map__root"
          variant="terminal"
          label={root.label}
          style={at(g.root.x - HALF_W, g.root.y - HALF_H)}
        />
        {g.branches.map((b) => (
          <DiagramNode
            key={b.key}
            className="bek-mind-map__node"
            label={b.label}
            style={at(b.x - HALF_W, b.y - HALF_H)}
            data-branch={b.branch}
          />
        ))}
        {g.branches.map(
          (b) =>
            b.dot && (
              <span
                key={`d${b.key}`}
                className="bek-mind-map__dot"
                style={{ ...at(b.dot.x, b.dot.y), background: b.color }}
                data-branch={b.branch}
              />
            ),
        )}
        {g.leaves.map((f) => (
          <span
            key={f.key}
            className={cx('bek-mind-map__leaf', f.more && 'bek-mind-map__leaf--more')}
            style={at(f.x - DOT / 2, f.y)}
            data-branch={f.branch}
          >
            <span className="bek-mind-map__leaf-dot" style={{ background: f.color }} />
            <span className="bek-mind-map__leaf-label">{f.label}</span>
          </span>
        ))}
      </div>
      <ul className="bek-chart__sr">
        <NestedList node={root} />
      </ul>
    </figure>
  );
}
