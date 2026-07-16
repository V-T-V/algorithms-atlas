import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sqp } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'SQP min x² s.t. x=2', en: 'SQP' }).commit();
  const r = sqp(
    (x) => x * x,
    (x) => [2 * x],
    (x) => x - 2,
    () => 1,
    0,
    30,
    {
      onIter: (i, x, v) =>
        rec
          .begin({ zh: `${i}: x=${x.toFixed(3)} v=${v.toExponential(1)}`, en: '' })
          .setBars([{ value: v, role: 'pivot' as BarRole }])
          .commit(),
    },
  );
  rec.begin({ zh: `x=${r.x.toFixed(3)}`, en: '' }).commit();
  return rec.build();
}
