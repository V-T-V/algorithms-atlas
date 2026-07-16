// =============================================================================
// 线段树（单点更新 + 区间求和）
// =============================================================================

export interface SegmentPointHooks {
  onUpdate?: (index: number, newValue: number) => void;
  onQuery?: (l: number, r: number, result: number) => void;
}

export class SegmentTreePoint {
  n: number;
  tree: number[];
  hooks: SegmentPointHooks;

  constructor(arr: number[], hooks: SegmentPointHooks = {}) {
    this.n = arr.length;
    this.tree = new Array(4 * Math.max(1, this.n)).fill(0);
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
    this.tree[node] = this.tree[node * 2]! + this.tree[node * 2 + 1]!;
  }

  pointUpdate(index: number, value: number, node = 1, l = 0, r = this.n - 1): void {
    if (l === r) {
      this.tree[node] = value;
      this.hooks.onUpdate?.(index, value);
      return;
    }
    const mid = (l + r) >> 1;
    if (index <= mid) this.pointUpdate(index, value, node * 2, l, mid);
    else this.pointUpdate(index, value, node * 2 + 1, mid + 1, r);
    this.tree[node] = this.tree[node * 2]! + this.tree[node * 2 + 1]!;
  }

  rangeQuery(ql: number, qr: number, node = 1, l = 0, r = this.n - 1): number {
    if (ql > r || qr < l) return 0;
    if (ql <= l && r <= qr) return this.tree[node]!;
    const mid = (l + r) >> 1;
    return (
      this.rangeQuery(ql, qr, node * 2, l, mid) + this.rangeQuery(ql, qr, node * 2 + 1, mid + 1, r)
    );
  }

  query(l: number, r: number): number {
    const res = this.rangeQuery(l, r);
    this.hooks.onQuery?.(l, r, res);
    return res;
  }
}
