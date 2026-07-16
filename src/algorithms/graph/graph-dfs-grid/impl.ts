// =============================================================================
// 网格 DFS（岛屿计数）· 纯算法实现
// 对每个未访问 '1' 做 DFS 染色整片连通区域。
// =============================================================================

export interface GridDfsHooks {
  onVisit?: (r: number, c: number) => void;
  onIsland?: (seedR: number, seedC: number, size: number) => void;
  onResult?: (count: number) => void;
}

const DIRS: ReadonlyArray<[number, number]> = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

export function numIslands(grid: string[][], hooks: GridDfsHooks = {}): number {
  const m = grid.length;
  if (m === 0) {
    hooks.onResult?.(0);
    return 0;
  }
  const n = grid[0]!.length;
  const visited: boolean[][] = Array.from({ length: m }, () => new Array<boolean>(n).fill(false));
  let count = 0;
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r]![c] === '1' && !visited[r]![c]) {
        const size = dfsIsland(grid, r, c, visited, hooks);
        count++;
        hooks.onIsland?.(r, c, size);
      }
    }
  }
  hooks.onResult?.(count);
  return count;
}

function dfsIsland(
  grid: string[][],
  sr: number,
  sc: number,
  visited: boolean[][],
  hooks: GridDfsHooks,
): number {
  const m = grid.length;
  const n = grid[0]!.length;
  const stack: Array<[number, number]> = [[sr, sc]];
  visited[sr]![sc] = true;
  let size = 0;
  while (stack.length > 0) {
    const [r, c] = stack.pop()!;
    size++;
    hooks.onVisit?.(r, c);
    for (const [dr, dc] of DIRS) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
      if (visited[nr]![nc] || grid[nr]![nc] !== '1') continue;
      visited[nr]![nc] = true;
      stack.push([nr, nc]);
    }
  }
  return size;
}
