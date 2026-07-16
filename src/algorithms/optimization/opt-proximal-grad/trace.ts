import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { proximalGradient } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const X = [
    [1, 0],
    [2, 0],
    [3, 1],
  ];
  const y = [2, 4, 6];
  rec.begin({ zh: '近端梯度 Lasso', en: 'Proximal Lasso' }).commit();
  const w = proximalGradient(X, y, 0.5, 0.05, 80, {
    onIter: (i, ww, loss) =>
      rec
        .begin({ zh: `${i}: loss=${loss.toFixed(3)}`, en: '' })
        .setBars([{ value: loss, role: 'pivot' as BarRole }])
        .commit(),
  });
  rec.begin({ zh: `w=[${w.map((v) => v.toFixed(3)).join(',')}`, en: '' }).commit();
  return rec.build();
}
