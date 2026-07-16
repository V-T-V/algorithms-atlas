// =============================================================================
// 按秩合并并查集 UnionFindRank · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 实现：基于数组的并查集，**只做按秩合并，不做路径压缩**。
//   - 与 ds/union-find 的差异：本版本强调「秩（rank）」语义——
//     rank 是树高的上界（不压缩路径时即为真实高度），用于可视化与教学。
//   - find 沿父链上溯（保留树形，便于展示）；union 把矮树挂到高树下，
//     仅当两树等高时新根 rank+1。
//   - 不带路径压缩 → find/union 最坏 O(log n)（树高被 rank 约束在 O(log n)）。
// =============================================================================

/** 按秩并查集操作过程中的事件钩子。任一可选。 */
export interface UFRankHooks {
  /** find：访问节点 x（沿父链），root 为最终根。 */
  onFind?: (x: number, root: number) => void;
  /** union：a、b 的根 ra、rb；merged 表示是否真正合并；newRoot 为新根；newRank 为新根秩。 */
  onUnion?: (
    a: number,
    b: number,
    ra: number,
    rb: number,
    newRoot: number,
    newRank: number,
    merged: boolean,
  ) => void;
}

/**
 * 按秩合并并查集（无路径压缩，强调秩语义）。
 * 元素为 0..n-1 的整数。parent[i] 为父，根的 parent = 自身；rank[i] 为子树高度上界。
 */
export class UnionFindRank {
  /** 父指针数组。 */
  readonly parent: number[];
  /** 秩数组。 */
  readonly rank: number[];
  /** 元素总数。 */
  readonly n: number;

  constructor(size: number) {
    this.n = size;
    this.parent = Array.from({ length: size }, (_, i) => i);
    this.rank = new Array<number>(size).fill(0);
  }

  /** find：沿父链上溯到根（不压缩）。 */
  find(x: number, hooks: UFRankHooks = {}): number {
    let root = x;
    while (this.parent[root] !== root) {
      hooks.onFind?.(root, -1); // 中间节点，root 暂未知
      root = this.parent[root]!;
    }
    hooks.onFind?.(root, root);
    return root;
  }

  /** union：按秩合并。返回是否真正合并。 */
  union(a: number, b: number, hooks: UFRankHooks = {}): boolean {
    const ra = this.find(a, hooks);
    const rb = this.find(b, hooks);
    if (ra === rb) {
      hooks.onUnion?.(a, b, ra, rb, ra, this.rank[ra]!, false);
      return false;
    }
    // 按秩：矮树挂到高树下
    let newRoot: number;
    let newRank: number;
    if (this.rank[ra]! < this.rank[rb]!) {
      this.parent[ra] = rb;
      newRoot = rb;
      newRank = this.rank[rb]!;
    } else if (this.rank[ra]! > this.rank[rb]!) {
      this.parent[rb] = ra;
      newRoot = ra;
      newRank = this.rank[ra]!;
    } else {
      // 等高：挂到 ra，ra.rank+1
      this.parent[rb] = ra;
      this.rank[ra] = this.rank[ra]! + 1;
      newRoot = ra;
      newRank = this.rank[ra]!;
    }
    hooks.onUnion?.(a, b, ra, rb, newRoot, newRank, true);
    return true;
  }

  /** a、b 是否同根。 */
  connected(a: number, b: number, hooks: UFRankHooks = {}): boolean {
    return this.find(a, hooks) === this.find(b, hooks);
  }

  /** 当前连通分量数。 */
  components(): number {
    let count = 0;
    for (let i = 0; i < this.n; i++) if (this.parent[i] === i) count++;
    return count;
  }

  /** 各元素的根（快照，用于渲染）。 */
  roots(): number[] {
    const out: number[] = [];
    for (let i = 0; i < this.n; i++) out.push(this.find(i));
    return out;
  }

  /** 某元素的秩（仅根的秩有意义）。 */
  rankOf(x: number): number {
    return this.rank[x]!;
  }
}

/** 操作序列。 */
export interface UFRankOps {
  /** 元素个数（元素为 0..n-1）。 */
  size: number;
  /** 依次执行的合并对。 */
  unions: ReadonlyArray<[number, number]>;
}

/**
 * 便利函数：按 ops 构建 + 执行合并，返回最终结构。
 * 每步通过 hooks 暴露。
 */
export function unionFindRank(ops: UFRankOps, hooks: UFRankHooks = {}): UnionFindRank {
  const uf = new UnionFindRank(ops.size);
  for (const [a, b] of ops.unions) uf.union(a, b, hooks);
  return uf;
}
