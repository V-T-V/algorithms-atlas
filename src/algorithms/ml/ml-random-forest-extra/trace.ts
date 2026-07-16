// 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { extraTrees, predictExtra } from './impl.ts';
const X = [
  [1, 1],
  [1, 2],
  [5, 5],
  [6, 6],
];
const y = [0, 0, 1, 1];
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const v = (function () {
    const m = extraTrees(X, y, 15);
    return X.filter((x, i) => predictExtra(m, x) === y[i]).length;
  })();
  rec
    .begin({ zh: 'Extra Trees 训练完成', en: 'Extra Trees done' })
    .setAux([{ label: '值', value: String(v), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
