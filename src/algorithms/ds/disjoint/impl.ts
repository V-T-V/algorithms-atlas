// =============================================================================
// Sparse Table（稀疏表）· 纯算法实现（零 DOM 依赖，可独立单测）
// 实现：可重复贡献的静态 RMQ（区间最小）。
//   - st[k][i] = min{ a[i..i+2^k-1] }
//   - 预处理 O(n log n)，查询 O(1)：min(st[k][l], st[k][r-2^k+1])
//   - 仅支持静态（不可修改）数组；适用于可重复贡献的运算（min/max/gcd/or/and）
// =============================================================================

/** 预处理 / 查询过程中的事件钩子。任一可选。 */
export interface SparseTableHooks {
  /** 计算对数表完成，最大 logK。 */
  onLogReady?: (maxLog: number) => void;
  /** 填充 st[k][i] = min(st[k-1][i], st[k-1][i+2^(k-1)])。 */
  onFill?: (k: number, i: number, value: number) => void;
  /** 查询区间 [l, r] 开始。 */
  onQueryStart?: (l: number, r: number) => void;
  /** 查询取两段比较：左段 [l, l+2^k-1]、右段 [r-2^k+1, r]，k 为所选幂。 */
  onQueryCompare?: (l: number, r: number, k: number, leftVal: number, rightVal: number) => void;
  /** 查询结束，给出结果值与下标。 */
  onResult?: (l: number, r: number, value: number, index: number) => void;
}

/**
 * 稀疏表（静态区间最小 RMQ）。
 * 存值的同时存最小值的下标，便于定位。
 */
export class SparseTable {
  readonly arr: number[];
  readonly n: number;
  /** log2 表：log[i] = ⌊log2(i)⌋。 */
  readonly log: number[];
  /** st[k] 是长度为 n 的数组：st[k][i] = 区间 [i, i+2^k-1] 的最小值的下标。 */
  readonly st: number[][];
  readonly maxK: number;

  constructor(values: readonly number[] = [], hooks: SparseTableHooks = {}) {
    this.arr = [...values];
    this.n = this.arr.length;
    // 预处理 log 表
    this.log = new Array<number>(Math.max(1, this.n + 1)).fill(0);
    for (let i = 2; i <= this.n; i++) this.log[i] = this.log[i >> 1]! + 1;
    this.maxK = this.n > 0 ? this.log[this.n]! + 1 : 1;
    // st[k][i]
    this.st = Array.from({ length: this.maxK }, () =>
      new Array<number>(Math.max(1, this.n)).fill(0),
    );
    // k = 0：长度 1，下标即自身
    for (let i = 0; i < this.n; i++) {
      this.st[0]![i] = i;
      hooks.onFill?.(0, i, this.arr[i]!);
    }
    // k >= 1
    for (let k = 1; k < this.maxK; k++) {
      const step = 1 << (k - 1);
      for (let i = 0; i + (1 << k) - 1 < this.n; i++) {
        const left = this.st[k - 1]![i]!;
        const right = this.st[k - 1]![i + step]!;
        // 取较小值的下标（相等取左侧，保证稳定）
        const pick = this.arr[left]! <= this.arr[right]! ? left : right;
        this.st[k]![i] = pick;
        hooks.onFill?.(k, i, this.arr[pick]!);
      }
    }
    hooks.onLogReady?.(this.maxK);
  }

  /** 区间最小值下标 [l, r]（闭区间）。 */
  queryIndex(l: number, r: number, hooks: SparseTableHooks = {}): number {
    if (this.n === 0 || l > r || l < 0 || r >= this.n) return -1;
    hooks.onQueryStart?.(l, r);
    const k = this.log[r - l + 1]!;
    const leftIdx = this.st[k]![l]!;
    const rightIdx = this.st[k]![r - (1 << k) + 1]!;
    const leftVal = this.arr[leftIdx]!;
    const rightVal = this.arr[rightIdx]!;
    hooks.onQueryCompare?.(l, r, k, leftVal, rightVal);
    const idx = leftVal <= rightVal ? leftIdx : rightIdx;
    hooks.onResult?.(l, r, this.arr[idx]!, idx);
    return idx;
  }

  /** 区间最小值 [l, r]。 */
  query(l: number, r: number, hooks: SparseTableHooks = {}): number {
    const idx = this.queryIndex(l, r, hooks);
    return idx < 0 ? NaN : this.arr[idx]!;
  }
}

/**
 * 便利函数：建表并执行若干区间查询，返回结果数组（值）。
 */
export function disjoint(
  input: { values: number[]; queries: Array<[number, number]> },
  hooks: SparseTableHooks = {},
): number[] {
  const st = new SparseTable(input.values, hooks);
  return input.queries.map((q) => st.query(q[0], q[1], hooks));
}
