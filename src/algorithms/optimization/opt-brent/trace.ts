import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { brentRoot } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Brent 求 √2', en: 'Brent sqrt 2' }).commit();
  const r = brentRoot((x) => x * x - 2, 0, 2, 1e-9, 30, {
    onIter: (i, b) =>
      rec
        .begin({ zh: `${i}: b=${b.toFixed(8)}`, en: `${i}: b=${b.toFixed(8)}` })
        .setBars([{ value: b, role: 'pivot' as BarRole }])
        .commit(),
  });
  rec.begin({ zh: `根 ≈ ${r.toFixed(10)}`, en: `root ≈ ${r.toFixed(10)}` }).commit();
  return rec.build();
}
