// =============================================================================
// 可持久化线段树（主席树）：前缀版本 + 区间 k 小值
// =============================================================================

export interface PSNode {
  left: PSNode | null;
  right: PSNode | null;
  sum: number;
}

export interface PersistentSegHooks {
  onInsert?: (version: number, value: number) => void;
  onQuery?: (l: number, r: number, k: number, result: number) => void;
}

function makeNode(sum: number, left: PSNode | null = null, right: PSNode | null = null): PSNode {
  return { sum, left, right };
}

export class PersistentSegmentTree {
  /** 每个“版本”对应根节点（即把前缀 [0..i] 插入后的状态） */
  roots: PSNode[] = [];
  /** 离散化后的值域上界（n 个不同值） */
  valueN: number;
  hooks: PersistentSegHooks;
  /** 已插入的真实值，便于反查离散化值 */
  private sortedValues: number[] = [];

  constructor(allValues: number[], hooks: PersistentSegHooks = {}) {
    this.hooks = hooks;
    // 离散化
    const sorted = [...new Set(allValues)].sort((a, b) => a - b);
    this.sortedValues = sorted;
    this.valueN = sorted.length;
    // 空树根（全 0）
    this.roots.push(this.buildEmpty(0, this.valueN - 1));
  }

  private buildEmpty(l: number, r: number): PSNode {
    if (l === r) return makeNode(0);
    const mid = (l + r) >> 1;
    return makeNode(0, this.buildEmpty(l, mid), this.buildEmpty(mid + 1, r));
  }

  private insertNode(prev: PSNode, l: number, r: number, pos: number): PSNode {
    const node = makeNode(prev.sum + 1);
    if (l === r) return node;
    const mid = (l + r) >> 1;
    if (pos <= mid) {
      node.left = this.insertNode(prev.left!, l, mid, pos);
      node.right = prev.right;
    } else {
      node.left = prev.left;
      node.right = this.insertNode(prev.right!, mid + 1, r, pos);
    }
    return node;
  }

  private rankOf(value: number): number {
    // 二分找离散化索引
    let lo = 0;
    let hi = this.sortedValues.length - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (this.sortedValues[mid]! === value) return mid;
      if (this.sortedValues[mid]! < value) lo = mid + 1;
      else hi = mid - 1;
    }
    return -1;
  }

  /** 插入一个真实值（产生新版本） */
  insert(value: number): void {
    const pos = this.rankOf(value);
    const prevRoot = this.roots[this.roots.length - 1]!;
    const newRoot = this.insertNode(prevRoot, 0, this.valueN - 1, pos);
    this.roots.push(newRoot);
    this.hooks.onInsert?.(this.roots.length - 1, value);
  }

  private queryKth(u: PSNode, v: PSNode, l: number, r: number, k: number): number {
    if (l === r) return l;
    const mid = (l + r) >> 1;
    const leftCount = v.left!.sum - u.left!.sum;
    if (k <= leftCount) return this.queryKth(u.left!, v.left!, l, mid, k);
    return this.queryKth(u.right!, v.right!, mid + 1, r, k - leftCount);
  }

  /** 查询原数组区间 [l..r] (1-indexed) 内第 k 小值（真实值） */
  kthSmallest(l: number, r: number, k: number): number {
    const uRoot = this.roots[l - 1]!;
    const vRoot = this.roots[r]!;
    const idx = this.queryKth(uRoot, vRoot, 0, this.valueN - 1, k);
    const real = this.sortedValues[idx]!;
    this.hooks.onQuery?.(l, r, k, real);
    return real;
  }
}
