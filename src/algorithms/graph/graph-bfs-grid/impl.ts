// =============================================================================
// 网格 BFS · 纯算法实现
// 4 连通方向，BFS 求最短步数。
// =============================================================================

export interface GridBfsHooks {
  onVisit?: (r: number, c: number, dist: number) => void;
  onResult?: (dist: number) => void;
}

const DIRS: ReadonlyArray<[number, number]> = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

export function gridBfs(
  grid: number[][],
  sr: number,
  sc: number,
  tr: number,
  tc: number,
  hooks: GridBfsHooks = {},
): number {
  const m = grid.length;
  if (m === 0) {
    hooks.onResult?.(-1);
    return -1;
  }
  const n = grid[0]!.length;
  if (n === 0 || grid[sr]![sc] !== 0) {
    hooks.onResult?.(-1);
    return -1;
  }
  if (sr === tr && sc === tc) {
    hooks.onVisit?.(sr, sc, 0);
    hooks.onResult?.(0);
    return 0;
  }
  const visited: boolean[][] = Array.from({ length: m }, () => new Array<boolean>(n).fill(false));
  const queue: Array<[number, number, number]> = [[sr, sc, 0]];
  visited[sr]![sc] = true;
  hooks.onVisit?.(sr, sc, 0);
  while (queue.length > 0) {
    const [r, c, d] = queue.shift()!;
    for (const [dr, dc] of DIRS) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
      if (visited[nr]![nc]) continue;
      if (grid[nr]![nc] !== 0) continue;
      visited[nr]![nc] = true;
      if (nr === tr && nc === tc) {
        hooks.onVisit?.(nr, nc, d + 1);
        hooks.onResult?.(d + 1);
        return d + 1;
      }
      hooks.onVisit?.(nr, nc, d + 1);
      queue.push([nr, nc, d + 1]);
    }
  }
  hooks.onResult?.(-1);
  return -1;
}
