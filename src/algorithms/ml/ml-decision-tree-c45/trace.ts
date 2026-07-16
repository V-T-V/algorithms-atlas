// 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildC45, predictC45 } from './impl.ts';
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
    const t = buildC45(X, y);
    return X.filter((x, i) => predictC45(t, x) === y[i]).length;
  })();
  rec
    .begin({ zh: 'C4.5 构建完成', en: 'C4.5 built' })
    .setAux([{ label: '值', value: String(v), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
