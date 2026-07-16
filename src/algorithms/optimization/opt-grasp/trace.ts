import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { grasp } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const D = [
    [0, 2, 9, 10],
    [1, 0, 6, 4],
    [15, 7, 0, 8],
    [6, 3, 12, 0],
  ];
  rec.begin({ zh: 'GRASP TSP', en: 'GRASP TSP' }).commit();
  const r = grasp(D, 4, 20, 0.3, {
    onConclude: (b, c) =>
      rec
        .begin({ zh: `best cost=${c}`, en: '' })
        .setBars([{ value: c, role: 'final' as BarRole }])
        .commit(),
  });
  void r;
  return rec.build();
}
