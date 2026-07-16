// =============================================================================
// 归并树：每个线段树节点维护该区间排好序的数组
// =============================================================================

export interface MergeTreeHooks {
  onBuild?: (l: number, r: number, size: number) => void;
  onQuery?: (l: number, r: number, x: number, cnt: number) => void;
}

export class MergeTree2 {
  private tree: number[][] = [];
  private n = 0;
  constructor(
    init: number[],
    private hooks: MergeTreeHooks = {},
  ) {
    this.n = init.length;
    if (this.n === 0) return;
    this.tree = new Array(4 * this.n).fill(null).map(() => []);
    this.build(1, 0, this.n - 1, init);
  }
  private build(node: number, l: number, r: number, init: number[]): void {
    if (l === r) {
      this.tree[node] = [init[l]!];
      this.hooks.onBuild?.(l, r, 1);
      return;
    }
    const m = (l + r) >> 1;
    this.build(node * 2, l, m, init);
    this.build(node * 2 + 1, m + 1, r, init);
    this.tree[node] = this.merge(this.tree[node * 2]!, this.tree[node * 2 + 1]!);
    this.hooks.onBuild?.(l, r, this.tree[node].length);
  }
  private merge(a: number[], b: number[]): number[] {
    const out: number[] = [];
    let i = 0;
    let j = 0;
    while (i < a.length && j < b.length) {
      if (a[i]! <= b[j]!) out.push(a[i]!);
      else out.push(b[j]!);
      const aLe = a[i]! <= b[j]!;
      if (aLe) i++;
      else j++;
    }
    while (i < a.length) {
      out.push(a[i]!);
      i++;
    }
    while (j < b.length) {
      out.push(b[j]!);
      j++;
    }
    return out;
  }
  /** 在区间 [ql, qr] 内值 <= x 的元素个数。 */
  countLE(ql: number, qr: number, x: number): number {
    if (this.n === 0) return 0;
    const res = this.countRec(1, 0, this.n - 1, ql, qr, x);
    this.hooks.onQuery?.(ql, qr, x, res);
    return res;
  }
  private countRec(node: number, l: number, r: number, ql: number, qr: number, x: number): number {
    if (qr < l || r < ql) return 0;
    if (ql <= l && r <= qr) {
      // 二分找 <= x 的个数
      const arr = this.tree[node]!;
      let lo = 0;
      let hi = arr.length;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (arr[mid]! <= x) lo = mid + 1;
        else hi = mid;
      }
      return lo;
    }
    const m = (l + r) >> 1;
    return (
      this.countRec(node * 2, l, m, ql, qr, x) + this.countRec(node * 2 + 1, m + 1, r, ql, qr, x)
    );
  }
  get size(): number {
    return this.n;
  }
}
