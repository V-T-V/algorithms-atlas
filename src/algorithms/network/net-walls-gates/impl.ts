export interface GateHooks {
  onFill?: (r: number, c: number, d: number) => void;
  onResult?: (grid: number[][]) => void;
}
const INF = 2147483647;
export function wallsAndGates(grid: number[][], hooks: GateHooks = {}): number[][] {
  const R = grid.length;
  if (R === 0) return grid;
  const C = grid[0]!.length;
  const q: Array<[number, number]> = [];
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) if (grid[r]![c] === 0) q.push([r, c]);
  while (q.length) {
    const [r, c] = q.shift()!;
    for (const [dr, dc] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const nr = r + dr!,
        nc = c + dc!;
      if (nr < 0 || nr >= R || nc < 0 || nc >= C || grid[nr]![nc] !== INF) continue;
      grid[nr]![nc] = grid[r]![c]! + 1;
      hooks.onFill?.(nr, nc, grid[nr]![nc]!);
      q.push([nr, nc]);
    }
  }
  hooks.onResult?.(grid);
  return grid;
}
