// =============================================================================
// vEB树 van Emde Boas · 纯算法实现（零 DOM 依赖，可独立单测）
// 实现：整数集合上的优先队列结构，全集 {0..U-1}，U = 2^k。
//   - 递归分簇：把 U 分成 √U 个大小 √U 的簇（cluster）
//   - summary 记录哪些簇非空
//   - insert / delete / successor / predecessor 均 O(log log U)
// 注：本实现 U 须为 2 的幂；用递归簇数组。
// =============================================================================

/** 操作过程中的事件钩子。任一可选。 */
export interface VEBHooks {
  /** 建树完成，全域大小 universe。 */
  onBuild?: (universe: number) => void;
  /** 插入：进入簇 c 的递归操作。 */
  onInsertCluster?: (cluster: number, value: number) => void;
  /** 更新 summary（簇 c 变为非空）。 */
  onSummaryUpdate?: (cluster: number) => void;
  /** 删除：从簇 c 移除。 */
  onDeleteCluster?: (cluster: number, value: number) => void;
  /** 后继查询：在簇 c 中查找，返回结果（-1 表示无）。 */
  onSuccessorStep?: (cluster: number, result: number) => void;
  /** 前驱查询：在簇 c 中查找。 */
  onPredecessorStep?: (cluster: number, result: number) => void;
  /** 操作完成。 */
  onResult?: (
    kind: 'insert' | 'delete' | 'successor' | 'predecessor' | 'member',
    value: number,
  ) => void;
}

/**
 * van Emde Boas 树节点（递归结构）。
 */
export class VEBNode {
  readonly universe: number; // 全域大小 U
  readonly sqrt: number; // ⌈√U⌉（上取整，作簇数）
  min: number = -1; // 当前子树最小值；-1 表示空（min 不存入 cluster）
  max: number = -1; // 当前子树最大值
  summary: VEBNode | null = null; // 仅当 universe > 2
  cluster: VEBNode[] = []; // √U 个子簇

  constructor(universe: number) {
    this.universe = universe;
    // 高位 / 低位分割：sqrt = 2^⌈k/2⌉
    const k = Math.log2(universe);
    const hi = Math.ceil(k / 2);
    this.sqrt = 1 << hi; // 簇数 = 子簇大小（均为 2^hi 或 2^lo 的近似）
    if (universe > 2) {
      const clusterSize = this.sqrt; // 子簇的 universe
      this.summary = new VEBNode(this.sqrt);
      this.cluster = Array.from({ length: this.sqrt }, () => new VEBNode(clusterSize));
    }
  }

  /** 簇编号 = x 的高位。 */
  high(x: number): number {
    return Math.floor(x / this.sqrt);
  }
  /** 簇内偏移 = x 的低位。 */
  low(x: number): number {
    return x % this.sqrt;
  }
  /** 由簇号 + 偏移还原 x。 */
  index(h: number, l: number): number {
    return h * this.sqrt + l;
  }
}

/**
 * van Emde Boas 树：支持 O(log log U) 的整数集合操作。
 */
export class VanEmdeBoas {
  readonly root: VEBNode;

  constructor(universe: number, hooks: VEBHooks = {}) {
    if (!Number.isInteger(Math.log2(universe)) || universe < 2) {
      throw new Error(`universe must be a power of 2 >= 2, got ${universe}`);
    }
    this.root = new VEBNode(universe);
    hooks.onBuild?.(universe);
  }

  /** 是否包含 x。 */
  member(x: number): boolean {
    const find = (node: VEBNode, v: number): boolean => {
      if (v === node.min || v === node.max) return true;
      if (node.universe === 2 || node.min === -1) return false;
      const c = node.cluster[Math.floor(v / node.sqrt)]!;
      return find(c, v % node.sqrt);
    };
    return find(this.root, x);
  }

  /** 最小值（-1 表示空）。 */
  min(): number {
    return this.root.min;
  }
  /** 最大值（-1 表示空）。 */
  max(): number {
    return this.root.max;
  }

  /** 插入 x。 */
  insert(x: number, hooks: VEBHooks = {}): void {
    this.insertRec(this.root, x, hooks);
    hooks.onResult?.('insert', x);
  }

  private insertRec(node: VEBNode, x: number, hooks: VEBHooks): void {
    if (node.min === -1) {
      // 空树：直接放 min=max
      node.min = x;
      node.max = x;
      return;
    }
    if (x < node.min) {
      // 交换：把更小的作为 min，原 min 下放
      const t = node.min;
      node.min = x;
      x = t;
    }
    if (node.universe > 2) {
      const c = node.high(x);
      const lo = node.low(x);
      const cluster = node.cluster[c]!;
      if (cluster.min === -1) {
        // 簇空：更新 summary
        this.insertRec(node.summary!, c, hooks);
        hooks.onSummaryUpdate?.(c);
        cluster.min = lo;
        cluster.max = lo;
      } else {
        this.insertRec(cluster, lo, hooks);
      }
      hooks.onInsertCluster?.(c, lo);
    }
    if (x > node.max) node.max = x;
  }

