// =============================================================================
// 树状数组（单点更新 + 区间求和）
// =============================================================================

export interface FenwickPointHooks {
  onPointAdd?: (index: number, delta: number) => void;
  onRangeQuery?: (l: number, r: number, result: number) => void;
}

export class FenwickPoint {
  n: number;
  bit: number[];
  hooks: FenwickPointHooks;

  constructor(n: number, hooks: FenwickPointHooks = {}) {
    this.n = n;
    this.bit = new Array(n + 1).fill(0);
    this.hooks = hooks;
  }

  pointAdd(i: number, delta: number): void {
    for (; i <= this.n; i += i & -i) this.bit[i] = this.bit[i]! + delta;
    this.hooks.onPointAdd?.(i, delta);
  }

  prefixSum(i: number): number {
    let s = 0;
    for (; i > 0; i -= i & -i) s += this.bit[i]!;
    return s;
  }

  /** 区间 [l..r] 和 (1-indexed) */
  rangeSum(l: number, r: number): number {
    const res = this.prefixSum(r) - this.prefixSum(l - 1);
    this.hooks.onRangeQuery?.(l, r, res);
    return res;
  }

  static fromArray(arr: number[], hooks: FenwickPointHooks = {}): FenwickPoint {
    const f = new FenwickPoint(arr.length, hooks);
    for (let i = 0; i < arr.length; i++) f.pointAdd(i + 1, arr[i]!);
    return f;
  }
}
