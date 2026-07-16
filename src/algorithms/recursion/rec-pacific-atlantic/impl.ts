// 太平洋大西洋水流 · 实现

export interface PaHooks {
  onVisit?: (r: number, c: number, ocean: 'pacific' | 'atlantic') => void;
  onBoth?: (r: number, c: number) => void;
}

const DIRS: ReadonlyArray<readonly [number, number]> = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
] as const;

/** 求能同时流向两洋的坐标列表。 */
export function pacificAtlantic(heights: number[][], hooks: PaHooks = {}): Array<[number, number]> {
  const rows = heights.length;
  if (rows === 0) return [];
  const cols = heights[0]!.length;
  const paci = Array.from({ length: rows }, () => new Array<boolean>(cols).fill(false));
  const atlan = Array.from({ length: rows }, () => new Array<boolean>(cols).fill(false));

  // 从某海域边界反向 DFS
  const dfs = (r: number, c: number, visited: boolean[][], ocean: 'pacific' | 'atlantic'): void => {
    visited[r]![c] = true;
    hooks.onVisit?.(r, c, ocean);
    for (const [dr, dc] of DIRS) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      if (visited[nr]![nc]) continue;
      // 反向：下一格高度 >= 当前格才能流回（等价正向从高到低）
      if (heights[nr]![nc]! < heights[r]![c]!) continue;
      dfs(nr, nc, visited, ocean);
    }
  };

  // 太平洋：第 0 行、第 0 列
  for (let c = 0; c < cols; c++) dfs(0, c, paci, 'pacific');
  for (let r = 0; r < rows; r++) dfs(r, 0, paci, 'pacific');
  // 大西洋：末行、末列
  for (let c = 0; c < cols; c++) dfs(rows - 1, c, atlan, 'atlantic');
  for (let r = 0; r < rows; r++) dfs(r, cols - 1, atlan, 'atlantic');

  // 求交集
  const result: Array<[number, number]> = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (paci[r]![c] && atlan[r]![c]) {
        result.push([r, c]);
        hooks.onBoth?.(r, c);
      }
    }
  }
  return result;
}
