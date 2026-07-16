// =============================================================================
// 树直径（双 BFS）· 纯算法实现
// 输入为邻接表（无权无根树）。零 DOM 依赖，可独立单测。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface DiameterBfsHooks {
  /** 第一轮 BFS 完成，最远点为 u，距离 du。 */
  onFarthest1?: (u: number, du: number) => void;
  /** 第二轮 BFS 完成，最远点为 v，距离 dv（即直径）。 */
  onFarthest2?: (v: number, dv: number) => void;
  /** BFS 访问一个节点，给出它的距离。 */
  onVisit?: (node: number, dist: number, phase: 1 | 2) => void;
  /** 完成。 */
  onDone?: (diameter: number, path: number[]) => void;
}

/** 从 start 做 BFS，返回每个节点的距离与父节点（用于回溯路径）。 */
function bfs(
  adj: number[][],
  start: number,
  phase: 1 | 2,
  hooks?: DiameterBfsHooks['onVisit'],
): { dist: number[]; parent: number[]; farthest: number } {
  const n = adj.length;
  const dist = new Array<number>(n).fill(-1);
  const parent = new Array<number>(n).fill(-1);
  const queue: number[] = [start];
  dist[start] = 0;
  let farthest = start;
  let head = 0;
  while (head < queue.length) {
    const u = queue[head]!;
    head++;
    hooks?.(u, dist[u]!, phase);
    for (const w of adj[u]!) {
      if (dist[w] === -1) {
        dist[w] = dist[u]! + 1;
        parent[w] = u;
        queue.push(w);
        if (dist[w]! > dist[farthest]!) farthest = w;
      }
    }
  }
  return { dist, parent, farthest };
}

/** 由 parent 数组回溯从 start 到 end 的路径。 */
function pathFromParent(parent: number[], end: number): number[] {
  const path: number[] = [];
  let cur: number = end;
  while (cur !== -1) {
    path.push(cur);
    cur = parent[cur]!;
  }
  path.reverse();
  return path;
}

/**
 * 树直径（双 BFS）。
 *
 * @param adj 邻接表（节点 0..n−1）
 * @param hooks 可选的事件钩子
 * @returns 直径长度与直径路径
 */
export function treeDiameterBfs(
  adj: number[][],
  hooks: DiameterBfsHooks = {},
): { diameter: number; path: number[] } {
  const n = adj.length;
  if (n === 0) {
    hooks.onDone?.(0, []);
    return { diameter: 0, path: [] };
  }
  // 第一轮：从 0 出发找 u
  const r1 = bfs(adj, 0, 1, hooks.onVisit);
  const u = r1.farthest;
  hooks.onFarthest1?.(u, r1.dist[u]!);

  // 第二轮：从 u 出发找 v
  const r2 = bfs(adj, u, 2, hooks.onVisit);
  const v = r2.farthest;
  const diameter = r2.dist[v]!;
  hooks.onFarthest2?.(v, diameter);

  const path = pathFromParent(r2.parent, v);
  hooks.onDone?.(diameter, path);
  return { diameter, path };
}
