export interface GsHooks {
  onVisit?: (r: number, c: number, d: number) => void;
  onResult?: (len: number) => void;
}
export function shortestPathBinaryMatrix(grid: number[][], hooks: GsHooks = {}): number {
  const n = grid.length;
  if (grid[0]![0] === 1 || grid[n - 1]![n - 1] === 1) {
    hooks.onResult?.(-1);
    return -1;
  }
  const visited = Array.from({ length: n }, () => new Array(n).fill(false));
  visited[0]![0] = true;
  const q: Array<[number, number, number]> = [[0, 0, 1]];
  while (q.length) {
    const [r, c, d] = q.shift()!;
    if (r === n - 1 && c === n - 1) {
      hooks.onResult?.(d);
      return d;
    }
    for (const [dr, dc] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ]) {
      const nr = r + dr!,
        nc = c + dc!;
      if (nr < 0 || nr >= n || nc < 0 || nc >= n || grid[nr]![nc] === 1 || visited[nr]![nc])
        continue;
      visited[nr]![nc] = true;
      hooks.onVisit?.(nr, nc, d + 1);
      q.push([nr, nc, d + 1]);
    }
  }
  hooks.onResult?.(-1);
  return -1;
}
