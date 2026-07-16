// =============================================================================
// 二维线段树（2D Segment Tree）· 纯算法实现（零 DOM 依赖）
// 在 R×C 网格上支持单点更新与任意矩形（行 [r1,r2] × 列 [c1,c2]）求和。
// 结构：外层线段树按行区间组织，每个外层节点内部嵌一棵"按列"的内层线段树。
// =============================================================================

/** 事件钩子（全可选）。 */
export interface Seg2dHooks {
  /** 一次单点更新完成。 */
  onUpdate?: (r: number, c: number, delta: number) => void;
  /** 矩形查询时，访问了一个外层节点（行区间）与内层节点（列区间）。 */
  onQueryNode?: (rl: number, rr: number, cl: number, cr: number, partial: number) => void;
}

/**
 * 二维线段树（求和版）。
 *
 * 原理：外层按行建线段树，每个外层节点对应一段行区间 [rl, rr]，
 * 节点内部存一棵"列方向"的内层线段树，记录这些行在每一列上的累计值。
 * 更新 (r,c,delta)：从根沿行向下到叶子，路径上每个外层节点的内层树都对 c 加 delta。
 * 查询矩形 (r1,r2,c1,c2)：外层按行递归，命中行区间则在内层树做列区间求和并累加。
 *
 * **下标约定**：行、列均 1-based。
 *
 * **复杂度**：build O(R·C)，update O(log R · log C)，query O(log R · log C)，空间 O(R·C)。
 */
export class SegmentTree2D {
  /** 外层节点数组（1-based 编号），每个内含一棵列方向的线段树。 */
  private readonly rowNodes: Array<{
    inner: number[]; // 列方向线段树数组（1-based），覆盖整个列域
  }>;
  private readonly cols;
  private readonly R;
  /** 原始矩阵副本（1-based，便于展示）。 */
  readonly mat: number[][];

  constructor(
    rows: number,
    cols: number,
    initial: ReadonlyArray<ReadonlyArray<number>> = [],
    private hooks: Seg2dHooks = {},
  ) {
    this.R = rows;
    this.cols = cols;
    const size = 4 * rows;
    this.rowNodes = Array.from({ length: size }, () => ({
      inner: new Array<number>(4 * cols).fill(0),
    }));
    this.mat = Array.from({ length: rows + 1 }, () => new Array<number>(cols + 1).fill(0));
    // 逐点 build：直接调用 update
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const v = initial[r]?.[c] ?? 0;
        if (v !== 0) this.update(r + 1, c + 1, v, true);
      }
    }
  }

  /** 单点加：把 (r,c) 加上 delta（1-based）。silent=true 时不触发 hook（用于 build）。 */
  update(r: number, c: number, delta: number, silent = false): void {
    this.mat[r]![c]! += delta;
    this.updateOuter(1, 1, this.R, r, c, delta);
    if (!silent) this.hooks.onUpdate?.(r, c, delta);
  }

  private updateOuter(
    idx: number,
    rl: number,
    rr: number,
    r: number,
    c: number,
    delta: number,
  ): void {
    this.updateInner(this.rowNodes[idx]!.inner, 1, 1, this.cols, c, delta);
    if (rl === rr) return;
    const mid = (rl + rr) >> 1;
    if (r <= mid) this.updateOuter(idx * 2, rl, mid, r, c, delta);
    else this.updateOuter(idx * 2 + 1, mid + 1, rr, r, c, delta);
  }

  private updateInner(
    tree: number[],
    idx: number,
    cl: number,
    cr: number,
    c: number,
    delta: number,
  ): void {
    tree[idx]! += delta;
    if (cl === cr) return;
    const mid = (cl + cr) >> 1;
    if (c <= mid) this.updateInner(tree, idx * 2, cl, mid, c, delta);
    else this.updateInner(tree, idx * 2 + 1, mid + 1, cr, c, delta);
  }

  /** 矩形和：行 [r1,r2]、列 [c1,c2]（含边界，1-based）。 */
  rectSum(r1: number, c1: number, r2: number, c2: number): number {
    return this.queryOuter(1, 1, this.R, r1, r2, c1, c2);
  }

  private queryOuter(
    idx: number,
    rl: number,
    rr: number,
    qrl: number,
    qrr: number,
    qcl: number,
    qcr: number,
  ): number {
    if (qrl > rr || qrr < rl) return 0;
    if (qrl <= rl && rr <= qrr) {
      const s = this.queryInner(this.rowNodes[idx]!.inner, 1, 1, this.cols, qcl, qcr);
      this.hooks.onQueryNode?.(rl, rr, qcl, qcr, s);
      return s;
    }
    const mid = (rl + rr) >> 1;
    return (
      this.queryOuter(idx * 2, rl, mid, qrl, qrr, qcl, qcr) +
      this.queryOuter(idx * 2 + 1, mid + 1, rr, qrl, qrr, qcl, qcr)
    );
  }

  private queryInner(
    tree: number[],
    idx: number,
    cl: number,
    cr: number,
    qcl: number,
    qcr: number,
  ): number {
    if (qcl > cr || qcr < cl) return 0;
    if (qcl <= cl && cr <= qcr) return tree[idx]!;
    const mid = (cl + cr) >> 1;
    return (
      this.queryInner(tree, idx * 2, cl, mid, qcl, qcr) +
      this.queryInner(tree, idx * 2 + 1, mid + 1, cr, qcl, qcr)
    );
  }
}

/**
 * 便捷封装：给定初始矩阵与多个矩形查询，返回每个矩形的和。
 */
export function segment2d(
  initial: ReadonlyArray<ReadonlyArray<number>>,
  queries: ReadonlyArray<{ r1: number; c1: number; r2: number; c2: number }>,
  hooks: Seg2dHooks = {},
): number[] {
  const rows = initial.length;
  const cols = rows > 0 ? (initial[0]?.length ?? 0) : 0;
  const tree = new SegmentTree2D(rows, cols, initial, hooks);
  return queries.map((q) => tree.rectSum(q.r1, q.c1, q.r2, q.c2));
}
