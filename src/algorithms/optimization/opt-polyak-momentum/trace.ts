import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { polyakMomentum } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Polyak 动量 min 0.5|x|²', en: 'Polyak momentum' }).commit();
  const r = polyakMomentum((x) => [...x], [3, -4, 5], 0.05, 0.9, 50, {
    onIter: (i, x, fx) =>
      rec
        .begin({
          zh: `${i}: |${x.map((v) => v.toFixed(2)).join(',')}| f=${fx.toFixed(4)}`,
          en: `${i}`,
        })
        .setBars([{ value: fx, role: 'pivot' as BarRole }])
        .commit(),
  });
  rec.begin({ zh: `min f=${r.fx.toFixed(6)}`, en: 'done' }).commit();
  return rec.build();
}
