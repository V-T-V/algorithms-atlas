import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { batchGradientDescent } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const X = [[1], [2], [3], [4]];
  const y = [2, 4, 6, 8];
  rec.begin({ zh: 'BGD 线性回归', en: 'BGD linear regression' }).commit();
  const r = batchGradientDescent(X, y, 0.1, 50, {
    onIter: (i, w, loss) =>
      rec
        .begin({
          zh: `${i}: w=[${w.map((v) => v.toFixed(3)).join(',')}] loss=${loss.toFixed(4)}`,
          en: `${i}: loss=${loss.toFixed(4)}`,
        })
        .setBars([{ value: loss, role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({
      zh: `w=[${r.w.map((v) => v.toFixed(3)).join(',')}] loss=${r.loss.toFixed(4)}`,
      en: 'done',
    })
    .commit();
  return rec.build();
}
