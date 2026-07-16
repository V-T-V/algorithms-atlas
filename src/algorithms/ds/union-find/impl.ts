// =============================================================================
// 并查集 Union-Find (Disjoint Set Union) · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 实现：路径压缩 + 按秩合并。
// =============================================================================

/** 并查集操作过程中的事件钩子。任一可选。 */
export interface UnionFindHooks {
  /** find 过程中访问到某节点；root 为最终找到的根。 */
  onFind?: (node: string, root: string) => void;
  /** 发生一次合并：a、b 的根分别 ra、rb，合并后新根为 newRoot。merged=false 表示本就同根。 */
  onUnion?: (
    a: string,
    b: string,
    ra: string,
    rb: string,
    newRoot: string,
    merged: boolean,
  ) => void;
}

/**
 * 并查集（不相交集合）。
 * 元素以字符串标识。支持 find（带路径压缩）与 union（按秩合并）。
 */
export class UnionFind {
  private parent = new Map<string, string>();
  private rank = new Map<string, number>();

  constructor(elements: Iterable<string> = []) {
    for (const e of elements) this.make(e);
  }

  /** 新增一个独立元素（若已存在则忽略）。 */
  make(x: string): void {
    if (!this.parent.has(x)) {
      this.parent.set(x, x);
      this.rank.set(x, 0);
    }
  }

  /** 是否包含某元素。 */
  has(x: string): boolean {
    return this.parent.has(x);
  }

  /** 查询 x 的根（带路径压缩）。 */
  find(x: string, hooks?: UnionFindHooks): string {
    // 迭代式路径压缩：先找到根，再把路径上节点直接挂到根
    let root = x;
    const path: string[] = [];
    while (true) {
      const p = this.parent.get(root);
      if (p === undefined) break; // 不存在
      if (p === root) break;
      path.push(root);
      root = p;
    }
    for (const n of path) {
      this.parent.set(n, root);
      hooks?.onFind?.(n, root);
    }
    hooks?.onFind?.(root, root);
    return root;
  }

  /** 合并 x、y 所在集合（按秩）。返回是否真正发生合并。 */
  union(x: string, y: string, hooks?: UnionFindHooks): boolean {
    if (!this.has(x)) this.make(x);
    if (!this.has(y)) this.make(y);
    const rx = this.find(x, hooks);
    const ry = this.find(y, hooks);
    if (rx === ry) {
      hooks?.onUnion?.(x, y, rx, ry, rx, false);
      return false;
    }
    // 按秩：矮树挂到高树下
    const rankX = this.rank.get(rx) ?? 0;
    const rankY = this.rank.get(ry) ?? 0;
    let newRoot: string;
    if (rankX < rankY) {
      this.parent.set(rx, ry);
      newRoot = ry;
    } else if (rankX > rankY) {
      this.parent.set(ry, rx);
      newRoot = rx;
    } else {
      this.parent.set(ry, rx);
      this.rank.set(rx, rankX + 1);
      newRoot = rx;
    }
    hooks?.onUnion?.(x, y, rx, ry, newRoot, true);
    return true;
  }

  /** x、y 是否同一集合。 */
  connected(x: string, y: string, hooks?: UnionFindHooks): boolean {
    if (!this.has(x) || !this.has(y)) return false;
    return this.find(x, hooks) === this.find(y, hooks);
  }

  /** 当前每个元素的直接根（用于快照渲染）。 */
  snapshot(): Map<string, string> {
    return new Map(this.parent);
  }

  /** 当前不同集合（连通分量）数量。 */
  components(): number {
    let count = 0;
    for (const [node, parent] of this.parent) if (node === parent) count++;
    return count;
  }
}

/** 批量操作输入：便于 trace/测试驱动。 */
export interface UnionFindOps {
  /** 初始元素。 */
  elements: readonly string[];
  /** 依次执行的合并对。 */
  unions: ReadonlyArray<[string, string]>;
}

/**
 * 便利函数：按 ops 构建并查集并执行合并序列，返回最终结构。
 * 每步通过 hooks 暴露。
 */
export function unionFind(ops: UnionFindOps, hooks: UnionFindHooks = {}): UnionFind {
  const uf = new UnionFind(ops.elements);
  for (const [a, b] of ops.unions) uf.union(a, b, hooks);
  return uf;
}
