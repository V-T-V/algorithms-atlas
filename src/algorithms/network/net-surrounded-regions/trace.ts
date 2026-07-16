import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { solveSurrounded } from './impl.ts';
export const DEFAULT_BOARD = [
  ['X', 'X', 'X', 'X'],
  ['X', 'O', 'O', 'X'],
  ['X', 'X', 'O', 'X'],
  ['X', 'O', 'X', 'X'],
];
export function buildTrace(board: string[][] = DEFAULT_BOARD.map((r) => [...r])): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '被围绕的区域', en: 'Surrounded regions' }).commit();
  solveSurrounded(board, {
    onFlip: (r, c) =>
      rec
        .begin({ zh: `翻转 (${r},${c})`, en: `flip (${r},${c})` })
        .setGrid(board.map((row) => row.map((v) => ({ v, role: 'default' as const }))))
        .commit(),
  });
  rec
    .begin({ zh: '完成', en: 'Done' })
    .setGrid(board.map((row) => row.map((v) => ({ v, role: 'final' as const }))))
    .commit();
  return rec.build();
}
