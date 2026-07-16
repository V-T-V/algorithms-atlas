// =============================================================================
// 数独求解 Sudoku Solver · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 标准 9×9 数独：每行、每列、每个 3×3 宫内的数字 1-9 各出现一次。
// 经典回溯：找到第一个空格，依次尝试 1-9，合法则填入并递归，失败则回溯。
// =============================================================================

/** 9×9 棋盘：0 表示空格，1-9 表示已填数字。 */
export type Board = number[][];

export const SIZE = 9;
export const BOX = 3;

/** 算法执行过程中的事件钩子。任一可选。 */
export interface SudokuHooks {
  /** 在 (row,col) 尝试填入数字 value（填入前）。 */
  onPlace?: (row: number, col: number, value: number) => void;
  /** 在 (row,col) 撤销填入（回溯）。 */
  onBacktrack?: (row: number, col: number, value: number) => void;
  /** 求解完成（传入解出的棋盘快照）。 */
  onSolved?: (board: Board) => void;
}

/**
 * 求解一个 9×9 数独（回溯）。
 *
 * @param board 初始棋盘（0 表空格）；会被克隆，不入参原地修改
 * @param hooks 可选事件钩子
 * @returns 解出的棋盘，若无解返回 null
 */
export function sudokuSolver(
  board: ReadonlyArray<ReadonlyArray<number>>,
  hooks: SudokuHooks = {},
): Board | null {
  // 深拷贝棋盘
  const b: Board = board.map((row) => [...row]);
  // 记录哪些格子是题目给定的（不可改）
  const _given: boolean[][] = b.map((row) => row.map((v) => v !== 0));

  /** 判断在 (row,col) 填 value 是否合法。 */
  const isSafe = (row: number, col: number, value: number): boolean => {
    for (let i = 0; i < SIZE; i++) {
      if (b[row]![i] === value) return false; // 同行
      if (b[i]![col] === value) return false; // 同列
    }
    const br = Math.floor(row / BOX) * BOX;
    const bc = Math.floor(col / BOX) * BOX;
    for (let r = br; r < br + BOX; r++) {
      for (let c = bc; c < bc + BOX; c++) {
        if (b[r]![c] === value) return false; // 同宫
      }
    }
    return true;
  };

  /** 找到下一个空格，返回其坐标；无空格返回 null。 */
  const findEmpty = (): { row: number; col: number } | null => {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (b[r]![c] === 0) return { row: r, col: c };
      }
    }
    return null;
  };

  const solve = (): boolean => {
    const empty = findEmpty();
    if (empty === null) {
      hooks.onSolved?.(b.map((row) => [...row]));
      return true; // 全部填满，得解
    }
    const { row, col } = empty;
    for (let value = 1; value <= 9; value++) {
      if (isSafe(row, col, value)) {
        hooks.onPlace?.(row, col, value);
        b[row]![col] = value;
        if (solve()) return true;
        b[row]![col] = 0; // 回溯
        hooks.onBacktrack?.(row, col, value);
      }
    }
    return false;
  };

  const ok = solve();
  return ok ? b : null;
}

/** 校验一个 9×9 棋盘是否是合法的数独解（每行/列/宫均含 1-9）。 */
export function isValidSolution(board: Board): boolean {
  if (board.length !== SIZE) return false;
  const full = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  // 行
  for (let r = 0; r < SIZE; r++) {
    if (board[r]!.length !== SIZE) return false;
    if (!sameSet(new Set(board[r]), full)) return false;
  }
  // 列
  for (let c = 0; c < SIZE; c++) {
    const col = new Set<number>();
    for (let r = 0; r < SIZE; r++) col.add(board[r]![c]!);
    if (!sameSet(col, full)) return false;
  }
  // 宫
  for (let br = 0; br < SIZE; br += BOX) {
    for (let bc = 0; bc < SIZE; bc += BOX) {
      const box = new Set<number>();
      for (let r = br; r < br + BOX; r++) {
        for (let c = bc; c < bc + BOX; c++) box.add(board[r]![c]!);
      }
      if (!sameSet(box, full)) return false;
    }
  }
  return true;
}

function sameSet(a: Set<number>, b: Set<number>): boolean {
  if (a.size !== b.size) return false;
  for (const v of a) if (!b.has(v)) return false;
  return true;
}
