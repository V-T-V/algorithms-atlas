import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { regulaFalsi } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '试位法求 √2', en: 'Regula falsi sqrt 2' }).commit();
  const r = regulaFalsi((x) => x * x - 2, 0, 2, 1e-9, 30, {
    onIter: (i, a, b, c) =>
      rec
        .begin({ zh: `${i}: c=${c.toFixed(8)}`, en: `${i}: c=${c.toFixed(8)}` })
        .setBars([{ value: c, role: 'pivot' as BarRole }])
        .commit(),
  });
  rec.begin({ zh: `根 ≈ ${r.toFixed(10)}`, en: `root ≈ ${r.toFixed(10)}` }).commit();
  return rec.build();
}
