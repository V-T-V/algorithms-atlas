import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { augmentedLagrangian } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  // min x² s.t. x-2=0 => x=2
  rec.begin({ zh: 'ALM min x² s.t. x=2', en: 'ALM' }).commit();
  const r = augmentedLagrangian(
    (x) => x * x,
    (x) => 2 * x,
    (x) => x - 2,
    () => 1,
    0,
    30,
    {
      onIter: (i, x, lam, v) =>
        rec
          .begin({
            zh: `${i}: x=${x.toFixed(3)} λ=${lam.toFixed(2)} v=${v.toExponential(1)}`,
            en: '',
          })
          .setBars([{ value: v, role: 'pivot' as BarRole }])
          .commit(),
    },
  );
  rec.begin({ zh: `x=${r.x.toFixed(3)} f=${r.fx.toFixed(3)}`, en: '' }).commit();
  return rec.build();
}
