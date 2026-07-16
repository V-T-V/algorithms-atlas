export interface AreaHooks {
  onArea?: (r: number, c: number, area: number) => void;
  onResult?: (max: number) => void;
}
export function maxAreaOfIsland(grid: number[][], hooks: AreaHooks = {}): number {
  const R = grid.length;
  if (R === 0) return 0;
  const C = grid[0]!.length;
  const dfs = (r: number, c: number): number => {
    if (r < 0 || r >= R || c < 0 || c >= C || grid[r]![c] !== 1) return 0;
    grid[r]![c] = 0;
    return 1 + dfs(r + 1, c) + dfs(r - 1, c) + dfs(r, c + 1) + dfs(r, c - 1);
  };
  let max = 0;
  for (let r = 0; r < R; r++)
    for (let c = 0; c < C; c++)
      if (grid[r]![c] === 1) {
        const a = dfs(r, c);
        max = Math.max(max, a);
        hooks.onArea?.(r, c, a);
      }
  hooks.onResult?.(max);
  return max;
}
