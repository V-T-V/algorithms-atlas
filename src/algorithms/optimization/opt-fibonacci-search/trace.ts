import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { fibonacciSearch } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const f = (x: number) => (x - 3) * (x - 3);
  rec.begin({ zh: '斐波那契搜索 min (x-3)²', en: 'Fibonacci min (x-3)²' }).commit();
  const r = fibonacciSearch(f, 0, 10, 15, {
    onIter: (i, a, b) =>
      rec
        .begin({
          zh: `${i}: [${a.toFixed(4)},${b.toFixed(4)}]`,
          en: `${i}: [${a.toFixed(4)},${b.toFixed(4)}]`,
        })
        .setBars([{ value: (a + b) / 2, role: 'pivot' as BarRole }])
        .commit(),
  });
  rec.begin({ zh: `min ≈ ${r.toFixed(6)}`, en: `min ≈ ${r.toFixed(6)}` }).commit();
  return rec.build();
}
