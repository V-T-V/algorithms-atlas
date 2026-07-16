// =============================================================================
// N 皇后（N-Queens）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface NQueensHooks {
  /** 在第 row 行、第 col 列尝试放置皇后（放置前）。 */
  onPlace?: (row: number, col: number) => void;
  /** 第 row 行、第 col 列的皇后被回溯撤销。 */
  onBacktrack?: (row: number, col: number) => void;
  /** 找到一个解：返回该解中每行皇后的列号（solution[row] = col）。 */
  onSolution?: (solution: number[]) => void;
}

/**
 * 求解 N 皇后问题：在 N×N 棋盘上放置 N 个互不攻击的皇后。
 * 使用经典回溯：逐行放置，每行恰放一个皇后，递归尝试每一列。
 *
 * @param n 棋盘边长（皇后数）
 * @param hooks 可选的事件钩子
 * @param options 选项：maxSolutions 限制收集的解数量（默认全部）
 * @returns 所有解，每个解是长度为 n 的数组，`solution[row] = col`。
 */
export function nQueens(
  n: number,
  hooks: NQueensHooks = {},
  options: { maxSolutions?: number } = {},
): number[][] {
  const { maxSolutions = Infinity } = options;
  const solutions: number[][] = [];
  if (n <= 0) return solutions;

  // board[row] = col（该行皇后的列号），-1 表示尚未放置
  const board: number[] = new Array<number>(n).fill(-1);
  // 用三个集合做 O(1) 冲突检测
  const colUsed = new Set<number>();
  const diag1 = new Set<number>(); // 主对角线 row - col
  const diag2 = new Set<number>(); // 副对角线 row + col

  const safe = (row: number, col: number): boolean =>
    !colUsed.has(col) && !diag1.has(row - col) && !diag2.has(row + col);

  const place = (row: number, col: number): void => {
    board[row] = col;
    colUsed.add(col);
    diag1.add(row - col);
    diag2.add(row + col);
  };

  const remove = (row: number): void => {
    const col = board[row]!;
    board[row] = -1;
    colUsed.delete(col);
    diag1.delete(row - col);
    diag2.delete(row + col);
  };

  const solve = (row: number): void => {
    if (row === n) {
      // 找到一个解
      const solution = [...board];
      solutions.push(solution);
      hooks.onSolution?.(solution);
      return;
    }
    for (let col = 0; col < n; col++) {
      if (safe(row, col)) {
        hooks.onPlace?.(row, col);
        place(row, col);
        solve(row + 1);
        remove(row);
        hooks.onBacktrack?.(row, col);
      }
      if (solutions.length >= maxSolutions) return;
    }
  };

  solve(0);
  return solutions;
}

/** 计数：N 皇后共有多少个解（不收集解，更省内存）。 */
export function countNQueens(n: number): number {
  return nQueens(n).length;
}
