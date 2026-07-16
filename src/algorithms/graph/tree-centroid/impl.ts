// =============================================================================
// 树的重心（Tree Centroid）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 重心：删除该点后各连通块大小均不超过 ⌊n/2⌋ 的节点；一棵树有 1 或 2 个重心。
// =============================================================================

/** 树输入（无向边构成一棵树）。 */
export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
}

/** 执行过程中的事件钩子。任一可选。 */
export interface TreeCentroidHooks {
  /** 后序访问 u，得到以 u 为根的子树大小 size、最大剩余连通块 maxPart。 */
  onVisit?: (u: string, size: number, maxPart: number, parent: string | null) => void;
  /** 发现一个候选重心（maxPart <= ⌊n/2⌋）。 */
  onCandidate?: (u: string, maxPart: number) => void;
  /** 确定重心集合。 */
  onCentroids?: (centroids: string[]) => void;
}

export interface TreeCentroidResult {
  /** 重心列表（1 或 2 个）。 */
  centroids: string[];
  /** 每节点作为根时的子树大小。 */
  size: Map<string, number>;
  /** 每节点删除后的最大剩余连通块。 */
  maxPart: Map<string, number>;
}

/**
 * 求树的所有重心。
 *
 * @param input 树
 * @param hooks 可选事件钩子
 * @returns 重心列表 + 每节点 size/maxPart
 */
export function treeCentroid(input: GraphInput, hooks: TreeCentroidHooks = {}): TreeCentroidResult {
  const { nodes, edges } = input;
  const size = new Map<string, number>();
  const maxPart = new Map<string, number>();
  const centroids: string[] = [];
  if (nodes.length === 0) return { centroids, size, maxPart };

  const adj = new Map<string, string[]>();
  for (const n of nodes) adj.set(n, []);
  for (const e of edges) {
    adj.get(e.from)?.push(e.to);
    adj.get(e.to)?.push(e.from);
  }

  const root = nodes[0]!;
  const n = nodes.length;
  const limit = Math.floor(n / 2);

  const dfs = (u: string, parent: string | null): number => {
    let sz = 1;
    let mp = 0;
    for (const v of adj.get(u) ?? []) {
      if (v === parent) continue;
      const cs = dfs(v, u);
      sz += cs;
      if (cs > mp) mp = cs;
    }
    const upPart = n - sz;
    if (upPart > mp) mp = upPart;
    size.set(u, sz);
    maxPart.set(u, mp);
    hooks.onVisit?.(u, sz, mp, parent);
    if (mp <= limit) {
      centroids.push(u);
      hooks.onCandidate?.(u, mp);
    }
    return sz;
  };

  dfs(root, null);
  centroids.sort();
  hooks.onCentroids?.(centroids);

  return { centroids, size, maxPart };
}
