// 数独求解器 · 实现

export type Board = number[][]; // 0 表示空格

export interface SudokuHooks {
  onPlace?: (r: number, c: number, digit: number) => void;
  onBacktrack?: (r: number, c: number) => void;
  onSolved?: () => void;
}

/** 检查在 (r,c) 放 digit 是否合法。 */
export function isValid(board: Board, r: number, c: number, digit: number): boolean {
  for (let i = 0; i < 9; i++) {
    if (board[r]![i] === digit) return false;
    if (board[i]![c] === digit) return false;
  }
  const br = Math.floor(r / 3) * 3;
  const bc = Math.floor(c / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[br + i]![bc + j] === digit) return false;
    }
  }
  return true;
}

/** 回溯求解，返回是否成功。 */
export function solveSudoku(board: Board, hooks: SudokuHooks = {}): boolean {
  // 找第一个空格
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r]![c] === 0) {
        for (let d = 1; d <= 9; d++) {
          if (isValid(board, r, c, d)) {
            board[r]![c] = d;
            hooks.onPlace?.(r, c, d);
            if (solveSudoku(board, hooks)) return true;
            board[r]![c] = 0;
            hooks.onBacktrack?.(r, c);
          }
        }
        return false; // 1-9 都不行
      }
    }
  }
  hooks.onSolved?.();
  return true; // 没有空格
}

/** 不修改原棋盘，返回解的副本。 */
export function solveSudokuCopy(board: Board, hooks: SudokuHooks = {}): Board | null {
  const copy: Board = board.map((row) => [...row]);
  if (solveSudoku(copy, hooks)) return copy;
  return null;
}
