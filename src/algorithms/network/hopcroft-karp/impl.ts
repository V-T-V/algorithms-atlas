// =============================================================================
// Hopcroft-Karp 二分图最大匹配 · 纯算法实现
// 每轮 BFS 分层 + DFS 并行增广。零 DOM 依赖，可独立单测。
// 左侧节点 0..nLeft-1，右侧节点 0..nRight-1。
// =============================================================================

/** 边：[leftIndex, rightIndex]。 */
export type BipartiteEdge = [number, number];

/** 事件钩子。 */
export interface HopcroftKarpHooks {
  /** 一次 BFS 分层完成；给出本轮最短增广路长度（Infinity 表示无路）。 */
  onLayer?: (shortestDist: number) => void;
  /** 找到一条增广路（左侧起点、右侧终点序列翻转后给出）。 */
  onAugment?: (leftStart: number, rightEnd: number, round: number) => void;
  /** 一轮 DFS 增广结束，给出本轮新增匹配数。 */
  onRound?: (round: number, newMatches: number, totalMatches: number) => void;
  /** 算法结束。 */
  onDone?: (totalMatches: number) => void;
}

const INF = 1 << 30;

/**
 * Hopcroft-Karp 二分图最大匹配。
 *
 * @param nLeft 左侧节点数
 * @param nRight 右侧节点数
 * @param edges 边 [left, right]
 * @param hooks 可选钩子
 * @returns 最大匹配数
 */
export function hopcroftKarp(
  nLeft: number,
  nRight: number,
  edges: readonly BipartiteEdge[],
  hooks: HopcroftKarpHooks = {},
): number {
  if (nLeft === 0 || nRight === 0) {
    hooks.onDone?.(0);
    return 0;
  }

  // 左侧邻接表（left → list of right）
  const adj: number[][] = Array.from({ length: nLeft }, () => []);
  for (const [l, r] of edges) {
    if (l >= 0 && l < nLeft && r >= 0 && r < nRight) adj[l]!.push(r);
  }

  // pairU[l] = 匹配的右侧点（-1 表示未匹配）；pairV[r] = 匹配的左侧点
  const pairU = new Array<number>(nLeft).fill(-1);
  const pairV = new Array<number>(nRight).fill(-1);
  const dist = new Array<number>(nLeft).fill(INF);

  // BFS：从所有未匹配左侧点出发，计算 dist[]
  // 返回是否还能到达某个未匹配右侧点（即存在增广路）
  const bfs = (): boolean => {
    const queue: number[] = [];
    for (let l = 0; l < nLeft; l++) {
      if (pairU[l] === -1) {
        dist[l] = 0;
        queue.push(l);
      } else {
        dist[l] = INF;
      }
    }
    let found = false;
    let head = 0;
    while (head < queue.length) {
      const l = queue[head]!;
      head++;
      for (const r of adj[l]!) {
        const nextL = pairV[r]!;
        if (nextL !== -1 && dist[nextL] === INF) {
          dist[nextL] = dist[l]! + 1;
          queue.push(nextL);
        } else if (nextL === -1) {
          // 到达未匹配右侧点 → 存在增广路
          found = true;
        }
      }
    }
    return found;
  };

  // DFS：从 l 出发，沿分层网络找增广路
  const dfs = (l: number, round: number): boolean => {
    for (const r of adj[l]!) {
      const nextL = pairV[r]!;
      if (nextL === -1 || (dist[nextL]! === dist[l]! + 1 && dfs(nextL, round))) {
        pairU[l] = r;
        pairV[r] = l;
        hooks.onAugment?.(l, r, round);
        return true;
      }
    }
    dist[l] = INF;
    return false;
  };

  let matching = 0;
  let round = 0;

  while (bfs()) {
    round++;
    const shortest = Math.min(...dist.filter((d) => d !== INF));
    hooks.onLayer?.(shortest);
    let newMatches = 0;
    for (let l = 0; l < nLeft; l++) {
      if (pairU[l] === -1 && dfs(l, round)) {
        newMatches++;
      }
    }
    matching += newMatches;
    hooks.onRound?.(round, newMatches, matching);
  }

  hooks.onDone?.(matching);
  return matching;
}
