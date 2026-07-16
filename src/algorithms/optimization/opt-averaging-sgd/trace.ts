import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { averagedSgd } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  let k = 0;
  const sampler = () => {
    k++;
    return { grad: [k % 2 === 0 ? 1 : -1] };
  };
  rec.begin({ zh: 'ASGD', en: 'ASGD' }).commit();
  const avg = averagedSgd(sampler, 1, 0.05, 50, {
    onConclude: (a) =>
      rec
        .begin({ zh: `avg=${a.map((v) => v.toFixed(3)).join(',')}`, en: 'done' })
        .setBars(a.map((v) => ({ value: v, role: 'final' as BarRole })))
        .commit(),
  });
  void avg;
  return rec.build();
}
