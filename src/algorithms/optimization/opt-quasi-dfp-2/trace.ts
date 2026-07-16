import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { dfp } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'DFP 拟牛顿', en: 'DFP' }).commit();
  const r = dfp((x) => [...x], [3, -4], 60, {
    onIter: (i, x, fx) =>
      rec
        .begin({ zh: `${i}: f=${fx.toFixed(4)}`, en: '' })
        .setBars([{ value: fx, role: 'pivot' as BarRole }])
        .commit(),
  });
  rec.begin({ zh: `f=${r.fx.toFixed(6)}`, en: '' }).commit();
  return rec.build();
}
