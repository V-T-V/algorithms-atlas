export interface IslandHooks {
  onIsland?: (r: number, c: number) => void;
  onResult?: (n: number) => void;
}
export function numIslands(grid: string[][], hooks: IslandHooks = {}): number {
  const R = grid.length;
  if (R === 0) return 0;
  const C = grid[0]!.length;
  let count = 0;
  const sink = (r: number, c: number) => {
    if (r < 0 || r >= R || c < 0 || c >= C || grid[r]![c] !== '1') return;
    grid[r]![c] = '0';
    sink(r + 1, c);
    sink(r - 1, c);
    sink(r, c + 1);
    sink(r, c - 1);
  };
  for (let r = 0; r < R; r++)
    for (let c = 0; c < C; c++)
      if (grid[r]![c] === '1') {
        count++;
        hooks.onIsland?.(r, c);
        sink(r, c);
      }
  hooks.onResult?.(count);
  return count;
}
