import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { solveSudoku } from './impl.ts';
export const DEFAULT_BOARD = [
  ['5', '3', '.', '.', '7', '.', '.', '.', '.'],
  ['6', '.', '.', '1', '9', '5', '.', '.', '.'],
  ['.', '9', '8', '.', '.', '.', '.', '6', '.'],
  ['8', '.', '.', '.', '6', '.', '.', '.', '3'],
  ['4', '.', '.', '8', '.', '3', '.', '.', '1'],
  ['7', '.', '.', '.', '2', '.', '.', '.', '6'],
  ['.', '6', '.', '.', '.', '.', '2', '8', '.'],
  ['.', '.', '.', '4', '1', '9', '.', '.', '5'],
  ['.', '.', '.', '.', '8', '.', '.', '7', '9'],
];
export function buildTrace(board: string[][] = DEFAULT_BOARD.map((r) => [...r])): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '解数独', en: 'Sudoku solver' }).commit();
  let steps = 0;
  solveSudoku(board, {
    onTry: (r, c, v) => {
      steps++;
      if (steps <= 12)
        rec
          .begin({ zh: '试 (' + r + ',' + c + ')=' + v, en: 'try (' + r + ',' + c + ')=' + v })
          .setGrid(rec.gridFrom(board.map((row) => row.map((x) => x))))
          .commit();
    },
  });
  rec
    .begin({ zh: '完成', en: 'Done' })
    .setGrid(rec.gridFrom(board.map((row) => row.map((x) => x))))
    .commit();
  return rec.build();
}
