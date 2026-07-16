import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { totalNQueens } from './impl.ts';
export const DEFAULT_N = 4;
export function buildTrace(n: number = DEFAULT_N): Frame[] {
  const rec = new TraceRecorder();
  const placed: Array<[number, number]> = [];
  rec.begin({ zh: n + ' 皇后', en: n + '-Queens' }).commit();
  totalNQueens(n, {
    onPlace: (r, c) => {
      placed.push([r, c]);
      rec
        .begin({ zh: '放 (' + r + ',' + c + ')', en: 'place (' + r + ',' + c + ')' })
        .setGrid(
          rec.gridFrom(
            Array.from({ length: n }, (_, i) =>
              Array.from({ length: n }, (_, j) =>
                placed.some(([pr, pc]) => pr === i && pc === j) ? 'Q' : '.',
              ),
            ),
          ),
        )
        .commit();
    },
  });
  rec.begin({ zh: '完成', en: 'Done' }).commit();
  return rec.build();
}
