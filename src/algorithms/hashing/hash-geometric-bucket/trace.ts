import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { geometricBucket } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const vals = [1, 2, 3, 8, 16, 100, 0.5, 1024];
  rec.begin({ zh: '几何分桶', en: 'Geometric bucket' }).commit();
  const c = geometricBucket(vals, {
    onConclude: (m) => {
      const entries = [...m.entries()].sort((a, b) => a[0] - b[0]);
      rec
        .begin({ zh: `桶数 ${m.size}`, en: `${m.size} buckets` })
        .setBars(entries.map((e) => ({ value: e[1], role: 'final' as BarRole })))
        .commit();
    },
  });
  void c;
  return rec.build();
}
