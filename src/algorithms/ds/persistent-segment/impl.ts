// =============================================================================
// 可持久化线段树 Persistent Segment Tree · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 实现：指针版，支持「单点更新」并保留所有历史版本。
//   - 每次单点更新只新建从根到叶的 O(log n) 个节点，其余子树与旧版本共享。
//   - 查询可在任意历史版本上执行，互不影响。
//   - 区间求和：O(log n)；版本切换 O(1)（持有不同根即不同版本）。
//   - 总节点数 O((n + q) log n)，q 为更新次数。
// =============================================================================

/** 持久化线段树节点（不可变语义：更新时新建，旧版本引用不变）。 */
export class PSNode {
  /** 管辖区间和。 */
  sum: number;
  left: PSNode | null = null;
  right: PSNode | null = null;
  constructor(sum = 0) {
    this.sum = sum;
  }
}

/** 持久化线段树操作过程中的事件钩子。任一可选。 */
export interface PSGHooks {
  /** 建树：创建节点（区间 [lo, hi]，sum）。 */
  onBuild?: (lo: number, hi: number, sum: number) => void;
  /** 更新：克隆路径节点（区间 [lo, hi]，新 sum）。 */
  onClone?: (lo: number, hi: number, sum: number) => void;
  /** 查询：访问节点（区间 [lo, hi]，fully 是否完全覆盖）。 */
  onQueryVisit?: (lo: number, hi: number, fully: boolean) => void;
}

/**
 * 可持久化线段树（单点更新 + 区间求和）。
 * versions[0] 为初始版本；每次 update 产生新版本并 push 进 versions。
 */
export class PersistentSegmentTree {
  /** 各版本根节点。versions[k] 为第 k 版。 */
  readonly versions: PSNode[] = [];
  /** 叶子数量（区间长度）。 */
  readonly n: number;

  constructor(values: readonly number[] = [], hooks: PSGHooks = {}) {
    this.n = values.length;
    if (values.length > 0) {
      const root = this.buildTree(values, 0, values.length - 1, hooks);
      this.versions.push(root);
    } else {
      this.versions.push(new PSNode(0));
    }
  }

  /** 递归建树（版本 0）。 */
  private buildTree(values: readonly number[], lo: number, hi: number, hooks: PSGHooks): PSNode {
    if (lo === hi) {
      const node = new PSNode(values[lo]!);
      hooks.onBuild?.(lo, hi, node.sum);
      return node;
    }
    const mid = (lo + hi) >> 1;
    const node = new PSNode();
    node.left = this.buildTree(values, lo, mid, hooks);
    node.right = this.buildTree(values, mid + 1, hi, hooks);
    node.sum = node.left.sum + node.right.sum;
    hooks.onBuild?.(lo, hi, node.sum);
    return node;
  }

  /**
   * 单点更新：基于 baseVersion 版本，把下标 pos 改为 newVal，返回新版本号。
   * 不修改任何旧版本节点。
   */
  update(baseVersion: number, pos: number, newVal: number, hooks: PSGHooks = {}): number {
    if (this.n === 0) {
      this.versions.push(new PSNode(0));
      return this.versions.length - 1;
    }
    const base = this.versions[baseVersion]!;
    const newRoot = this.updateRec(base, 0, this.n - 1, pos, newVal, hooks);
    this.versions.push(newRoot);
    return this.versions.length - 1;
  }

  private updateRec(
    node: PSNode,
    lo: number,
    hi: number,
    pos: number,
    newVal: number,
    hooks: PSGHooks,
  ): PSNode {
    const copy = new PSNode();
    if (lo === hi) {
      copy.sum = newVal;
      hooks.onClone?.(lo, hi, copy.sum);
      return copy;
    }
    const mid = (lo + hi) >> 1;
    if (pos <= mid) {
      copy.left = this.updateRec(node.left!, lo, mid, pos, newVal, hooks);
      copy.right = node.right; // 共享
    } else {
      copy.left = node.left; // 共享
      copy.right = this.updateRec(node.right!, mid + 1, hi, pos, newVal, hooks);
    }
    copy.sum = copy.left!.sum + copy.right!.sum;
    hooks.onClone?.(lo, hi, copy.sum);
    return copy;
  }

  /** 区间求和 [ql, qr] 在指定版本上。 */
  query(version: number, ql: number, qr: number, hooks: PSGHooks = {}): number {
    if (this.n === 0) return 0;
    const root = this.versions[version]!;
    const lo = Math.max(0, ql);
    const hi = Math.min(this.n - 1, qr);
    if (lo > hi) return 0;
    return this.queryRec(root, 0, this.n - 1, lo, hi, hooks);
  }

  private queryRec(
    node: PSNode,
    lo: number,
    hi: number,
    ql: number,
    qr: number,
    hooks: PSGHooks,
  ): number {
    if (ql <= lo && hi <= qr) {
      hooks.onQueryVisit?.(lo, hi, true);
      return node.sum;
    }
    hooks.onQueryVisit?.(lo, hi, false);
    const mid = (lo + hi) >> 1;
    let sum = 0;
    if (ql <= mid) sum += this.queryRec(node.left!, lo, mid, ql, qr, hooks);
    if (qr > mid) sum += this.queryRec(node.right!, mid + 1, hi, ql, qr, hooks);
    return sum;
  }

  /** 还原某版本的原数组（O(n log n)，断言用）。 */
  toArray(version: number): number[] {
    const out: number[] = [];
    for (let i = 0; i < this.n; i++) out.push(this.query(version, i, i));
    return out;
  }

  /** 版本数。 */
  get versionCount(): number {
    return this.versions.length;
  }
}

/**
 * 便利函数：由初值数组构造可持久化线段树，返回实例。
 * 建树过程通过 hooks 暴露。
 */
export function persistentSegment(
  values: readonly number[],
  hooks: PSGHooks = {},
): PersistentSegmentTree {
  return new PersistentSegmentTree(values, hooks);
}
