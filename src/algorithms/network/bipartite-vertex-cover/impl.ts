// =============================================================================
// 二分图最小点覆盖（König 定理）· 纯算法实现
// 先 Kuhn 求最大匹配，再从未匹配左点出发走交替路，输出最小覆盖。
// 零 DOM 依赖，可独立单测。
// =============================================================================

export interface BvcEdge {
  from: number; // 左点
  to: number; // 右点
}

export interface BvcResult {
  /** 左部覆盖点集。 */
  leftCover: Set<number>;
  /** 右部覆盖点集。 */
  rightCover: Set<number>;
  /** 覆盖大小（= 最大匹配数）。 */
  size: number;
  /** 最大匹配数。 */
  matchingSize: number;
}

export interface BvcHooks {
  /** 最大匹配求出后，匹配大小。 */
  onMatching?: (size: number) => void;
  /** 从未匹配左点 u 出发开始交替路搜索。 */
  onAlternatingStart?: (u: number) => void;
  /** 交替路访问到左点 / 右点。 */
  onAlternatingVisit?: (side: 'left' | 'right', node: number) => void;
  /** 算法结束。 */
  onDone?: (result: BvcResult) => void;
}

/**
 * 二分图最小点覆盖（König 定理）。
 *
 * @param nLeft 左部节点数
 * @param nRight 右部节点数
 * @param edges 边 {from (左), to (右)}
 * @param hooks 可选钩子
 * @returns {leftCover, rightCover, size, matchingSize}
 */
export function bipartiteVertexCover(
  nLeft: number,
  nRight: number,
  edges: readonly BvcEdge[],
  hooks: BvcHooks = {},
): BvcResult {
  // 邻接表（左→右）
  const adj: number[][] = Array.from({ length: nLeft }, () => []);
  for (const e of edges) {
    if (e.from >= 0 && e.from < nLeft && e.to >= 0 && e.to < nRight) {
      adj[e.from]!.push(e.to);
    }
  }

  // 1. Kuhn 求最大匹配
  const matchR = new Array<number>(nRight).fill(-1);
  const matchL = new Array<number>(nLeft).fill(-1);
  const visited: boolean[] = new Array<boolean>(nRight).fill(false);
  const tryKuhn = (u: number): boolean => {
    const nbrs = adj[u]!;
    for (const r of nbrs) {
      if (visited[r]!) continue;
      visited[r] = true;
      const m = matchR[r]!;
      if (m === -1 || tryKuhn(m)) {
        matchR[r] = u;
        matchL[u] = r;
        return true;
      }
    }
    return false;
  };
  let matchingSize = 0;
  for (let u = 0; u < nLeft; u++) {
    visited.fill(false);
    if (tryKuhn(u)) matchingSize++;
  }
  hooks.onMatching?.(matchingSize);

  // 2. 从所有未匹配左点出发走交替路
  const visitedL = new Array<boolean>(nLeft).fill(false);
  const visitedR = new Array<boolean>(nRight).fill(false);
  // 交替路 DFS：当前在左点 u，沿未匹配边到右，再沿匹配边回左
  const dfs = (u: number): void => {
    visitedL[u] = true;
    hooks.onAlternatingVisit?.('left', u);
    const nbrs = adj[u]!;
    for (const r of nbrs) {
      if (visitedR[r]!) continue;
      visitedR[r] = true;
      hooks.onAlternatingVisit?.('right', r);
      const m = matchR[r]!;
      if (m !== -1) dfs(m);
    }
  };
  for (let u = 0; u < nLeft; u++) {
    if (matchL[u]! === -1) {
      hooks.onAlternatingStart?.(u);
      dfs(u);
    }
  }

  // 3. 最小覆盖 = 未访问左点 ∪ 已访问右点
  const leftCover = new Set<number>();
  for (let i = 0; i < nLeft; i++) {
    if (!visitedL[i]) leftCover.add(i);
  }
  const rightCover = new Set<number>();
  for (let i = 0; i < nRight; i++) {
    if (visitedR[i]) rightCover.add(i);
  }

  const result: BvcResult = {
    leftCover,
    rightCover,
    size: leftCover.size + rightCover.size,
    matchingSize,
  };
  hooks.onDone?.(result);
  return result;
}

/** 验证一个点覆盖是否合法：每条边至少有一端在覆盖里。 */
export function isValidCover(
  nLeft: number,
  _nRight: number,
  edges: readonly BvcEdge[],
  leftCover: Set<number>,
  rightCover: Set<number>,
): boolean {
  void nLeft;
  for (const e of edges) {
    if (!leftCover.has(e.from) && !rightCover.has(e.to)) return false;
  }
  return true;
}
