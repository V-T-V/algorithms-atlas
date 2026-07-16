// =============================================================================
// 可合并线段树（Mergeable Segment Tree / 线段树合并）· 纯算法实现（零 DOM 依赖）
// 在值域 [1, M] 上动态开点的权值线段树，支持：
//   - update(pos, delta)：单点加
//   - rangeSum(l, r)：区间求和
//   - merge(a, b)：把树 b 合并到树 a（对应节点 sum 相加，返回新根）
// 经典用途：树上启发式合并统计子树颜色/权值信息。
// =============================================================================

/** 动态节点。 */
export interface SegNode {
  sum: number;
  left: SegNode | null;
  right: SegNode | null;
}

/** 事件钩子（全可选）。 */
export interface MergeSegHooks {
  /** 单点加完成。 */
  onUpdate?: (root: SegNode | null, pos: number, delta: number) => void;
  /** 一次 merge 合并了一对节点。 */
  onMerge?: (l: number, r: number, sumA: number, sumB: number) => void;
  /** 一次区间求和。 */
  onRangeSum?: (l: number, r: number, sum: number) => void;
}

function makeNode(sum = 0): SegNode {
  return { sum, left: null, right: null };
}

/**
 * 可合并线段树（动态开点）。
 *
 * 合并原理：对两棵结构相同（值域相同）的线段树 a、b，递归合并：
 * - 若 a 为空 → 返回 b；若 b 为空 → 返回 a
 * - 否则 a.sum += b.sum，a.left = merge(a.left, b.left)，a.right = merge(a.right, b.right)
 * 合并复杂度 O(两棵树相交节点数)；启发式合并时总复杂度 O(n log n)。
 *
 * **复杂度**：update O(log M)，rangeSum O(log M)，merge 最坏 O(sizeA + sizeB)。
 */
export class MergeableSegTree {
  private root: SegNode | null = null;
  constructor(
    private readonly lo: number,
    private readonly hi: number,
    private hooks: MergeSegHooks = {},
  ) {
    if (lo > hi) throw new Error('merge-segment: lo > hi');
  }

  /** 取根（用于外部展示与 merge）。 */
  getRoot(): SegNode | null {
    return this.root;
  }

  /** 设置根（用于把 merge 结果赋回）。 */
  setRoot(root: SegNode | null): void {
    this.root = root;
  }

  /** 单点加：把 pos 加上 delta。 */
  update(pos: number, delta: number): void {
    this.root = this.updateRec(this.root, this.lo, this.hi, pos, delta);
    this.hooks.onUpdate?.(this.root, pos, delta);
  }

  private updateRec(
    node: SegNode | null,
    l: number,
    r: number,
    pos: number,
    delta: number,
  ): SegNode {
    const n = node ? { ...node } : makeNode();
    n.sum += delta;
    if (l === r) return n;
    const mid = (l + r) >> 1;
    if (pos <= mid) n.left = this.updateRec(n.left, l, mid, pos, delta);
    else n.right = this.updateRec(n.right, mid + 1, r, pos, delta);
    return n;
  }

  /** 区间求和：[ql, qr] 内所有 sum 之和。 */
  rangeSum(ql: number, qr: number): number {
    const s = this.queryRec(this.root, this.lo, this.hi, ql, qr);
    this.hooks.onRangeSum?.(ql, qr, s);
    return s;
  }

  private queryRec(node: SegNode | null, l: number, r: number, ql: number, qr: number): number {
    if (!node || ql > r || qr < l) return 0;
    if (ql <= l && r <= qr) return node.sum;
    const mid = (l + r) >> 1;
    return this.queryRec(node.left, l, mid, ql, qr) + this.queryRec(node.right, mid + 1, r, ql, qr);
  }

  /** 单点查询。 */
  pointQuery(pos: number): number {
    return this.rangeSum(pos, pos);
  }

  /**
   * 把另一棵树 other 合并到 this（this 接收合并结果）。
   * 两棵树必须共享同一个值域 [lo, hi]。
   */
  mergeInto(other: MergeableSegTree): void {
    if (other.lo !== this.lo || other.hi !== this.hi) {
      throw new Error('merge-segment: value domain mismatch');
    }
    this.root = this.mergeRec(this.root, other.root, this.lo, this.hi);
  }

  private mergeRec(a: SegNode | null, b: SegNode | null, l: number, r: number): SegNode | null {
    if (!a) return b;
    if (!b) return a;
    const merged: SegNode = {
      sum: a.sum + b.sum,
      left: null,
      right: null,
    };
    this.hooks.onMerge?.(l, r, a.sum, b.sum);
    if (l === r) return merged;
    const mid = (l + r) >> 1;
    merged.left = this.mergeRec(a.left, b.left, l, mid);
    merged.right = this.mergeRec(a.right, b.right, mid + 1, r);
    return merged;
  }
}

/**
 * 便捷封装：把多组数据各自建成线段树后合并为一棵，查询某区间总和。
 * @param groups 每个组是位置→权重的映射
 * @param domain 值域 [lo, hi]
 * @param queryRange 合并后要查询的区间
 */
export function mergeSegment(
  groups: ReadonlyArray<ReadonlyArray<[number, number]>>,
  domain: { lo: number; hi: number },
  queryRange: { l: number; r: number },
  hooks: MergeSegHooks = {},
): number {
  const acc = new MergeableSegTree(domain.lo, domain.hi, hooks);
  for (const group of groups) {
    const t = new MergeableSegTree(domain.lo, domain.hi);
    for (const [pos, w] of group) t.update(pos, w);
    acc.mergeInto(t);
  }
  return acc.rangeSum(queryRange.l, queryRange.r);
}
