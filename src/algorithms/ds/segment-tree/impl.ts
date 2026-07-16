// =============================================================================
// 线段树 Segment Tree · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 实现：支持单点更新 + 区间求和的线段树（数组存储，递归版）。
//   - 叶子对应原数组元素；内部节点 = 左右子区间之和。
//   - 区间查询/更新均 O(log n)。
// =============================================================================

/** 区间操作过程中的事件钩子。任一可选。 */
export interface SegTreeHooks {
  /** 建树：把节点 node（管辖 [lo, hi]）的值初始化为 val。 */
  onBuildNode?: (node: number, lo: number, hi: number, val: number) => void;
  /** 区间查询：访问节点 node（[lo, hi]），fully 表示是否完全落入查询区间。 */
  onQueryVisit?: (node: number, lo: number, hi: number, fully: boolean) => void;
  /** 单点更新：更新 pos 处后，沿回溯路径把节点 node 的值刷新为 val。 */
  onUpdateNode?: (node: number, lo: number, hi: number, val: number) => void;
}

/**
 * 线段树（单点更新 + 区间求和）。
 * 内部用 4n 大小的数组存储，节点 1 为根（0 留空便于父子下标计算）。
 */
export class SegmentTree {
  /** 原数组（可变）。 */
  private arr: number[];
  /** 线段树数组（4n 容量足够递归建树）。 */
  private tree: number[];

  constructor(values: readonly number[] = []) {
    this.arr = [...values];
    this.tree = new Array<number>(4 * Math.max(1, this.arr.length)).fill(0);
    if (this.arr.length > 0) this.buildInternal(1, 0, this.arr.length - 1, {});
  }

  /** （重新）建树。 */
  build(values: readonly number[], hooks: SegTreeHooks = {}): void {
    this.arr = [...values];
    this.tree = new Array<number>(4 * Math.max(1, this.arr.length)).fill(0);
    if (this.arr.length > 0) this.buildInternal(1, 0, this.arr.length - 1, hooks);
  }

  /** 内部递归建树。 */
  private buildInternal(node: number, lo: number, hi: number, hooks: SegTreeHooks): void {
    if (lo === hi) {
      const v = this.arr[lo]!;
      this.tree[node] = v;
      hooks.onBuildNode?.(node, lo, hi, v);
      return;
    }
    const mid = (lo + hi) >> 1;
    this.buildInternal(2 * node, lo, mid, hooks);
    this.buildInternal(2 * node + 1, mid + 1, hi, hooks);
    const v = this.tree[2 * node]! + this.tree[2 * node + 1]!;
    this.tree[node] = v;
    hooks.onBuildNode?.(node, lo, hi, v);
  }

  /** 单点更新：把下标 pos 的元素改为 newVal。 */
  update(pos: number, newVal: number, hooks: SegTreeHooks = {}): void {
    if (pos < 0 || pos >= this.arr.length) return;
    this.arr[pos] = newVal;
    this.updateRec(1, 0, this.arr.length - 1, pos, newVal, hooks);
  }

  private updateRec(
    node: number,
    lo: number,
    hi: number,
    pos: number,
    newVal: number,
    hooks: SegTreeHooks,
  ): void {
    if (lo === hi) {
      this.tree[node] = newVal;
      hooks.onUpdateNode?.(node, lo, hi, newVal);
      return;
    }
    const mid = (lo + hi) >> 1;
    if (pos <= mid) this.updateRec(2 * node, lo, mid, pos, newVal, hooks);
    else this.updateRec(2 * node + 1, mid + 1, hi, pos, newVal, hooks);
    const v = this.tree[2 * node]! + this.tree[2 * node + 1]!;
    this.tree[node] = v;
    hooks.onUpdateNode?.(node, lo, hi, v);
  }

  /** 区间求和 [ql, qr]（闭区间）。越界部分自动忽略。 */
  query(ql: number, qr: number, hooks: SegTreeHooks = {}): number {
    if (this.arr.length === 0) return 0;
    const lo = Math.max(0, ql);
    const hi = Math.min(this.arr.length - 1, qr);
    if (lo > hi) return 0;
    return this.queryRec(1, 0, this.arr.length - 1, lo, hi, hooks);
  }

  private queryRec(
    node: number,
    lo: number,
    hi: number,
    ql: number,
    qr: number,
    hooks: SegTreeHooks,
  ): number {
    if (ql <= lo && hi <= qr) {
      hooks.onQueryVisit?.(node, lo, hi, true);
      return this.tree[node]!;
    }
    hooks.onQueryVisit?.(node, lo, hi, false);
    const mid = (lo + hi) >> 1;
    let sum = 0;
    if (ql <= mid) sum += this.queryRec(2 * node, lo, mid, ql, qr, hooks);
    if (qr > mid) sum += this.queryRec(2 * node + 1, mid + 1, hi, ql, qr, hooks);
    return sum;
  }

  /** 原数组副本。 */
  toArray(): number[] {
    return [...this.arr];
  }

  /** 内部树数组副本（用于断言）。 */
  toTreeArray(): number[] {
    return [...this.tree];
  }
}

/**
 * 便利函数：建树，返回 SegmentTree 实例。
 */
export function segmentTree(values: readonly number[], _hooks: SegTreeHooks = {}): SegmentTree {
  return new SegmentTree(values);
}
