// =============================================================================
// 蛇梯棋 · 纯算法实现（BFS）
// =============================================================================

export interface SnakeLadderHooks {
  onVisit?: (square: number, rolls: number) => void;
  onRoll?: (from: number, to: number) => void;
  onDone?: (rolls: number) => void;
}

/** 把方格编号（1-based）映射到 (r,c) 取出 board 值。 */
function getCell(board: ReadonlyArray<readonly number[]>, n: number, square: number): number {
  const idx = square - 1; // 0-based
  const rFromBottom = Math.floor(idx / n);
  const row = n - 1 - rFromBottom;
  let col = idx % n;
  if (rFromBottom % 2 === 1) col = n - 1 - col; // 偶数行（从下数）反向
  return board[row]![col]!;
}

export function snakesAndLadders(
  board: ReadonlyArray<readonly number[]>,
  hooks: SnakeLadderHooks = {},
): number {
  const n = board.length;
  const target = n * n;
  if (target <= 1) {
    hooks.onDone?.(0);
    return 0;
  }
  const dist = new Array<number>(target + 1).fill(-1);
  dist[1] = 0;
  const queue: number[] = [1];
  hooks.onVisit?.(1, 0);
  while (queue.length > 0) {
    const cur = queue.shift()!;
    for (let roll = 1; roll <= 6; roll++) {
      let nxt = cur + roll;
      if (nxt > target) break;
      const cell = getCell(board, n, nxt);
      if (cell !== -1) nxt = cell; // 梯/蛇
      hooks.onRoll?.(cur, nxt);
      if (dist[nxt] === -1) {
        dist[nxt] = dist[cur]! + 1;
        hooks.onVisit?.(nxt, dist[nxt]!);
        if (nxt === target) {
          hooks.onDone?.(dist[nxt]!);
          return dist[nxt]!;
        }
        queue.push(nxt);
      }
    }
  }
  hooks.onDone?.(-1);
  return -1;
}
