import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { solveSudokuCopy, type Board } from './impl.ts';

export const DEFAULT_BOARD: Board = [
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

export function buildTrace(opts: { board?: Board } = {}): Frame[] {
  const board = opts.board ?? DEFAULT_BOARD;
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `初始化数独`, en: `Init sudoku` })
    .setGrid(
      board.map((row) =>
        row.map((v) => ({
          v: v === 0 ? '.' : v,
          role: (v === 0 ? 'default' : 'sorted') as BarRole,
        })),
      ),
    )
    .commit();

  let placeCount = 0;
  let backtrackCount = 0;
  solveSudokuCopy(board, {
    onPlace: (r, c, d) => {
      placeCount++;
      if (placeCount > 60) return; // 限制帧数
      rec
        .begin({ zh: `放 (${r},${c})=${d}`, en: `place (${r},${c})=${d}` })
        .setGrid(
          board.map((row, ri) =>
            row.map((v, ci) => ({
              v: v === 0 ? '.' : v,
              role: (ri === r && ci === c ? 'swap' : v !== 0 ? 'sorted' : 'default') as BarRole,
            })),
          ),
        )
        .setAux([{ label: '放置', value: `${d}@(${r},${c})`, role: 'compare' as BarRole }])
        .commit();
    },
    onBacktrack: (_r, _c) => {
      backtrackCount++;
    },
  });

  const result = solveSudokuCopy(board);
  rec
    .begin({
      zh: `完成：放置${placeCount} 回溯${backtrackCount}`,
      en: `Done: ${placeCount} placed, ${backtrackCount} backtracks`,
    })
    .setGrid(
      result
        ? result.map((row) => row.map((v) => ({ v, role: 'final' as BarRole })))
        : board.map((row) => row.map((v) => ({ v, role: 'default' as BarRole }))),
    )
    .setAux([{ label: '可解', value: result ? '是' : '否', role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
