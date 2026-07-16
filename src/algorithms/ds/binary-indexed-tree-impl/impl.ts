// =============================================================================
// 树状数组（区间更新版）· 纯算法实现
// 两个 BIT 支持区间加 + 区间和。零 DOM 依赖，可独立单测。
// =============================================================================

export interface BITRangeHooks {
  onPointUpdate?: (which: 1 | 2, i: number, delta: number) => void;
  onPrefixQuery?: (which: 1 | 2, i: number) => void;
}

/** 单个 BIT（1-based，内部）。 */
class BIT {
  readonly n: number;
  private tree: number[];
  constructor(n: number) {
    this.n = n;
    this.tree = new Array<number>(n + 1).fill(0);
  }
  private lowbit(i: number): number {
    return i & -i;
  }
  add(idx: number, delta: number, which: 1 | 2, hooks: BITRangeHooks): void {
    for (let i = idx; i <= this.n; i += this.lowbit(i)) {
      this.tree[i] = (this.tree[i] ?? 0) + delta;
      hooks.onPointUpdate?.(which, i, delta);
    }
  }
  prefix(idx: number, which: 1 | 2, hooks: BITRangeHooks): number {
    let s = 0;
    for (let i = Math.min(idx, this.n); i > 0; i -= this.lowbit(i)) {
      s += this.tree[i] ?? 0;
      hooks.onPrefixQuery?.(which, i);
    }
    return s;
  }
}

/**
 * 区间更新树状数组：支持「区间加」+「区间和查询」。
 * 内部用两个 BIT（差分 + i·差分）。
 */
export class BITRange {
  private b1: BIT;
  private b2: BIT;
  readonly n: number;

  constructor(n: number) {
    this.n = n;
    this.b1 = new BIT(n);
    this.b2 = new BIT(n);
  }

  /** 由初值数组构造。 */
  static fromArray(values: readonly number[]): BITRange {
    const bit = new BITRange(values.length);
    for (let i = 0; i < values.length; i++) {
      bit.rangeAdd(i + 1, i + 1, values[i]!);
    }
    return bit;
  }

  /** 对 [l, r]（1-based 闭区间）整体加 v。 */
  rangeAdd(l: number, r: number, v: number, hooks: BITRangeHooks = {}): void {
    if (l > r) return;
    // 差分：d[l]+=v, d[r+1]-=v
    this.b1.add(l, v, 1, hooks);
    if (r + 1 <= this.n) this.b1.add(r + 1, -v, 1, hooks);
    this.b2.add(l, l * v, 2, hooks);
    if (r + 1 <= this.n) this.b2.add(r + 1, -(r + 1) * v, 2, hooks);
  }

  /** 前缀和 S[1..idx]（1-based）。 */
  prefixSum(idx: number, hooks: BITRangeHooks = {}): number {
    if (idx <= 0) return 0;
    const i = Math.min(idx, this.n);
    return this.b1.prefix(i, 1, hooks) * (i + 1) - this.b2.prefix(i, 2, hooks);
  }

  /** 区间和 S[l..r]（1-based 闭区间）。 */
  rangeSum(l: number, r: number, hooks: BITRangeHooks = {}): number {
    if (l > r) return 0;
    return this.prefixSum(r, hooks) - this.prefixSum(l - 1, hooks);
  }

  /** 单点值 a[idx]（1-based）。 */
  pointValue(idx: number, hooks: BITRangeHooks = {}): number {
    return this.rangeSum(idx, idx, hooks);
  }
}
