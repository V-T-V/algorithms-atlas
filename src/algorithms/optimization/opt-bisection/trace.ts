import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bisection } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const f = (x: number) => x * x - 2;
  rec.begin({ zh: '二分求 √2 (x²-2=0)', en: 'Bisection sqrt 2' }).commit();
  const root = bisection(f, 0, 2, 1e-6, 30, {
    onIter: (i, a, b, c, fc) =>
      rec
        .begin({
          zh: `${i}: [${a.toFixed(4)},${b.toFixed(4)}] c=${c.toFixed(4)} f=${fc.toFixed(4)}`,
          en: `${i}: [${a.toFixed(4)},${b.toFixed(4)}] c=${c.toFixed(4)} f=${fc.toFixed(4)}`,
        })
        .setBars([{ value: c, role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: `根 ≈ ${root.toFixed(6)}`, en: `root ≈ ${root.toFixed(6)}` })
    .setBars([{ value: root, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
