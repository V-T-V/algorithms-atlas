// =============================================================================
// 主席树（Chairman Tree / Persistent Segment Tree）· 纯算法实现（零 DOM 依赖）
// 经典应用：静态区间第 k 小。对数组 a 的每个前缀建一棵"权值线段树"，
// 利用可持久化只新增 O(log n) 个节点，前缀相减得到任意区间的权值分布。
// =============================================================================

/** 权值线段树节点（持久化：永不修改，只新建）。 */
export interface SegNode {
  /** 区间内出现的元素个数。 */
  sum: number;
  left: SegNode | null;
  right: SegNode | null;
}

/** 事件钩子（全可选）。 */
export interface ChairmanHooks {
  /** 在值域 [lo, hi] 上创建一个新版本根节点。 */
  onVersion?: (version: number, insertedValue: number) => void;
  /** 一次 k-th 查询的递归进入。 */
  onQueryStep?: (leftCount: number, k: number, goLeft: boolean) => void;
}

/**
 * 主席树（持久化权值线段树）。
 *
 * 构建：
 * - 把原数组离散化（坐标压缩）到 1..m 的值域
 * - versions[0] 为空树；每插入一个元素得到一棵新树 versions[i]
 * - 插入只沿路径新建 O(log m) 个节点，其余共享
 *
 * 查询 [l, r] 区间第 k 小：
 * - 同时从 versions[l-1] 和 versions[r] 出发，逐层比较左子树的 sum 差
 * - 差 = versions[r].left.sum - versions[l-1].left.sum 即区间内落在左值域的元素数
 * - 若差 ≥ k，第 k 小在左子树；否则去右子树找第 (k - 差) 小
 *
 * **复杂度**：构建 O(n log m)，单次查询 O(log m)，空间 O(n log m)。
 */
export class ChairmanTree {
  readonly versions: SegNode[] = [];
  private readonly lo: number;
  private readonly hi: number;
  private readonly rank: Map<number, number>;

  constructor(
    /** 原始数组。 */
    readonly data: readonly number[],
    private hooks: ChairmanHooks = {},
  ) {
    // 离散化
    const sorted = [...new Set(data)].sort((a, b) => a - b);
    this.rank = new Map(sorted.map((v, i) => [v, i + 1] as const));
    this.lo = 1;
    this.hi = sorted.length;
    // versions[0] = 空树
    this.versions.push(this.buildEmpty(this.lo, this.hi));
    // 逐个插入
    data.forEach((v, i) => {
      const r = this.rank.get(v)!;
      const prev = this.versions[this.versions.length - 1]!;
      const next = this.insert(prev, this.lo, this.hi, r);
      this.versions.push(next);
      this.hooks.onVersion?.(i + 1, v);
    });
  }

  private buildEmpty(l: number, r: number): SegNode {
    if (l === r) return { sum: 0, left: null, right: null };
    const mid = (l + r) >> 1;
    return {
      sum: 0,
      left: this.buildEmpty(l, mid),
      right: this.buildEmpty(mid + 1, r),
    };
  }

  private insert(prev: SegNode, l: number, r: number, rank: number): SegNode {
    const node: SegNode = { sum: prev.sum + 1, left: prev.left, right: prev.right };
    if (l === r) return node;
    const mid = (l + r) >> 1;
    if (rank <= mid) {
      node.left = this.insert(prev.left!, l, mid, rank);
    } else {
      node.right = this.insert(prev.right!, mid + 1, r, rank);
    }
    return node;
  }

  /**
   * 查询区间 [ql, qr]（1-based 下标）内第 k 小的原始值。
   * @returns 第 k 小的原始数值；若 k 越界返回 NaN
   */
  kth(ql: number, qr: number, k: number): number {
    if (ql < 1 || qr > this.versions.length - 1 || ql > qr) return NaN;
    if (k < 1 || k > qr - ql + 1) return NaN;
    const leftRoot = this.versions[ql - 1]!;
    const rightRoot = this.versions[qr]!;
    const rank = this.query(leftRoot, rightRoot, this.lo, this.hi, k);
    if (rank < 1) return NaN;
    for (const [v, rk] of this.rank) if (rk === rank) return v;
    return NaN;
  }

  private query(leftNode: SegNode, rightNode: SegNode, l: number, r: number, k: number): number {
    if (l === r) return l;
    const mid = (l + r) >> 1;
    const leftCount = (rightNode.left?.sum ?? 0) - (leftNode.left?.sum ?? 0);
    const goLeft = leftCount >= k;
    this.hooks.onQueryStep?.(leftCount, k, goLeft);
    if (goLeft) {
      return this.query(leftNode.left!, rightNode.left!, l, mid, k);
    }
    return this.query(leftNode.right!, rightNode.right!, mid + 1, r, k - leftCount);
  }
}

/** 便捷封装：构造主席树并查询区间第 k 小。 */
export function chairmanTree(
  data: readonly number[],
  queries: ReadonlyArray<{ ql: number; qr: number; k: number }>,
  hooks: ChairmanHooks = {},
): number[] {
  const tree = new ChairmanTree(data, hooks);
  return queries.map((q) => tree.kth(q.ql, q.qr, q.k));
}
