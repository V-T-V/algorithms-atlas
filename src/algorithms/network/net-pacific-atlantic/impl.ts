export interface PaHooks {
  onCell?: (r: number, c: number) => void;
  onResult?: (cells: Array<[number, number]>) => void;
}
export function pacificAtlantic(heights: number[][], hooks: PaHooks = {}): Array<[number, number]> {
  const R = heights.length;
  if (R === 0) return [];
  const C = heights[0]!.length;
  const pac = Array.from({ length: R }, () => new Array<boolean>(C).fill(false));
  const atl = Array.from({ length: R }, () => new Array<boolean>(C).fill(false));
  const dfs = (r: number, c: number, visited: boolean[][], prev: number) => {
    if (r < 0 || r >= R || c < 0 || c >= C || visited[r]![c] || heights[r]![c]! < prev) return;
    visited[r]![c] = true;
    dfs(r + 1, c, visited, heights[r]![c]!);
    dfs(r - 1, c, visited, heights[r]![c]!);
    dfs(r, c + 1, visited, heights[r]![c]!);
    dfs(r, c - 1, visited, heights[r]![c]!);
  };
  for (let r = 0; r < R; r++) {
    dfs(r, 0, pac, 0);
    dfs(r, C - 1, atl, 0);
  }
  for (let c = 0; c < C; c++) {
    dfs(0, c, pac, 0);
    dfs(R - 1, c, atl, 0);
  }
  const res: Array<[number, number]> = [];
  for (let r = 0; r < R; r++)
    for (let c = 0; c < C; c++)
      if (pac[r]![c] && atl[r]![c]) {
        res.push([r, c]);
        hooks.onCell?.(r, c);
      }
  hooks.onResult?.(res);
  return res;
}
