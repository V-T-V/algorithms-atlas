// =============================================================================
// 迷宫最短路径回溯 · 纯算法实现
// grid 中 1 表示通路、0 表示墙。DFS 回溯找从 start 到 goal 的最短路径。
// =============================================================================
export interface BtMazeShortestHooks {
  onStep?: (r: number, c: number, path: Array<[number, number]>) => void;
  onBacktrack?: (r: number, c: number) => void;
  onReach?: (path: Array<[number, number]>) => void;
  onBest?: (length: number) => void;
}

export interface BtMazeShortestResult {
  length: number;
  path: Array<[number, number]>;
}

const DIRS: Array<[number, number]> = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

export function btMazeShortest(
  grid: readonly (readonly number[])[],
  start: [number, number],
  goal: [number, number],
  hooks: BtMazeShortestHooks = {},
): BtMazeShortestResult {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const visited = Array.from({ length: rows }, () => new Array<boolean>(cols).fill(false));
  const path: Array<[number, number]> = [];
  let bestLen = Infinity;
  let bestPath: Array<[number, number]> = [];

  const dfs = (r: number, c: number): void => {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return;
    if (grid[r]![c]! === 0) return;
    if (visited[r]![c]!) return;
    path.push([r, c]);
    visited[r]![c]! = true;
    hooks.onStep?.(r, c, [...path]);

    if (r === goal[0] && c === goal[1]) {
      hooks.onReach?.([...path]);
      if (path.length < bestLen) {
        bestLen = path.length;
        bestPath = path.map((p) => [...p] as [number, number]);
        hooks.onBest?.(bestLen);
      }
    } else {
      for (const [dr, dc] of DIRS) {
        dfs(r + dr, c + dc);
      }
    }

    path.pop();
    visited[r]![c]! = false;
    hooks.onBacktrack?.(r, c);
  };

  dfs(start[0], start[1]);

  return {
    length: bestLen === Infinity ? -1 : bestLen,
    path: bestPath,
  };
}
