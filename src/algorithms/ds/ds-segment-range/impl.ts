// =============================================================================
// 线段树（区间更新 + 区间最大）
// =============================================================================

export interface SegmentRangeHooks {
  onUpdate?: (l: number, r: number, value: number) => void;
  onQuery?: (l: number, r: number, result: number) => void;
  onPushDown?: (node: number) => void;
}

const NEG_INF = -Infinity;

export class SegmentTreeRange {
  n: number;
  tree: number[];
  lazy: number[];
  hasLazy: boolean[];
  hooks: SegmentRangeHooks;

  constructor(arr: number[], hooks: SegmentRangeHooks = {}) {
    this.n = arr.length;
    this.tree = new Array(4 * Math.max(1, this.n)).fill(NEG_INF);
    this.lazy = new Array(4 * Math.max(1, this.n)).fill(0);
    this.hasLazy = new Array(4 * Math.max(1, this.n)).fill(false);
    this.hooks = hooks;
    if (this.n > 0) this.build(1, 0, this.n - 1, arr);
  }

  private build(node: number, l: number, r: number, arr: number[]): void {
    if (l === r) {
      this.tree[node] = arr[l]!;
      return;
    }
    const mid = (l + r) >> 1;
    this.build(node * 2, l, mid, arr);
    this.build(node * 2 + 1, mid + 1, r, arr);
    this.tree[node] = Math.max(this.tree[node * 2]!, this.tree[node * 2 + 1]!);
  }

  private pushDown(node: number): void {
    if (!this.hasLazy[node]) return;
    const v = this.lazy[node]!;
    for (const c of [node * 2, node * 2 + 1]) {
      this.tree[c] = v;
      this.lazy[c] = v;
      this.hasLazy[c] = true;
    }
    this.hasLazy[node] = false;
    this.lazy[node] = 0;
    this.hooks.onPushDown?.(node);
  }

  rangeUpdate(ql: number, qr: number, value: number, node = 1, l = 0, r = this.n - 1): void {
    if (ql > r || qr < l) return;
    if (ql <= l && r <= qr) {
      this.tree[node] = value;
      this.lazy[node] = value;
      this.hasLazy[node] = true;
      this.hooks.onUpdate?.(ql, qr, value);
      return;
    }
    this.pushDown(node);
    const mid = (l + r) >> 1;
    this.rangeUpdate(ql, qr, value, node * 2, l, mid);
    this.rangeUpdate(ql, qr, value, node * 2 + 1, mid + 1, r);
    this.tree[node] = Math.max(this.tree[node * 2]!, this.tree[node * 2 + 1]!);
  }

  rangeQuery(ql: number, qr: number, node = 1, l = 0, r = this.n - 1): number {
    if (ql > r || qr < l) return NEG_INF;
    if (ql <= l && r <= qr) return this.tree[node]!;
    this.pushDown(node);
    const mid = (l + r) >> 1;
    return Math.max(
      this.rangeQuery(ql, qr, node * 2, l, mid),
      this.rangeQuery(ql, qr, node * 2 + 1, mid + 1, r),
    );
  }

  /** 查询并触发 hook */
  query(l: number, r: number): number {
    const res = this.rangeQuery(l, r);
    this.hooks.onQuery?.(l, r, res);
    return res;
  }
}
