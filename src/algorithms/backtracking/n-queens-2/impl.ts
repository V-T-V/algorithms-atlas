// =============================================================================
// N 皇后计数（N-Queens II）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 与列举版不同：只统计解的个数，不收集解，省内存。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface NQueens2Hooks {
  /** 在第 row 行、第 col 列放置皇后。 */
  onPlace?: (row: number, col: number, board: number[]) => void;
  /** 第 row 行、第 col 列的皇后被回溯撤销。 */
  onBacktrack?: (row: number, col: number, board: number[]) => void;
  /** 找到一个解：当前累计计数。 */
  onSolution?: (count: number, board: number[]) => void;
  /** 搜索结束，给出最终总数。 */
  onDone?: (total: number) => void;
}

/**
 * 统计 N 皇后问题的解的总数（不收集解）。
 *
 * @param n 棋盘边长（皇后数）
 * @param hooks 可选的事件钩子
 * @returns 方案总数
 */
export function countNQueens(n: number, hooks: NQueens2Hooks = {}): number {
  if (n <= 0) return 0;
  let count = 0;
  const board: number[] = new Array<number>(n).fill(-1);
  const colUsed = new Set<number>();
  const diag1 = new Set<number>(); // row - col
  const diag2 = new Set<number>(); // row + col

  const safe = (row: number, col: number): boolean =>
    !colUsed.has(col) && !diag1.has(row - col) && !diag2.has(row + col);

  const solve = (row: number): void => {
    if (row === n) {
      count++;
      hooks.onSolution?.(count, [...board]);
      return;
    }
    for (let col = 0; col < n; col++) {
      if (safe(row, col)) {
        board[row] = col;
        colUsed.add(col);
        diag1.add(row - col);
        diag2.add(row + col);
        hooks.onPlace?.(row, col, [...board]);
        solve(row + 1);
        colUsed.delete(col);
        diag1.delete(row - col);
        diag2.delete(row + col);
        board[row] = -1;
        hooks.onBacktrack?.(row, col, [...board]);
      }
    }
  };

  solve(0);
  hooks.onDone?.(count);
  return count;
}

/** 已知 N 皇后的解数表（n=1..12），用于断言正确性。 */
export const N_QUEENS_COUNT: ReadonlyArray<number> = [
  0, 1, 0, 0, 2, 10, 4, 40, 92, 352, 724, 2680, 14200,
];
