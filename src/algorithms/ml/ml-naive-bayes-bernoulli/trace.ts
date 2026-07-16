// 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { trainBernoulliNB, predictBernoulliNB } from './impl.ts';
const X = [
  [1, 0, 1],
  [0, 1, 0],
  [1, 1, 1],
  [0, 0, 1],
];
const y = [0, 1, 0, 1];
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const v = (function () {
    const m = trainBernoulliNB(X, y);
    return X.filter((x, i) => predictBernoulliNB(m, x) === y[i]).length;
  })();
  rec
    .begin({ zh: '伯努利NB 训练完成', en: 'Bernoulli NB done' })
    .setAux([{ label: '值', value: String(v), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