  /** 删除 x。 */
  delete(x: number, hooks: VEBHooks = {}): void {
    this.deleteRec(this.root, x, hooks);
    hooks.onResult?.('delete', x);
  }

  private deleteRec(node: VEBNode, x: number, hooks: VEBHooks): void {
    if (node.min === node.max) {
      // 只有一个元素
      if (node.min === x) {
        node.min = -1;
        node.max = -1;
      }
      return;
    }
    if (node.universe === 2) {
      // 基例：U=2
      if (x === 0) node.min = 1;
      else node.min = 0;
      node.max = node.min;
      return;
    }
    if (x === node.min) {
      // 找第一个非空簇的最小值替代 min
      const firstCluster = node.summary!.min;
      const cluster = node.cluster[firstCluster]!;
      x = firstCluster * node.sqrt + cluster.min;
      node.min = x;
    }
    const c = node.high(x);
    const lo = node.low(x);
    const cluster = node.cluster[c]!;
    this.deleteRec(cluster, lo, hooks);
    hooks.onDeleteCluster?.(c, lo);
    if (cluster.min === -1) {
      // 簇变空：从 summary 删除
      this.deleteRec(node.summary!, c, hooks);
      if (x === node.max) {
        const summaryMax = node.summary!.max;
        if (summaryMax === -1) {
          node.max = node.min;
        } else {
          node.max = summaryMax * node.sqrt + node.cluster[summaryMax]!.max;
        }
      }
    } else if (x === node.max) {
      node.max = c * node.sqrt + cluster.max;
    }
  }

  /** 后继：严格大于 x 的最小元素（-1 表示无）。 */
  successor(x: number, hooks: VEBHooks = {}): number {
    const r = this.successorRec(this.root, x, hooks);
    hooks.onResult?.('successor', r);
    return r;
  }

  private successorRec(node: VEBNode, x: number, hooks: VEBHooks): number {
    if (node.universe === 2) {
      if (x === 0 && node.max === 1) return 1;
      return -1;
    }
    if (node.min !== -1 && x < node.min) return node.min;
    const c = node.high(x);
    const lo = node.low(x);
    const cluster = node.cluster[c]!;
    const maxLow = cluster.max;
    if (maxLow !== -1 && lo < maxLow) {
      // 后继在同簇
      const offset = this.successorRec(cluster, lo, hooks);
      hooks.onSuccessorStep?.(c, offset);
      return node.index(c, offset);
    }
    // 后继在下一个非空簇
    const succCluster = this.successorRec(node.summary!, c, hooks);
    if (succCluster === -1) return -1;
    hooks.onSuccessorStep?.(succCluster, node.cluster[succCluster]!.min);
    return node.index(succCluster, node.cluster[succCluster]!.min);
  }

  /** 前驱：严格小于 x 的最大元素（-1 表示无）。 */
  predecessor(x: number, hooks: VEBHooks = {}): number {
    const r = this.predecessorRec(this.root, x, hooks);
    hooks.onResult?.('predecessor', r);
    return r;
  }

  private predecessorRec(node: VEBNode, x: number, hooks: VEBHooks): number {
    if (node.universe === 2) {
      if (x === 1 && node.min === 0) return 0;
      return -1;
    }
    if (node.max !== -1 && x > node.max) return node.max;
    const c = node.high(x);
    const lo = node.low(x);
    const cluster = node.cluster[c]!;
    const minLow = cluster.min;
    if (minLow !== -1 && lo > minLow) {
      const offset = this.predecessorRec(cluster, lo, hooks);
      hooks.onPredecessorStep?.(c, offset);
      return node.index(c, offset);
    }
    const predCluster = this.predecessorRec(node.summary!, c, hooks);
    if (predCluster === -1) {
      // 特殊：min 比 c 簇的最小还小
      if (node.min !== -1 && x > node.min) return node.min;
      return -1;
    }
    hooks.onPredecessorStep?.(predCluster, node.cluster[predCluster]!.max);
    return node.index(predCluster, node.cluster[predCluster]!.max);
  }
}

/**
 * 便利函数：建树并执行一串操作，返回最终集合元素（升序）。
 * ops: [{op:'insert'|'delete', v}]
 */
export function vanEmdeBoas(
  input: { universe: number; ops: Array<{ op: 'insert' | 'delete'; v: number }> },
  hooks: VEBHooks = {},
): number[] {
  const t = new VanEmdeBoas(input.universe, hooks);
  for (const o of input.ops) {
    if (o.op === 'insert') t.insert(o.v, hooks);
    else t.delete(o.v, hooks);
  }
  // 用 successor 遍历收集
  const out: number[] = [];
  let cur = t.min();
  while (cur !== -1) {
    out.push(cur);
    cur = t.successor(cur);
  }
  return out;
}
