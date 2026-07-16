import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { snakesAndLadders } from './impl.ts';
export const DEFAULT_BOARD = [
  [-1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1],
  [-1, 35, -1, -1, 13, -1],
  [-1, -1, -1, -1, -1, -1],
  [-1, 15, -1, -1, -1, -1],
];
export function buildTrace(board: number[][] = DEFAULT_BOARD.map((r) => [...r])): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '蛇梯棋', en: 'Snakes and ladders' }).commit();
  const m = snakesAndLadders(board, {
    onMove: (p) =>
      rec
        .begin({ zh: '到达 ' + p, en: 'reach ' + p })
        .setAux([{ label: 'pos', value: String(p), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '最少步数 = ' + m, en: 'min moves = ' + m })
    .setAux([{ label: 'moves', value: String(m), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
