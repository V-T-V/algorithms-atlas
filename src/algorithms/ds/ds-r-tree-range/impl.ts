// =============================================================================
// R 树（最小外接矩形范围查询）· 纯算法实现
// =============================================================================

export interface RRect {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  value: number;
}

export interface Rect {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export interface RTreeHooks {
  onBuild?: (mbr: Rect, isLeaf: boolean, count: number) => void;
  onVisit?: (mbr: Rect, isLeaf: boolean) => void;
  onPrune?: (mbr: Rect) => void;
  onCollect?: (item: RRect) => void;
}

interface RNode {
  mbr: Rect;
  isLeaf: boolean;
  /** 叶子时存数据项；内部节点时存子节点。 */
  entries: RRect[] | RNode[];
}

const FANOUT = 4;

/** 由数据矩形批量构建 R 树（STR 风格简化：按 x 中心排序后分组打包）。 */
export function buildRTree(items: RRect[], hooks: RTreeHooks = {}): RNode | null {
  if (items.length === 0) return null;
  return buildLevel(items, true, hooks);
}

function buildLevel(level: RRect[] | RNode[], isLeaf: boolean, hooks: RTreeHooks): RNode {
  // 按中心 x 排序后按 FANOUT 分组
  const sorted = (level as Array<RRect | RNode>).slice().sort((a, b) => {
    const ax = isLeaf
      ? (a as RRect).x0 + (a as RRect).x1
      : (a as RNode).mbr.x0 + (a as RNode).mbr.x1;
    const bx = isLeaf
      ? (b as RRect).x0 + (b as RRect).x1
      : (b as RNode).mbr.x0 + (b as RNode).mbr.x1;
    return ax - bx;
  }) as RRect[] | RNode[];
  if (sorted.length <= FANOUT) {
    const mbr = mbrOf(sorted, isLeaf);
    const node: RNode = { mbr, isLeaf, entries: sorted as RRect[] & RNode[] };
    hooks.onBuild?.(mbr, isLeaf, sorted.length);
    return node;
  }
  // 分组递归
  const groups: Array<RRect[] | RNode[]> = [];
  for (let i = 0; i < sorted.length; i += FANOUT) {
    groups.push(sorted.slice(i, i + FANOUT) as RRect[] & RNode[]);
  }
  const children = groups.map((g) => buildLevel(g, isLeaf, hooks));
  const mbr = children.reduce((acc, c) => union(acc, c.mbr), {
    x0: Infinity,
    y0: Infinity,
    x1: -Infinity,
    y1: -Infinity,
  } as Rect);
  const node: RNode = { mbr, isLeaf: false, entries: children };
  hooks.onBuild?.(mbr, false, children.length);
  return node;
}

function mbrOf(level: RRect[] | RNode[], isLeaf: boolean): Rect {
  let x0 = Infinity,
    y0 = Infinity,
    x1 = -Infinity,
    y1 = -Infinity;
  for (const e of level) {
    const r = isLeaf ? (e as RRect) : (e as RNode).mbr;
    x0 = Math.min(x0, r.x0);
    y0 = Math.min(y0, r.y0);
    x1 = Math.max(x1, r.x1);
    y1 = Math.max(y1, r.y1);
  }
  return { x0, y0, x1, y1 };
}

function union(a: Rect, b: Rect): Rect {
  return {
    x0: Math.min(a.x0, b.x0),
    y0: Math.min(a.y0, b.y0),
    x1: Math.max(a.x1, b.x1),
    y1: Math.max(a.y1, b.y1),
  };
}

function intersect(a: Rect, b: Rect): boolean {
  return !(a.x1 < b.x0 || b.x1 < a.x0 || a.y1 < b.y0 || b.y1 < a.y0);
}

/** 范围查询：返回与 query 相交的所有数据项。 */
export function rangeQuery(root: RNode | null, query: Rect, hooks: RTreeHooks = {}): RRect[] {
  const out: RRect[] = [];
  const rec = (node: RNode): void => {
    hooks.onVisit?.(node.mbr, node.isLeaf);
    if (!intersect(node.mbr, query)) {
      hooks.onPrune?.(node.mbr);
      return;
    }
    if (node.isLeaf) {
      for (const item of node.entries as RRect[]) {
        if (intersect(item, query)) {
          out.push(item);
          hooks.onCollect?.(item);
        }
      }
    } else {
      for (const child of node.entries as RNode[]) rec(child);
    }
  };
  if (root) rec(root);
  return out;
}
