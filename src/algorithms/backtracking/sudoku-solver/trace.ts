// =============================================================================
// 数独求解 · 录制帧序列
// 通过 sudokuSolver 的钩子把回溯过程录成 Frame[]。
// 可视化：setGrid 渲染 9×9 棋盘。
//   role: 给定='default'，试填='compare'，回溯='warn'，求解确定='final'。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sudokuSolver, type Board, type SudokuHooks } from './impl.ts';

/** 一个部分填好的 9×9 数独（0 = 空）。 */
export const DEFAULT_INPUT: Board = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

/** 由棋盘 + 高亮信息生成网格快照。 */
function renderBoard(
  board: ReadonlyArray<ReadonlyArray<number>>,
  given: ReadonlyArray<ReadonlyArray<boolean>>,
  highlight: { row: number; col: number; role: BarRole } | null,
): Cell[][] {
  return board.map((row, r) =>
    row.map((v, c) => {
      let role: BarRole = 'default';
      if (!given[r]![c]! && v !== 0) role = 'pivot'; // 已试填的非给定格
      if (highlight && highlight.row === r && highlight.col === c) role = highlight.role;
      return { v: v === 0 ? undefined : String(v), role };
    }),
  );
}

/** 录制演示帧序列。 */
export function buildTrace(input: Board = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  // 当前棋盘镜像
  const board: Board = input.map((row) => [...row]);
  const given: boolean[][] = input.map((row) => row.map((v) => v !== 0));

  rec
    .begin({ zh: '初始数独（0 表空格）', en: 'Initial sudoku (0 = empty)' })
    .setGrid(renderBoard(board, given, null))
    .commit();

  const hooks: SudokuHooks = {
    onPlace: (row, col, value) => {
      board[row]![col] = value;
      rec
        .begin({
          zh: `(${row + 1},${col + 1}) 试填 ${value}`,
          en: `(${row + 1},${col + 1}) try ${value}`,
        })
        .setGrid(renderBoard(board, given, { row, col, role: 'compare' }))
        .commit();
    },
    onBacktrack: (row, col, value) => {
      board[row]![col] = 0;
      rec
        .begin({
          zh: `(${row + 1},${col + 1})=${value} 走不通，回溯清空`,
          en: `(${row + 1},${col + 1})=${value} dead-ends; backtrack`,
        })
        .setGrid(renderBoard(board, given, { row, col, role: 'warn' }))
        .commit();
    },
    onSolved: (solved) => {
      // 终态：全部 final，给定格保持 default 区分
      rec
        .begin({ zh: '求解完成', en: 'Solved' })
        .setGrid(solved.map((row) => row.map((v) => ({ v: String(v), role: 'final' as BarRole }))))
        .commit();
    },
  };

  sudokuSolver(input, hooks);

  return rec.build();
}
