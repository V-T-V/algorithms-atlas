// =============================================================================
// 树状数组 Fenwick Tree / Binary Indexed Tree (BIT) · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 实现：1-based 的树状数组，支持「单点增加」+「前缀求和」。
//   - lowbit(i) = i & -i，即 i 的最低位 1。
//   - update：i += lowbit(i) 向上爬；query：i -= lowbit(i) 向左汇总。
// =============================================================================

/** 操作过程中的事件钩子。任一可选。 */
export interface FenwickHooks {
  /** 单点更新：经过下标 i（1-based）。delta 为本次增量。 */
  onUpdateStep?: (i: number, delta: number) => void;
  /** 前缀查询：汇总下标 i（1-based）的值。 */
  onQueryStep?: (i: number) => void;
}

/**
 * 树状数组（Fenwick Tree / BIT）。
 * 内部 1-based，bit[1..n]。支持单点增加与前缀求和（闭区间 [1, idx]）。
 */
export class FenwickTree {
  /** bit 数组（1-based，下标 0 不用）。 */
  private bit: number[];
  /** 元素个数。 */
  readonly n: number;

  constructor(size: number) {
    if (size < 0) size = 0;
    this.n = size;
    this.bit = new Array<number>(size + 1).fill(0);
  }

  /** 由初值数组构造（逐个 add，O(n log n)）。 */
  static fromArray(values: readonly number[]): FenwickTree {
    const ft = new FenwickTree(values.length);
    for (let i = 0; i < values.length; i++) ft.add(i + 1, values[i]!);
    return ft;
  }

  /** 取 i 的最低位 1（lowbit）。i > 0。 */
  private lowbit(i: number): number {
    return i & -i;
  }

  /** 单点增加：把下标 idx（1-based）处的值加上 delta。越界忽略。 */
  add(idx: number, delta: number, hooks: FenwickHooks = {}): void {
    if (idx < 1 || idx > this.n) return;
    for (let i = idx; i <= this.n; i += this.lowbit(i)) {
      this.bit[i] = (this.bit[i] ?? 0) + delta;
      hooks.onUpdateStep?.(i, delta);
    }
  }

  /** 前缀和 sum[1..idx]（1-based，闭区间）。idx 越界按边界处理。 */
  prefixSum(idx: number, hooks: FenwickHooks = {}): number {
    let sum = 0;
    for (let i = Math.min(idx, this.n); i > 0; i -= this.lowbit(i)) {
      sum += this.bit[i] ?? 0;
      hooks.onQueryStep?.(i);
    }
    return sum;
  }

  /** 区间和 sum[l..r]（1-based，闭区间）。 */
  rangeSum(l: number, r: number, hooks: FenwickHooks = {}): number {
    if (l > r) return 0;
    return this.prefixSum(r, hooks) - this.prefixSum(l - 1, hooks);
  }

  /** 内部 bit 数组副本（1-based，含未用下标 0）。 */
  toArray(): number[] {
    return [...this.bit];
  }
}

/**
 * 便利函数：由初值数组构建 BIT，返回 FenwickTree 实例。
 */
export function fenwickTree(values: readonly number[], hooks: FenwickHooks = {}): FenwickTree {
  const ft = new FenwickTree(values.length);
  for (let i = 0; i < values.length; i++) ft.add(i + 1, values[i]!, hooks);
  return ft;
}
