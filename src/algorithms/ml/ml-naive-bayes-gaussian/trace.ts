// 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { trainGaussianNB, predictGaussianNB } from './impl.ts';
const X = [
  [1, 1],
  [1.1, 0.9],
  [5, 5],
  [5.1, 4.9],
];
const y = [0, 0, 1, 1];
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const v = (function () {
    const m = trainGaussianNB(X, y);
    return X.filter((x, i) => predictGaussianNB(m, x) === y[i]).length;
  })();
  rec
    .begin({ zh: '高斯NB 训练完成', en: 'Gaussian NB done' })
    .setAux([{ label: '值', value: String(v), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
