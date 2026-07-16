// =============================================================================
// 石子蔓延 · 纯算法实现（多源 BFS）
// =============================================================================

export interface SpreadStoneHooks {
  onVisit?: (r: number, c: number, dist: number) => void;
  onResult?: (maxDist: number) => void;
}

const DIRS: ReadonlyArray<[number, number]> = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

export function spreadStones(grid: number[][], hooks: SpreadStoneHooks = {}): number {
  const m = grid.length;
  if (m === 0) {
    hooks.onResult?.(0);
    return 0;
  }
  const n = grid[0]!.length;
  if (n === 0) {
    hooks.onResult?.(0);
    return 0;
  }
  const dist: number[][] = Array.from({ length: m }, () => new Array<number>(n).fill(-1));
  const queue: Array<[number, number, number]> = [];
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r]![c]! > 0) {
        dist[r]![c] = 0;
        queue.push([r, c, 0]);
      }
    }
  }
  while (queue.length > 0) {
    const [r, c, d] = queue.shift()!;
    for (const [dr, dc] of DIRS) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
      if (dist[nr]![nc] !== -1) continue;
      dist[nr]![nc] = d + 1;
      hooks.onVisit?.(nr, nc, d + 1);
      queue.push([nr, nc, d + 1]);
    }
  }
  let maxD = 0;
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (dist[r]![c]! > maxD) maxD = dist[r]![c]!;
    }
  }
  hooks.onResult?.(maxD);
  return maxD;
}
