import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { exponentialAveraging, type EaJob } from './impl.ts';
export const DEFAULT_INPUT = {
  jobs: [
    { id: 'A', bursts: [10, 6, 8, 5] },
    { id: 'B', bursts: [3, 4, 2, 5] },
  ] as EaJob[],
  alpha: 0.5,
};
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '指数平均 α=' + input.alpha, en: 'Exp avg α=' + input.alpha }).commit();
  const est = exponentialAveraging(input.jobs, input.alpha, {
    onEstimate: (id, e) =>
      rec
        .begin({ zh: id + ' 估计 ' + e.toFixed(2), en: id + ' est ' + e.toFixed(2) })
        .setAux([{ label: 'est', value: e.toFixed(2), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '完成', en: 'Done' })
    .setBars([...est.entries()].map(([k, v]) => ({ value: v, role: 'final' as BarRole, label: k })))
    .commit();
  return rec.build();
}
