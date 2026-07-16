// 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { trainMultinomialNB, predictMultinomialNB } from './impl.ts';
const X = [
  [2, 1, 0],
  [1, 0, 2],
  [0, 2, 1],
  [5, 0, 0],
];
const y = [0, 1, 1, 0];
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const v = (function () {
    const m = trainMultinomialNB(X, y);
    return X.filter((x, i) => predictMultinomialNB(m, x) === y[i]).length;
  })();
  rec
    .begin({ zh: '多项式NB 训练完成', en: 'Multinomial NB done' })
    .setAux([{ label: '值', value: String(v), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
