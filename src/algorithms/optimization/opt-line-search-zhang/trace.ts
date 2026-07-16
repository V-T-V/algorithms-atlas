import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { zhangHagerLineSearch } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Zhang-Hager 线搜索', en: 'ZH line search' }).commit();
  const r = zhangHagerLineSearch(
    (x) => (x - 3) * (x - 3),
    (x) => 2 * (x - 3),
    0,
    40,
    0.1,
    {
      onIter: (i, x, fx) =>
        rec
          .begin({ zh: `${i}: x=${x.toFixed(3)} f=${fx.toFixed(4)}`, en: '' })
          .setBars([{ value: fx, role: 'pivot' as BarRole }])
          .commit(),
    },
  );
  rec.begin({ zh: `x=${r.x.toFixed(3)} f=${r.fx.toFixed(4)}`, en: '' }).commit();
  return rec.build();
}
