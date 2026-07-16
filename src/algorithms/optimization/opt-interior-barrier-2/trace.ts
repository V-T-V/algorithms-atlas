import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { interiorBarrier } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '内点法 min (x+1)² s.t. x>=0', en: 'Interior point' }).commit();
  const r = interiorBarrier(
    (x) => (x + 1) * (x + 1),
    (x) => 2 * (x + 1),
    5,
    0,
    1,
    40,
    {
      onIter: (i, mu, x) =>
        rec
          .begin({ zh: `${i}: mu=${mu.toExponential(1)} x=${x.toFixed(4)}`, en: '' })
          .setBars([{ value: x, role: 'pivot' as BarRole }])
          .commit(),
    },
  );
  rec.begin({ zh: `min x=${r.x.toFixed(4)} f=${r.fx.toFixed(4)}`, en: '' }).commit();
  return rec.build();
}
