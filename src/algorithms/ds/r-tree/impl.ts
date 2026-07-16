// =============================================================================
// R树 R-Tree · 纯算法实现（零 DOM 依赖，可独立单测）
// 实现：简化的 R 树（空间索引）。
//   - 叶节点存数据点；内部节点存子节点的 MBR（最小外接矩形）
//   - 插入：自根选择「MBR 扩张面积最小」的子树下行，叶满则分裂（线性）
//   - 区域查询：与查询框不相交的子树整枝剪掉
// 注：为简洁起见采用「节点容量上限 + 线性分裂」的非平衡版本，演示 MBR 思想。
// =============================================================================

/** 二维点。 */
export interface RPoint {
  x: number;
  y: number;
  id?: number;
}

/** 轴对齐矩形（MBR）。 */
export interface MBR {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/** 操作过程中的事件钩子。任一可选。 */
export interface RTreeHooks {
  /** 插入：访问某节点的 MBR，扩area 为加入此点后 MBR 增加的面积。 */
  onVisit?: (mbr: MBR, depth: number, isLeaf: boolean) => void;
  /** 插入：选择下行到某子节点。 */
  onChoose?: (mbr: MBR, depth: number) => void;
  /** 插入：点落入叶子被存下。 */
  onInsert?: (p: RPoint, depth: number) => void;
  /** 插入：叶满触发分裂。 */
  onSplit?: (depth: number) => void;
  /** 区域查询：访问 MBR，contained 表示被完全包含。 */
  onQueryVisit?: (mbr: MBR, contained: boolean) => void;
  /** 区域查询：命中点。 */
  onQueryHit?: (p: RPoint) => void;
  /** 区域查询：剪枝（不相交）。 */
  onQueryPrune?: (mbr: MBR) => void;
}

/** R 树节点。 */
interface RTNode {
  mbr: MBR;
  leaf: boolean;
  points?: RPoint[]; // 叶子
  children?: RTNode[]; // 内部
}

const area = (m: MBR): number => (m.x2 - m.x1) * (m.y2 - m.y1);

/** 两 MBR 是否相交。 */
function mbrIntersect(a: MBR, b: MBR): boolean {
  return a.x1 <= b.x2 && a.x2 >= b.x1 && a.y1 <= b.y2 && a.y2 >= b.y1;
}

/** 合并 mbr 与点，返回新 mbr。 */
function unionPoint(m: MBR, p: RPoint): MBR {
  return {
    x1: Math.min(m.x1, p.x),
    y1: Math.min(m.y1, p.y),
    x2: Math.max(m.x2, p.x),
    y2: Math.max(m.y2, p.y),
  };
}

/** 合并两个 mbr。 */
function unionMBR(a: MBR, b: MBR): MBR {
  return {
    x1: Math.min(a.x1, b.x1),
    y1: Math.min(a.y1, b.y1),
    x2: Math.max(a.x2, b.x2),
    y2: Math.max(a.y2, b.y2),
  };
}

/**
 * R 树（简化版）：插入用最小扩张面积选择子树，叶满线性分裂。
 */
export class RTree {
  private root: RTNode;
  readonly capacity: number;

  constructor(bounds: MBR, capacity = 4) {
    this.root = { mbr: bounds, leaf: true, points: [] };
    this.capacity = capacity;
  }

  /** 插入点。 */
  insert(p: RPoint, hooks: RTreeHooks = {}): void {
    this.insertRec(this.root, p, 0, hooks);
  }

  private insertRec(node: RTNode, p: RPoint, depth: number, hooks: RTreeHooks): void {
    hooks.onVisit?.(node.mbr, depth, node.leaf);
    if (node.leaf) {
      node.points ??= [];
      node.points.push(p);
      node.mbr = unionPoint(node.mbr, p);
      hooks.onInsert?.(p, depth);
      if (node.points.length > this.capacity) {
        this.splitLeaf(node, depth, hooks);
      }
      return;
    }
    // 内部：选扩张面积最小的子节点
    node.children ??= [];
    let best = 0;
    let bestEnlargement = Infinity;
    for (let i = 0; i < node.children.length; i++) {
      const c = node.children[i]!;
      const before = area(c.mbr);
      const after = area(unionPoint(c.mbr, p));
      const enlargement = after - before;
      if (enlargement < bestEnlargement) {
        bestEnlargement = enlargement;
        best = i;
      }
    }
    const chosen = node.children[best]!;
    hooks.onChoose?.(chosen.mbr, depth + 1);
    this.insertRec(chosen, p, depth + 1, hooks);
    node.mbr = unionPoint(node.mbr, p);
  }

