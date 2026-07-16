// =============================================================================
// 滑动谜题 · 纯算法实现（BFS）
// =============================================================================

export interface SlidingPuzzleHooks {
  onVisit?: (state: string, dist: number) => void;
  onResult?: (moves: number) => void;
}

// 2×3 中位置 i 的可交换邻居位置
const NEIGHBORS: ReadonlyArray<readonly number[]> = [
  [1, 3],
  [0, 2, 4],
  [1, 5],
  [0, 4],
  [1, 3, 5],
  [2, 4],
];

export function slidingPuzzle(board: number[][], hooks: SlidingPuzzleHooks = {}): number {
  const target = '123450';
  const start = board.map((row) => row.join('')).join('');
  if (start === target) {
    hooks.onVisit?.(start, 0);
    hooks.onResult?.(0);
    return 0;
  }
  const visited = new Set<string>([start]);
  const queue: Array<[string, number]> = [[start, 0]];
  while (queue.length > 0) {
    const [state, dist] = queue.shift()!;
    const zero = state.indexOf('0');
    for (const nb of NEIGHBORS[zero]!) {
      const arr = state.split('');
      const tmp = arr[zero]!;
      arr[zero] = arr[nb]!;
      arr[nb] = tmp;
      const next = arr.join('');
      if (visited.has(next)) continue;
      if (next === target) {
        hooks.onVisit?.(next, dist + 1);
        hooks.onResult?.(dist + 1);
        return dist + 1;
      }
      visited.add(next);
      hooks.onVisit?.(next, dist + 1);
      queue.push([next, dist + 1]);
    }
  }
  hooks.onResult?.(-1);
  return -1;
}
