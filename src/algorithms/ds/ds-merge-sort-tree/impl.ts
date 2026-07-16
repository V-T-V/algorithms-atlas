// =============================================================================
// 归并排序树
// =============================================================================

export interface MergeSortTreeHooks {
  onBuildNode?: (node: number, l: number, r: number, sorted: number[]) => void;
  onQuery?: (ql: number, qr: number, k: number, count: number) => void;
}

export class MergeSortTree {
  n: number;
  tree: number[][];
  hooks: MergeSortTreeHooks;

  constructor(arr: number[], hooks: MergeSortTreeHooks = {}) {
    this.n = arr.length;
    this.tree = new Array(4 * Math.max(1, this.n));
    this.hooks = hooks;
    if (this.n > 0) this.build(1, 0, this.n - 1, arr);
  }

  private build(node: number, l: number, r: number, arr: number[]): void {
    if (l === r) {
      this.tree[node] = [arr[l]!];
      this.hooks.onBuildNode?.(node, l, r, this.tree[node]!);
      return;
    }
    const mid = (l + r) >> 1;
    this.build(node * 2, l, mid, arr);
    this.build(node * 2 + 1, mid + 1, r, arr);
    this.tree[node] = this.merge(this.tree[node * 2]!, this.tree[node * 2 + 1]!);
    this.hooks.onBuildNode?.(node, l, r, this.tree[node]!);
  }

  private merge(a: number[], b: number[]): number[] {
    const out: number[] = [];
    let i = 0;
    let j = 0;
    while (i < a.length && j < b.length) {
      if (a[i]! <= b[j]!) {
        out.push(a[i]!);
        i++;
      } else {
        out.push(b[j]!);
        j++;
      }
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

  private countLEInSorted(sorted: number[], k: number): number {
    // 二分找 > k 的第一个位置
    let lo = 0;
    let hi = sorted.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (sorted[mid]! <= k) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }

  private queryRec(node: number, l: number, r: number, ql: number, qr: number, k: number): number {
    if (ql > r || qr < l) return 0;
    if (ql <= l && r <= qr) return this.countLEInSorted(this.tree[node]!, k);
    const mid = (l + r) >> 1;
    return (
      this.queryRec(node * 2, l, mid, ql, qr, k) +
      this.queryRec(node * 2 + 1, mid + 1, r, ql, qr, k)
    );
  }

  /** 区间 [ql..qr] (0-indexed) 内 ≤ k 的元素个数 */
  countLE(ql: number, qr: number, k: number): number {
    const c = this.queryRec(1, 0, this.n - 1, ql, qr, k);
    this.hooks.onQuery?.(ql, qr, k, c);
    return c;
  }

  /** 区间内严格小于 k 的个数 */
  countLT(ql: number, qr: number, k: number): number {
    return this.countLE(ql, qr, k - 1);
  }
}
