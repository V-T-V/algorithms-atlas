// =============================================================================
// Prim 最小生成树 · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 思路：从任一节点起，维护「树外节点连到树的最小边」key[]，每轮取 key 最小者纳入。
// =============================================================================

/** 加权图输入（与 dijkstra/bfs 保持一致；MST 忽略 directed，按无向处理）。 */
export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string; weight: number }>;
  directed?: boolean;
}

/** Prim 执行过程中的事件钩子。任一可选。 */
export interface PrimHooks {
  /** 算法开始，从 start 起步。 */
  onInit?: (start: string) => void;
  /** 选定一个 key 最小的树外节点纳入 MST；parent 为其树内连接点。 */
  onAddNode?: (node: string, parent: string, weight: number) => void;
  /** 更新某树外节点到树的最小边（候选 cut edge）；improved 表示是否变小。 */
  onUpdateKey?: (node: string, candidateParent: string, newKey: number, improved: boolean) => void;
  /** 算法完成：MST 总权与边数。 */
  onDone?: (totalWeight: number, edgeCount: number) => void;
}

/** 最小生成树结果。 */
export interface MstResult {
  /** MST 中的边（from 在树内、to 为新纳入点）。 */
  edges: Array<{ from: string; to: string; weight: number }>;
  /** 总权重。 */
  totalWeight: number;
  /** 是否连通（MST 边数 = V-1 才连通）。 */
  connected: boolean;
}

/** 从未纳入节点中选 key 最小者（线性扫描，确定顺序）。 */
function pickMinKey(unvisited: Set<string>, key: Map<string, number>): string | null {
  let best: string | null = null;
  let bestK = Infinity;
  for (const id of unvisited) {
    const k = key.get(id) ?? Infinity;
    if (k < bestK) {
      bestK = k;
      best = id;
    }
  }
  return best;
}

/**
 * Prim 最小生成树。
 *
 * @param input 加权图（按无向处理）
 * @param start 起始节点（可选；缺省取 nodes[0]）
 * @param hooks 可选事件钩子
 * @returns MST 边集、总权重、连通性
 */
export function prim(input: GraphInput, start?: string, hooks: PrimHooks = {}): MstResult {
  const { nodes, edges } = input;
  if (nodes.length === 0) return { edges: [], totalWeight: 0, connected: true };
  const src = start ?? nodes[0]!;

  const adjW = new Map<string, Array<{ to: string; w: number }>>();
  for (const n of nodes) adjW.set(n, []);
  for (const e of edges) {
    adjW.get(e.from)?.push({ to: e.to, w: e.weight });
    adjW.get(e.to)?.push({ to: e.from, w: e.weight }); // 无向
  }
  for (const list of adjW.values()) list.sort((a, b) => (a.to < b.to ? -1 : a.to > b.to ? 1 : 0));

  const key = new Map<string, number>(nodes.map((n) => [n, Infinity]));
  const parent = new Map<string, string | null>(nodes.map((n) => [n, null]));
  const unvisited = new Set<string>(nodes);
  const mstEdges: Array<{ from: string; to: string; weight: number }> = [];
  let totalWeight = 0;

  if (!key.has(src)) return { edges: [], totalWeight: 0, connected: false };
  key.set(src, 0);
  hooks.onInit?.(src);

  while (unvisited.size > 0) {
    const u = pickMinKey(unvisited, key);
    if (u === null) break;
    const ku = key.get(u) ?? Infinity;
    unvisited.delete(u);
    const p = parent.get(u) ?? null;
    if (p !== null) {
      mstEdges.push({ from: p, to: u, weight: ku });
      totalWeight += ku;
      hooks.onAddNode?.(u, p, ku);
    } else {
      // 起点：直接纳入，无 cut edge
      hooks.onAddNode?.(u, u, 0);
    }

    for (const { to: v, w } of adjW.get(u) ?? []) {
      if (!unvisited.has(v)) continue;
      const improved = w < (key.get(v) ?? Infinity);
      if (improved) {
        key.set(v, w);
        parent.set(v, u);
      }
      hooks.onUpdateKey?.(v, u, w, improved);
    }
  }

  const connected = mstEdges.length === nodes.length - 1;
  hooks.onDone?.(totalWeight, mstEdges.length);
  return { edges: mstEdges, totalWeight, connected };
}
