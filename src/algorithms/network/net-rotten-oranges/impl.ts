export interface OrangeHooks {
  onRot?: (r: number, c: number, minute: number) => void;
  onResult?: (minutes: number) => void;
}
export function orangesRotting(grid: number[][], hooks: OrangeHooks = {}): number {
  const R = grid.length,
    C = grid[0]!.length;
  const q: Array<[number, number, number]> = [];
  let fresh = 0;
  for (let r = 0; r < R; r++)
    for (let c = 0; c < C; c++) {
      if (grid[r]![c] === 2) q.push([r, c, 0]);
      else if (grid[r]![c] === 1) fresh++;
    }
  let minutes = 0;
  while (q.length) {
    const [r, c, m] = q.shift()!;
    minutes = Math.max(minutes, m);
    for (const [dr, dc] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const nr = r + dr!,
        nc = c + dc!;
      if (nr < 0 || nr >= R || nc < 0 || nc >= C || grid[nr]![nc] !== 1) continue;
      grid[nr]![nc] = 2;
      fresh--;
      hooks.onRot?.(nr, nc, m + 1);
      q.push([nr, nc, m + 1]);
    }
  }
  const r = fresh === 0 ? minutes : -1;
  hooks.onResult?.(r);
  return r;
}
