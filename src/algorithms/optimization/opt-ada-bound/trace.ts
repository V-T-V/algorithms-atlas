import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { adabound } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'AdaBound', en: 'AdaBound' }).commit();
  const r = adabound((x) => [...x], [3, -4], 0.01, 0.9, 0.999, 0.1, 0.001, 60, {
    onIter: (i, x, fx) =>
      rec
        .begin({ zh: `${i}: f=${fx.toFixed(4)}`, en: '' })
        .setBars([{ value: fx, role: 'pivot' as BarRole }])
        .commit(),
  });
  rec.begin({ zh: `f=${r.fx.toFixed(6)}`, en: '' }).commit();
  return rec.build();
}
