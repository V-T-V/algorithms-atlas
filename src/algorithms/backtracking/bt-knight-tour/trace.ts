import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { knightsTour } from './impl.ts';
export const DEFAULT_N = 5;
export function buildTrace(n: number = DEFAULT_N): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: n + '×' + n + ' 骑士周游', en: n + 'x' + n + ' knight tour' }).commit();
  let steps = 0;
  const b = knightsTour(n, 0, 0, {
    onMove: (r, c, step) => {
      steps++;
      if (steps % 3 === 0)
        rec
          .begin({
            zh: '步 ' + step + ' 在 (' + r + ',' + c + ')',
            en: 'step ' + step + ' at (' + r + ',' + c + ')',
          })
          .setGrid(
            rec.gridFrom(
              Array.from({ length: n }, (_, i) =>
                Array.from({ length: n }, (_, j) => String(b?.[i]?.[j] ?? -1)),
              ),
            ),
          )
          .commit();
    },
  });
  rec
    .begin({ zh: b ? '完成' : '无解', en: b ? 'Done' : 'No tour' })
    .setGrid(rec.gridFrom(b ? b.map((row) => row.map((v) => String(v))) : []))
    .commit();
  return rec.build();
}
