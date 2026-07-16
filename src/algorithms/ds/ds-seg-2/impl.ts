// =============================================================================
// 线段树（区间加 + 区间求和，带懒标记）
// =============================================================================

export interface SegHooks {
  onUpdate?: (l: number, r: number, add: number) => void;
  onQuery?: (l: number, r: number, result: number) => void;
  onPushDown?: (node: number) => void;
  onDone?: () => void;
}

export class SegTree2 {
  private tree: number[];
  private lazy: number[];
  private n: number;
  constructor(
    init: number[],
    private hooks: SegHooks = {},
  ) {
    this.n = init.length;
    if (this.n === 0) {
      this.tree = [];
      this.lazy = [];
      return;
    }
    const size = 4 * this.n;
    this.tree = new Array(size).fill(0);
    this.lazy = new Array(size).fill(0);
    this.build(1, 0, this.n - 1, init);
  }
  private build(node: number, l: number, r: number, init: number[]): void {
    if (l === r) {
      this.tree[node] = init[l]!;
      return;
    }
    const m = (l + r) >> 1;
    this.build(node * 2, l, m, init);
    this.build(node * 2 + 1, m + 1, r, init);
    this.tree[node] = this.tree[node * 2]! + this.tree[node * 2 + 1]!;
  }
  private pushDown(node: number, leftLen: number, rightLen: number): void {
    if (this.lazy[node] !== 0) {
      this.hooks.onPushDown?.(node);
      const tag = this.lazy[node]!;
      const lc = node * 2;
      const rc = node * 2 + 1;
      this.tree[lc]! += tag * leftLen;
      this.lazy[lc]! += tag;
      this.tree[rc]! += tag * rightLen;
      this.lazy[rc]! += tag;
      this.lazy[node] = 0;
    }
  }
  update(ql: number, qr: number, add: number): void {
    if (this.n === 0) return;
    this.hooks.onUpdate?.(ql, qr, add);
    this.updateRec(1, 0, this.n - 1, ql, qr, add);
  }
  private updateRec(node: number, l: number, r: number, ql: number, qr: number, add: number): void {
    if (qr < l || r < ql) return;
    if (ql <= l && r <= qr) {
      this.tree[node]! += add * (r - l + 1);
      this.lazy[node]! += add;
      return;
    }
    const m = (l + r) >> 1;
    this.pushDown(node, m - l + 1, r - m);
    this.updateRec(node * 2, l, m, ql, qr, add);
    this.updateRec(node * 2 + 1, m + 1, r, ql, qr, add);
    this.tree[node] = this.tree[node * 2]! + this.tree[node * 2 + 1]!;
  }
  query(ql: number, qr: number): number {
    if (this.n === 0) return 0;
    const res = this.queryRec(1, 0, this.n - 1, ql, qr);
    this.hooks.onQuery?.(ql, qr, res);
    return res;
  }
  private queryRec(node: number, l: number, r: number, ql: number, qr: number): number {
    if (qr < l || r < ql) return 0;
    if (ql <= l && r <= qr) return this.tree[node]!;
    const m = (l + r) >> 1;
    this.pushDown(node, m - l + 1, r - m);
    return this.queryRec(node * 2, l, m, ql, qr) + this.queryRec(node * 2 + 1, m + 1, r, ql, qr);
  }
  /** 取当前数组值（用于可视化）。 */
  snapshot(): number[] {
    const out = new Array(this.n).fill(0);
    for (let i = 0; i < this.n; i++) out[i] = this.query(i, i);
    return out;
  }
}
