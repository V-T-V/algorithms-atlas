import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyDualPivot } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const arr = [5, 2, 8, 1, 9, 3, 7, 4, 6];
  const samples = [2, 5, 8];
  rec.begin({ zh: '贪心双枢轴', en: 'Greedy dual pivot' }).commit();
  const best = greedyDualPivot(arr, samples, {
    onPick: (p1, p2, v) =>
      rec
        .begin({
          zh: `p1=${p1} p2=${p2} 方差=${v.toFixed(1)}`,
          en: `p1=${p1} p2=${p2} var=${v.toFixed(1)}`,
        })
        .setBars([{ value: v, role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: `最佳枢轴 (${best[0]},${best[1]})`, en: `best pivots (${best[0]},${best[1]})` })
    .setAux([
      { label: 'p1', value: String(best[0]), role: 'final' as BarRole },
      { label: 'p2', value: String(best[1]), role: 'final' as BarRole },
    ])
    .commit();
  return rec.build();
}
