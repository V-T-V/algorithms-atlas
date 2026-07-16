// =============================================================================
// ST 表：静态 RMQ（区间最大），可改为 min / gcd 等满足可重复贡献的操作
// =============================================================================

import { log2floor } from './log2.ts';

export interface STHooks {
  onBuild?: (k: number, i: number, value: number) => void;
  onQuery?: (l: number, r: number, result: number) => void;
}

export class SparseTable2 {
  private st: number[][];
  private n: number;
  constructor(
    init: number[],
    private hooks: STHooks = {},
  ) {
    this.n = init.length;
    if (this.n === 0) {
      this.st = [];
      return;
    }
    const K = log2floor(this.n) + 1;
    this.st = new Array(K).fill(null).map(() => new Array(this.n).fill(0));
    for (let i = 0; i < this.n; i++) {
      this.st[0]![i] = init[i]!;
      this.hooks.onBuild?.(0, i, init[i]!);
    }
    for (let k = 1; k < K; k++) {
      for (let i = 0; i + (1 << k) - 1 < this.n; i++) {
        this.st[k]![i] = Math.max(this.st[k - 1]![i]!, this.st[k - 1]![i + (1 << (k - 1))]!);
        this.hooks.onBuild?.(k, i, this.st[k]![i]!);
      }
    }
  }
  /** 区间 [l, r] 最大值（0-indexed, 含）。 */
  query(l: number, r: number): number {
    if (this.n === 0 || l > r) return Number.NEGATIVE_INFINITY;
    const k = log2floor(r - l + 1);
    const res = Math.max(this.st[k]![l]!, this.st[k]![r - (1 << k) + 1]!);
    this.hooks.onQuery?.(l, r, res);
    return res;
  }
  get length(): number {
    return this.n;
  }
}
