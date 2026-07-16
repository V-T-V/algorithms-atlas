import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { kalman1d } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const z = [1.2, 1.9, 3.1, 3.8, 5.2];
  rec.begin({ zh: '卡尔曼滤波', en: 'Kalman' }).commit();
  const est = kalman1d(z, 0, 1, 0.1, 1, {
    onStep: (i, zi, x) =>
      rec
        .begin({ zh: `${i}: z=${zi.toFixed(2)} x=${x.toFixed(2)}`, en: '' })
        .setBars([
          { value: zi, role: 'pivot' as BarRole },
          { value: x, role: 'final' as BarRole },
        ])
        .commit(),
  });
  rec.begin({ zh: `估计 [${est.map((v) => v.toFixed(2)).join(',')}]`, en: '' }).commit();
  return rec.build();
}
