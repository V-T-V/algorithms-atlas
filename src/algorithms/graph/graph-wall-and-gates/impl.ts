// =============================================================================
// 墙与门 · 纯算法实现（多源 BFS）
// 所有门同时入队，按层扩展填距离。
// =============================================================================

export const INF = 2147483647;

export interface WallAndGatesHooks {
  onVisit?: (r: number, c: number, dist: number) => void;
  onResult?: () => void;
}

const DIRS: ReadonlyArray<[number, number]> = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

export function wallsAndGates(rooms: number[][], hooks: WallAndGatesHooks = {}): void {
  const m = rooms.length;
  if (m === 0) {
    hooks.onResult?.();
    return;
  }
  const n = rooms[0]!.length;
  if (n === 0) {
    hooks.onResult?.();
    return;
  }
  const queue: Array<[number, number, number]> = [];
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (rooms[r]![c] === 0) queue.push([r, c, 0]);
    }
  }
  while (queue.length > 0) {
    const [r, c, d] = queue.shift()!;
    for (const [dr, dc] of DIRS) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
      if (rooms[nr]![nc] !== INF) continue;
      rooms[nr]![nc] = d + 1;
      hooks.onVisit?.(nr, nc, d + 1);
      queue.push([nr, nc, d + 1]);
    }
  }
  hooks.onResult?.();
}
