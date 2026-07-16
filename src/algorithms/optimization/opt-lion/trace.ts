import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lion } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Lion 优化器', en: 'Lion' }).commit();
  const r = lion((x) => [...x], [4, -3], 0.1, 0.9, 0.99, 60, {
    onIter: (i, x, fx) =>
      rec
        .begin({ zh: `${i}: f=${fx.toFixed(4)}`, en: '' })
        .setBars([{ value: fx, role: 'pivot' as BarRole }])
        .commit(),
  });
  rec.begin({ zh: `f=${r.fx.toFixed(6)}`, en: '' }).commit();
  return rec.build();
}
