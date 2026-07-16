import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { goldenSection } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const f = (x: number) => (x - 2) * (x - 2) + 1;
  rec.begin({ zh: '黄金分割 min (x-2)²+1', en: 'Golden section min (x-2)²+1' }).commit();
  const r = goldenSection(f, -5, 5, 1e-6, 30, {
    onIter: (i, a, b) =>
      rec
        .begin({
          zh: `${i}: [${a.toFixed(4)},${b.toFixed(4)}]`,
          en: `${i}: [${a.toFixed(4)},${b.toFixed(4)}]`,
        })
        .setBars([{ value: (a + b) / 2, role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: `min ≈ ${r.toFixed(6)}`, en: `min ≈ ${r.toFixed(6)}` })
    .setBars([{ value: r, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
