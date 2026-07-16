// =============================================================================
// 树状数组（Fenwick / BIT）—— 1-indexed，单点加 + 前缀和
// =============================================================================

export interface FenwickHooks {
  onUpdate?: (i: number, delta: number) => void;
  onQuery?: (i: number, partial: number) => void;
  onHop?: (i: number) => void;
}

export class Fenwick2 {
  private tree: number[];
  constructor(
    public readonly n: number,
    init: number[] = [],
    private hooks: FenwickHooks = {},
  ) {
    this.tree = new Array(n + 1).fill(0);
    for (let i = 0; i < n && i < init.length; i++) this.update(i + 1, init[i]!);
  }
  update(i: number, delta: number): void {
    this.hooks.onUpdate?.(i, delta);
    for (; i <= this.n; i += i & -i) {
      this.tree[i]! += delta;
      this.hooks.onHop?.(i);
    }
  }
  /** 前缀和 [1, i]。 */
  prefix(i: number): number {
    let sum = 0;
    for (; i > 0; i -= i & -i) {
      sum += this.tree[i]!;
      this.hooks.onQuery?.(i, sum);
    }
    return sum;
  }
  /** 区间和 [l, r]（1-indexed）。 */
  range(l: number, r: number): number {
    return this.prefix(r) - this.prefix(l - 1);
  }
}
