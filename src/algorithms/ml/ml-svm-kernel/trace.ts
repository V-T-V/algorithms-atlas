// 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { kernelPerceptron, kernelPredict } from './impl.ts';
const X = [
  [0, 0],
  [0, 1],
  [1, 0],
  [3, 3],
  [4, 4],
  [3, 4],
];
const y = [-1, -1, -1, 1, 1, 1];
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const v = (function () {
    const m = kernelPerceptron(X, y, 2, 1, 10);
    return X.filter((x, i) => kernelPredict(m, x) === y[i]).length;
  })();
  rec
    .begin({ zh: '核感知器训练完成', en: 'kernel perceptron done' })
    .setAux([{ label: '值', value: String(v), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
