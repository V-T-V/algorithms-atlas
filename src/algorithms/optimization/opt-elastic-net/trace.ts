import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { elasticNet } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const X = [
    [1, 0],
    [2, 0],
    [0, 1],
    [0, 2],
  ];
  const y = [2, 4, 3, 6];
  rec.begin({ zh: '弹性网', en: 'Elastic net' }).commit();
  const w = elasticNet(X, y, 0.1, 0.5, 50, {
    onIter: (i, ww) =>
      rec
        .begin({ zh: `${i}: w=[${ww.map((v) => v.toFixed(3)).join(',')}]`, en: `${i}` })
        .setBars(ww.map((v) => ({ value: v, role: 'pivot' as BarRole })))
        .commit(),
  });
  rec.begin({ zh: 'w=[' + w.map((v) => v.toFixed(3)).join(',') + ']', en: 'done' }).commit();
  return rec.build();
}
