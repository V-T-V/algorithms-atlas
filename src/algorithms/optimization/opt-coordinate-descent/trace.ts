import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { coordinateDescent } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const f = (x: readonly number[]) => (x[0]! - 1) ** 2 + (x[1]! - 2) ** 2;
  rec.begin({ zh: '坐标下降 (x-1)²+(y-2)²', en: 'Coord descent' }).commit();
  const r = coordinateDescent(f, [0, 0], 50, 0.2, {
    onIter: (i, d, x, fx) =>
      rec
        .begin({ zh: `${i} dim${d}: [${x.map((v) => v.toFixed(2)).join(',')}]`, en: `${i} d${d}` })
        .setBars([{ value: fx, role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({
      zh: `min ≈ [${r.x.map((v) => v.toFixed(2)).join(',')}] f=${r.fx.toFixed(4)}`,
      en: 'min',
    })
    .commit();
  return rec.build();
}
