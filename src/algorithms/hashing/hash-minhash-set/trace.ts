import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { minHashSimilarity } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const A = new Set([1, 2, 3, 4, 5]);
  const B = new Set([3, 4, 5, 6, 7]);
  rec.begin({ zh: 'MinHash k=20', en: 'MinHash k=20' }).commit();
  const est = minHashSimilarity(A, B, 20, {
    onConclude: (e, a) =>
      rec
        .begin({
          zh: `估计 ${e.toFixed(2)} 实际 ${a.toFixed(2)}`,
          en: `est ${e.toFixed(2)} actual ${a.toFixed(2)}`,
        })
        .setBars([
          { value: e, role: 'final' as BarRole },
          { value: a, role: 'default' as BarRole },
        ])
        .commit(),
  });
  void est;
  return rec.build();
}
