// =============================================================================
// 树状数组（区间更新 + 单点查询，基于差分）
// =============================================================================

export interface FenwickRangeHooks {
  onRangeAdd?: (l: number, r: number, delta: number) => void;
  onPointQuery?: (index: number, value: number) => void;
}

export class FenwickRange {
  n: number;
  bit: number[];
  hooks: FenwickRangeHooks;

  constructor(n: number, hooks: FenwickRangeHooks = {}) {
    this.n = n;
    this.bit = new Array(n + 1).fill(0);
    this.hooks = hooks;
  }

  private add(i: number, delta: number): void {
    for (; i <= this.n; i += i & -i) this.bit[i] = this.bit[i]! + delta;
  }

  private prefixSum(i: number): number {
    let s = 0;
    for (; i > 0; i -= i & -i) s += this.bit[i]!;
    return s;
  }

  /** 区间 [l..r] (1-indexed) 整体加 delta */
  rangeAdd(l: number, r: number, delta: number): void {
    this.add(l, delta);
    this.add(r + 1, -delta);
    this.hooks.onRangeAdd?.(l, r, delta);
  }

  /** 单点查询 a[i] (1-indexed) */
  pointQuery(i: number): number {
    const v = this.prefixSum(i);
    this.hooks.onPointQuery?.(i, v);
    return v;
  }

  /** 由初始数组构造（即对每个位置做 rangeAdd(i,i,v)） */
  static fromArray(arr: number[], hooks: FenwickRangeHooks = {}): FenwickRange {
    const f = new FenwickRange(arr.length, hooks);
    for (let i = 0; i < arr.length; i++) f.rangeAdd(i + 1, i + 1, arr[i]!);
    return f;
  }
}
