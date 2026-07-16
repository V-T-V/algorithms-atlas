// 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ovrSvm, predictOvr } from './impl.ts';
const X = [
  [1, 1],
  [1, 2],
  [5, 5],
  [6, 6],
  [1, 6],
  [2, 6],
];
const labels = [0, 0, 1, 1, 2, 2];
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const v = (function () {
    const m = ovrSvm(X, labels, 3);
    return X.filter((x, i) => predictOvr(m, x) === labels[i]).length;
  })();
  rec
    .begin({ zh: 'OvR 多分类完成', en: 'OvR multiclass done' })
    .setAux([{ label: '值', value: String(v), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
