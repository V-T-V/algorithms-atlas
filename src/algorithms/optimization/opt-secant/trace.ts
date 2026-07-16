import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { secantMethod } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '割线法求 √2', en: 'Secant sqrt 2' }).commit();
  const r = secantMethod((x) => x * x - 2, 1, 2, 1e-9, 20, {
    onIter: (i, x, fx) =>
      rec
        .begin({ zh: `${i}: x=${x.toFixed(8)}`, en: `${i}: x=${x.toFixed(8)}` })
        .setBars([{ value: x, role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: `根 ≈ ${r.toFixed(10)}`, en: `root ≈ ${r.toFixed(10)}` })
    .setBars([{ value: r, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
