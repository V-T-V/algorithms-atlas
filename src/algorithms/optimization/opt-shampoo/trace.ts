import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { shampoo } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Shampoo', en: 'Shampoo' }).commit();
  const w = shampoo((x) => [...x], [3, -2, 1], 0.1, 1e-6, 60, {
    onIter: (i, x, fx) =>
      rec
        .begin({ zh: `${i}: f=${fx.toFixed(4)}`, en: '' })
        .setBars([{ value: fx, role: 'pivot' as BarRole }])
        .commit(),
  });
  rec.begin({ zh: `f=0.5|x|² 收敛`, en: '' }).commit();
  void w;
  return rec.build();
}
