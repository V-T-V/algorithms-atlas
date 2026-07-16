import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { whale } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const f = (x: readonly number[]) => x[0]! * x[0]! + x[1]! * x[1]!;
  rec.begin({ zh: '鲸鱼优化', en: 'WOA' }).commit();
  const r = whale(f, 2, 20, 40, {
    onIter: (i, b, bf) =>
      rec
        .begin({ zh: `${i}: best f=${bf.toFixed(4)}`, en: '' })
        .setBars([{ value: bf, role: 'pivot' as BarRole }])
        .commit(),
  });
  rec.begin({ zh: `best f=${r.bestFit.toFixed(4)}`, en: '' }).commit();
  return rec.build();
}
