import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { newtonRaphson } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const f = (x: number) => x * x - 2;
  const df = (x: number) => 2 * x;
  rec.begin({ zh: '牛顿求 √2', en: 'Newton sqrt 2' }).commit();
  const r = newtonRaphson(f, df, 1.5, 1e-9, 20, {
    onIter: (i, x, fx) =>
      rec
        .begin({
          zh: `${i}: x=${x.toFixed(8)} f=${fx.toExponential(2)}`,
          en: `${i}: x=${x.toFixed(8)} f=${fx.toExponential(2)}`,
        })
        .setBars([{ value: x, role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: `根 ≈ ${r.toFixed(10)}`, en: `root ≈ ${r.toFixed(10)}` })
    .setBars([{ value: r, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
