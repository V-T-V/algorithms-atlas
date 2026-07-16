// =============================================================================
// Floyd-Warshall 全源最短路 · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 基于邻接矩阵，三重循环动态规划：dp[k][i][j] = min(dp[k-1][i][j], dp[k-1][i][k]+dp[k-1][k][j])
// =============================================================================

/** 距离矩阵输入。matrix[i][j] 为 i→j 的直接边权；i==j 为 0；无边为 Infinity。 */
export type DistMatrix = number[][];

/** Floyd-Warshall 执行过程中的事件钩子。任一可选。 */
export interface FloydWarshallHooks {
  /** 进入以 k 为中转节点的迭代。 */
  onIterate?: (k: number) => void;
  /** 考察一对 (i,j)，当前中转 k；relaxed 为本次是否发生松弛。 */
  onRelax?: (
    i: number,
    j: number,
    k: number,
    oldDist: number,
    newDist: number,
    relaxed: boolean,
  ) => void;
  /** 以 k 为中转的迭代结束。 */
  onIterateEnd?: (k: number) => void;
}

export interface FloydWarshallResult {
  /** 全源最短距离矩阵 dist[i][j]；不可达为 Infinity。 */
  dist: number[][];
  /** 后继节点矩阵 next[i][j]：i→j 最短路径上 i 之后的下一节点（用于回溯路径）。 */
  next: Array<Array<number | null>>;
}

/**
 * Floyd-Warshall 全源最短路径。
 *
 * @param matrix 邻接矩阵（n×n）；对角线为 0，无边为 Infinity
 * @param hooks 可选事件钩子
 * @returns 距离矩阵 dist 与路径回溯矩阵 next
 */
export function floydWarshall(
  matrix: ReadonlyArray<ReadonlyArray<number>>,
  hooks: FloydWarshallHooks = {},
): FloydWarshallResult {
  const n = matrix.length;
  // 深拷贝距离矩阵
  const dist: number[][] = matrix.map((row) => [...row]);
  // next[i][j]：i→j 最短路径上 i 之后的下一节点
  const next: Array<Array<number | null>> = [];
  for (let i = 0; i < n; i++) {
    const row: Array<number | null> = [];
    for (let j = 0; j < n; j++) {
      row.push(i === j ? null : Number.isFinite(dist[i]![j]!) ? j : null);
    }
    next.push(row);
  }

  for (let k = 0; k < n; k++) {
    hooks.onIterate?.(k);
    for (let i = 0; i < n; i++) {
      const dik = dist[i]![k]!;
      if (!Number.isFinite(dik)) continue;
      for (let j = 0; j < n; j++) {
        const oldDist = dist[i]![j]!;
        const viaK = dik + dist[k]![j]!;
        const relaxed = viaK < oldDist;
        hooks.onRelax?.(i, j, k, oldDist, relaxed ? viaK : oldDist, relaxed);
        if (relaxed) {
          dist[i]![j] = viaK;
          next[i]![j] = next[i]![k] ?? null;
        }
      }
    }
    hooks.onIterateEnd?.(k);
  }

  return { dist, next };
}

/** 由 next 矩阵回溯 i→j 的最短路径节点序列；不可达返回 null。 */
export function reconstructPath(
  next: ReadonlyArray<ReadonlyArray<number | null>>,
  i: number,
  j: number,
): number[] | null {
  if (next[i]![j] === null && i !== j) return null;
  const path: number[] = [i];
  let guard = 0;
  let cur = i;
  while (cur !== j) {
    const nxt = next[cur]![j];
    if (nxt === null || nxt === undefined) return null;
    cur = nxt;
    path.push(cur);
    guard++;
    if (guard > next.length * next.length + 1) return null; // 防环
  }
  return path;
}
