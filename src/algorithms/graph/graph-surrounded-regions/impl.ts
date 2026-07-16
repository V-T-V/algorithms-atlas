// =============================================================================
// 被围绕的区域 · 纯算法实现
// 从边界 'O' 标记为 '#'，剩余 'O' 翻 'X'，再还原 '#'。
// =============================================================================

export interface SurroundedHooks {
  onMark?: (r: number, c: number) => void;
  onFlip?: (r: number, c: number) => void;
  onResult?: (flips: number) => void;
}

const DIRS: ReadonlyArray<[number, number]> = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

export function solveSurrounded(board: string[][], hooks: SurroundedHooks = {}): number {
  const m = board.length;
  if (m === 0) {
    hooks.onResult?.(0);
    return 0;
  }
  const n = board[0]!.length;
  if (n === 0) {
    hooks.onResult?.(0);
    return 0;
  }
  // 从边界 'O' 标记
  const mark = (sr: number, sc: number): void => {
    if (board[sr]![sc] !== 'O') return;
    const stack: Array<[number, number]> = [[sr, sc]];
    board[sr]![sc] = '#';
    while (stack.length > 0) {
      const [r, c] = stack.pop()!;
      hooks.onMark?.(r, c);
      for (const [dr, dc] of DIRS) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
        if (board[nr]![nc] === 'O') {
          board[nr]![nc] = '#';
          stack.push([nr, nc]);
        }
      }
    }
  };
  for (let r = 0; r < m; r++) {
    mark(r, 0);
    mark(r, n - 1);
  }
  for (let c = 0; c < n; c++) {
    mark(0, c);
    mark(m - 1, c);
  }
  // 翻转与还原
  let flips = 0;
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (board[r]![c] === 'O') {
        board[r]![c] = 'X';
        flips++;
        hooks.onFlip?.(r, c);
      } else if (board[r]![c] === '#') {
        board[r]![c] = 'O';
      }
    }
  }
  hooks.onResult?.(flips);
  return flips;
}
