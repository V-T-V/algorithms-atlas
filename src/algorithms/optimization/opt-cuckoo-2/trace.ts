import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { cuckoo } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const f = (x: readonly number[]) => x[0]! * x[0]! + x[1]! * x[1]!;
  rec.begin({ zh: '布谷鸟搜索', en: 'Cuckoo' }).commit();
  const r = cuckoo(f, 2, 15, 40, 0.25, {
    onIter: (i, b, bf) =>
      rec
        .begin({ zh: `${i}: best f=${bf.toFixed(4)}`, en: '' })
        .setBars([{ value: bf, role: 'pivot' as BarRole }])
        .commit(),
  });
  rec.begin({ zh: `best f=${r.bestFit.toFixed(4)}`, en: '' }).commit();
  return rec.build();
}
