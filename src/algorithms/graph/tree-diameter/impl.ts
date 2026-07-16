// =============================================================================
// 树的直径（Tree Diameter）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 两次 BFS/DFS：任取起点 s，找到距 s 最远的 u；再从 u 出发找到最远的 v，
// dist(u, v) 即为直径。无权图上正确。
// =============================================================================

/** 树输入（无向边构成一棵树，边权默认 1；可选 weight）。 */
export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string; weight?: number }>;
}

/** 执行过程中的事件钩子。任一可选。 */
export interface TreeDiameterHooks {
  /** 从 start 出发做一次遍历。 */
  onBfsStart?: (start: string) => void;
  /** 访问节点 u：距离 dist、来源 from。 */
  onVisit?: (u: string, dist: number, from: string | null) => void;
  /** 一次 BFS 结束，最远节点为 farthest，距离为 dist。 */
  onFarthest?: (farthest: string, dist: number) => void;
  /** 找到直径路径（端到端节点序列）与长度。 */
  onDiameter?: (path: string[], length: number) => void;
}

export interface TreeDiameterResult {
  /** 直径长度（边权和）。 */
  length: number;
  /** 直径路径（从一端到另一端的节点序列）。 */
  path: string[];
  /** 两个端点。 */
  endpoints: [string, string];
}

interface BfsOutcome {
  farthest: string;
  dist: number;
  order: string[];
  parent: Map<string, string | null>;
  distance: Map<string, number>;
}

/**
 * 树的直径：两次 BFS 法。
 *
 * @param input 树
 * @param hooks 可选事件钩子
 * @returns 直径长度、路径、端点
 */
export function treeDiameter(input: GraphInput, hooks: TreeDiameterHooks = {}): TreeDiameterResult {
  const { nodes, edges } = input;
  if (nodes.length === 0) return { length: 0, path: [], endpoints: ['', ''] };
  if (nodes.length === 1) {
    const only = nodes[0]!;
    return { length: 0, path: [only], endpoints: [only, only] };
  }

  const adj = new Map<string, Array<{ to: string; w: number }>>();
  for (const n of nodes) adj.set(n, []);
  for (const e of edges) {
    const w = e.weight ?? 1;
    adj.get(e.from)?.push({ to: e.to, w });
    adj.get(e.to)?.push({ to: e.from, w });
  }

  const bfs = (start: string): BfsOutcome => {
    hooks.onBfsStart?.(start);
    const parent = new Map<string, string | null>([[start, null]]);
    const distance = new Map<string, number>([[start, 0]]);
    const order: string[] = [start];
    const queue: string[] = [start];
    let farthest = start;
    let maxDist = 0;
    while (queue.length > 0) {
      const u = queue.shift()!;
      const du = distance.get(u) ?? 0;
      for (const { to, w } of adj.get(u) ?? []) {
        if (parent.has(to)) continue;
        const nd = du + w;
        parent.set(to, u);
        distance.set(to, nd);
        order.push(to);
        if (nd > maxDist) {
          maxDist = nd;
          farthest = to;
        }
        queue.push(to);
      }
    }
    for (const v of order) hooks.onVisit?.(v, distance.get(v) ?? 0, parent.get(v) ?? null);
    hooks.onFarthest?.(farthest, maxDist);
    return { farthest, dist: maxDist, order, parent, distance };
  };

  const start = nodes[0]!;
  const pass1 = bfs(start);
  const u = pass1.farthest;
  const pass2 = bfs(u);
  const v = pass2.farthest;
  const length = pass2.dist;

  // 重建 u -> v 路径
  const path: string[] = [];
  let cur: string | null = v;
  while (cur !== null) {
    path.push(cur);
    cur = pass2.parent.get(cur) ?? null;
  }
  path.reverse();
  hooks.onDiameter?.(path, length);

  return { length, path, endpoints: [u, v] };
}
