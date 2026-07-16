// =============================================================================
// Kruskal 最小生成树 · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 思路：所有边按权升序，逐条尝试加入；用并查集判环，成环则丢弃。
// =============================================================================

/** 加权图输入（与 dijkstra/bfs 保持一致；MST 忽略 directed，按无向处理）。 */
export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string; weight: number }>;
  directed?: boolean;
}

/** Kruskal 执行过程中的事件钩子。任一可选。 */
export interface KruskalHooks {
  /** 检查一条边：accepted 表示是否纳入 MST（成环则 false）。 */
  onExamine?: (from: string, to: string, weight: number, accepted: boolean) => void;
  /** 一条边被纳入 MST。 */
  onTreeEdge?: (from: string, to: string, weight: number) => void;
  /** 算法完成：MST 总权与边数。 */
  onDone?: (totalWeight: number, edgeCount: number) => void;
}

/** 最小生成树结果。 */
export interface MstResult {
  /** MST 中的边（from,to,weight）。 */
  edges: Array<{ from: string; to: string; weight: number }>;
  /** 总权重。 */
  totalWeight: number;
  /** 是否连通（MST 边数 = V-1 才连通）。 */
  connected: boolean;
}

/** 并查集（带路径压缩 + 按秩合并），仅内部使用。 */
class DSU {
  private parent = new Map<string, string>();
  private rank = new Map<string, number>();
  constructor(elements: Iterable<string>) {
    for (const e of elements) {
      this.parent.set(e, e);
      this.rank.set(e, 0);
    }
  }
  find(x: string): string {
    let root = x;
    while (this.parent.get(root) !== root) root = this.parent.get(root)!;
    // 路径压缩
    let cur = x;
    while (this.parent.get(cur) !== root) {
      const next = this.parent.get(cur)!;
      this.parent.set(cur, root);
      cur = next;
    }
    return root;
  }
  union(a: string, b: string): boolean {
    const ra = this.find(a);
    const rb = this.find(b);
    if (ra === rb) return false;
    const raRank = this.rank.get(ra)!;
    const rbRank = this.rank.get(rb)!;
    if (raRank < rbRank) this.parent.set(ra, rb);
    else if (raRank > rbRank) this.parent.set(rb, ra);
    else {
      this.parent.set(rb, ra);
      this.rank.set(ra, raRank + 1);
    }
    return true;
  }
}

/**
 * Kruskal 最小生成树。
 *
 * @param input 加权图（按无向处理）
 * @param hooks 可选事件钩子
 * @returns MST 边集、总权重、连通性
 */
export function kruskal(input: GraphInput, hooks: KruskalHooks = {}): MstResult {
  const { nodes, edges } = input;
  const dsu = new DSU(nodes);

  // 边按权重升序；同权按 (from,to) 字典序，保证确定顺序
  const sorted = [...edges]
    .map((e) => ({ from: e.from, to: e.to, weight: e.weight }))
    .sort((a, b) =>
      a.weight !== b.weight
        ? a.weight - b.weight
        : a.from < b.from
          ? -1
          : a.from > b.from
            ? 1
            : a.to < b.to
              ? -1
              : a.to > b.to
                ? 1
                : 0,
    );

  const mstEdges: Array<{ from: string; to: string; weight: number }> = [];
  let totalWeight = 0;

  for (const e of sorted) {
    const accepted = dsu.union(e.from, e.to);
    hooks.onExamine?.(e.from, e.to, e.weight, accepted);
    if (accepted) {
      mstEdges.push(e);
      totalWeight += e.weight;
      hooks.onTreeEdge?.(e.from, e.to, e.weight);
      // MST 已有 V-1 条边即可提前结束
      if (mstEdges.length === nodes.length - 1) break;
    }
  }

  const connected = mstEdges.length === nodes.length - 1;
  hooks.onDone?.(totalWeight, mstEdges.length);
  return { edges: mstEdges, totalWeight, connected };
}
