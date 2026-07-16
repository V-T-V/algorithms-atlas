// =============================================================================
// 二维树状数组（2D Binary Indexed Tree / 2D Fenwick）· 纯算法实现（零 DOM 依赖）
// 维护一个二维网格上的单点加法、支持矩形前缀和与任意矩形和查询。
// =============================================================================

/** 事件钩子（全可选）。 */
export interface Fenwick2dHooks {
  /** 一次 update 操作完成。 */
  onUpdate?: (r: number, c: number, delta: number) => void;
  /** 一次前缀和查询涉及到的"跳点"。 */
  onQueryJump?: (r: number, c: number, partial: number) => void;
}

/**
 * 二维树状数组。
 *
 * 原理：一维 BIT 用 lowbit 把下标拆成 O(log n) 段；
 * 二维 BIT 在两维上分别拆段，所以 update 与 query 都是 O(log R · log C)。
 *
 * - update(r, c, delta)：对 i = r; i ≤ R; i += lowbit(i)，对 j = c; j ≤ C; j += lowbit(j)，
 *   都加 delta。共 O(log R · log C) 个节点被改。
 * - prefixSum(r, c)：对 i = r; i > 0; i -= lowbit(i)，对 j = c; j > 0; j -= lowbit(j)，
 *   累加 tree[i][j]。共 O(log R · log C) 次累加。
 * - 矩形和 = prefixSum(r2,c2) − prefixSum(r1−1,c2) − prefixSum(r2,c1−1) + prefixSum(r1−1,c1−1)。
 *
 * **下标约定**：行/列均 1-based；r ∈ [1, R]，c ∈ [1, C]。
 *
 * **复杂度**：build O(R·C)，update / query O(log R · log C)，空间 O(R·C)。
 */
export class Fenwick2D {
  /** 内部 (R+1) × (C+1) 数组；tree[i][j] 是某个矩形区间的和。 */
  private readonly tree: number[][];
  /** 原始矩阵副本（用于展示与校验），1-based。 */
  readonly mat: number[][];

  constructor(
    /** 行数。 */
    readonly rows: number,
    /** 列数。 */
    readonly cols: number,
    /** 可选初始矩阵（1-based 或 0-based 皆可，这里按 0-based 二维数组传入）。 */
    initial: ReadonlyArray<ReadonlyArray<number>> = [],
    private hooks: Fenwick2dHooks = {},
  ) {
    this.tree = Array.from({ length: rows + 1 }, () => new Array<number>(cols + 1).fill(0));
    this.mat = Array.from({ length: rows + 1 }, () => new Array<number>(cols + 1).fill(0));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const v = initial[r]?.[c] ?? 0;
        if (v !== 0) this.update(r + 1, c + 1, v);
      }
    }
  }

  private static lowbit(x: number): number {
    return x & -x;
  }

  /** 单点加：把 (r,c) 加上 delta（1-based）。 */
  update(r: number, c: number, delta: number, silent = false): void {
    this.mat[r]![c]! += delta;
    for (let i = r; i <= this.rows; i += Fenwick2D.lowbit(i)) {
      for (let j = c; j <= this.cols; j += Fenwick2D.lowbit(j)) {
        this.tree[i]![j]! += delta;
      }
    }
    if (!silent) this.hooks.onUpdate?.(r, c, delta);
  }

  /** 前缀和：左上角 (1,1) 到 (r,c) 的矩形元素之和（1-based，含边界）。 */
  prefixSum(r: number, c: number): number {
    let s = 0;
    for (let i = r; i > 0; i -= Fenwick2D.lowbit(i)) {
      for (let j = c; j > 0; j -= Fenwick2D.lowbit(j)) {
        s += this.tree[i]![j]!;
        this.hooks.onQueryJump?.(i, j, s);
      }
    }
    return s;
  }

  /**
   * 任意矩形和：行 [r1, r2]、列 [c1, c2]（含边界，1-based）。
   */
  rectSum(r1: number, c1: number, r2: number, c2: number): number {
    return (
      this.prefixSum(r2, c2) -
      this.prefixSum(r1 - 1, c2) -
      this.prefixSum(r2, c1 - 1) +
      this.prefixSum(r1 - 1, c1 - 1)
    );
  }
}

/**
 * 便捷封装：给定初始矩阵与一组矩形查询，返回每个矩形的和。
 */
export function fenwick2d(
  initial: ReadonlyArray<ReadonlyArray<number>>,
  queries: ReadonlyArray<{ r1: number; c1: number; r2: number; c2: number }>,
  hooks: Fenwick2dHooks = {},
): number[] {
  const rows = initial.length;
  const cols = rows > 0 ? (initial[0]?.length ?? 0) : 0;
  const ft = new Fenwick2D(rows, cols, initial, hooks);
  return queries.map((q) => ft.rectSum(q.r1, q.c1, q.r2, q.c2));
}