  /** 线性分裂叶子节点：取 x 范围差距最大的两点作种子，按最近分配。 */
  private splitLeaf(node: RTNode, depth: number, hooks: RTreeHooks): void {
    const pts = node.points!;
    hooks.onSplit?.(depth);
    // 找 x 差最大的两个种子
    let s1 = 0;
    let s2 = pts.length - 1;
    let maxSep = -1;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const sep = Math.abs(pts[i]!.x - pts[j]!.x);
        if (sep > maxSep) {
          maxSep = sep;
          s1 = i;
          s2 = j;
        }
      }
    }
    /** 由点集构造 MBR。 */
    const pointsMBR = (ps: RPoint[]): MBR => {
      let m: MBR = { x1: ps[0]!.x, y1: ps[0]!.y, x2: ps[0]!.x, y2: ps[0]!.y };
      for (let i = 1; i < ps.length; i++) m = unionPoint(m, ps[i]!);
      return m;
    };
    const groupA: RPoint[] = [pts[s1]!];
    const groupB: RPoint[] = [pts[s2]!];
    for (let k = 0; k < pts.length; k++) {
      if (k === s1 || k === s2) continue;
      const p = pts[k]!;
      const mbrA = pointsMBR(groupA);
      const mbrB = pointsMBR(groupB);
      const enA = area(unionPoint(mbrA, p)) - area(mbrA);
      const enB = area(unionPoint(mbrB, p)) - area(mbrB);
      if (enA <= enB) groupA.push(p);
      else groupB.push(p);
    }
    // 把 node 改成 groupA，新建 groupB 作为兄弟（这里简化：将兄弟作为 node 的新子节点 → 退化为内部）
    const mbrA = pointsMBR(groupA);
    const mbrB = pointsMBR(groupB);
    const leafA: RTNode = { mbr: mbrA, leaf: true, points: groupA };
    const leafB: RTNode = { mbr: mbrB, leaf: true, points: groupB };
    // node 变为内部节点，拥有两个叶子
    node.leaf = false;
    node.points = undefined;
    node.children = [leafA, leafB];
    node.mbr = unionMBR(mbrA, mbrB);
  }

  /** 区域查询：返回查询框内的所有点。 */
  queryRange(query: MBR, hooks: RTreeHooks = {}, node: RTNode = this.root): RPoint[] {
    if (!mbrIntersect(node.mbr, query)) {
      hooks.onQueryPrune?.(node.mbr);
      return [];
    }
    const fully = mbrContains(query, node.mbr);
    hooks.onQueryVisit?.(node.mbr, fully);
    if (node.leaf) {
      const result: RPoint[] = [];
      for (const p of node.points ?? []) {
        if (p.x >= query.x1 && p.x <= query.x2 && p.y >= query.y1 && p.y <= query.y2) {
          result.push(p);
          hooks.onQueryHit?.(p);
        }
      }
      return result;
    }
    const out: RPoint[] = [];
    for (const c of node.children ?? []) out.push(...this.queryRange(query, hooks, c));
    return out;
  }

  /** 根 MBR。 */
  rootMBR(): MBR {
    return { ...this.root.mbr };
  }
}

function mbrContains(outer: MBR, inner: MBR): boolean {
  return (
    outer.x1 <= inner.x1 && outer.x2 >= inner.x2 && outer.y1 <= inner.y1 && outer.y2 >= inner.y2
  );
}

/**
 * 便利函数：批量插入并执行区域查询。
 */
export function rTree(
  input: {
    bounds: MBR;
    capacity?: number;
    points: RPoint[];
    queries?: MBR[];
  },
  hooks: RTreeHooks = {},
): RPoint[][] {
  const t = new RTree(input.bounds, input.capacity ?? 4);
  for (const p of input.points) t.insert(p, hooks);
  return (input.queries ?? []).map((q) => t.queryRange(q, hooks));
}
