// =============================================================================
// 迷宫逃脱 · 纯算法实现（BFS）
// =============================================================================

export interface MazePoint {
  r: number;
  c: number;
}

export interface MazeHooks {
  onVisit?: (p: MazePoint, dist: number) => void;
  onDone?: (found: boolean, dist: number) => void;
}

const isWall = (ch: string): boolean => ch === '#' || ch === '1' || ch === 'W';

export function escapeMaze(maze: ReadonlyArray<readonly string[]>, hooks: MazeHooks = {}): number {
  const rows = maze.length;
  const cols = maze[0]?.length ?? 0;
  let start: MazePoint | null = null;
  let end: MazePoint | null = null;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const ch = maze[r]![c]!;
      if (ch === 'S') start = { r, c };
      if (ch === 'E') end = { r, c };
    }
  }
  if (!start || !end) {
    hooks.onDone?.(false, Infinity);
    return -1;
  }
  const dist: number[][] = Array.from({ length: rows }, () => new Array<number>(cols).fill(-1));
  dist[start.r]![start.c] = 0;
  const queue: MazePoint[] = [start];
  hooks.onVisit?.(start, 0);
  const dirs = [
    { r: -1, c: 0 },
    { r: 1, c: 0 },
    { r: 0, c: -1 },
    { r: 0, c: 1 },
  ];
  while (queue.length > 0) {
    const cur = queue.shift()!;
    const d = dist[cur.r]![cur.c]!;
    if (cur.r === end.r && cur.c === end.c) {
      hooks.onDone?.(true, d);
      return d;
    }
    for (const dir of dirs) {
      const nr = cur.r + dir.r;
      const nc = cur.c + dir.c;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      const ch = maze[nr]![nc]!;
      if (isWall(ch) || dist[nr]![nc] !== -1) continue;
      dist[nr]![nc] = d + 1;
      hooks.onVisit?.({ r: nr, c: nc }, d + 1);
      queue.push({ r: nr, c: nc });
    }
  }
  hooks.onDone?.(false, Infinity);
  return -1;
}
