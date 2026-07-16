import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hllDemo } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const items = [1, 2, 3, 1, 2, 4, 5, 1, 6, 7];
  rec.begin({ zh: 'HyperLogLog b=4', en: 'HyperLogLog b=4' }).commit();
  const est = hllDemo(items, {
    onEstimate: (e) =>
      rec
        .begin({
          zh: `估计基数 ${e} (真实 ${new Set(items).size})`,
          en: `estimate ${e} (actual ${new Set(items).size})`,
        })
        .setBars([{ value: e, role: 'final' as BarRole }])
        .commit(),
  });
  void est;
  return rec.build();
}
