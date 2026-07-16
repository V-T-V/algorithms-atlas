import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { slopeTrick } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const a = [5, 3, 4, 1, 2];
  rec.begin({ zh: `Slope Trick: [${a.join(',')}]`, en: `Slope Trick: [${a.join(',')}]` }).commit();
  const cost = slopeTrick(a, {
    onConclude: (c) =>
      rec
        .begin({ zh: `最小代价 ${c}`, en: `min cost ${c}` })
        .setBars([{ value: c, role: 'final' as BarRole }])
        .commit(),
  });
  void cost;
  return rec.build();
}
